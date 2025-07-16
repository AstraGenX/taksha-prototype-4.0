# MongoDB Atlas Setup Guide for Taksha Veda

Since you're deploying to Hostinger, using MongoDB Atlas (cloud database) is recommended for production.

## Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/atlas
2. Click "Sign up for free"
3. Create account with your email

## Step 2: Create Database Cluster

1. After login, click "Create a New Cluster"
2. Select "Shared Clusters" (Free tier)
3. Choose your preferred cloud provider (AWS recommended)
4. Select region closest to your users (Asia Pacific for Indian users)
5. Click "Create Cluster"

## Step 3: Configure Database Access

1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `taksha_admin`
5. Generate secure password and save it
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

## Step 4: Configure Network Access

1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

## Step 5: Get Connection String

1. Go to "Clusters" section
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Choose "Node.js" and version "4.1 or later"
5. Copy the connection string

It will look like:
```
mongodb+srv://taksha_admin:<password>@cluster0.xxxxx.mongodb.net/taksha_db?retryWrites=true&w=majority
```

## Step 6: Update Environment Variables

Replace the MongoDB URI in your .env file:

```env
MONGODB_URI=mongodb+srv://taksha_admin:<your-password>@cluster0.xxxxx.mongodb.net/taksha_db?retryWrites=true&w=majority
```

## Step 7: Test Connection

Run the seeder script to test the connection:
```bash
node scripts/seedDatabase.js
```

## Production Considerations

1. **Database Name**: Use different database names for development and production
2. **IP Whitelist**: In production, whitelist only your server IP
3. **Backup**: Enable automatic backups in Atlas
4. **Monitoring**: Set up alerts for database performance

## Environment-specific Database Names

- Development: `taksha_dev`
- Production: `taksha_production`
- Testing: `taksha_test`

Update your connection strings accordingly.