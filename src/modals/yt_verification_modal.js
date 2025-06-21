// src/modals/yt_verification_modal.js
import { EmbedBuilder } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { commitYoutubeUsersFile } from '../utils/gitUtils.js'; // ✅ auto commit to GitHub
import { backupYoutubeUsersFile } from '../utils/backup.js'; // ✅ backup feature

const dataPath = path.join(process.cwd(), 'youtube-users.json');

// ✅ Improved URL extractor: accepts only /channel/UC... links
function extractChannelId(url) {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/');
    // Accept only URLs that follow /channel/UC...
    if (parts[1] !== 'channel' || !parts[2]?.startsWith('UC')) return null;
    return parts[2];
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
        content: '❌ Invalid YouTube URL. Please submit a correct one. Example: https://www.youtube.com/channel/UCxxxxxx',
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

    // Debug output just before saving
    console.log('🧪 Writing data to youtube-users.json:', data);

    // Save the updated file
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    // ✅ Trigger local backup and GitHub commit
    backupYoutubeUsersFile();

    // Confirm file contents before Git commit
    const fileContent = fs.readFileSync(dataPath, 'utf8');
    console.log('📄 File content before git commit:', fileContent);

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
}
