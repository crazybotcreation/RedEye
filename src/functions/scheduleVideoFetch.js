// src/functions/scheduleVideoFetch.js
import fs from 'fs';
import path from 'path';
import postLatestVideo from './postLatestVideo.js';

const dataPath = path.join(process.cwd(), 'youtube-users.json');
const lastVideoCache = new Map();

export default function scheduleVideoFetch(client) {
  setInterval(async () => {
    try {
      if (!fs.existsSync(dataPath)) return;

      const raw = fs.readFileSync(dataPath, 'utf-8');
      const users = JSON.parse(raw);

      for (const user of users) {
        const { userId, channelId, discordChannelId } = user;

        if (!userId || !channelId || !discordChannelId) continue;

        // Call API once to check for latest video
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=API_KEY_PLACEHOLDER&channelId=${channelId}&part=snippet&order=date&maxResults=1&type=video`;
        // We delegate actual fetching + sending to postLatestVideo which handles rotation and API logic
        await postLatestVideo(client, userId, discordChannelId, channelId);
      }

    } catch (err) {
      console.error('❌ Scheduler error:', err);
    }
  }, 60000); // Every 60 seconds
