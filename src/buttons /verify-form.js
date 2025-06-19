// This handles the button press that opens the modal
export default {
  customId: 'open_verify_form',

  async execute(interaction) {
    if (!interaction.isButton()) return;

    await interaction.showModal({
      custom_id: 'youtube_verify_modal',
      title: 'YouTube Verification',
      components: [
        {
          type: 1,
          components: [
            {
              type: 4,
              custom_id: 'channel_name',
              label: 'Channel Name',
              style: 1,
              placeholder: 'e.g. CRAZY',
              required: true
            }
          ]
        },
        {
          type: 1,
          components: [
            {
              type: 4,
              custom_id: 'channel_link',
              label: 'Channel Link',
              style: 1,
              placeholder: 'https://youtube.com/@yourchannel',
              required: true
            }
          ]
        },
        {
          type: 1,
          components: [
            {
              type: 4,
              custom_id: 'subscriber_count',
              label: 'Subscriber Count',
              style: 1,
              placeholder: 'Enter a number (min 10)',
              required: true
            }
          ]
        }
      ]
    });
  }
                
