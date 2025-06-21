// src/utils/git-push.js
import { execSync } from 'node:child_process';
import fs from 'fs';
import path from 'path';

export default function gitPush(commitMessage = 'Update youtube-users.json') {
  try {
    const projectDir = process.cwd();
    const filePath = path.join(projectDir, 'youtube-users.json');

    if (!fs.existsSync(filePath)) {
      console.warn('⚠️ youtube-users.json not found. Skipping Git push.');
      return;
    }

    execSync('git config --global user.email "crazyechooo@gmail.com"');
    execSync('git config --global user.name "RedEye AutoBot"');

    execSync('git add youtube-users.json');
    execSync(`git commit -m "${commitMessage}"`);
    execSync('git push origin main');

    console.log('✅ Auto-pushed youtube-users.json to GitHub!');
  } catch (err) {
    console.warn('❌ Auto Git push failed:', err.message);
  }
        }
