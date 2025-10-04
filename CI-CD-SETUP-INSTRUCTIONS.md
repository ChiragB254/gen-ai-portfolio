# 🚀 CI/CD Setup Instructions for Chirag Portfolio

I've generated all the necessary configurations for your CI/CD pipeline. Follow these steps to activate it:

## 📋 Step 1: Add SSH Key to Oracle Cloud Server

### Public Key to Add to Server:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIC8eUVp+xcqZ9Nh+OlTpCxkmQHYYB4g/LfzkbK2q4NWo chirag-portfolio-cicd
```

### Commands to Run on Oracle Cloud Server:
```bash
# SSH into your Oracle Cloud server
ssh opc@YOUR_SERVER_IP

# Add the public key to authorized_keys
mkdir -p ~/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIC8eUVp+xcqZ9Nh+OlTpCxkmQHYYB4g/LfzkbK2q4NWo chirag-portfolio-cicd" >> ~/.ssh/authorized_keys

# Set correct permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# Exit the server
exit
```

## 🔐 Step 2: Configure GitHub Secrets

Go to your GitHub repository: **Settings > Secrets and variables > Actions**

Click **"New repository secret"** for each of these:

### Secret 1: ORACLE_CLOUD_HOST
- **Name**: `ORACLE_CLOUD_HOST`
- **Value**: `YOUR_ORACLE_CLOUD_SERVER_IP` (replace with your actual IP)

### Secret 2: ORACLE_CLOUD_USER
- **Name**: `ORACLE_CLOUD_USER`  
- **Value**: `opc`

### Secret 3: ORACLE_CLOUD_SSH_KEY
- **Name**: `ORACLE_CLOUD_SSH_KEY`
- **Value**: Copy and paste this ENTIRE private key (including the BEGIN/END lines):

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACAvHlFafsXKmfTYfjpU6QsZJkB2GAeIPy385GytquDVqAAAAJhXxPxqV8T8
agAAAAtzc2gtZWQyNTUxOQAAACAvHlFafsXKmfTYfjpU6QsZJkB2GAeIPy385GytquDVqA
AAAED0W42XN9tdzRTchAwmtXyfF7hqdCDAe47o9h1pJ0pD4y8eUVp+xcqZ9Nh+OlTpCxkm
QHYYYB4g/LfzkbK2q4NWoAAAAFWNoaXJhZy1wb3J0Zm9saW8tY2ljZA==
-----END OPENSSH PRIVATE KEY-----
```

## 🌍 Step 3: Create GitHub Environments

Go to your GitHub repository: **Settings > Environments**

### Create Production Environment:
1. Click **"New environment"**
2. Name: `production`
3. Click **"Configure environment"**
4. Under **"Deployment branches"**, select **"Selected branches"**
5. Add rule: `main`
6. Click **"Save protection rules"**

### Create Staging Environment:
1. Click **"New environment"**
2. Name: `staging`
3. Click **"Configure environment"**
4. Under **"Deployment branches"**, select **"Selected branches"**
5. Add rule: `develop`
6. Add another rule: `staging`
7. Click **"Save protection rules"**

## 🧪 Step 4: Test SSH Connection

Run this command from your local machine to verify the setup:

```bash
ssh -i ~/.ssh/chirag_portfolio_cicd opc@YOUR_SERVER_IP "echo 'SSH connection successful!' && docker --version"
```

Replace `YOUR_SERVER_IP` with your actual Oracle Cloud server IP.

## 🚀 Step 5: Test the CI/CD Pipeline

### Option A: Test Staging Deployment
```bash
# Create and push to develop branch
git checkout -b develop
git push origin develop
```

### Option B: Test Production Deployment  
```bash
# Push to main branch
git checkout main
git push origin main
```

### Option C: Manual Trigger
1. Go to **Actions** tab in your GitHub repository
2. Select "Deploy to Production" or "Deploy to Staging"
3. Click **"Run workflow"**
4. Choose branch and click **"Run workflow"**

## 📊 Step 6: Monitor Your Deployment

1. **GitHub Actions**: Go to **Actions** tab to see workflow progress
2. **Check Your Site**: 
   - Production: `https://your-domain.com`
   - Staging: `http://YOUR_SERVER_IP:3001`

## 🔧 Step 7: Server Preparation (If Not Done Already)

If you haven't run the deployment script before, SSH into your server and run:

```bash
# SSH into your server
ssh opc@YOUR_SERVER_IP

# Switch to root and create directories
sudo su -
mkdir -p /opt/chirag-portfolio
mkdir -p /opt/chirag-portfolio-staging
chown -R opc:opc /opt/chirag-portfolio*

# Ensure Docker is running
systemctl start docker
systemctl enable docker
usermod -aG docker opc
```

## ✅ Verification Checklist

- [ ] Public key added to Oracle Cloud server
- [ ] Three GitHub secrets configured
- [ ] Two GitHub environments created
- [ ] SSH connection test successful
- [ ] Server directories created
- [ ] Docker running on server
- [ ] Test deployment executed

## 🎯 What Happens Next

Once configured, your CI/CD pipeline will:

1. **On Pull Requests**: Run CI tests and comment with results
2. **On Push to develop**: Deploy to staging environment
3. **On Push to main**: Deploy to production with SSL
4. **On Failures**: Automatic rollback and notifications

## 🆘 Need Help?

If you encounter issues:

1. Check the **Actions** tab for error logs
2. Verify all secrets are correctly set
3. Ensure SSH key is properly added to server
4. Check server firewall and Docker status

## 🎉 Success!

Once everything is set up, you'll have:
- ✅ Automated testing on every PR
- ✅ Staging deployments for safe testing  
- ✅ Production deployments with zero downtime
- ✅ Automatic rollback on failures
- ✅ Professional DevOps workflow

Your portfolio will be automatically deployed to Oracle Cloud every time you push code! 🚀