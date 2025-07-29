#!/bin/bash

# Tauri Dependencies Installation Script for Fedora/CentOS/RHEL
# This script installs all required system dependencies for Tauri development

echo "🔧 Installing Tauri dependencies for Fedora/CentOS/RHEL..."

# Update package list
echo "📦 Updating package list..."
sudo dnf update -y

# Install core dependencies
echo "🚀 Installing core Tauri dependencies..."
sudo dnf install -y \
  curl \
  wget \
  file \
  gcc \
  gcc-c++ \
  make \
  pkg-config \
  openssl-devel

# Install WebKit and GTK dependencies
echo "🌐 Installing WebKit and GTK dependencies..."
sudo dnf install -y \
  webkit2gtk4.1-devel \
  javascriptcoregtk4.1-devel \
  libsoup3-devel \
  gtk3-devel \
  libappindicator-gtk3-devel \
  librsvg2-devel

# Install additional useful development tools
echo "🛠️ Installing additional development tools..."
sudo dnf install -y \
  git \
  nodejs \
  npm

echo "✅ All dependencies installed successfully!"
echo "🎉 You can now run: npm run tauri dev"
