#!/bin/bash

# Oracle Cloud deployment script for Next.js portfolio
set -e

# Configuration
APP_NAME="gen-ai-portfolio"
APP_DIR="/opt/${APP_NAME}"
NODE_VERSION="18"
PM2_APP_NAME="${APP_NAME}"

echo "🚀 Starting deployment of ${APP_NAME}..."

# Create application directory if it doesn't exist
sudo mkdir -p ${APP_DIR}
sudo chown $(whoami):$(whoami) ${APP_DIR}

# Backup current deployment if it exists
if [ -d "${APP_DIR}/current" ]; then
    echo "📦 Backing up current deployment..."
    sudo rm -rf ${APP_DIR}/backup
    sudo mv ${APP_DIR}/current ${APP_DIR}/backup
fi

# Create new deployment directory
mkdir -p ${APP_DIR}/current
cd ${APP_DIR}/current

# Extract deployment package
echo "📂 Extracting deployment package..."
tar -xzf /tmp/deployment.tar.gz

# Install production dependencies
echo "📚 Installing production dependencies..."
npm ci --production

# Stop existing PM2 process if running
echo "🛑 Stopping existing application..."
pm2 stop ${PM2_APP_NAME} || true
pm2 delete ${PM2_APP_NAME} || true

# Start application with PM2
echo "▶️ Starting application with PM2..."
pm2 start npm --name ${PM2_APP_NAME} -- start
pm2 save

# Setup PM2 to start on system boot
pm2 startup systemd -u $(whoami) --hp $(eval echo ~$(whoami)) || true

# Cleanup
rm -f /tmp/deployment.tar.gz /tmp/deploy.sh

echo "✅ Deployment completed successfully!"
echo "🌐 Application should be available at http://$(curl -s ifconfig.me):3000"

# Health check
sleep 10
if curl -f localhost:3000 > /dev/null 2>&1; then
    echo "✅ Health check passed - Application is running"
else
    echo "❌ Health check failed - Please check logs with: pm2 logs ${PM2_APP_NAME}"
    exit 1
fi