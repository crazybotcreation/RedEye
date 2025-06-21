// src/commands/listverified.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

const dataPath = path.join(process.cwd(), 'youtube-users.json');
const OWNER_ID = '1354501822429265921';

export default {
  data: new SlashCommandBuilder()
    .setName('listverified')
    .setDescription('List all verified users (only for owner).'),

  async execute(interaction) {
    if (interaction.user.id !== OWNER_ID) {
      return interaction.reply({
        content: '❌ You are not allowed to use this command.',
        ephemeral: true
      });
    }

    let data = {};
    if (fs.existsSync(dataPath)) {
      try {
        data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      } catch {
        data = {};
      }
    }

    const entries = Object.entries(data);

    if (entries.length === 0) {
      return interaction.reply({
        content: '📦 No verified users stored.',
        ephemeral: true
      });
    }

    const lines = entries.map(([userId, info]) => {
      return `👤 <@${userId}> — YT: \`${info.channelId}\`\n🌐 Guild: \`${info.guild}\``;
    });

    const embed = new EmbedBuilder()
      .setTitle('✅ Verified Users List')
      .setDescription(lines.join('\n\n'))
      .setColor(0x00ccff);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
