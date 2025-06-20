// src/buttons/placeholder.js
export default {
  customId: 'placeholder_button',
  async execute(interaction) {
    await interaction.reply({
      content: '✅ Button test executed successfully!',
      ephemeral: true
    });
  }
};
