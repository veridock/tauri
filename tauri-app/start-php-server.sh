#!/bin/bash

# Start PHP server to serve SVG files with embedded PHP
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

# Start PHP server on port 8088
echo "📡 Starting PHP server on http://localhost:8088"
echo "📁 Document root: $(pwd)"
echo "🎯 Main application: http://localhost:8088/pdf.php.svg"
echo ""
echo "Press Ctrl+C to stop the server"
echo "----------------------------------------"

php -S localhost:8088
