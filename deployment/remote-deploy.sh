#!/bin/bash

# Remote deployment script for CI/CD
# This script is executed on the Oracle Cloud server during CI/CD deployment
# Usage: ./remote-deploy.sh [production|staging] [package-path]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
PACKAGE_PATH=${2:-/tmp/deployment-*.tar.gz}

if [ "$ENVIRONMENT" = "staging" ]; then
    APP_DIR="/opt/chirag-portfolio-staging"
    DOCKER_PROJECT="chirag-portfolio-staging"
    PORT=3001  # Different port for staging
else
    APP_DIR="/opt/chirag-portfolio"
    DOCKER_PROJECT="chirag-portfolio"
    PORT=3000
fi

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
if [[ $EUID -ne 0 ]]; then
    print_error "This script must be run as root"
    exit 1
fi

print_status "Starting $ENVIRONMENT deployment process..."

# Create backup of current deployment
create_backup() {
    if [ -d "$APP_DIR" ]; then
        print_status "Creating backup of current deployment..."
        BACKUP_DIR="${APP_DIR}-backup-$(date +%Y%m%d-%H%M%S)"
        cp -r "$APP_DIR" "$BACKUP_DIR"
        print_success "Backup created: $BACKUP_DIR"
        
        # Keep only last 3 backups
        ls -t "${APP_DIR}"-backup-* 2>/dev/null | tail -n +4 | xargs rm -rf || true
    fi
}

# Extract deployment package
extract_package() {
    print_status "Extracting deployment package..."
    
    # Create deployment directory
    mkdir -p "$APP_DIR"
    
    # Find the most recent package file
    PACKAGE_FILE=$(ls -t $PACKAGE_PATH 2>/dev/null | head -1)
    
    if [ -z "$PACKAGE_FILE" ]; then
        print_error "No deployment package found at $PACKAGE_PATH"
        exit 1
    fi
    
    print_status "Using package: $PACKAGE_FILE"
    
    # Extract to deployment directory
    tar -xzf "$PACKAGE_FILE" -C "$APP_DIR" --strip-components=0
    
    print_success "Package extracted to $APP_DIR"
}

# Configure for environment
configure_environment() {
    print_status "Configuring for $ENVIRONMENT environment..."
    
    cd "$APP_DIR"
    
    # Use appropriate nginx configuration
    if [ "$ENVIRONMENT" = "staging" ]; then
        if [ -f "nginx/nginx.dev.conf" ]; then
            cp nginx/nginx.dev.conf nginx/nginx.conf
            print_status "Using development nginx configuration for staging"
        fi
        
        # Update docker-compose for staging port
        if [ -f "docker-compose.yml" ]; then
            sed -i "s/\"3000:3000\"/\"$PORT:3000\"/g" docker-compose.yml
            print_status "Updated port mapping to $PORT for staging"
        fi
    fi
    
    # Set correct permissions
    chown -R opc:opc "$APP_DIR"
    chmod +x deployment/*.sh
    
    print_success "Environment configured"
}

# Deploy application
deploy_application() {
    print_status "Deploying application..."
    
    cd "$APP_DIR"
    
    # Stop existing containers
    print_status "Stopping existing containers..."
    docker-compose -p "$DOCKER_PROJECT" down || true
    
    # Remove old images to save space
    docker image prune -f || true
    
    # Build and start new containers
    print_status "Building and starting new containers..."
    docker-compose -p "$DOCKER_PROJECT" up --build -d
    
    print_success "Containers started"
}

# Verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Wait for application to start
    sleep 30
    
    # Check if containers are running
    cd "$APP_DIR"
    if docker-compose -p "$DOCKER_PROJECT" ps | grep -q "Up"; then
        print_success "✅ Containers are running"
    else
        print_error "❌ Containers are not running properly"
        docker-compose -p "$DOCKER_PROJECT" logs
        return 1
    fi
    
    # Try to curl the application
    if curl -f http://localhost:$PORT > /dev/null 2>&1; then
        print_success "✅ Application is responding"
    else
        print_warning "⚠️ Application health check failed, but containers are running"
        print_warning "This might be normal if the application takes time to start"
    fi
    
    print_success "Deployment verification completed"
}

# Cleanup
cleanup() {
    print_status "Cleaning up..."
    
    # Remove deployment packages
    rm -f /tmp/*deployment*.tar.gz
    
    # Clean up Docker resources
    docker system prune -f || true
    
    print_success "Cleanup completed"
}

# Main execution
main() {
    print_status "=== $ENVIRONMENT Deployment Script ==="
    print_status "Target directory: $APP_DIR"
    print_status "Docker project: $DOCKER_PROJECT"
    print_status "Port: $PORT"
    
    create_backup
    extract_package
    configure_environment
    deploy_application
    verify_deployment
    cleanup
    
    print_success "🚀 $ENVIRONMENT deployment completed successfully!"
    
    if [ "$ENVIRONMENT" = "production" ]; then
        print_status "Production application should be available at your configured domain"
    else
        print_status "Staging application should be available at http://your-server-ip:$PORT"
    fi
}

# Handle errors
trap 'print_error "Deployment failed at line $LINENO"' ERR

# Run main function
main "$@"