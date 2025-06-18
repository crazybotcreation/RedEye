const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getredeye')
    .setDescription('Start RedEye setup for your YouTube channel (minimum 10 subs required)')
    .setDMPermission(true), // Allow command in DM

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('redeye_verify_modal')
      .setTitle('YouTube Channel Verification');

    const ytLink = new TextInputBuilder()
      .setCustomId('yt_channel_link')
      .setLabel('🔗 Your YouTube Channel Link')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('https://www.youtube.com/channel/...')
      .setRequired(true);

    const subCount = new TextInputBuilder()
      .setCustomId('yt_sub_count')
      .setLabel('👥 Current Subscriber Count')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('e.g. 15')
      .setRequired(true);

    const row1 = new ActionRowBuilder().addComponents(ytLink);
    const row2 = new ActionRowBuilder().addComponents(subCount);

    modal.addComponents(row1, row2);

    await interaction.showModal(modal);
  }
};
