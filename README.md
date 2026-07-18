# Music Playlist Manager

Live demo: https://music-playlist-manager-6jsq.onrender.com

A lightweight, responsive music playlist manager built with React, Vite and WebAssembly (Emscripten). It lets you sign in with OTP, upload and organize tracks, create playlists, mark favorites, and play music with a live 3D visualizer.

Key highlights
- Clean, mobile-first UI with Tailwind CSS and Framer Motion animations
- Fast local search using a Trie implemented in WASM-backed data structures
- Upload and persist user tracks (IndexedDB + localStorage)
- 3D audio visualizer (Three.js) and responsive player controls

Quick start
1. Clone the repo

```bash
git clone https://github.com/Himanshu-Kumar-LPU/Music-Playlist-Manager.git
cd Music-Playlist-Manager
```

2. Install dependencies

```bash
npm install
```

3. Development server

```bash
npm run dev
# Frontend: http://localhost:3000
# Backend:  http://localhost:4000
```

Build & production

```bash
npm run build:wasm   # compile C++ -> WASM (optional if using prebuilt)
npm run build
```

Files & structure
- `src/` — React app and components
- `wasm/` — C++ sources and build scripts (Emscripten)
- `server.js` — lightweight Express backend for OTP and API

Deployment
- The app is deployed and running at: https://music-playlist-manager-6jsq.onrender.com
- For production deploys, build the app (`npm run build`) and host `/dist` on your static host; run the Express server (or use serverless functions) with appropriate environment variables for email/OTP.

Environment variables
- See `.env.example` for required values (email/SMTP, PORT, DEV_EMAIL_FALLBACK)

Contributing
- Fork, create a feature branch, and open a pull request. Please keep changes small and focused.

License
- Add your preferred license (e.g., MIT) here.

Contact
- Open an issue on GitHub for bugs or feature requests.

--
Last updated: July 2026
