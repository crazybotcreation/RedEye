// src/commands/here.js
import { SlashCommandBuilder } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { commitYoutubeUsersFile } from '../utils/gitUtils.js';

const dataPath = path.join(process.cwd(), 'youtube-users.json');

export default {
  data: new SlashCommandBuilder()
    .setName('here')
    .setDescription('Set this channel as your YouTube video post destination.'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      const channelId = interaction.channel.id;
      const guildId = interaction.guild.id;

      let db = {};
      if (fs.existsSync(dataPath)) {
        db = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      }

      if (!db[userId]) {
        return interaction.reply({
          content: '❌ You must first verify your YouTube channel with `/getredeye`.',
          ephemeral: true
        });
      }

      db[userId].channel = channelId;
      db[userId].guild = guildId;

      fs.writeFileSync(dataPath, JSON.stringify(db, null, 2));
      commitYoutubeUsersFile();

      await interaction.reply({
        content: '✅ This channel has been set to receive your YouTube uploads.',
        ephemeral: true
      });
    } catch (err) {
      console.error('❌ Failed to execute /here command:', err);
      interaction.reply({
        content: '❌ An error occurred while setting the channel.',
        ephemeral: true
      });
    }
  }
}
