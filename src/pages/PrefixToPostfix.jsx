import { useState } from 'react';
import ExpressionInput from '../components/ExpressionInput';
import PageHeader from '../components/PageHeader';
import TwoMethodExplanation from '../components/TwoMethodExplanation';
import { prefixToPostfix } from '../utils/prefixToPostfix';
import {
  prefixToPostfixNormalSteps,
  prefixToPostfixStackRows,
} from '../utils/explanations';
import {
  prefixToPostfixNormalLiveSteps,
  prefixToPostfixStackLiveSteps,
  prefixToPostfixIntroSteps,
  prefixToPostfixStackIntroSteps,
} from '../utils/liveExplanationSteps';
import { validatePrefix } from '../utils/expressionValidator';

const EXAMPLES = ['+AB', '+A*BC', '*A+BC', '-*+ABCD', '^^ABC'];

export default function PrefixToPostfix() {
  const [data, setData] = useState(null);

  const handleVisualize = (raw) => {
    const verdict = validatePrefix(raw);
    if (!verdict.valid) {
      setData({ error: verdict.error });
      return;
    }
    const clean = raw.replace(/\s+/g, '').toUpperCase();
    const { result, steps } = prefixToPostfix(clean);
    const normalData = prefixToPostfixNormalSteps(clean);
    const stackRows = prefixToPostfixStackRows(steps);
    const liveNormalSteps = prefixToPostfixNormalLiveSteps(clean);
    const liveStackSteps = prefixToPostfixStackLiveSteps(clean);
    const introNormalSteps = prefixToPostfixIntroSteps(clean);
    const introStackSteps = prefixToPostfixStackIntroSteps();

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
            <span className="border-b-8 border-indigo-600">Postfix</span>
          </>
        }
        subtitle="Operators trail behind what they own. Read right to left, watch the string stack regroup, and every operator settles after its two operands."
        algo="PREFIX -> POSTFIX"
        accent="bg-indigo-600"
      />

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        <ExpressionInput
          label="Enter Prefix Expression"
          placeholder="Enter a prefix expression..."
          examples={EXAMPLES}
          color="indigo"
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
              accent="indigo"
              liveSteps1={data.liveNormalSteps}
              liveSteps2={data.liveStackSteps}
              introSteps1={data.introNormalSteps}
              introSteps2={data.introStackSteps}
              method1={{
                title: 'Normal Method',
                subtitle: 'Without Using Stack',
                steps: data.normalSteps,
                finalResult: data.normalFinal,
                note: 'Prefix is decoded by realising each operator must move after the two expressions it already owns.',
              }}
              method2={{
                title: 'Stack Method',
                subtitle: 'Using Stack',
                columns: [
                  { label: 'Expression', accessorKey: 'expression' },
                  { label: 'Stack', accessorKey: 'stack' },
                  { label: 'Operation', accessorKey: 'operation' },
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
