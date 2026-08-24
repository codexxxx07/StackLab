import { useState } from 'react';
import ExpressionInput from '../components/ExpressionInput';
import PageHeader from '../components/PageHeader';
import TwoMethodExplanation from '../components/TwoMethodExplanation';
import { postfixToInfix } from '../utils/postfixToInfix';
import {
  postfixToInfixNormalSteps,
  postfixToInfixStackRows,
} from '../utils/explanations';
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

    setData({
      input: clean,
      result,
      steps,
      normalSteps: normalData.steps,
      normalFinal: normalData.finalResult,
      stackRows,
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
            Postfix <span className="text-rose-500">\u2192</span>{' '}
            <span className="border-b-8 border-indigo-600">Infix</span>
          </>
        }
        subtitle="A stack of growing strings. Operands land alone; operators marry the two most recent expressions \u2014 right one popped first!"
        algo="POSTFIX \u2192 INFIX"
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
