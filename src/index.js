import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { readdirSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcPath = path.join(__dirname);
const commandsPath = path.join(srcPath, 'commands');
const buttonsPath = path.join(srcPath, 'buttons');
const modalsPath = path.join(srcPath, 'modals');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildInvites],
});

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.inviterMap = new Map();

console.log("🧠 God Mode Diagnostics Enabled");
console.log("📂 Working Directory:", process.cwd());
console.log("📂 __dirname:", __dirname);
console.log("📁 Commands Path:", commandsPath);
console.log("📁 Buttons Path:", buttonsPath);
console.log("📁 Modals Path:", modalsPath);

// ✅ Register slash commands
const deployCommands = async () => {
  const commandsToDeploy = [];
  if (existsSync(commandsPath)) {
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    console.log("📄 Found command files:", commandFiles);

    for (const file of commandFiles) {
      const cmd = await import(`./commands/${file}`);
      if (cmd.default?.data && cmd.default?.execute) {
        client.commands.set(cmd.default.data.name, cmd.default);
        commandsToDeploy.push(cmd.default.data.toJSON());
        console.log(`✅ Loaded command: ${cmd.default.data.name}`);
      }
    }
  } else {
    console.log("❌ Commands folder missing!");
  }

  if (commandsToDeploy.length) {
    console.log("📤 Ready to deploy:", commandsToDeploy.map(c => `/${c.name}`).join(', '));
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    try {
      console.log("🚀 Deploying slash commands globally...");
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: commandsToDeploy,
      });
      console.log("✅ Slash commands deployed!");
    } catch (err) {
      console.error("❌ Failed to deploy slash commands:", err);
    }
  } else {
    console.log("⚠️ No slash commands to deploy.");
  }
};

// ✅ Register buttons
if (existsSync(buttonsPath)) {
  const buttonFiles = readdirSync(buttonsPath).filter(file => file.endsWith('.js'));
  for (const file of buttonFiles) {
    const btn = await import(`./buttons/${file}`);
    if (btn.default?.customId && btn.default?.execute) {
      client.buttons.set(btn.default.customId, btn.default);
      console.log(`✅ Loaded button: ${btn.default.customId}`);
    }
  }
} else {
  console.log("⚠️ Buttons path does NOT exist!");
}

// ✅ Register modals
if (existsSync(modalsPath)) {
  const modalFiles = readdirSync(modalsPath).filter(file => file.endsWith('.js'));
  for (const file of modalFiles) {
    const mdl = await import(`./modals/${file}`);
    if (mdl.default?.customId && mdl.default?.execute) {
      client.modals.set(mdl.default.customId, mdl.default);
      console.log(`✅ Loaded modal: ${mdl.default.customId}`);
    }
  }
} else {
  console.log("⚠️ Modals path does NOT exist!");
}

// ✅ Fetch inviter when bot joins
client.on('guildCreate', async (guild) => {
  try {
    const invites = await guild.invites.fetch();
    const inviter = invites.first()?.inviter;
    if (inviter) {
      client.inviterMap.set(guild.id, inviter.id);
      console.log(`📥 Bot invited by ${inviter.tag} to ${guild.name}`);
    } else {
      console.warn(`⚠️ Couldn't determine who invited me to ${guild.name}`);
    }
  } catch (err) {
    console.error(`❌ Failed to fetch invites for ${guild.name}:`, err);
  }
});

// ✅ Handle slash commands
client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return interaction.reply({ content: "❌ Command not found!", ephemeral: true });
    try {
      await command.execute(interaction, client);
    } catch (err) {
      console.error(`❌ Error executing /${interaction.commandName}:`, err);
      interaction.reply({ content: "❌ Error while executing command!", ephemeral: true });
    }
  } else if (interaction.isButton()) {
    const button = client.buttons.get(interaction.customId);
    if (button) await button.execute(interaction, client);
  } else if (interaction.isModalSubmit()) {
    const modal = client.modals.get(interaction.customId);
    if (modal) await modal.execute(interaction, client);
  }
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

await deployCommands();
client.login(process.env.TOKEN)
