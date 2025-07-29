#!/bin/bash

# Simple script to start Tauri app with PHP server automatically
echo "🚀 Starting Tauri PDF Processor with PHP server..."
echo "📡 PHP server will run on: http://localhost:8088"
echo "🖥️  Tauri app will start automatically"
echo "📄 PDF processor will be available at: http://localhost:8088/pdf.php.svg"
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
