// src/commands/showusers.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

const dataPath = path.join(process.cwd(), 'youtube-users.json');
const allowedUserId = '1354501822429265921'; // 👑 Only you can use this command

export default {
  data: new SlashCommandBuilder()
    .setName('showusers')
    .setDescription('Displays all verified YouTube users stored in memory'),

  async execute(interaction) {
    if (interaction.user.id !== allowedUserId) {
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
        return interaction.reply({
          content: '⚠️ Could not read youtube-users.json.',
          ephemeral: true
        });
      }
    }

    const entries = Object.entries(data);
    if (entries.length === 0) {
      return interaction.reply({
        content: '📦 No verified users stored.',
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('📄 Verified YouTube Users')
      .setColor(0xff0000)
      .setDescription(
        entries
          .map(
            ([userId, info]) =>
              `👤 <@${userId}> — YT: \`${info.channelId}\`\n📺 Channel ID: \`${info.channel}\`\n🌐 Guild: \`${info.guild}\``
          )
          .join('\n\n')
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
