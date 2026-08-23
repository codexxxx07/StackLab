import { useEffect, useRef } from 'react';

const TONE_COLORS = {
  push: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500',
  pop: 'bg-rose-500/10 border-rose-500/30 text-rose-500',
  output: 'bg-indigo-600/10 border-indigo-600/30 text-indigo-600',
};

export default function StackVisualizer({ stack, event, label = 'Stack', color = 'orange' }) {
  const bottomRef = useRef(null);
  const prevLen = useRef(stack.length);

  useEffect(() => {
    prevLen.current = stack.length;
  }, [stack.length]);

  const colorMap = {
    orange: 'bg-orange-500/10 border-orange-500/30 text-orange-500',
    indigo: 'bg-indigo-600/10 border-indigo-600/30 text-indigo-600',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500',
    rose: 'bg-rose-500/10 border-rose-500/30 text-rose-500',
  };

  const toneColor = event ? TONE_COLORS[event.kind] || 'bg-white border-stone-900/5 dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.06)]' : 'bg-white border-stone-900/5 dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.06)]';

  return (
    <div className="panel-flat p-4 dark:bg-[#0f172a] dark:border-[rgba(255,255,255,0.06)]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-stone-500 dark:text-gray-400">{label}</h3>
        {event && (
          <span className={`chip border ${toneColor}`}>
            {event.kind === 'push' && `+ ${event.value}`}
            {event.kind === 'pop' && `\u2212 ${event.value}`}
            {event.kind === 'output' && `→ ${event.value}`}
          </span>
        )}
      </div>

      <div className="relative min-h-[200px] w-full max-w-[220px] mx-auto">
        {/* Stack base */}
        <div className="absolute bottom-0 left-0 right-0 h-2 rounded-b-2xl bg-stone-200 dark:bg-gray-700" />
        {/* Stack walls */}
        <div className="absolute bottom-0 left-0 h-10 w-1 rounded-full bg-stone-300 dark:bg-gray-600" />
        <div className="absolute bottom-0 right-0 h-10 w-1 rounded-full bg-stone-300 dark:bg-gray-600" />

        {/* Stack items */}
        <div className="absolute bottom-2.5 left-2 right-2 flex flex-col-reverse gap-1.5">
          {stack.map((item, i) => {
            const isNew = event && event.kind === 'push' && i === stack.length - 1;
            const isTop = i === stack.length - 1;
            return (
              <div
                key={`${item}-${i}`}
                className={`
                  flex items-center justify-center rounded-xl border
                  px-3 py-2.5 font-mono text-lg font-bold
                  transition-all duration-300
                  ${isNew ? 'animate-pop-in' : ''}
                  ${isTop ? `${colorMap[color] || 'bg-orange-500/10 border-orange-500/30 text-orange-500'}` : 'bg-white border-stone-900/5 dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.06)] dark:text-white'}
                `}
                style={{ boxShadow: isTop ? '0 1px 2px rgb(28 25 23 / 0.05), 0 4px 12px -2px rgb(28 25 23 / 0.08)' : '0 1px 2px rgb(28 25 23 / 0.05)' }}
              >
                <span>{item}</span>
                {isTop && (
                  <span className="ml-2 text-[10px] font-extrabold uppercase tracking-wider text-stone-400 dark:text-gray-500">
                    TOP
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {stack.length === 0 && (
          <div className="absolute bottom-4 left-2 right-2 flex items-center justify-center py-6">
            <span className="font-mono text-sm text-stone-300 dark:text-gray-600">empty</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
