// modals/yt_verification_modal.js
import fs from 'fs';
import path from 'path';
import { commitYoutubeUsersFile } from '../utils/gitUtils.js';

const filePath = path.join(process.cwd(), 'youtube-users.json');

export default {
  id: 'yt_verification_modal',

  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true }); // ✅ Defer FIRST to avoid 40060 error
      console.log(`📨 Modal submitted by ${interaction.user?.id} in guild ${interaction.guildId}`);

      const youtubeUrl = interaction.fields.getTextInputValue('youtubeLink')?.trim();
      const youtubeChannelIdMatch = youtubeUrl.match(/(?:\/channel\/|\/@)([a-zA-Z0-9_-]{1,})/);
      const youtubeChannelId = youtubeChannelIdMatch?.[1];

      if (!youtubeChannelId) {
        console.log('❌ Invalid YouTube link:', youtubeUrl);
        return await interaction.editReply({
          content: '❌ Invalid YouTube Channel URL!'
        });
      }

      const userId = interaction.user.id;
      const guildId = interaction.guildId;
      const channelId = interaction.channelId;

      let data = {};
      if (fs.existsSync(filePath)) {
        try {
          const raw = fs.readFileSync(filePath, 'utf-8');
          data = raw ? JSON.parse(raw) : {};
        } catch (err) {
          console.error('❌ Error reading youtube-users.json:', err);
        }
      }

      data[userId] = {
        channelId: youtubeChannelId,
        channel: channelId,
        guild: guildId
      };

      console.log('📁 Writing to:', filePath);
      console.log('📝 Data to save:', data);

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      console.log('📤 Calling commitYoutubeUsersFile...');
      await commitYoutubeUsersFile();

      await interaction.editReply({
        content: `✅ You are now verified! RedEye will track https://youtube.com/@${youtubeChannelId}`
      });

    } catch (error) {
      console.error('❌ Verification failed:', error);

      try {
        if (interaction.deferred || interaction.replied) {
          await interaction.editReply({
            content: '⚠️ Something went wrong during verification.'
          });
        } else {
          await interaction.reply({
            content: '⚠️ Something went wrong during verification.',
            ephemeral: true
          });
        }
      } catch (replyError) {
        console.error('❌ Interaction already acknowledged or failed to reply:', replyError.message);
      }
    }
  }
}        
