import { FiArrowDown, FiArrowRight } from 'react-icons/fi';
import ExplanationCard from '../components/ExplanationCard';
import { postfixToInfix } from '../utils/postfixToInfix';

const DEFAULT_DEMO = postfixToInfix('ABC*+');

const RULES_P2I = [
  {
    title: 'Operand?',
    tone: 'bg-mint-soft',
    body: 'Push it. A single letter is already a valid mini-expression.',
  },
  {
    title: 'Operator?',
    tone: 'bg-grape-soft',
    body: 'POP #1 \u2192 RIGHT operand. POP #2 \u2192 LEFT operand.',
  },
  {
    title: 'Build',
    tone: 'bg-flamingo-soft',
    body: '( LEFT op RIGHT ) \u2014 wrap the pair in parentheses.',
  },
  {
    title: 'Push back',
    tone: 'bg-lemon-soft',
    body: 'The new sub-expression re-enters the stack as a single item.',
  },
];

export function PlainExplanation() {
  return (
    <ExplanationCard number="Explanation 01" title="Reading it back into brackets" tint="bg-sky">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
            In <b className="text-ink">postfix</b>, every operator sits <i>after</i> the two
            expressions it combines. Rebuilding infix means reading left &rarr; right and asking one
            question per symbol:{' '}
            <b className="text-ink">
              &ldquo;is this a lone operand &mdash; or the glue for the last two things I&apos;ve seen?&rdquo;
            </b>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
            Each operator wraps its two picked-up expressions in parentheses. That&apos;s why the
            output is <b className="text-ink">fully parenthesized</b> &mdash; the grouping that postfix
            encoded silently becomes explicit brackets.
          </p>

          <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-paper p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-ink-soft">
              Why full brackets? Safety.
            </p>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-ink-soft">
              <code className="font-mono">(A+(B*C))</code> and{' '}
              <code className="font-mono">A+B*C</code> mean the same thing. While rebuilding we don&apos;t
              track precedence context &mdash; so we bracket everything, guaranteeing correctness first;
              redundant brackets can be stripped later if you prefer it clean.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-ink-soft">ABC*+, decoded</p>
          <Stage label="Postfix input" expr="A B C * +" tint="bg-sky-soft" note="operators trail their operands" rotate="-rotate-1" />
          <Center><FiArrowDown className="text-coral" /></Center>
          <Stage label="First * marries B & C" expr="A (B*C) +" tint="bg-lemon-soft" note="the pair becomes ONE stack item" rotate="rotate-1" />
          <Center><FiArrowDown className="text-coral" /></Center>
          <Stage label="+ marries A & (B*C)" expr="(A+(B*C))" tint="bg-mint-soft" note="fully parenthesized infix" rotate="-rotate-1" />

          <div className="rounded-xl border border-dashed border-gray-300 bg-paper p-3 text-center font-mono text-sm font-bold">
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
    <ExplanationCard number="Explanation 02" title="Why pop order flips everything" tint="bg-grape">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {RULES_P2I.map((r, i) => (
          <div
            key={r.title}
            className={`rounded-xl border border-gray-100 p-4 ${r.tone} ${i % 2 ? 'rotate-[0.5deg]' : '-rotate-[0.5deg]'}`}
            style={{ boxShadow: 'var(--shadow-soft-sm)' }}
          >
            <p className="font-display text-sm">{r.title}</p>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-ink-soft">{r.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-7 grid gap-7 rounded-xl border border-gray-100 bg-cream p-5 sm:p-7 lg:grid-cols-[auto_1fr]" style={{ boxShadow: 'var(--shadow-soft-sm)' }}>
        <div>
          <span className="sticker inline-block -rotate-2 bg-coral text-white border-transparent">THE ORDER MATTERS</span>

          <div className="mt-5 flex w-fit flex-col-reverse items-center gap-2">
            {[
              { v: 'A', c: 'bg-white' },
              { v: 'B', c: 'bg-white' },
              { v: 'C', c: 'bg-coral text-white border-coral' },
            ].map((b, i) => (
              <span key={i} className={`tile w-24 px-4 py-2.5 text-lg ${b.c}`}>
                {b.v}
              </span>
            ))}
            <span className="mt-3 h-2 w-32 rounded-full bg-gray-300" />
          </div>
          <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
            stack &middot; then <b className="text-coral">*</b> arrives
          </p>
        </div>

        <ol className="space-y-3">
          <OrderStep n="POP #1" what="C" role="RIGHT operand" why="Pushed last &rarr; sits on top &rarr; comes off first." tone="border-coral bg-coral-soft" />
          <OrderStep n="POP #2" what="B" role="LEFT operand" why="It was waiting just below." tone="border-sky bg-sky-soft" />
          <li className="rounded-lg border-l-[3px] border-flamingo bg-flamingo-soft px-4 py-3">
            <p className="font-display text-sm">BUILD</p>
            <p className="mt-1 font-mono text-lg font-extrabold">( B * C )</p>
            <p className="mt-1 text-xs font-semibold text-ink-soft">
              LEFT + op + RIGHT. Never ( C * B ) &mdash; that&apos;s a different expression!
            </p>
          </li>
          <li className="rounded-lg border-l-[3px] border-mint bg-mint-soft px-4 py-3">
            <p className="font-display text-sm">PUSH BACK</p>
            <p className="mt-1 text-xs font-semibold text-ink-soft">
              The finished sub-expression becomes one stack item, ready to be someone else&apos;s
              LEFT or RIGHT.
            </p>
          </li>
        </ol>
      </div>

      <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.25em] text-ink-soft">
        Replay &mdash; {steps ? `your expression ${input ?? ''}` : 'example ABC*+'} &middot; every move
      </p>
      <ol className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {replay.map((s, i) => (
          <li key={i} className="panel-flat flex flex-col gap-2 p-3.5">
            <div className="flex items-center gap-2.5">
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-lg border font-mono font-extrabold ${
                  s.type === 'combine'
                    ? 'bg-flamingo text-white border-flamingo'
                    : s.type === 'pop-right'
                      ? 'bg-coral text-white border-coral'
                      : s.type === 'pop-left'
                        ? 'bg-sky text-white border-sky'
                        : 'bg-mint-soft border-mint/30'
                }`}
              >
                {s.symbol}
              </span>
              <span className="text-xs font-bold leading-tight">{s.action}</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-dashed border-gray-200 pt-2 font-mono text-[11px] font-bold">
              <span>
                stack: <b className="text-sky">[{s.stack.join(', ') || ' '}]</b>
              </span>
            </div>
          </li>
        ))}
      </ol>

      {!steps && (
        <p className="mt-6 border-t border-dashed border-gray-200 pt-4 text-xs font-semibold italic text-ink-soft">
          Run your own expression above and this replay rewires itself to show{' '}
          <b>your</b> steps{result ? ` (yours would end in ${result})` : ''}.
        </p>
      )}
    </ExplanationCard>
  );
}

function OrderStep({ n, what, role, why, tone }) {
  return (
    <li className={`flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border-l-[3px] px-4 py-3 ${tone}`}>
      <span className="sticker !px-1.5 !py-0 !text-[9px]">{n}</span>
      <code className="font-mono text-lg font-extrabold">{what}</code>
      <span className="chip !border-0 !bg-white !py-0 !text-[9px] !shadow-none">{role}</span>
      <p className="w-full text-xs font-semibold text-ink-soft">{why}</p>
    </li>
  );
}

function Stage({ label, expr, note, tint, rotate }) {
  return (
    <div className={`rounded-xl border border-gray-100 p-3 ${tint} ${rotate}`} style={{ boxShadow: 'var(--shadow-soft-xs)' }}>
      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-ink-soft">{label}</p>
      <code className="mt-1 block break-all font-mono text-xl font-extrabold">{expr}</code>
      <p className="mt-0.5 text-[11px] font-semibold italic text-ink-soft">{note}</p>
    </div>
  );
}

function Center({ children }) {
  return <div className="flex justify-center">{children}</div>;
}
