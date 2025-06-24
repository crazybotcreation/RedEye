// src/utils/gitUtils.js
import fs from 'fs';
import { execSync } from 'child_process';

export async function commitYoutubeUsersFile() {
  const filePath = 'youtube-users.json';

  if (!fs.existsSync(filePath)) {
    console.error('❌ youtube-users.json not found. Cannot commit.');
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  console.log(`📁 Writing to: ${filePath}`);
  console.log(`📝 Data to save: ${content}`);

  try {
    // Step 1: Configure Git identity
    execSync('git config --global user.email "bot@redeye.app"');
    execSync('git config --global user.name "RedEye Bot"');

    // Step 2: Token setup
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error('GITHUB_TOKEN not found in environment.');

    const repoURL = `https://crazybotcreation:${token}@github.com/crazybotcreation/RedEye.git`;

    // Step 3: Reset origin safely (ignore if not exists)
    try {
      execSync('git remote remove origin');
    } catch (e) {
      console.warn('⚠️ No existing remote to remove.');
    }

    execSync(`git remote add origin ${repoURL}`);

    // Step 4: Add, commit, push
    execSync('git add youtube-users.json');
    execSync('git commit -m "🔄 Update youtube-users.json" --allow-empty');
    execSync('git push origin main');

    console.log('✅ youtube-users.json committed and pushed!');
  } catch (err) {
    console.error('❌ Git push failed:', err.message);
  }
}
