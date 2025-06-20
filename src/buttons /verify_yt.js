// src/buttons/verify_yt.js
import { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } from 'discord.js';

export default {
  customId: 'verify_yt',

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('yt_verification_modal')
      .setTitle('📺 YouTube Verification');

    const channelUrlInput = new TextInputBuilder()
      .setCustomId('channel_url')
      .setLabel('Your YouTube Channel URL')
      .setPlaceholder('https://www.youtube.com/@yourchannel')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const subscriberCountInput = new TextInputBuilder()
      .setCustomId('subscriber_count')
      .setLabel('Subscriber Count (Minimum 10)')
      .setPlaceholder('Eg: 56')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const firstRow = new ActionRowBuilder().addComponents(channelUrlInput);
    const secondRow = new ActionRowBuilder().addComponents(subscriberCountInput);

    modal.addComponents(firstRow, secondRow);

    await interaction.showModal(modal);
  }
}
