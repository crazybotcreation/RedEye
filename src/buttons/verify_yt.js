// src/buttons/verify_yt.js
import {
  ActionRowBuilder,
  ButtonInteraction,
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
      .setCustomId('yt_channel') // ✅ MUST MATCH THIS ID
      .setLabel('Your YouTube Channel URL')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(ytChannelInput);
    modal.addComponents(row);

    await interaction.showModal(modal);
  }
}
