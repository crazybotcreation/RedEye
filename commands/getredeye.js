// commands/getredeye.js
import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('getredeye')
    .setDescription('Get the RedEye YouTube verification panel'),

  async execute(interaction) {
    try {
      await interaction.reply({
        content: 'Click below to verify your YouTube channel!',
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('verify_yt')
              .setLabel('🔗 Verify YouTube Channel')
              .setStyle(ButtonStyle.Primary)
          )
        ],
        flags: 64 // use flags instead of ephemeral
      });
    } catch (error) {
      console.error('❌ [getredeye] Failed:', error.message);
    }
  }
};
