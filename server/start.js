const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distFile = path.join(__dirname, 'dist', 'server.js');

if (!fs.existsSync(distFile)) {
  console.log('[LinkPulse] dist/server.js not found. Compiling TypeScript backend...');
  execSync('npx tsc', { stdio: 'inherit', cwd: __dirname });
}

require('./dist/server.js');
