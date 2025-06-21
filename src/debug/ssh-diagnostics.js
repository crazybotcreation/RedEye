// src/debug/ssh-diagnostics.js

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

console.log('🛠️ Running SSH diagnostic check...');

try {
  const sshDir = path.join(process.env.HOME || '/root', '.ssh');
  const keyPath = path.join(sshDir, 'id_ed25519');

  if (fs.existsSync(keyPath)) {
    console.log('✅ SSH private key exists at:', keyPath);
    const sshResult = execSync('ssh -T git@github.com', {
      env: {
        ...process.env,
        GIT_SSH_COMMAND: `ssh -i ${keyPath} -o StrictHostKeyChecking=no`
      }
    }).toString();
    console.log('🔐 SSH connection output:\n', sshResult);
  } else {
    console.warn('❌ SSH private key not found at:', keyPath);
  }
} catch (error) {
  console.error('❌ SSH connection failed:', error.message);
          }
