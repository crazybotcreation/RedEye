import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'youtube-users.json');

export default {
  data: new SlashCommandBuilder()
    .setName('here')
    .setDescription('Set this channel as the bot’s post channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels), // Only admins

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const userId = interaction.user.id;
    const guildId = interaction.guildId;
    const channelId = interaction.channelId;

    let data = {};
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      data = raw ? JSON.parse(raw) : {};
    }

    // Apply new default channel to all users in this guild
    for (const user of Object.keys(data)) {
      if (data[user].guild === guildId) {
        data[user].channel = channelId;
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    await interaction.editReply({
      content: `✅ Bot will now post videos in <#${channelId}>`,
      flags: 64
    });
  }
};
