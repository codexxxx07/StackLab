import { useState } from 'react';
import { FaCopy, FaRedo } from 'react-icons/fa';

export default function ResultCard({ input, result, color = 'grape', onReset }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = result;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const bgMap = {
    grape: 'bg-grape-soft border-grape/20',
    sky: 'bg-sky-soft border-sky/20',
    mint: 'bg-mint-soft border-mint/20',
    coral: 'bg-coral-soft border-coral/20',
  };

  const accentMap = {
    grape: 'text-grape',
    sky: 'text-sky',
    mint: 'text-mint',
    coral: 'text-coral',
  };

  return (
    <div className={`panel rounded-2xl border ${bgMap[color] || bgMap.grape} p-6`}>
      <h3 className="mb-4 font-display text-sm uppercase tracking-wider text-ink-soft">
        Final Result
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-4" style={{ boxShadow: 'var(--shadow-soft-xs)' }}>
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-ink-soft">
            Input
          </span>
          <span className="font-mono text-xl font-bold tracking-wider">{input}</span>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4" style={{ boxShadow: 'var(--shadow-soft-sm)' }}>
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-ink-soft">
            Output
          </span>
          <span className={`font-mono text-xl font-bold tracking-wider ${accentMap[color] || 'text-grape'}`}>{result}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={handleCopy} className="btn border border-gray-200 bg-white">
          <FaCopy size={14} />
          {copied ? 'Copied!' : 'Copy Result'}
        </button>
        {onReset && (
          <button onClick={onReset} className="btn border border-gray-200 bg-white">
            <FaRedo size={14} />
            Visualize Again
          </button>
        )}
      </div>
    </div>
  );
}
