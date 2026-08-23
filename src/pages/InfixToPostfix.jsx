import { useState } from 'react';
import { FiArrowDown, FiArrowRight } from 'react-icons/fi';
import ControlPanel from '../components/ControlPanel';
import ExplanationCard from '../components/ExplanationCard';
import ExpressionInput from '../components/ExpressionInput';
import ExpressionVisualizer from '../components/ExpressionVisualizer';
import OperationPanel from '../components/OperationPanel';
import PageHeader from '../components/PageHeader';
import ResultCard from '../components/ResultCard';
import StackVisualizer from '../components/StackVisualizer';
import StepTable from '../components/StepTable';
import { usePlayer } from '../hooks/usePlayer';
import { infixToPostfix } from '../utils/infixToPostfix';
import { validateInfix } from '../utils/expressionValidator';

const EXAMPLES = ['A+B*C', '(A+B)*C', 'A*B+C/D', 'A^B^C', 'A+(B*C-(D/E)^F)*G'];

const DEFAULT_DEMO = infixToPostfix('A+B*C');

const TABLE_COLUMNS = [
  { label: 'Step', accessor: (s) => s.step, mono: false },
  { label: 'Symbol', accessor: (s) => s.symbol },
  { label: 'Action', accessor: (s) => s.action, mono: false },
  { label: 'Stack (bottom\u2192top)', accessor: (s) => s.stack.join(' ') },
  { label: 'Output', accessor: (s) => s.output },
];

export default function InfixToPostfix() {
  const [data, setData] = useState(null);
  const total = data?.steps?.length ?? 0;
  const player = usePlayer(total);

  const cur = data?.steps?.[Math.min(player.index, Math.max(total - 1, 0))];
  const finished = cur?.type === 'done';

  const handleVisualize = (raw) => {
    const verdict = validateInfix(raw);
    if (!verdict.valid) {
      setData({ error: verdict.error });
      return;
    }
    const clean = raw.replace(/\s+/g, '').toUpperCase();
    const { result, steps } = infixToPostfix(clean);
    setData({ input: clean, steps, result });
    player.reset();
    setTimeout(
      () => document.getElementById('visualizer')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      60
    );
  };

  return (
    <div>
      <PageHeader
        title={
          <>
            Infix <span className="text-rose-500">\u2192</span>{' '}
            <span className="border-b-8 border-orange-500">Postfix</span>
          </>
        }
        subtitle="Operators get impatient \u2014 the stack decides who prints first. Scan left to right and watch precedence do the sorting."
        algo="INFIX \u2192 POSTFIX"
        accent="bg-orange-500"
      />

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        <ExpressionInput
          label="Enter Infix Expression"
          placeholder="e.g. A+B*C"
          examples={EXAMPLES}
          color="orange"
          onSubmit={handleVisualize}
          error={data?.error ?? null}
        />

        {cur && !data.error && (
          <div id="visualizer" className="scroll-mt-28 animate-pop-in space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="section-eyebrow -rotate-1">
                <span className="inline-block size-1.5 rounded-full bg-rose-500" />
                Step 02
              </span>
              <h2 className="heading-skew text-xl font-extrabold text-stone-900 sm:text-2xl dark:text-white">Watch the algorithm run</h2>
              <span className="chip ml-auto hidden sm:inline-flex">Input &middot; Stack &middot; Output stay in sync</span>
            </div>

            <ExpressionVisualizer
              expression={data.input}
              charIndex={cur.charIndex}
              done={finished}
              output={cur.output ?? ''}
            />

            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <StackVisualizer
                stack={cur.stack}
                event={cur.event}
                stepKey={player.index}
                hint="operators wait here"
              />
              <OperationPanel step={cur} accent="orange" />
            </div>

            <ControlPanel player={player} color="orange" total={total} />

            <StepTable
              steps={data.steps}
              current={player.index}
              onRowClick={player.goTo}
              columns={TABLE_COLUMNS}
            />

            {finished && (
              <ResultCard
                input={data.input}
                result={data.result}
                onAgain={() => {
                  player.reset();
                  document.getElementById('input')?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            )}
          </div>
        )}

        <div className="space-y-8 pt-6">
          <PlainExplanation />
          <StackExplanation steps={data?.steps} />
        </div>
      </div>
    </div>
  );
}

/* =================== EXPLANATION 1 =================== */

function PlainExplanation() {
  return (
    <ExplanationCard number="Explanation 01" title="The plain-English idea" tint="bg-orange-500">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-sm leading-relaxed text-stone-600 sm:text-base dark:text-bugbusters-soft">
            <b className="text-stone-900 dark:text-white">Infix</b> writes operators <i>between</i> operands &mdash; it&apos;s what
            humans like to read. But a computer evaluating <code className="font-mono font-bold text-stone-900 dark:text-white">A+B*C</code>{' '}
            must constantly ask: &ldquo;which operation comes first?&rdquo;.{' '}
            <b className="text-stone-900 dark:text-white">Postfix</b> removes that question forever: the operator appears{' '}
            <i>after</i> its operands, so no parentheses and no precedence rules are needed at run time.
          </p>

          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500 dark:text-gray-400">
            The pecking order
          </p>
          <div className="mt-3 space-y-2">
            {[
              { ops: '^', p: 3, w: 'w-full', c: 'bg-rose-500 text-white border-rose-500' },
              { ops: '*  /', p: 2, w: 'w-3/4', c: 'bg-amber-500/10 border-amber-500/30 text-amber-600' },
              { ops: '+  -', p: 1, w: 'w-1/2', c: 'bg-indigo-600 text-white border-indigo-600' },
            ].map((r) => (
              <div key={r.ops} className="flex items-center gap-3">
                <code className={`tile w-24 justify-center px-3 py-2 text-base ${r.c}`}>{r.ops}</code>
                <div className={`h-5 rounded-full ${r.w} ${r.c.split(' ')[0]}`} />
                <span className="font-mono text-xs font-bold text-stone-500 dark:text-gray-400">P:{r.p}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs font-semibold text-stone-500 dark:text-gray-400">
            Higher priority = applied first. Equal priority = left one first.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500 dark:text-gray-400">
            Same expression, three outfits
          </p>
          <Stage label="What you wrote" expr="A + B * C" tint="bg-indigo-600/5" note="ambiguous without rules" rotate="-rotate-1" />
          <Center><FiArrowDown className="text-rose-500" /></Center>
          <Stage label="Brackets force clarity" expr="A + (B * C)" tint="bg-amber-500/10" note="B*C is one unit" rotate="rotate-1" />
          <Center><FiArrowDown className="text-rose-500" /></Center>
          <Stage label="Drop the brackets" expr="A B C * +" tint="bg-emerald-500/10" note="order alone encodes grouping" rotate="-rotate-1" />

          <div className="rounded-2xl border border-dashed border-stone-900/10 bg-cream p-3 text-center font-mono text-sm font-bold text-stone-900 dark:border-[rgba(255,255,255,0.06)] dark:bg-[#0a0a0a] dark:text-white">
            (A+B)*C <FiArrowRight className="inline" /> A B + C *
          </div>
        </div>
      </div>
    </ExplanationCard>
  );
}

function Stage({ label, expr, note, tint, rotate }) {
  return (
    <div className={`rounded-2xl border border-stone-900/5 p-3 ${tint} ${rotate} dark:border-[rgba(255,255,255,0.06)]`} style={{ boxShadow: '0 1px 2px rgb(28 25 23 / 0.05)' }}>
      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-stone-500 dark:text-gray-400">{label}</p>
      <code className="mt-1 block break-all font-mono text-xl font-extrabold text-stone-900 dark:text-white">{expr}</code>
      <p className="mt-0.5 text-[11px] font-semibold italic text-stone-500 dark:text-gray-400">{note}</p>
    </div>
  );
}

function Center({ children }) {
  return <div className="flex justify-center">{children}</div>;
}

/* =================== EXPLANATION 2 =================== */

const RULES = [
  { title: 'Operand?', tone: 'bg-emerald-500/10', body: 'Straight to the OUTPUT. Operands never touch the stack.' },
  { title: 'Operator?', tone: 'bg-orange-500/10', body: 'Pop every stacked operator with priority \u2265 yours, then push yourself.' },
  { title: '( ?', tone: 'bg-amber-500/10', body: 'Push it as a floor. Nothing underneath may leave until its ) arrives.' },
  { title: ' ) ?', tone: 'bg-rose-500/10', body: 'Pop everything back to the ( \u2014 print each one \u2014 discard both brackets.' },
];

function StackExplanation({ steps }) {
  const source = steps && steps.length > 2 ? steps : DEFAULT_DEMO.steps;
  const replay = source.filter((s) => !['init', 'done'].includes(s.type));

  return (
    <ExplanationCard number="Explanation 02" title="How the stack actually does it" tint="bg-indigo-600">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {RULES.map((r, i) => (
          <div key={r.title} className={`rounded-2xl border border-stone-900/5 p-4 ${r.tone} ${i % 2 ? 'rotate-[0.5deg]' : '-rotate-[0.5deg]'} dark:border-[rgba(255,255,255,0.06)]`} style={{ boxShadow: '0 1px 2px rgb(28 25 23 / 0.05), 0 4px 12px -2px rgb(28 25 23 / 0.08)' }}>
            <p className="font-extrabold text-sm text-stone-900 dark:text-white">{r.title}</p>
            <p className="mt-2 text-xs leading-relaxed font-semibold text-stone-600 dark:text-bugbusters-soft">{r.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-dashed border-stone-900/10 bg-cream p-4 sm:flex-row sm:items-center dark:border-[rgba(255,255,255,0.06)] dark:bg-[#0a0a0a]">
        <span className="sticker -rotate-2 bg-pink-500 text-white border-transparent shrink-0">ENDGAME</span>
        <p className="text-sm font-semibold leading-relaxed text-stone-700 dark:text-gray-300">
          Input finished? Flush the stack: pop every leftover operator straight to the output. When
          the stack hits empty, the output <b className="text-stone-900 dark:text-white">is</b> your postfix expression.
        </p>
      </div>

      <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500 dark:text-gray-400">
        Replay &mdash; {steps ? 'your expression' : 'example A+B*C'} &middot; every move
      </p>
      <ol className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {replay.map((s, i) => (
          <li key={i} className="panel-flat flex flex-col gap-2 p-3.5 dark:bg-[#0f172a] dark:border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-2.5">
              <span className={`grid size-9 shrink-0 place-items-center rounded-xl border font-mono font-extrabold ${
                s.symbol === 'END' ? 'bg-rose-500 text-white border-rose-500' : /[A-Z]/.test(s.symbol) && s.symbol.length === 1 && !'+-*/^'.includes(s.symbol) ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : s.symbol.includes('(') || s.symbol === ')' ? 'bg-amber-500/10 border-amber-500/30 text-amber-600' : 'bg-orange-500/10 border-orange-500/30 text-orange-500'
              }`}>
                {s.symbol}
              </span>
              <span className="text-xs font-bold leading-tight text-stone-700 dark:text-gray-300">{s.action}</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-dashed border-stone-900/10 pt-2 font-mono text-[11px] font-bold dark:border-white/10">
              <span className="text-stone-500 dark:text-gray-400">
                stack: <b className="text-indigo-600">[{s.stack.join(' ') || ' '}]</b>
              </span>
              <span className="text-stone-500 dark:text-gray-400">
                out: <b className="text-pink-500">{s.output}</b>
              </span>
            </div>
          </li>
        ))}
      </ol>
    </ExplanationCard>
  );
}
