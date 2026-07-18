@echo off
setlocal
set ROOT_DIR=E:\mu\
set OUT_DIR=E:\mu\src\wasm
mkdir "%OUT_DIR%" 2>nul
cd /d "%ROOT_DIR%"
"E:\mu\emsdk\python\3.13.3_64bit\python.exe" "E:\mu\emsdk\upstream\emscripten\emcc.py" wasm\DoublyLinkedList.cpp wasm\Stack.cpp wasm\Queue.cpp wasm\HashMap.cpp wasm\Trie.cpp wasm\SortAlgorithms.cpp wasm\Shuffle.cpp wasm\bindings.cpp -lembind -O2 -s MODULARIZE=1 -s EXPORT_ES6=1 -s ENVIRONMENT=web -o "%OUT_DIR%\dsa.js"
