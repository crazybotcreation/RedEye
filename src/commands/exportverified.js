// src/commands/exportverified.js
import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

const dataPath = path.join(process.cwd(), 'youtube-users.json');
const OWNER_ID = '1354501822429265921';

export default {
  data: new SlashCommandBuilder()
    .setName('exportverified')
    .setDescription('Export current verified YouTube user data (only for owner).'),

  async execute(interaction) {
    if (interaction.user.id !== OWNER_ID) {
      return interaction.reply({
        content: '❌ You are not allowed to use this command.',
        ephemeral: true
      });
    }

    if (!fs.existsSync(dataPath)) {
      return interaction.reply({
        content: '📂 No data found to export.',
        ephemeral: true
      });
    }

    try {
      const buffer = fs.readFileSync(dataPath);
      const attachment = new AttachmentBuilder(buffer, { name: 'youtube-users.json' });

      await interaction.reply({
        content: '📤 Here is the current verified users data:',
        files: [attachment],
        ephemeral: true
      });
    } catch (err) {
      console.error('❌ Failed to export data:', err);
      await interaction.reply({
        content: '❌ Something went wrong while exporting.',
        ephemeral: true
      });
    }
  }
}
