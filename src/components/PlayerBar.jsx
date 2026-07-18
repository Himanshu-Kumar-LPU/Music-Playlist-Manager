import { useEffect, useRef, useState } from 'react';
import { FaPlay, FaPause, FaForward, FaBackward, FaVolumeUp, FaRandom, FaRedo } from 'react-icons/fa';
import { useMusic } from '../context/MusicContext';
import { songs } from '../data/songs';

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function PlayerBar() {
  const {
    currentSong,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    repeatMode,
    setRepeatMode,
    shuffleEnabled,
    setShuffleEnabled,
    playlistIds,
    playSong,
    playNextQueued,
    shufflePlaylist,
  } = useMusic();
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Refs to track current state for use in event handlers
  const repeatModeRef = useRef(repeatMode);
  const playlistIdsRef = useRef(playlistIds);
  const currentSongRef = useRef(currentSong);
  const playSongRef = useRef(playSong);
  const setIsPlayingRef = useRef(setIsPlaying);
  
  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);
  
  useEffect(() => {
    playlistIdsRef.current = playlistIds;
  }, [playlistIds]);
  
  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);
  
  useEffect(() => {
    playSongRef.current = playSong;
  }, [playSong]);
  
  useEffect(() => {
    setIsPlayingRef.current = setIsPlaying;
  }, [setIsPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const tick = () => setProgress(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);
    audio.addEventListener('timeupdate', tick);
    audio.addEventListener('loadedmetadata', onLoaded);
    return () => {
      audio.removeEventListener('timeupdate', tick);
      audio.removeEventListener('loadedmetadata', onLoaded);
    };
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleSongEnd = () => {
      const list = playlistIdsRef.current.length > 0 ? playlistIdsRef.current : songs.map((s) => s.id);
      const currentIndex = list.indexOf(currentSongRef.current?.id);

      if (repeatModeRef.current === 'one') {
        // Replay the same song
        audio.currentTime = 0;
        audio.play().catch(() => setIsPlayingRef.current(false));
      } else if (repeatModeRef.current === 'all') {
        // Move to next song, or loop back to first
        if (currentIndex < list.length - 1) {
          playSongRef.current(list[currentIndex + 1]);
        } else {
          playSongRef.current(list[0]);
        }
      } else {
        // repeatMode === 'off' - move to next song normally
        if (currentIndex < list.length - 1) {
          playSongRef.current(list[currentIndex + 1]);
        }
      }
    };

    audio.addEventListener('ended', handleSongEnd);
    return () => audio.removeEventListener('ended', handleSongEnd);
  }, []);

  const togglePlayback = () => setIsPlaying((prev) => !prev);
  
  const handleNext = () => {
    const list = playlistIds.length > 0 ? playlistIds : songs.map((s) => s.id);
    const nextIndex = list.indexOf(currentSong?.id) + 1;
    if (list[nextIndex]) playSong(list[nextIndex]);
  };
  
  const handlePrev = () => {
    const list = playlistIds.length > 0 ? playlistIds : songs.map((s) => s.id);
    const prevIndex = list.indexOf(currentSong?.id) - 1;
    if (list[prevIndex]) playSong(list[prevIndex]);
  };

  const cycleRepeat = () => {
    const modes = ['off', 'one', 'all'];
    const nextIndex = (modes.indexOf(repeatMode) + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  return (
    <div className="border-t border-white/10 bg-black/85 p-2 sm:p-4 backdrop-blur-xl\">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between\">
        <div className=\"flex items-center gap-2 sm:gap-3 min-w-0\">
          <img src={currentSong?.cover} alt={currentSong?.title} className=\"h-12 w-12 sm:h-14 sm:w-14 rounded-lg sm:rounded-xl object-cover shadow-lg shadow-black/40 flex-shrink-0\" />
          <div className=\"min-w-0\">
            <p className=\"font-semibold text-white text-sm sm:text-base truncate\">{currentSong?.title}</p>
            <p className=\"text-xs sm:text-sm text-slate-400 truncate\">{currentSong?.artist}</p>
          </div>
        </div>
        <div className=\"flex flex-1 flex-col gap-2 lg:max-w-2xl\">
          <div className=\"flex items-center justify-center gap-2 sm:gap-3\">
            <button className=\"rounded-full border border-white/10 bg-white/5 p-2 sm:p-2.5 text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-300\" onClick={handlePrev} aria-label=\"Previous\"><FaBackward className=\"text-xs sm:text-sm\" /></button>
            <button className=\"rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 p-3 sm:p-3.5 text-white shadow-lg shadow-cyan-500/20 transition hover:scale-105\" onClick={togglePlayback} aria-label=\"Play/Pause\">{isPlaying ? <FaPause className=\"text-sm sm:text-base\" /> : <FaPlay className=\"text-sm sm:text-base\" />}</button>
            <button className=\"rounded-full border border-white/10 bg-white/5 p-2 sm:p-2.5 text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-300\" onClick={handleNext} aria-label=\"Next\"><FaForward className=\"text-xs sm:text-sm\" /></button>
            <button className=\"hidden sm:flex rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-300\" onClick={playNextQueued}>Up next</button>
          </div>
          <div className=\"flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-400\">
            <span className=\"w-8 sm:w-10 text-right\">{formatTime(progress)}</span>
            <input type=\"range\" min=\"0\" max={duration || 100} value={progress} onChange={(event) => { setProgress(Number(event.target.value)); if (audioRef.current) audioRef.current.currentTime = Number(event.target.value); }} className=\"flex-1 accent-cyan-400 h-1 sm:h-1.5\" aria-label=\"Progress\" />
            <span className=\"w-8 sm:w-10\">{formatTime(duration || currentSong?.duration || 0)}</span>
          </div>
        </div>
        <div className=\"flex items-center justify-end gap-2 sm:gap-3\">
          <button className={`rounded-full border border-white/10 bg-white/5 p-2 sm:p-2.5 transition ${repeatMode !== 'off' ? 'text-cyan-400' : 'text-slate-200'}`} onClick={cycleRepeat} aria-label=\"Repeat\"><FaRedo className=\"text-xs sm:text-sm\" /></button>
          <button className={`rounded-full border border-white/10 bg-white/5 p-2 sm:p-2.5 transition ${shuffleEnabled ? 'text-cyan-400' : 'text-slate-200'}`} onClick={() => { setShuffleEnabled((prev) => !prev); shufflePlaylist(); }} aria-label=\"Shuffle\"><FaRandom className=\"text-xs sm:text-sm\" /></button>
          <div className=\"hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2\">
            <FaVolumeUp className=\"text-slate-300 text-xs sm:text-sm\" />
            <input type=\"range\" min=\"0\" max=\"1\" step=\"0.05\" value={volume} onChange={(event) => setVolume(Number(event.target.value))} className=\"w-12 accent-cyan-400 h-1 sm:h-1.5\" aria-label=\"Volume\" />
          </div>
        </div>
      </div>
      <audio ref={audioRef} src={currentSong?.audio} preload=\"metadata\" />
    </div>
  );
}
