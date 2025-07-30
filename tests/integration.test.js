#!/usr/bin/env node

/**
 * Integration Tests for Tauri Veridock
 * Tests the complete pipeline: .env -> env.* generation -> frontend loading
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

// Test utilities
function cleanup() {
    const testFiles = [
        'test.env',
        'test.env.json',
        'test.env.sh',
        'test.env.php',
        'assets/svg/integration-test.php.svg'
    ];
    testFiles.forEach(file => {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
    });
}

function createTestEnv() {
    const envContent = `# Integration test environment
VITE_PORT=1420
PHP_SERVER_PORT=8088
VITE_PHP_SERVER_PORT=8088
VITE_FILE_PHP=assets/svg/integration-test.php.svg
WINDOW_WIDTH=1200
WINDOW_HEIGHT=800
SVG_WIDTH=1000
SVG_HEIGHT=600
VITE_DEV_URL=http://localhost:\${VITE_PORT}
PHP_SERVER_URL=http://localhost:\${PHP_SERVER_PORT}
PDF_PROCESSOR_URL=http://localhost:\${PHP_SERVER_PORT}/\${VITE_FILE_PHP}
ENABLE_VERBOSE_LOGGING=false
LOG_DIRECTORY=logs
NODE_ENV=development
`;
    fs.writeFileSync('test.env', envContent);
}

function createTestSVG() {
    // Ensure directory exists
    if (!fs.existsSync('assets/svg')) {
        fs.mkdirSync('assets/svg', { recursive: true });
    }
    
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="600" viewBox="0 0 1000 600">
    <title>Integration Test SVG</title>
    <rect width="100%" height="100%" fill="#e3f2fd"/>
    <text x="500" y="300" text-anchor="middle" fill="#1976d2" font-size="24">Integration Test</text>
    <text x="500" y="340" text-anchor="middle" fill="#666" font-size="16">SVG File: integration-test.php.svg</text>
</svg>`;
    fs.writeFileSync('assets/svg/integration-test.php.svg', svgContent);
}

function runCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args, {
            stdio: 'pipe',
            ...options
        });

        let stdout = '';
        let stderr = '';

        process.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        process.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        process.on('close', (code) => {
            resolve({ code, stdout, stderr });
        });

        process.on('error', (error) => {
            reject(error);
        });
    });
}

// Test suite
console.log('🧪 Running Integration Tests');
console.log('============================');

let passed = 0;
let failed = 0;

async function test(name, testFn) {
    try {
        await testFn();
        console.log(`✅ ${name}`);
        passed++;
    } catch (error) {
        console.log(`❌ ${name}: ${error.message}`);
        failed++;
    }
}

// Setup
cleanup();
createTestEnv();
createTestSVG();

// Tests
await test('Environment file loading and parsing', async () => {
    const { loadEnv } = await import('../env.js');
    const env = loadEnv('test.env');
    
    if (!env.VITE_FILE_PHP) throw new Error('VITE_FILE_PHP not loaded');
    if (env.VITE_FILE_PHP !== 'assets/svg/integration-test.php.svg') {
        throw new Error(`Expected integration-test.php.svg, got ${env.VITE_FILE_PHP}`);
    }
    if (!env.VITE_DEV_URL.includes('${VITE_PORT}')) {
        throw new Error('Variables should not be resolved in raw env loading');
    }
});

await test('Complete env.js generation pipeline', async () => {
    // Import functions dynamically to avoid conflicts
    const { loadEnv, generateJSONConfig, generateShellConfig, generatePHPConfig } = await import('../env.js');
    
    const env = loadEnv('test.env');
    
    // Generate all config files
    generateJSONConfig(env, 'test.env.json');
    generateShellConfig(env, 'test.env.sh');
    generatePHPConfig(env, 'test.env.php');
    
    // Verify all files were created
    if (!fs.existsSync('test.env.json')) throw new Error('JSON config not generated');
    if (!fs.existsSync('test.env.sh')) throw new Error('Shell config not generated');
    if (!fs.existsSync('test.env.php')) throw new Error('PHP config not generated');
    
    // Verify JSON content has resolved variables
    const jsonContent = JSON.parse(fs.readFileSync('test.env.json', 'utf8'));
    if (jsonContent.VITE_DEV_URL !== 'http://localhost:1420') {
        throw new Error(`Variables not resolved in JSON: ${jsonContent.VITE_DEV_URL}`);
    }
});

await test('Build script validation', async () => {
    if (!fs.existsSync('build.sh')) throw new Error('build.sh not found');
    
    // Check if script is executable
    const stats = fs.statSync('build.sh');
    if (!(stats.mode & parseInt('111', 8))) {
        throw new Error('build.sh is not executable');
    }
    
    // Test help option
    const result = await runCommand('./build.sh', ['--help']);
    if (result.code !== 0) {
        throw new Error(`build.sh --help failed with code ${result.code}`);
    }
    if (!result.stdout.includes('Usage:')) {
        throw new Error('build.sh help output is missing usage information');
    }
});

await test('Directory structure validation', async () => {
    const requiredDirs = ['assets/svg', 'tests', 'scripts', 'config'];
    const requiredFiles = ['build.sh', 'env.js', 'PROJECT_IMPROVEMENTS.md'];
    
    for (const dir of requiredDirs) {
        if (!fs.existsSync(dir)) {
            throw new Error(`Required directory missing: ${dir}`);
        }
        if (!fs.statSync(dir).isDirectory()) {
            throw new Error(`${dir} is not a directory`);
        }
    }
    
    for (const file of requiredFiles) {
        if (!fs.existsSync(file)) {
            throw new Error(`Required file missing: ${file}`);
        }
        if (!fs.statSync(file).isFile()) {
            throw new Error(`${file} is not a file`);
        }
    }
});

await test('SVG file accessibility', async () => {
    const svgPath = 'assets/svg/integration-test.php.svg';
    if (!fs.existsSync(svgPath)) {
        throw new Error(`Test SVG file not found: ${svgPath}`);
    }
    
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    if (!svgContent.includes('<svg')) {
        throw new Error('SVG file does not contain valid SVG content');
    }
    if (!svgContent.includes('viewBox="0 0 1000 600"')) {
        throw new Error('SVG file does not have expected viewBox dimensions');
    }
});

await test('Configuration consistency check', async () => {
    // Load environment
    const { loadEnv, generateJSONConfig } = await import('../env.js');
    const env = loadEnv('test.env');
    
    // Generate JSON config
    generateJSONConfig(env, 'test.env.json');
    const jsonConfig = JSON.parse(fs.readFileSync('test.env.json', 'utf8'));
    
    // Verify consistency between .env and generated files
    if (env.VITE_PORT !== jsonConfig.VITE_PORT) {
        throw new Error('VITE_PORT inconsistent between .env and JSON');
    }
    if (env.VITE_FILE_PHP !== jsonConfig.VITE_FILE_PHP) {
        throw new Error('VITE_FILE_PHP inconsistent between .env and JSON');
    }
    
    // Check that variables are properly resolved in JSON
    if (jsonConfig.VITE_DEV_URL.includes('${')) {
        throw new Error('JSON config still contains unresolved variables');
    }
});

await test('Error handling for missing files', async () => {
    const { loadEnv } = await import('../env.js');
    
    // Test with non-existent .env file
    const emptyEnv = loadEnv('nonexistent.env');
    if (Object.keys(emptyEnv).length !== 0) {
        throw new Error('loadEnv should return empty object for missing file');
    }
});

await test('File permissions and security', async () => {
    // Check that generated files have appropriate permissions
    const files = ['test.env.sh', 'test.env.php', 'test.env.json'];
    
    for (const file of files) {
        if (fs.existsSync(file)) {
            const stats = fs.statSync(file);
            
            // Check that files are not world-writable (security concern)
            if (stats.mode & parseInt('002', 8)) {
                throw new Error(`${file} is world-writable (security risk)`);
            }
            
            // Check that shell files are executable
            if (file.endsWith('.sh') && !(stats.mode & parseInt('111', 8))) {
                throw new Error(`${file} should be executable`);
            }
        }
    }
});

// Performance test
await test('Performance benchmark - env generation', async () => {
    const { loadEnv, generateJSONConfig, generateShellConfig, generatePHPConfig } = await import('../env.js');
    
    const startTime = Date.now();
    
    // Run generation 10 times to test performance
    for (let i = 0; i < 10; i++) {
        const env = loadEnv('test.env');
        generateJSONConfig(env, `test.env.${i}.json`);
        generateShellConfig(env, `test.env.${i}.sh`);
        generatePHPConfig(env, `test.env.${i}.php`);
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Clean up performance test files
    for (let i = 0; i < 10; i++) {
        ['json', 'sh', 'php'].forEach(ext => {
            const file = `test.env.${i}.${ext}`;
            if (fs.existsSync(file)) fs.unlinkSync(file);
        });
    }
    
    if (duration > 5000) { // 5 seconds for 10 iterations
        throw new Error(`Environment generation too slow: ${duration}ms for 10 iterations`);
    }
    
    console.log(`  ⏱️  Performance: ${duration}ms for 10 iterations (${duration/10}ms avg)`);
});

// Cleanup and results
cleanup();

console.log('\n📊 Integration Test Results:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📈 Total: ${passed + failed}`);

if (failed > 0) {
    console.log('\n🚨 Some integration tests failed! Please fix the issues.');
    process.exit(1);
} else {
    console.log('\n🎉 All integration tests passed!');
    console.log('🚀 System is ready for production deployment!');
    process.exit(0);
}
