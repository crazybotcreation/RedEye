// src/commands/ping.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with bot latency and API speed!'),

  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });

    const embed = new EmbedBuilder()
      .setTitle('🏓 Pong!')
      .setDescription(
        `🤖 **Bot Latency:** \`${sent.createdTimestamp - interaction.createdTimestamp}ms\`\n` +
        `📡 **API Latency:** \`${Math.round(interaction.client.ws.ping)}ms\``
      )
      .setColor('Green')
      .setFooter({ text: 'RedEye Bot — Ping Command' })
      .setTimestamp()
      .setThumbnail(interaction.client.user.displayAvatarURL());

    await interaction.editReply({ content: '', embeds: [embed] });
  }
};
