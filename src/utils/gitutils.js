// src/utils/gitUtils.js
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const dataPath = path.join(process.cwd(), 'youtube-users.json');

export function commitYoutubeUsersFile() {
  try {
    if (!fs.existsSync(dataPath)) {
      console.warn('📂 youtube-users.json does not exist. Skipping commit.');
      return;
    }

    // Log file preview
    const content = fs.readFileSync(dataPath, 'utf8');
    console.log('📄 Commit Content Preview:', content);

    execSync('git config user.name "RedEye Bot"');
    execSync('git config user.email "redeye@bot"');

    execSync('git add youtube-users.json');
    execSync('git commit -m "✅ Auto update youtube-users.json"');
    execSync('git push origin main');

    console.log('✅ Auto-committed youtube-users.json to GitHub');
  } catch (err) {
    console.error('❌ Git commit failed:', err.message);
  }
      }
