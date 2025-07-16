const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Taksha Prototype 4.0 Development Environment...\n');

// Function to run command with better error handling
const runCommand = (command, args, options = {}) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('error', (error) => {
      console.error(`Error starting ${command}:`, error);
      reject(error);
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
};

// Start backend
console.log('📦 Starting Backend Server...');
const backendProcess = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// Wait a bit for backend to start
setTimeout(() => {
  console.log('🎨 Starting Frontend Development Server...');
  const frontendProcess = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    backendProcess.kill();
    frontendProcess.kill();
    process.exit(0);
  });
}, 3000);

console.log('\n✨ Development environment is starting up!');
console.log('📱 Frontend will be available at: http://localhost:8080');
console.log('🔧 Backend will be available at: http://localhost:5000');
console.log('\n📋 To stop both servers, press Ctrl+C');