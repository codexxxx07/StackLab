import { FiCpu } from 'react-icons/fi';

const TONES = {
  good: { box: 'bg-mint-soft border-mint/30', dot: 'bg-mint' },
  info: { box: 'bg-sky-soft border-sky/30', dot: 'bg-sky' },
  warn: { box: 'bg-lemon-soft border-lemon/30', dot: 'bg-lemon' },
  hot: { box: 'bg-coral-soft border-coral/30', dot: 'bg-coral' },
  win: { box: 'bg-flamingo-soft border-flamingo/30', dot: 'bg-flamingo' },
  plain: { box: 'bg-paper border-gray-200', dot: 'bg-ink/40' },
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
            className={`grid size-9 place-items-center rounded-xl text-white ${
              accent === 'sky' ? 'bg-coral' : 'bg-grape'
            }`}
            style={{ boxShadow: accent === 'sky' ? 'var(--shadow-glow-coral)' : 'var(--shadow-glow-grape)' }}
          >
            <FiCpu />
          </span>
          <h3 className="heading-skew text-xl">Current Operation</h3>
        </span>
        <span className="chip bg-lemon-soft border-lemon/30">STEP {step.step}</span>
      </div>

      {/* Big symbol + action */}
      <div
        className={`mt-4 flex flex-wrap items-center gap-4 rounded-xl border p-4 ${
          step.type === 'done' ? TONES.win.box : TONES.plain.box
        }`}
      >
        <span
          key={step.step}
          className={`tile animate-pop-in min-w-14 px-3 py-3 text-center font-display text-2xl ${
            accent === 'sky' ? 'bg-sky text-white border-sky' : 'bg-ink text-white border-ink'
          }`}
        >
          {step.symbol}
        </span>
        <p className="text-lg font-bold leading-snug sm:text-xl">{step.action}</p>
      </div>

      {/* Precedence duel */}
      {step.compare && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 bg-cream px-4 py-3">
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
        <div className="animate-pop-in mt-4 rounded-xl border border-flamingo/30 bg-flamingo-soft px-4 py-3 text-center" style={{ boxShadow: 'var(--shadow-soft-sm)' }}>
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
              className={`flex items-start gap-2.5 rounded-r-lg border-l-[3px] px-3 py-2 text-sm font-semibold leading-relaxed ${tone.box}`}
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
    <span className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 ${cls}`} style={{ boxShadow: 'var(--shadow-soft-xs)' }}>
      {!reversed && <b className="font-display text-lg">{label}</b>}
      <span className="chip !border-0 !bg-white !px-1.5 !py-0 !text-[10px] !shadow-none">
        P:{score}
      </span>
      {reversed && <b className="font-display text-lg">{label}</b>}
    </span>
  );
}
