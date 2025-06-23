// src/commands/dontmore.js
import fs from 'node:fs';
import path from 'node:path';
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { commitYoutubeUsersFile } from '../utils/gitUtils.js'; // ✅ fixed casing

const dataPath = path.join(process.cwd(), 'youtube-users.json');

export default {
  data: new SlashCommandBuilder()
    .setName('dontmore')
    .setDescription('Stop RedEye from posting your videos anywhere.')
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .setDMPermission(false),

  async execute(interaction) {
    const userId = interaction.user.id;

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

    users[userId].channel = null;
    users[userId].guild = null;

    fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
    commitYoutubeUsersFile();

    await interaction.reply({
      content: '✅ RedEye will no longer post your videos until you set a new channel with `/here`.',
      ephemeral: true
    });
  }
}
