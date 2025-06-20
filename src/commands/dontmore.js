// src/commands/dontmore.js
import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'channel-config.json');

export default {
  data: new SlashCommandBuilder()
    .setName('dontmore')
    .setDescription('Stop RedEye from messaging in this channel'),

  async execute(interaction) {
    try {
      const inviterId = interaction.client.inviterMap?.get(interaction.guild.id);
      const ownerId = interaction.guild.ownerId;

      if (interaction.user.id !== inviterId && interaction.user.id !== ownerId) {
        return await interaction.reply({
          content: '❌ Only the server owner or the person who invited me can use this command.',
          ephemeral: true
        });
      }

      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

      if (config[interaction.guild.id] === interaction.channel.id) {
        delete config[interaction.guild.id];
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        await interaction.reply({
          content: '✅ I’ll now stop messaging in this channel.',
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: 'ℹ️ I wasn’t messaging in this channel already.',
          ephemeral: true
        });
      }

    } catch (err) {
      console.error('Error in /dontmore:', err);
      await interaction.reply({
        content: '❌ Failed to update settings.',
        ephemeral: true
      });
    }
  }
}
