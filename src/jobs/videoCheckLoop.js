// src/functions/postLatestVideo.js
import { EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

export default async function postLatestVideo(client, userId, channelId, youtubeChannelId) {
  const configPath = path.join(process.cwd(), 'src', 'data', 'posted.json');

  let posted = {};
  try {
    if (fs.existsSync(configPath)) {
      posted = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
  } catch (err) {
    console.warn('⚠️ Could not read posted.json:', err.message);
  }

  const url = `https://www.googleapis.com/youtube/v3/search?key=${process.env.YT_API_KEY}&channelId=${youtubeChannelId}&part=snippet&order=date&maxResults=1`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.items || !data.items.length) return;

  const video = data.items[0];
  const videoId = video.id.videoId;

  if (!videoId || posted[youtubeChannelId] === videoId) return;

  const embed = new EmbedBuilder()
    .setColor('Red')
    .setAuthor({ name: 'YouTube', iconURL: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png' })
    .setTitle(video.snippet.title)
    .setURL(`https://youtu.be/${videoId}`)
    .setImage(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`)
    .setTimestamp();

  const channel = await client.channels.fetch(channelId).catch(() => null);
  if (!channel) return;

  await channel.send({
    content: `<@${userId}> just uploaded a video! https://youtu.be/${videoId}`,
    embeds: [embed]
  });

  posted[youtubeChannelId] = videoId;
  fs.writeFileSync(configPath, JSON.stringify(posted, null, 2));
      }
