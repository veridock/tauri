#!/usr/bin/env node

/**
 * Tests for environment system (env.js)
 * Tests critical functionality: loading .env, generating config files
 */

import fs from 'fs';
import path from 'path';
import { loadEnv, generateJSONConfig, generateShellConfig, generatePHPConfig } from '../env.js';

// Test utilities
function cleanup() {
    const testFiles = ['test.env', 'test.env.json', 'test.env.sh', 'test.env.php'];
    testFiles.forEach(file => {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
    });
}

function createTestEnv() {
    const testEnvContent = `# Test environment
VITE_PORT=3000
VITE_FILE_PHP=assets/svg/test.php.svg
REGULAR_VAR=not_vite
VITE_DEV_URL=http://localhost:\${VITE_PORT}
`;
    fs.writeFileSync('test.env', testEnvContent);
}

// Test suite
console.log('🧪 Running Environment System Tests');
console.log('=====================================');

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
createTestEnv();

// Tests
test('loadEnv - should load environment variables from file', () => {
    const env = loadEnv('test.env');
    
    if (!env.VITE_PORT) throw new Error('VITE_PORT not loaded');
    if (env.VITE_PORT !== '3000') throw new Error('VITE_PORT has wrong value');
    if (!env.VITE_FILE_PHP) throw new Error('VITE_FILE_PHP not loaded');
    if (env.VITE_FILE_PHP !== 'assets/svg/test.php.svg') throw new Error('VITE_FILE_PHP has wrong value');
});

test('generateJSONConfig - should create JSON with resolved variables', () => {
    const env = loadEnv('test.env');
    generateJSONConfig(env, 'test.env.json');
    
    if (!fs.existsSync('test.env.json')) throw new Error('JSON file not created');
    
    const jsonContent = JSON.parse(fs.readFileSync('test.env.json', 'utf8'));
    
    if (!jsonContent.VITE_PORT) throw new Error('VITE_PORT missing from JSON');
    if (jsonContent.VITE_PORT !== '3000') throw new Error('VITE_PORT value incorrect');
    if (!jsonContent.VITE_DEV_URL) throw new Error('VITE_DEV_URL missing from JSON');
    if (jsonContent.VITE_DEV_URL !== 'http://localhost:3000') throw new Error('Variables not resolved in JSON');
    if (jsonContent.REGULAR_VAR) throw new Error('Non-VITE variable should not be in JSON');
});

test('generateShellConfig - should create shell export file', () => {
    const env = loadEnv('test.env');
    generateShellConfig(env, 'test.env.sh');
    
    if (!fs.existsSync('test.env.sh')) throw new Error('Shell file not created');
    
    const shellContent = fs.readFileSync('test.env.sh', 'utf8');
    if (!shellContent.includes('export VITE_PORT="3000"')) throw new Error('Shell export incorrect');
    if (!shellContent.includes('#!/bin/bash')) throw new Error('Shell shebang missing');
});

test('generatePHPConfig - should create PHP variable file', () => {
    const env = loadEnv('test.env');
    generatePHPConfig(env, 'test.env.php');
    
    if (!fs.existsSync('test.env.php')) throw new Error('PHP file not created');
    
    const phpContent = fs.readFileSync('test.env.php', 'utf8');
    if (!phpContent.includes('<?php')) throw new Error('PHP opening tag missing');
    if (!phpContent.includes("$VITE_PORT = '3000'")) throw new Error('PHP variable incorrect');
});

test('Error handling - should handle missing .env file gracefully', () => {
    const env = loadEnv('nonexistent.env');
    if (Object.keys(env).length !== 0) throw new Error('Should return empty object for missing file');
});

// Cleanup and results
cleanup();

console.log('\n📊 Test Results:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📈 Total: ${passed + failed}`);

if (failed > 0) {
    console.log('\n🚨 Some tests failed! Please fix the issues.');
    process.exit(1);
} else {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
}
