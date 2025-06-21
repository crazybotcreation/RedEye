// src/commands/here.js
import fs from 'node:fs';
import path from 'node:path';
import { SlashCommandBuilder, ChannelType, PermissionFlagsBits } from 'discord.js';
import { commitYoutubeUsersFile } from '../utils/gitUtils.js';

const dataPath = path.join(process.cwd(), 'youtube-users.json');

export default {
  data: new SlashCommandBuilder()
    .setName('here')
    .setDescription('Set this channel as your YouTube drop zone!')
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .setDMPermission(false),

  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;
    const channelId = interaction.channel.id;

    // Load YouTube user data
    let users = {};
    if (fs.existsSync(dataPath)) {
      users = JSON.parse(fs.readFileSync(dataPath, 'utf8') || '{}');
    }

    // Check if user has verified before
    if (!users[userId] || !users[userId].channelId) {
      return await interaction.reply({
        content: '❌ You haven’t verified your YouTube channel yet. Use `/getredeye` first!',
        ephemeral: true
      });
    }

    // Update their config
    users[userId].channel = channelId;
    users[userId].guild = guildId;

    // Save and commit
    fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
    commitYoutubeUsersFile();

    await interaction.reply({
      content: '✅ This channel has been set as your YouTube drop zone. RedEye will post new uploads here.',
      ephemeral: true
    });
  }
};
