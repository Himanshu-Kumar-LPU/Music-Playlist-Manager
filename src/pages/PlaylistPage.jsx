import { motion } from 'framer-motion';
import { FaPlay, FaTrash, FaMusic } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';

export default function PlaylistPage() {
  const { playlistIds, songMap, playSong, removeFromPlaylist } = useMusic();
  const playlistSongs = playlistIds.map((id) => songMap[id]).filter(Boolean);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">My Playlist</h2>
          <p className="text-xs sm:text-sm text-slate-400">{playlistSongs.length} track{playlistSongs.length !== 1 ? 's' : ''} in your custom mix</p>
        </div>
      </div>
      {playlistSongs.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-black/20 px-6 py-14 text-center">
          <div className="mb-4 rounded-full bg-purple-500/10 p-4 text-purple-300">
            <FaMusic className="text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-white">Your playlist is empty</h3>
          <p className="mt-2 max-w-md text-sm text-slate-400">Click the + button on any track in the Song Library to add it to your custom playlist.</p>
          <Link to="/" className="mt-6 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2 text-sm font-medium text-white">
            Start building your mix
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {playlistSongs.map((song) => (
            <motion.article
              key={song.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-xl sm:rounded-[1.5rem] border border-white/10 bg-black/30 shadow-[0_20px_45px_rgba(15,23,42,0.35)]"
            >
              <img src={song.cover} alt={song.title} className="h-28 w-full object-cover sm:h-32 md:h-36" />
              <div className="p-4">
                <h3 className="font-semibold text-white">{song.title}</h3>
                <p className="text-sm text-slate-400">{song.artist}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    className="flex-1 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 px-3 py-2 text-sm font-medium text-white"
                    onClick={() => playSong(song.id)}
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      <FaPlay /> Play
                    </span>
                  </button>
                  <button
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-red-400/40 hover:text-red-300"
                    onClick={() => removeFromPlaylist(song.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
