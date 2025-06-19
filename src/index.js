// src/index.js
import {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  Partials
} from 'discord.js';
import { config } from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

config();

// For __dirname in ES modules
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
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  if (commandFiles.length === 0) {
    console.warn('⚠️ /commands directory is empty.');
  } else {
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = await import(`file://${filePath}`);
      if (command.default?.data && command.default?.execute) {
        client.commands.set(command.default.data.name, command.default);
      }
    }
  }
} else {
  console.warn('⚠️ No /commands directory found.');
}

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

// Send DM to user who added the bot
client.on(Events.GuildCreate, async guild => {
  try {
    const owner = await guild.fetchOwner();
    owner.send(
      `👋 Thanks for adding RedEye bot!\n\n⚠️ Warning: This bot can message in any channel. Please run the command \`/here\` to set a working channel, or \`/dontmore\` to stop updates.\n\nUse \`/getredeye\` to verify yourself as a YouTube content creator.`
    );
  } catch (error) {
    console.error('Could not send DM to the server owner:', error);
  }
});

client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN)
