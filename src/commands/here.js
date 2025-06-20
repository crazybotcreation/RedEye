// src/commands/here.js
import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';

export default {
  data: new SlashCommandBuilder()
    .setName('here')
    .setDescription('Set this channel as RedEye\'s working channel.'),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const channelId = interaction.channel.id;

    // Save to file system (you can upgrade to database later)
    const configPath = './channel-config.json';
    let configs = {};
    if (fs.existsSync(configPath)) {
      configs = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
    configs[guildId] = channelId;
    fs.writeFileSync(configPath, JSON.stringify(configs, null, 2));

    await interaction.reply({ content: `✅ This channel is now set as my working area.`, ephemeral: true });
  }
}
