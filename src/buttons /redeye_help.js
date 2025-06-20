// src/buttons/redeye_help.js
import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';

export default {
  customId: 'redeye_help',

  async execute(interaction) {
    const botAvatar = interaction.client.user.displayAvatarURL();

    const helpEmbed = new EmbedBuilder()
      .setAuthor({ name: 'RedEye Bot Help', iconURL: botAvatar })
      .setTitle('❓ YouTube Verification Guide')
      .setDescription(
        `📽️ **Want your YouTube videos posted here automatically?**\n\n` +
        `✅ Just follow these steps:\n` +
        `1. Click **"📥 Submit Channel Info"** below.\n` +
        `2. Enter your **YouTube channel link** and name.\n` +
        `3. Your channel must have **at least 10 subscribers**.\n\n` +
        `🛠️ Once verified, your future uploads will be posted in the selected update channel.\n` +
        `💬 Questions? Contact the server admin or bot developer.`
      )
      .setColor('Blue')
      .setFooter({ text: 'RedEye Bot — YouTube Verification Assistant' })
      .setTimestamp();

    const actionRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('submit_info') // this ID should match the modal trigger
        .setLabel('📥 Submit Channel Info')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      embeds: [helpEmbed],
      components: [actionRow],
      ephemeral: true
    });
  }
};
