import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('getredeye')
    .setDescription('🎥 Verify your YouTube channel to receive updates.')
    .setDMPermission(false), // Server-only

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🎥 YouTube Creator Verification')
      .setDescription('Please follow the steps below to verify your YouTube channel.\n\n🔹 Minimum 10 subscribers required.\n🔹 The bot will start tracking your uploads after verification.')
      .setColor(0xff0000)
      .setFooter({ text: 'RedEye Bot - YouTube Utility' });

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
}
