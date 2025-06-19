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
      .setCustomId('redeye_youtube_modal')
      .setTitle('YouTube Channel Verification');

    const channelUrlInput = new TextInputBuilder()
      .setCustomId('channel_url')
      .setLabel('🔗 YouTube Channel URL')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('https://youtube.com/channel/...')
      .setRequired(true);

    const subscriberCountInput = new TextInputBuilder()
      .setCustomId('subscriber_count')
      .setLabel('👥 Subscriber Count')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Enter your current subscriber count')
      .setRequired(true);

    const noteInput = new TextInputBuilder()
      .setCustomId('note')
      .setLabel('📝 Notes (Optional)')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Tell us anything else...')
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(channelUrlInput),
      new ActionRowBuilder().addComponents(subscriberCountInput),
      new ActionRowBuilder().addComponents(noteInput)
    );

    await interaction.showModal(modal);
  }
}
