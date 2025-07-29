#!/usr/bin/env node

/**
 * Cross-Language Environment Variable Tests
 * 
 * Tests that all technologies (JavaScript, PHP, Shell) can access
 * the same environment variables from .env
 */

import fs from 'fs';
import { execSync } from 'child_process';
import { loadEnv } from './env.js';

console.log('🧪 Testing Cross-Language Environment Variable System');
console.log('====================================================\n');

// Test 1: JavaScript env loading
console.log('📝 Test 1: JavaScript env loading');
const jsEnv = loadEnv();
const expectedVars = ['VITE_FILE_PHP', 'PHP_SERVER_PORT', 'VITE_PHP_SERVER_PORT'];

expectedVars.forEach(varName => {
    if (jsEnv[varName]) {
        console.log(`  ✅ ${varName}: ${jsEnv[varName]}`);
    } else {
        console.log(`  ❌ ${varName}: MISSING`);
    }
});

// Test 2: PHP env access
console.log('\n📝 Test 2: PHP env access');
try {
    const phpTest = `
<?php
require_once 'env.php';
echo "VITE_FILE_PHP: " . VITE_FILE_PHP . "\\n";
echo "PHP_SERVER_PORT: " . PHP_SERVER_PORT . "\\n"; 
echo "VITE_PHP_SERVER_PORT: " . VITE_PHP_SERVER_PORT . "\\n";
?>`;
    
    fs.writeFileSync('test-php.php', phpTest);
    const phpOutput = execSync('php test-php.php', { encoding: 'utf8' });
    
    phpOutput.split('\n').forEach(line => {
        if (line.trim()) {
            console.log(`  ✅ ${line.trim()}`);
        }
    });
    
    fs.unlinkSync('test-php.php');
} catch (error) {
    console.log(`  ❌ PHP test failed: ${error.message}`);
}

// Test 3: Shell env access  
console.log('\n📝 Test 3: Shell env access');
try {
    const shellTest = `#!/bin/bash
source env.sh
echo "VITE_FILE_PHP: $VITE_FILE_PHP"
echo "PHP_SERVER_PORT: $PHP_SERVER_PORT"
echo "VITE_PHP_SERVER_PORT: $VITE_PHP_SERVER_PORT"
`;
    
    fs.writeFileSync('test-shell.sh', shellTest);
    fs.chmodSync('test-shell.sh', '755');
    
    const shellOutput = execSync('./test-shell.sh', { encoding: 'utf8' });
    
    shellOutput.split('\n').forEach(line => {
        if (line.trim()) {
            console.log(`  ✅ ${line.trim()}`);
        }
    });
    
    fs.unlinkSync('test-shell.sh');
} catch (error) {
    console.log(`  ❌ Shell test failed: ${error.message}`);
}

// Test 4: Cross-language consistency
console.log('\n📝 Test 4: Cross-language consistency');
const testVar = 'VITE_FILE_PHP';
const jsValue = jsEnv[testVar];

try {
    // Check PHP value
    const phpCheck = execSync(`php -r "require 'env.php'; echo ${testVar};"`, { encoding: 'utf8' });
    
    // Check shell value  
    const shellCheck = execSync(`bash -c "source env.sh && echo $${testVar}"`, { encoding: 'utf8' }).trim();
    
    if (jsValue === phpCheck && jsValue === shellCheck) {
        console.log(`  ✅ ${testVar} consistent across all languages: "${jsValue}"`);
    } else {
        console.log(`  ❌ ${testVar} inconsistent:`);
        console.log(`    JS: "${jsValue}"`);
        console.log(`    PHP: "${phpCheck}"`);
        console.log(`    Shell: "${shellCheck}"`);
    }
} catch (error) {
    console.log(`  ❌ Consistency test failed: ${error.message}`);
}

// Test 5: File existence and readability
console.log('\n📝 Test 5: File existence and readability');
const criticalFiles = ['.env', 'env.php', 'env.sh', 'todo.php.svg', 'index.html'];

criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        console.log(`  ✅ ${file}: ${stats.size} bytes`);
    } else {
        console.log(`  ❌ ${file}: MISSING`);
    }
});

// Test 6: SVG file loading test
console.log('\n📝 Test 6: SVG file loading test');
const svgFile = jsEnv['VITE_FILE_PHP'] || 'todo.php.svg';
if (fs.existsSync(svgFile)) {
    const svgContent = fs.readFileSync(svgFile, 'utf8');
    const hasPhp = svgContent.includes('<?php');
    const hasSvg = svgContent.includes('<svg');
    
    console.log(`  ✅ ${svgFile}: ${fs.statSync(svgFile).size} bytes`);
    console.log(`  ${hasPhp ? '✅' : '❌'} Contains PHP code`);
    console.log(`  ${hasSvg ? '✅' : '❌'} Contains SVG markup`);
} else {
    console.log(`  ❌ SVG file not found: ${svgFile}`);
}

console.log('\n🎉 Cross-language environment system tests complete!');
console.log('\n💡 Usage in each language:');
console.log('  JavaScript: import { loadEnv } from "./env.js"; const env = loadEnv();');
console.log('  PHP: require_once "env.php"; echo VITE_FILE_PHP;');
console.log('  Shell: source env.sh && echo $VITE_FILE_PHP');
