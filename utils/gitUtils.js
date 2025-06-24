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

    // Set Git config
    console.log('⚙️ Setting Git config...');
    execSync('git config user.name "RedEyeBot"');
    execSync('git config user.email "redeye@bot.com"');

    // 🛡️ Trust GitHub host
    execSync('mkdir -p ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts');

    // Ensure Git uses the correct private key
    process.env.GIT_SSH_COMMAND = 'ssh -i ~/.ssh/id_ed25519 -o IdentitiesOnly=yes';

    // Ensure remote 'origin' exists or recreate it
    const remotes = execSync('git remote').toString().trim().split('\n');
    if (!remotes.includes('origin')) {
      console.log('🔗 Adding Git remote origin...');
      execSync('git remote add origin git@github.com:crazybotcreation/RedEye.git');
    } else {
      console.log('🔗 Setting Git remote...');
      execSync('git remote set-url origin git@github.com:crazybotcreation/RedEye.git');
    }

    // Stage file
    execSync(`git add ${filePath}`);

    // Check if there's a diff
    const diff = execSync('git diff --cached --name-only').toString().trim();
    console.log('🔍 Git diff result:', diff || '[no changes]');
    if (!diff.includes('youtube-users.json')) {
      console.log('🟡 No changes in youtube-users.json — skipping commit.');
      return;
    }

    // Commit with timestamp
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
    execSync(`git commit -m "🔁 Update youtube-users.json at ${timestamp}"`);

    // Push changes
    execSync('git push origin main');
    console.log('✅ youtube-users.json committed and pushed!');
  } catch (err) {
    console.error('❌ Git operation failed:', err.message);
  }
}
