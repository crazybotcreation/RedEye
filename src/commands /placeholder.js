// src/commands/placeholder.js
import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('placeholder')
    .setDescription('Placeholder command for testing.'),
  async execute(interaction) {
    await interaction.reply('✅ Slash commands are working!');
  }
};
