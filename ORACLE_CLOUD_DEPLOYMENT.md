# 🚀 Oracle Cloud Deployment Guide with GitHub CI/CD

This guide will help you deploy your Next.js portfolio to Oracle Cloud with automated CI/CD using GitHub Actions.

## 📋 Prerequisites

- Oracle Cloud Account (Free tier available)
- GitHub repository
- SSH key pair for server access

## 🏗️ Step 1: Create Oracle Cloud Instance

### 1.1 Create Compute Instance
1. Log into [Oracle Cloud Console](https://cloud.oracle.com/)
2. Navigate to **Compute** → **Instances**
3. Click **Create Instance**
4. Configure:
   - **Name**: `portfolio-server`
   - **Image**: Oracle Linux 8
   - **Shape**: VM.Standard.E2.1.Micro (Free tier eligible)
   - **Network**: Use default VCN or create new
   - **SSH Keys**: Upload your public SSH key

### 1.2 Configure Security List
1. Go to **Networking** → **Virtual Cloud Networks**
2. Click on your VCN → Security Lists → Default Security List
3. Add Ingress Rules:
   ```
   Source CIDR: 0.0.0.0/0
   IP Protocol: TCP
   Destination Port Range: 80
   ```
   ```
   Source CIDR: 0.0.0.0/0
   IP Protocol: TCP
   Destination Port Range: 443
   ```
   ```
   Source CIDR: 0.0.0.0/0
   IP Protocol: TCP
   Destination Port Range: 3000
   ```

## 🔧 Step 2: Setup Server

### 2.1 Connect to Server
```bash
ssh -i ~/.ssh/your-private-key opc@YOUR_SERVER_PUBLIC_IP
```

### 2.2 Run Server Setup Script
```bash
# Copy the setup script to your server
scp -i ~/.ssh/your-private-key scripts/server-setup.sh opc@YOUR_SERVER_IP:/tmp/

# SSH into server and run setup
ssh -i ~/.ssh/your-private-key opc@YOUR_SERVER_IP
chmod +x /tmp/server-setup.sh
sudo /tmp/server-setup.sh
```

## 🔐 Step 3: Configure GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Add these Repository Secrets:

### Required Secrets:
```
ORACLE_CLOUD_HOST
Value: YOUR_SERVER_PUBLIC_IP

ORACLE_CLOUD_USER  
Value: opc

ORACLE_CLOUD_SSH_KEY
Value: [Your complete private SSH key content]
```

### Example SSH Key Format:
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA7B8...
[Your full private key content]
...XYZ123==
-----END RSA PRIVATE KEY-----
```

## 📁 Step 4: Understanding the CI/CD Pipeline

Your repository already contains these files:

### `.github/workflows/deploy.yml`
- **Build Job**: Installs dependencies, runs linting, builds the app
- **Deploy Job**: Deploys to Oracle Cloud server using SSH
- **Triggers**: Runs on push to main branch

### `scripts/deploy.sh`
- Manages deployment on the server
- Uses PM2 for process management
- Includes health checks

### `scripts/server-setup.sh` 
- Initial server configuration
- Installs Node.js, PM2, Nginx
- Configures reverse proxy

## 🚀 Step 5: Deploy Your Application

### 5.1 Push Code to GitHub
```bash
git add .
git commit -m "Setup Oracle Cloud deployment"
git push origin main
```

### 5.2 Monitor Deployment
1. Go to GitHub → **Actions** tab
2. Watch the workflow execution
3. Check logs for any errors

### 5.3 Verify Deployment
Visit your application at:
- **Direct Access**: `http://YOUR_SERVER_IP:3000`
- **Through Nginx**: `http://YOUR_SERVER_IP`

## 🔍 Step 6: Monitoring and Maintenance

### SSH Commands for Management:
```bash
# Connect to server
ssh -i ~/.ssh/your-private-key opc@YOUR_SERVER_IP

# Check PM2 status
pm2 status

# View application logs
pm2 logs gen-ai-portfolio

# Restart application
pm2 restart gen-ai-portfolio

# Check Nginx status
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Server Resource Monitoring:
```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check CPU usage
top

# Check network connections
netstat -tlnp
```

## 🛠️ Troubleshooting

### Common Issues:

1. **SSH Connection Fails**
   - Check security list allows SSH (port 22)
   - Verify SSH key permissions: `chmod 600 ~/.ssh/private-key`
   - Check public IP address

2. **Deployment Fails**
   - Verify GitHub secrets are correctly set
   - Check workflow logs in GitHub Actions
   - Ensure server has enough disk space

3. **Application Not Loading**
   - Check PM2 status: `pm2 status`
   - View PM2 logs: `pm2 logs gen-ai-portfolio`
   - Check if port 3000 is accessible
   - Verify Nginx configuration: `sudo nginx -t`

4. **Build Fails**
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Review build logs in GitHub Actions

## 🔒 Security Best Practices

1. **Firewall Configuration**
   - Only open necessary ports
   - Consider restricting SSH access to specific IPs

2. **SSL Certificate** (Optional)
   ```bash
   # Install certbot for Let's Encrypt
   sudo yum install -y certbot python3-certbot-nginx
   
   # Get SSL certificate
   sudo certbot --nginx -d your-domain.com
   ```

3. **Regular Updates**
   ```bash
   # Update system packages
   sudo yum update -y
   
   # Update Node.js packages
   npm audit fix
   ```

## 📊 Monitoring Setup (Optional)

### Enable System Monitoring:
```bash
# Install htop for better process monitoring
sudo yum install -y htop

# Setup log monitoring
sudo yum install -y logwatch
```

## 🔄 Auto-scaling (Advanced)

For production environments, consider:
- Load balancer setup
- Multiple server instances
- Database configuration
- CDN integration (Oracle Cloud CDN)

## 🎉 Deployment Complete!

Your Next.js portfolio is now:
- ✅ Hosted on Oracle Cloud
- ✅ Auto-deployed via GitHub Actions
- ✅ Served through Nginx reverse proxy
- ✅ Managed by PM2 process manager
- ✅ Monitored with health checks

### Next Steps:
1. Point your domain to the server IP
2. Set up SSL certificate
3. Configure monitoring alerts
4. Set up regular backups

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review GitHub Actions logs
3. Check server logs via SSH
4. Verify all secrets are correctly configured

**Happy Deploying! 🚀**