#!/bin/bash

# Tauri Veridock - Cross-Platform Build Script
# Generates binaries for all supported platforms

set -e  # Exit on any error

echo "🚀 Tauri Veridock - Cross-Platform Build System"
echo "=============================================="
echo

# Configuration
BUILD_DIR="dist"
LOG_FILE="build.log"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Supported targets
declare -a TARGETS=(
    "x86_64-pc-windows-msvc"     # Windows 64-bit
    "x86_64-apple-darwin"        # macOS Intel
    "aarch64-apple-darwin"       # macOS Apple Silicon
    "x86_64-unknown-linux-gnu"   # Linux 64-bit
    "aarch64-unknown-linux-gnu"  # Linux ARM64
)

# Functions
cleanup() {
    echo
    echo "🧹 Cleaning up..."
    if [ "$?" -ne 0 ]; then
        echo "❌ Build failed! Check $LOG_FILE for details."
        exit 1
    fi
}

# Set up cleanup on script exit
trap cleanup EXIT

check_dependencies() {
    echo "🔍 Checking dependencies..."
    
    # Check if Tauri CLI is installed
    if ! command -v cargo tauri &> /dev/null; then
        echo "❌ Tauri CLI not found. Installing..."
        cargo install tauri-cli
    fi
    
    # Check if Node.js dependencies are installed
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing Node.js dependencies..."
        npm install
    fi
    
    # Check if Rust targets are installed
    echo "🦀 Installing Rust targets..."
    for target in "${TARGETS[@]}"; do
        echo "  Installing: $target"
        rustup target add "$target" || echo "  ⚠️  Target $target might not be available on this platform"
    done
    
    echo "✅ Dependencies check completed"
    echo
}

prepare_build() {
    echo "📋 Preparing build environment..."
    
    # Create build directory
    mkdir -p "$BUILD_DIR"
    
    # Generate fresh environment files
    echo "🔄 Regenerating environment files..."
    node env.js
    
    # Run tests to ensure everything works
    echo "🧪 Running tests..."
    if [ -f "tests/env.test.js" ]; then
        node tests/env.test.js || {
            echo "❌ Tests failed! Fix issues before building."
            exit 1
        }
    fi
    
    echo "✅ Build preparation completed"
    echo
}

build_for_target() {
    local target=$1
    local platform_name=""
    
    case $target in
        "x86_64-pc-windows-msvc")
            platform_name="windows-x64"
            ;;
        "x86_64-apple-darwin")
            platform_name="macos-intel"
            ;;
        "aarch64-apple-darwin")
            platform_name="macos-apple-silicon"
            ;;
        "x86_64-unknown-linux-gnu")
            platform_name="linux-x64"
            ;;
        "aarch64-unknown-linux-gnu")
            platform_name="linux-arm64"
            ;;
        *)
            platform_name="unknown"
            ;;
    esac
    
    echo "🔨 Building for $platform_name ($target)..."
    
    # Build command with error handling
    if cargo tauri build --target "$target" >> "$LOG_FILE" 2>&1; then
        echo "  ✅ $platform_name build completed"
        
        # Find and copy the built binary
        local binary_path=""
        case $target in
            *windows*)
                binary_path=$(find src-tauri/target/$target/release -name "*.exe" -type f | head -1)
                ;;
            *)
                binary_path=$(find src-tauri/target/$target/release -maxdepth 1 -type f -executable | grep -v "\.d$" | head -1)
                ;;
        esac
        
        if [ -n "$binary_path" ] && [ -f "$binary_path" ]; then
            local filename=$(basename "$binary_path")
            local dest_name="${filename%.*}_${platform_name}_${TIMESTAMP}"
            [ "$target" = "x86_64-pc-windows-msvc" ] && dest_name="${dest_name}.exe"
            
            cp "$binary_path" "$BUILD_DIR/$dest_name"
            echo "  📦 Binary saved as: $BUILD_DIR/$dest_name"
        else
            echo "  ⚠️  Binary not found for $platform_name"
        fi
    else
        echo "  ❌ $platform_name build failed (check $LOG_FILE)"
        return 1
    fi
}

build_all_targets() {
    echo "🏗️  Building for all supported platforms..."
    echo
    
    local success_count=0
    local total_count=${#TARGETS[@]}
    
    for target in "${TARGETS[@]}"; do
        if build_for_target "$target"; then
            ((success_count++))
        fi
        echo
    done
    
    echo "📊 Build Summary:"
    echo "  ✅ Successful: $success_count/$total_count"
    echo "  📁 Binaries location: $BUILD_DIR/"
    echo
    
    if [ $success_count -gt 0 ]; then
        echo "🎉 At least one build succeeded!"
        ls -la "$BUILD_DIR/"
    else
        echo "❌ All builds failed!"
        exit 1
    fi
}

create_release_package() {
    echo "📦 Creating release package..."
    
    local package_name="veridock-tauri-${TIMESTAMP}"
    local package_dir="$BUILD_DIR/$package_name"
    
    mkdir -p "$package_dir/binaries"
    mkdir -p "$package_dir/assets"
    mkdir -p "$package_dir/docs"
    
    # Copy binaries
    cp "$BUILD_DIR"/*_"$TIMESTAMP"* "$package_dir/binaries/" 2>/dev/null || true
    
    # Copy assets and documentation
    cp -r assets/ "$package_dir/assets/" 2>/dev/null || true
    cp README.md "$package_dir/docs/" 2>/dev/null || true
    cp PROJECT_IMPROVEMENTS.md "$package_dir/docs/" 2>/dev/null || true
    
    # Create installation script
    cat > "$package_dir/install.sh" << 'EOF'
#!/bin/bash
echo "🚀 Veridock Tauri Installation"
echo "=============================="

# Detect OS and architecture
OS=$(uname -s)
ARCH=$(uname -m)

case $OS in
    "Linux")
        case $ARCH in
            "x86_64") BINARY="*linux-x64*" ;;
            "aarch64"|"arm64") BINARY="*linux-arm64*" ;;
            *) echo "❌ Unsupported architecture: $ARCH"; exit 1 ;;
        esac
        ;;
    "Darwin")
        case $ARCH in
            "x86_64") BINARY="*macos-intel*" ;;
            "arm64") BINARY="*macos-apple-silicon*" ;;
            *) echo "❌ Unsupported architecture: $ARCH"; exit 1 ;;
        esac
        ;;
    *)
        echo "❌ Unsupported OS: $OS"
        exit 1
        ;;
esac

BINARY_FILE=$(ls binaries/$BINARY 2>/dev/null | head -1)

if [ -n "$BINARY_FILE" ]; then
    echo "✅ Found binary: $BINARY_FILE"
    chmod +x "$BINARY_FILE"
    echo "🎉 Installation completed! Run: ./$BINARY_FILE"
else
    echo "❌ No compatible binary found for $OS $ARCH"
    echo "Available binaries:"
    ls binaries/
    exit 1
fi
EOF
    
    chmod +x "$package_dir/install.sh"
    
    # Create archive
    cd "$BUILD_DIR"
    tar -czf "${package_name}.tar.gz" "$package_name"
    cd ..
    
    echo "✅ Release package created: $BUILD_DIR/${package_name}.tar.gz"
}

# Main execution
main() {
    echo "⏰ Build started at: $(date)"
    echo "📝 Logs will be saved to: $LOG_FILE"
    echo
    
    # Initialize log file
    echo "=== Tauri Build Log - $TIMESTAMP ===" > "$LOG_FILE"
    
    # Execute build steps
    check_dependencies
    prepare_build
    build_all_targets
    create_release_package
    
    echo "🎉 Build process completed successfully!"
    echo "⏰ Build finished at: $(date)"
    echo
    echo "📦 Next steps:"
    echo "1. Test binaries in $BUILD_DIR/"
    echo "2. Extract and run: tar -xzf $BUILD_DIR/veridock-tauri-${TIMESTAMP}.tar.gz"
    echo "3. Install: cd veridock-tauri-${TIMESTAMP} && ./install.sh"
}

# Script options
case "${1:-}" in
    "--help"|"-h")
        echo "Usage: $0 [OPTIONS]"
        echo
        echo "Options:"
        echo "  --help, -h          Show this help message"
        echo "  --clean            Clean build directory before building"
        echo "  --target TARGET    Build for specific target only"
        echo
        echo "Supported targets:"
        printf "  %s\n" "${TARGETS[@]}"
        exit 0
        ;;
    "--clean")
        echo "🧹 Cleaning build directory..."
        rm -rf "$BUILD_DIR"
        echo "✅ Clean completed"
        main
        ;;
    "--target")
        if [ -n "${2:-}" ]; then
            echo "🎯 Building for specific target: $2"
            check_dependencies
            prepare_build
            build_for_target "$2"
        else
            echo "❌ Target not specified"
            exit 1
        fi
        ;;
    "")
        main
        ;;
    *)
        echo "❌ Unknown option: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac
