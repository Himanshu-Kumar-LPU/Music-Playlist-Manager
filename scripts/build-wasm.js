#!/usr/bin/env node

/**
 * Cross-platform WASM build script
 * Runs the appropriate build command based on the OS
 * Skips on Render/cloud platforms where Emscripten isn't installed
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const wasmDir = path.join(ROOT, 'src', 'wasm');
const dummyFile = path.join(wasmDir, 'dsa.js');

// Check if we're on Render or don't have emcc
const isRender = process.env.RENDER === 'true';
const isCI = process.env.CI === 'true';

console.log(`🔨 WASM Build Script`);
console.log(`📍 Environment: ${isRender ? 'Render' : isCI ? 'CI/CD' : 'Local'}`);

// Create output dir
if (!fs.existsSync(wasmDir)) {
  fs.mkdirSync(wasmDir, { recursive: true });
}

// If WASM already exists or we're on Render, skip build
if (fs.existsSync(dummyFile)) {
  console.log('✅ WASM already compiled, skipping build');
  process.exit(0);
}

if (isRender || isCI) {
  console.log('⏭️  Skipping WASM build on cloud platform (Emscripten not available)');
  console.log('   Generating placeholder for bundling...');
  
  // Create a minimal WASM stub so React doesn't error
  fs.writeFileSync(dummyFile, `
// Placeholder WASM module - will be replaced with actual build locally
export default { ready: Promise.resolve() };
`);
  
  console.log('✅ Placeholder created');
  process.exit(0);
}

// Local build
const isWindows = process.platform === 'win32';
const buildScript = isWindows ? 'wasm\\build.cmd' : 'wasm/build.sh';

console.log(`🏗️  Building locally with ${isWindows ? 'Windows' : 'Linux/Mac'} script...`);

try {
  if (isWindows) {
    execSync(`cmd /c ${buildScript}`, { stdio: 'inherit', cwd: ROOT });
  } else {
    execSync(`bash ${buildScript}`, { stdio: 'inherit', cwd: ROOT });
  }
  console.log('✅ WASM build successful!');
} catch (error) {
  console.error('❌ WASM build failed!');
  console.error('   Make sure Emscripten is installed and activated');
  process.exit(1);
}
