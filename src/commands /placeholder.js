// src/commands/placeholder.js
import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('placeholder')
    .setDescription('This is a test slash command.'),
  async execute(interaction) {
    await interaction.reply('✅ Slash commands are working!');
  }
};
