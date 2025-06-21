// src/commands/listverified.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

const dataPath = path.join(process.cwd(), 'youtube-users.json');
const OWNER_ID = '1354501822429265921'; // ✅ Only you can run this

export default {
  data: new SlashCommandBuilder()
    .setName('listverified')
    .setDescription('List all YouTube-verified users (only for owner).'),

  async execute(interaction) {
    if (interaction.user.id !== OWNER_ID) {
      return interaction.reply({
        content: '❌ You are not allowed to use this command.',
        ephemeral: true
      });
    }

    if (!fs.existsSync(dataPath)) {
      return interaction.reply({
        content: '⚠️ No data file found.',
        ephemeral: true
      });
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    if (!data || Object.keys(data).length === 0) {
      return interaction.reply({
        content: '📦 No verified users stored.',
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('📋 Verified YouTube Users')
      .setColor(0x00ff88);

    for (const [userId, { channelId, guild }] of Object.entries(data)) {
      embed.addFields({
        name: `<@${userId}>`,
        value: `📺 Channel ID: \`${channelId}\`\n🌐 Guild: \`${guild}\``,
        inline: false
      });
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
