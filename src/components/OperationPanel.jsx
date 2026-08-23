import { FiCpu } from 'react-icons/fi';

const TONES = {
  good: { box: 'bg-emerald-500/10 border-emerald-500/30', dot: 'bg-emerald-500' },
  info: { box: 'bg-indigo-600/10 border-indigo-600/30', dot: 'bg-indigo-600' },
  warn: { box: 'bg-amber-500/10 border-amber-500/30', dot: 'bg-amber-500' },
  hot: { box: 'bg-rose-500/10 border-rose-500/30', dot: 'bg-rose-500' },
  win: { box: 'bg-pink-500/10 border-pink-500/30', dot: 'bg-pink-500' },
  plain: { box: 'bg-cream border-stone-900/5 dark:bg-[#0a0a0a] dark:border-white/10', dot: 'bg-stone-400 dark:bg-gray-500' },
};

export default function OperationPanel({ step, accent = 'orange' }) {
  if (!step) return null;

  return (
    <section className="card flex flex-col p-5 sm:p-6 dark:bg-bugbusters-card dark:border-white/10" aria-label="Current operation">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <span
            className={`grid size-9 place-items-center rounded-2xl text-white ${
              accent === 'indigo' ? 'bg-gradient-to-br from-rose-500 to-pink-500' : 'bg-gradient-to-br from-orange-500 to-amber-500'
            }`}
            style={{ boxShadow: accent === 'indigo' ? '0 8px 24px rgba(244,63,94,0.2)' : '0 8px 24px rgba(249,115,22,0.2)' }}
          >
            <FiCpu />
          </span>
          <h3 className="heading-skew text-xl font-extrabold text-stone-900 dark:text-white">Current Operation</h3>
        </span>
        <span className="chip bg-amber-500/10 text-amber-600 border-amber-500/30">STEP {step.step}</span>
      </div>

      {/* Big symbol + action */}
      <div
        className={`mt-4 flex flex-wrap items-center gap-4 rounded-2xl border p-4 ${
          step.type === 'done' ? TONES.win.box : TONES.plain.box
        }`}
      >
        <span
          key={step.step}
          className={`tile animate-pop-in min-w-14 px-3 py-3 text-center font-extrabold text-2xl ${
            accent === 'indigo' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-stone-900 text-white border-stone-900 dark:bg-white dark:text-stone-900 dark:border-white'
          }`}
        >
          {step.symbol}
        </span>
        <p className="text-lg font-bold leading-snug sm:text-xl text-stone-900 dark:text-white">{step.action}</p>
      </div>

      {/* Precedence duel */}
      {step.compare && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-dashed border-stone-900/10 bg-cream px-4 py-3 dark:border-white/10 dark:bg-[#0a0a0a]">
          <DuelChip label={step.compare.current} score={step.compare.currentScore} tone="hot" />
          <span className="font-extrabold text-xl text-stone-900 dark:text-white">{step.compare.verdict}</span>
          <DuelChip label={step.compare.top} score={step.compare.topScore} tone="info" reversed />
          <span className="w-full text-center font-mono text-[11px] uppercase tracking-widest text-stone-500 dark:text-gray-400">
            Priority lookup &middot; ^ = 3, * / = 2, + - = 1
          </span>
        </div>
      )}

      {/* Built formula (postfix→infix) */}
      {step.built && (
        <div className="animate-pop-in mt-4 rounded-2xl border border-pink-500/30 bg-pink-500/10 px-4 py-3 text-center" style={{ boxShadow: '0 1px 2px rgb(28 25 23 / 0.05), 0 4px 12px -2px rgb(28 25 23 / 0.08)' }}>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-500 dark:text-gray-400">
            New sub-expression →
          </span>
          <code className="ml-2 font-mono text-xl font-extrabold text-stone-900 dark:text-white">{step.built}</code>
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
              <span className="text-stone-700 dark:text-gray-300">{r.text}</span>
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
    <span className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 ${cls}`} style={{ boxShadow: '0 1px 2px rgb(28 25 23 / 0.05)' }}>
      {!reversed && <b className="font-extrabold text-lg text-stone-900 dark:text-white">{label}</b>}
      <span className="chip !border-0 !bg-white !px-1.5 !py-0 !text-[10px] !shadow-none dark:!bg-white/10 dark:!text-white">
        P:{score}
      </span>
      {reversed && <b className="font-extrabold text-lg text-stone-900 dark:text-white">{label}</b>}
    </span>
  );
}
