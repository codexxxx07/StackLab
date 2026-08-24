import ExplanationCard from './ExplanationCard';

/**
 * Reusable two-method explanation layout.
 *
 * Shows:
 * - Final Answer at the top
 * - Method 1: Normal Method (= transformation style)
 * - Method 2: Stack Method (execution table)
 *
 * Props:
 *   method1: { title: string, subtitle: string, steps: string[], finalResult: string, note?: string }
 *   method2: { title: string, subtitle: string, columns: {label: string}[], rows: object[], operationKey: string }
 *   finalAnswer: string
 *   input: string
 *   accent: 'orange' | 'indigo'
 */
export default function TwoMethodExplanation({
  method1,
  method2,
  finalAnswer,
  input,
  accent = 'orange',
}) {
  const accentMap = {
    orange: {
      bg: 'bg-orange-500',
      text: 'text-orange-500',
      border: 'border-orange-500',
      headBg: 'bg-orange-500',
      rowHover: 'hover:bg-orange-500/5',
      badge: 'bg-orange-500/10 border-orange-500/30 text-orange-500',
    },
    indigo: {
      bg: 'bg-indigo-600',
      text: 'text-indigo-600',
      border: 'border-indigo-600',
      headBg: 'bg-indigo-600',
      rowHover: 'hover:bg-indigo-600/5',
      badge: 'bg-indigo-600/10 border-indigo-600/30 text-indigo-600',
    },
  };

  const a = accentMap[accent] || accentMap.orange;

  return (
    <div className="space-y-6">
      {/* Final Answer */}
      <div className={`card rounded-2xl border ${a.border}/20 p-6 ${a.bg}/5 dark:${a.bg}/10`}>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500 dark:text-gray-400">
          Final Answer
        </p>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-stone-500 dark:text-gray-400">
            {input} =
          </span>
          <span className={`font-mono text-2xl font-extrabold tracking-wider ${a.text}`}>
            {finalAnswer}
          </span>
        </div>
      </div>

      {/* Method 1: Normal Method */}
      <ExplanationCard
        number="Method 01"
        title={method1.title}
        tint={a.headBg}
      >
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500 dark:text-gray-400">
          {method1.subtitle}
        </p>

        <div
          className="rounded-2xl border border-stone-900/5 bg-cream p-5 dark:border-[rgba(255,255,255,0.06)] dark:bg-[#0a0a0a]"
          style={{ boxShadow: '0 1px 2px rgb(28 25 23 / 0.05)' }}
        >
          <div className="font-mono text-base font-bold leading-loose text-stone-900 dark:text-white">
            {method1.steps.map((step, i) => (
              <div key={i} className="flex">
                {i === 0 ? (
                  <span>{step}</span>
                ) : (
                  <span>
                    <span className="text-stone-400 dark:text-gray-500">=</span>
                    {step}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-dashed border-stone-900/10 bg-white p-3 text-center dark:border-[rgba(255,255,255,0.06)] dark:bg-[#0a0a0a]">
          <span className="text-xs font-bold text-stone-500 dark:text-gray-400">
            Therefore:{' '}
          </span>
          <span className={`font-mono text-sm font-extrabold ${a.text}`}>
            {method1.finalResult}
          </span>
        </div>

        {method1.note && (
          <p className="mt-3 text-xs font-semibold text-stone-500 dark:text-gray-400">
            {method1.note}
          </p>
        )}
      </ExplanationCard>

      {/* Method 2: Stack Method */}
      <ExplanationCard
        number="Method 02"
        title={method2.title}
        tint={a.headBg}
      >
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500 dark:text-gray-400">
          {method2.subtitle}
        </p>

        <div
          className="overflow-hidden rounded-2xl border border-stone-900/5 dark:border-[rgba(255,255,255,0.06)]"
          style={{ boxShadow: '0 1px 2px rgb(28 25 23 / 0.05)' }}
        >
          {/* Table Header */}
          <div className={`grid ${method2.columns.length === 3 ? 'grid-cols-3' : 'grid-cols-3'} ${a.headBg} text-white`}>
            {method2.columns.map((col, i) => (
              <div
                key={i}
                className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.15em]"
              >
                {col.label}
              </div>
            ))}
          </div>

          {/* Table Rows */}
          <div className="bg-white dark:bg-[#0a0a0a]">
            {method2.rows.map((row, i) => (
              <div
                key={i}
                className={`grid ${method2.columns.length === 3 ? 'grid-cols-3' : 'grid-cols-3'} border-t border-stone-900/5 ${a.rowHover} dark:border-[rgba(255,255,255,0.06)] dark:hover:bg-white/5 ${
                  i % 2 === 0
                    ? 'bg-cream/50 dark:bg-[rgba(255,255,255,0.02)]'
                    : ''
                }`}
              >
                {method2.columns.map((col, j) => (
                  <div
                    key={j}
                    className="flex items-center px-4 py-3 font-mono text-sm font-bold text-stone-900 dark:text-white"
                  >
                    {j === 0 ? (
                      <span
                        className={`inline-flex size-7 items-center justify-center rounded-lg ${a.badge} text-xs font-extrabold`}
                      >
                        {row[col.accessorKey]}
                      </span>
                    ) : (
                      <span>{row[col.accessorKey]}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </ExplanationCard>
    </div>
  );
}
