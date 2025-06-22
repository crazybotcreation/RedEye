// src/commands/getredeye.js
import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('getredeye')
    .setDescription('Get the RedEye YouTube verification panel'),

  async execute(interaction) {
    await interaction.reply({
      content: 'Click below to verify your YouTube!',
      components: [/* your verify button row */],
      ephemeral: true,
    });
  }
