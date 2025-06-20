// src/buttons/hello_button.js
export default {
  customId: 'hello_button',
  async execute(interaction) {
    await interaction.reply('👋 Hello from the button!');
  }
};
