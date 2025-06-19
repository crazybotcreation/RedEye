import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('getredeye')
    .setDescription('Verify as a YouTube content creator'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🎥 YouTube Verification')
      .setDescription(
        `To verify your YouTube account, please provide details using the button below.\n\n` +
        `✅ Minimum 10 subscribers required.\n🔒 This process is private and only visible to you.`
      )
      .setColor('Red')
      .setFooter({ text: 'RedEye Bot — Content Creator Verification' })
      .setTimestamp();

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('open_youtube_verify_form')
        .setLabel('Verify Now')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      embeds: [embed],
      components: [button],
      ephemeral: true
    });
  }
};
