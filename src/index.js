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

// Folder paths
const commandsPath = path.join(__dirname, 'commands');
const buttonsPath = path.join(__dirname, 'buttons');
const modalsPath = path.join(__dirname, 'modals');
const configPath = path.join(process.cwd(), 'channel-config.json');

console.log('🧠 God Mode Diagnostics Enabled');
console.log('📂 Working Directory:', process.cwd());
console.log('📂 __dirname:', __dirname);
console.log('📁 Commands Path:', commandsPath);
console.log('📁 Buttons Path:', buttonsPath);
console.log('📁 Modals Path:', modalsPath);

const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMembers
],
partials: [Partials.Channel]
});

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.inviterMap = new Map();

let commandFiles = [];

if (fs.existsSync(commandsPath)) {
commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
if (commandFiles.length === 0) console.warn('⚠️ No command files found.');
else console.log('📄 Found command files:', commandFiles);
} else {
console.warn('❌ Commands folder missing!');
}

// Load commands
for (const file of commandFiles) {
const filePath = path.join(commandsPath, file);
try {
const command = await import(file://${filePath});
if (command.default?.data && command.default?.execute) {
client.commands.set(command.default.data.name, command.default);
console.log(✅ Loaded command: ${command.default.data.name});
} else {
console.warn(⚠️ Skipped ${file} (missing data or execute));
}
} catch (err) {
console.error(❌ Error loading command ${file}:, err);
}
}

// Deploy slash commands
const deployCommands = async () => {
if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID) {
console.warn('❌ Missing DISCORD_TOKEN or CLIENT_ID in environment. Skipping slash command deploy.');
return;
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
const commandsToDeploy = [];

for (const file of commandFiles) {
const filePath = path.join(commandsPath, file);
const cmd = await import(file://${filePath});
if (cmd.default?.data) {
commandsToDeploy.push(cmd.default.data.toJSON());
console.log(📤 Ready to deploy: /${cmd.default.data.name});
}
}

if (commandsToDeploy.length === 0) {
console.warn('⚠️ No slash commands to deploy.');
return;
}

try {
console.log('🚀 Deploying slash commands globally...');
await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
body: commandsToDeploy
});
console.log('✅ Slash commands deployed!');
} catch (err) {
console.error('❌ Failed to deploy commands:', err);
}
};

await deployCommands();

// ✅ Load buttons
if (fs.existsSync(buttonsPath)) {
const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));
for (const file of buttonFiles) {
const filePath = path.join(buttonsPath, file);
const button = await import(file://${filePath});
if (button.default?.customId && button.default?.execute) {
client.buttons.set(button.default.customId, button.default);
console.log(✅ Loaded button: ${button.default.customId});
}
}
} else {
console.warn('⚠️ Buttons path does NOT exist!');
}

// Load modals
if (fs.existsSync(modalsPath)) {
const modalFiles = fs.readdirSync(modalsPath).filter(file => file.endsWith('.js'));
for (const file of modalFiles) {
const filePath = path.join(modalsPath, file);
const modal = await import(file://${filePath});
if (modal.default?.customId && modal.default?.execute) {
client.modals.set(modal.default.customId, modal.default);
console.log(✅ Loaded modal: ${modal.default.customId});
}
}
} else {
console.warn('⚠️ Modals path does NOT exist!');
}

// Send DM when bot is added to a server
client.on(Events.GuildCreate, async (guild) => {
try {
const owner = await guild.fetchOwner();
client.inviterMap.set(guild.id, owner.id); // Save who invited the bot
await owner.send({
content: `👋 Hey ${owner.user.username}, thanks for adding RedEye bot!

📘 What RedEye does:
RedEye helps with YouTube verification, server interaction, and personalized bot responses.

⚠️ Important Warning:
By default, RedEye can send messages anywhere in your server. To control this:
• Use /here to set the working channel.
• Use /dontmore to stop the bot from messaging.

Let me know if you need help anytime. 😎   });   console.log(📩 Sent DM to ${owner.user.tag} after joining ${guild.name});   } catch (err) {   console.warn(❌ Could not send DM to server owner of ${guild.name}:`, err.message);
}
});

// 🧠 MUSCLE 4: Reset server memory if bot gets kicked
client.on(Events.GuildDelete, async (guild) => {
try {
client.inviterMap.delete(guild.id); // Clear inviter cache
if (fs.existsSync(configPath)) {
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
if (config[guild.id]) {
delete config[guild.id];
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log(🧹 Reset memory for guild ${guild.name} (${guild.id}));
}
}
} catch (err) {
console.warn(❌ Error resetting memory for ${guild.name}:, err.message);
}
});

// Handle interactions
client.on(Events.InteractionCreate, async interaction => {
try {
if (interaction.isChatInputCommand()) {
const command = client.commands.get(interaction.commandName);
if (command) await command.execute(interaction);
} else if (interaction.isButton()) {
const btn = client.buttons.get(interaction.customId);
if (btn) await btn.execute(interaction);
} else if (interaction.isModalSubmit()) {
const modal = client.modals.get(interaction.customId);
if (modal) await modal.execute(interaction);
}
} catch (error) {
console.error('❌ Interaction failed:', error);
await interaction.reply({
content: 'Something went wrong!',
ephemeral: true
}).catch(() => {});
}
});

client.once(Events.ClientReady, () => {
console.log(✅ Logged in as ${client.user.tag});
});

client.login(process.env.DISCORD_TOKEN);

// Keep alive
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('✅ RedEye Bot is running.'));
app.listen(PORT, () => console.log(🌐 Listening on port ${PORT}));
