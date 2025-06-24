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
      await interaction.deferReply({ flags: 64 }); // 🔧 Fix added

      const verifyButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('verify_yt')
          .setLabel('🔗 Verify YouTube Channel')
          .setStyle(ButtonStyle.Primary)
      );

      await interaction.editReply({ // 🔧 Changed to editReply
        content: 'Click below to verify your YouTube channel!',
        components: [verifyButton]
      });
    } catch (error) {
      console.error('❌ [getredeye] Failed:', error.message);
    }
  }
};
