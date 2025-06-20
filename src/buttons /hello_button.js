export default {
  customId: 'hello_button',
  async execute(interaction) {
    await interaction.reply({
      content: 'Hello from the button!',
      ephemeral: true
    });
  }
}
