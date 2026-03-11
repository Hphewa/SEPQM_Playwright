const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PID_FILE = path.join(process.cwd(), '.server-pid');

module.exports = async () => {
  if (!fs.existsSync(PID_FILE)) {
    return;
  }

  const pid = fs.readFileSync(PID_FILE, 'utf-8').trim();

  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /PID ${pid} /T /F`);
    } else {
      process.kill(Number(pid), 'SIGTERM');
    }
  } catch (error) {
    console.log('Cleanup note:', error.message);
  } finally {
    fs.unlinkSync(PID_FILE);
  }
};