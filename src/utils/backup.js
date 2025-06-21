import fs from 'fs';
import path from 'path';

export function backupYoutubeUsersFile() {
  const dataPath = path.join(process.cwd(), 'youtube-users.json');
  const backupDir = path.join(process.cwd(), 'backups');

  try {
    if (!fs.existsSync(dataPath)) return;

    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `youtube-users-${timestamp}.json`);

    fs.copyFileSync(dataPath, backupPath);
    console.log(`🗂️ Backup created: ${backupPath}`);
  } catch (err) {
    console.warn('⚠️ Failed to backup youtube-users.json:', err.message);
  }
                                                       
