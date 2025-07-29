#!/bin/bash

# Simple script to start Tauri app with PHP server automatically
# Load environment variables from .env file if it exists
if [[ -f ".env" ]]; then
    echo "📝 Loading environment variables from .env file..."
    export $(grep -v '^#' .env | xargs)
fi

# Set default ports if not already set
export VITE_PORT=${VITE_PORT:-1420}
export PHP_SERVER_PORT=${PHP_SERVER_PORT:-8088}

echo "🚀 Starting Tauri PDF Processor with PHP server..."
echo "📡 PHP server will run on: http://localhost:${PHP_SERVER_PORT}"
echo "🖥️  Tauri app will start automatically"
echo "📄 PDF processor will be available at: http://localhost:${PHP_SERVER_PORT}/pdf.php.svg"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "=========================================="

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install PHP first:"
    echo "   Ubuntu/Debian: sudo apt install php-cli"
    echo "   Fedora/RHEL:   sudo dnf install php-cli"
    echo "   Arch Linux:    sudo pacman -S php"
    echo "   openSUSE:      sudo zypper install php"
    exit 1
fi

# Check if npm dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm dependencies..."
    npm install
fi

# Start both PHP server and Tauri app
npm run tauri-with-php
