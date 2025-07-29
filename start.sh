#!/bin/bash

# Tauri SVG Processor - Unified Start Script
# Starts all services with a single command: PHP server + Tauri app

echo "🚀 Tauri SVG Processor - Unified Startup"
echo "========================================"
echo

# Function to handle cleanup on script exit
cleanup() {
    echo
    echo "🛑 Received interrupt signal, cleaning up..."
    ./stop.sh
    exit 0
}

# Set up signal handlers for graceful shutdown
trap cleanup SIGINT SIGTERM

# Step 1: Stop any existing processes first
echo "🧹 Step 1: Cleaning up existing processes..."
./stop.sh > /dev/null 2>&1
sleep 2

# Step 2: Load and validate environment
echo "🔧 Step 2: Loading environment configuration..."
if [[ ! -f ".env" ]]; then
    echo "❌ Error: .env file not found!"
    echo "   Please create a .env file with your configuration."
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env | grep -v '^$' | xargs)

# Set defaults if not specified
export PHP_SERVER_PORT=${PHP_SERVER_PORT:-8088}
export VITE_PORT=${VITE_PORT:-1420}
export VITE_FILE_PHP=${VITE_FILE_PHP:-todo.php.svg}

echo "  ✅ PHP Server Port: $PHP_SERVER_PORT"
echo "  ✅ Vite Server Port: $VITE_PORT"
echo "  ✅ SVG File: $VITE_FILE_PHP"

# Step 3: Generate cross-language configuration
echo
echo "⚙️ Step 3: Generating cross-language configuration..."
if ! node env.js; then
    echo "❌ Error: Failed to generate configuration files"
    exit 1
fi

# Step 4: Validate dependencies
echo
echo "🔍 Step 4: Validating dependencies..."

# Check PHP
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install PHP:"
    echo "   Ubuntu/Debian: sudo apt install php-cli"
    echo "   Fedora/RHEL:   sudo dnf install php-cli"
    echo "   Arch Linux:    sudo pacman -S php"
    echo "   openSUSE:      sudo zypper install php"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js"
    exit 1
fi

# Check if SVG file exists
if [[ ! -f "$VITE_FILE_PHP" ]]; then
    echo "❌ Error: SVG file '$VITE_FILE_PHP' not found!"
    exit 1
fi

echo "  ✅ PHP: $(php --version | head -1)"
echo "  ✅ Node.js: $(node --version)"
echo "  ✅ SVG file: $VITE_FILE_PHP ($(stat -c%s "$VITE_FILE_PHP") bytes)"

# Step 5: Check if ports are free
echo
echo "🔍 Step 5: Checking port availability..."

php_port_check=$(lsof -ti:$PHP_SERVER_PORT 2>/dev/null)
if [[ -n "$php_port_check" ]]; then
    echo "❌ Error: Port $PHP_SERVER_PORT is still in use by process $php_port_check"
    echo "   Run ./stop.sh to clean up processes"
    exit 1
fi

vite_port_check=$(lsof -ti:$VITE_PORT 2>/dev/null)
if [[ -n "$vite_port_check" ]]; then
    echo "❌ Error: Port $VITE_PORT is still in use by process $vite_port_check"
    echo "   Run ./stop.sh to clean up processes"
    exit 1
fi

echo "  ✅ Port $PHP_SERVER_PORT: Available"
echo "  ✅ Port $VITE_PORT: Available"

# Step 6: Start PHP Server in background
echo
echo "🐘 Step 6: Starting PHP Server..."
echo "  📡 URL: http://localhost:$PHP_SERVER_PORT"
echo "  📁 Document root: $(pwd)"
echo "  🎯 SVG application: http://localhost:$PHP_SERVER_PORT/$VITE_FILE_PHP"

# Start PHP server in background with output redirection
nohup php -S localhost:$PHP_SERVER_PORT > php_server.log 2>&1 &
PHP_PID=$!

# Wait a moment and check if PHP server started successfully
sleep 2

if ! kill -0 $PHP_PID 2>/dev/null; then
    echo "❌ Error: PHP server failed to start"
    echo "   Check php_server.log for details"
    exit 1
fi

# Test PHP server responsiveness
if curl -s -f "http://localhost:$PHP_SERVER_PORT/$VITE_FILE_PHP" > /dev/null; then
    echo "  ✅ PHP Server started successfully (PID: $PHP_PID)"
else
    echo "❌ Error: PHP server is running but not responding correctly"
    kill $PHP_PID 2>/dev/null
    exit 1
fi

# Step 7: Start Tauri App
echo
echo "🦀 Step 7: Starting Tauri Application..."
echo "  🌐 Frontend URL: http://localhost:$VITE_PORT"
echo "  🖥️  Desktop app will open automatically"
echo

echo "📝 Starting Tauri development environment..."
echo "   (This may take a moment for initial compilation)"
echo

# Start Tauri app (this will block until the app is closed)
npm run tauri dev

# This point is reached when Tauri app is closed
echo
echo "🏁 Tauri application closed."

# Step 8: Cleanup
echo
echo "🧹 Step 8: Cleaning up background processes..."
if kill -0 $PHP_PID 2>/dev/null; then
    echo "  🛑 Stopping PHP server (PID: $PHP_PID)..."
    kill $PHP_PID
    wait $PHP_PID 2>/dev/null
    echo "  ✅ PHP server stopped"
fi

echo
echo "🎉 All services stopped. Thank you for using Tauri SVG Processor!"
echo
echo "📝 To start again: ./start.sh"
echo "🛑 To stop all services: ./stop.sh"
echo "🧪 To test system: node test-env-system.js"
