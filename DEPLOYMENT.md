# Oracle Cloud Linux Deployment Guide

This comprehensive guide will walk you through deploying your Chirag Portfolio Next.js application on Oracle Cloud Infrastructure (OCI) using Docker and nginx with SSL support.

## Prerequisites

- Oracle Cloud Instance running Oracle Linux
- Domain name pointing to your instance's public IP
- SSH access to your instance
- Root or sudo access

## Architecture Overview

The deployment uses:
- **Docker** for containerization
- **Next.js** application running in standalone mode
- **Nginx** as reverse proxy with SSL termination
- **Let's Encrypt** for SSL certificates
- **Systemd** for service management

## Step 1: Prepare Your Oracle Cloud Instance

### 1.1 Create Oracle Cloud Instance

1. Log into Oracle Cloud Console
2. Navigate to Compute → Instances
3. Click "Create Instance"
4. Choose Oracle Linux as the image
5. Select appropriate shape (minimum: 1 OCPU, 1GB RAM)
6. Configure networking and security
7. Add your SSH public key
8. Create the instance

### 1.2 Configure Security Lists

Add ingress rules for:
- Port 22 (SSH)
- Port 80 (HTTP)
- Port 443 (HTTPS)

### 1.3 Connect to Your Instance

```bash
ssh -i your-private-key.pem opc@your-instance-ip
```

## Step 2: Upload Your Code

### 2.1 Push to Git Repository

First, push your code to a Git repository (GitHub, GitLab, etc.):

```bash
# From your local machine
git add .
git commit -m "Add deployment configuration"
git push origin main
```

### 2.2 Update Configuration Files

Before deploying, update these configuration files:

1. **deployment/deploy.sh**:
   - Update `REPO_URL` with your repository URL
   - Update `DOMAIN` with your domain name
   - Update `EMAIL` with your email for SSL certificates

2. **nginx/nginx.conf**:
   - Replace `your-domain.com` with your actual domain
   - Update SSL certificate paths if needed

3. **docker-compose.yml**:
   - Verify port mappings
   - Update volumes if needed

## Step 3: Run the Deployment Script

### 3.1 Download and Run the Deployment Script

```bash
# On your Oracle Cloud instance
sudo su -  # Switch to root

# Clone your repository
git clone https://github.com/your-username/your-repo.git /opt/chirag-portfolio
cd /opt/chirag-portfolio

# Make the deployment script executable
chmod +x deployment/deploy.sh

# Run the deployment script
./deployment/deploy.sh production
```

### 3.2 What the Script Does

The deployment script will:
1. Update the system packages
2. Install Docker, Node.js, nginx, and other dependencies
3. Configure the firewall
4. Clone/update your repository
5. Build and deploy the Docker containers
6. Obtain SSL certificates from Let's Encrypt
7. Configure nginx
8. Set up systemd services
9. Configure log rotation

## Step 4: Manual Configuration (If Needed)

### 4.1 Environment Variables

Create production environment file:

```bash
cd /opt/chirag-portfolio
cp .env.production.example .env.production
# Edit the file with your actual values
nano .env.production
```

### 4.2 Configure Systemd Services

```bash
# Copy systemd service files
cp systemd/chirag-portfolio.service /etc/systemd/system/
cp systemd/certbot-renewal.service /etc/systemd/system/
cp systemd/certbot-renewal.timer /etc/systemd/system/

# Reload systemd and enable services
systemctl daemon-reload
systemctl enable chirag-portfolio.service
systemctl enable certbot-renewal.timer
systemctl start certbot-renewal.timer
```

## Step 5: Verify Deployment

### 5.1 Check Services Status

```bash
# Check Docker containers
docker-compose ps

# Check nginx status
systemctl status nginx

# Check application service
systemctl status chirag-portfolio

# Check SSL certificate renewal timer
systemctl status certbot-renewal.timer
```

### 5.2 Test the Application

1. Open your browser and navigate to `https://your-domain.com`
2. Verify SSL certificate is valid
3. Check that all pages load correctly
4. Test responsiveness

### 5.3 Check Logs

```bash
# Application logs
docker-compose logs -f

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# System logs
journalctl -u chirag-portfolio -f
```

## Step 6: Future Updates

### 6.1 Automated Updates

For future updates, simply run:

```bash
cd /opt/chirag-portfolio
./deployment/update.sh
```

### 6.2 Manual Updates

```bash
cd /opt/chirag-portfolio

# Pull latest changes
git pull origin main

# Rebuild and restart containers
docker-compose down
docker-compose up --build -d

# Check status
docker-compose ps
```

## Troubleshooting

### Common Issues

1. **Port 80/443 not accessible**:
   - Check Oracle Cloud security lists
   - Verify firewall rules: `firewall-cmd --list-all`

2. **SSL certificate issues**:
   - Ensure domain points to instance IP
   - Check DNS propagation: `dig your-domain.com`
   - Manually run certbot: `certbot certonly --standalone -d your-domain.com`

3. **Docker containers not starting**:
   - Check logs: `docker-compose logs`
   - Verify docker daemon: `systemctl status docker`
   - Check available disk space: `df -h`

4. **Application not accessible**:
   - Check container status: `docker-compose ps`
   - Verify nginx config: `nginx -t`
   - Check application logs: `docker-compose logs app`

### Log Locations

- Application logs: `docker-compose logs`
- Nginx access logs: `/var/log/nginx/access.log`
- Nginx error logs: `/var/log/nginx/error.log`
- System logs: `journalctl -u chirag-portfolio`
- SSL renewal logs: `journalctl -u certbot-renewal`

## Monitoring and Maintenance

### Regular Tasks

- Monitor SSL certificate expiration (auto-renewed by certbot)
- Check application performance and logs
- Update system packages monthly
- Monitor disk space usage
- Review nginx access logs for security issues

### Backup Recommendations

- Set up automated backups of your application data
- Backup SSL certificates
- Backup environment configuration files
- Document any custom configurations

## Security Best Practices

1. **Keep system updated**:
   ```bash
   dnf update -y
   ```

2. **Monitor failed login attempts**:
   ```bash
   journalctl _SYSTEMD_UNIT=sshd.service | grep "Failed password"
   ```

3. **Configure fail2ban** (optional):
   ```bash
   dnf install -y fail2ban
   systemctl enable fail2ban
   systemctl start fail2ban
   ```

4. **Regular security audits**:
   - Review open ports: `netstat -tlnp`
   - Check running processes: `ps aux`
   - Monitor system resources: `htop`

## Performance Optimization

1. **Enable HTTP/2** (already configured in nginx)
2. **Configure proper caching headers** (already configured)
3. **Monitor application performance**:
   ```bash
   docker stats
   ```
4. **Optimize images** (use Next.js Image component)

## Support

For issues with:
- Oracle Cloud Infrastructure: Check OCI documentation
- Docker: Check Docker documentation
- Next.js: Check Next.js documentation
- nginx: Check nginx documentation
- Let's Encrypt: Check Certbot documentation

## Conclusion

Your Next.js portfolio should now be successfully deployed on Oracle Cloud Infrastructure with:
- ✅ HTTPS enabled with auto-renewing SSL certificates
- ✅ Professional nginx reverse proxy configuration
- ✅ Docker containerization for easy deployment
- ✅ Systemd service management
- ✅ Automated log rotation
- ✅ Security headers and configurations

Your application should be accessible at `https://your-domain.com`.

## CI/CD Integration

For automated deployments using GitHub Actions, see the comprehensive [CI/CD Setup Guide](CI-CD-SETUP.md).

### Quick CI/CD Setup

1. **Set up GitHub Secrets**:
   - `ORACLE_CLOUD_HOST`: Your server's IP address
   - `ORACLE_CLOUD_USER`: SSH username (usually `opc`)
   - `ORACLE_CLOUD_SSH_KEY`: Your private SSH key

2. **Create GitHub Environments**:
   - `production` for main branch deployments
   - `staging` for develop branch deployments

3. **Push to Deploy**:
   ```bash
   # Deploy to staging
   git push origin develop
   
   # Deploy to production
   git push origin main
   ```

### Workflows Included

- **CI Workflow**: Automated testing and building on PRs
- **Production Deployment**: Auto-deploy from main branch
- **Staging Deployment**: Auto-deploy from develop/staging branches
- **Rollback Scripts**: Quick recovery from failed deployments

For detailed setup instructions, see [CI-CD-SETUP.md](CI-CD-SETUP.md).
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