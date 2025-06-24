import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export function commitYoutubeUsersFile() {
  const filePath = path.join(process.cwd(), 'youtube-users.json');

  try {
    console.log('📁 Writing to:', filePath);

    const data = fs.readFileSync(filePath, 'utf-8');
    console.log('📝 Data to save:', data);

    // 🔐 Get GitHub token
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GITHUB_TOKEN is not set in environment variables.');
    }

    // ⚙️ Set Git identity
    console.log('⚙️ Setting Git config...');
    execSync('git config user.name "RedEyeBot"');
    execSync('git config user.email "redeye@bot.com"');

    // 🔗 Ensure remote is set to HTTPS with token
    const remoteUrl = `https://${token}:x-oauth-basic@github.com/crazybotcreation/RedEye.git`;
    const remotes = execSync('git remote').toString().trim().split('\n');
    if (!remotes.includes('origin')) {
      console.log('🔗 Adding HTTPS remote with token...');
      execSync(`git remote add origin "${remoteUrl}"`);
    } else {
      console.log('🔗 Updating HTTPS remote with token...');
      execSync(`git remote set-url origin "${remoteUrl}"`);
    }

    // ➕ Stage file
    execSync(`git add ${filePath}`);

    // 🧠 Check for changes
    const diff = execSync('git diff --cached --name-only').toString().trim();
    console.log('🔍 Git diff result:', diff || '[no changes]');
    if (!diff.includes('youtube-users.json')) {
      console.log('🟡 No changes in youtube-users.json — skipping commit.');
      return;
    }

    // 📝 Commit with timestamp
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
    execSync(`git commit -m "🔁 Update youtube-users.json at ${timestamp}"`);

    // 🚀 Push
    execSync('git push origin main');
    console.log('✅ youtube-users.json committed and pushed!');
  } catch (err) {
    console.error('❌ Git operation failed:', err.message);
  }
}
