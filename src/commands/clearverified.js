// src/commands/clearverified.js
import { SlashCommandBuilder } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

const dataPath = path.join(process.cwd(), 'youtube-users.json');
const OWNER_ID = '1354501822429265921';

export default {
  data: new SlashCommandBuilder()
    .setName('clearverified')
    .setDescription('Clear all verified users (only for owner).'),

  async execute(interaction) {
    if (interaction.user.id !== OWNER_ID) {
      return interaction.reply({
        content: '❌ You are not allowed to use this command.',
        ephemeral: true
      });
    }

    try {
      fs.writeFileSync(dataPath, JSON.stringify({}, null, 2));
      await interaction.reply({
        content: '🧹 All verified users have been cleared.',
        ephemeral: true
      });
    } catch (err) {
      console.error('❌ Failed to clear verified users:', err);
      await interaction.reply({
        content: '❌ Something went wrong while clearing data.',
        ephemeral: true
      });
    }
  }
}
