// src/utils/gitUtils.js
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const dataPath = path.join(process.cwd(), 'youtube-users.json');

export function commitYoutubeUsersFile() {
  try {
    if (!fs.existsSync(dataPath)) {
      console.warn('📂 youtube-users.json does not exist. Skipping commit.');
      return;
    }

    // Log current content before committing
    const contents = fs.readFileSync(dataPath, 'utf8');
    console.log('📄 Commit Content Preview:', contents);

    // Configure Git identity
    execSync('git config user.name "RedEye Bot"');
    execSync('git config user.email "redeye-bot@users.noreply.github.com"');

    // Git operations
    console.log('📥 Running: git add youtube-users.json');
    execSync('git add youtube-users.json');

    console.log('📝 Running: git commit');
    execSync('git commit -m "🔁 Update youtube-users.json [auto-commit]"');

    console.log('🚀 Running: git push origin main');
    execSync('git push origin main');

    console.log('✅ Auto-committed youtube-users.json to GitHub');
  } catch (err) {
    console.error('❌ Git commit failed:', err.message);
  }
}

export function debugGitStatus() {
  try {
    console.log('📡 GIT REMOTE:');
    console.log(execSync('git remote -v').toString());

    console.log('📂 GIT STATUS:');
    console.log(execSync('git status').toString());

    console.log('📄 GIT LOG:');
    console.log(execSync('git log -n 1').toString());
  } catch (err) {
    console.error('❌ Git diagnostics failed:', err.message);
  }
}
