#!/bin/bash

# Update script for Chirag Portfolio
# Usage: ./update.sh

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

APP_DIR="/opt/chirag-portfolio"

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    echo "This script must be run as root"
    exit 1
fi

print_status "Starting update process..."

# Navigate to app directory
cd "$APP_DIR"

# Pull latest changes
print_status "Pulling latest changes from repository..."
git pull origin main

# Stop current containers
print_status "Stopping current containers..."
docker-compose down

# Build and start updated containers
print_status "Building and starting updated containers..."
docker-compose up --build -d

# Check if containers are running
print_status "Checking container status..."
docker-compose ps

print_success "Update completed successfully!"
print_status "Application should be running on the configured domain/IP"