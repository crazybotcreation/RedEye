// src/utils/gitUtils.js
import { exec } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const filePath = path.join(process.cwd(), 'youtube-users.json');

export async function commitUserDataToGitHub() {
  try {
    // Stage the file
    await execPromise(`git add ${filePath}`);

    // Commit the change with a timestamp
    const timestamp = new Date().toISOString();
    await execPromise(`git commit -m "📦 Auto update youtube-users.json at ${timestamp}"`);

    // Push the commit to GitHub
    await execPromise('git push');
    console.log('✅ youtube-users.json changes pushed to GitHub.');
  } catch (err) {
    console.error('❌ Failed to commit youtube-users.json:', err.message);
  }
}

function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve(stdout || stderr);
    });
  });
         }
