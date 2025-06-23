// src/modals/yt_verification_modal.js
import fs from 'fs';
import path from 'path';
import { commitYoutubeUsersFile } from '../utils/gitUtils.js'; // ✅ Correct capitalization

const filePath = path.join(process.cwd(), 'youtube-users.json');

export default {
  id: 'yt_verification_modal',

  async execute(interaction) {
    try {
      const youtubeUrl = interaction.fields.getTextInputValue('youtubeLink')?.trim();
      const discordChannelId = interaction.fields.getTextInputValue('discordChannel')?.trim();

      const youtubeChannelIdMatch = youtubeUrl.match(/(?:\/channel\/|\/@)?([a-zA-Z0-9_-]{24})/);
      const youtubeChannelId = youtubeChannelIdMatch?.[1];

      if (!youtubeChannelId || !/^\d{17,19}$/.test(discordChannelId)) {
        return await interaction.reply({
          content: '❌ Invalid YouTube URL or Discord Channel ID!',
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
        channel: discordChannelId,
        guild: guildId
      };

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      commitYoutubeUsersFile();

      await interaction.reply({
        content: `✅ You are now verified! RedEye will track <https://www.youtube.com/channel/${youtubeChannelId}>`,
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
}
