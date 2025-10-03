#!/bin/bash

# Oracle Cloud Linux server setup script for Next.js application
set -e

echo "🏗️ Setting up Oracle Cloud Linux server for Next.js deployment..."

# Update system packages
echo "📦 Updating system packages..."
sudo yum update -y

# Install required system packages
echo "🛠️ Installing required packages..."
sudo yum install -y curl wget git tar gzip

# Install Node.js 18 using NodeSource repository
echo "📱 Installing Node.js 18..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verify Node.js installation
echo "✅ Node.js version: $(node --version)"
echo "✅ NPM version: $(npm --version)"

# Install PM2 globally
echo "⚙️ Installing PM2 process manager..."
sudo npm install -g pm2

# Install and configure Nginx
echo "🌐 Installing and configuring Nginx..."
sudo yum install -y nginx

# Create Nginx configuration for the application
sudo tee /etc/nginx/conf.d/portfolio.conf > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            proxy_pass http://localhost:3000;
        }
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF

# Remove default Nginx configuration
sudo rm -f /etc/nginx/conf.d/default.conf

# Test Nginx configuration
sudo nginx -t

# Enable and start Nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Configure firewall
echo "🔥 Configuring firewall..."
sudo firewall-cmd --permanent --zone=public --add-service=http
sudo firewall-cmd --permanent --zone=public --add-service=https
sudo firewall-cmd --permanent --zone=public --add-port=3000/tcp
sudo firewall-cmd --reload

# Create application user (optional, for better security)
echo "👤 Creating application user..."
sudo useradd -r -s /bin/false -d /opt/gen-ai-portfolio genai || true

# Create application directory
sudo mkdir -p /opt/gen-ai-portfolio
sudo chown $(whoami):$(whoami) /opt/gen-ai-portfolio

# Setup logrotate for PM2 logs
sudo tee /etc/logrotate.d/pm2 > /dev/null << 'EOF'
/home/*/.pm2/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

echo "✅ Server setup completed successfully!"
echo "🔧 Next steps:"
echo "1. Set up your GitHub repository secrets:"
echo "   - ORACLE_CLOUD_HOST: Your server's public IP"
echo "   - ORACLE_CLOUD_USER: Your username (e.g., opc)"
echo "   - ORACLE_CLOUD_SSH_KEY: Your private SSH key"
echo ""
echo "2. Your application will be available at:"
echo "   - Direct: http://YOUR_SERVER_IP:3000"
echo "   - Through Nginx: http://YOUR_SERVER_IP"
echo ""
echo "3. Useful commands:"
echo "   - Check PM2 status: pm2 status"
echo "   - View logs: pm2 logs gen-ai-portfolio"
echo "   - Restart app: pm2 restart gen-ai-portfolio"
echo "   - Check Nginx: sudo systemctl status nginx"