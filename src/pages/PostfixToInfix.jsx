import { useState } from 'react';
import ControlPanel from '../components/ControlPanel';
import ExpressionInput from '../components/ExpressionInput';
import ExpressionVisualizer from '../components/ExpressionVisualizer';
import OperationPanel from '../components/OperationPanel';
import PageHeader from '../components/PageHeader';
import ResultCard from '../components/ResultCard';
import StackVisualizer from '../components/StackVisualizer';
import StepTable from '../components/StepTable';
import { PlainExplanation, StackExplanation } from '../components/PostfixInfixExplanations';
import { usePlayer } from '../hooks/usePlayer';
import { postfixToInfix } from '../utils/postfixToInfix';
import { validatePostfix } from '../utils/expressionValidator';

const EXAMPLES = ['ABC*+', 'AB+C*', 'AB*C+', 'ABC+-', 'ABCDE^*-'];

const TABLE_COLUMNS = [
  { label: 'Step', accessor: (s) => s.step, mono: false },
  { label: 'Symbol', accessor: (s) => s.symbol },
  { label: 'Operation', accessor: (s) => s.action, mono: false },
  { label: 'Stack (bottom\u2192top)', accessor: (s) => s.stack.join(', ') },
];

export default function PostfixToInfix() {
  const [data, setData] = useState(null);
  const total = data?.steps?.length ?? 0;
  const player = usePlayer(total);

  const cur = data?.steps?.[Math.min(player.index, Math.max(total - 1, 0))];
  const finished = cur?.type === 'done';

  const handleVisualize = (raw) => {
    const verdict = validatePostfix(raw);
    if (!verdict.valid) {
      setData({ error: verdict.error });
      return;
    }
    const clean = raw.replace(/\s+/g, '').toUpperCase();
    const { result, steps } = postfixToInfix(clean);
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
            Postfix <span className="text-coral">\u2192</span>{' '}
            <span className="border-b-8 border-sky">Infix</span>
          </>
        }
        subtitle="A stack of growing strings. Operands land alone; operators marry the two most recent expressions \u2014 right one popped first!"
        algo="POSTFIX \u2192 INFIX"
        accent="bg-sky"
      />

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        <ExpressionInput
          label="Enter Postfix Expression"
          placeholder="e.g. ABC*+"
          examples={EXAMPLES}
          color="sky"
          onSubmit={handleVisualize}
          error={data?.error ?? null}
        />

        {cur && !data.error && (
          <div id="visualizer" className="scroll-mt-28 animate-pop-in space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="sticker -rotate-1 bg-coral text-white border-transparent">Step 02</span>
              <h2 className="heading-skew text-xl sm:text-2xl">Watch the strings merge</h2>
              <span className="chip ml-auto hidden sm:inline-flex">Stack holds partial expressions</span>
            </div>

            <ExpressionVisualizer expression={data.input} charIndex={cur.charIndex} done={finished} />

            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <StackVisualizer
                stack={cur.stack}
                event={cur.event}
                stepKey={player.index}
                hint="partial expressions pile up here"
              />
              <OperationPanel step={cur} accent="sky" />
            </div>

            <ControlPanel player={player} color="sky" />

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
                color="sky"
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
          <StackExplanation steps={data?.steps} input={data?.input} result={data?.result} />
        </div>
      </div>
    </div>
  );
}
