// src/buttons/submit_youtube_info.js
import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} from 'discord.js';

export default {
  customId: 'submit_youtube_info',
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('redeye_modal')
      .setTitle('🔍 YouTube Channel Verification');

    const channelNameInput = new TextInputBuilder()
      .setCustomId('channel_name')
      .setLabel('Your YouTube Channel Name')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('e.g., Crazy Gamer')
      .setRequired(true);

    const channelLinkInput = new TextInputBuilder()
      .setCustomId('channel_link')
      .setLabel('YouTube Channel Link')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('https://youtube.com/channel/...')
      .setRequired(true);

    const firstRow = new ActionRowBuilder().addComponents(channelNameInput);
    const secondRow = new ActionRowBuilder().addComponents(channelLinkInput);

    modal.addComponents(firstRow, secondRow);

    await interaction.showModal(modal);
  }
}
