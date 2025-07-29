#!/bin/bash

# Enhanced startup script with verbose logging and file output
# Load environment variables from .env file if it exists
if [[ -f ".env" ]]; then
    echo "📝 Loading environment variables from .env file..."
    export $(grep -v '^#' .env | xargs)
fi

# Set default ports if not already set
export VITE_PORT=${VITE_PORT:-1420}
export PHP_SERVER_PORT=${PHP_SERVER_PORT:-8088}

LOG_DIR="logs"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
MAIN_LOG_FILE="${LOG_DIR}/app_startup_${TIMESTAMP}.log"

# Create logs directory if it doesn't exist
mkdir -p "$LOG_DIR"

echo "🚀 Starting Tauri PDF Processor with Enhanced Logging..."
echo "📁 Working directory: $(pwd)"
echo "⏰ Started at: $(date)"
echo ""
echo "📋 Log Files will be created in: $LOG_DIR/"
echo "   📝 Main Log: $MAIN_LOG_FILE"
echo "   🌐 Vite Log: logs/vite_${TIMESTAMP}.log"
echo "   🖥️  Tauri Log: logs/tauri_${TIMESTAMP}.log"
echo "   🐘 PHP Server Log: logs/php_server_${TIMESTAMP}.log"
echo "   🔍 PHP Access Log: logs/php_access_${TIMESTAMP}.log"
echo "   ❌ PHP Error Log: logs/php_error_${TIMESTAMP}.log"
echo ""
echo "🎯 Application URLs:"
echo "   📡 Vite Dev Server: http://localhost:${VITE_PORT}"
echo "   🐘 PHP Server: http://localhost:${PHP_SERVER_PORT}"
echo "   📄 PDF Processor: http://localhost:${PHP_SERVER_PORT}/pdf.php.svg"
echo ""
echo "Press Ctrl+C to stop all servers"
echo "=================================================================="

# Log startup information
{
    echo "=================================================================="
    echo "Application Startup Log - $(date)"
    echo "=================================================================="
    echo "Working Directory: $(pwd)"
    echo "Node Version: $(node --version 2>/dev/null || echo 'Not found')"
    echo "NPM Version: $(npm --version 2>/dev/null || echo 'Not found')"
    echo "PHP Version: $(php --version 2>/dev/null | head -n1 || echo 'Not found')"
    echo "Git Branch: $(git branch --show-current 2>/dev/null || echo 'Not a git repo')"
    echo "Git Commit: $(git rev-parse --short HEAD 2>/dev/null || echo 'Not a git repo')"
    echo "=================================================================="
} >> "$MAIN_LOG_FILE"

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install PHP first:" | tee -a "$MAIN_LOG_FILE"
    echo "   Ubuntu/Debian: sudo apt install php-cli" | tee -a "$MAIN_LOG_FILE"
    echo "   Fedora/RHEL:   sudo dnf install php-cli" | tee -a "$MAIN_LOG_FILE"
    echo "   Arch Linux:    sudo pacman -S php" | tee -a "$MAIN_LOG_FILE"
    echo "   openSUSE:      sudo zypper install php" | tee -a "$MAIN_LOG_FILE"
    exit 1
fi

# Check if npm dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm dependencies..." | tee -a "$MAIN_LOG_FILE"
    npm install 2>&1 | tee -a "$MAIN_LOG_FILE"
fi

# Log system information
echo "System Information:" >> "$MAIN_LOG_FILE"
echo "OS: $(uname -a)" >> "$MAIN_LOG_FILE"
echo "Available Memory: $(free -h 2>/dev/null | grep Mem || echo 'Unknown')" >> "$MAIN_LOG_FILE"
echo "Available Disk Space: $(df -h . 2>/dev/null | tail -n1 || echo 'Unknown')" >> "$MAIN_LOG_FILE"
echo "Running Processes (before start): $(ps aux | wc -l)" >> "$MAIN_LOG_FILE"
echo "=================================================================="  >> "$MAIN_LOG_FILE"

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down all servers..." | tee -a "$MAIN_LOG_FILE"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Application shutdown initiated" >> "$MAIN_LOG_FILE"
    
    # Kill any remaining processes
    pkill -f "php -S localhost:8088" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    pkill -f "tauri dev" 2>/dev/null || true
    
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Cleanup completed" >> "$MAIN_LOG_FILE"
    echo "📋 All logs saved in: $LOG_DIR/" | tee -a "$MAIN_LOG_FILE"
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Log the start of services
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting Tauri app with PHP server (verbose mode)" >> "$MAIN_LOG_FILE"

# Start both services with verbose logging
echo "🚀 Starting services..." | tee -a "$MAIN_LOG_FILE"
npm run tauri-with-php-verbose 2>&1 | tee -a "$MAIN_LOG_FILE"
