#!/bin/bash

# Rollback script for failed deployments
# Usage: ./rollback.sh [production|staging] [backup-timestamp]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ENVIRONMENT=${1:-production}
BACKUP_TIMESTAMP=${2}

if [ "$ENVIRONMENT" = "staging" ]; then
    APP_DIR="/opt/chirag-portfolio-staging"
    DOCKER_PROJECT="chirag-portfolio-staging"
else
    APP_DIR="/opt/chirag-portfolio"
    DOCKER_PROJECT="chirag-portfolio"
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

print_status "Starting rollback process for $ENVIRONMENT..."

# Find the most recent backup
find_backup() {
    if [ -n "$BACKUP_TIMESTAMP" ]; then
        BACKUP_DIR="${APP_DIR}-backup-${BACKUP_TIMESTAMP}"
        if [ ! -d "$BACKUP_DIR" ]; then
            print_error "Backup directory not found: $BACKUP_DIR"
            exit 1
        fi
    else
        # Find the most recent backup
        BACKUP_DIR=$(ls -td "${APP_DIR}"-backup-* 2>/dev/null | head -1)
        if [ -z "$BACKUP_DIR" ]; then
            print_error "No backup directories found"
            exit 1
        fi
    fi
    
    print_status "Using backup: $BACKUP_DIR"
}

# Rollback to previous version
rollback() {
    print_status "Rolling back to previous version..."
    
    # Stop current containers
    print_status "Stopping current containers..."
    cd "$APP_DIR" || exit 1
    docker-compose -p "$DOCKER_PROJECT" down || true
    
    # Create a backup of the failed deployment
    if [ -d "$APP_DIR" ]; then
        print_status "Creating backup of failed deployment..."
        mv "$APP_DIR" "${APP_DIR}-failed-$(date +%Y%m%d-%H%M%S)"
    fi
    
    # Restore from backup
    print_status "Restoring from backup..."
    cp -r "$BACKUP_DIR" "$APP_DIR"
    
    # Set correct permissions
    chown -R opc:opc "$APP_DIR"
    chmod +x "$APP_DIR"/deployment/*.sh
    
    # Start the restored application
    print_status "Starting restored application..."
    cd "$APP_DIR"
    docker-compose -p "$DOCKER_PROJECT" up -d
    
    print_success "Rollback completed"
}

# Verify rollback
verify_rollback() {
    print_status "Verifying rollback..."
    
    # Wait for application to start
    sleep 30
    
    cd "$APP_DIR"
    if docker-compose -p "$DOCKER_PROJECT" ps | grep -q "Up"; then
        print_success "✅ Rollback successful - containers are running"
    else
        print_error "❌ Rollback failed - containers are not running"
        docker-compose -p "$DOCKER_PROJECT" logs
        return 1
    fi
    
    print_success "Rollback verification completed"
}

# Main execution
main() {
    print_status "=== $ENVIRONMENT Rollback Script ==="
    
    find_backup
    rollback
    verify_rollback
    
    print_success "🔄 Rollback completed successfully!"
    print_warning "Please investigate the cause of the deployment failure"
}

# Handle errors
trap 'print_error "Rollback failed at line $LINENO"' ERR

# Run main function
main "$@"