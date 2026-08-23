import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRedo } from 'react-icons/fa';
import { SPEEDS, SPEED_LABELS } from '../hooks/usePlayer';

export default function ControlPanel({ player, color = 'grape' }) {
  const { index, playing, speedPos, setSpeedPos, toggle, next, prev, reset } = player;

  const btnColor = {
    grape: 'bg-grape text-white',
    sky: 'bg-sky text-white',
    mint: 'bg-mint text-white',
    coral: 'bg-coral text-white',
  };

  return (
    <div className="panel-flat p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-xs uppercase tracking-wider text-ink-soft">Controls</h3>
        <span className="chip bg-lemon-soft text-ink border-lemon/30">
          {SPEED_LABELS[speedPos - 1]}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={reset} className="btn border border-gray-200 bg-white px-3 py-2" title="Reset">
          <FaRedo size={14} />
        </button>
        <button onClick={prev} className="btn border border-gray-200 bg-white px-3 py-2" title="Previous step">
          <FaStepBackward size={14} />
        </button>
        <button
          onClick={toggle}
          className={`btn px-5 py-2.5 text-white ${btnColor[color] || btnColor.grape}`}
        >
          {playing ? <FaPause size={16} /> : <FaPlay size={16} />}
          <span className="text-xs">{playing ? 'Pause' : 'Play'}</span>
        </button>
        <button onClick={next} className="btn border border-gray-200 bg-white px-3 py-2" title="Next step">
          <FaStepForward size={14} />
        </button>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-ink-soft">
          <span>Slow</span>
          <span>Fast</span>
        </div>
        <input
          type="range"
          min={1}
          max={5}
          value={speedPos}
          onChange={(e) => setSpeedPos(Number(e.target.value))}
          className="mt-1 w-full accent-grape"
        />
      </div>
    </div>
  );
}
