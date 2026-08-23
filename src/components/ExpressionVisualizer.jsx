import { FiArrowDown, FiCheck } from 'react-icons/fi';
import {
  isCloseParen,
  isOpenParen,
  isOperandChar,
  isOperatorChar,
} from '../utils/visualizationSteps';

const charStyle = (c) => {
  if (isOperandChar(c)) return 'bg-mint-soft border-mint/30';
  if (isOperatorChar(c)) return 'bg-grape-soft border-grape/30';
  if (isOpenParen(c) || isCloseParen(c)) return 'bg-lemon-soft border-lemon/30';
  return 'bg-white';
};

/**
 * The input stream: every character of the expression as a tile.
 * Highlights the character currently being processed and dims
 * everything already consumed. Optionally shows the output tape below.
 */
export default function ExpressionVisualizer({ expression, charIndex = -1, done = false, output = null }) {
  if (!expression) return null;

  return (
    <section className="panel p-5 sm:p-6" aria-label="Input stream">
      <div className="flex items-center justify-between gap-2">
        <span className="sticker bg-ink text-white border-transparent">Input Stream</span>
        {done && <span className="chip !border-mint/30 bg-mint-soft">All read ✓</span>}
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
                <span className="rounded-full !px-2 !py-0.5 !text-[9px] bg-coral text-white animate-arrow-drop border-transparent sticker">
                  READ
                </span>
                <FiArrowDown className="text-coral" strokeWidth={3} />
              </span>

              <span
                className={`tile size-10 text-xl sm:size-12 sm:text-2xl ${charStyle(c)} ${
                  isCurrent
                    ? 'z-10 scale-115 border-coral ring-4 ring-coral/20'
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
                <FiCheck className="absolute -bottom-5 size-4 text-mint" strokeWidth={3.5} />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-2 border-t border-dashed border-gray-200 pt-4">
        <span className="chip !border-mint/20 !shadow-none bg-mint-soft">Operand</span>
        <span className="chip !border-grape/20 !shadow-none bg-grape-soft">Operator</span>
        <span className="chip !border-lemon/20 !shadow-none bg-lemon-soft">Parenthesis</span>
      </div>

      {/* Output tape */}
      {output !== null && (
        <div className="mt-5 rounded-xl border border-dashed border-flamingo/40 bg-flamingo-soft/40 p-4">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.25em] text-ink-soft">
            Output Tape — Postfix being built
          </p>
          <div className="mt-3 flex min-h-12 flex-wrap items-center justify-center gap-2">
            {output.length === 0 && (
              <span className="font-mono text-sm text-ink/30">empty…</span>
            )}
            {[...output].map((ch, i) => (
              <span
                key={`${i}-${ch}`}
                className="tile animate-pop-in size-9 bg-white text-lg"
              >
                {ch}
              </span>
            ))}
            <span className="ml-1 inline-block h-7 w-2 animate-blink bg-ink" aria-hidden />
          </div>
        </div>
      )}
    </section>
  );
}
