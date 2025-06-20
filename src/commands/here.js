import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'channel-config.json');

export default {
  data: new SlashCommandBuilder()
    .setName('here')
    .setDescription('Set this channel as RedEye’s working channel'),
  async execute(interaction) {
    try {
      const inviterId = interaction.client.inviterMap?.get(interaction.guild.id);
      if (interaction.user.id !== inviterId) {
        return await interaction.reply({
          content: `❌ Only the person who invited me to this server can use this command.`,
          ephemeral: true
        });
      }

      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      config[interaction.guild.id] = interaction.channel.id;
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      await interaction.reply({ content: '✅ This channel is now set as my working area.', ephemeral: true });
    } catch (err) {
      console.error('Error in /here:', err);
      await interaction.reply({ content: '❌ Failed to set channel.', ephemeral: true });
    }
  }
};
