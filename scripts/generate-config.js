#!/usr/bin/env node

/**
 * Environment Variable Configuration Generator
 * 
 * This script reads .env file and generates configuration files for different technologies:
 * - config.js (for browser/frontend)
 * - config.php (for PHP backend)
 * - config.json (for general use)
 * - config.rs (for Rust/Tauri)
 * 
 * This ensures consistent variable propagation across all technologies without
 * relying on complex environment variable loading mechanisms.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to .env file
const ENV_FILE = path.join(__dirname, '../.env');
const OUTPUT_DIR = path.join(__dirname, '../generated-config');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Parse .env file and extract variables
 */
function parseEnvFile() {
    if (!fs.existsSync(ENV_FILE)) {
        console.error('❌ .env file not found at:', ENV_FILE);
        process.exit(1);
    }

    const envContent = fs.readFileSync(ENV_FILE, 'utf8');
    const variables = {};

    envContent.split('\n').forEach((line, index) => {
        // Skip comments and empty lines
        line = line.trim();
        if (!line || line.startsWith('#')) return;

        // Parse KEY=VALUE format
        const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
        if (match) {
            const [, key, value] = match;
            // Remove quotes if present
            const cleanValue = value.replace(/^["']|["']$/g, '');
            variables[key] = cleanValue;
            console.log(`✅ Parsed: ${key} = ${cleanValue}`);
        } else if (line.includes('=')) {
            console.warn(`⚠️  Warning: Could not parse line ${index + 1}: ${line}`);
        }
    });

    return variables;
}

/**
 * Generate JavaScript config for frontend/browser
 */
function generateJavaScriptConfig(variables) {
    const jsConfig = `// Auto-generated configuration from .env
// Generated at: ${new Date().toISOString()}

window.AppConfig = {
${Object.entries(variables).map(([key, value]) => `    ${key}: "${value}"`).join(',\n')}
};

// Export for ES modules
export default window.AppConfig;
console.log('✅ AppConfig loaded:', window.AppConfig);
`;

    fs.writeFileSync(path.join(OUTPUT_DIR, 'config.js'), jsConfig);
    console.log('✅ Generated: config.js');
}

/**
 * Generate PHP config
 */
function generatePHPConfig(variables) {
    const phpConfig = `<?php
// Auto-generated configuration from .env
// Generated at: ${new Date().toISOString()}

class AppConfig {
${Object.entries(variables).map(([key, value]) => `    public static $${key} = "${value}";`).join('\n')}

    /**
     * Get all configuration as array
     */
    public static function getAll() {
        return [
${Object.entries(variables).map(([key, value]) => `            '${key}' => self::$${key}`).join(',\n')}
        ];
    }

    /**
     * Get configuration value by key
     */
    public static function get($key, $default = null) {
        $config = self::getAll();
        return isset($config[$key]) ? $config[$key] : $default;
    }
}

// Make variables available globally
${Object.entries(variables).map(([key, value]) => `define('${key}', '${value}');`).join('\n')}

error_log('✅ AppConfig loaded with ' . count(AppConfig::getAll()) . ' variables');
?>`;

    fs.writeFileSync(path.join(OUTPUT_DIR, 'config.php'), phpConfig);
    console.log('✅ Generated: config.php');
}

/**
 * Generate JSON config for general use
 */
function generateJSONConfig(variables) {
    const jsonConfig = {
        _meta: {
            generated_at: new Date().toISOString(),
            source: '.env file'
        },
        ...variables
    };

    fs.writeFileSync(path.join(OUTPUT_DIR, 'config.json'), JSON.stringify(jsonConfig, null, 2));
    console.log('✅ Generated: config.json');
}

/**
 * Generate Rust config
 */
function generateRustConfig(variables) {
    const rustConfig = `// Auto-generated configuration from .env
// Generated at: ${new Date().toISOString()}

use std::collections::HashMap;

pub struct AppConfig;

impl AppConfig {
${Object.entries(variables).map(([key, value]) => `    pub const ${key}: &'static str = "${value}";`).join('\n')}

    pub fn get_all() -> HashMap<&'static str, &'static str> {
        let mut config = HashMap::new();
${Object.entries(variables).map(([key, value]) => `        config.insert("${key}", Self::${key});`).join('\n')}
        config
    }

    pub fn get(key: &str) -> Option<&'static str> {
        match key {
${Object.entries(variables).map(([key, value]) => `            "${key}" => Some(Self::${key}),`).join('\n')}
            _ => None,
        }
    }
}
`;

    fs.writeFileSync(path.join(OUTPUT_DIR, 'config.rs'), rustConfig);
    console.log('✅ Generated: config.rs');
}

/**
 * Main execution
 */
function main() {
    console.log('🚀 Starting environment variable configuration generation...\n');
    
    // Parse .env file
    const variables = parseEnvFile();
    console.log(`\n📊 Found ${Object.keys(variables).length} variables\n`);

    // Generate configs for each technology
    generateJavaScriptConfig(variables);
    generatePHPConfig(variables);
    generateJSONConfig(variables);
    generateRustConfig(variables);

    console.log('\n✅ Configuration generation complete!');
    console.log('📁 Generated files in:', OUTPUT_DIR);
    console.log('\n📝 Usage:');
    console.log('  - JavaScript/Browser: <script src="generated-config/config.js"></script>');
    console.log('  - PHP: require_once "generated-config/config.php";');
    console.log('  - JSON: Use with any JSON parser');
    console.log('  - Rust: Copy config.rs to your Rust project');
}

// Run main function
main();
