// src/buttons/redeye_help.js
import { EmbedBuilder } from 'discord.js';

export default {
  customId: 'redeye_help',

  async execute(interaction) {
    const helpEmbed = new EmbedBuilder()
      .setTitle('❓ Help: YouTube Verification')
      .setDescription(
        `If you're a YouTube content creator and want your latest videos posted in this server:\n\n` +
        `1. Click **"📥 Submit Channel Info"** to send your channel link and name.\n` +
        `2. Make sure your channel has **at least 10 subscribers**.\n` +
        `3. Once verified, your uploads will appear in the selected update channel (use \`/here\`).\n\n` +
        `For questions or issues, contact the bot admin.`
      )
      .setColor('Blue')
      .setFooter({ text: 'RedEye Bot — Verification Help' })
      .setTimestamp();

    await interaction.reply({
      embeds: [helpEmbed],
      ephemeral: true
    });
  }
};
