import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('placeholder').setDescription('Placeholder command'),
  async execute(interaction) {
    await interaction.reply('✅ Placeholder command executed!');
  }
}
