import { motion } from 'framer-motion';
import { FaHeart, FaPlay } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';

export default function FavoritesPage() {
  const { favoritesIds, songMap, playSong, toggleFavorite } = useMusic();
  const favoriteSongs = favoritesIds.map((id) => songMap[id]).filter(Boolean);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Favorites</h2>
          <p className="text-sm text-slate-400">Your most-loved tracks, tucked away for quick playback.</p>
        </div>
      </div>
      {favoriteSongs.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-black/20 px-6 py-14 text-center">
          <div className="mb-4 rounded-full bg-pink-500/10 p-4 text-pink-300">
            <FaHeart className="text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-white">Your favorites will appear here</h3>
          <p className="mt-2 max-w-md text-sm text-slate-400">Tap the heart on any track to keep a personal collection handy.</p>
          <Link to="/" className="mt-6 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2 text-sm font-medium text-white">Explore the library</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {favoriteSongs.map((song) => (
            <motion.article key={song.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30 shadow-[0_20px_45px_rgba(15,23,42,0.35)]">
              <img src={song.cover} alt={song.title} className="h-36 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-white">{song.title}</h3>
                <p className="text-sm text-slate-400">{song.artist}</p>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 px-3 py-2 text-sm font-medium text-white" onClick={() => playSong(song.id)}>
                    <span className="inline-flex items-center justify-center gap-2"><FaPlay /> Play</span>
                  </button>
                  <button className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-200" onClick={() => toggleFavorite(song.id)}>Remove</button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
