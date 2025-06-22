// src/modals/yt_verification_modal.js
import fs from 'fs';
import path from 'path';
import { commitYoutubeUsersFile } from '../utils/gitutils.js'; // ✅ fixed lowercase

const filePath = path.join(process.cwd(), 'youtube-users.json');

export default {
  id: 'yt_verification_modal',
  async execute(interaction) {
    const youtubeUrl = interaction.fields.getTextInputValue('youtubeLink');
    const discordChannelId = interaction.fields.getTextInputValue('discordChannel');
    const youtubeChannelIdMatch = youtubeUrl.match(/(?:\/channel\/|\/@)?([a-zA-Z0-9_-]{24})/);
    const youtubeChannelId = youtubeChannelIdMatch?.[1];

    if (!youtubeChannelId || !/^\d{17,19}$/.test(discordChannelId)) {
      return await interaction.reply({
        content: '❌ Invalid YouTube URL or Discord Channel ID!',
        ephemeral: true
      });
    }

    const guildId = interaction.guildId;
    const userId = interaction.user.id;
    let data = {};

    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      data = raw ? JSON.parse(raw) : {};
    }

    data[userId] = {
      channelId: youtubeChannelId,
      channel: discordChannelId,
      guild: guildId
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    commitYoutubeUsersFile();

    await interaction.reply({
      content: '✅ You are verified successfully!',
      ephemeral: true
    });
  }
};
