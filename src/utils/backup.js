// src/utils/backup.js
import fs from 'node:fs';
import path from 'node:path';

export function backupYoutubeUsersFile() {
  const sourcePath = path.join(process.cwd(), 'youtube-users.json');
  const backupDir = path.join(process.cwd(), 'backups');

  if (!fs.existsSync(sourcePath)) {
    console.warn('⚠️ No youtube-users.json file found to back up.');
    return;
  }

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(backupDir, `youtube-users-${timestamp}.json`);

  fs.copyFileSync(sourcePath, backupFile);
  console.log(`📦 Backup created: ${backupFile}`);
}
