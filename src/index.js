// RedEye/src/index.js

const { Client, GatewayIntentBits, Partials, Collection, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel] // for DMs
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command.data && command.execute) {
    client.commands.set(command.data.name, command);
  }
}

// Store active channel per guild
const channelMap = new Map();

// Welcome DM when bot joins a server
client.on(Events.GuildCreate, async guild => {
  try {
    const owner = await guild.fetchOwner();
    await owner.send(`👋 **Welcome to RedEye**\n\nThis bot helps YouTube content creators share updates inside your server.\n\n⚠️ The bot can message anywhere, so please set a proper channel with \`/here\`.\nIf needed, stop it anytime using \`/dontmore\`.`);
    console.log(`✅ Sent welcome DM to ${owner.user.tag}`);
  } catch (e) {
    console.warn(`⚠️ Couldn't send welcome DM: ${e.message}`);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, { client, channelMap });
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '❌ Error executing command.', ephemeral: true });
  }
});

client.login(process.env.DISCORD_TOKEN);
