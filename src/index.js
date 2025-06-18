import { Client, GatewayIntentBits, Collection, Events, EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.commands = new Collection();

const commandsPath = path.resolve('./src/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  client.commands.set(command.default.data.name, command.default);
}

const serverSettings = new Map(); // Maps guildId → channelId

client.once(Events.ClientReady, () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on(Events.GuildCreate, async guild => {
  try {
    const owner = await guild.fetchOwner();
    await owner.send(
      `👋 Thanks for adding RedEye bot!\n\nℹ️ Please setup a content channel using \`/here\` and stop it using \`/dontmore\`.\n\n⚠️ Bot may post anywhere by default until setup.`
    );
    console.log(`✅ Sent welcome DM to ${owner.user.tag}`);
  } catch (err) {
    console.error('❌ Failed to send DM:', err.message);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client, serverSettings);
  } catch (error) {
    console.error(`❌ Error executing ${interaction.commandName}:`, error);
    await interaction.reply({
      content: '⚠️ Something went wrong.',
      ephemeral: true
    });
  }
});

client.login(process.env.DISCORD_TOKEN)
