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
import { execSync } from 'child_process'; // 🔧 Needed for Soul Sync
import fetchAndPostLatestVideos from './utils/fetchVideos.js';
import { commitYoutubeUsersFile } from './utils/gitUtils.js';
import { scheduleJob } from 'node-schedule';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🌩️ Soul Resurrection: Pull latest `youtube-users.json` if missing or empty
try {
  const soulFile = path.join(process.cwd(), 'youtube-users.json');
  const isMissing = !fs.existsSync(soulFile);
  const isEmpty = fs.existsSync(soulFile) && fs.readFileSync(soulFile, 'utf-8').trim() === '{}';

  if (isMissing || isEmpty) {
    console.log('🌩️ [Soul Sync] Missing or empty soul, pulling from GitHub...');

    const configPath = path.join(process.cwd(), '.git/config');
    const token = process.env.GITHUB_TOKEN;
    const repoURL = `https://crazybotcreation:${token}@github.com/crazybotcreation/RedEye.git`;

    if (!fs.existsSync(configPath) || !fs.readFileSync(configPath, 'utf8').includes('origin')) {
      console.log('🔧 [Soul Sync] Git origin missing, re-adding...');
      execSync('git init');
      execSync('git remote remove origin || true');
      execSync(`git remote add origin ${repoURL}`);
    }

    execSync('git pull origin main');
    console.log('✅ [Soul Sync] Pulled latest soul (youtube-users.json)');
  }
} catch (err) {
  console.error('❌ [Soul Sync] GitHub pull failed:', err.message);
}

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
const commandsPath = path.join(process.cwd(), 'commands');
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
const buttonsPath = path.join(process.cwd(), 'buttons');
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
const modalsPath = path.join(process.cwd(), 'modals');
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

  // 🔁 Start auto video fetcher every 60s
  setInterval(() => {
    fetchAndPostLatestVideos(client).catch(console.error);
  }, 60 * 1000);

  // 🛡️ Daily backup of youtube-users.json
  scheduleJob('0 0 * * *', () => {
    const source = path.join(process.cwd(), 'youtube-users.json');
    const backupName = `backup-${new Date().toISOString().slice(0, 10)}.json`;
    const destination = path.join(process.cwd(), backupName);

    if (fs.existsSync(source)) {
      fs.copyFileSync(source, destination);
      console.log(`🛡️ Backup created: ${backupName}`);
    }
  });
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
