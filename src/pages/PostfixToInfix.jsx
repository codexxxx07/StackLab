import { useState } from 'react';
import ExpressionInput from '../components/ExpressionInput';
import PageHeader from '../components/PageHeader';
import TwoMethodExplanation from '../components/TwoMethodExplanation';
import { postfixToInfix } from '../utils/postfixToInfix';
import {
  postfixToInfixNormalSteps,
  postfixToInfixStackRows,
} from '../utils/explanations';
import {
  postfixToInfixNormalLiveSteps,
  postfixToInfixStackLiveSteps,
  postfixToInfixIntroSteps,
  postfixToInfixStackIntroSteps,
} from '../utils/liveExplanationSteps';
import { validatePostfix } from '../utils/expressionValidator';

const EXAMPLES = ['ABC*+', 'AB+C*', 'AB*C+', 'ABC+-', 'ABCDE^*-'];

export default function PostfixToInfix() {
  const [data, setData] = useState(null);

  const handleVisualize = (raw) => {
    const verdict = validatePostfix(raw);
    if (!verdict.valid) {
      setData({ error: verdict.error });
      return;
    }
    const clean = raw.replace(/\s+/g, '').toUpperCase();
    const { result, steps } = postfixToInfix(clean);
    const normalData = postfixToInfixNormalSteps(clean);
    const stackRows = postfixToInfixStackRows(steps);
    const liveNormalSteps = postfixToInfixNormalLiveSteps(clean);
    const liveStackSteps = postfixToInfixStackLiveSteps(clean);
    const introNormalSteps = postfixToInfixIntroSteps(clean);
    const introStackSteps = postfixToInfixStackIntroSteps();

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
            <span className="border-b-8 border-indigo-600">Infix</span>
          </>
        }
        subtitle="A stack of growing strings. Operands land alone; operators marry the two most recent expressions \u2014 right one popped first!"
        algo="POSTFIX -> INFIX"
        accent="bg-indigo-600"
      />

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        <ExpressionInput
          label="Enter Postfix Expression"
          placeholder="e.g. ABC*+"
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
                note: 'Postfix is decoded by progressively grouping operands with their operators.',
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
