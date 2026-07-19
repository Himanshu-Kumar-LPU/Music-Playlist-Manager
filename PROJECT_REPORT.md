# MUSIC PLAYLIST MANAGER - PROJECT REPORT

## **1. INTRODUCTION OF ORGANIZATION**

### **ABOUT THE ORGANIZATION**

This **Music Playlist Manager** project was undertaken as a collaborative group initiative by a team of 5 members during the Summer Training/Internship program. The project was designed to simulate a real-world development environment where team members work across different roles—frontend development, backend development, database design, UI/UX, and DevOps/deployment—mirroring how professional software development teams operate.

**Team Members & Roles:**
- Lead Frontend Developer: UI/UX Implementation, React Components
- Backend Developer: API Development, Authentication System
- Data Structures Specialist: WASM Implementation, Algorithm Optimization
- Full-Stack Integration Engineer: Feature Integration, Testing
- DevOps & Documentation: Deployment, GitHub Management, Documentation

The collaborative approach allowed team members to understand the complete development lifecycle, from requirements gathering and architecture design to deployment and user feedback incorporation.

---

### **DOMAIN OF WORK**

The training focused on **full-stack web development** with a strong emphasis on **Data Structures and Algorithms (DSA)** applied to production environments. The team worked on building a **high-performance music playlist manager** that demonstrates practical integration of core computer science fundamentals into a real-world web application.

**Key Technical Areas Covered:**

**Frontend Development:**
- React 18.2, Vite 5.4 build tooling, Tailwind CSS 3.4
- Framer Motion for smooth animations and transitions
- Real-time 3D audio visualization using Three.js & @react-three/fiber
- Responsive mobile-first UI design
- State management using Context API & useCallback hooks
- React Router 6.21 for client-side navigation

**Backend Development:**
- Node.js with Express 4.18 REST API
- OTP-based email authentication (Nodemailer 6.9)
- Session and user management with localStorage
- API endpoint design & optimization
- Environment configuration with dotenv 16.3

**Data Structures & Algorithms (C++ → WebAssembly):**
- DoublyLinkedList: Playlist ordering & navigation (O(1) append/remove)
- HashMap: Fast favorite song lookups (O(1) avg case)
- Stack: Recently played history tracking
- Queue: Play-next queue management
- Trie: Fast music search with O(m) complexity (m = query length)
- Sorting Algorithms: Merge Sort (O(n log n)) for organizing tracks by title/artist
- Fisher-Yates Shuffle: Randomized playlist generation (O(n))

**Database & Persistence:**
- IndexedDB for storing large audio file blobs (browser storage)
- localStorage for user preferences, playlist IDs, favorite IDs, recent IDs
- Per-user data isolation with email-based keys
- Session persistence with localStorage

**DevOps & Deployment:**
- Git version control & GitHub collaborative workflow
- Deployment on Render (live production at: https://music-playlist-manager-6jsq.onrender.com)
- Environment configuration management
- Performance monitoring & optimization

---

## **2. PROJECT OBJECTIVES & GOALS**

### **Primary Objectives:**

1. **Build a Production-Ready Web Application**: Create a fully functional music playlist manager with real user authentication, persistent storage, and smooth performance.

2. **Integrate DSA with Web Development**: Implement core data structures and algorithms in C++, compile to WebAssembly, and use them in a real-world frontend application.

3. **Team Collaboration & Agile Development**: Practice real-world software engineering workflows including Git, code reviews, testing, and deployment.

4. **Cross-Platform Responsiveness**: Ensure the application works seamlessly on desktop, tablet, and mobile devices.

5. **Performance Optimization**: Use WASM for CPU-intensive operations (search, sort, shuffle) to achieve O(n log n) performance.

### **Secondary Objectives:**

- Learn modern frontend frameworks (React, Vite)
- Understand backend authentication flows (OTP, email verification)
- Implement persistent data storage (IndexedDB, localStorage)
- Practice DevOps basics (deployment, environment configuration)
- Create comprehensive documentation for future maintenance

---

## **3. PROJECT FEATURES**

### **Core Features Implemented:**

#### **Authentication System:**
- Email-based OTP sign-up and sign-in
- Session persistence with localStorage
- Per-user isolated data storage
- Secure password-less authentication

#### **Music Management:**
- Browse all available tracks (14+ default songs)
- Upload custom music files with metadata (title, artist, genre, cover art)
- Search songs using Trie-based fast search (O(m) complexity)
- Filter songs by genre
- Sort songs by title, artist, or duration

#### **Playlist Features:**
- Create custom playlists
- Add/remove songs from playlists
- Reorder playlist tracks (DoublyLinkedList)
- Mark songs as favorites (HashMap for O(1) lookups)
- Track recently played songs (Stack-based history)

#### **Player Controls:**
- Play/pause/next/previous with smooth transitions
- Loop through all 14 songs (tested and working)
- Repeat modes: Off, One (repeat single song), All (loop playlist)
- Shuffle playlist using Fisher-Yates algorithm
- Volume control with smooth sliders
- Progress bar with seek functionality
- Display song duration and current time

#### **3D Visualizer:**
- Real-time audio visualization using Three.js
- Animated waveform representation
- Responsive to audio frequency data
- Performance optimized for mobile devices

#### **Responsive Design:**
- Mobile-first UI with Tailwind CSS breakpoints
- Touch-optimized buttons (44x44px minimum for accessibility)
- Horizontal scroll navigation on small screens
- Adaptive layouts for sm, md, lg breakpoints
- Works on phones, tablets, and desktops

#### **Data Persistence:**
- User playlists saved to localStorage
- Favorite songs saved to localStorage
- Recently played history saved to localStorage
- Audio files stored in IndexedDB (browser database)
- Cover images stored as base64 or IndexedDB blobs

---

## **4. TECHNOLOGY STACK**

### **Frontend:**
```
React 18.2
Vite 5.4
Tailwind CSS 3.4
Framer Motion 11.11
Three.js + @react-three/fiber
React Router 6.21
React Icons 4.x
```

### **Backend:**
```
Node.js 20+
Express 4.18
Nodemailer 6.9
dotenv 16.3
```

### **WebAssembly & Data Structures:**
```
Emscripten (C++ to WebAssembly compiler)
C++ Standard Library
Custom implementations:
  - DoublyLinkedList.cpp/h
  - HashMap.cpp/h
  - Stack.cpp/h
  - Queue.cpp/h
  - Trie.cpp/h
  - SortAlgorithms.cpp/h (Merge Sort)
  - Shuffle.cpp/h (Fisher-Yates)
```

### **Deployment:**
```
Render (production hosting)
GitHub (version control)
```

---

## **5. ARCHITECTURE & DESIGN**

### **Frontend Architecture:**
```
src/
├── components/
│   ├── AuthScreen.jsx (Login/Signup)
│   ├── PlayerBar.jsx (Music controls)
│   ├── Visualizer3D.jsx (3D audio viz)
├── pages/
│   ├── HomePage.jsx (Browse & play all songs)
│   ├── PlaylistPage.jsx (Custom playlists)
│   ├── FavoritesPage.jsx (Favorite songs)
│   ├── RecentPage.jsx (Recently played)
├── context/
│   └── MusicContext.jsx (Global state management)
├── hooks/
│   └── useWasm.jsx (Load & manage WASM module)
├── utils/
│   └── idbStorage.js (IndexedDB persistence)
├── data/
│   └── songs.js (Default song data)
└── wasm/
    └── dsa.js (Compiled WASM module)
```

### **Backend Architecture:**
```
server.js
├── POST /api/request-otp (Send OTP email)
├── POST /api/verify-otp (Verify user, create session)
└── Static file serving (index.html, assets)
```

### **State Management Flow:**
```
MusicContext (Global State)
├── currentSong, isPlaying
├── volume, repeatMode, shuffleEnabled
├── playlistIds, favoritesIds, recentIds
├── searchQuery, searchResults
├── userSongs (uploaded tracks)
└── WASM Data Structures (DoublyLinkedList, HashMap, etc.)
```

---

## **6. DATA STRUCTURES & ALGORITHMS USED**

| Data Structure | Operations | Time Complexity | Use Case |
|---|---|---|---|
| **DoublyLinkedList** | Insert, Remove, Traverse | O(1), O(n) | Playlist ordering |
| **HashMap** | Get, Set, Remove | O(1) avg | Favorite lookups |
| **Stack** | Push, Pop | O(1) | Recently played history |
| **Queue** | Enqueue, Dequeue | O(1) | Play-next queue |
| **Trie** | Insert, Search | O(m) | Fast music search |
| **Merge Sort** | Sort | O(n log n) | Sort by title/artist |
| **Fisher-Yates Shuffle** | Shuffle | O(n) | Randomize playlist |

---

## **7. CHALLENGES FACED & SOLUTIONS**

### **Challenge 1: Next/Previous Buttons Only Working for 3 Songs**
**Problem**: The button handlers were not updating with the latest song list state, causing them to only advance 3 songs before stopping.

**Solution**: 
- Implemented `useCallback` hook with proper dependencies (songs, playlistIds, currentSong?.id, playSong)
- Used `findIndex` instead of `indexOf` for reliable ID matching (handles string comparison)
- Applied modulo operator (%) for seamless looping through all songs
- Added proper boundary checking for edge cases

**Result**: Next/previous buttons now work flawlessly for all 14+ songs with smooth looping.

---

### **Challenge 2: Mobile UI Not Showing Navigation Tabs**
**Problem**: Navigation tabs (Home, Playlist, Favorites, Recent) were hidden on mobile devices due to `hidden sm:flex` class, making the app non-navigable on phones.

**Solution**: 
- Removed `hidden` class and added `overflow-x-auto` for horizontal scroll on small screens
- Increased button touch targets from 8px to 12px padding (achieving 44x44px minimum for accessibility)
- Added `active:scale-95` for visual touch feedback on button clicks
- Maintained responsive breakpoints for larger screens

**Result**: Navigation tabs visible and functional on all devices with proper touch targets.

---

### **Challenge 3: WASM Module Integration with React State**
**Problem**: WASM data structures (HashMap, DoublyLinkedList, etc.) were not syncing properly with React component state, causing inconsistencies between UI and internal data structures.

**Solution**:
- Created `useWasm` custom hook to manage WASM module lifecycle and initialization
- Implemented proper state synchronization in MusicContext
- Used refs (repeatModeRef, playlistIdsRef, etc.) to track current state for use in event listeners
- Ensured cleanup of WASM objects on component unmount

**Result**: WASM operations now properly reflect in UI state and vice versa.

---

### **Challenge 4: IndexedDB Blob Storage & Retrieval**
**Problem**: Large audio files needed to persist without filling localStorage (which has ~5-10MB limit), but retrieving and playing blobs from IndexedDB was complex.

**Solution**:
- Implemented IndexedDB storage utility (`idbStorage.js`) for audio blobs
- Used File API to convert uploaded files to blobs
- Created object URLs for playing stored audio files
- Implemented proper error handling for blob operations

**Result**: Users can now upload and persist large audio files efficiently (50MB+ per file depending on browser).

---

### **Challenge 5: Cross-Browser Favicon Caching**
**Problem**: Logo favicon not appearing in browser tab after deployment, likely due to browser caching old favicon references.

**Solution**:
- Changed favicon link in index.html to `/logoimage/image.png`
- Provided clear instructions to users for hard-refresh (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)
- Set appropriate cache headers for favicon

**Result**: Favicon now properly displays in browser tab on first load.

---

## **8. KEY ACHIEVEMENTS**

✅ **Complete Full-Stack Application**: From frontend UI to backend API to WebAssembly data structures.

✅ **Production Deployment**: Live application running at https://music-playlist-manager-6jsq.onrender.com

✅ **High Performance**: WASM-backed search completes in O(m) time; sorting in O(n log n).

✅ **Mobile Responsive**: Fully functional on phones, tablets, and desktops.

✅ **Real-World Features**: OTP authentication, persistent storage, 3D visualization.

✅ **Collaborative Development**: Successfully managed codebase with 5 team members using Git.

✅ **14+ Songs Working**: Verified next/previous buttons work for entire music library with proper looping.

✅ **Accessible UI**: Touch targets meet WCAG standards (44x44px minimum), works on all screen sizes.

---

## **9. INDIVIDUAL CONTRIBUTIONS**

### **Team Member 1 - Frontend Lead:**
- Architected React component structure (AuthScreen, PlayerBar, Visualizer3D, Pages)
- Implemented Tailwind CSS responsive design system
- Created Context API state management
- Fixed mobile navigation visibility issue (hidden nav tabs)
- Optimized Framer Motion animations

### **Team Member 2 - Backend Developer:**
- Set up Express server with proper routing
- Implemented OTP authentication system with Nodemailer
- Designed REST API endpoints (/api/request-otp, /api/verify-otp)
- Managed session handling and user data persistence
- Configured environment variables and security

### **Team Member 3 - DSA & WASM Specialist:**
- Implemented all C++ data structures (DoublyLinkedList, HashMap, Trie, Stack, Queue)
- Set up Emscripten environment and WASM compilation pipeline
- Implemented sorting algorithms (Merge Sort, O(n log n))
- Implemented Fisher-Yates shuffle algorithm (O(n))
- Optimized for performance and memory usage

### **Team Member 4 - Full-Stack Integration:**
- Integrated WASM module with React components
- Implemented IndexedDB storage utility for audio blobs
- Fixed critical issues with next/previous button handlers
- Implemented feature integration across all pages
- Conducted testing and bug fixes

### **Team Member 5 - DevOps & Documentation:**
- Managed GitHub repository and collaborative Git workflows
- Deployed application to Render production environment
- Updated and maintained comprehensive README documentation
- Managed environment configuration and deployment scripts
- Integrated browser logo/favicon

---

## **10. OUTCOMES & LEARNINGS**

### **Technical Learnings:**

1. **WebAssembly Integration**: Understood how to compile C++ to WASM and use it in web applications for performance-critical operations.

2. **Full-Stack Development**: Gained hands-on experience with frontend (React), backend (Node.js), and database layers (IndexedDB, localStorage).

3. **Data Structures in Practice**: Implemented and used DoublyLinkedList, HashMap, Trie, and other structures in a real application, not just theoretical exercises.

4. **Responsive Design**: Mastered mobile-first design principles and Tailwind CSS responsive utilities.

5. **State Management**: Learned React Context API, useCallback, and proper state synchronization patterns.

6. **Deployment & DevOps**: Successfully deployed a production application with environment configuration and monitoring.

7. **Performance Optimization**: Learned to analyze algorithmic complexity and optimize for user experience.

### **Professional Learnings:**

1. **Team Collaboration**: Practiced Git workflows, code reviews, and collaborative development with multiple team members.

2. **Problem Solving**: Debugged complex issues like state synchronization, WASM integration, and mobile responsiveness.

3. **Communication**: Communicated technical issues and solutions clearly within the team.

4. **User-Centric Design**: Learned to think about accessibility (touch targets, responsive breakpoints) and user experience.

5. **Documentation**: Realized the importance of clear documentation for maintainability and team communication.

6. **Debugging Skills**: Developed ability to trace bugs through multiple layers (React → WASM → IndexedDB).

---

## **11. REPRESENTATIVE CODE EXCERPTS**

### **DoublyLinkedList Implementation (C++)**

```cpp
// wasm/DoublyLinkedList.h
#ifndef DOUBLY_LINKED_LIST_H
#define DOUBLY_LINKED_LIST_H

class DoublyLinkedList {
private:
    struct Node {
        int data;
        Node* prev;
        Node* next;
        
        Node(int value) : data(value), prev(nullptr), next(nullptr) {}
    };
    
    Node* head;
    Node* tail;
    int size;

public:
    DoublyLinkedList() : head(nullptr), tail(nullptr), size(0) {}
    
    ~DoublyLinkedList() {
        while (head) {
            Node* temp = head;
            head = head->next;
            delete temp;
        }
    }
    
    // Insert at end: O(1) operation
    void insertAtEnd(int value) {
        Node* newNode = new Node(value);
        if (!tail) {
            head = tail = newNode;
        } else {
            tail->next = newNode;
            newNode->prev = tail;
            tail = newNode;
        }
        size++;
    }
    
    // Remove by ID: O(n) to locate, O(1) to remove
    void removeById(int value) {
        Node* current = head;
        while (current) {
            if (current->data == value) {
                if (current->prev) current->prev->next = current->next;
                else head = current->next;
                
                if (current->next) current->next->prev = current->prev;
                else tail = current->prev;
                
                delete current;
                size--;
                return;
            }
            current = current->next;
        }
    }
    
    // Move to next: O(1) once node is known
    Node* moveNext(Node* current) {
        return current ? current->next : nullptr;
    }
    
    // Move to previous: O(1) once node is known
    Node* movePrev(Node* current) {
        return current ? current->prev : nullptr;
    }
    
    // Convert to array for JavaScript
    std::vector<int> toArray() {
        std::vector<int> result;
        Node* current = head;
        while (current) {
            result.push_back(current->data);
            current = current->next;
        }
        return result;
    }
    
    int getSize() const { return size; }
};

#endif
```

**Use Case in Project:** Maintains playlist order. When a user adds a song to a playlist, it's appended in O(1) time. Reordering requires finding the node O(n), then updating prev/next pointers in O(1).

---

### **HashMap Implementation (C++)**

```cpp
// wasm/HashMap.h - Simple hash table for O(1) lookups
#include <vector>
#include <utility>

class HashMap {
private:
    static const int CAPACITY = 101;
    std::vector<std::pair<int, int>> buckets[CAPACITY];
    
    int hash(int key) {
        return key % CAPACITY;
    }

public:
    // Set value: O(1) average case
    void set(int key, int value) {
        int index = hash(key);
        for (auto& pair : buckets[index]) {
            if (pair.first == key) {
                pair.second = value;
                return;
            }
        }
        buckets[index].push_back({key, value});
    }
    
    // Get value: O(1) average case
    int get(int key) {
        int index = hash(key);
        for (const auto& pair : buckets[index]) {
            if (pair.first == key) {
                return pair.second;
            }
        }
        return -1; // not found
    }
    
    // Check if key exists: O(1) average case
    bool has(int key) {
        int index = hash(key);
        for (const auto& pair : buckets[index]) {
            if (pair.first == key) return true;
        }
        return false;
    }
    
    // Remove: O(1) average case
    void remove(int key) {
        int index = hash(key);
        for (auto it = buckets[index].begin(); it != buckets[index].end(); ++it) {
            if (it->first == key) {
                buckets[index].erase(it);
                return;
            }
        }
    }
};
```

**Use Case in Project:** Stores favorite songs for O(1) lookups. Instead of searching through a list, checking if song ID 42 is a favorite returns instantly from the HashMap.

---

### **Trie Implementation (C++) - Fast String Search**

```cpp
// wasm/Trie.h - For O(m) song search (m = query length)
#include <unordered_map>

class TrieNode {
public:
    std::unordered_map<char, TrieNode*> children;
    bool isEndOfWord;
    int songId; // store song ID at word end
    
    TrieNode() : isEndOfWord(false), songId(-1) {}
};

class Trie {
private:
    TrieNode* root;

public:
    Trie() : root(new TrieNode()) {}
    
    // Insert song title: O(m) where m = length of title
    void insert(const std::string& word, int songId) {
        TrieNode* current = root;
        for (char c : word) {
            char lower = tolower(c);
            if (current->children.find(lower) == current->children.end()) {
                current->children[lower] = new TrieNode();
            }
            current = current->children[lower];
        }
        current->isEndOfWord = true;
        current->songId = songId;
    }
    
    // Search for song: O(m) where m = query length
    bool search(const std::string& word) {
        TrieNode* current = root;
        for (char c : word) {
            char lower = tolower(c);
            if (current->children.find(lower) == current->children.end()) {
                return false;
            }
            current = current->children[lower];
        }
        return current->isEndOfWord;
    }
    
    // Autocomplete - find all songs starting with prefix: O(m + n)
    std::vector<int> autocomplete(const std::string& prefix) {
        std::vector<int> results;
        TrieNode* current = root;
        
        for (char c : prefix) {
            char lower = tolower(c);
            if (current->children.find(lower) == current->children.end()) {
                return results;
            }
            current = current->children[lower];
        }
        
        // DFS to collect all song IDs
        dfs(current, results);
        return results;
    }
    
private:
    void dfs(TrieNode* node, std::vector<int>& results) {
        if (node->isEndOfWord) {
            results.push_back(node->songId);
        }
        for (auto& pair : node->children) {
            dfs(pair.second, results);
        }
    }
};
```

**Use Case in Project:** When user types "Boh" to search for "Bohemian Rhapsody", the Trie finds it in O(3) time instead of searching through all 14 songs.

---

### **React Hook for WASM Integration (JavaScript)**

```jsx
// src/hooks/useWasm.jsx
import { useEffect, useState } from 'react';

export function useWasm() {
    const [module, setModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                // Import the compiled WASM module
                const wasmModule = await import('../wasm/dsa.js');
                setModule(wasmModule.default);
            } catch (err) {
                setError(err);
                console.error('Failed to load WASM module:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return { module, loading, error };
}
```

**Use Case:** Dynamically loads the compiled C++ → WebAssembly data structures, making them available to React components via the `useMusic()` context.

---

### **Player Handler - Next/Previous Button Fix (JavaScript)**

```jsx
// src/components/PlayerBar.jsx - Fixed handlers for all songs

const handleNext = useCallback(() => {
    const fullList = songs.map((s) => s.id);
    const list = playlistIds.length > 0 ? playlistIds : fullList;
    
    if (!list || list.length === 0) return;
    
    const currentId = currentSong?.id;
    // Use findIndex for reliable ID matching (handles string/number conversion)
    let currentIndex = list.findIndex((id) => String(id) === String(currentId));
    
    // If song not found, start from beginning
    if (currentIndex === -1) {
        currentIndex = 0;
    } else {
        // Move to next song, or loop to first with modulo operator
        currentIndex = (currentIndex + 1) % list.length;
    }
    
    playSong(list[currentIndex]);
}, [songs, playlistIds, currentSong?.id, playSong]);

const handlePrev = useCallback(() => {
    const fullList = songs.map((s) => s.id);
    const list = playlistIds.length > 0 ? playlistIds : fullList;
    
    if (!list || list.length === 0) return;
    
    const currentId = currentSong?.id;
    let currentIndex = list.findIndex((id) => String(id) === String(currentId));
    
    // If song not found, start from end
    if (currentIndex === -1) {
        currentIndex = list.length - 1;
    } else {
        // Move to previous song, or loop to last with modulo operator
        currentIndex = (currentIndex - 1 + list.length) % list.length;
    }
    
    playSong(list[currentIndex]);
}, [songs, playlistIds, currentSong?.id, playSong]);
```

**Key Improvements:**
- `useCallback` ensures handlers update with latest state
- `findIndex` with string comparison handles ID type conversion
- Modulo operator (%) provides seamless looping
- Works for all 14+ songs, not just 3

---

### **IndexedDB Blob Storage (JavaScript)**

```js
// src/utils/idbStorage.js - Store large audio files

const DB_NAME = 'MusicPlaylistDB';
const STORE_NAME = 'audioBlobs';
const DB_VERSION = 1;

let db;

export async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e) => {
            db = e.target.result;
            db.createObjectStore(STORE_NAME);
        };
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        request.onerror = () => reject(request.error);
    });
}

// Save audio blob: O(1) average insertion
export async function saveBlob(key, blob) {
    if (!db) await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(blob, key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// Retrieve audio blob: O(1) average lookup
export async function getBlob(key) {
    if (!db) await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Delete audio blob: O(1) average deletion
export async function deleteBlob(key) {
    if (!db) await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}
```

**Use Case:** Allows users to upload and play audio files larger than localStorage's 5-10MB limit. Each file is stored as a Blob in IndexedDB.

---

## **12. FUTURE ENHANCEMENTS**

- [ ] User accounts with cloud storage (Firebase/AWS)
- [ ] Playlist sharing and collaboration features
- [ ] Advanced audio filters and equalizer
- [ ] Offline mode with service workers
- [ ] Social features (follow, recommendations)
- [ ] Music recommendation algorithm using ML
- [ ] Batch upload for large music libraries
- [ ] Dark/light theme toggle
- [ ] Keyboard shortcuts for power users
- [ ] Podcast support
- [ ] Voice search functionality
- [ ] Smart queue based on mood/genre

---

## **12. CONCLUSION**

The **Music Playlist Manager** project successfully demonstrates the integration of modern web technologies with core computer science principles (Data Structures & Algorithms). Through this project, the team gained practical experience in full-stack development, learned to work collaboratively on a real-world application, and deployed a production-grade music management system.

The project serves as a strong portfolio piece showcasing:
- Technical depth (WASM, multiple data structures, complex state management)
- User experience (mobile-responsive, smooth animations, 3D visualization)
- Professional practices (Git, deployment, documentation, testing)

**Live Demo**: https://music-playlist-manager-6jsq.onrender.com  
**GitHub Repository**: https://github.com/Himanshu-Kumar-LPU/Music-Playlist-Manager

**Project Duration**: [Start Date] - July 2026  
**Team Size**: 5 members  
**Status**: ✅ Complete & Deployed

---

# **ONE PAGE SUMMARY**

## **MUSIC PLAYLIST MANAGER - EXECUTIVE SUMMARY**

**Project Overview:** Collaborative 5-member full-stack web application integrating Data Structures & Algorithms with modern web technologies. Live at: https://music-playlist-manager-6jsq.onrender.com

**Objectives:** Build production-ready music app; integrate DSA with web dev; practice team collaboration; ensure cross-platform responsiveness; optimize performance using WASM.

**Core Features:**
- ✅ Email OTP authentication (secure, password-less)
- ✅ Browse 14+ songs with fast search (Trie, O(m))
- ✅ Upload custom music with metadata
- ✅ Create playlists (DoublyLinkedList)
- ✅ Mark favorites (HashMap, O(1) lookups)
- ✅ Recently played tracking (Stack)
- ✅ **Next/Previous buttons work for all 14 songs**
- ✅ Shuffle (Fisher-Yates, O(n))
- ✅ Sort by title/artist (Merge Sort, O(n log n))
- ✅ 3D audio visualizer (Three.js)
- ✅ Repeat modes & volume control
- ✅ Mobile-responsive (44x44px touch targets)
- ✅ Persistent storage (localStorage + IndexedDB)

**Tech Stack:** React 18.2 | Vite | Tailwind CSS | Three.js | Node.js + Express | WebAssembly (C++) | IndexedDB | GitHub | Render

**Key Achievements:**
- Production deployment with real users
- High-performance WASM integration
- All 14 songs tested and working
- Mobile-first responsive design
- Team of 5 successfully collaborated
- Comprehensive documentation

**Challenges & Solutions:**
| Issue | Fix | Status |
|---|---|---|
| Next/prev only 3 songs | useCallback + findIndex + modulo | ✅ All 14 songs |
| Mobile nav hidden | Remove `hidden`, add `overflow-x-auto` | ✅ Visible on mobile |
| WASM state sync | Custom useWasm hook + Context | ✅ Synced |
| Large audio files | IndexedDB blob storage | ✅ Efficient |
| Logo not in browser tab | Updated favicon path | ✅ Displays |

**Learnings:** WebAssembly integration, full-stack development, DSA in practice, team collaboration, Git workflows, performance optimization, user-centric design, deployment practices.

**Live Demo:** https://music-playlist-manager-6jsq.onrender.com  
**GitHub:** https://github.com/Himanshu-Kumar-LPU/Music-Playlist-Manager  
**Status:** ✅ Complete & Deployed
