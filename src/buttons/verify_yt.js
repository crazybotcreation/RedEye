// src/buttons/verify_yt.js
import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} from 'discord.js';

export default {
  id: 'verify_yt',

  async execute(interaction) {
    try {
      console.log(`🔘 [verify_yt] Button clicked by ${interaction.user?.id}`);

      const modal = new ModalBuilder()
        .setCustomId('yt_verification_modal')
        .setTitle('YouTube Verification');

      const youtubeInput = new TextInputBuilder()
        .setCustomId('youtubeLink')
        .setLabel('Enter your YouTube Channel URL')
        .setPlaceholder('https://youtube.com/@yourchannel')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const row = new ActionRowBuilder().addComponents(youtubeInput);
      modal.addComponents(row);

      await interaction.showModal(modal);

    } catch (error) {
      console.error('❌ Failed to show modal:', error.message);

      try {
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({
            content: '⚠️ Something went wrong when opening the modal.',
            ephemeral: true
          });
        }
      } catch (fallbackError) {
        console.error('❌ Fallback reply failed:', fallbackError.message);
      }
    }
  }
};
