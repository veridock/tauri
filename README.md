# 🚀 Tauri SVG Processor

**Ultra-simple Tauri desktop application with PHP backend integration**

A minimal, elegant solution for running SVG files with embedded PHP code in a cross-platform desktop app.

## ✨ What This App Does

- **Loads dynamic SVG files** with embedded PHP code (`todo.php.svg`)
- **Processes PHP code** server-side for rich, interactive SVG applications  
- **Runs in Tauri** for native desktop performance
- **Ultra-simple configuration** - one `.env` file, multiple technologies

## 🛠️ Architecture

```
┌─────────────┐    HTTP    ┌─────────────┐    Loads    ┌─────────────┐
│   Tauri     │ ---------> │ PHP Server  │ ---------> │todo.php.svg │
│  Desktop    │            │ localhost   │            │(PHP + SVG)  │
│    App      │            │   :8088     │            │             │
└─────────────┘            └─────────────┘            └─────────────┘
```

## 🚀 Quick Start

### 1. Install System Dependencies

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev libjavascriptcoregtk-4.1-dev libsoup-3.0-dev php-cli
```

**Other distros:** See [Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)

### 2. Install Node Dependencies
```bash
npm install
```

### 3. Configure Environment
Edit `.env` to set your preferences:
```env
PHP_SERVER_PORT=8088
VITE_FILE_PHP=todo.php.svg
```

### 4. Generate Cross-Language Config
```bash
node env.js
```
This generates `env.php` and `env.sh` from your `.env` file.

### 5. Start PHP Server
```bash
./start-php-server.sh
```

### 6. Run Tauri App
```bash
npm run tauri dev
```

## 🔧 Ultra-Simple Configuration System

This project uses a **unified, minimal approach** to share environment variables across all technologies:

### Single Source of Truth: `.env`
```env
PHP_SERVER_PORT=8088
VITE_FILE_PHP=todo.php.svg
ENABLE_VERBOSE_LOGGING=false
```

### Automatic Generation
Run `node env.js` to generate:
- **`env.php`** - PHP defines for backend
- **`env.sh`** - Shell exports for scripts
- **JavaScript** - Direct loading via `loadEnv()`

### Usage in Each Language

**JavaScript:**
```javascript
import { loadEnv } from './env.js';
const env = loadEnv();
console.log(env.VITE_FILE_PHP); // "todo.php.svg"
```

**PHP:**
```php
require_once 'env.php';
echo VITE_FILE_PHP; // "todo.php.svg"
```

**Shell:**
```bash
source env.sh
echo $VITE_FILE_PHP # "todo.php.svg"
```

## 🧪 Testing

Run cross-language environment tests:
```bash
node test-env-system.js
```

This verifies that all technologies (JS, PHP, Shell, SVG) can access the same configuration.

## 📁 Project Structure

```
tauri/
├── .env                    # Single source of truth for config
├── env.js                  # Ultra-simple config loader
├── env.php                 # Auto-generated PHP config
├── env.sh                  # Auto-generated shell config
├── index.html              # Minimal frontend (5KB)
├── todo.php.svg            # SVG with embedded PHP
├── start-php-server.sh     # Simple PHP server launcher
├── test-env-system.js      # Cross-language tests
└── src-tauri/              # Tauri backend
```

## 🎯 Key Features

### ✅ Drastically Simplified
- **One config system** instead of multiple generators
- **Minimal files** - removed duplicates and complexity
- **Single SVG** file instead of multiple copies
- **Ultra-simple frontend** (5KB vs 42KB documentation)

### ✅ Cross-Language Compatibility
- **JavaScript, PHP, Shell** all use same variables
- **Automatic synchronization** from `.env`
- **No manual configuration** needed

### ✅ Zero Dependencies
- **No complex generators** or build systems
- **Direct file reading** and simple generation
- **Minimal overhead** and maximum reliability

## 🔄 Development Workflow

1. **Edit `.env`** to change configuration
2. **Run `node env.js`** to update generated files
3. **Restart services** to pick up changes
4. **Test with `node test-env-system.js`**

## 🐛 Troubleshooting

**PHP server not starting?**
```bash
# Check if port is free
lsof -i:8088

# Restart PHP server
./start-php-server.sh
```

**SVG not loading?**
- Ensure PHP server is running on correct port
- Check `.env` and regenerate configs with `node env.js`
- Verify `todo.php.svg` exists and is readable

**Configuration not synced?**
- Run `node env.js` after changing `.env`
- Restart all services (PHP server + Tauri app)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ using Tauri, PHP, and ultra-simple configuration management*
