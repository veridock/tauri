#!/bin/bash

# Tauri Dependencies Installation Script for openSUSE
# This script installs all required system dependencies for Tauri development

echo "🔧 Installing Tauri dependencies for openSUSE..."

# Update package list
echo "📦 Updating package list..."
sudo zypper refresh

# Install core dependencies
echo "🚀 Installing core Tauri dependencies..."
sudo zypper install -y \
  curl \
  wget \
  file \
  gcc \
  gcc-c++ \
  make \
  pkg-config \
  libopenssl-devel

# Install WebKit and GTK dependencies
echo "🌐 Installing WebKit and GTK dependencies..."
sudo zypper install -y \
  webkit2gtk3-devel \
  libjavascriptcoregtk-4_1-0 \
  libsoup-devel \
  gtk3-devel \
  libappindicator3-devel \
  librsvg-devel

# Install additional useful development tools
echo "🛠️ Installing additional development tools..."
sudo zypper install -y \
  git \
  nodejs \
  npm

echo "✅ All dependencies installed successfully!"
echo "🎉 You can now run: npm run tauri dev"
