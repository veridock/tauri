# Tauri PDF Processor App

A powerful desktop application built with Tauri that processes PDF files and runs SVG-based applications with embedded PHP and JavaScript code.

## 🚀 What This App Does

This Tauri application provides:

### 📄 PDF Processing Features
- **File Upload**: Upload PDF files through an intuitive interface
- **Format Conversion**: Convert PDFs to PNG, JPG, or SVG formats
- **DPI Control**: Customize output resolution (72-600 DPI)
- **PDF Analysis**: Analyze PDF structure and properties
- **File Download**: Download processed files directly

### 🎨 SVG + PHP Integration
The app runs **SVG files with embedded PHP code** from `pdf.php.svg`, featuring:
- **Interactive SVG Interface**: Native SVG-based UI with embedded JavaScript
- **Server-side PHP Processing**: Backend PHP code execution for file processing
- **Real-time Status Updates**: Live feedback during file operations
- **Sample File Management**: Built-in sample files for testing

## ⚙️ Port Configuration

The application supports flexible port configuration through environment variables and the `.env` file.

### Default Ports

- **Vite Dev Server**: `1420`
- **PHP Server**: `8088`

### Configuration Methods

#### Method 1: Using .env File (Recommended)

Create or edit the `.env` file in the project root:

```bash
# Vite Development Server Port
VITE_PORT=1420

# PHP Server Port
PHP_SERVER_PORT=8088

# PHP Server Port for frontend access (must be prefixed with VITE_)
VITE_PHP_SERVER_PORT=8088

# Enable verbose logging
ENABLE_VERBOSE_LOGGING=false
```

#### Method 2: Environment Variables at Runtime

Set environment variables before starting the application:

```bash
# Set custom ports
export VITE_PORT=3000
export PHP_SERVER_PORT=9000
export VITE_PHP_SERVER_PORT=9000

# Start the application
./start-verbose.sh
```

#### Method 3: Inline Environment Variables

Pass variables directly when running commands:

```bash
# Start with custom ports
VITE_PORT=3000 PHP_SERVER_PORT=9000 VITE_PHP_SERVER_PORT=9000 ./start-verbose.sh

# Or start individual components
PHP_SERVER_PORT=9000 ./start-php-server.sh
VITE_PORT=3000 npm run dev
```

### Port Configuration Files

The following files automatically load and use port configuration:

- **`.env`** - Main configuration file
- **`vite.config.ts`** - Vite development server configuration
- **`src-tauri/tauri.conf.json`** - Tauri app configuration (devUrl)
- **`package.json`** - NPM script configurations
- **`start-verbose.sh`** - Enhanced startup script
- **`start.sh`** - Simple startup script
- **`start-php-server.sh`** - PHP server startup script
- **`start-php-server-verbose.sh`** - Enhanced PHP server script
- **`todo.php.svg`** - Frontend PHP server port configuration

### Troubleshooting Port Conflicts

If you encounter "Port already in use" errors:

```bash
# Check what's using a port
lsof -i :8088
# or
lsof -i :1420

# Kill process using the port
kill <PID>

# Or use different ports
VITE_PORT=3000 PHP_SERVER_PORT=9000 ./start-verbose.sh
```

## 📁 Key Files

- **`pdf.php.svg`** - Main SVG application with embedded PHP/JavaScript
- **`php/index.php`** - Additional PHP backend scripts
- **`src-tauri/`** - Rust backend for Tauri desktop app
- **`scripts/`** - Installation scripts for different Linux distributions
- **`.env`** - Environment configuration file for ports and settings

## 🛠 Installation

### Step 1: Install System Dependencies

Run the appropriate script for your Linux distribution:

```bash
# Auto-detect and install (recommended)
./scripts/install-deps.sh

# Or run specific distribution script:
./scripts/install-deps-ubuntu.sh    # Ubuntu/Debian
./scripts/install-deps-fedora.sh    # Fedora/CentOS/RHEL  
./scripts/install-deps-arch.sh      # Arch Linux
./scripts/install-deps-opensuse.sh  # openSUSE
```

### Step 2: Install Node Dependencies

```bash
npm install
```

### Step 3: Run the Application

```bash
npm run tauri dev
```

## 🎯 How It Works

1. **Launch**: The Tauri app opens displaying the SVG-based interface
2. **Upload**: Select a PDF file using the file picker
3. **Process**: Choose conversion format (PNG/JPG/SVG) or analyze the PDF
4. **Download**: Download the processed results
5. **PHP Integration**: Backend PHP scripts handle the actual file processing

## 📋 System Requirements

- **Linux** (Ubuntu/Debian, Fedora/CentOS/RHEL, Arch Linux, openSUSE)
- **Node.js** and **npm**
- **Rust** (installed automatically by Tauri)
- **System libraries**: webkit2gtk-4.1, javascriptcoregtk-4.1, libsoup-3.0

## 🔧 Development

### Building for Production
```bash
npm run tauri build
```

### Development Mode
```bash
npm run tauri dev
```

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
