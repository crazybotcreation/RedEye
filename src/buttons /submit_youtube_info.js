import {
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle
} from 'discord.js';

export default {
  customId: 'submit_youtube_info',

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('redeye_youtube_modal')
      .setTitle('🎥 Submit YouTube Channel');

    const channelLink = new TextInputBuilder()
      .setCustomId('yt_link')
      .setLabel('🔗 YouTube Channel URL')
      .setPlaceholder('https://www.youtube.com/@yourchannel')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const channelName = new TextInputBuilder()
      .setCustomId('yt_name')
      .setLabel('📛 Channel Name')
      .setPlaceholder('Example: CrazyBot Gaming')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const row1 = new ActionRowBuilder().addComponents(channelLink);
    const row2 = new ActionRowBuilder().addComponents(channelName);

    modal.addComponents(row1, row2);

    await interaction.showModal(modal);
  }
}
