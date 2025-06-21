// src/utils/gitUtils.js
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const dataPath = path.join(process.cwd(), 'youtube-users.json');
const backupDir = path.join(process.cwd(), 'backups');

export function commitYoutubeUsersFile() {
  try {
    if (!fs.existsSync(dataPath)) {
      console.warn('📂 youtube-users.json does not exist. Skipping commit.');
      return;
    }

    // Ensure backup directory exists
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    // Create a backup of the file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `youtube-users-${timestamp}.json`);
    fs.copyFileSync(dataPath, backupFile);
    console.log(`📦 Backup created: ${backupFile}`);

    // Log current content
    const contents = fs.readFileSync(dataPath, 'utf8');
    console.log('📄 File content before git commit:', contents);

    // Git config
    execSync('git config user.name "RedEye Bot"');
    execSync('git config user.email "redeye@bot"');

    // Git operations
    console.log('📥 Running: git add youtube-users.json');
    execSync('git add youtube-users.json');

    console.log('📝 Running: git commit');
    execSync('git commit -m "🔁 Update youtube-users.json [auto-commit]"');

    console.log('🚀 Running: git push origin main --force');
    execSync('git push origin main --force');

    console.log('✅ Git push forced. Check GitHub for file updates.');
  } catch (err) {
    console.error('❌ Git commit failed:', err.message);
  }
                
