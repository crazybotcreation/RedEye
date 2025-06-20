import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import path from 'path';

export default {
  data: new SlashCommandBuilder()
    .setName('here')
    .setDescription('Set this channel as my working area (only the bot inviter can use this).'),

  async execute(interaction) {
    const inviter = interaction.guild.members.cache.get(interaction.guild.ownerId); // fallback
    const auditLogs = await interaction.guild.fetchAuditLogs({ type: 28, limit: 5 }); // type 28: BOT_ADD
    const inviteLog = auditLogs.entries.find(entry => entry.target.id === interaction.client.user.id);
    const inviterId = inviteLog?.executor?.id || inviter.id;

    if (interaction.user.id !== inviterId) {
      return interaction.reply({ content: `❌ Only the user who invited me can use this command.`, ephemeral: true });
    }

    const configPath = path.join(process.cwd(), 'src', 'channel-config.json');
    const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf-8')) : {};
    config[interaction.guildId] = interaction.channelId;

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    await interaction.reply({ content: `✅ This channel is now set as my working area.`, ephemeral: true });
  }
};
