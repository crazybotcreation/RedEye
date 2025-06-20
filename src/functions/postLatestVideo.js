// src/functions/postLatestVideo.js
import { EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

export default async function postLatestVideo(client, userId, channelId, youtubeChannelId) {
  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel) return console.warn(`❌ Channel ${channelId} not found.`);

    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${youtubeChannelId}`;
    const res = await fetch(rssUrl);
    if (!res.ok) throw new Error(`Failed to fetch RSS feed for ${youtubeChannelId}`);

    const xml = await res.text();
    const latestMatch = xml.match(/<entry>([\s\S]*?)<\/entry>/);
    if (!latestMatch) return console.warn(`⚠️ No videos found for channel ${youtubeChannelId}`);

    const entry = latestMatch[1];
    const urlMatch = entry.match(/<link rel='alternate' href='(.*?)'/);
    const titleMatch = entry.match(/<title>(.*?)<\/title>/);
    const idMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);

    if (!urlMatch || !titleMatch || !idMatch) return console.warn('⚠️ Could not parse video data');

    const videoUrl = urlMatch[1];
    const title = titleMatch[1];
    const videoId = idMatch[1];
    const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    // Send message and embed
    await channel.send({
      content: `<@${userId}> just uploaded a video! ${videoUrl}`
    });

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setURL(videoUrl)
      .setImage(thumbnail)
      .setColor(0xff0000);

    await channel.send({ embeds: [embed] });

  } catch (err) {
    console.error('❌ Error posting latest video:', err);
  }
      
