#!/bin/bash

# Enhanced PHP server with verbose logging
# Load environment variables from .env file if it exists
if [[ -f ".env" ]]; then
    echo "📝 Loading environment variables from .env file..."
    export $(grep -v '^#' .env | xargs)
fi

# Set default PHP server port if not already set
export PHP_SERVER_PORT=${PHP_SERVER_PORT:-8088}

LOG_DIR="logs"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
PHP_LOG_FILE="${LOG_DIR}/php_server_${TIMESTAMP}.log"
ACCESS_LOG_FILE="${LOG_DIR}/php_access_${TIMESTAMP}.log"
ERROR_LOG_FILE="${LOG_DIR}/php_error_${TIMESTAMP}.log"

# Create logs directory if it doesn't exist
mkdir -p "$LOG_DIR"

echo "🚀 Starting Enhanced PHP Server with Verbose Logging..."
echo "📁 Document root: $(pwd)"
echo "📡 Server URL: http://localhost:${PHP_SERVER_PORT}"
echo "🎯 PDF Processor: ${PDF_PROCESSOR_URL}"
echo ""
echo "📋 Log Files:"
echo "   📝 Server Log: $PHP_LOG_FILE"
echo "   🌐 Access Log: $ACCESS_LOG_FILE"
echo "   ❌ Error Log:  $ERROR_LOG_FILE"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=================================================="

# Create initial log entries
echo "[$(date '+%Y-%m-%d %H:%M:%S')] PHP Server Starting..." >> "$PHP_LOG_FILE"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Document Root: $(pwd)" >> "$PHP_LOG_FILE"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Server URL: http://localhost:${PHP_SERVER_PORT}" >> "$PHP_LOG_FILE"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] PDF Processor: ${PDF_PROCESSOR_URL}" >> "$PHP_LOG_FILE"

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] PHP Server Shutting Down..." >> "$PHP_LOG_FILE"
    echo "🛑 PHP Server stopped"
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Start PHP server with verbose output and logging
php -S localhost:${PHP_SERVER_PORT} -t . \
    -d log_errors=1 \
    -d error_log="$ERROR_LOG_FILE" \
    -d display_errors=1 \
    -d display_startup_errors=1 \
    -d log_errors_max_len=0 \
    -d auto_prepend_file="" \
    -d auto_append_file="" 2>&1 | while IFS= read -r line; do
    
    # Add timestamp to each line
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Log to file
    echo "[$timestamp] $line" >> "$PHP_LOG_FILE"
    
    # Also log access patterns
    if [[ "$line" =~ "GET"|"POST"|"PUT"|"DELETE" ]]; then
        echo "[$timestamp] $line" >> "$ACCESS_LOG_FILE"
    fi
    
    # Display colored output to console
    if [[ "$line" =~ "404"|"error"|"Error"|"ERROR" ]]; then
        echo -e "\033[31m[PHP-ERROR] [$timestamp] $line\033[0m"
    elif [[ "$line" =~ "GET"|"POST" ]]; then
        echo -e "\033[32m[PHP-ACCESS] [$timestamp] $line\033[0m"
    else
        echo -e "\033[33m[PHP-INFO] [$timestamp] $line\033[0m"
    fi
done
