import { SlashCommandBuilder } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { commitYoutubeUsersFile } from '../utils/gitUtils.js';

const dataPath = path.join(process.cwd(), 'youtube-users.json');
const OWNER_ID = '1354501822429265921';

export default {
  data: new SlashCommandBuilder()
    .setName('removeverified')
    .setDescription('Remove a verified user from memory (only for owner).')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Select the user to remove')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (interaction.user.id !== OWNER_ID) {
      return interaction.reply({
        content: '❌ You are not allowed to use this command.',
        ephemeral: true
      });
    }

    const target = interaction.options.getUser('target');
    const targetId = target.id;

    if (!fs.existsSync(dataPath)) {
      return interaction.reply({
        content: '⚠️ No data file found.',
        ephemeral: true
      });
    }

    let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    if (!data[targetId]) {
      return interaction.reply({
        content: `⚠️ No verification found for <@${targetId}>.`,
        ephemeral: true
      });
    }

    delete data[targetId];
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    await commitYoutubeUsersFile();

    await interaction.reply({
      content: `✅ Removed verification data for <@${targetId}>.`,
      ephemeral: true
    });
  }
};
