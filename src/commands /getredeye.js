// src/commands/getredeye.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('getredeye')
    .setDescription('Verify as a YouTube content creator'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🎥 YouTube Verification')
      .setDescription(
        `To verify your YouTube account, please provide details via the buttons or form below.\n\n` +
        `✅ Minimum 10 subscribers required.\n🔒 This process is private and only visible to you.`
      )
      .setColor('Red')
      .setFooter({ text: 'RedEye Bot — Content Creator Verification' })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
}
