#!/usr/bin/env node

/**
 * Cross-platform WASM build script
 * Runs the appropriate build command based on the OS
 */

const { execSync } = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';
const buildScript = isWindows ? 'wasm\\build.cmd' : 'wasm/build.sh';

console.log(`🔨 Building WASM with ${isWindows ? 'Windows' : 'Linux/Mac'} script...`);
console.log(`📍 Using: ${buildScript}`);

try {
  if (isWindows) {
    // Windows: use cmd /c
    execSync(`cmd /c ${buildScript}`, { stdio: 'inherit' });
  } else {
    // Linux/Mac: use bash
    execSync(`bash ${buildScript}`, { stdio: 'inherit' });
  }
  console.log('✅ WASM build successful!');
} catch (error) {
  console.error('❌ WASM build failed!');
  process.exit(1);
}
