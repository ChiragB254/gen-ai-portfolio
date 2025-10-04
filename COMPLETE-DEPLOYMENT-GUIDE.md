# 🚀 Complete Oracle Cloud Deployment Guide

## What We'll Do:

1. ✅ Add SSH key to your Oracle Cloud server
2. ✅ Install Docker and dependencies on server
3. ✅ Build your Next.js application
4. ✅ Package and transfer files to server
5. ✅ Deploy with Docker containers
6. ✅ Configure firewall
7. ✅ Start your portfolio website

**Time Required:** 10-15 minutes
**Your Portfolio Will Be Live At:** http://155.248.220.162:3000

---

## Step 1: Add SSH Key to Server (1 minute)

**What:** Add the CI/CD key so automated deployments work
**Command:**
```bash
ssh opc@155.248.220.162 'mkdir -p ~/.ssh && echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIC8eUVp+xcqZ9Nh+OlTpCxkmQHYYB4g/LfzkbK2q4NWo chirag-portfolio-cicd" >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys'
```

---

## Step 2: Prepare Server (3-5 minutes)

**What:** Install Docker, nginx, and required software
**Commands:**
```bash
ssh opc@155.248.220.162 << 'ENDSSH'
# Update system
sudo dnf update -y

# Install Docker, Docker Compose, nginx, git
sudo dnf install -y docker git nginx

# Install Docker Compose separately
sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Create deployment directories
sudo mkdir -p /opt/chirag-portfolio
sudo chown -R opc:opc /opt/chirag-portfolio

# Configure firewall
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload

echo "✅ Server preparation complete!"
ENDSSH
```

---

## Step 3: Build Application Locally (2-3 minutes)

**What:** Build your Next.js app for production
**Command:**
```bash
npm run build
```

---

## Step 4: Package Files (1 minute)

**What:** Create deployment package
**Command:**
```bash
tar -czf portfolio-deployment.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.log' \
  .
```

---

## Step 5: Transfer to Server (1-2 minutes)

**What:** Upload files to Oracle Cloud
**Command:**
```bash
scp -i ~/.ssh/chirag_portfolio_cicd portfolio-deployment.tar.gz opc@155.248.220.162:/tmp/
```

---

## Step 6: Deploy on Server (3-5 minutes)

**What:** Extract files, build Docker image, start containers
**Commands:**
```bash
ssh -i ~/.ssh/chirag_portfolio_cicd opc@155.248.220.162 << 'ENDSSH'
# Navigate to deployment directory
cd /opt/chirag-portfolio

# Extract files
tar -xzf /tmp/portfolio-deployment.tar.gz

# Make scripts executable
chmod +x deployment/*.sh

# Build and start with Docker
docker-compose up --build -d

# Wait for startup
sleep 30

# Check status
docker-compose ps

echo "✅ Deployment complete!"
ENDSSH
```

---

## Step 7: Verify Deployment (30 seconds)

**What:** Check if your portfolio is live
**Command:**
```bash
ssh -i ~/.ssh/chirag_portfolio_cicd opc@155.248.220.162 'curl -I http://localhost:3000'
```

---

## 🎉 Your Portfolio Is Live!

**Access your portfolio at:**
- http://155.248.220.162:3000

**To add a custom domain:**
1. Point your domain's A record to: 155.248.220.162
2. Update nginx configuration
3. Get free SSL certificate

---

## 🔧 Useful Commands After Deployment

### View logs:
```bash
ssh opc@155.248.220.162 'cd /opt/chirag-portfolio && docker-compose logs -f'
```

### Restart application:
```bash
ssh opc@155.248.220.162 'cd /opt/chirag-portfolio && docker-compose restart'
```

### Stop application:
```bash
ssh opc@155.248.220.162 'cd /opt/chirag-portfolio && docker-compose down'
```

### Update application:
```bash
# Build and transfer new version
npm run build
tar -czf portfolio-update.tar.gz --exclude='node_modules' --exclude='.git' .
scp portfolio-update.tar.gz opc@155.248.220.162:/tmp/

# Deploy update
ssh opc@155.248.220.162 << 'ENDSSH'
cd /opt/chirag-portfolio
tar -xzf /tmp/portfolio-update.tar.gz
docker-compose down
docker-compose up --build -d
ENDSSH
```

---

## 🆘 Troubleshooting

### Application not responding:
```bash
ssh opc@155.248.220.162 'cd /opt/chirag-portfolio && docker-compose logs --tail=100'
```

### Check if Docker is running:
```bash
ssh opc@155.248.220.162 'sudo systemctl status docker'
```

### Check firewall:
```bash
ssh opc@155.248.220.162 'sudo firewall-cmd --list-all'
```

### Free up disk space:
```bash
ssh opc@155.248.220.162 'docker system prune -af'
```

---

## 📊 What's Deployed:

- ✅ Next.js application in production mode
- ✅ Docker containers for isolation
- ✅ Nginx reverse proxy (optional)
- ✅ Automatic restart on failure
- ✅ Firewall configured
- ✅ Ready for custom domain

**Enjoy your live portfolio! 🎉**