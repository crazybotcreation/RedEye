// src/jobs/videoCheckLoop.js
import fs from 'fs';
import path from 'path';
import postLatestVideo from '../functions/postLatestVideo.js';

export function startVideoCheckLoop(client) {
  setInterval(async () => {
    console.log('🔁 Running video fetch loop...');

    const dataPath = path.join(process.cwd(), 'src', 'data', 'verifiedUsers.json');

    let verifiedUsers = [];
    try {
      const data = fs.readFileSync(dataPath, 'utf-8');
      verifiedUsers = JSON.parse(data);
    } catch (err) {
      console.warn('⚠️ Could not read verifiedUsers.json:', err.message);
      return;
    }

    for (const user of verifiedUsers) {
      const { userId, channelId, youtubeChannelId } = user;
      try {
        await postLatestVideo(client, userId, channelId, youtubeChannelId);
      } catch (err) {
        console.warn(`⚠️ Failed to post video for ${youtubeChannelId}:`, err);
      }
    }
  }, 60000); // ⏱️ Every 60 seconds
    }
