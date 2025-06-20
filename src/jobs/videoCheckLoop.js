// src/jobs/videoCheckLoop.js
import postLatestVideo from '../functions/postLatestVideo.js';
import verifiedUsers from '../data/verifiedUsers.json' assert { type: 'json' };

export function startVideoCheckLoop(client) {
  setInterval(async () => {
    console.log('🔁 Running video fetch loop...');

    for (const user of verifiedUsers) {
      const { userId, channelId, youtubeChannelId } = user;
      try {
        await postLatestVideo(client, userId, channelId, youtubeChannelId);
      } catch (err) {
        console.warn(`⚠️ Failed to post video for ${youtubeChannelId}:`, err);
      }
    }

  }, 60000); // ⏱️ Every 60 seconds
    
