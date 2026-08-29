import { useState } from 'react';
import ExpressionInput from '../components/ExpressionInput';
import PageHeader from '../components/PageHeader';
import TwoMethodExplanation from '../components/TwoMethodExplanation';
import { infixToPrefix } from '../utils/infixToPrefix';
import {
  infixToPrefixNormalSteps,
  infixToPrefixStackRows,
} from '../utils/explanations';
import {
  infixToPrefixNormalLiveSteps,
  infixToPrefixStackLiveSteps,
  infixToPrefixIntroSteps,
  infixToPrefixStackIntroSteps,
} from '../utils/liveExplanationSteps';
import { validateInfix } from '../utils/expressionValidator';

const EXAMPLES = ['A+B', 'A+B*C', '(A+B)*C', 'A*(B+C)', 'A^B^C'];

export default function InfixToPrefix() {
  const [data, setData] = useState(null);

  const handleVisualize = (raw) => {
    const verdict = validateInfix(raw);
    if (!verdict.valid) {
      setData({ error: verdict.error });
      return;
    }
    const clean = raw.replace(/\s+/g, '').toUpperCase();
    const { result, steps } = infixToPrefix(clean);
    const normalData = infixToPrefixNormalSteps(clean);
    const stackRows = infixToPrefixStackRows(steps);
    const liveNormalSteps = infixToPrefixNormalLiveSteps(clean);
    const liveStackSteps = infixToPrefixStackLiveSteps(clean);
    const introNormalSteps = infixToPrefixIntroSteps(clean);
    const introStackSteps = infixToPrefixStackIntroSteps();

    setData({
      input: clean,
      result,
      steps,
      normalSteps: normalData.steps,
      normalFinal: normalData.finalResult,
      stackRows,
      liveNormalSteps,
      liveStackSteps,
      introNormalSteps,
      introStackSteps,
    });

    setTimeout(
      () =>
        document
          .getElementById('result')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      60
    );
  };

  return (
    <div>
      <PageHeader
        title={
          <>
            Infix <span className="text-rose-500">to</span>{' '}
            <span className="border-b-8 border-emerald-500">Prefix</span>
          </>
        }
        subtitle="Operators leap in front of their operands. Reverse the expression, let the stack sort bargains of precedence, then flip the result back."
        algo="INFIX -> PREFIX"
        accent="bg-emerald-500"
      />

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        <ExpressionInput
          label="Enter Infix Expression"
          placeholder="Enter an infix expression..."
          examples={EXAMPLES}
          color="emerald"
          onSubmit={handleVisualize}
          error={data?.error ?? null}
        />

        {data && !data.error && (
          <div
            id="result"
            className="scroll-mt-28 animate-pop-in"
          >
            <TwoMethodExplanation
              input={data.input}
              finalAnswer={data.result}
              accent="emerald"
              liveSteps1={data.liveNormalSteps}
              liveSteps2={data.liveStackSteps}
              introSteps1={data.introNormalSteps}
              introSteps2={data.introStackSteps}
              method1={{
                title: 'Normal Method',
                subtitle: 'Without Using Stack',
                steps: data.normalSteps,
                finalResult: data.normalFinal,
                note: 'Expression is transformed by moving each operator in front of its operands, highest precedence first.',
              }}
              method2={{
                title: 'Stack Method',
                subtitle: 'Using Stack',
                columns: [
                  { label: 'Expression', accessorKey: 'expression' },
                  { label: 'Stack', accessorKey: 'stack' },
                  { label: 'Prefix', accessorKey: 'prefix' },
                ],
                rows: data.stackRows,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}