// utils/gitUtils.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export function commitYoutubeUsersFile() {
  const filePath = path.join(process.cwd(), 'youtube-users.json');

  try {
    // Set Git author info
    execSync('git config user.name "RedEyeBot"');
    execSync('git config user.email "redeye@bot.com"');

    // Force correct SSH remote
    execSync('git remote set-url origin git@github.com:crazybotcreation/RedEye.git');

    // Stage file
    execSync(`git add ${filePath}`);

    // Only commit if changes exist
    const diff = execSync('git diff --cached --name-only').toString().trim();
    if (!diff.includes('youtube-users.json')) {
      console.log('🟡 No changes in youtube-users.json — skipping commit.');
      return;
    }

    // Commit with timestamp
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
    execSync(`git commit -m "🔁 Update youtube-users.json at ${timestamp}"`);

    // Push
    execSync('git push origin main');
    console.log('✅ youtube-users.json committed and pushed!');
  } catch (err) {
    console.error('❌ Git operation failed:', err.message);
  }
}
