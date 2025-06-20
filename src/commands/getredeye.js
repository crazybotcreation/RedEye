// src/commands/getredeye.js
import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('getredeye')
    .setDescription('Begin your YouTube verification process.'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📺 YouTube Verification')
      .setDescription(
        'To verify as a YouTube creator, please provide the following:\n' +
        '• Your **channel URL**\n' +
        '• Your **subscriber count** (must be at least 10)\n\n' +
        '🔒 This verification is private. Once verified, I\'ll post your latest videos here!'
      )
      .setColor(0xff0000)
      .setFooter({ text: 'RedEye YouTube Verification' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('verify_yt')
        .setLabel('📤 Submit YouTube Info')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
}
