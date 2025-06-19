// src/buttons/redeye_help.js
export default {
  customId: 'redeye_help',
  async execute(interaction) {
    await interaction.reply({
      content:
        'ℹ️ To verify your YouTube channel:\n\n1. Click **"Submit Channel Info"**.\n2. Enter your YouTube link and subscriber count.\n3. We’ll notify you if you’re verified!\n\nMinimum requirement: **10 subscribers**.\n\nThis process is private and secure.',
      ephemeral: true
    });
  }
}
