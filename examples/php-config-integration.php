<?php
/**
 * PHP Config Integration Example
 * 
 * This demonstrates how to use the generated config.php file
 * for consistent variable access across all technologies.
 */

// Load the generated configuration
require_once __DIR__ . '/../generated-config/config.php';

// Example 1: Using the AppConfig class
echo "🚀 PHP Config Integration Example\n";
echo "================================\n\n";

echo "📊 Available configuration:\n";
print_r(AppConfig::getAll());

echo "\n🔧 Individual config access:\n";
echo "- PHP Server Port: " . AppConfig::get('PHP_SERVER_PORT') . "\n";
echo "- SVG File to load: " . AppConfig::get('VITE_FILE_PHP') . "\n";
echo "- Log Directory: " . AppConfig::get('LOG_DIRECTORY') . "\n";

// Example 2: Using global defines (alternative method)
echo "\n🌐 Using global defines:\n";
echo "- PHP Server URL: " . PHP_SERVER_URL . "\n";
echo "- Enable Verbose Logging: " . ENABLE_VERBOSE_LOGGING . "\n";

// Example 3: Dynamic file serving based on config
$svg_file = AppConfig::get('VITE_FILE_PHP', 'pdf.php.svg');
$svg_path = __DIR__ . '/../' . $svg_file;

echo "\n📁 File serving example:\n";
echo "- Configured SVG file: $svg_file\n";
echo "- Full path: $svg_path\n";
echo "- File exists: " . (file_exists($svg_path) ? "✅ Yes" : "❌ No") . "\n";

// Example 4: Server configuration
$port = AppConfig::get('PHP_SERVER_PORT');
$host = 'localhost';

echo "\n🖥️  Server configuration:\n";
echo "- Host: $host\n";
echo "- Port: $port\n";
echo "- Full server URL: http://$host:$port/\n";

// Example 5: Environment-specific logic
$is_development = AppConfig::get('NODE_ENV') === 'development';
$verbose_logging = AppConfig::get('ENABLE_VERBOSE_LOGGING') === 'true';

echo "\n⚙️  Environment settings:\n";
echo "- Development mode: " . ($is_development ? "✅ Enabled" : "❌ Disabled") . "\n";
echo "- Verbose logging: " . ($verbose_logging ? "✅ Enabled" : "❌ Disabled") . "\n";

if ($is_development) {
    echo "🔧 Development mode features available\n";
}

if ($verbose_logging) {
    error_log("📝 Verbose logging is enabled - this message goes to error log");
}

echo "\n✅ PHP configuration integration successful!\n";
?>
