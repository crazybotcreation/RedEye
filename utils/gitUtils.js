// utils/gitUtils.js
import fs from 'fs';
import { execSync } from 'child_process';

export async function commitYoutubeUsersFile() {
  const filePath = 'youtube-users.json';
  const content = fs.readFileSync(filePath, 'utf-8');

  console.log(`📁 Writing to: ${filePath}`);
  console.log(`📝 Data to save: ${content}`);

  try {
    // Step 1: Git config
    execSync('git config --global user.email "bot@redeye.app"');
    execSync('git config --global user.name "RedEye Bot"');

    // Step 2: GitHub Token (from environment)
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GITHUB_TOKEN not found in environment variables.');
    }

    const repoURL = `https://crazybotcreation:${token}@github.com/crazybotcreation/RedEye.git`;

    execSync(`git remote remove origin || true`);
    execSync(`git remote add origin ${repoURL}`);

    // Step 3: Commit and Push
    execSync('git add youtube-users.json');
    execSync('git commit -m "🔄 Update youtube-users.json" --allow-empty');
    execSync('git push origin main');

    console.log('✅ youtube-users.json committed and pushed!');
  } catch (err) {
    console.error('❌ Git push failed:', err.message);
  }
