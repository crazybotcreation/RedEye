import 'dotenv/config';
import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Path helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create bot client
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});
client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const slashCommands = [];

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(`./commands/${file}`);

  if (command.default?.data && command.default?.execute) {
    client.commands.set(command.default.data.name, command.default);
    slashCommands.push(command.default.data.toJSON());
    console.log(`✅ Loaded command: ${command.default.data.name}`);
  } else {
    console.log(`⚠️ Skipped invalid command file: ${file}`);
  }
}

// Register slash commands
async function deployCommands() {
  try {
    if (!slashCommands.length) {
      console.log('⚠️ No slash commands found to deploy.');
      return;
    }

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: slashCommands,
    });

    console.log('✅ Global slash commands deployed.');
  } catch (error) {
    console.error('❌ Failed to deploy commands:', error);
  }
}

// Handle interaction
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Error in command ${interaction.commandName}:`, error);
    await interaction.reply({
      content: 'There was an error executing this command.',
      ephemeral: true,
    });
  }
});

// Start the bot
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Express server
const app = express();
app.get('/', (_, res) => res.send('Bot is running'));
app.listen(3000, () => {
  console.log('🌐 Express listening on port 3000');
});

// Launch
await deployCommands();
client.login(process.env.DISCORD_TOKEN);
