const fs = require('fs'); // used to read-write files
const path = require('path'); //used to safely build file paths
const { spawn } = require('child_process');//used to start another process, here the server

const PID_FILE = path.join(process.cwd(), '.server-pid');//a file that stores the server process ID
const SERVER_URL = 'http://127.0.0.1:3000'; //the address where your app will run

async function waitForServer(url, attempts = 30) { //This function checks whether the server is really ready.
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