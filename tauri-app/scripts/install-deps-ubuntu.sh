#!/bin/bash

# Tauri Dependencies Installation Script for Ubuntu/Debian
# This script installs all required system dependencies for Tauri development

echo "🔧 Installing Tauri dependencies for Ubuntu/Debian..."

# Update package list
echo "📦 Updating package list..."
sudo apt update

# Install core dependencies
echo "🚀 Installing core Tauri dependencies..."
sudo apt install -y \
  curl \
  wget \
  file \
  build-essential \
  pkg-config \
  libssl-dev

# Install WebKit and GTK dependencies
echo "🌐 Installing WebKit and GTK dependencies..."
sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  libjavascriptcoregtk-4.1-dev \
  libsoup-3.0-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev

# Install additional useful development tools
echo "🛠️ Installing additional development tools..."
sudo apt install -y \
  git \
  nodejs \
  npm

echo "✅ All dependencies installed successfully!"
echo "🎉 You can now run: npm run tauri dev"
