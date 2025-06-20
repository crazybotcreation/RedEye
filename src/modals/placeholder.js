export default {
  customId: 'placeholder_modal',
  async execute(interaction) {
    await interaction.reply({ content: 'Placeholder modal submitted!', ephemeral: true });
  }
};
