// src/commands/getredeye.js
import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('getredeye')
    .setDescription('Get the RedEye YouTube verification panel'),

  async execute(interaction) {
    const verifyButton = new ButtonBuilder()
      .setCustomId('verify_yt')
      .setLabel('Verify YouTube')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(verifyButton);

    await interaction.reply({
      content: 'Click the button below to verify your YouTube channel 👇',
      components: [row],
      ephemeral: true,
    });
  }
};
