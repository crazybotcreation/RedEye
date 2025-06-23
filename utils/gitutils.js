// src/utils/gitutils.js
import { exec } from 'child_process';
import path from 'path';

export function commitYoutubeUsersFile() {
  const repoPath = process.cwd();
  const file = 'youtube-users.json';

  exec(`git add ${file} && git commit -m "update ${file}" && git push`, { cwd: repoPath }, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Git commit failed:', error.message);
      return;
    }
    if (stderr) {
      console.warn('⚠️ Git stderr:', stderr);
    }
    console.log('✅ Git commit and push successful:', stdout);
  });
}
