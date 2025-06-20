// src/modals/yt_verification_modal.js
import {
  ModalSubmitInteraction,
  EmbedBuilder
} from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

const USERS_FILE = path.join(process.cwd(), 'youtube-users.json');

export default {
  customId: 'yt_verification_modal',
  /**
   * @param {ModalSubmitInteraction} interaction
   */
  async execute(interaction) {
    const ytUrl = interaction.fields.getTextInputValue('yt_url_input');
    const channelMatch = ytUrl.match(/(?:\/channel\/|channelId=)([a-zA-Z0-9_-]{24})/i);
    const ytChannelId = channelMatch?.[1];

    if (!ytChannelId) {
      return interaction.reply({
        content: '❌ Invalid YouTube channel URL. Make sure it includes /channel/CHANNEL_ID',
        ephemeral: true
      });
    }

    const userId = interaction.user.id;
    const guildId = interaction.guild.id;
    const channelId = interaction.channelId;

    // Load or initialize JSON
    let userData = {};
    if (fs.existsSync(USERS_FILE)) {
      try {
        userData = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
      } catch (err) {
        console.error('❌ Error reading youtube-users.json:', err);
      }
    }

    // Save or update user entry
    userData[userId] = {
      channelId: ytChannelId,
      channel: channelId,
      guild: guildId
    };

    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(userData, null, 2));
      console.log(`✅ Saved YouTube channel for ${interaction.user.tag}`);
    } catch (err) {
      console.error('❌ Failed to write youtube-users.json:', err);
    }

    // Respond to user
    const embed = new EmbedBuilder()
      .setTitle('✅ YouTube Channel Verified!')
      .setDescription(`Thanks <@${userId}>, your channel has been saved.\nI'll start monitoring your uploads!`)
      .setColor(0x00ff00);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
