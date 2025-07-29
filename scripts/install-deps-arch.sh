#!/bin/bash

# Tauri Dependencies Installation Script for Arch Linux
# This script installs all required system dependencies for Tauri development

echo "🔧 Installing Tauri dependencies for Arch Linux..."

# Update package database
echo "📦 Updating package database..."
sudo pacman -Syu --noconfirm

# Install core dependencies
echo "🚀 Installing core Tauri dependencies..."
sudo pacman -S --noconfirm \
  curl \
  wget \
  file \
  base-devel \
  pkg-config \
  openssl

# Install WebKit and GTK dependencies
echo "🌐 Installing WebKit and GTK dependencies..."
sudo pacman -S --noconfirm \
  webkit2gtk-4.1 \
  libsoup3 \
  gtk3 \
  libappindicator-gtk3 \
  librsvg

# Install additional useful development tools
echo "🛠️ Installing additional development tools..."
sudo pacman -S --noconfirm \
  git \
  nodejs \
  npm

echo "✅ All dependencies installed successfully!"
echo "🎉 You can now run: npm run tauri dev"
