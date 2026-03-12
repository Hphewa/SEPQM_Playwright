//This file runs once after all tests finish.
//What it does:

//Checks whether .server-pid file exists

//Reads the saved process ID

//Kills that server process

//Deletes the .server-pid file
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PID_FILE = path.join(process.cwd(), '.server-pid');

module.exports = async () => {
  if (!fs.existsSync(PID_FILE)) {
    return;
  }

  const pid = fs.readFileSync(PID_FILE, 'utf-8').trim();
  console.log('Global teardown: stopping server...'); 
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
};//After tests are done, stop the server and clean temporary tracking file.

