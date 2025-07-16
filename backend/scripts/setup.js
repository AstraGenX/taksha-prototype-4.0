const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

console.log('🚀 Taksha Veda Backend Setup\n');

// Check Node.js version
const nodeVersion = process.version;
console.log(`📋 Node.js Version: ${nodeVersion}`);

if (parseInt(nodeVersion.split('.')[0].substring(1)) < 16) {
  console.log('❌ Node.js version 16 or higher is required');
  process.exit(1);
}

// Check if .env file exists
const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('📋 Creating .env file from template...');
  
  const envExamplePath = path.join(__dirname, '../.env.example');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created');
    console.log('⚠️  Please update the values in .env file before proceeding');
  } else {
    console.log('❌ .env.example file not found');
    console.log('Please create .env file manually with required environment variables');
  }
  
  return;
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, '../node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  
  try {
    execSync('npm install', { 
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit' 
    });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.log('❌ Failed to install dependencies');
    console.log('Please run: npm install');
    process.exit(1);
  }
}

// Test MongoDB connection
console.log('\n🔍 Testing MongoDB connection...');

const testConnection = spawn('node', ['scripts/testConnection.js'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit'
});

testConnection.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ MongoDB connection successful');
    console.log('🌱 You can now run the database seeder:');
    console.log('   node scripts/seedDatabase.js');
    console.log('\n🚀 Start the server with:');
    console.log('   npm start');
    console.log('   or');
    console.log('   npm run dev');
  } else {
    console.log('\n❌ MongoDB connection failed');
    console.log('📋 Please check the MongoDB setup guide:');
    console.log('   backend/setup/mongodb-atlas-setup.md');
    console.log('\n🔧 Quick fixes:');
    console.log('1. Update MONGODB_URI in .env file');
    console.log('2. Use MongoDB Atlas (recommended)');
    console.log('3. Start local MongoDB server');
  }
});

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log('📁 Created logs directory');
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

console.log('\n📚 Documentation:');
console.log('- API Documentation: Available at /api/docs when server is running');
console.log('- MongoDB Setup: backend/setup/mongodb-atlas-setup.md');
console.log('- Deployment Guide: backend/deployment/hostinger-setup.md');
console.log('- README: backend/README.md');

console.log('\n🔗 Important URLs:');
console.log('- API Base URL: http://localhost:5000/api');
console.log('- Health Check: http://localhost:5000/api/health');
console.log('- Admin Login: admin@takshaveda.com / admin123 (after seeding)');

console.log('\n🎯 Next Steps:');
console.log('1. Set up MongoDB Atlas or start local MongoDB');
console.log('2. Update .env file with correct values');
console.log('3. Run: node scripts/seedDatabase.js');
console.log('4. Start server: npm start');
console.log('5. Test API endpoints');
console.log('6. Deploy to Hostinger (see deployment guide)');