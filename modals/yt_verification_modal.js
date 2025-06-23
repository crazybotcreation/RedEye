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
      const userId = interaction.user.id;
      const guildId = interaction.guildId;

      if (!youtubeUrl) {
        return await interaction.reply({
          content: '❌ You must provide a YouTube channel URL.',
          ephemeral: true,
        });
      }

      // Extract the handle or channel ID
      const match = youtubeUrl.match(/youtube\.com\/(@[a-zA-Z0-9_-]+|channel\/[a-zA-Z0-9_-]+)/);
      if (!match) {
        return await interaction.reply({
          content: '❌ Please enter a valid YouTube channel URL like:\nhttps://youtube.com/@yourchannel',
          ephemeral: true,
        });
      }

      const channelRef = match[1];

      let data = {};
      if (fs.existsSync(filePath)) {
        try {
          const raw = fs.readFileSync(filePath, 'utf-8');
          data = raw ? JSON.parse(raw) : {};
        } catch (err) {
          console.error('❌ Failed to read youtube-users.json:', err);
        }
      }

      data[userId] = {
        channelId: channelRef,
        guild: guildId
      };

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      commitYoutubeUsersFile();

      await interaction.reply({
        content: `✅ You are now verified! RedEye will track **https://youtube.com/${channelRef}**`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('❌ Verification failed:', error);
      await interaction.reply({
        content: '⚠️ Something went wrong during verification. Please try again later.',
        ephemeral: true,
      });
    }
  },
};
