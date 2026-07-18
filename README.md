# 🎵 Music Playlist Manager

A high-performance music playlist manager built with **React**, **Vite**, and **WebAssembly**. Features user authentication, real-time music playback, 3D visualizer, and advanced data structures for optimized performance.

---

## ✨ Features

- **🔐 Secure Authentication**: OTP-based sign-in/sign-up with email verification
- **🎧 Music Management**: Create playlists, mark favorites, and track recently played songs
- **📤 Upload Custom Tracks**: Add your own music files with metadata (title, artist, album, genre)
- **🔍 Instant Search**: Fast search powered by Trie data structures
- **🎨 3D Visualizer**: Real-time audio visualization using Three.js
- **📊 Advanced Sorting & Filtering**: Sort by title, artist, duration; filter by genre
- **💾 Persistent Storage**: Per-user data persistence with IndexedDB for large audio files
- **⚡ High Performance**: WebAssembly-based data structures (HashMap, Stack, Queue, DoublyLinkedList)
- **🎯 Shuffle & Queue**: Fisher-Yates shuffle algorithm and play-next queue management
- **📱 Responsive Design**: Mobile-friendly UI with Tailwind CSS and smooth animations (Framer Motion)

---

## 🛠 Tech Stack

### Frontend
- **React** 18.2 – UI framework
- **Vite** 5.4 – Fast build tool and dev server
- **Tailwind CSS** 3.4 – Utility-first styling
- **Framer Motion** 11.11 – Animations and transitions
- **Three.js & @react-three/fiber** – 3D graphics and visualizer
- **React Router** 6.21 – Client-side routing

### Backend
- **Node.js** with **Express** 4.18 – REST API server
- **Nodemailer** 6.9 – Email/OTP delivery
- **dotenv** 16.3 – Environment configuration

### WebAssembly & Data Structures
- **Emscripten** – C++ to WebAssembly compilation
- **C++ Standard Library** – DoublyLinkedList, HashMap, Stack, Queue, Trie
- **Sorting Algorithms** – Merge sort, Quick sort
- **Shuffle Algorithm** – Fisher-Yates shuffle

---

## 📋 Prerequisites

- **Node.js** 20+ and **npm** 9+
- **Emscripten SDK** (for WASM compilation)
- Modern web browser with WebAssembly support

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mu
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Emscripten (WASM Compilation)

If you haven't installed Emscripten yet:

```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh  # On Windows: emsdk_env.bat
cd ..
```

### 4. Build WebAssembly Module
```bash
npm run build:wasm
```

This compiles C++ sources in `/wasm` and outputs to `/src/wasm/dsa.js`.

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Email Service (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Or use custom SMTP
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_SECURE=false
# EMAIL_USER=your-email@example.com
# EMAIL_PASSWORD=your-password

# Development (disable email, log OTP to console)
DEV_EMAIL_FALLBACK=true

# Backend Port
PORT=4000
```

**Note**: For Gmail, generate an [App Password](https://myaccount.google.com/apppasswords) instead of using your account password.

---

## 🏃 Running Locally

### Development Mode (with Hot Reload)
```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000

### Production Build
```bash
npm run build
```

### Preview Production Build Locally
```bash
npm run preview
```

---

## 🌐 Deployment

### Build for Production

1. Build frontend and WASM:
   ```bash
   npm run build:wasm
   npm run build
   ```

2. The output goes to `/dist` directory.

3. Configure environment variables on your hosting platform:
   - `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASSWORD`
   - `PORT` (default: 4000)
   - `DEV_EMAIL_FALLBACK=false` (enable real email)

### Deploy to Heroku
```bash
heroku create your-app-name
heroku config:set EMAIL_SERVICE=gmail EMAIL_USER=your-email EMAIL_PASSWORD=your-password
git push heroku main
```

### Deploy to Vercel (Frontend Only)
```bash
vercel
```

Then deploy backend separately to Heroku/Railway/Render.

### Deploy to AWS/Azure/GCP
1. Build: `npm run build`
2. Upload `/dist` to static hosting (S3, Azure Blob, etc.)
3. Deploy Express backend to EC2, App Service, Cloud Run, etc.
4. Update proxy in `vite.config.js` to point to your backend URL.

---

## 📁 Project Structure

```
mu/
├── src/
│   ├── components/          # React components (AuthScreen, PlayerBar, Visualizer3D)
│   ├── pages/               # Page components (HomePage, FavoritesPage, RecentPage, PlaylistPage)
│   ├── context/             # MusicContext for state management
│   ├── hooks/               # Custom hooks (useWasm for WASM module)
│   ├── utils/               # Utilities (idbStorage for IndexedDB persistence)
│   ├── data/                # Default songs data
│   ├── wasm/                # Compiled WebAssembly module (dsa.js)
│   ├── styles/              # Global styles
│   ├── App.jsx              # Root app component
│   └── main.jsx             # Vite entry point
├── public/                  # Static assets (images, music, etc.)
├── wasm/                    # C++ source files
│   ├── DoublyLinkedList.{h,cpp}
│   ├── HashMap.{h,cpp}
│   ├── Queue.{h,cpp}
│   ├── Stack.{h,cpp}
│   ├── Trie.{h,cpp}
│   ├── SortAlgorithms.{h,cpp}
│   ├── Shuffle.{h,cpp}
│   ├── bindings.cpp         # Emscripten bindings
│   └── build.{sh,cmd}       # Build scripts
├── server.js                # Express backend
├── index.html               # HTML entry
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS setup
├── postcss.config.js        # PostCSS setup
├── package.json             # Dependencies
├── .env.example             # Environment template
└── README.md                # This file
```

---

## 🔐 Authentication Flow

1. **Sign Up**: User enters email and name → OTP sent → Email verified → Account created
2. **Sign In**: User enters email → OTP sent → Email verified → Authenticated
3. **Session**: User data stored in `localStorage` (auth token), per-user data stored in indexed localStorage keys and IndexedDB

---

## 💾 Data Persistence

- **Authentication**: `localStorage` → `music-playlist-auth`
- **Playlist/Favorites/Recent**: `localStorage` → `{userEmail}:playlistIds`, `{userEmail}:favoriteIds`, `{userEmail}:recentIds`
- **User Uploaded Music**: `localStorage` → `{userEmail}:userSongs` (metadata) + `IndexedDB` (audio blobs)

---

## 📊 Data Structures & Algorithms

| Structure | Operation | Complexity | Use Case |
|-----------|-----------|-----------|----------|
| **DoublyLinkedList** | Append, Remove | O(1), O(n) | Playlist ordering, player navigation |
| **Stack** | Push, Pop | O(1) | Recently played, undo history |
| **Queue** | Enqueue, Dequeue | O(1) | Play-next queue |
| **HashMap** | Get, Set, Remove | O(1) avg | Favorite song lookups |
| **Trie** | Insert, Search | O(m) | Fast search, autocomplete |
| **Merge Sort** | Sort | O(n log n) | Sorting by title, artist |
| **Fisher-Yates Shuffle** | Shuffle | O(n) | Randomize playlist |

---

## 🔗 API Endpoints

### Authentication
- `POST /api/request-otp` – Request OTP code
  ```json
  { "email": "user@example.com", "name": "John", "mode": "signin|signup" }
  ```
- `POST /api/verify-otp` – Verify OTP
  ```json
  { "email": "user@example.com", "otp": "123456" }
  ```

---

## 🐛 Troubleshooting

### WASM Module Not Loading
- Ensure `npm run build:wasm` completed successfully
- Check `/src/wasm/dsa.js` exists
- Clear browser cache and reload

### OTP Email Not Received
- Check `.env.local` has correct email credentials
- For Gmail: use [App Password](https://myaccount.google.com/apppasswords), not account password
- Set `DEV_EMAIL_FALLBACK=true` to see OTP in server logs
- Verify SMTP settings if using custom mail server

### Proxy/CORS Issues (Dev)
- Ensure backend runs on port 4000
- Frontend proxy in `vite.config.js` points to `http://localhost:4000`
- Clear terminal cache and restart with `npm run dev`

### Large Audio Files Not Persisting
- IndexedDB has browser-dependent quotas (typically 50MB+)
- Compress audio before upload
- Check browser's Storage settings

---

## 📝 Environment Variables Reference

```env
# Required for email OTP (choose one: Gmail or custom SMTP)

# Gmail Setup
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Custom SMTP Setup
SMTP_HOST=smtp.your-server.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@your-domain.com
EMAIL_PASSWORD=your-password

# Development & Server
PORT=4000
DEV_EMAIL_FALLBACK=true     # (Development only) Log OTP to console instead of sending
```

---

## 📄 License

[Specify your license here, e.g., MIT, Apache 2.0, etc.]

---

## 👥 Contributing

Contributions are welcome! Please follow standard Git workflows and submit pull requests.

---

## 📧 Support

For issues, questions, or feedback, please open an issue on the repository.

---

**Last Updated**: July 2026  
**Version**: 1.0.0
