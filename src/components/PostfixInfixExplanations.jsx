import { FiArrowDown, FiArrowRight } from 'react-icons/fi';
import ExplanationCard from '../components/ExplanationCard';
import { postfixToInfix } from '../utils/postfixToInfix';

const DEFAULT_DEMO = postfixToInfix('ABC*+');

const RULES_P2I = [
  {
    title: 'Operand?',
    tone: 'bg-emerald-500/10',
    body: 'Push it. A single letter is already a valid mini-expression.',
  },
  {
    title: 'Operator?',
    tone: 'bg-orange-500/10',
    body: 'POP #1 \u2192 RIGHT operand. POP #2 \u2192 LEFT operand.',
  },
  {
    title: 'Build',
    tone: 'bg-pink-500/10',
    body: '( LEFT op RIGHT ) \u2014 wrap the pair in parentheses.',
  },
  {
    title: 'Push back',
    tone: 'bg-amber-500/10',
    body: 'The new sub-expression re-enters the stack as a single item.',
  },
];

export function PlainExplanation() {
  return (
    <ExplanationCard number="Explanation 01" title="Reading it back into brackets" tint="bg-indigo-600">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-sm leading-relaxed text-stone-600 sm:text-base dark:text-bugbusters-soft">
            In <b className="text-stone-900 dark:text-white">postfix</b>, every operator sits <i>after</i> the two
            expressions it combines. Rebuilding infix means reading left &rarr; right and asking one
            question per symbol:{' '}
            <b className="text-stone-900 dark:text-white">
              &ldquo;is this a lone operand &mdash; or the glue for the last two things I&apos;ve seen?&rdquo;
            </b>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-stone-600 sm:text-base dark:text-bugbusters-soft">
            Each operator wraps its two picked-up expressions in parentheses. That&apos;s why the
            output is <b className="text-stone-900 dark:text-white">fully parenthesized</b> &mdash; the grouping that postfix
            encoded silently becomes explicit brackets.
          </p>

          <div className="mt-6 rounded-2xl border border-dashed border-stone-900/10 bg-cream p-4 dark:border-white/10 dark:bg-[#0a0a0a]">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500 dark:text-gray-400">
              Why full brackets? Safety.
            </p>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-stone-600 dark:text-bugbusters-soft">
              <code className="font-mono text-stone-900 dark:text-white">(A+(B*C))</code> and{' '}
              <code className="font-mono text-stone-900 dark:text-white">A+B*C</code> mean the same thing. While rebuilding we don&apos;t
              track precedence context &mdash; so we bracket everything, guaranteeing correctness first;
              redundant brackets can be stripped later if you prefer it clean.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500 dark:text-gray-400">ABC*+, decoded</p>
          <Stage label="Postfix input" expr="A B C * +" tint="bg-indigo-600/5" note="operators trail their operands" rotate="-rotate-1" />
          <Center><FiArrowDown className="text-rose-500" /></Center>
          <Stage label="First * marries B & C" expr="A (B*C) +" tint="bg-amber-500/10" note="the pair becomes ONE stack item" rotate="rotate-1" />
          <Center><FiArrowDown className="text-rose-500" /></Center>
          <Stage label="+ marries A & (B*C)" expr="(A+(B*C))" tint="bg-emerald-500/10" note="fully parenthesized infix" rotate="-rotate-1" />

          <div className="rounded-2xl border border-dashed border-stone-900/10 bg-cream p-3 text-center font-mono text-sm font-bold text-stone-900 dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white">
            AB+C* <FiArrowRight className="inline" /> ((A+B)*C)
          </div>
        </div>
      </div>
    </ExplanationCard>
  );
}

export function StackExplanation({ steps, input, result }) {
  const source = steps && steps.length > 2 ? steps : DEFAULT_DEMO.steps;
  const replay = source.filter((s) => !['init', 'done'].includes(s.type));

  return (
    <ExplanationCard number="Explanation 02" title="Why pop order flips everything" tint="bg-orange-500">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {RULES_P2I.map((r, i) => (
          <div
            key={r.title}
            className={`rounded-2xl border border-stone-900/5 p-4 ${r.tone} ${i % 2 ? 'rotate-[0.5deg]' : '-rotate-[0.5deg]'} dark:border-white/10`}
            style={{ boxShadow: '0 1px 2px rgb(28 25 23 / 0.05), 0 4px 12px -2px rgb(28 25 23 / 0.08)' }}
          >
            <p className="font-extrabold text-sm text-stone-900 dark:text-white">{r.title}</p>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-stone-600 dark:text-bugbusters-soft">{r.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-7 grid gap-7 rounded-2xl border border-stone-900/5 bg-cream p-5 sm:p-7 lg:grid-cols-[auto_1fr] dark:border-white/10 dark:bg-[#0a0a0a]" style={{ boxShadow: '0 1px 2px rgb(28 25 23 / 0.05), 0 4px 12px -2px rgb(28 25 23 / 0.08)' }}>
        <div>
          <span className="sticker inline-block -rotate-2 bg-rose-500 text-white border-transparent">THE ORDER MATTERS</span>

          <div className="mt-5 flex w-fit flex-col-reverse items-center gap-2">
            {[
              { v: 'A', c: 'bg-white border-stone-900/5 dark:bg-white/5 dark:border-white/10' },
              { v: 'B', c: 'bg-white border-stone-900/5 dark:bg-white/5 dark:border-white/10' },
              { v: 'C', c: 'bg-rose-500 text-white border-rose-500' },
            ].map((b, i) => (
              <span key={i} className={`tile w-24 px-4 py-2.5 text-lg ${b.c}`}>
                {b.v}
              </span>
            ))}
            <span className="mt-3 h-2 w-32 rounded-full bg-stone-300 dark:bg-gray-700" />
          </div>
          <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500 dark:text-gray-400">
            stack &middot; then <b className="text-rose-500">*</b> arrives
          </p>
        </div>

        <ol className="space-y-3">
          <OrderStep n="POP #1" what="C" role="RIGHT operand" why="Pushed last → sits on top → comes off first." tone="border-rose-500 bg-rose-500/10" />
          <OrderStep n="POP #2" what="B" role="LEFT operand" why="It was waiting just below." tone="border-indigo-600 bg-indigo-600/10" />
          <li className="rounded-xl border-l-[3px] border-pink-500 bg-pink-500/10 px-4 py-3">
            <p className="font-extrabold text-sm text-stone-900 dark:text-white">BUILD</p>
            <p className="mt-1 font-mono text-lg font-extrabold text-stone-900 dark:text-white">( B * C )</p>
            <p className="mt-1 text-xs font-semibold text-stone-600 dark:text-bugbusters-soft">
              LEFT + op + RIGHT. Never ( C * B ) &mdash; that&apos;s a different expression!
            </p>
          </li>
          <li className="rounded-xl border-l-[3px] border-emerald-500 bg-emerald-500/10 px-4 py-3">
            <p className="font-extrabold text-sm text-stone-900 dark:text-white">PUSH BACK</p>
            <p className="mt-1 text-xs font-semibold text-stone-600 dark:text-bugbusters-soft">
              The finished sub-expression becomes one stack item, ready to be someone else&apos;s
              LEFT or RIGHT.
            </p>
          </li>
        </ol>
      </div>

      <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500 dark:text-gray-400">
        Replay &mdash; {steps ? `your expression ${input ?? ''}` : 'example ABC*+'} &middot; every move
      </p>
      <ol className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {replay.map((s, i) => (
          <li key={i} className="panel-flat flex flex-col gap-2 p-3.5 dark:bg-bugbusters-card dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-xl border font-mono font-extrabold ${
                  s.type === 'combine'
                    ? 'bg-pink-500 text-white border-pink-500'
                    : s.type === 'pop-right'
                      ? 'bg-rose-500 text-white border-rose-500'
                      : s.type === 'pop-left'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                }`}
              >
                {s.symbol}
              </span>
              <span className="text-xs font-bold leading-tight text-stone-700 dark:text-gray-300">{s.action}</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-dashed border-stone-900/10 pt-2 font-mono text-[11px] font-bold dark:border-white/10">
              <span className="text-stone-500 dark:text-gray-400">
                stack: <b className="text-indigo-600">[{s.stack.join(', ') || ' '}]</b>
              </span>
            </div>
          </li>
        ))}
      </ol>

      {!steps && (
        <p className="mt-6 border-t border-dashed border-stone-900/10 pt-4 text-xs font-semibold italic text-stone-500 dark:border-white/10 dark:text-gray-400">
          Run your own expression above and this replay rewires itself to show{' '}
          <b className="text-stone-900 dark:text-white">your</b> steps{result ? ` (yours would end in ${result})` : ''}.
        </p>
      )}
    </ExplanationCard>
  );
}

function OrderStep({ n, what, role, why, tone }) {
  return (
    <li className={`flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border-l-[3px] px-4 py-3 ${tone}`}>
      <span className="sticker !px-1.5 !py-0 !text-[9px]">{n}</span>
      <code className="font-mono text-lg font-extrabold text-stone-900 dark:text-white">{what}</code>
      <span className="chip !border-0 !bg-white !py-0 !text-[9px] !shadow-none dark:!bg-white/10 dark:!text-white">{role}</span>
      <p className="w-full text-xs font-semibold text-stone-600 dark:text-bugbusters-soft">{why}</p>
    </li>
  );
}

function Stage({ label, expr, note, tint, rotate }) {
  return (
    <div className={`rounded-2xl border border-stone-900/5 p-3 ${tint} ${rotate} dark:border-white/10`} style={{ boxShadow: '0 1px 2px rgb(28 25 23 / 0.05)' }}>
      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-stone-500 dark:text-gray-400">{label}</p>
      <code className="mt-1 block break-all font-mono text-xl font-extrabold text-stone-900 dark:text-white">{expr}</code>
      <p className="mt-0.5 text-[11px] font-semibold italic text-stone-500 dark:text-gray-400">{note}</p>
    </div>
  );
}

function Center({ children }) {
  return <div className="flex justify-center">{children}</div>;
}
