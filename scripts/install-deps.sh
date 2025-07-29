#!/bin/bash

# Universal Tauri Dependencies Installation Script
# This script auto-detects the Linux distribution and runs the appropriate installer

echo "🔍 Detecting Linux distribution..."

# Detect the Linux distribution
if [[ -f /etc/os-release ]]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
elif type lsb_release >/dev/null 2>&1; then
    OS=$(lsb_release -si)
    VER=$(lsb_release -sr)
elif [[ -f /etc/redhat-release ]]; then
    OS=$(cat /etc/redhat-release)
else
    OS=$(uname -s)
fi

echo "📋 Detected: $OS"

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Run the appropriate installation script
case $OS in
    "Ubuntu"*|"Debian"*|"Linux Mint"*|"Pop!_OS"*)
        echo "🐧 Running Ubuntu/Debian installer..."
        bash "$SCRIPT_DIR/install-deps-ubuntu.sh"
        ;;
    "Fedora"*|"CentOS"*|"Red Hat"*|"Rocky"*|"AlmaLinux"*)
        echo "🎩 Running Fedora/RHEL installer..."
        bash "$SCRIPT_DIR/install-deps-fedora.sh"
        ;;
    "Arch Linux"*|"Manjaro"*|"EndeavourOS"*)
        echo "⚡ Running Arch Linux installer..."
        bash "$SCRIPT_DIR/install-deps-arch.sh"
        ;;
    "openSUSE"*|"SUSE"*)
        echo "🦎 Running openSUSE installer..."
        bash "$SCRIPT_DIR/install-deps-opensuse.sh"
        ;;
    *)
        echo "❌ Unsupported distribution: $OS"
        echo "📝 Supported distributions:"
        echo "   - Ubuntu/Debian (apt)"
        echo "   - Fedora/CentOS/RHEL (dnf/yum)"
        echo "   - Arch Linux (pacman)"
        echo "   - openSUSE (zypper)"
        echo ""
        echo "💡 Please manually install the following packages for your distribution:"
        echo "   - webkit2gtk-4.1-dev (or equivalent)"
        echo "   - libjavascriptcoregtk-4.1-dev (or equivalent)"
        echo "   - libsoup-3.0-dev (or equivalent)"
        echo "   - libgtk-3-dev (or equivalent)"
        echo "   - libayatana-appindicator3-dev (or equivalent)"
        echo "   - librsvg2-dev (or equivalent)"
        echo "   - build-essential/base-devel"
        echo "   - pkg-config"
        echo "   - openssl-dev"
        exit 1
        ;;
esac
