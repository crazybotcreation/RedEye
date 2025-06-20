// src/buttons/redeye_help.js
export default {
  customId: 'redeye_help',
  async execute(interaction) {
    await interaction.reply({
      content: 'This is the RedEye help button response!',
      ephemeral: true
    });
  }
};
