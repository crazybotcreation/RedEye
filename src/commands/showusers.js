// src/commands/showusers.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

const dataPath = path.join(process.cwd(), 'youtube-users.json');

export default {
  data: new SlashCommandBuilder()
    .setName('showusers')
    .setDescription('📄 Shows all saved verified users (only for bot owner).'),

  async execute(interaction) {
    // ✅ Only allow you (the king)
    if (interaction.user.id !== '1354501822429265921') {
      return interaction.reply({
        content: '🚫 You are not authorized to use this command.',
        ephemeral: true
      });
    }

    if (!fs.existsSync(dataPath)) {
      return interaction.reply({ content: '❌ No data found.', ephemeral: true });
    }

    let data;
    try {
      data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (err) {
      return interaction.reply({ content: '❌ Failed to read saved data.', ephemeral: true });
    }

    const entries = Object.entries(data);
    if (entries.length === 0) {
      return interaction.reply({ content: '📭 No users verified yet.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('📄 Verified YouTube Users')
      .setColor(0xff0000);

    for (const [userId, info] of entries) {
      embed.addFields({
        name: `👤 <@${userId}>`,
        value: `🔗 YouTube: \`${info.channelId}\`\n💬 Channel: <#${info.channel}>\n🛡 Guild ID: \`${info.guild}\``,
        inline: false
      });
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
