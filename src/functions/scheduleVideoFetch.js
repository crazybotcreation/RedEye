// src/functions/scheduleVideoFetch.js
import fs from 'node:fs';
import path from 'node:path';
import postLatestVideo from './postLatestVideo.js';

const dataPath = path.join(process.cwd(), 'youtube-users.json');

// Run this every 60 seconds
export default function scheduleVideoFetch(client) {
  setInterval(() => {
    if (!fs.existsSync(dataPath)) return;

    let data;
    try {
      data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (err) {
      console.error('❌ Failed to read youtube-users.json:', err);
      return;
    }

    for (const userId of Object.keys(data)) {
      const entry = data[userId];
      if (!entry.channelId || !entry.channel) continue;
      postLatestVideo(client, userId, entry.channel, entry.channelId);
    }
  }, 60000); // 60 seconds
    }
