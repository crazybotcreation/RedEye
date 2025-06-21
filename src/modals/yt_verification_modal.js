// src/modals/yt_verification_modal.js
import {
  EmbedBuilder
} from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { commitYoutubeUsersFile } from '../utils/gitUtils.js'; // ✅ Make sure this is correct!

const dataPath = path.join(process.cwd(), 'youtube-users.json');

function extractChannelId(url) {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/');
    const id = parts[2] || parts[1];
    if (!id) return null;
    return id;
  } catch (e) {
    return null;
  }
}

export default {
  customId: 'yt_verification_modal',
  async execute(interaction) {
    try {
      const ytUrl = interaction.fields.getTextInputValue('yt_channel');
      const ytChannelId = extractChannelId(ytUrl);

      if (!ytChannelId) {
        return interaction.reply({
          content: '❌ Invalid YouTube URL. Please submit a correct one.',
          ephemeral: true
        });
      }

      const userId = interaction.user.id;
      const guildId = interaction.guildId;
      const channelId = interaction.channelId;

      // Log all fields
      console.log(`[🔎] YouTube Verification - User: ${userId}, Guild: ${guildId}, Channel: ${channelId}, YT: ${ytChannelId}`);

      // Load or create youtube-users.json
      let data = {};
      if (fs.existsSync(dataPath)) {
        try {
          data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        } catch (e) {
          console.warn('⚠️ Could not read youtube-users.json:', e);
          data = {};
        }
      }

      data[userId] = {
        channelId: ytChannelId,
        channel: channelId,
        guild: guildId
      };

      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      console.log(`[✅] Saved user info to youtube-users.json`);

      await commitYoutubeUsersFile(); // 🧠 this must be defined in gitUtils.js

      const embed = new EmbedBuilder()
        .setTitle('✅ YouTube Verification Complete!')
        .setDescription(`You've submitted: \`${ytChannelId}\``)
        .setColor(0xff0000);

      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });

    } catch (error) {
      console.error('❌ Modal error:', error);
      await interaction.reply({
        content: `❌ Something went wrong: ${error.message || error}`,
        ephemeral: true
      });
    }
  }
}
