import { useState } from 'react';
import ExpressionInput from '../components/ExpressionInput';
import PageHeader from '../components/PageHeader';
import TwoMethodExplanation from '../components/TwoMethodExplanation';
import { prefixToInfix } from '../utils/prefixToInfix';
import {
  prefixToInfixNormalSteps,
  prefixToInfixStackRows,
} from '../utils/explanations';
import {
  prefixToInfixNormalLiveSteps,
  prefixToInfixStackLiveSteps,
  prefixToInfixIntroSteps,
  prefixToInfixStackIntroSteps,
} from '../utils/liveExplanationSteps';
import { validatePrefix } from '../utils/expressionValidator';

const EXAMPLES = ['+AB', '+A*BC', '*+ABC', '*A+BC', '^^ABC'];

export default function PrefixToInfix() {
  const [data, setData] = useState(null);

  const handleVisualize = (raw) => {
    const verdict = validatePrefix(raw);
    if (!verdict.valid) {
      setData({ error: verdict.error });
      return;
    }
    const clean = raw.replace(/\s+/g, '').toUpperCase();
    const { result, steps } = prefixToInfix(clean);
    const normalData = prefixToInfixNormalSteps(clean);
    const stackRows = prefixToInfixStackRows(steps);
    const liveNormalSteps = prefixToInfixNormalLiveSteps(clean);
    const liveStackSteps = prefixToInfixStackLiveSteps(clean);
    const introNormalSteps = prefixToInfixIntroSteps(clean);
    const introStackSteps = prefixToInfixStackIntroSteps();

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
            Prefix <span className="text-rose-500">to</span>{' '}
            <span className="border-b-8 border-rose-500">Infix</span>
          </>
        }
        subtitle="A stack of growing strings unfolds the notation. Scan right to left and watch each operator marry the two expressions it owns."
        algo="PREFIX -> INFIX"
        accent="bg-rose-500"
      />

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        <ExpressionInput
          label="Enter Prefix Expression"
          placeholder="Enter a prefix expression..."
          examples={EXAMPLES}
          color="rose"
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
              accent="rose"
              liveSteps1={data.liveNormalSteps}
              liveSteps2={data.liveStackSteps}
              introSteps1={data.introNormalSteps}
              introSteps2={data.introStackSteps}
              method1={{
                title: 'Normal Method',
                subtitle: 'Without Using Stack',
                steps: data.normalSteps,
                finalResult: data.normalFinal,
                note: 'Prefix is decoded by progressively grouping operands with their operators, reading right to left.',
              }}
              method2={{
                title: 'Stack Method',
                subtitle: 'Using Stack',
                columns: [
                  { label: 'Expression', accessorKey: 'expression' },
                  { label: 'Stack', accessorKey: 'stack' },
                  { label: 'Infix', accessorKey: 'infix' },
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