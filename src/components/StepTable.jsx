import { useEffect, useRef } from 'react';
import { FiCornerRightDown } from 'react-icons/fi';

const HEAD_TINTS = ['bg-grape text-white', 'bg-sky text-white', 'bg-lemon', 'bg-flamingo text-white'];

/**
 * The step trace table. Click any row to jump to that moment.
 * The current row glows and auto-scrolls into view.
 */
export default function StepTable({ steps, current, onRowClick, columns }) {
  const wrapRef = useRef(null);

  useEffect(() => {
    const row = wrapRef.current?.querySelector('[data-current="true"]');
    row?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [current]);

  return (
    <section className="panel overflow-hidden" aria-label="Step table">
      <div className="flex items-center justify-between gap-2 border-b border-gray-100 bg-cream/60 px-4 py-3 sm:px-6">
        <h3 className="heading-skew text-lg sm:text-xl">Step-by-step Trace</h3>
        <span className="hidden items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-soft sm:flex">
          <FiCornerRightDown /> click a row to jump
        </span>
      </div>

      <div ref={wrapRef} className="max-h-[420px] overflow-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={col.label}
                  className={`border-b border-gray-200 px-3 py-2.5 font-display text-[11px] uppercase tracking-[0.15em] ${HEAD_TINTS[i % HEAD_TINTS.length]} ${
                    i < columns.length - 1 ? 'border-r border-gray-200/60' : ''
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
                  className={`cursor-pointer border-b border-gray-100 transition-colors duration-100
                    ${isCurrent ? 'bg-lemon-soft/60 shadow-[inset_3px_0_0_0_var(--color-coral)]' : ''}
                    ${!isCurrent && isPast ? 'bg-white hover:bg-sky-soft/30' : ''}
                    ${!isCurrent && !isPast ? 'opacity-55 hover:opacity-100 hover:bg-paper' : ''}`}
                >
                  {columns.map((col, ci) => {
                    const raw = col.accessor(s);
                    const mono = col.mono ?? true;
                    return (
                      <td
                        key={ci}
                        className={`px-3 py-2.5 align-middle ${
                          isCurrent && ci === 0 ? 'pl-4 font-display text-xs text-coral' : ''
                        } ${isCurrent ? 'font-bold' : ''} ${
                          mono ? 'font-mono text-[13px]' : 'font-semibold'
                        }`}
                      >
                        {raw === '' || raw == null ? <span className="text-ink/25">—</span> : raw}
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
