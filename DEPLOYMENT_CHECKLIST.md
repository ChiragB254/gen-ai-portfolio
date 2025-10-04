# 📝 Oracle Cloud Deployment Checklist

## Pre-deployment Setup

### ☐ Oracle Cloud Instance
- [ ] Create Oracle Cloud account
- [ ] Create compute instance (VM.Standard.E2.1.Micro for free tier)
- [ ] Configure security list (ports 22, 80, 443, 3000)
- [ ] Generate SSH key pair
- [ ] Note down public IP address

### ☐ SSH Key Setup
- [ ] Create SSH key pair: `ssh-keygen -t rsa -b 4096 -C "your-email@example.com"`
- [ ] Add public key to Oracle Cloud instance
- [ ] Set proper permissions: `chmod 600 ~/.ssh/private-key`
- [ ] Test SSH connection: `ssh -i ~/.ssh/private-key opc@SERVER_IP`

### ☐ Server Configuration
- [ ] Copy server setup script to server
- [ ] Run server setup script: `sudo /tmp/server-setup.sh`
- [ ] Verify Node.js installation: `node --version`
- [ ] Verify PM2 installation: `pm2 --version`
- [ ] Verify Nginx installation: `sudo systemctl status nginx`

### ☐ GitHub Secrets Configuration
Go to GitHub → Repository → Settings → Secrets and variables → Actions

- [ ] Add `ORACLE_CLOUD_HOST` (your server's public IP)
- [ ] Add `ORACLE_CLOUD_USER` (usually "opc" for Oracle Linux)
- [ ] Add `ORACLE_CLOUD_SSH_KEY` (your private SSH key content)

## Deployment Process

### ☐ Code Preparation
- [ ] Ensure all files are committed
- [ ] Verify package.json has all dependencies
- [ ] Test build locally: `npm run build`
- [ ] Test lint locally: `npm run lint`

### ☐ Deploy to GitHub
- [ ] Push code to main branch: `git push origin main`
- [ ] Monitor GitHub Actions workflow
- [ ] Check for any build/deployment errors

### ☐ Verification
- [ ] Visit `http://YOUR_SERVER_IP:3000` (direct access)
- [ ] Visit `http://YOUR_SERVER_IP` (through Nginx)
- [ ] Check PM2 status: `pm2 status`
- [ ] Check application logs: `pm2 logs gen-ai-portfolio`

## Post-deployment (Optional)

### ☐ Domain & SSL
- [ ] Point your domain to server IP
- [ ] Install SSL certificate with Let's Encrypt
- [ ] Update Nginx configuration for HTTPS

### ☐ Monitoring
- [ ] Set up log monitoring
- [ ] Configure system alerts
- [ ] Set up backup strategy

### ☐ Security
- [ ] Review firewall rules
- [ ] Update system packages regularly
- [ ] Monitor security logs

## Common Commands for Reference

```bash
# SSH into server
ssh -i ~/.ssh/your-private-key opc@YOUR_SERVER_IP

# Check application status
pm2 status
pm2 logs gen-ai-portfolio
pm2 restart gen-ai-portfolio

# Check system resources
df -h          # Disk usage
free -h        # Memory usage
top            # CPU usage

# Nginx management
sudo systemctl status nginx
sudo systemctl restart nginx
sudo nginx -t  # Test configuration
```

## Troubleshooting Quick Fixes

### Deployment Fails
1. Check GitHub Actions logs
2. Verify all secrets are set correctly
3. Ensure server has enough space: `df -h`

### Application Not Loading
1. Check PM2: `pm2 status`
2. Check logs: `pm2 logs gen-ai-portfolio`
3. Check Nginx: `sudo systemctl status nginx`

### SSH Connection Issues
1. Verify IP address is correct
2. Check SSH key permissions: `chmod 600 ~/.ssh/private-key`
3. Ensure port 22 is open in security list

---

**✅ All items checked? You're ready to deploy! 🚀**