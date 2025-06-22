// src/index.js
import {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  Partials,
  REST,
  Routes,
} from 'discord.js';
import express from 'express';
import { config } from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { commitYoutubeUsersFile } from './utils/gitUtils.js'; // ✅ Fixed import

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

// Load commands
const commandsPath = path.join(process.cwd(), 'src/commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    if (command.default?.data && command.default?.execute) {
      client.commands.set(command.default.data.name, command.default);
      console.log(`✅ Loaded command: ${command.default.data.name}`);
    }
  }
} else {
  console.warn('⚠️ No commands directory found.');
}

// Load buttons
const buttonsPath = path.join(process.cwd(), 'src/buttons');
if (fs.existsSync(buttonsPath)) {
  const buttonFiles = fs
    .readdirSync(buttonsPath)
    .filter((file) => file.endsWith('.js'));

  for (const file of buttonFiles) {
    const button = await import(`./buttons/${file}`);
    if (button.default?.id && button.default?.execute) {
      client.buttons.set(button.default.id, button.default);
      console.log(`✅ Loaded button: ${button.default.id}`);
    }
  }
}

// Load modals
const modalsPath = path.join(process.cwd(), 'src/modals');
if (fs.existsSync(modalsPath)) {
  const modalFiles = fs
    .readdirSync(modalsPath)
    .filter((file) => file.endsWith('.js'));

  for (const file of modalFiles) {
    const modal = await import(`./modals/${file}`);
    if (modal.default?.id && modal.default?.execute) {
      client.modals.set(modal.default.id, modal.default);
      console.log(`✅ Loaded modal: ${modal.default.id}`);
    }
  }
}

client.once(Events.ClientReady, async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  const commandsArray = [...client.commands.values()].map((cmd) => cmd.data.toJSON());

  try {
    console.log('🚀 Deploying slash commands globally...');
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: commandsArray,
    });
    console.log('✅ Slash commands deployed!');
  } catch (err) {
    console.error('❌ Error deploying slash commands:', err);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (command) await command.execute(interaction, client);
    } else if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);
      if (button) await button.execute(interaction, client);
    } else if (interaction.isModalSubmit()) {
      const modal = client.modals.get(interaction.customId);
      if (modal) await modal.execute(interaction, client);
    }
  } catch (err) {
    console.error('❌ Interaction failed:', err);
  }
});

// Web server to keep bot alive
const app = express();
app.get('/', (_, res) => res.send('Bot is alive!'));
app.listen(3000, () => {
  console.log('🌐 Listening on port 3000');
});

client.login(process.env.TOKEN);
