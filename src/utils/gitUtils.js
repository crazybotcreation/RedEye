// src/utils/gitUtils.js
import simpleGit from 'simple-git';
import path from 'node:path';
import fs from 'node:fs';

const git = simpleGit();

export async function commitYoutubeUsersFile() {
  const filePath = path.join(process.cwd(), 'youtube-users.json');

  if (!fs.existsSync(filePath)) {
    console.warn('❌ youtube-users.json does not exist.');
    return;
  }

  try {
    await git.add(filePath);
    await git.commit(`🔄 Update youtube-users.json [${new Date().toISOString()}]`);
    await git.push('origin', 'main');
    console.log('✅ youtube-users.json committed and pushed to GitHub');
  } catch (err) {
    console.error('❌ Git push failed:', err.message);
  }
