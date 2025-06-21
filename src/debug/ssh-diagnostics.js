import fs from 'node:fs';
import { execSync } from 'node:child_process';

console.log('\n🧪 SSH/Git Diagnostics Starting...');

try {
  // Check SSH key mount path
  const sshPath = '/etc/secrets/GIT_SSH_PRIVATE_KEY';
  const exists = fs.existsSync(sshPath);
  console.log(`🔐 SSH key mounted at ${sshPath}:`, exists);

  if (exists) {
    const keyPreview = fs.readFileSync(sshPath, 'utf8').slice(0, 50).replace(/\n/g, '');
    console.log('🔑 SSH key preview (first 50 chars):', keyPreview);
  }

  // Check current working directory
  const cwd = process.cwd();
  console.log('📂 Working directory:', cwd);

  // Set Git to use this SSH key
  process.env.GIT_SSH_COMMAND = `ssh -i ${sshPath} -o StrictHostKeyChecking=no`;

  // Check current Git user
  const gitUser = execSync('git config user.name').toString().trim();
  console.log('👤 Git user:', gitUser);

  // Try a dry-run push (this won’t push anything but checks access)
  const result = execSync('git remote -v').toString();
  console.log('🌐 Git remotes:\n' + result);

  console.log('🚀 Attempting dry-run push to GitHub...');
  execSync('git push --dry-run', { stdio: 'inherit' });

  console.log('✅ SSH + Git access to GitHub is working!');

} catch (err) {
  console.error('❌ SSH/Git diagnostics failed:', err.message);
