import { Client, GatewayIntentBits, Collection, Events } from 'discord.js';
import { config } from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

config();

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.commands = new Collection();
client.buttons = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  if (commandFiles.length === 0) {
    console.warn('⚠️ /commands directory is empty.');
  } else {
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = await import(`file://${filePath}`);
      if (command.default?.data && command.default?.execute) {
        client.commands.set(command.default.data.name, command.default);
      }
    }
  }
} else {
  console.warn('⚠️ No /commands directory found.');
}

// Load button handlers
const buttonsPath = path.join(__dirname, 'buttons');
if (fs.existsSync(buttonsPath)) {
  const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));
  for (const file of buttonFiles) {
    const filePath = path.join(buttonsPath, file);
    const button = await import(`file://${filePath}`);
    if (button.default?.customId && button.default?.execute) {
      client.buttons.set(button.default.customId, button.default);
    }
  }
}

// Handle interactions
client.on(Events.InteractionCreate, async interaction => {
  try {
    // Slash command
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      await command.execute(interaction);
    }

    // Button interaction
    else if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);
      if (!button) return;
      await button.execute(interaction);
    }

    // Modal submission
    else if (interaction.isModalSubmit()) {
      if (interaction.customId === 'youtube_verify_modal') {
        const channelName = interaction.fields.getTextInputValue('channel_name');
        const channelLink = interaction.fields.getTextInputValue('channel_link');
        const subscriberCount = interaction.fields.getTextInputValue('subscriber_count');

        const count = parseInt(subscriberCount);
        if (isNaN(count) || count < 10) {
          return await interaction.reply({
            content: '❌ You must have at least 10 subscribers to qualify.',
            ephemeral: true,
          });
        }

        await interaction.reply({
          content: `✅ Thank you for verifying, **${channelName}**!\n🔗 ${channelLink}\n📊 Subscribers: ${count}`,
          ephemeral: true,
        });

        // (Optional) Save to file or DB here
      }
    }
  } catch (error) {
    console.error('Interaction error:', error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: '⚠️ Error occurred during interaction.', ephemeral: true });
    } else {
      await interaction.reply({ content: '⚠️ Something went wrong.', ephemeral: true });
    }
  }
});

// Send DM to server owner on bot join
client.on(Events.GuildCreate, async guild => {
  try {
    const owner = await guild.fetchOwner();
    owner.send(
      `👋 Thanks for adding RedEye bot!\n\n⚠️ Warning: This bot can message in any channel. Please run the command \`/here\` to set a working channel, or \`/dontmore\` to stop updates.\n\nUse \`/getredeye\` to verify yourself as a YouTube content creator.`
    );
  } catch (error) {
    console.error('❌ Could not send DM to server owner:', error);
  }
});

// Ready
client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
