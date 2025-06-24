// src/utils/gitUtils.js
import fs from 'fs';
import { execSync } from 'child_process';

const filePath = 'youtube-users.json';
const remoteName = 'origin';

export async function commitYoutubeUsersFile() {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error('GITHUB_TOKEN not found in environment.');

    const repoURL = `https://crazybotcreation:${token}@github.com/crazybotcreation/RedEye.git`;

    // Step 1: Git Identity
    execSync('git config --global user.email "bot@redeye.app"');
    execSync('git config --global user.name "RedEye Bot"');

    // Step 2: Add Remote if missing
    try {
      execSync(`git remote set-url ${remoteName} ${repoURL}`);
    } catch {
      execSync(`git remote add ${remoteName} ${repoURL}`);
    }

    // Step 3: Pull existing file from GitHub (Soul Sync)
    if (!fs.existsSync(filePath) || fs.readFileSync(filePath, 'utf-8').trim() === '{}') {
      console.log('🌩️ [Soul Sync] Missing or empty soul, pulling from GitHub...');
      try {
        execSync(`git pull ${remoteName} main`);
        console.log('🧠 [Soul Sync] Synced successfully from GitHub!');
      } catch (err) {
        console.error('❌ [Soul Sync] GitHub pull failed:', err.message);
      }
    }

    // Step 4: Commit Changes
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      console.log(`📁 Writing to: ${filePath}`);
      console.log(`📝 Data to save: ${content}`);

      execSync(`git add ${filePath}`);
      execSync('git commit -m "🔄 Update youtube-users.json" --allow-empty');
      execSync(`git push ${remoteName} main`);
      console.log('✅ youtube-users.json committed and pushed!');
    }
  } catch (err) {
    console.error('❌ Git process failed:', err.message);
  }
                                      
