#!/usr/bin/env node

/**
 * SVG Window Size Sync Script
 * Reads SVG dimensions from viewBox, updates .env and Tauri config
 * Ensures window size always matches SVG dimensions + margins
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
    envFile: '.env',
    svgFile: 'todo.php.svg',
    tauriConfig: 'src-tauri/tauri.conf.json',
    marginWidth: 50,   // Extra width for UI margins
    marginHeight: 80   // Extra height for UI elements
};

/**
 * Parse SVG file to extract viewBox dimensions
 */
function parseSVGDimensions(svgPath) {
    try {
        const svgContent = fs.readFileSync(svgPath, 'utf8');
        
        // Look for viewBox attribute
        const viewBoxMatch = svgContent.match(/viewBox\s*=\s*["']([^"']+)["']/i);
        
        if (viewBoxMatch) {
            const viewBoxValues = viewBoxMatch[1].split(/\s+/);
            if (viewBoxValues.length >= 4) {
                const width = parseInt(viewBoxValues[2]) || 1000;
                const height = parseInt(viewBoxValues[3]) || 700;
                
                console.log(`📐 SVG ViewBox: ${width}x${height}`);
                return { width, height };
            }
        }
        
        // Fallback: look for width/height attributes
        const widthMatch = svgContent.match(/width\s*=\s*["']?(\d+)/i);
        const heightMatch = svgContent.match(/height\s*=\s*["']?(\d+)/i);
        
        if (widthMatch && heightMatch) {
            const width = parseInt(widthMatch[1]) || 1000;
            const height = parseInt(heightMatch[1]) || 700;
            
            console.log(`📐 SVG Attributes: ${width}x${height}`);
            return { width, height };
        }
        
        // Default fallback
        console.log('⚠️  No SVG dimensions found, using defaults');
        return { width: 1000, height: 700 };
        
    } catch (error) {
        console.log(`❌ Error reading SVG file: ${error.message}`);
        return { width: 1000, height: 700 };
    }
}

/**
 * Update .env file with new dimensions
 */
function updateEnvFile(svgDimensions) {
    try {
        let envContent = fs.readFileSync(CONFIG.envFile, 'utf8');
        
        const windowWidth = svgDimensions.width + CONFIG.marginWidth;
        const windowHeight = svgDimensions.height + CONFIG.marginHeight;
        
        // Update window dimensions
        envContent = envContent.replace(
            /WINDOW_WIDTH=\d+/,
            `WINDOW_WIDTH=${windowWidth}`
        );
        envContent = envContent.replace(
            /WINDOW_HEIGHT=\d+/,
            `WINDOW_HEIGHT=${windowHeight}`
        );
        
        // Update SVG dimensions  
        envContent = envContent.replace(
            /SVG_WIDTH=\d+/,
            `SVG_WIDTH=${svgDimensions.width}`
        );
        envContent = envContent.replace(
            /SVG_HEIGHT=\d+/,
            `SVG_HEIGHT=${svgDimensions.height}`
        );
        
        fs.writeFileSync(CONFIG.envFile, envContent, 'utf8');
        
        console.log(`✅ Updated .env: Window ${windowWidth}x${windowHeight}, SVG ${svgDimensions.width}x${svgDimensions.height}`);
        
        return { windowWidth, windowHeight };
        
    } catch (error) {
        console.log(`❌ Error updating .env: ${error.message}`);
        return null;
    }
}

/**
 * Update Tauri config with new window dimensions
 */
function updateTauriConfig(windowDimensions) {
    try {
        const configPath = CONFIG.tauriConfig;
        
        if (!fs.existsSync(configPath)) {
            console.log(`⚠️  Tauri config not found: ${configPath}`);
            return false;
        }
        
        const configContent = fs.readFileSync(configPath, 'utf8');
        const config = JSON.parse(configContent);
        
        // Update window dimensions in config
        if (config.app && config.app.windows && config.app.windows[0]) {
            config.app.windows[0].width = windowDimensions.windowWidth;
            config.app.windows[0].height = windowDimensions.windowHeight;
            
            // Ensure other window properties are set
            config.app.windows[0].title = config.app.windows[0].title || "Tauri SVG Processor";
            config.app.windows[0].resizable = true;
            config.app.windows[0].center = true;
        }
        
        // Write updated config
        const updatedConfig = JSON.stringify(config, null, 2);
        fs.writeFileSync(configPath, updatedConfig, 'utf8');
        
        console.log(`✅ Updated Tauri config: ${windowDimensions.windowWidth}x${windowDimensions.windowHeight}`);
        return true;
        
    } catch (error) {
        console.log(`❌ Error updating Tauri config: ${error.message}`);
        return false;
    }
}

/**
 * Main sync function
 */
function syncWindowSize() {
    console.log('🔄 Syncing window size with SVG dimensions...');
    console.log('==========================================');
    
    // Step 1: Parse SVG dimensions
    const svgDimensions = parseSVGDimensions(CONFIG.svgFile);
    
    // Step 2: Update .env file
    const windowDimensions = updateEnvFile(svgDimensions);
    
    if (!windowDimensions) {
        console.log('❌ Failed to update .env file');
        process.exit(1);
    }
    
    // Step 3: Update Tauri config
    const tauriSuccess = updateTauriConfig(windowDimensions);
    
    if (!tauriSuccess) {
        console.log('❌ Failed to update Tauri config');
        process.exit(1);
    }
    
    console.log('');
    console.log('🎯 Window size sync completed successfully!');
    console.log(`   📐 SVG: ${svgDimensions.width}x${svgDimensions.height}`);
    console.log(`   🖥️  Window: ${windowDimensions.windowWidth}x${windowDimensions.windowHeight}`);
    console.log(`   📏 Margins: ${CONFIG.marginWidth}x${CONFIG.marginHeight}`);
    console.log('');
}

// Run if called directly
if (import.meta.url === `file://${__filename}`) {
    syncWindowSize();
}

export { syncWindowSize, parseSVGDimensions, updateEnvFile, updateTauriConfig };
