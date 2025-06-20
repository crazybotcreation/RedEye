import fs from 'node:fs';
import path from 'node:path';
import postLatestVideo from './postLatestVideo.js';

const dataPath = path.join(process.cwd(), 'youtube-users.json');

export default function scheduleVideoFetch(client) {
  setInterval(() => {
    if (!fs.existsSync(dataPath)) return;

    const raw = fs.readFileSync(dataPath, 'utf8');
    let users;

    try {
      users = JSON.parse(raw);
    } catch (err) {
      console.error('❌ Failed to parse youtube-users.json:', err);
      return;
    }

    for (const userId in users) {
      const entry = users[userId];
      postLatestVideo(client, userId, entry.channelId, entry.youtubeChannelId);
    }
  }, 60_000); // every 60 seconds
}
