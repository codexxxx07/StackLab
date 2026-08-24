import { useEffect, useRef } from 'react';
import { FiCornerRightDown } from 'react-icons/fi';

const HEAD_TINTS = [
  'bg-orange-500 text-white',
  'bg-indigo-600 text-white',
  'bg-amber-500/10 text-amber-600',
  'bg-pink-500 text-white',
];

export default function StepTable({ steps, current, onRowClick, columns }) {
  const wrapRef = useRef(null);

  useEffect(() => {
    const row = wrapRef.current?.querySelector('[data-current="true"]');
    row?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [current]);

  return (
    <section className="card overflow-hidden dark:bg-bugbusters-card dark:border-[rgba(255,255,255,0.06)]" aria-label="Step table">
      <div className="flex items-center justify-between gap-2 border-b border-stone-900/5 bg-cream-dark px-4 py-3 sm:px-6 dark:border-[rgba(255,255,255,0.06)] dark:bg-[#050505]">
        <h3 className="heading-skew text-lg font-extrabold text-stone-900 sm:text-xl dark:text-white">Step-by-step Trace</h3>
        <span className="hidden items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-stone-500 sm:flex dark:text-gray-400">
          <FiCornerRightDown /> click a row to jump
        </span>
      </div>

      <div ref={wrapRef} className="max-h-105 overflow-auto">
        <table className="w-full min-w-140 border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={col.label}
                  className={`border-b border-stone-900/5 px-3 py-2.5 font-extrabold text-[11px] uppercase tracking-[0.15em] ${HEAD_TINTS[i % HEAD_TINTS.length]} ${
                    i < columns.length - 1 ? 'border-r border-stone-900/10 dark:border-white/10' : ''
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {steps.map((s, idx) => {
              const isCurrent = idx === current;
              const isPast = idx < current;
              return (
                <tr
                  key={idx}
                  data-current={isCurrent}
                  onClick={() => onRowClick(idx)}
                  className={`cursor-pointer border-b border-stone-900/5 transition-colors duration-100 dark:border-[rgba(255,255,255,0.04)]
                    ${isCurrent ? 'bg-amber-500/10 shadow-[inset_3px_0_0_0_#f43f5e] dark:bg-bugbusters-cyan/6' : ''}
                    ${!isCurrent && isPast ? 'bg-white hover:bg-indigo-600/5 dark:bg-transparent dark:hover:bg-[rgba(255,255,255,0.03)]' : ''}
                    ${!isCurrent && !isPast ? 'opacity-55 hover:opacity-100 hover:bg-cream dark:hover:bg-[#0a0a0a]' : ''}`}
                >
                  {columns.map((col, ci) => {
                    const raw = col.accessor(s);
                    const mono = col.mono ?? true;
                    return (
                      <td
                        key={ci}
                        className={`px-3 py-2.5 align-middle ${
                          isCurrent && ci === 0 ? 'pl-4 font-extrabold text-xs text-rose-500' : ''
                        } ${isCurrent ? 'font-bold' : ''} ${
                          mono ? 'font-mono text-[13px]' : 'font-semibold'
                        } text-stone-900 dark:text-white`}
                      >
                        {raw === '' || raw == null ? <span className="text-stone-300 dark:text-gray-600">&mdash;</span> : raw}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
