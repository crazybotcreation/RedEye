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
      await interaction.deferReply({ flags: 64 }); // 🛠️ Fix interaction timeout

      const verifyButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('verify_yt')
          .setLabel('🔗 Verify YouTube Channel')
          .setStyle(ButtonStyle.Primary)
      );

      await interaction.editReply({
        content: 'Click below to verify your YouTube channel!',
        components: [verifyButton]
      });
    } catch (err) {
      console.error('❌ [getredeye] Failed:', err.message);
    }
  }
};
