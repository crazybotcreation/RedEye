// src/index.js
import {
  Client,
  GatewayIntentBits,
  Collection,
  Events
} from 'discord.js';
import { config } from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.commands = new Collection();
client.buttons = new Collection();

// Load slash command files
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

// Load button interaction handlers
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
} else {
  console.warn('⚠️ No /buttons directory found.');
}

// Handle interactions
client.on(Events.InteractionCreate, async interaction => {
  // Slash command
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
  }

  // Button interaction
  else if (interaction.isButton()) {
    const handler = client.buttons.get(interaction.customId);
    if (!handler) return;

    try {
      await handler.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error handling this button!',
        ephemeral: true
      });
    }
  }

  // Modal submission (handled separately if needed)
  else if (interaction.isModalSubmit()) {
    const handler = client.buttons.get(interaction.customId);
    if (!handler) return;

    try {
      await handler.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error submitting your form!',
        ephemeral: true
      });
    }
  }
});

// Welcome DM on bot add
client.on(Events.GuildCreate, async guild => {
  try {
    const owner = await guild.fetchOwner();
    owner.send(
      `👋 Thanks for adding RedEye bot!\n\n⚠️ This bot can message in any channel. Run \`/here\` to set a working channel, or \`/dontmore\` to stop updates.\n\nUse \`/getredeye\` to verify yourself as a YouTube content creator.`
    );
  } catch (error) {
    console.error('Could not send DM to the server owner:', error);
  }
});

client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN)
