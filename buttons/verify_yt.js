// src/buttons/verify_yt.js
export default {
  id: 'verify_yt',
  async execute(interaction) {
    try {
      console.log(`🔘 [verify_yt] Button clicked by ${interaction.user?.id}`);

      // ✅ Prevent "Unknown interaction" error
      await interaction.deferUpdate();

      await interaction.showModal({
        custom_id: 'yt_verification_modal',
        title: 'YouTube Verification',
        components: [
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: 'youtubeLink',
                style: 1,
                label: 'Enter your YouTube Channel URL',
                placeholder: 'https://youtube.com/@yourchannel',
                required: true
              }
            ]
          }
        ]
      });
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
