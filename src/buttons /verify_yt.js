// src/buttons/verify_yt.js
import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} from 'discord.js';

export default {
  customId: 'verify_yt',

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('yt_verification_modal')
      .setTitle('🔍 YouTube Verification');

    const channelInput = new TextInputBuilder()
      .setCustomId('channel_url')
      .setLabel('📺 Channel URL')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('https://youtube.com/...')
      .setRequired(true);

    const subsInput = new TextInputBuilder()
      .setCustomId('subscriber_count')
      .setLabel('👥 Subscriber Count')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Enter number (must be at least 10)')
      .setRequired(true);

    const row1 = new ActionRowBuilder().addComponents(channelInput);
    const row2 = new ActionRowBuilder().addComponents(subsInput);

    modal.addComponents(row1, row2);

    await interaction.showModal(modal);
  }
};
