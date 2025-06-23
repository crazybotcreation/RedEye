// commands/stats.js
import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import path from 'path';

export default {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('📊 Show total verified users and linked channels'),

  async execute(interaction) {
    const filePath = path.join(process.cwd(), 'youtube-users.json');

    if (!fs.existsSync(filePath)) {
      return await interaction.reply({ content: '❌ No verification data found.', ephemeral: true });
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const total = Object.keys(data).length;
    const trackedChannels = [...new Set(Object.values(data).map(u => u.channelId))];
    const discordChannels = [...new Set(Object.values(data).map(u => `<#${u.channel}>`))];

    await interaction.reply({
      content: `📊 **Stats**
👤 Verified Users: ${total}
📺 Tracked YouTube Channels: ${trackedChannels.length}
💬 Linked Discord Channels: ${discordChannels.join(', ') || 'None'}`,
      ephemeral: true
    });
  }
};
