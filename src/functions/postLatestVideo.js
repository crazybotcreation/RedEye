// src/functions/postLatestVideo.js
import { EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

const apiKeys = process.env.YT_API_KEYS?.split(',').map(k => k.trim()).filter(Boolean) || [];
let currentKeyIndex = 0;
let usagePerKey = new Map(apiKeys.map(key => [key, 0]));
const MAX_USAGE_PER_KEY = 9500; // Reserve margin from 10,000

function getNextValidKey() {
  for (let i = 0; i < apiKeys.length; i++) {
    const key = apiKeys[currentKeyIndex];
    if (usagePerKey.get(key) < MAX_USAGE_PER_KEY) return key;
    currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
  }
  return null; // All keys are exhausted
}

export default async function postLatestVideo(client, userId, channelId, youtubeChannelId) {
  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel) return console.warn(`❌ Channel ${channelId} not found.`);

    const apiKey = getNextValidKey();
    if (!apiKey) return console.warn('❌ All YouTube API keys have exceeded their quota.');
    usagePerKey.set(apiKey, usagePerKey.get(apiKey) + 1);

    const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${youtubeChannelId}&part=snippet&order=date&maxResults=1`;
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`Failed to fetch YouTube API response for ${youtubeChannelId}`);

    const data = await res.json();
    const video = data.items?.[0];
    if (!video || !video.id?.videoId) return console.warn(`⚠️ No videos found for channel ${youtubeChannelId}`);

    const videoId = video.id.videoId;
    const title = video.snippet.title;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    await channel.send({ content: `<@${userId}> just uploaded a video! ${videoUrl}` });

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setURL(videoUrl)
      .setImage(thumbnail)
      .setColor(0xff0000);

    await channel.send({ embeds: [embed] });

  } catch (err) {
    console.error('❌ Error posting latest video:', err);
  }
      
