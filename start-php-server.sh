#!/bin/bash

# Start PHP server to serve SVG files with embedded PHP
# Load environment variables from .env file if it exists
if [[ -f ".env" ]]; then
    echo "📝 Loading environment variables from .env file..."
    export $(grep -v '^#' .env | xargs)
fi

# Set default PHP server port if not already set
export PHP_SERVER_PORT=${PHP_SERVER_PORT:-8088}

echo "🚀 Starting PHP development server for SVG+PHP processing..."

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install PHP:"
    echo "   Ubuntu/Debian: sudo apt install php-cli"
    echo "   Fedora/RHEL:   sudo dnf install php-cli"
    echo "   Arch Linux:    sudo pacman -S php"
    echo "   openSUSE:      sudo zypper install php"
    exit 1
fi

# Start PHP server on configured port
echo "📡 Starting PHP server on http://localhost:${PHP_SERVER_PORT}"
echo "📁 Document root: $(pwd)"
echo "🎯 Main application: ${PDF_PROCESSOR_URL}"
echo ""
echo "Press Ctrl+C to stop the server"
echo "----------------------------------------"

php -S localhost:${PHP_SERVER_PORT}
