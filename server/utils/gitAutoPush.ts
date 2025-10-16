import cron from 'node-cron';
import { exec } from 'child_process';

export function setupAutoGitPush() {
  cron.schedule('0 8,20 * * *', () => {
    console.log('🕗 Auto-pushing code to GitHub...');
    exec('git add . && git commit -m "Auto-sync" && git push', (err, stdout, stderr) => {
      if (err) {
        console.error('❌ Git push failed:', stderr);
      } else {
        console.log('✅ Auto-push complete:\n', stdout);
      }
    });
  });
}
