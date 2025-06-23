import fs from 'node:fs';
import path from 'node:path';
import { SlashCommandBuilder, ChannelType, PermissionFlagsBits } from 'discord.js';
import { commitYoutubeUsersFile } from '../utils/gitUtils.js'; // ✅ Correct casing!

const dataPath = path.join(process.cwd(), 'youtube-users.json');

export default {
  data: new SlashCommandBuilder()
    .setName('here')
    .setDescription('Set this channel for RedEye to post your new videos.')
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .setDMPermission(false)
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Where should RedEye post your new YouTube videos?')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const channel = interaction.options.getChannel('channel');

    let users = {};
    if (fs.existsSync(dataPath)) {
      users = JSON.parse(fs.readFileSync(dataPath, 'utf8') || '{}');
    }

    if (!users[userId]) {
      return await interaction.reply({
        content: '❌ You are not verified yet.',
        ephemeral: true
      });
    }

    users[userId].channel = channel.id;
    users[userId].guild = interaction.guild.id;

    fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
    commitYoutubeUsersFile();

    await interaction.reply({
      content: `✅ RedEye will now post your new videos in ${channel}.`,
      ephemeral: true
    });
  }
};
