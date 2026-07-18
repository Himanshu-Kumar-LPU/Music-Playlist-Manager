#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_DIR="$ROOT_DIR/src/wasm"
mkdir -p "$OUTPUT_DIR"

cd "$ROOT_DIR"

EMCC_BIN=""
if [ -f "$ROOT_DIR/emsdk/upstream/emscripten/emcc.py" ]; then
  EMCC_BIN="\"$ROOT_DIR/emsdk/python/3.13.3_64bit/python.exe\" \"$ROOT_DIR/emsdk/upstream/emscripten/emcc.py\""
elif command -v emcc >/dev/null 2>&1; then
  EMCC_BIN="$(command -v emcc)"
else
  echo "emcc not found. Activate Emscripten SDK first." >&2
  exit 1
fi

$EMCC_BIN wasm/*.cpp -lembind -O2 \
  -s MODULARIZE=1 -s EXPORT_ES6=1 -s ENVIRONMENT=web \
  -o "$OUTPUT_DIR/dsa.js"
