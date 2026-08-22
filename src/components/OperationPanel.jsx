import { FiCpu } from 'react-icons/fi';

const TONES = {
  good: { box: 'border-mint bg-mint-soft', dot: 'bg-mint' },
  info: { box: 'border-sky bg-sky-soft', dot: 'bg-sky' },
  warn: { box: 'border-lemon bg-lemon-soft', dot: 'bg-lemon' },
  hot: { box: 'border-coral bg-coral-soft', dot: 'bg-coral' },
  win: { box: 'border-flamingo bg-flamingo-soft', dot: 'bg-flamingo' },
  plain: { box: 'border-ink/20 bg-paper', dot: 'bg-ink/40' },
};

/**
 * The narrator. Explains the current step in plain language,
 * including the precedence duel when two operators face off.
 */
export default function OperationPanel({ step, accent = 'grape' }) {
  if (!step) return null;

  return (
    <section className="panel flex flex-col p-5 sm:p-6" aria-label="Current operation">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <span
            className={`grid size-9 place-items-center border-[3px] border-ink text-white shadow-pop-xs ${
              accent === 'sky' ? 'bg-coral' : 'bg-grape'
            }`}
          >
            <FiCpu />
          </span>
          <h3 className="heading-skew text-xl">Current Operation</h3>
        </span>
        <span className="chip bg-lemon">STEP {step.step}</span>
      </div>

      {/* Big symbol + action */}
      <div
        className={`mt-4 flex flex-wrap items-center gap-4 border-[3px] border-ink p-4 ${
          step.type === 'done' ? TONES.win.box : TONES.plain.box
        }`}
      >
        <span
          key={step.step}
          className={`tile animate-pop-in min-w-14 px-3 py-3 text-center font-display text-2xl ${
            accent === 'sky' ? 'bg-sky text-white' : 'bg-ink text-white'
          }`}
        >
          {step.symbol}
        </span>
        <p className="text-lg font-bold leading-snug sm:text-xl">{step.action}</p>
      </div>

      {/* Precedence duel */}
      {step.compare && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 border-[3px] border-dashed border-ink/30 bg-cream px-4 py-3">
          <DuelChip label={step.compare.current} score={step.compare.currentScore} tone="hot" />
          <span className="font-display text-xl">{step.compare.verdict}</span>
          <DuelChip label={step.compare.top} score={step.compare.topScore} tone="info" reversed />
          <span className="w-full text-center font-mono text-[11px] uppercase tracking-widest text-ink-soft">
            Priority lookup · ^ = 3, * / = 2, + - = 1
          </span>
        </div>
      )}

      {/* Built formula (postfix→infix) */}
      {step.built && (
        <div className="animate-pop-in mt-4 border-[3px] border-ink bg-flamingo-soft px-4 py-3 text-center shadow-pop-sm">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink-soft">
            New sub-expression →
          </span>
          <code className="ml-2 font-mono text-xl font-extrabold">{step.built}</code>
        </div>
      )}

      {/* Reasoning lines */}
      <ul className="mt-4 space-y-2">
        {(step.reason ?? []).map((r, i) => {
          const tone = TONES[r.tone] ?? TONES.plain;
          return (
            <li
              key={i}
              className={`flex items-start gap-2.5 border-l-4 px-3 py-2 text-sm font-semibold leading-relaxed ${tone.box}`}
            >
              <span className={`mt-1.5 size-2 shrink-0 rounded-full ${tone.dot}`} />
              <span>{r.text}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function DuelChip({ label, score, tone, reversed = false }) {
  const cls = TONES[tone].box;
  return (
    <span className={`flex items-center gap-2 border-[3px] border-ink px-3 py-1.5 shadow-pop-xs ${cls}`}>
      {!reversed && <b className="font-display text-lg">{label}</b>}
      <span className="chip !border-0 !bg-white !px-1.5 !py-0 !text-[10px] !shadow-none">
        P:{score}
      </span>
      {reversed && <b className="font-display text-lg">{label}</b>}
    </span>
  );
}
