const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Taksha Veda Backend API...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('Please create a .env file with the following variables:');
  console.log(`
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taksha_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@takshaveda.com
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your-session-secret-key
  `);
  process.exit(1);
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, '../node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...\n');
  
  const npm = spawn('npm', ['install'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
  });
  
  npm.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Dependencies installed successfully!\n');
      startServer();
    } else {
      console.log('❌ Failed to install dependencies');
      process.exit(1);
    }
  });
} else {
  startServer();
}

function startServer() {
  console.log('🌱 Starting server...\n');
  
  const server = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
  });
  
  server.on('close', (code) => {
    console.log(`\n🔴 Server exited with code ${code}`);
  });
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.kill();
    process.exit(0);
  });
}