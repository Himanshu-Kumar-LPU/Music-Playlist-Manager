import { motion } from 'framer-motion';
import { FaPlay, FaHistory } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';

export default function RecentPage() {
  const { recentIds, songMap, playSong } = useMusic();
  const recentSongs = recentIds.map((id) => songMap[id]).filter(Boolean);

  return (
    <div className="rounded-2xl sm:rounded-[2rem] border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-xl">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">Recently Played</h2>
          <p className="text-xs sm:text-sm text-slate-400">Pick up where you left off with your latest listening flow.</p>
        </div>
      </div>
      {recentSongs.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl sm:rounded-[2rem] border border-dashed border-white/10 bg-black/20 px-4 py-10 sm:px-6 sm:py-14 text-center">
          <div className="mb-4 rounded-full bg-cyan-500/10 p-3 sm:p-4 text-cyan-300">
            <FaHistory className="text-xl sm:text-2xl" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-white">No recent plays yet</h3>
          <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-400">Start listening and your latest tracks will show up here automatically.</p>
          <Link to="/" className="mt-6 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white">Jump into the library</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {recentSongs.map((song) => (
            <motion.article key={song.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-xl sm:rounded-[1.5rem] border border-white/10 bg-black/30 shadow-[0_20px_45px_rgba(15,23,42,0.35)]">
              <img src={song.cover} alt={song.title} className="h-28 w-full object-cover sm:h-32 md:h-36" />
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-white text-sm sm:text-base">{song.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400">{song.artist}</p>
                <button className="mt-3 sm:mt-4 w-full rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 px-2 py-2 sm:px-3 text-xs sm:text-sm font-medium text-white" onClick={() => playSong(song.id)}>
                  <span className="inline-flex items-center justify-center gap-1 sm:gap-2"><FaPlay /> Play again</span>
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
