import { useState } from 'react';
import ExpressionInput from '../components/ExpressionInput';
import PageHeader from '../components/PageHeader';
import TwoMethodExplanation from '../components/TwoMethodExplanation';
import { infixToPostfix } from '../utils/infixToPostfix';
import {
  infixToPostfixNormalSteps,
  infixToPostfixStackRows,
} from '../utils/explanations';
import {
  infixToPostfixNormalLiveSteps,
  infixToPostfixStackLiveSteps,
  infixToPostfixIntroSteps,
  infixToPostfixStackIntroSteps,
} from '../utils/liveExplanationSteps';
import { validateInfix } from '../utils/expressionValidator';

const EXAMPLES = ['A+B*C', '(A+B)*C', 'A*B+C/D', 'A^B^C', 'A+(B*C-(D/E)^F)*G'];

export default function InfixToPostfix() {
  const [data, setData] = useState(null);

  const handleVisualize = (raw) => {
    const verdict = validateInfix(raw);
    if (!verdict.valid) {
      setData({ error: verdict.error });
      return;
    }
    const clean = raw.replace(/\s+/g, '').toUpperCase();
    const { result, steps } = infixToPostfix(clean);
    const normalData = infixToPostfixNormalSteps(clean);
    const stackRows = infixToPostfixStackRows(steps);
    const liveNormalSteps = infixToPostfixNormalLiveSteps(clean);
    const liveStackSteps = infixToPostfixStackLiveSteps(clean);
    const introNormalSteps = infixToPostfixIntroSteps(clean);
    const introStackSteps = infixToPostfixStackIntroSteps();

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
            <span className="border-b-8 border-orange-500">Postfix</span>
          </>
        }
        subtitle="Operators get impatient \u2014 the stack decides who prints first. Scan left to right and watch precedence do the sorting."
        algo="INFIX -> POSTFIX"
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

        {data && !data.error && (
          <div
            id="result"
            className="scroll-mt-28 animate-pop-in"
          >
            <TwoMethodExplanation
              input={data.input}
              finalAnswer={data.result}
              accent="orange"
              liveSteps1={data.liveNormalSteps}
              liveSteps2={data.liveStackSteps}
              introSteps1={data.introNormalSteps}
              introSteps2={data.introStackSteps}
              method1={{
                title: 'Normal Method',
                subtitle: 'Without Using Stack',
                steps: data.normalSteps,
                finalResult: data.normalFinal,
                note: 'Expression is transformed by applying operator precedence rules directly.',
              }}
              method2={{
                title: 'Stack Method',
                subtitle: 'Using Stack',
                columns: [
                  { label: 'Expression', accessorKey: 'expression' },
                  { label: 'Stack', accessorKey: 'stack' },
                  { label: 'Postfix', accessorKey: 'postfix' },
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