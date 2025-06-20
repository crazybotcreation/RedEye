// src/modals/yt_verification_modal.js
import { EmbedBuilder } from 'discord.js';
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'channel-config.json');

export default {
  customId: 'yt_verification_modal',

  async execute(interaction) {
    const channelUrl = interaction.fields.getTextInputValue('channel_url');
    const subscriberCount = parseInt(interaction.fields.getTextInputValue('subscriber_count'), 10);

    if (isNaN(subscriberCount) || subscriberCount < 10) {
      return interaction.reply({
        content: '❌ You must have at least 10 subscribers to verify.',
        ephemeral: true
      });
    }

    // Load working channel from config
    let config = {};
    try {
      config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    } catch (err) {
      console.error('❌ Failed to read config file:', err.message);
    }

    const workingChannelId = config[interaction.guildId];
    const workingChannel = interaction.guild.channels.cache.get(workingChannelId);

    if (!workingChannel) {
      return interaction.reply({
        content: '⚠️ Cannot find the working channel. Please ask the server owner to use `/here` command.',
        ephemeral: true
      });
    }

    // Public embed in working channel
    const publicEmbed = new EmbedBuilder()
      .setTitle('✅ Verified YouTuber!')
      .setDescription(`**${interaction.user.tag}** is a verified YouTube creator!\n\n📺 [Visit Channel](${channelUrl})`)
      .setColor(0x00ff00)
      .setFooter({ text: 'RedEye YouTube Verified' })
      .setTimestamp();

    await workingChannel.send({ embeds: [publicEmbed] });

    // Private confirmation
    await interaction.reply({
      content: '✅ You have been verified! Your channel is now being tracked for new videos.',
      ephemeral: true
    });
  }
}
