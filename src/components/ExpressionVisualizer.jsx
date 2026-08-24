import { FiArrowDown, FiCheck } from 'react-icons/fi';
import {
  isCloseParen,
  isOpenParen,
  isOperandChar,
  isOperatorChar,
} from '../utils/visualizationSteps';

const charStyle = (c) => {
  if (isOperandChar(c)) return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500';
  if (isOperatorChar(c)) return 'bg-orange-500/10 border-orange-500/30 text-orange-500';
  if (isOpenParen(c) || isCloseParen(c)) return 'bg-amber-500/10 border-amber-500/30 text-amber-600';
  return 'bg-white border-stone-900/5 dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.06)] dark:text-white';
};

export default function ExpressionVisualizer({ expression, charIndex = -1, done = false, output = null }) {
  if (!expression) return null;

  return (
    <section className="card p-5 sm:p-6 dark:bg-bugbusters-card dark:border-[rgba(255,255,255,0.06)]" aria-label="Input stream">
      <div className="flex items-center justify-between gap-2">
        <span className="sticker bg-stone-900 text-white border-transparent dark:bg-white dark:text-stone-900">Input Stream</span>
        {done && <span className="chip border-emerald-500/30! bg-emerald-500/10 text-emerald-500">All read ✓</span>}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-x-2.5 gap-y-8 px-1 py-2 sm:gap-x-3">
        {[...expression].map((c, i) => {
          const isCurrent = i === charIndex;
          const isPast = i < charIndex;

          return (
            <div key={i} className="relative flex flex-col items-center">
              {/* Reading arrow */}
              <span
                className={`absolute -top-7 flex flex-col items-center transition-opacity duration-200 ${
                  isCurrent ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <span className="rounded-full px-2! py-0.5! text-[9px]! bg-rose-500 text-white animate-arrow-drop border-transparent sticker">
                  READ
                </span>
                <FiArrowDown className="text-rose-500" strokeWidth={3} />
              </span>

              <span
                className={`tile size-10 text-xl sm:size-12 sm:text-2xl ${charStyle(c)} transition-all duration-200 ${
                  isCurrent
                    ? 'z-10 scale-115 border-rose-500 ring-4 ring-rose-500/20'
                    : ''
                } ${
                  isPast || done
                    ? 'opacity-35 saturate-50'
                    : ''
                }`}
              >
                {c}
              </span>

              {/* Consumed tick */}
              {(isPast || done) && (
                <FiCheck className="absolute -bottom-5 size-4 text-emerald-500" strokeWidth={3.5} />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-2 border-t border-dashed border-stone-900/10 pt-4 dark:border-white/10">
        <span className="chip border-emerald-500/20! shadow-none! bg-emerald-500/10 text-emerald-500">Operand</span>
        <span className="chip border-orange-500/20! shadow-none! bg-orange-500/10 text-orange-500">Operator</span>
        <span className="chip border-amber-500/20! shadow-none! bg-amber-500/10 text-amber-600">Parenthesis</span>
      </div>

      {/* Output tape */}
      {output !== null && (
        <div className="mt-5 rounded-2xl border border-dashed border-pink-500/40 bg-pink-500/5 p-4 dark:border-pink-500/30 dark:bg-pink-500/5">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500 dark:text-gray-400">
            Output Tape &mdash; Postfix being built
          </p>
          <div className="mt-3 flex min-h-12 flex-wrap items-center justify-center gap-2">
            {output.length === 0 && (
              <span className="font-mono text-sm text-stone-300 dark:text-gray-600">empty…</span>
            )}
            {[...output].map((ch, i) => (
              <span
                key={`${i}-${ch}`}
                className="tile animate-pop-in size-9 bg-white text-lg dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.06)] dark:text-white"
              >
                {ch}
              </span>
            ))}
            <span className="ml-1 inline-block h-7 w-2 animate-blink bg-stone-900 dark:bg-white" aria-hidden />
          </div>
        </div>
      )}
    </section>
  );
}
