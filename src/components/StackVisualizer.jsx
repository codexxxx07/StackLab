import { useEffect, useRef } from 'react';

const TONE_COLORS = {
  push: 'bg-mint-soft border-mint/30 text-mint',
  pop: 'bg-coral-soft border-coral/30 text-coral',
  output: 'bg-sky-soft border-sky/30 text-sky',
};

export default function StackVisualizer({ stack, event, label = 'Stack', color = 'grape' }) {
  const bottomRef = useRef(null);
  const prevLen = useRef(stack.length);

  useEffect(() => {
    prevLen.current = stack.length;
  }, [stack.length]);

  const colorMap = {
    grape: 'bg-grape-soft border-grape/30',
    sky: 'bg-sky-soft border-sky/30',
    mint: 'bg-mint-soft border-mint/30',
    coral: 'bg-coral-soft border-coral/30',
  };

  const toneColor = event ? TONE_COLORS[event.kind] || 'bg-white border-gray-100' : 'bg-white border-gray-100';

  return (
    <div className="panel-flat p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-xs uppercase tracking-wider text-ink-soft">{label}</h3>
        {event && (
          <span className={`chip border ${toneColor}`}>
            {event.kind === 'push' && `+ ${event.value}`}
            {event.kind === 'pop' && `− ${event.value}`}
            {event.kind === 'output' && `→ ${event.value}`}
          </span>
        )}
      </div>

      <div className="relative min-h-[200px] w-full max-w-[220px] mx-auto">
        {/* Stack base — soft rounded bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-2 rounded-b-xl bg-gray-200" />
        {/* Stack walls — subtle left/right guides */}
        <div className="absolute bottom-0 left-0 h-10 w-1 rounded-full bg-gray-300" />
        <div className="absolute bottom-0 right-0 h-10 w-1 rounded-full bg-gray-300" />

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
                  ${isTop ? `${colorMap[color] || 'bg-grape-soft border-grape/30'}` : 'bg-white border-gray-100'}
                `}
                style={{ boxShadow: isTop ? 'var(--shadow-soft-sm)' : 'var(--shadow-soft-xs)' }}
              >
                <span>{item}</span>
                {isTop && (
                  <span className="ml-2 text-[10px] font-display uppercase tracking-wider text-ink-soft">
                    TOP
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {stack.length === 0 && (
          <div className="absolute bottom-4 left-2 right-2 flex items-center justify-center py-6">
            <span className="font-mono text-sm text-ink/30">empty</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
