/**
 * Ultra-Simple Environment Variable Loader
 * 
 * This is the ONLY config system we need!
 * Reads .env file and makes variables available to all technologies:
 * - JavaScript (browser & Node.js)
 * - PHP (via generated simple file)
 * - Shell scripts
 * 
 * NO complex generators, NO duplicate files, NO overhead!
 */

import fs from 'fs';
import path from 'path';

// Read .env file and return simple object
export function loadEnv(envPath = '.env') {
    const env = {};
    
    try {
        const content = fs.readFileSync(envPath, 'utf8');
        
        content.split('\n').forEach(line => {
            line = line.trim();
            if (line && !line.startsWith('#') && line.includes('=')) {
                const [key, ...valueParts] = line.split('=');
                const value = valueParts.join('=').replace(/^["']|["']$/g, '');
                env[key.trim()] = value.trim();
            }
        });
        
        console.log(`✅ Loaded ${Object.keys(env).length} environment variables`);
        return env;
    } catch (error) {
        console.error('❌ Failed to load .env file:', error.message);
        return {};
    }
}

// Generate simple PHP config (only when needed)
export function generatePHPConfig(env, outputPath = 'env.php') {
    const phpContent = `<?php
// Auto-generated from .env - DO NOT EDIT
${Object.entries(env).map(([key, value]) => `define('${key}', '${value}');`).join('\n')}
?>`;
    
    fs.writeFileSync(outputPath, phpContent);
    console.log(`✅ Generated PHP config: ${outputPath}`);
}

// Generate simple shell exports (only when needed)
export function generateShellConfig(env, outputPath = 'env.sh') {
    const shellContent = `#!/bin/bash
# Auto-generated from .env - DO NOT EDIT
${Object.entries(env).map(([key, value]) => `export ${key}="${value}"`).join('\n')}
`;
    
    fs.writeFileSync(outputPath, shellContent);
    fs.chmodSync(outputPath, '755');
    console.log(`✅ Generated shell config: ${outputPath}`);
}

// Main function - generate only what's needed
if (import.meta.url === `file://${process.argv[1]}`) {
    const env = loadEnv();
    
    // Generate PHP config if PHP files exist
    if (fs.existsSync('todo.php.svg') || fs.existsSync('php')) {
        generatePHPConfig(env);
    }
    
    // Generate shell config if shell scripts exist  
    if (fs.existsSync('start-php-server.sh')) {
        generateShellConfig(env);
    }
    
    console.log('🚀 Simple env system ready!');
    console.log('📝 Variables:', Object.keys(env).join(', '));
}
