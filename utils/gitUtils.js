// utils/gitUtils.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export function commitYoutubeUsersFile() {
  const filePath = path.join(process.cwd(), 'youtube-users.json');

  console.log('📁 Writing to:', filePath);

  try {
    // Check file contents
    const raw = fs.readFileSync(filePath, 'utf-8');
    console.log('📝 Data to save:', raw);

    // Set Git config
    console.log('⚙️ Setting Git config...');
    execSync('git config user.name "RedEyeBot"');
    execSync('git config user.email "redeye@bot.com"');

    // Ensure correct SSH remote
    console.log('🔗 Setting Git remote...');
    execSync('git remote set-url origin git@github.com:crazybotcreation/RedEye.git');

    // Stage the file
    console.log('📦 Staging file...');
    execSync(`git add ${filePath}`);

    // Check for changes
    const diff = execSync('git diff --cached --name-only').toString().trim();
    console.log('🔍 Git diff result:', diff);

    if (!diff.includes('youtube-users.json')) {
      console.log('🟡 No changes in youtube-users.json — skipping commit.');
      return;
    }

    // Commit
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
    console.log('✅ Committing changes...');
    execSync(`git commit -m "🔁 Update youtube-users.json at ${timestamp}"`);

    // Push
    console.log('📤 Pushing to GitHub...');
    execSync('git push origin main');
    console.log('✅ youtube-users.json committed and pushed!');
  } catch (err) {
    console.error('❌ Git operation failed:', err.message);
  }
}
