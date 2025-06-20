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

console.log('🗂️ Initializing folders...');
console.log('📁 Commands Path:', commandsPath);
console.log('📁 Buttons Path:', buttonsPath);
console.log('📁 Modals Path:', modalsPath);
console.log('📂 Current working directory:', process.cwd());
console.log('📂 __dirname:', __dirname);

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  partials: [Partials.Channel]
});

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

// Load commands
if (!fs.existsSync(commandsPath)) {
  console.warn('⚠️ Commands path does NOT exist!');
} else {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  if (commandFiles.length === 0) {
    console.warn('⚠️ No command files found.');
  } else {
    console.log('📄 Found command files:', commandFiles);
  }

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    try {
      const command = await import(`file://${filePath}`);
      if (command.default?.data && command.default?.execute) {
        client.commands.set(command.default.data.name, command.default);
        console.log(`✅ Loaded command: ${command.default.data.name}`);
      } else {
        console.warn(`⚠️ Skipped ${file} — missing "data" or "execute".`);
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
      try {
        const command = await import(`file://${filePath}`);
        if (command.default?.data) {
          commands.push(command.default.data.toJSON());
          console.log(`📤 Prepared to deploy: /${command.default.data.name}`);
        }
      } catch (err) {
        console.error(`❌ Failed to import during deploy: ${file}`, err);
      }
    }

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
      if (commands.length === 0) {
        console.warn('⚠️ No slash commands to deploy.');
        return;
      }

      console.log(`🚀 Deploying ${commands.length} slash command(s) to Discord...`);
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: commands
      });
      console.log(`✅ Global commands deployed: [ ${commands.map(c => c.name).join(', ')} ]`);
    } catch (error) {
      console.error('❌ Failed to deploy commands:', error);
    }
  };

  await deployCommands();
}

// Load buttons
if (!fs.existsSync(buttonsPath)) {
  console.warn('⚠️ Buttons path does NOT exist!');
} else {
  const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));
  if (buttonFiles.length === 0) {
    console.warn('⚠️ No button files found.');
  }
  for (const file of buttonFiles) {
    const filePath = path.join(buttonsPath, file);
    try {
      const button = await import(`file://${filePath}`);
      if (button.default?.customId && button.default?.execute) {
        client.buttons.set(button.default.customId, button.default);
        console.log(`✅ Loaded button: ${button.default.customId}`);
      } else {
        console.warn(`⚠️ Skipped button ${file}`);
      }
    } catch (err) {
      console.error(`❌ Failed to import button ${file}:`, err);
    }
  }
}

// Load modals
if (!fs.existsSync(modalsPath)) {
  console.warn('⚠️ Modals path does NOT exist!');
} else {
  const modalFiles = fs.readdirSync(modalsPath).filter(file => file.endsWith('.js'));
  if (modalFiles.length === 0) {
    console.warn('⚠️ No modal files found.');
  }
  for (const file of modalFiles) {
    const filePath = path.join(modalsPath, file);
    try {
      const modal = await import(`file://${filePath}`);
      if (modal.default?.customId && modal.default?.execute) {
        client.modals.set(modal.default.customId, modal.default);
        console.log(`✅ Loaded modal: ${modal.default.customId}`);
      } else {
        console.warn(`⚠️ Skipped modal ${file}`);
      }
    } catch (err) {
      console.error(`❌ Failed to import modal ${file}:`, err);
    }
  }
}

// Handle interactions
client.on(Events.InteractionCreate, async interaction => {
  try {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      await command.execute(interaction);
    } else if (interaction.isButton()) {
      const handler = client.buttons.get(interaction.customId);
      if (handler) await handler.execute(interaction);
    } else if (interaction.isModalSubmit()) {
      const handler = client.modals.get(interaction.customId);
      if (handler) await handler.execute(interaction);
    }
  } catch (error) {
    console.error('❌ Interaction error:', error);
    if (interaction.reply) {
      await interaction.reply({ content: 'There was an error!', ephemeral: true }).catch(() => {});
    }
  }
});

// DM server owner when bot added
client.on(Events.GuildCreate, async guild => {
  try {
    const owner = await guild.fetchOwner();
    await owner.send(
      `👋 Thanks for adding RedEye bot to your server!

📌 Here's how to get started:

1️⃣ Run the command \`/here\` in the channel where you want RedEye to post YouTube updates.

2️⃣ Ask your members to use \`/getredeye\` to verify their YouTube channel (minimum 10 subscribers).

📽️ Once verified, RedEye will automatically post their new uploads in the selected channel.

Enjoy using RedEye! ❤️`
    );
  } catch (error) {
    console.error('❌ Could not DM server owner:', error);
  }
});

client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

// Express server to keep bot awake on Render
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('RedEye bot is alive!'));
app.listen(PORT, () => console.log(`🌐 Express listening on port ${PORT}`))
