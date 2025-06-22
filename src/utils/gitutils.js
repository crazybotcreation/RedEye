// src/utils/gitUtils.js
import simpleGit from 'simple-git';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const REPO_URL = 'git@github.com:crazybotcreation/RedEye.git';
const FILE_NAME = 'youtube-users.json';

export async function commitYoutubeUsersFile() {
  try {
    const repoPath = process.cwd();
    const filePath = path.join(repoPath, FILE_NAME);

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ ${FILE_NAME} not found, cannot commit.`);
      return;
    }

    // Write SSH key to temp file if provided
    const privateKey = process.env.GIT_SSH_PRIVATE_KEY;
    if (!privateKey) {
      console.error('❌ GIT_SSH_PRIVATE_KEY not set in environment.');
      return;
    }

    const sshPath = '/tmp/temp_deploy_key';
    fs.writeFileSync(sshPath, privateKey.replace(/\\n/g, '\n'), { mode: 0o600 });

    // Create custom SSH command
    const GIT_SSH_COMMAND = `ssh -i ${sshPath} -o StrictHostKeyChecking=no`;

    const git = simpleGit({
      baseDir: repoPath,
      binary: 'git',
      maxConcurrentProcesses: 1,
      trimmed: false
    });

    await git.add(FILE_NAME);
    await git.commit(`🔄 Auto update ${FILE_NAME}`);
    await git.push(REPO_URL, 'main', { env: { GIT_SSH_COMMAND } });

    console.log(`✅ ${FILE_NAME} committed and pushed to GitHub!`);
  } catch (err) {
    console.error('❌ Git auto-commit failed:', err);
  }
}
