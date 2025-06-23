// src/modals/yt_verification_modal.js
import fs from 'fs';
import path from 'path';
import { commitYoutubeUsersFile } from '../utils/gitUtils.js';

const filePath = path.join(process.cwd(), 'youtube-users.json');

export default {
  id: 'yt_verification_modal',

  async execute(interaction) {
    try {
      const youtubeUrl = interaction.fields.getTextInputValue('youtubeLink')?.trim();

      const youtubeChannelIdMatch = youtubeUrl.match(/(?:\/channel\/|\/@)([a-zA-Z0-9_-]+)/);
      const youtubeChannelId = youtubeChannelIdMatch?.[1];

      if (!youtubeChannelId) {
        return await interaction.reply({
          content: '❌ Invalid YouTube URL format!',
          ephemeral: true
        });
      }

      const userId = interaction.user.id;
      const guildId = interaction.guildId;

      let data = {};
      if (fs.existsSync(filePath)) {
        try {
          const raw = fs.readFileSync(filePath, 'utf-8');
          data = raw ? JSON.parse(raw) : {};
        } catch (err) {
          console.error('❌ Error reading or parsing youtube-users.json:', err);
        }
      }

      data[userId] = {
        channelId: youtubeChannelId,
        guild: guildId
      };

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      commitYoutubeUsersFile();

      await interaction.reply({
        content: `✅ You are now verified! RedEye will track https://www.youtube.com/@${youtubeChannelId}`,
        ephemeral: true
      });
    } catch (error) {
      console.error('❌ Verification failed:', error);
      await interaction.reply({
        content: '⚠️ An error occurred during verification. Please try again later.',
        ephemeral: true
      });
    }
  }
};
