import { createContext, useContext, useEffect, useMemo, useState, useRef } from 'react';
import { useWasm } from '../hooks/useWasm.jsx';
import { saveBlob, getBlob, deleteBlob } from '../utils/idbStorage';
import { songs as defaultSongs } from '../data/songs';

const MusicContext = createContext(null);

function readStoredArray(key) {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function normalizeSongId(value) {
  return value == null ? null : String(value);
}

function getSongById(songId, songsList, songMap) {
  const resolvedId = normalizeSongId(songId);
  return songMap[resolvedId] ?? songsList.find((song) => song.id === resolvedId || song.wasmId === Number(songId));
}

function getSongWasmId(songId, songsList, songMap) {
  const song = getSongById(songId, songsList, songMap);
  if (song?.wasmId != null) {
    return song.wasmId;
  }
  return Number(songId) || 0;
}

function getSongIdByWasmId(wasmId, songsList) {
  const song = songsList.find((entry) => entry.wasmId === Number(wasmId));
  return song?.id ?? String(wasmId);
}

function toSongIdArray(wasmIds, songsList) {
  // Emscripten vectors sometimes need to be converted to arrays
  if (!wasmIds) return [];
  if (Array.isArray(wasmIds)) {
    return wasmIds.map((wasmId) => getSongIdByWasmId(wasmId, songsList));
  }
  // If it's an array-like object, convert to array first
  if (typeof wasmIds === 'object' && 'length' in wasmIds) {
    return Array.from(wasmIds).map((wasmId) => getSongIdByWasmId(wasmId, songsList));
  }
  return [];
}

function createUserSongId(title) {
  const slug = String(title || 'custom')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `user-song-${slug}-${Date.now()}`;
}

export function MusicProvider({ children, user }) {
  const { module, loading, error } = useWasm();
  const userKey = (user && user.email ? String(user.email).toLowerCase().replace(/[^a-z0-9@.]/g, '') : 'guest');
  const initializingRef = useRef(true);
  const [playlistIds, setPlaylistIds] = useState([]);
  const [favoritesIds, setFavoritesIds] = useState([]);
  const [recentIds, setRecentIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [userSongs, setUserSongs] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(`${userKey}:userSongs`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  // Debug: show which user key we're using
  if (typeof window !== 'undefined') {
    try { console.debug('[MusicContext] userKey', userKey); } catch {}
  }
  // Hydrate any userSongs that reference blobs in IndexedDB by creating object URLs
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let mounted = true;
    (async () => {
      try {
        let raw = window.localStorage.getItem(`${userKey}:userSongs`);
        // fallback to global key for migration
        if (!raw) raw = window.localStorage.getItem('userSongs');
        if (!raw) return;
        const parsed = JSON.parse(raw);
        const hydrated = await Promise.all(parsed.map(async (s) => {
          if (s?.audioType === 'idb') {
            try {
              const blob = await getBlob(s.id);
              if (blob) {
                return { ...s, audio: URL.createObjectURL(blob) };
              }
            } catch (err) {
              console.error('Failed to hydrate audio blob for', s.id, err);
            }
          }
          return s;
        }));
        if (mounted) setUserSongs(hydrated);
        console.debug('[MusicContext] hydrated userSongs length', (hydrated || []).length, 'for', userKey);
      } catch (err) {
        console.error('Failed to read persisted userSongs', err);
      }
    })();
    return () => { mounted = false; };
  }, []);
  const songs = useMemo(() => [...defaultSongs, ...userSongs], [userSongs]);
  const songMap = useMemo(() => Object.fromEntries(songs.map((song) => [song.id, song])), [songs]);
  const [currentSongId, setCurrentSongId] = useState(defaultSongs[0]?.id ?? 'song-1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [repeatMode, setRepeatMode] = useState('off');
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [sortMode, setSortMode] = useState('title');
  const [playlistName, setPlaylistName] = useState('My Mix');
  const [upNextIds, setUpNextIds] = useState([]);
  const [structures, setStructures] = useState(null);

  useEffect(() => {
    if (!module) return;
    const playlistList = new module.DoublyLinkedList();
    const recentStack = new module.Stack();
    const upNextQueue = new module.Queue();
    const favoritesMap = new module.HashMap();
    const trie = new module.Trie();
    const shuffle = new module.Shuffle();
    const sorter = new module.SortAlgorithms();

    console.debug('[MusicContext] load persisted keys for', userKey);
    // Load persisted per-user data, falling back to global keys for migration
    let storedPlaylist = readStoredArray(`${userKey}:playlistIds`).map(normalizeSongId).filter(Boolean);
    let storedFavorites = readStoredArray(`${userKey}:favoriteIds`).map(normalizeSongId).filter(Boolean);
    let storedRecent = readStoredArray(`${userKey}:recentIds`).map(normalizeSongId).filter(Boolean);
    // If user-specific keys are empty but global keys exist, migrate them
    if (storedPlaylist.length === 0) {
      const global = readStoredArray('playlistIds').map(normalizeSongId).filter(Boolean);
      if (global.length) {
        storedPlaylist = global;
        try { window.localStorage.setItem(`${userKey}:playlistIds`, JSON.stringify(global)); } catch {}
      }
    }
    if (storedFavorites.length === 0) {
      const global = readStoredArray('favoriteIds').map(normalizeSongId).filter(Boolean);
      if (global.length) {
        storedFavorites = global;
        try { window.localStorage.setItem(`${userKey}:favoriteIds`, JSON.stringify(global)); } catch {}
      }
    }
    if (storedRecent.length === 0) {
      const global = readStoredArray('recentIds').map(normalizeSongId).filter(Boolean);
      if (global.length) {
        storedRecent = global;
        try { window.localStorage.setItem(`${userKey}:recentIds`, JSON.stringify(global)); } catch {}
      }
    }
    console.debug('[MusicContext] loaded playlist/favorites/recent', storedPlaylist.length, storedFavorites.length, storedRecent.length);

    storedPlaylist.forEach((id) => playlistList.insertAtEnd(getSongWasmId(id, songs, songMap)));
    storedFavorites.forEach((id) => favoritesMap.set(getSongWasmId(id, songs, songMap), 1));
    storedRecent.forEach((id) => recentStack.push(getSongWasmId(id, songs, songMap)));

    songs.forEach((song) => {
      trie.insert(song.title.toLowerCase(), song.wasmId);
      trie.insert(song.artist.toLowerCase(), song.wasmId);
    });

    setStructures({ playlistList, recentStack, upNextQueue, favoritesMap, trie, shuffle, sorter });
    setPlaylistIds(storedPlaylist);
    setFavoritesIds(storedFavorites);
    setRecentIds(storedRecent);
    // mark initialization complete so save effects don't overwrite migrated data
    initializingRef.current = false;
  }, [module, songs, songMap, userKey]);

  // Reset initialization flag when user changes so we rehydrate for the new user
  useEffect(() => {
    initializingRef.current = true;
  }, [userKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (initializingRef.current) return;
    try {
      window.localStorage.setItem(`${userKey}:playlistIds`, JSON.stringify(playlistIds));
      console.debug('[MusicContext] saved playlistIds', playlistIds.length, 'for', userKey);
    } catch (err) {
      console.error('Failed to save playlistIds to localStorage', err);
    }
  }, [playlistIds]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (initializingRef.current) return;
    try {
      window.localStorage.setItem(`${userKey}:favoriteIds`, JSON.stringify(favoritesIds));
      console.debug('[MusicContext] saved favoriteIds', favoritesIds.length, 'for', userKey);
    } catch (err) {
      console.error('Failed to save favoriteIds to localStorage', err);
    }
  }, [favoritesIds]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (initializingRef.current) return;
    try {
      window.localStorage.setItem(`${userKey}:recentIds`, JSON.stringify(recentIds));
      console.debug('[MusicContext] saved recentIds', recentIds.length, 'for', userKey);
    } catch (err) {
      console.error('Failed to save recentIds to localStorage', err);
    }
  }, [recentIds]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (initializingRef.current) return;
    try {
      // Avoid writing large in-memory data (blobs/object URLs) to localStorage.
      const serializable = userSongs.map((s) => {
        const copy = { ...s };
        if (copy.audioType === 'idb') {
          // audio will be stored in IndexedDB; don't serialize object URL
          copy.audio = null;
        }
        return copy;
      });
      window.localStorage.setItem(`${userKey}:userSongs`, JSON.stringify(serializable));
      console.debug('[MusicContext] saved userSongs', userSongs.length, 'for', userKey);
    } catch (err) {
      console.error('Failed to save userSongs to localStorage (possibly too large)', err);
    }
  }, [userSongs]);

  useEffect(() => {
    if (!structures || !searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const results = structures.trie.search(searchQuery.trim().toLowerCase()) || [];
    const uniqueResults = [...new Set(results)];
    setSearchResults(uniqueResults.map((id) => getSongIdByWasmId(id, songs)).filter(Boolean));
  }, [searchQuery, structures, songs]);

  const currentSong = useMemo(() => getSongById(currentSongId, songs, songMap) ?? songs[0], [currentSongId, songs, songMap]);

  const playSong = (songId) => {
    const resolvedId = normalizeSongId(songId) || songs[0].id;
    setCurrentSongId(resolvedId);
    setIsPlaying(true);
    if (!structures) return;
    const nextRecent = [resolvedId, ...recentIds.filter((id) => id !== resolvedId)].slice(0, 15);
    setRecentIds(nextRecent);
    structures.recentStack.push(getSongWasmId(resolvedId, songs, songMap));
    while (structures.recentStack.toArray().length > 15) {
      structures.recentStack.pop();
    }
  };

  const toggleFavorite = (songId) => {
    if (!structures) return;
    const resolvedId = normalizeSongId(songId);
    const wasmId = getSongWasmId(resolvedId, songs, songMap);
    if (structures.favoritesMap.has(wasmId)) {
      structures.favoritesMap.remove(wasmId);
      setFavoritesIds((prev) => prev.filter((favId) => favId !== resolvedId));
    } else {
      structures.favoritesMap.set(wasmId, 1);
      setFavoritesIds((prev) => (prev.includes(resolvedId) ? prev : [...prev, resolvedId]));
    }
  };

  const addToPlaylist = (songId) => {
    const resolvedId = normalizeSongId(songId);
    setPlaylistIds((prev) => {
      if (prev.includes(resolvedId)) {
        return prev;
      }
      return [...prev, resolvedId];
    });
    if (structures) {
      structures.playlistList.insertAtEnd(getSongWasmId(resolvedId, songs, songMap));
    }
  };

  const removeFromPlaylist = (songId) => {
    const resolvedId = normalizeSongId(songId);
    setPlaylistIds((prev) => prev.filter((id) => id !== resolvedId));
    if (structures) {
      structures.playlistList.removeById(getSongWasmId(resolvedId, songs, songMap));
    }
  };

  const movePlaylistSong = (songId, direction) => {
    if (!structures) return;
    const currentOrder = structures.playlistList.toArray();
    const index = currentOrder.indexOf(getSongWasmId(songId, songs, songMap));
    if (index === -1) return;
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= currentOrder.length) return;
    const nextOrder = [...currentOrder];
    const [moved] = nextOrder.splice(index, 1);
    nextOrder.splice(nextIndex, 0, moved);
    structures.playlistList = new module.DoublyLinkedList();
    nextOrder.forEach((id) => structures.playlistList.insertAtEnd(id));
    setPlaylistIds(toSongIdArray(nextOrder));
  };

  const queueSong = (songId) => {
    if (!structures) return;
    structures.upNextQueue.enqueue(getSongWasmId(songId, songs, songMap));
    setUpNextIds(toSongIdArray(structures.upNextQueue.toArray(), songs));
  };

  const playNextQueued = () => {
    if (!structures) return;
    if (structures.upNextQueue.isEmpty()) {
      return;
    }
    const nextWasmId = structures.upNextQueue.dequeue();
    setUpNextIds(toSongIdArray(structures.upNextQueue.toArray(), songs));
    playSong(getSongIdByWasmId(nextWasmId, songs));
  };

  const shufflePlaylist = () => {
    if (!structures) return;
    const wasmOrder = playlistIds.map((id) => getSongWasmId(id, songs, songMap));
    const shuffled = structures.shuffle.fisherYatesShuffle(wasmOrder);
    structures.playlistList = new module.DoublyLinkedList();
    shuffled.forEach((id) => structures.playlistList.insertAtEnd(id));
    setPlaylistIds(toSongIdArray(shuffled, songs));
    setShuffleEnabled((prev) => !prev);
  };

  const sortPlaylist = (mode) => {
    if (!structures) return;
    const ids = playlistIds.length ? playlistIds : songs.map((song) => song.id);
    const wasmIds = ids.map((id) => getSongWasmId(id, songs, songMap));
    let sortedWasmIds;
    if (mode === 'artist') {
      sortedWasmIds = structures.sorter.sortByArtist(wasmIds, wasmIds.map((id) => getSongById(getSongIdByWasmId(id, songs), songs, songMap)?.artist ?? ''));
    } else if (mode === 'duration') {
      sortedWasmIds = structures.sorter.sortByDuration(wasmIds, wasmIds.map((id) => getSongById(getSongIdByWasmId(id, songs), songs, songMap)?.duration ?? 0));
    } else {
      sortedWasmIds = structures.sorter.sortByTitle(wasmIds, wasmIds.map((id) => getSongById(getSongIdByWasmId(id, songs), songs, songMap)?.title ?? ''));
    }
    structures.playlistList = new module.DoublyLinkedList();
    sortedWasmIds.forEach((id) => structures.playlistList.insertAtEnd(id));
    setPlaylistIds(toSongIdArray(sortedWasmIds, songs));
    setSortMode(mode);
  };

  const addUserSong = (song) => {
    const normalizedTitle = String(song.title || '').trim();
    if (!normalizedTitle || !song.audio) return;

    const newSong = {
      id: createUserSongId(normalizedTitle),
      wasmId: Date.now(),
      title: normalizedTitle,
      artist: String(song.artist || 'Unknown').trim() || 'Unknown',
      album: String(song.album || '').trim(),
      genre: String(song.genre || '').trim(),
      cover: String(song.cover || '/images/default-cover.jpg').trim(),
      audio: String(song.audio).trim(),
      audioType: 'inline',
    };

    // If audio is a data URL, save blob to IndexedDB and mark as idb-backed
    (async () => {
      try {
        if (typeof newSong.audio === 'string' && newSong.audio.startsWith('data:')) {
          const resp = await fetch(newSong.audio);
          const blob = await resp.blob();
          await saveBlob(newSong.id, blob);
          newSong.audioType = 'idb';
          // Use an object URL for runtime playback
          newSong.audio = URL.createObjectURL(blob);
        }
      } catch (err) {
        console.error('Failed to persist audio blob to IndexedDB', err);
        // fall back to keeping the inline data URL (may fail on save)
      } finally {
        setUserSongs((prev) => [...prev, newSong]);
      }
    })();
  };

  const removeUserSong = async (songId) => {
    setUserSongs((prev) => prev.filter((s) => s.id !== songId));
    try {
      const s = userSongs.find((x) => x.id === songId);
      if (s?.audioType === 'idb') {
        await deleteBlob(songId);
      }
    } catch (err) {
      console.error('Failed to remove blob for', songId, err);
    }
  };

  const value = useMemo(() => ({
    songs,
    songMap,
    playlistIds,
    favoritesIds,
    recentIds,
    searchQuery,
    setSearchQuery,
    searchResults,
    currentSong,
    currentSongId,
    setCurrentSongId,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    repeatMode,
    setRepeatMode,
    shuffleEnabled,
    setShuffleEnabled,
    sortMode,
    setSortMode,
    playlistName,
    setPlaylistName,
    upNextIds,
    playSong,
    toggleFavorite,
    addToPlaylist,
    removeFromPlaylist,
    movePlaylistSong,
    queueSong,
    playNextQueued,
    shufflePlaylist,
    sortPlaylist,
    addUserSong,
    removeUserSong,
    loading,
    error,
  }), [playlistIds, favoritesIds, recentIds, searchQuery, searchResults, currentSong, currentSongId, isPlaying, volume, repeatMode, shuffleEnabled, sortMode, playlistName, upNextIds, loading, error, structures, songs, songMap]);

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic() {
  return useContext(MusicContext);
}
