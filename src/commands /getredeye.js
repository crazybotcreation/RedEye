// src/commands/getredeye.js
import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('getredeye')
    .setDescription('Verify as a YouTube content creator'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🎥 YouTube Verification')
      .setDescription(
        `To verify your YouTube account, please provide details using the button below.\n\n` +
        `✅ Minimum 10 subscribers required.\n🔒 This process is private and only visible to you.`
      )
      .setColor('Red')
      .setFooter({ text: 'RedEye Bot — Content Creator Verification' })
      .setTimestamp();

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('submit_youtube_info')
        .setLabel('📥 Submit Channel Info')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('redeye_help')
        .setLabel('❓ Help')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({
      embeds: [embed],
      components: [buttons],
      ephemeral: true
    });
  }
};
