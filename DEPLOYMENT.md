# Deployment Guide: Oracle Cloud Linux Server with GitHub Actions CI/CD

This guide will help you deploy your Next.js portfolio to an Oracle Cloud Linux server with automated CI/CD using GitHub Actions.

## 🏗️ Infrastructure Setup

### 1. Oracle Cloud Infrastructure Setup

1. **Create a Compute Instance:**
   - Login to Oracle Cloud Console
   - Navigate to Compute > Instances
   - Create a new instance with Oracle Linux 8
   - Choose appropriate shape (minimum: 1 OCPU, 1GB RAM)
   - Generate/upload SSH key pair
   - Note down the public IP address

2. **Configure Security Lists:**
   - Allow ingress traffic on ports:
     - Port 22 (SSH)
     - Port 80 (HTTP)
     - Port 443 (HTTPS)
     - Port 3000 (Next.js app)

### 2. Server Setup

SSH into your Oracle Cloud server and run the setup script:

```bash
# Connect to your server
ssh opc@YOUR_SERVER_IP

# Download and run the server setup script
curl -sSL https://raw.githubusercontent.com/ChiragB254/gen-ai-portfolio/main/scripts/server-setup.sh | bash
```

Or manually copy the `scripts/server-setup.sh` file to your server and execute:

```bash
chmod +x server-setup.sh
./server-setup.sh
```

## 🔧 GitHub Repository Configuration

### 1. Set up Repository Secrets

In your GitHub repository, go to Settings > Secrets and variables > Actions, and add these secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `ORACLE_CLOUD_HOST` | Your server's public IP address | `123.456.789.012` |
| `ORACLE_CLOUD_USER` | SSH username (usually `opc` for Oracle Linux) | `opc` |
| `ORACLE_CLOUD_SSH_KEY` | Your private SSH key content | `-----BEGIN OPENSSH PRIVATE KEY-----...` |

### 2. SSH Key Setup

If you don't have an SSH key pair:

```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Copy public key to Oracle Cloud server
ssh-copy-id opc@YOUR_SERVER_IP

# Add private key to GitHub secrets (ORACLE_CLOUD_SSH_KEY)
cat ~/.ssh/id_rsa
```

## 🚀 Deployment Process

The deployment is automated through GitHub Actions. Here's what happens:

### 1. Automatic Deployment Triggers

- **Push to main branch**: Triggers full build and deployment
- **Pull Request**: Triggers build and test only

### 2. Deployment Pipeline Steps

1. **Build & Test Phase:**
   - Checkout code
   - Setup Node.js 18
   - Install dependencies (`npm ci`)
   - Run linter (`npm run lint`)
   - Build application (`npm run build`)
   - Archive build artifacts

2. **Deploy Phase (main branch only):**
   - Download build artifacts
   - Setup SSH connection
   - Create deployment package
   - Transfer files to Oracle Cloud server
   - Execute deployment script
   - Perform health check

### 3. Manual Deployment

To deploy manually:

```bash
# Build locally
npm run build

# Create deployment package
tar -czf deployment.tar.gz .next/ public/ package.json package-lock.json next.config.ts

# Copy to server
scp deployment.tar.gz opc@YOUR_SERVER_IP:/tmp/
scp scripts/deploy.sh opc@YOUR_SERVER_IP:/tmp/

# Deploy on server
ssh opc@YOUR_SERVER_IP "chmod +x /tmp/deploy.sh && /tmp/deploy.sh"
```

## 🔍 Monitoring & Management

### Application Management Commands

```bash
# PM2 process management
pm2 status                    # Check application status
pm2 logs gen-ai-portfolio    # View application logs
pm2 restart gen-ai-portfolio # Restart application
pm2 stop gen-ai-portfolio    # Stop application
pm2 start gen-ai-portfolio   # Start application

# System monitoring
systemctl status nginx        # Check Nginx status
sudo nginx -t                # Test Nginx configuration
sudo systemctl reload nginx  # Reload Nginx configuration
```

### Log Locations

- **Application Logs**: `~/.pm2/logs/`
- **Nginx Logs**: `/var/log/nginx/`
- **System Logs**: `/var/log/messages`

## 🌐 Domain & SSL Configuration (Optional)

### 1. Domain Configuration

If you have a domain, update your DNS records to point to your Oracle Cloud server's public IP.

### 2. SSL Certificate with Let's Encrypt

```bash
# Install Certbot
sudo yum install -y certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal setup (already configured)
sudo systemctl enable certbot-renew.timer
```

## 🛡️ Security Best Practices

1. **Regular Updates:**
   ```bash
   sudo yum update -y
   npm audit fix
   ```

2. **Firewall Configuration:**
   ```bash
   sudo firewall-cmd --list-all  # Check current rules
   ```

3. **Backup Strategy:**
   - Application files are backed up during deployment
   - Consider setting up database backups if you add one
   - Regular system snapshots through Oracle Cloud Console

## 🐛 Troubleshooting

### Common Issues

1. **Deployment Fails:**
   ```bash
   # Check GitHub Actions logs
   # Verify server connectivity
   ssh opc@YOUR_SERVER_IP
   
   # Check server logs
   pm2 logs gen-ai-portfolio
   ```

2. **Application Not Starting:**
   ```bash
   # Check PM2 status
   pm2 status
   
   # Restart application
   pm2 restart gen-ai-portfolio
   
   # Check for port conflicts
   sudo netstat -tulpn | grep :3000
   ```

3. **Nginx Issues:**
   ```bash
   # Test configuration
   sudo nginx -t
   
   # Check status
   sudo systemctl status nginx
   
   # Restart nginx
   sudo systemctl restart nginx
   ```

### Health Checks

- **Application**: `curl http://localhost:3000`
- **Nginx**: `curl http://YOUR_SERVER_IP`
- **SSL (if configured)**: `curl https://yourdomain.com`

## 📊 Performance Optimization

1. **Enable Gzip**: Already configured in Nginx
2. **Static Asset Caching**: Configured for 1 year
3. **PM2 Clustering** (for higher traffic):
   ```bash
   pm2 start npm --name gen-ai-portfolio -i max -- start
   ```

## 🔄 Rollback Procedure

If deployment fails, you can rollback:

```bash
# SSH to server
ssh opc@YOUR_SERVER_IP

# Restore previous version
cd /opt/gen-ai-portfolio
sudo rm -rf current
sudo mv backup current
pm2 restart gen-ai-portfolio
```

## 📝 Additional Notes

- The application runs on port 3000 internally
- Nginx proxies requests from port 80 to port 3000
- PM2 ensures the application restarts automatically
- Logs are rotated daily to prevent disk space issues
- The deployment creates a backup of the previous version

For any issues, check the GitHub Actions logs and server logs using the commands provided above.