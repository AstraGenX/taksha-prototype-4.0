const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 MongoDB URI Configuration Tool\n');

console.log('This tool will help you update your MongoDB connection string.');
console.log('If you\'re using MongoDB Atlas, you can get the connection string from:');
console.log('1. Go to MongoDB Atlas Dashboard');
console.log('2. Click "Connect" on your cluster');
console.log('3. Choose "Connect your application"');
console.log('4. Copy the connection string\n');

rl.question('Enter your MongoDB connection string: ', (mongoUri) => {
  if (!mongoUri || mongoUri.trim() === '') {
    console.log('❌ No connection string provided');
    rl.close();
    return;
  }

  // Validate connection string format
  if (!mongoUri.includes('mongodb') || !mongoUri.includes('://')) {
    console.log('❌ Invalid MongoDB connection string format');
    rl.close();
    return;
  }

  // Read current .env file
  const envPath = path.join(__dirname, '../.env');
  let envContent = '';
  
  try {
    envContent = fs.readFileSync(envPath, 'utf8');
  } catch (error) {
    console.log('❌ .env file not found');
    rl.close();
    return;
  }

  // Update MongoDB URI
  const updatedContent = envContent.replace(
    /MONGODB_URI=.*/,
    `MONGODB_URI=${mongoUri.trim()}`
  );

  // Write back to .env file
  try {
    fs.writeFileSync(envPath, updatedContent);
    console.log('✅ MongoDB URI updated successfully');
    
    // Test the connection
    console.log('\n🔍 Testing database connection...');
    const { spawn } = require('child_process');
    
    const testProcess = spawn('node', ['scripts/testConnection.js'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    
    testProcess.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ Connection test successful!');
        console.log('🌱 You can now seed the database: node scripts/seedDatabase.js');
        console.log('🚀 Then start the server: npm start');
      } else {
        console.log('\n❌ Connection test failed');
        console.log('Please check your connection string and try again');
      }
      rl.close();
    });
    
  } catch (error) {
    console.log('❌ Failed to update .env file:', error.message);
    rl.close();
  }
});

rl.on('close', () => {
  console.log('\n👋 Goodbye!');
  process.exit(0);
});