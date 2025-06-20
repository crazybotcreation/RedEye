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

const commandsPath = path.join(process.cwd(), 'src', 'commands');
const buttonsPath = path.join(process.cwd(), 'src', 'buttons');
const modalsPath = path.join(process.cwd(), 'src', 'modals');

console.log('🧠 God Mode Diagnostics Enabled');
console.log('📂 Current working directory:', process.cwd());
console.log('📂 __dirname:', __dirname);
console.log('📁 Commands Path:', commandsPath);
console.log('📁 Buttons Path:', buttonsPath);
console.log('📁 Modals Path:', modalsPath);

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  partials: [Partials.Channel]
});

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

// Helper for listing files
function listFiles(folderPath, type) {
  console.log(`🔍 Checking ${type} directory: ${folderPath}`);
  if (!fs.existsSync(folderPath)) {
    console.warn(`⚠️ ${type} path does NOT exist!`);
    return [];
  }
  const files = fs.readdirSync(folderPath);
  console.log(`📦 ${type} contents:`, files);
  const jsFiles = files.filter(file => file.endsWith('.js'));
  console.log(`📄 ${type} .js files:`, jsFiles);
  return jsFiles;
}

// Load commands
const commandFiles = listFiles(commandsPath, 'Commands');
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  console.log(`📥 Importing command file: ${filePath}`);
  try {
    const command = await import(`file://${filePath}`);
    if (command.default?.data && command.default?.execute) {
      client.commands.set(command.default.data.name, command.default);
      console.log(`✅ Loaded command: ${command.default.data.name}`);
    } else {
      console.warn(`⚠️ Command ${file} is missing "data" or "execute". Full content:`, command.default);
    }
  } catch (err) {
    console.error(`❌ Failed to import command ${file}:`, err);
  }
}

// Deploy commands globally
const deployCommands = async () => {
  const commands = [];

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    console.log(`📦 Preparing to deploy: ${filePath}`);
    try {
      const command = await import(`file://${filePath}`);
      if (command.default?.data) {
        commands.push(command.default.data.toJSON());
        console.log(`📤 Will deploy: /${command.default.data.name}`);
      }
    } catch (err) {
      console.error(`❌ Failed to load for deploy: ${file}`, err);
    }
  }

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    if (commands.length === 0) {
      console.warn('⚠️ No commands to deploy.');
      return;
    }

    console.log(`🚀 Deploying ${commands.length} command(s)...`);
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log(`✅ Deployed: [ ${commands.map(c => c.name).join(', ')} ]`);
  } catch (error) {
    console.error('❌ Command deploy failed:', error);
  }
};
await deployCommands();

// Load buttons
const buttonFiles = listFiles(buttonsPath, 'Buttons');
for (const file of buttonFiles) {
  const filePath = path.join(buttonsPath, file);
  console.log(`📥 Importing button: ${filePath}`);
  try {
    const button = await import(`file://${filePath}`);
    if (button.default?.customId && button.default?.execute) {
      client.buttons.set(button.default.customId, button.default);
      console.log(`✅ Loaded button: ${button.default.customId}`);
    } else {
      console.warn(`⚠️ Skipped ${file}, missing "customId" or "execute".`, button.default);
    }
  } catch (err) {
    console.error(`❌ Failed to import button ${file}:`, err);
  }
}

// Load modals
const modalFiles = listFiles(modalsPath, 'Modals');
for (const file of modalFiles) {
  const filePath = path.join(modalsPath, file);
  console.log(`📥 Importing modal: ${filePath}`);
  try {
    const modal = await import(`file://${filePath}`);
    if (modal.default?.customId && modal.default?.execute) {
      client.modals.set(modal.default.customId, modal.default);
      console.log(`✅ Loaded modal: ${modal.default.customId}`);
    } else {
      console.warn(`⚠️ Skipped ${file}, missing "customId" or "execute".`, modal.default);
    }
  } catch (err) {
    console.error(`❌ Failed to import modal ${file}:`, err);
  }
}

// Handle all interactions
client.on(Events.InteractionCreate, async interaction => {
  console.log(`📩 Received interaction: ${interaction.type}`);
  try {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) {
        console.warn(`⚠️ Unknown command: ${interaction.commandName}`);
        return;
      }
      await command.execute(interaction);
      console.log(`✅ Executed command: ${interaction.commandName}`);
    } else if (interaction.isButton()) {
      const handler = client.buttons.get(interaction.customId);
      if (!handler) {
        console.warn(`⚠️ No handler for button: ${interaction.customId}`);
        return;
      }
      await handler.execute(interaction);
      console.log(`✅ Executed button: ${interaction.customId}`);
    } else if (interaction.isModalSubmit()) {
      const handler = client.modals.get(interaction.customId);
      if (!handler) {
        console.warn(`⚠️ No handler for modal: ${interaction.customId}`);
        return;
      }
      await handler.execute(interaction);
      console.log(`✅ Executed modal: ${interaction.customId}`);
    }
  } catch (error) {
    console.error('❌ Error handling interaction:', error);
    if (interaction.reply) {
      await interaction.reply({ content: '❌ An error occurred!', ephemeral: true }).catch(() => {});
    }
  }
});

// Notify when bot joins new server
client.on(Events.GuildCreate, async guild => {
  console.log(`📥 Joined new guild: ${guild.name} (${guild.id})`);
  try {
    const owner = await guild.fetchOwner();
    await owner.send(
      `👋 Thanks for adding RedEye bot to your server!

📌 Get started:

1️⃣ Use \`/here\` in the channel where RedEye should post YouTube updates.
2️⃣ Members use \`/getredeye\` to verify their channel (min 10 subs).

Enjoy using RedEye! ❤️`
    );
  } catch (error) {
    console.error('❌ Could not DM server owner:', error);
  }
});

// Ready event
client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Keep alive Express server
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('✅ RedEye bot is alive.'));
app.listen(PORT, () => console.log(`🌐 Express listening on port ${PORT}`));

// Start bot
client.login(process.env.DISCORD_TOKEN)
