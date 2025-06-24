// utils/gitUtils.js
import fs from 'fs';
import { execSync } from 'child_process';

const filePath = 'youtube-users.json';

export async function syncSoulFromGithub() {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error('GITHUB_TOKEN not set.');

    const repoURL = `https://crazybotcreation:${token}@github.com/crazybotcreation/RedEye.git`;

    execSync(`git config --global user.email "bot@redeye.app"`);
    execSync(`git config --global user.name "RedEye Bot"`);

    execSync(`git remote remove origin || true`);
    execSync(`git remote add origin ${repoURL}`);

    const fileExists = fs.existsSync(filePath);
    const fileContent = fileExists ? fs.readFileSync(filePath, 'utf-8') : '{}';

    if (!fileExists || fileContent.trim() === '{}' || fileContent.trim() === '') {
      console.log('🌩️ [Soul Sync] Missing or empty soul, pulling from GitHub...');
      execSync('git pull origin main');
      console.log('✅ [Soul Sync] Pulled successfully.');
    } else {
      console.log('🧠 [Soul Sync] Local soul already valid.');
    }
  } catch (err) {
    console.error('❌ [Soul Sync] GitHub pull failed:', err.message);
  }
}

export async function commitYoutubeUsersFile() {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    console.log(`📁 Writing to: ${filePath}`);
    console.log(`📝 Data to save: ${content}`);

    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error('GITHUB_TOKEN not found in environment variables.');

    const repoURL = `https://crazybotcreation:${token}@github.com/crazybotcreation/RedEye.git`;

    execSync(`git config --global user.email "bot@redeye.app"`);
    execSync(`git config --global user.name "RedEye Bot"`);

    execSync(`git remote remove origin || true`);
    execSync(`git remote add origin ${repoURL}`);

    execSync('git add youtube-users.json');
    execSync('git commit -m "🔄 Update youtube-users.json" --allow-empty');
    execSync('git push origin main');

    console.log('✅ youtube-users.json committed and pushed!');
  } catch (err) {
    console.error('❌ Git push failed:', err.message);
  }
}
