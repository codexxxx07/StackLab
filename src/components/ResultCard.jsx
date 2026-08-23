import { useState } from 'react';
import { FaCopy, FaRedo } from 'react-icons/fa';

export default function ResultCard({ input, result, color = 'orange', onAgain }) {
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
    orange: 'bg-orange-500/5 border-orange-500/20 dark:bg-orange-500/5 dark:border-orange-500/20',
    indigo: 'bg-indigo-600/5 border-indigo-600/20 dark:bg-indigo-600/5 dark:border-indigo-600/20',
    emerald: 'bg-emerald-500/5 border-emerald-500/20 dark:bg-emerald-500/5 dark:border-emerald-500/20',
    rose: 'bg-rose-500/5 border-rose-500/20 dark:bg-rose-500/5 dark:border-rose-500/20',
  };

  const accentMap = {
    orange: 'text-orange-500',
    indigo: 'text-indigo-600',
    emerald: 'text-emerald-500',
    rose: 'text-rose-500',
  };

  return (
    <div className={`card rounded-2xl border ${bgMap[color] || bgMap.orange} p-6`}>
      <h3 className="mb-4 font-extrabold text-sm uppercase tracking-wider text-stone-500 dark:text-gray-400">
        Final Result
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-stone-900/5 bg-white p-4 dark:border-white/10 dark:bg-[#0a0a0a]" style={{ boxShadow: '0 1px 2px rgb(28 25 23 / 0.05)' }}>
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-gray-500">
            Input
          </span>
          <span className="font-mono text-xl font-bold tracking-wider text-stone-900 dark:text-white">{input}</span>
        </div>
        <div className="rounded-2xl border border-stone-900/5 bg-white p-4 dark:border-white/10 dark:bg-[#0a0a0a]" style={{ boxShadow: '0 1px 2px rgb(28 25 23 / 0.05), 0 4px 12px -2px rgb(28 25 23 / 0.08)' }}>
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-gray-500">
            Output
          </span>
          <span className={`font-mono text-xl font-bold tracking-wider ${accentMap[color] || 'text-orange-500'}`}>{result}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={handleCopy} className="btn border border-stone-900/5 bg-white dark:border-white/10 dark:bg-bugbusters-card dark:text-white">
          <FaCopy size={14} />
          {copied ? 'Copied!' : 'Copy Result'}
        </button>
        {onAgain && (
          <button onClick={onAgain} className="btn border border-stone-900/5 bg-white dark:border-white/10 dark:bg-bugbusters-card dark:text-white">
            <FaRedo size={14} />
            Visualize Again
          </button>
        )}
      </div>
    </div>
  );
}
