# Hostinger Deployment Guide for Taksha Veda Backend

This guide will help you deploy the Taksha Veda backend API to Hostinger hosting.

## Prerequisites

- Hostinger VPS or Business/Premium shared hosting plan
- Domain: takshaveda.com
- SSH access to the server
- Node.js installed on the server

## Step 1: Server Preparation

### 1.1 Connect to Your Server
```bash
ssh root@your-server-ip
```

### 1.2 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3 Install Node.js (if not already installed)
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 1.4 Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 1.5 Install MongoDB (if using local database)
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# Update and install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start and enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Step 2: Domain Configuration

### 2.1 DNS Setup
In your domain registrar (where you bought takshaveda.com), set up these DNS records:

```
Type: A
Name: api (or @)
Value: YOUR_SERVER_IP
TTL: 300

Type: CNAME
Name: www
Value: takshaveda.com
TTL: 300
```

### 2.2 SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d takshaveda.com -d www.takshaveda.com
```

## Step 3: Deploy Backend Code

### 3.1 Create Project Directory
```bash
sudo mkdir -p /var/www/taksha-api
cd /var/www/taksha-api
```

### 3.2 Clone Repository
```bash
# If using Git
git clone YOUR_REPOSITORY_URL .

# Or upload files manually via FTP/SCP
```

### 3.3 Install Dependencies
```bash
npm install --production
```

### 3.4 Create Environment File
```bash
nano .env
```

Add the following environment variables:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taksha_production
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
FRONTEND_URL=https://takshaveda.com
SESSION_SECRET=your-session-secret-key
```

### 3.5 Set Proper Permissions
```bash
sudo chown -R www-data:www-data /var/www/taksha-api
sudo chmod -R 755 /var/www/taksha-api
```

## Step 4: Nginx Configuration

### 4.1 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/takshaveda.com
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name takshaveda.com www.takshaveda.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name takshaveda.com www.takshaveda.com;

    ssl_certificate /etc/letsencrypt/live/takshaveda.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/takshaveda.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # API routes
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Static files (if serving frontend from same domain)
    location / {
        root /var/www/taksha-frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # File upload limit
    client_max_body_size 10M;
}
```

### 4.2 Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/takshaveda.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 5: Start the Application

### 5.1 Seed Database
```bash
cd /var/www/taksha-api
node scripts/seedDatabase.js
```

### 5.2 Start with PM2
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 5.3 Monitor Application
```bash
pm2 status
pm2 logs taksha-api
pm2 monit
```

## Step 6: Security Hardening

### 6.1 Firewall Configuration
```bash
# Enable UFW firewall
sudo ufw enable

# Allow necessary ports
sudo ufw allow 22/tcp     # SSH
sudo ufw allow 80/tcp     # HTTP
sudo ufw allow 443/tcp    # HTTPS
sudo ufw allow 5000/tcp   # Node.js (only if needed)

# Deny all other incoming traffic
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

### 6.2 Fail2ban (Optional)
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Step 7: Monitoring and Logging

### 7.1 Set up Log Rotation
```bash
sudo nano /etc/logrotate.d/taksha-api
```

Add:
```
/var/www/taksha-api/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    postrotate
        pm2 reload taksha-api
    endscript
}
```

### 7.2 Health Check Script
```bash
nano /var/www/taksha-api/scripts/health-check.sh
```

Add:
```bash
#!/bin/bash
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health)
if [ $response -ne 200 ]; then
    echo "API is down, restarting..."
    pm2 restart taksha-api
fi
```

Make executable and add to crontab:
```bash
chmod +x /var/www/taksha-api/scripts/health-check.sh
crontab -e
```

Add this line to run every 5 minutes:
```
*/5 * * * * /var/www/taksha-api/scripts/health-check.sh
```

## Step 8: Backup Strategy

### 8.1 Database Backup Script
```bash
nano /var/www/taksha-api/scripts/backup.sh
```

Add:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/taksha"
mkdir -p $BACKUP_DIR

# MongoDB backup
mongodump --db taksha_production --out $BACKUP_DIR/mongodb_$DATE

# Compress backup
tar -czf $BACKUP_DIR/taksha_backup_$DATE.tar.gz $BACKUP_DIR/mongodb_$DATE

# Remove old backups (keep last 7 days)
find $BACKUP_DIR -name "taksha_backup_*.tar.gz" -mtime +7 -delete
```

Make executable and add to crontab:
```bash
chmod +x /var/www/taksha-api/scripts/backup.sh
crontab -e
```

Add this line to run daily at 2 AM:
```
0 2 * * * /var/www/taksha-api/scripts/backup.sh
```

## Step 9: Testing Deployment

### 9.1 Test API Endpoints
```bash
# Health check
curl https://takshaveda.com/api/health

# Test authentication
curl -X POST https://takshaveda.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@takshaveda.com","password":"admin123"}'

# Test products
curl https://takshaveda.com/api/products
```

### 9.2 Performance Testing
```bash
# Install Apache Bench
sudo apt install apache2-utils -y

# Test API performance
ab -n 1000 -c 10 https://takshaveda.com/api/products
```

## Step 10: Continuous Deployment

### 10.1 Create Deployment Script
```bash
nano /var/www/taksha-api/scripts/deploy.sh
```

Add:
```bash
#!/bin/bash
cd /var/www/taksha-api

# Pull latest code
git pull origin main

# Install dependencies
npm install --production

# Run any migrations if needed
# node scripts/migrate.js

# Restart application
pm2 restart taksha-api

echo "Deployment completed successfully!"
```

Make executable:
```bash
chmod +x /var/www/taksha-api/scripts/deploy.sh
```

## Troubleshooting

### Common Issues:

1. **Port already in use**: Check if another service is using port 5000
2. **Permission denied**: Ensure proper file permissions
3. **Database connection issues**: Check MongoDB service status
4. **SSL certificate issues**: Verify domain DNS settings
5. **Memory issues**: Monitor server resources with `htop`

### Useful Commands:
```bash
# Check PM2 processes
pm2 list

# View logs
pm2 logs taksha-api

# Restart application
pm2 restart taksha-api

# Check server resources
htop

# Check disk usage
df -h

# Check MongoDB status
sudo systemctl status mongod
```

## Support

For deployment issues, contact your hosting provider's support team or check the application logs for specific error messages.

Remember to regularly update your server, backup your data, and monitor your application's performance.