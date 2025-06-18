// src/index.js
import { Client, GatewayIntentBits, Partials, Collection, Events } from 'discord.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// Create a new client instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel],
});

client.commands = new Collection();

// Load commands from src/commands
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    if (command.default?.data && command.default?.execute) {
      client.commands.set(command.default.data.name, command.default);
    }
  }
} else {
  console.error('❌ No commands folder found. Make sure src/commands exists.');
}

// Load server-specific settings
const settingsPath = path.join(process.cwd(), 'serversettings.json');
let serverSettings = fs.existsSync(settingsPath)
  ? JSON.parse(fs.readFileSync(settingsPath, 'utf-8'))
  : {};

// Handle slash commands
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction, serverSettings);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '❌ Something went wrong!', ephemeral: true });
  }
});

// On bot added to a new server
client.on(Events.GuildCreate, async guild => {
  const owner = await guild.fetchOwner().catch(() => null);
  if (owner) {
    owner.send({
      content: `👁️‍🗨️ Thanks for adding RedEye!\n\n⚠️ The bot can send messages anywhere. To set up your YouTube content updates, use:\n\n➡️ /here – to choose a channel\n❌ /dontmore – to disable\n\nUse /getredeye to verify YouTube accounts!`,
    }).catch(() => console.log('DM failed'));
  }
});

// Save settings on exit
process.on('exit', () => {
  fs.writeFileSync(settingsPath, JSON.stringify(serverSettings, null, 2));
});

// Login
client.login(process.env.DISCORD_TOKEN);
