const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PID_FILE = path.join(process.cwd(), '.server-pid');
const SERVER_URL = 'http://127.0.0.1:3000';

async function waitForServer(url, attempts = 30) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(`${url}/api/health`);
      if (response.ok) {
        return;
      }
    } catch (error) {
      // wait and retry
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error('Server did not start in time.');
}

module.exports = async () => {
  const serverScript = path.join(process.cwd(), 'src', 'server.js');

  const serverProcess = spawn(process.execPath, [serverScript], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: '3000' },
    stdio: 'ignore',
    detached: true,
    windowsHide: true
  });

  serverProcess.unref();
  fs.writeFileSync(PID_FILE, String(serverProcess.pid));

  await waitForServer(SERVER_URL);
};