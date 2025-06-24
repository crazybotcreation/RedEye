// modals/yt_verification_modal.js
import fs from 'fs';
import path from 'path';
import { commitYoutubeUsersFile } from '../utils/gitUtils.js';

const filePath = path.join(process.cwd(), 'youtube-users.json');

export default {
  id: 'yt_verification_modal',

  async execute(interaction) {
    try {
      console.log('🪝 [Step 1] Modal execution triggered');
      await interaction.deferReply({ ephemeral: true }); // ✅ Defer FIRST to avoid 40060 error
      console.log(`✅ [Step 2] Interaction deferred by ${interaction.user?.id} in guild ${interaction.guildId}`);

      const youtubeUrl = interaction.fields.getTextInputValue('youtubeLink')?.trim();
      console.log(`🔍 [Step 3] Input received: ${youtubeUrl}`);

      const youtubeChannelIdMatch = youtubeUrl.match(/(?:\/channel\/|\/@)([a-zA-Z0-9_-]{1,})/);
      const youtubeChannelId = youtubeChannelIdMatch?.[1];

      if (!youtubeChannelId) {
        console.warn(`❌ [Step 4] Failed to extract channel ID from: ${youtubeUrl}`);
        return await interaction.editReply({
          content: '❌ Invalid YouTube Channel URL!'
        });
      }

      console.log(`✅ [Step 5] Extracted Channel ID: ${youtubeChannelId}`);

      const userId = interaction.user.id;
      const guildId = interaction.guildId;
      const channelId = interaction.channelId;

      let data = {};
      if (fs.existsSync(filePath)) {
        try {
          const raw = fs.readFileSync(filePath, 'utf-8');
          data = raw ? JSON.parse(raw) : {};
          console.log('📄 [Step 6] Existing data loaded from file');
        } catch (err) {
          console.error('❌ [Step 6] Error reading youtube-users.json:', err);
        }
      }

      data[userId] = {
        channelId: youtubeChannelId,
        channel: channelId,
        guild: guildId
      };

      console.log('📁 [Step 7] Writing updated data to file:', filePath);
      console.dir(data, { depth: null });

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      console.log('🚀 [Step 8] Calling commitYoutubeUsersFile()...');
      await commitYoutubeUsersFile();

      console.log('✅ [Step 9] Verification success. Sending reply...');
      await interaction.editReply({
        content: `✅ You are now verified! RedEye will track https://youtube.com/@${youtubeChannelId}`
      });

    } catch (error) {
      console.error('❌ [Step 10] Verification process threw an error:', error);

      try {
        if (interaction.deferred || interaction.replied) {
          console.log('⚠️ [Step 11] Editing deferred/replied interaction');
          await interaction.editReply({
            content: '⚠️ Something went wrong during verification.'
          });
        } else {
          console.log('⚠️ [Step 11] Replying fresh to interaction');
          await interaction.reply({
            content: '⚠️ Something went wrong during verification.',
            ephemeral: true
          });
        }
      } catch (replyError) {
        console.error('❌ [Step 12] Interaction already acknowledged or reply failed:', replyError.message);
      }
    }
  }
}
