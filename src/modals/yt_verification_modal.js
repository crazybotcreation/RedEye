// src/modals/yt_verification_modal.js
import {
  EmbedBuilder
} from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { commitYoutubeUsersFile } from '../utils/gitUtils.js'; // ✅ auto commit to GitHub

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

    // Load or create youtube-users.json
    let data = {};
    if (fs.existsSync(dataPath)) {
      try {
        data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      } catch {
        data = {};
      }
    }

    // Store the user data under user ID
    data[userId] = {
      channelId: ytChannelId,
      channel: channelId,
      guild: guildId
    };

    // Save the updated file
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    // ✅ Trigger GitHub auto commit
    await commitYoutubeUsersFile();

    const embed = new EmbedBuilder()
      .setTitle('✅ YouTube Verification Complete!')
      .setDescription(`You've submitted: \`${ytChannelId}\``)
      .setColor(0xff0000);

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
      
