// src/functions/scheduleVideoFetch.js
import fs from 'node:fs';
import path from 'node:path';
import postLatestVideo from './postLatestVideo.js';

const USERS_PATH = path.join(process.cwd(), 'youtube-users.json');
const CONFIG_PATH = path.join(process.cwd(), 'channel-config.json');

export default function scheduleVideoFetch(client) {
  setInterval(async () => {
    if (!fs.existsSync(USERS_PATH)) return;

    const users = JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));
    const config = fs.existsSync(CONFIG_PATH)
      ? JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))
      : {};

    for (const userId in users) {
      const { channelId: youtubeChannelId, guildId } = users[userId];
      const channelId = config[guildId];
      if (!channelId) continue;

      await postLatestVideo(client, userId, channelId, youtubeChannelId);
    }
  }, 60_000); // Every 60 seconds
