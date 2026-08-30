import { useState } from 'react';
import ExpressionInput from '../components/ExpressionInput';
import PageHeader from '../components/PageHeader';
import TwoMethodExplanation from '../components/TwoMethodExplanation';
import { postfixToPrefix } from '../utils/postfixToPrefix';
import {
  postfixToPrefixNormalSteps,
  postfixToPrefixStackRows,
} from '../utils/explanations';
import {
  postfixToPrefixNormalLiveSteps,
  postfixToPrefixStackLiveSteps,
  postfixToPrefixIntroSteps,
  postfixToPrefixStackIntroSteps,
} from '../utils/liveExplanationSteps';
import { validatePostfix } from '../utils/expressionValidator';

const EXAMPLES = ['AB+', 'ABC*+', 'AB+CD-*', 'ABC+*', 'ABCDE^*-'];

export default function PostfixToPrefix() {
  const [data, setData] = useState(null);

  const handleVisualize = (raw) => {
    const verdict = validatePostfix(raw);
    if (!verdict.valid) {
      setData({ error: verdict.error });
      return;
    }
    const clean = raw.replace(/\s+/g, '').toUpperCase();
    const { result, steps } = postfixToPrefix(clean);
    const normalData = postfixToPrefixNormalSteps(clean);
    const stackRows = postfixToPrefixStackRows(steps);
    const liveNormalSteps = postfixToPrefixNormalLiveSteps(clean);
    const liveStackSteps = postfixToPrefixStackLiveSteps(clean);
    const introNormalSteps = postfixToPrefixIntroSteps(clean);
    const introStackSteps = postfixToPrefixStackIntroSteps();

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
            Postfix <span className="text-rose-500">to</span>{' '}
            <span className="border-b-8 border-emerald-500">Prefix</span>
          </>
        }
        subtitle="Operators leap in front of everything they own. Scan left to right, let the string stack regroup, and watch each operator arrive before its two operands."
        algo="POSTFIX -> PREFIX"
        accent="bg-emerald-500"
      />

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        <ExpressionInput
          label="Enter Postfix Expression"
          placeholder="Enter a postfix expression..."
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
                note: 'Postfix is decoded by realising each operator must move in front of the two expressions it already owns.',
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
