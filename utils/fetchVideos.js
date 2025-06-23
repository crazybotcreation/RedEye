// utils/fetchVideos.js
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const filePath = path.join(process.cwd(), 'youtube-users.json');
const postedPath = path.join(process.cwd(), 'posted-videos.json');
const YT_API_KEY = process.env.YOUTUBE_API;

let posted = {};
if (fs.existsSync(postedPath)) {
  posted = JSON.parse(fs.readFileSync(postedPath, 'utf-8') || '{}');
}

export default async function fetchAndPostLatestVideos(client) {
  if (!fs.existsSync(filePath)) return;

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  for (const userId in data) {
    const { channelId, channel, guild } = data[userId];
    const latestVideo = await getLatestVideo(channelId);
    if (!latestVideo) continue;

    const alreadyPosted = posted[userId];
    if (alreadyPosted === latestVideo.id) continue; // already posted

    // Update posted memory
    posted[userId] = latestVideo.id;
    fs.writeFileSync(postedPath, JSON.stringify(posted, null, 2));

    const guildObj = await client.guilds.fetch(guild).catch(() => null);
    if (!guildObj) continue;

    const channelObj = await guildObj.channels.fetch(channel).catch(() => null);
    if (!channelObj || !channelObj.isTextBased()) continue;

    channelObj.send({
      content: `<@${userId}> just uploaded a video! https://www.youtube.com/watch?v=${latestVideo.id}`,
      embeds: [
        {
          author: {
            name: 'YouTube',
            icon_url: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png'
          },
          title: latestVideo.title,
          url: `https://www.youtube.com/watch?v=${latestVideo.id}`,
          image: { url: latestVideo.thumbnail },
          color: 0xff0000
        }
      ]
    });
  }
}

async function getLatestVideo(channelId) {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${YT_API_KEY}&channelId=${channelId}&part=snippet&order=date&maxResults=1`;
  const res = await fetch(url);
  const json = await res.json();

  const item = json.items?.[0];
  if (!item || item.id.kind !== 'youtube#video') return null;

  return {
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.high.url
  };
      }
