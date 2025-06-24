// src/utils/gitUtils.js
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

export async function commitYoutubeUsersFile() {
  const filePath = 'youtube-users.json';

  // 🔧 Read and force-write with newline to ensure Git sees change
  const content = fs.readFileSync(filePath, 'utf-8');
  const updatedContent = content.trim() + '\n';
  fs.writeFileSync(filePath, updatedContent);

  console.log(`📁 Writing to: ${filePath}`);
  console.log(`📝 Data to save: ${updatedContent}`);

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

    // Step 3: Ensure Git origin exists
    const configPath = path.join(process.cwd(), '.git/config');
    if (!fs.existsSync(configPath) || !fs.readFileSync(configPath, 'utf8').includes('origin')) {
      console.log('🔧 [Git Commit] Reinitializing git repo...');
      execSync('git init');
      execSync('git remote remove origin || true');
      execSync(`git remote add origin ${repoURL}`);
    }

    // Step 4: Commit and Push
    execSync('git add youtube-users.json');
    execSync('git commit -m "🔄 Update youtube-users.json" --allow-empty');
    execSync('git push origin main');

    console.log('✅ youtube-users.json committed and pushed!');
  } catch (err) {
    console.error('❌ Git push failed:', err.message);
  }
}
