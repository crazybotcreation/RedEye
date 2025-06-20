export default {
  customId: 'placeholder_button',
  async execute(interaction) {
    await interaction.reply({ content: 'Placeholder button clicked!', ephemeral: true });
  }
};
