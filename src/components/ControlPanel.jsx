import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRedo } from 'react-icons/fa';
import { SPEEDS, SPEED_LABELS } from '../hooks/usePlayer';

export default function ControlPanel({ player, color = 'orange', total }) {
  const { index, playing, speedPos, setSpeedPos, toggle, next, prev, reset } = player;

  const btnColor = {
    orange: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-glow',
    indigo: 'bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-glow-indigo',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white',
    rose: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white',
  };

  return (
    <div className="panel-flat p-4 dark:bg-[#0f172a] dark:border-[rgba(255,255,255,0.06)]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-stone-500 dark:text-gray-400">Controls</h3>
        <span className="chip bg-amber-500/10 text-amber-600 border-amber-500/30">
          {SPEED_LABELS[speedPos - 1]}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={reset} className="btn border border-stone-900/5 bg-white px-3 py-2 dark:border-[rgba(255,255,255,0.06)] dark:bg-[#0f172a] dark:text-white dark:hover:border-[rgba(255,255,255,0.12)]" title="Reset">
          <FaRedo size={14} />
        </button>
        <button onClick={prev} className="btn border border-stone-900/5 bg-white px-3 py-2 dark:border-[rgba(255,255,255,0.06)] dark:bg-[#0f172a] dark:text-white dark:hover:border-[rgba(255,255,255,0.12)]" title="Previous step">
          <FaStepBackward size={14} />
        </button>
        <button
          onClick={toggle}
          className={`btn px-5 py-2.5 text-white ${btnColor[color] || btnColor.orange}`}
        >
          {playing ? <FaPause size={16} /> : <FaPlay size={16} />}
          <span className="text-xs">{playing ? 'Pause' : 'Play'}</span>
        </button>
        <button onClick={next} className="btn border border-stone-900/5 bg-white px-3 py-2 dark:border-[rgba(255,255,255,0.06)] dark:bg-[#0f172a] dark:text-white dark:hover:border-[rgba(255,255,255,0.12)]" title="Next step">
          <FaStepForward size={14} />
        </button>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-gray-500">
          <span>Slow</span>
          <span>Fast</span>
        </div>
        <input
          type="range"
          min={1}
          max={5}
          value={speedPos}
          onChange={(e) => setSpeedPos(Number(e.target.value))}
          className="mt-1 w-full accent-orange-500 dark:accent-cyan-400"
        />
      </div>

      {/* Progress indicator */}
      <div className="mt-3 flex items-center justify-between">
        <div className="h-1.5 flex-1 rounded-full bg-stone-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 dark:from-cyan-400 dark:to-bugbusters-blue"
            style={{ width: `${total > 0 ? (index / (total - 1)) * 100 : 0}%` }}
          />
        </div>
        <span className="ml-3 font-mono text-[11px] font-bold text-stone-500 dark:text-gray-400">
          {index + 1} / {total}
        </span>
      </div>
    </div>
  );
}
