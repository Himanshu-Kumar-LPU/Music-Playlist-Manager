import { motion } from 'framer-motion';
import { FaPlay, FaHistory } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';

export default function RecentPage() {
  const { recentIds, songMap, playSong } = useMusic();
  const recentSongs = recentIds.map((id) => songMap[id]).filter(Boolean);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Recently Played</h2>
          <p className="text-sm text-slate-400">Pick up where you left off with your latest listening flow.</p>
        </div>
      </div>
      {recentSongs.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-black/20 px-6 py-14 text-center">
          <div className="mb-4 rounded-full bg-cyan-500/10 p-4 text-cyan-300">
            <FaHistory className="text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-white">No recent plays yet</h3>
          <p className="mt-2 max-w-md text-sm text-slate-400">Start listening and your latest tracks will show up here automatically.</p>
          <Link to="/" className="mt-6 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2 text-sm font-medium text-white">Jump into the library</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recentSongs.map((song) => (
            <motion.article key={song.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30 shadow-[0_20px_45px_rgba(15,23,42,0.35)]">
              <img src={song.cover} alt={song.title} className="h-36 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-white">{song.title}</h3>
                <p className="text-sm text-slate-400">{song.artist}</p>
                <button className="mt-4 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 px-3 py-2 text-sm font-medium text-white" onClick={() => playSong(song.id)}>
                  <span className="inline-flex items-center gap-2"><FaPlay /> Play again</span>
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
