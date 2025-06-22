// src/buttons/verify_yt.js
export default {
  id: 'verify_yt',
  async execute(interaction) {
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
              placeholder: 'https://youtube.com/channel/...',
              required: true
            }
          ]
        },
        {
          type: 1,
          components: [
            {
              type: 4,
              custom_id: 'discordChannel',
              style: 1,
              label: 'Enter your Discord Channel ID',
              placeholder: '123456789012345678',
              required: true
            }
          ]
        }
      ]
    });
  }
}
