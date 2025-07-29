#!/bin/bash

# Tauri SVG Processor - Stop Script
# Gracefully stops both PHP server (8088) and Vite server (1420)

echo "🛑 Stopping Tauri SVG Processor services..."
echo "==========================================="
echo

# Function to kill processes on a specific port
kill_port() {
    local port=$1
    local service_name=$2
    
    echo "🔍 Checking for $service_name on port $port..."
    
    # Find processes using the port
    local pids=$(lsof -ti:$port 2>/dev/null)
    
    if [ -z "$pids" ]; then
        echo "  ✅ Port $port is already free"
        return 0
    fi
    
    echo "  📝 Found processes: $pids"
    
    # Try graceful shutdown first (SIGTERM)
    echo "  🤝 Attempting graceful shutdown..."
    for pid in $pids; do
        if kill -TERM $pid 2>/dev/null; then
            echo "    - Sent SIGTERM to process $pid"
        fi
    done
    
    # Wait a moment for graceful shutdown
    sleep 2
    
    # Check if processes are still running
    local remaining_pids=$(lsof -ti:$port 2>/dev/null)
    
    if [ -z "$remaining_pids" ]; then
        echo "  ✅ $service_name stopped gracefully"
        return 0
    fi
    
    # Force kill if still running (SIGKILL)
    echo "  ⚡ Force killing remaining processes..."
    for pid in $remaining_pids; do
        if kill -KILL $pid 2>/dev/null; then
            echo "    - Force killed process $pid"
        fi
    done
    
    # Final verification
    sleep 1
    local final_check=$(lsof -ti:$port 2>/dev/null)
    
    if [ -z "$final_check" ]; then
        echo "  ✅ $service_name stopped successfully"
    else
        echo "  ❌ Warning: Some processes may still be running on port $port"
    fi
}

# Stop PHP Server (port 8088)
kill_port 8088 "PHP Server"
echo

# Stop Vite Server (port 1420) 
kill_port 1420 "Vite Server"
echo

# Also kill any Tauri processes that might be running
echo "🔍 Checking for Tauri processes..."
tauri_pids=$(pgrep -f "tauri.*dev\|target/debug/tauri-app" 2>/dev/null)

if [ -n "$tauri_pids" ]; then
    echo "  📝 Found Tauri processes: $tauri_pids"
    echo "  🛑 Stopping Tauri processes..."
    for pid in $tauri_pids; do
        if kill -TERM $pid 2>/dev/null; then
            echo "    - Stopped Tauri process $pid"
        fi
    done
else
    echo "  ✅ No Tauri processes running"
fi

echo
echo "🎯 Final Status Check:"
echo "======================"

# Check PHP server port
php_check=$(lsof -ti:8088 2>/dev/null)
if [ -z "$php_check" ]; then
    echo "  ✅ Port 8088 (PHP Server): FREE"
else
    echo "  ⚠️  Port 8088 (PHP Server): Still occupied by PID $php_check"
fi

# Check Vite server port  
vite_check=$(lsof -ti:1420 2>/dev/null)
if [ -z "$vite_check" ]; then
    echo "  ✅ Port 1420 (Vite Server): FREE"
else
    echo "  ⚠️  Port 1420 (Vite Server): Still occupied by PID $vite_check"
fi

echo
echo "🏁 Stop script completed!"
echo
echo "📝 To restart the services:"
echo "  1. ./start.sh"
echo "  2. npm run tauri dev"
echo
echo "🔍 To check port usage: lsof -i:8088 -i:1420"
