const mongoose = require('mongoose');
require('dotenv').config();

// Test database connection
async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    console.log('Connection string:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taksha_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
    });
    
    console.log('✅ MongoDB connection successful!');
    
    // Test database operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Existing collections:', collections.map(c => c.name));
    
    // Test write operation
    const testCollection = mongoose.connection.db.collection('test');
    const testDoc = { message: 'Connection test successful', timestamp: new Date() };
    await testCollection.insertOne(testDoc);
    console.log('✅ Write operation successful');
    
    // Clean up test document
    await testCollection.deleteOne({ message: 'Connection test successful' });
    console.log('✅ Delete operation successful');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Solutions:');
      console.log('1. Start MongoDB locally: mongod --dbpath /data/db');
      console.log('2. Use MongoDB Atlas (recommended for production)');
      console.log('3. Update MONGODB_URI in .env file');
      console.log('4. Check MongoDB Atlas setup guide: backend/setup/mongodb-atlas-setup.md');
    }
    
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Authentication issue:');
      console.log('1. Check username and password in connection string');
      console.log('2. Verify database user permissions in MongoDB Atlas');
    }
    
    if (error.message.includes('Server selection timed out')) {
      console.log('\n💡 Network issue:');
      console.log('1. Check network connectivity');
      console.log('2. Verify IP whitelist in MongoDB Atlas');
      console.log('3. Check firewall settings');
    }
  } finally {
    mongoose.connection.close();
  }
}

testConnection();