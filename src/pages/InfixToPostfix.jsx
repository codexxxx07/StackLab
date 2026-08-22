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

/** Used by the static walkthrough before the user runs anything. */
const DEFAULT_DEMO = infixToPostfix('A+B*C');

const TABLE_COLUMNS = [
  { label: 'Step', accessor: (s) => s.step, mono: false },
  { label: 'Symbol', accessor: (s) => s.symbol },
  { label: 'Action', accessor: (s) => s.action, mono: false },
  { label: 'Stack (bottom→top)', accessor: (s) => s.stack.join(' ') },
  { label: 'Output', accessor: (s) => s.output },
];

export default function InfixToPostfix() {
  const [data, setData] = useState(null); // { input, steps, result } | { error }
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
            Infix <span className="text-coral">→</span>{' '}
            <span className="border-b-8 border-grape">Postfix</span>
          </>
        }
        subtitle="Operators get impatient — the stack decides who prints first. Scan left to right and watch precedence do the sorting."
        algo="INFIX → POSTFIX"
        accent="bg-grape"
      />

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        {/* INPUT */}
        <ExpressionInput
          label="Enter Infix Expression"
          placeholder="e.g. A+B*C"
          examples={EXAMPLES}
          color="grape"
          onSubmit={handleVisualize}
          error={data?.error ?? null}
        />

        {/* VISUALIZER */}
        {cur && !data.error && (
          <div id="visualizer" className="scroll-mt-28 animate-pop-in space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="sticker -rotate-1 bg-coral text-white">Step 02</span>
              <h2 className="heading-skew text-xl sm:text-2xl">Watch the algorithm run</h2>
              <span className="chip ml-auto hidden sm:inline-flex">Input · Stack · Output stay in sync</span>
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
              <OperationPanel step={cur} accent="grape" />
            </div>

            <ControlPanel
              index={player.index}
              total={total}
              playing={player.playing}
              speedPos={player.speedPos}
              speedLabel={player.speedLabel}
              onToggle={player.toggle}
              onPrev={player.prev}
              onNext={player.next}
              onReset={player.reset}
              onSpeed={player.setSpeedPos}
              disabled={false}
            />

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

        {/* EXPLANATIONS */}
        <div className="space-y-8 pt-6">
          <PlainExplanation />
          <StackExplanation steps={data?.steps} />
        </div>
      </div>
    </div>
  );
}

/* =================== EXPLANATION 1 — plain idea =================== */

function PlainExplanation() {
  return (
    <ExplanationCard number="Explanation 01" title="The plain-English idea" tint="bg-grape">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
            <b className="text-ink">Infix</b> writes operators <i>between</i> operands — it&apos;s what
            humans like to read. But a computer evaluating <code className="font-mono font-bold">A+B*C</code>{' '}
            must constantly ask: “which operation comes first?”.{' '}
            <b className="text-ink">Postfix</b> removes that question forever: the operator appears{' '}
            <i>after</i> its operands, so no parentheses and no precedence rules are needed at run time.
          </p>

          {/* Precedence ladder */}
          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.25em] text-ink-soft">
            The pecking order
          </p>
          <div className="mt-3 space-y-2">
            {[
              { ops: '^', p: 3, w: 'w-full', c: 'bg-coral text-white' },
              { ops: '*  /', p: 2, w: 'w-3/4', c: 'bg-lemon' },
              { ops: '+  -', p: 1, w: 'w-1/2', c: 'bg-sky text-white' },
            ].map((r) => (
              <div key={r.ops} className={`flex items-center gap-3`}>
                <code className={`tile w-24 justify-center px-3 py-2 text-base ${r.c}`}>{r.ops}</code>
                <div className={`h-5 border-[3px] border-ink ${r.w} ${r.c.split(' ')[0]}`} />
                <span className="font-mono text-xs font-bold text-ink-soft">P:{r.p}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs font-semibold text-ink-soft">
            Higher priority = applied first. Equal priority = left one first.
          </p>
        </div>

        {/* Transformation chain */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-ink-soft">
            Same expression, three outfits
          </p>
          <Stage label="What you wrote" expr="A + B * C" tint="bg-sky-soft" note="ambiguous without rules" rotate="-rotate-1" />
          <Center><FiArrowDown className="text-coral" /></Center>
          <Stage label="Brackets force clarity" expr="A + (B * C)" tint="bg-lemon-soft" note="B*C is one unit" rotate="rotate-1" />
          <Center><FiArrowDown className="text-coral" /></Center>
          <Stage label="Drop the brackets" expr="A B C * +" tint="bg-mint-soft" note="order alone encodes grouping" rotate="-rotate-1" />

          <div className="border-[3px] border-dashed border-ink/30 bg-paper p-3 text-center font-mono text-sm font-bold">
            (A+B)*C <FiArrowRight className="inline" /> A B + C *
          </div>
        </div>
      </div>
    </ExplanationCard>
  );
}

function Stage({ label, expr, note, tint, rotate }) {
  return (
    <div className={`border-[3px] border-ink p-3 shadow-pop-sm ${tint} ${rotate}`}>
      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-ink-soft">{label}</p>
      <code className="mt-1 block break-all font-mono text-xl font-extrabold">{expr}</code>
      <p className="mt-0.5 text-[11px] font-semibold italic text-ink-soft">{note}</p>
    </div>
  );
}

function Center({ children }) {
  return <div className="flex justify-center">{children}</div>;
}

/* =================== EXPLANATION 2 — stack mechanics =================== */

const RULES = [
  { title: 'Operand?', tone: 'bg-mint-soft', body: 'Straight to the OUTPUT. Operands never touch the stack.' },
  { title: 'Operator?', tone: 'bg-grape-soft', body: 'Pop every stacked operator with priority ≥ yours, then push yourself.' },
  { title: '( ?', tone: 'bg-lemon-soft', body: 'Push it as a floor. Nothing underneath may leave until its ) arrives.' },
  { title: ' ) ?', tone: 'bg-coral-soft', body: 'Pop everything back to the ( — print each one — discard both brackets.' },
];

function StackExplanation({ steps }) {
  const source = steps && steps.length > 2 ? steps : DEFAULT_DEMO.steps;
  const replay = source.filter((s) => !['init', 'done'].includes(s.type));

  return (
    <ExplanationCard number="Explanation 02" title="How the stack actually does it" tint="bg-sky">
      {/* Rules grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {RULES.map((r, i) => (
          <div key={r.title} className={`border-[3px] border-ink p-4 shadow-pop-sm ${r.tone} ${i % 2 ? 'rotate-[0.5deg]' : '-rotate-[0.5deg]'}`}>
            <p className="font-display text-sm">{r.title}</p>
            <p className="mt-2 text-xs leading-relaxed font-semibold text-ink-soft">{r.body}</p>
          </div>
        ))}
      </div>

      {/* Endgame note */}
      <div className="mt-6 flex flex-col items-start gap-3 border-[3px] border-dashed border-ink/40 bg-paper p-4 sm:flex-row sm:items-center">
        <span className="sticker -rotate-2 bg-flamingo text-white shrink-0">ENDGAME</span>
        <p className="text-sm font-semibold leading-relaxed">
          Input finished? Flush the stack: pop every leftover operator straight to the output. When
          the stack hits empty, the output <b>is</b> your postfix expression.
        </p>
      </div>

      {/* Dynamic replay */}
      <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.25em] text-ink-soft">
        Replay — {steps ? 'your expression' : 'example A+B*C'} · every move
      </p>
      <ol className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {replay.map((s, i) => (
          <li key={i} className="panel-flat flex flex-col gap-2 p-3.5">
            <div className="flex items-center gap-2.5">
              <span className={`grid size-9 shrink-0 place-items-center border-[3px] border-ink font-mono font-extrabold ${
                s.symbol === 'END' ? 'bg-coral text-white' : /[A-Z]/.test(s.symbol) && s.symbol.length === 1 && !'+-*/^'.includes(s.symbol) ? 'bg-mint-soft' : s.symbol.includes('(') || s.symbol === ')' ? 'bg-lemon-soft' : 'bg-grape-soft'
              }`}>
                {s.symbol}
              </span>
              <span className="text-xs font-bold leading-tight">{s.action}</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 border-t-2 border-dashed border-ink/15 pt-2 font-mono text-[11px] font-bold">
              <span>
                stack: <b className="text-sky">[{s.stack.join(' ') || ' '}]</b>
              </span>
              <span>
                out: <b className="text-flamingo">{s.output}</b>
              </span>
            </div>
          </li>
        ))}
      </ol>
    </ExplanationCard>
  );
}
