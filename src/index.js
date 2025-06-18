// src/index.js
import { Client, GatewayIntentBits, Partials, Collection, Events } from 'discord.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a new Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel],
});

// Command collection
client.commands = new Collection();

// Load commands from /commands folder
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const commandModule = await import(`./commands/${file}`);
    const command = commandModule.default;
    if (command?.data && command?.execute) {
      client.commands.set(command.data.name, command);
    }
  }
} else {
  console.warn('⚠️ No /commands directory found.');
}

// Load server settings from file
const settingsPath = path.join(process.cwd(), 'serversettings.json');
let serverSettings = {};
if (fs.existsSync(settingsPath)) {
  try {
    serverSettings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
  } catch (err) {
    console.error('❌ Failed to read serversettings.json:', err);
  }
}

// Slash command interaction
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction, serverSettings);
  } catch (error) {
    console.error(`❌ Error executing ${interaction.commandName}:`, error);
    await interaction.reply({ content: 'Something went wrong while executing this command.', ephemeral: true });
  }
});

// Handle /here and /dontmore in messages
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const { commandName, channel, guildId, user } = interaction;

  if (commandName === 'here') {
    serverSettings[guildId] = { channelId: channel.id };
    await interaction.reply({ content: `✅ This channel is now set for YouTube updates.`, ephemeral: true });
  }

  if (commandName === 'dontmore') {
    delete serverSettings[guildId];
    await interaction.reply({ content: `🚫 Channel updates stopped for this server.`, ephemeral: true });
  }
});

// DM when added to a server
client.on(Events.GuildCreate, async guild => {
  const owner = await guild.fetchOwner().catch(() => null);
  if (owner) {
    try {
      await owner.send(
        `👋 Thanks for adding RedEye bot!\n\n⚠️ By default, the bot can message anywhere in the server.\nTo set a channel:\n→ Use /here in your chosen channel\n→ To stop updates, use /dontmore\n\nUse /getredeye to start YouTube creator verification.`
      );
    } catch (err) {
      console.warn(`⚠️ Could not DM owner of ${guild.name}`);
    }
  }
});

// Save settings before exit
process.on('SIGINT', () => {
  fs.writeFileSync(settingsPath, JSON.stringify(serverSettings, null, 2));
  process.exit();
});
process.on('SIGTERM', () => {
  fs.writeFileSync(settingsPath, JSON.stringify(serverSettings, null, 2));
  process.exit();
});

// Start bot
client.login(process.env.DISCORD_TOKEN);
