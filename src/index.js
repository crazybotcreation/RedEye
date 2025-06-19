// src/index.js
import {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  Partials,
  REST,
  Routes
} from 'discord.js';
import express from 'express';
import { config } from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  partials: [Partials.Channel]
});

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

// Load command files
const commandsPath = path.join(__dirname, 'commands');
console.log('🔍 Looking for commands in:', commandsPath);

let commandFiles = [];
if (fs.existsSync(commandsPath)) {
  commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  console.log('📦 Found command files:', commandFiles);
} else {
  console.log('❌ Commands path does not exist.');
}

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(`file://${filePath}`);
  if (command.default?.data && command.default?.execute) {
    client.commands.set(command.default.data.name, command.default);
  }
}

// Auto-deploy slash commands globally
const deployCommands = async () => {
  const commands = [];

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(`file://${filePath}`);
    if (command.default?.data) {
      commands.push(command.default.data.toJSON());
    }
  }

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    if (commands.length === 0) {
      console.warn('⚠️ No slash commands found to deploy.');
    } else {
      console.log('🚀 Deploying slash commands (auto)...');
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
      );
      console.log('✅ Slash commands deployed successfully.');
    }
  } catch (error) {
    console.error('❌ Failed to deploy commands:', error);
  }
};

await deployCommands();

// Load button handlers
const buttonsPath = path.join(__dirname, 'buttons');
if (fs.existsSync(buttonsPath)) {
  const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));
  for (const file of buttonFiles) {
    const filePath = path.join(buttonsPath, file);
    const button = await import(`file://${filePath}`);
    if (button.default?.customId && button.default?.execute) {
      client.buttons.set(button.default.customId, button.default);
    }
  }
}

// Load modal handlers
const modalsPath = path.join(__dirname, 'modals');
if (fs.existsSync(modalsPath)) {
  const modalFiles = fs.readdirSync(modalsPath).filter(file => file.endsWith('.js'));
  for (const file of modalFiles) {
    const filePath = path.join(modalsPath, file);
    const modal = await import(`file://${filePath}`);
    if (modal.default?.customId && modal.default?.execute) {
      client.modals.set(modal.default.customId, modal.default);
    }
  }
}

// Handle interactions
client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error executing that command!',
        ephemeral: true
      });
    }
  } else if (interaction.isButton()) {
    const handler = client.buttons.get(interaction.customId);
    if (handler) {
      try {
        await handler.execute(interaction);
      } catch (error) {
        console.error(error);
      }
    }
  } else if (interaction.isModalSubmit()) {
    const handler = client.modals.get(interaction.customId);
    if (handler) {
      try {
        await handler.execute(interaction);
      } catch (error) {
        console.error(error);
      }
    }
  }
});

// DM server owner on invite
client.on(Events.GuildCreate, async guild => {
  try {
    const owner = await guild.fetchOwner();
    owner.send(
      `👋 Thanks for adding **RedEye** bot to your server!

📌 Here's how to get started:

1️⃣ Run the command \`/here\` in the channel where you want RedEye to post YouTube updates.

2️⃣ Ask your members to use \`/getredeye\` to verify their YouTube channel (minimum 10 subscribers).

📽️ Once verified, RedEye will automatically post their new uploads in the selected channel.

Enjoy using RedEye! ❤️`
    );
  } catch (error) {
    console.error('Could not DM server owner:', error);
  }
});

client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

// Dummy Express server to keep Render alive
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('RedEye bot is alive!'));
app.listen(PORT, () => console.log(`🌐 Express listening on port ${PORT}`))
