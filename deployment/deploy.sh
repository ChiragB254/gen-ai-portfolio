#!/bin/bash

# Oracle Cloud Linux Deployment Script for Chirag Portfolio
# Usage: ./deploy.sh [production|staging]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="chirag-portfolio"
APP_DIR="/opt/${APP_NAME}"
REPO_URL="https://github.com/chirag/chirag-portfolio-nextjs.git" # Update with your actual repo
DOMAIN="your-domain.com" # Update with your domain
EMAIL="your-email@domain.com" # Update with your email for SSL

# Environment (default to production)
ENV=${1:-production}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root"
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing system dependencies..."
    
    # Update system
    dnf update -y
    
    # Install Docker
    dnf install -y docker docker-compose
    
    # Install Node.js and npm (for building)
    dnf install -y nodejs npm
    
    # Install nginx
    dnf install -y nginx
    
    # Install certbot for SSL
    dnf install -y certbot python3-certbot-nginx
    
    # Install git
    dnf install -y git
    
    # Start and enable Docker
    systemctl start docker
    systemctl enable docker
    
    # Add current user to docker group
    usermod -aG docker $SUDO_USER
    
    print_success "System dependencies installed"
}

# Setup firewall
setup_firewall() {
    print_status "Configuring firewall..."
    
    # Enable firewall
    systemctl start firewalld
    systemctl enable firewalld
    
    # Allow HTTP and HTTPS
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --permanent --add-port=22/tcp
    
    # Reload firewall
    firewall-cmd --reload
    
    print_success "Firewall configured"
}

# Clone or update repository
setup_app() {
    print_status "Setting up application..."
    
    if [ ! -d "$APP_DIR" ]; then
        print_status "Cloning repository..."
        git clone "$REPO_URL" "$APP_DIR"
    else
        print_status "Updating repository..."
        cd "$APP_DIR"
        git pull origin main
    fi
    
    cd "$APP_DIR"
    
    # Set permissions
    chown -R $SUDO_USER:$SUDO_USER "$APP_DIR"
    
    print_success "Application setup complete"
}

# Build and deploy application
deploy_app() {
    print_status "Building and deploying application..."
    
    cd "$APP_DIR"
    
    # Stop existing containers
    docker-compose down || true
    
    # Build and start new containers
    docker-compose up --build -d
    
    print_success "Application deployed successfully"
}

# Setup SSL certificate
setup_ssl() {
    print_status "Setting up SSL certificate..."
    
    # Stop nginx temporarily
    systemctl stop nginx
    
    # Get SSL certificate
    certbot certonly --standalone -d "$DOMAIN" --email "$EMAIL" --agree-tos --non-interactive
    
    print_success "SSL certificate obtained"
}

# Start services
start_services() {
    print_status "Starting services..."
    
    # Enable and start nginx
    systemctl enable nginx
    systemctl start nginx
    
    print_success "Services started"
}

# Setup log rotation
setup_logs() {
    print_status "Setting up log rotation..."
    
    cat > /etc/logrotate.d/chirag-portfolio << EOF
/var/log/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 nginx nginx
    postrotate
        systemctl reload nginx
    endscript
}
EOF
    
    print_success "Log rotation configured"
}

# Main deployment function
main() {
    print_status "Starting deployment for environment: $ENV"
    
    check_root
    install_dependencies
    setup_firewall
    setup_app
    deploy_app
    
    if [ "$ENV" = "production" ]; then
        setup_ssl
    fi
    
    start_services
    setup_logs
    
    print_success "Deployment completed successfully!"
    print_status "Application should be available at:"
    if [ "$ENV" = "production" ]; then
        print_status "https://$DOMAIN"
    else
        print_status "http://$(curl -s ifconfig.me)"
    fi
    
    print_warning "Don't forget to:"
    print_warning "1. Update the REPO_URL in this script"
    print_warning "2. Update the DOMAIN variable"
    print_warning "3. Update the EMAIL variable for SSL"
    print_warning "4. Configure your DNS to point to this server"
}

# Run main function
main "$@"