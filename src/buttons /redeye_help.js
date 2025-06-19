// src/buttons/redeye_help.js
import { EmbedBuilder } from 'discord.js';

export default {
  customId: 'redeye_help',
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('❓ RedEye Help')
      .setDescription(
        `**Need help verifying your YouTube account?**\n\n` +
        `• Click the **Submit Channel Info** button to enter your channel name and link.\n` +
        `• Make sure your channel has **at least 10 subscribers**.\n` +
        `• Once submitted, you'll receive confirmation if eligible.\n\n` +
        `Feel free to ask support if you're stuck!`
      )
      .setColor('Red')
      .setFooter({ text: 'RedEye Bot — Help Menu' })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};
