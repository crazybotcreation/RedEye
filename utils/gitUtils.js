// utils/gitUtils.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export function commitYoutubeUsersFile() {
  const filePath = path.join(process.cwd(), 'youtube-users.json');

  try {
    // Set Git author info (only once per session)
    execSync('git config user.name "RedEyeBot"');
    execSync('git config user.email "redeye@bot.com"');

    // Stage the file
    execSync(`git add ${filePath}`);

    // Check if there are actual changes before committing
    const diff = execSync('git diff --cached --name-only').toString().trim();
    if (!diff.includes('youtube-users.json')) {
      console.log('🟡 No changes in youtube-users.json — skipping commit.');
      return;
    }

    // Commit with timestamp
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
    execSync(`git commit -m "🔁 Update youtube-users.json at ${timestamp}"`);

    // Push to GitHub
    execSync('git push origin main');
    console.log('✅ youtube-users.json committed and pushed!');
  } catch (err) {
    console.error('❌ Git operation failed:', err.message);
  }
      }
