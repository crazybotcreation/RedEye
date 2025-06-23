// src/utils/gitUtils.js
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

export function commitYoutubeUsersFile() {
  const filePath = path.join(process.cwd(), 'youtube-users.json');

  exec('git config user.name "RedEyeBot"', (err) => {
    if (err) return console.error('Git username config failed:', err);

    exec('git config user.email "redeye@bot.com"', (err) => {
      if (err) return console.error('Git email config failed:', err);

      exec(`git add ${filePath}`, (err) => {
        if (err) return console.error('Git add failed:', err);

        exec('git commit -m "🔁 Update youtube-users.json"', (err) => {
          if (err) {
            if (err.message.includes('nothing to commit')) {
              console.log('🟡 No changes to commit.');
              return;
            }
            return console.error('Git commit failed:', err);
          }

          exec('git push origin main', (err) => {
            if (err) return console.error('Git push failed:', err);
            console.log('✅ youtube-users.json committed and pushed!');
          });
        });
      });
    });
  });
  }
