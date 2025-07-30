#!/usr/bin/env node

/**
 * Tests for sync-window-size.js
 * Tests SVG parsing, .env updating, and Tauri config management
 */

import fs from 'fs';
import path from 'path';
import { syncWindowSize, parseSVGDimensions, updateEnvFile, updateTauriConfig } from '../sync-window-size.js';

// Test utilities
function cleanup() {
    const testFiles = [
        'test.svg',
        'test.env',
        'test.tauri.conf.json',
        'env.json'
    ];
    testFiles.forEach(file => {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
    });
}

function createTestSVG(width = 800, height = 600) {
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <title>Test SVG</title>
    <rect width="100%" height="100%" fill="#f0f0f0"/>
    <text x="50%" y="50%" text-anchor="middle" fill="#333">Test SVG ${width}x${height}</text>
</svg>`;
    fs.writeFileSync('test.svg', svgContent);
}

function createTestEnv() {
    const envContent = `# Test environment
VITE_PORT=1420
PHP_SERVER_PORT=8088
VITE_PHP_SERVER_PORT=8088
VITE_FILE_PHP=test.svg
WINDOW_WIDTH=1000
WINDOW_HEIGHT=700
SVG_WIDTH=800
SVG_HEIGHT=600
`;
    fs.writeFileSync('test.env', envContent);
}

function createTestTauriConfig() {
    const config = {
        "productName": "test-app",
        "version": "0.1.0",
        "app": {
            "windows": [
                {
                    "title": "Test App",
                    "width": 1000,
                    "height": 700,
                    "resizable": true
                }
            ]
        }
    };
    fs.writeFileSync('test.tauri.conf.json', JSON.stringify(config, null, 2));
}

function createTestEnvJson() {
    const envJson = {
        "VITE_FILE_PHP": "test.svg"
    };
    fs.writeFileSync('env.json', JSON.stringify(envJson, null, 2));
}

// Test suite
console.log('🧪 Running Sync Window Size Tests');
console.log('=================================');

let passed = 0;
let failed = 0;

function test(name, testFn) {
    try {
        testFn();
        console.log(`✅ ${name}`);
        passed++;
    } catch (error) {
        console.log(`❌ ${name}: ${error.message}`);
        failed++;
    }
}

// Setup
cleanup();
createTestSVG(1024, 768);
createTestEnv();
createTestTauriConfig();
createTestEnvJson();

// Tests
test('parseSVGDimensions - should extract viewBox dimensions', async () => {
    // Mock CONFIG for this test
    const originalConfig = global.CONFIG;
    global.CONFIG = { svgFile: 'test.svg' };
    
    const dimensions = await parseSVGDimensions();
    
    if (!dimensions) throw new Error('Dimensions not returned');
    if (dimensions.width !== 1024) throw new Error(`Expected width 1024, got ${dimensions.width}`);
    if (dimensions.height !== 768) throw new Error(`Expected height 768, got ${dimensions.height}`);
    
    global.CONFIG = originalConfig;
});

test('parseSVGDimensions - should handle missing SVG file', async () => {
    global.CONFIG = { svgFile: 'nonexistent.svg' };
    
    const dimensions = await parseSVGDimensions();
    
    if (dimensions !== null) throw new Error('Should return null for missing file');
});

test('parseSVGDimensions - should handle invalid SVG content', async () => {
    fs.writeFileSync('invalid.svg', 'This is not valid SVG content');
    global.CONFIG = { svgFile: 'invalid.svg' };
    
    const dimensions = await parseSVGDimensions();
    
    if (dimensions !== null) throw new Error('Should return null for invalid SVG');
    
    fs.unlinkSync('invalid.svg');
});

test('updateEnvFile - should update dimensions in .env file', async () => {
    global.CONFIG = { envFile: 'test.env', marginWidth: 50, marginHeight: 80 };
    
    const svgDimensions = { width: 1200, height: 900 };
    const result = await updateEnvFile(svgDimensions);
    
    if (!result) throw new Error('updateEnvFile should return window dimensions');
    if (result.windowWidth !== 1250) throw new Error(`Expected window width 1250, got ${result.windowWidth}`);
    if (result.windowHeight !== 980) throw new Error(`Expected window height 980, got ${result.windowHeight}`);
    
    // Verify file was updated
    const envContent = fs.readFileSync('test.env', 'utf8');
    if (!envContent.includes('SVG_WIDTH=1200')) throw new Error('SVG_WIDTH not updated in file');
    if (!envContent.includes('SVG_HEIGHT=900')) throw new Error('SVG_HEIGHT not updated in file');
    if (!envContent.includes('WINDOW_WIDTH=1250')) throw new Error('WINDOW_WIDTH not updated in file');
    if (!envContent.includes('WINDOW_HEIGHT=980')) throw new Error('WINDOW_HEIGHT not updated in file');
});

test('updateTauriConfig - should update window size in config', async () => {
    global.CONFIG = { tauriConfig: 'test.tauri.conf.json' };
    
    const windowDimensions = { windowWidth: 1300, windowHeight: 1000 };
    const result = await updateTauriConfig(windowDimensions);
    
    if (!result) throw new Error('updateTauriConfig should return true on success');
    
    // Verify config was updated
    const configContent = JSON.parse(fs.readFileSync('test.tauri.conf.json', 'utf8'));
    const window = configContent.app.windows[0];
    if (window.width !== 1300) throw new Error(`Expected window width 1300, got ${window.width}`);
    if (window.height !== 1000) throw new Error(`Expected window height 1000, got ${window.height}`);
});

test('updateTauriConfig - should handle missing config file', async () => {
    global.CONFIG = { tauriConfig: 'nonexistent.json' };
    
    const windowDimensions = { windowWidth: 800, windowHeight: 600 };
    const result = await updateTauriConfig(windowDimensions);
    
    if (result !== false) throw new Error('Should return false for missing config file');
});

test('Edge case - SVG with no viewBox should fallback to width/height', async () => {
    const svgWithoutViewBox = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="400">
    <rect width="100%" height="100%" fill="#f0f0f0"/>
</svg>`;
    fs.writeFileSync('no-viewbox.svg', svgWithoutViewBox);
    global.CONFIG = { svgFile: 'no-viewbox.svg' };
    
    const dimensions = await parseSVGDimensions();
    
    if (!dimensions) throw new Error('Should extract dimensions from width/height attributes');
    if (dimensions.width !== 500) throw new Error(`Expected width 500, got ${dimensions.width}`);
    if (dimensions.height !== 400) throw new Error(`Expected height 400, got ${dimensions.height}`);
    
    fs.unlinkSync('no-viewbox.svg');
});

// Cleanup and results
cleanup();

console.log('\n📊 Sync Window Size Test Results:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📈 Total: ${passed + failed}`);

if (failed > 0) {
    console.log('\n🚨 Some tests failed! Please fix the issues.');
    process.exit(1);
} else {
    console.log('\n🎉 All sync-window-size tests passed!');
    process.exit(0);
}
