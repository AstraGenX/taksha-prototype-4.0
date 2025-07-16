# Hostinger Deployment Checklist for Taksha Veda

## Pre-Deployment Checklist

### 1. Environment Setup
- [ ] MongoDB Atlas cluster created and configured
- [ ] Database user created with proper permissions
- [ ] IP whitelist configured (0.0.0.0/0 for initial setup)
- [ ] Connection string tested and working

### 2. Third-Party Services
- [ ] Razorpay account created and API keys obtained
- [ ] Google OAuth app created and credentials obtained
- [ ] Cloudinary account created and API keys obtained
- [ ] Gmail app password generated for email notifications

### 3. Domain and SSL
- [ ] Domain `takshaveda.com` pointed to Hostinger server
- [ ] SSL certificate obtained (Let's Encrypt or Hostinger SSL)
- [ ] DNS records configured properly

### 4. Server Requirements
- [ ] Node.js 16+ installed on server
- [ ] PM2 process manager installed
- [ ] Nginx configured as reverse proxy
- [ ] Firewall configured (ports 80, 443, 22)

## Deployment Process

### Step 1: Server Preparation
```bash
# Connect to server
ssh root@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

### Step 2: Deploy Code
```bash
# Create project directory
sudo mkdir -p /var/www/taksha-api
cd /var/www/taksha-api

# Upload code (using Git or SCP)
git clone YOUR_REPOSITORY_URL .
# OR use SCP to upload files

# Install dependencies
npm install --production

# Set permissions
sudo chown -R www-data:www-data /var/www/taksha-api
sudo chmod -R 755 /var/www/taksha-api
```

### Step 3: Environment Configuration
```bash
# Create production .env file
nano /var/www/taksha-api/.env
```

Production .env content:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taksha_production
JWT_SECRET=your-production-jwt-secret-very-long-and-secure
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=noreply@takshaveda.com
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
FRONTEND_URL=https://takshaveda.com
SESSION_SECRET=your-session-secret-very-long-and-secure
```

### Step 4: Database Seeding
```bash
# Test database connection
node scripts/testConnection.js

# Seed database with initial data
node scripts/seedDatabase.js
```

### Step 5: Nginx Configuration
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/takshaveda.com
```

Nginx configuration:
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
    }

    client_max_body_size 10M;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/takshaveda.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: SSL Certificate
```bash
# Get SSL certificate
sudo certbot --nginx -d takshaveda.com -d www.takshaveda.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### Step 7: Start Application
```bash
# Start with PM2
cd /var/www/taksha-api
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup
```

### Step 8: Firewall Configuration
```bash
# Configure UFW firewall
sudo ufw enable
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

## Post-Deployment Testing

### API Health Check
```bash
# Test basic endpoints
curl https://takshaveda.com/api/health
curl https://takshaveda.com/api/products
```

### Admin Login Test
```bash
curl -X POST https://takshaveda.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@takshaveda.com","password":"admin123"}'
```

### Performance Test
```bash
# Install Apache Bench
sudo apt install apache2-utils -y

# Test performance
ab -n 100 -c 10 https://takshaveda.com/api/products
```

## Monitoring and Maintenance

### PM2 Monitoring
```bash
pm2 status
pm2 logs taksha-api
pm2 monit
```

### Database Monitoring
- Monitor MongoDB Atlas dashboard
- Set up alerts for high CPU/memory usage
- Regular backup verification

### Log Rotation
```bash
# Configure logrotate
sudo nano /etc/logrotate.d/taksha-api
```

### Backup Strategy
```bash
# Create backup script
nano /var/www/taksha-api/scripts/backup.sh
chmod +x /var/www/taksha-api/scripts/backup.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /var/www/taksha-api/scripts/backup.sh
```

## Security Checklist

### Server Security
- [ ] SSH key-based authentication enabled
- [ ] Root login disabled
- [ ] Firewall properly configured
- [ ] Regular security updates scheduled
- [ ] Fail2ban installed and configured

### Application Security
- [ ] Environment variables properly secured
- [ ] JWT secrets are strong and unique
- [ ] Rate limiting configured
- [ ] Input validation implemented
- [ ] HTTPS enforced
- [ ] Security headers configured

### Database Security
- [ ] Database user has minimal required permissions
- [ ] IP whitelist configured properly
- [ ] Connection encrypted
- [ ] Regular backups scheduled
- [ ] Monitoring and alerting configured

## Troubleshooting Common Issues

### 1. Application Won't Start
```bash
# Check logs
pm2 logs taksha-api

# Check environment variables
pm2 show taksha-api

# Restart application
pm2 restart taksha-api
```

### 2. Database Connection Issues
```bash
# Test connection
node scripts/testConnection.js

# Check MongoDB Atlas network access
# Verify connection string in .env
```

### 3. SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Check Nginx configuration
sudo nginx -t
```

### 4. Performance Issues
```bash
# Check server resources
htop
df -h

# Monitor PM2 processes
pm2 monit

# Check database performance in MongoDB Atlas
```

## Continuous Deployment

### Automated Deployment Script
```bash
# Create deployment script
nano /var/www/taksha-api/scripts/deploy.sh
chmod +x /var/www/taksha-api/scripts/deploy.sh
```

### GitHub Actions (Optional)
Set up GitHub Actions for automated deployment on push to main branch.

## Support and Maintenance

### Regular Tasks
- [ ] Monitor application logs daily
- [ ] Check database performance weekly
- [ ] Update dependencies monthly
- [ ] Review security patches monthly
- [ ] Backup verification monthly

### Emergency Contacts
- Hostinger Support: [support info]
- MongoDB Atlas Support: [support info]
- Domain registrar support: [support info]

### Documentation
- Keep deployment documentation updated
- Document any custom configurations
- Maintain change log for deployments

## Final Verification

- [ ] All API endpoints working
- [ ] Database operations successful
- [ ] Email notifications working
- [ ] Payment integration working
- [ ] File uploads working
- [ ] SSL certificate valid
- [ ] Performance acceptable
- [ ] Monitoring configured
- [ ] Backups working
- [ ] Security measures in place

## Next Steps After Deployment

1. Set up monitoring and alerting
2. Configure automated backups
3. Set up staging environment
4. Implement CI/CD pipeline
5. Performance optimization
6. Security audit
7. Load testing
8. Documentation updates

Remember to test everything thoroughly before going live!