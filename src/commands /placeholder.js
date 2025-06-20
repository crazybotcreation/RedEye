export default {
  data: {
    name: 'placeholder',
    toJSON: () => ({ name: 'placeholder', description: 'Placeholder command' })
  },
  async execute(interaction) {
    await interaction.reply({ content: 'Placeholder command', ephemeral: true });
  }
};
