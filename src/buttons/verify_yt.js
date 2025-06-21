// src/buttons/verify_yt.js
import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js';

export default {
  customId: 'verify_yt',
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('yt_verification_modal')
      .setTitle('YouTube Verification');

    const ytChannelInput = new TextInputBuilder()
      .setCustomId('yt_channel') // ✅ MUST match expected field ID in modal handler
      .setLabel('Your YouTube Channel URL')
      .setPlaceholder('https://youtube.com/channel/...')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(ytChannelInput);
    modal.addComponents(row);

    await interaction.showModal(modal);
  }
};
