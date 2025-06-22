// deploy_commands.js
import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
config();

const commands = [];
const foldersPath = path.join(process.cwd(), 'src/commands');
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import(`./src/commands/${file}`);
  commands.push(command.default.data.toJSON());
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('🔁 Refreshing slash commands...');
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands
    });
    console.log('✅ Slash commands deployed!');
  } catch (error) {
    console.error('❌ Failed to deploy:', error);
  }
})()
