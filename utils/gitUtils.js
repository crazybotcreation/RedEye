// utils/gitUtils.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export function commitYoutubeUsersFile() {
  const filePath = path.join(process.cwd(), 'youtube-users.json');

  try {
    console.log('📁 Writing to:', filePath);

    const data = fs.readFileSync(filePath, 'utf-8');
    console.log('📝 Data to save:', data);

    // 🔑 Write SSH key from .env to /tmp/github_key
    const privateKey = process.env.GIT_SSH_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('GIT_SSH_PRIVATE_KEY is not set in environment variables.');
    }

    const keyPath = '/tmp/github_key';
    fs.writeFileSync(keyPath, privateKey, { mode: 0o600 });
    process.env.GIT_SSH_COMMAND = `ssh -i ${keyPath} -o IdentitiesOnly=yes`;

    // ⚙️ Git identity config
    console.log('⚙️ Setting Git config...');
    execSync('git config user.name "RedEyeBot"');
    execSync('git config user.email "redeye@bot.com"');

    // 🛡️ Trust GitHub host
    execSync('mkdir -p ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts');

    // 🔗 Add or update remote
    const remotes = execSync('git remote').toString().trim().split('\n');
    if (!remotes.includes('origin')) {
      console.log('🔗 Adding Git remote origin...');
      execSync('git remote add origin git@github.com:crazybotcreation/RedEye.git');
    } else {
      console.log('🔗 Setting Git remote...');
      execSync('git remote set-url origin git@github.com:crazybotcreation/RedEye.git');
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
