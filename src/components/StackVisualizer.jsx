import { useEffect, useRef } from 'react';

const TONE_COLORS = {
  push: 'border-mint bg-mint-soft text-mint',
  pop: 'border-coral bg-coral-soft text-coral',
  output: 'border-sky bg-sky-soft text-sky',
};

export default function StackVisualizer({ stack, event, label = 'Stack', color = 'grape' }) {
  const bottomRef = useRef(null);
  const prevLen = useRef(stack.length);

  useEffect(() => {
    prevLen.current = stack.length;
  }, [stack.length]);

  const colorMap = {
    grape: 'border-grape bg-grape-soft',
    sky: 'border-sky bg-sky-soft',
    mint: 'border-mint bg-mint-soft',
    coral: 'border-coral bg-coral-soft',
  };

  const toneColor = event ? TONE_COLORS[event.kind] || 'border-ink bg-white' : 'border-ink bg-white';

  return (
    <div className="panel-flat p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-xs uppercase tracking-wider text-ink-soft">{label}</h3>
        {event && (
          <span className={`chip border-2 ${toneColor}`}>
            {event.kind === 'push' && `+ ${event.value}`}
            {event.kind === 'pop' && `− ${event.value}`}
            {event.kind === 'output' && `→ ${event.value}`}
          </span>
        )}
      </div>

      <div className="relative min-h-[200px] w-full max-w-[220px] mx-auto">
        {/* Stack base */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 rounded-b bg-ink" />
        <div className="absolute bottom-0 left-0 h-10 w-1.5 bg-ink" />
        <div className="absolute bottom-0 right-0 h-10 w-1.5 bg-ink" />

        {/* Stack items */}
        <div className="absolute bottom-2 left-1.5 right-1.5 flex flex-col-reverse gap-1">
          {stack.map((item, i) => {
            const isNew = event && event.kind === 'push' && i === stack.length - 1;
            const isTop = i === stack.length - 1;
            return (
              <div
                key={`${item}-${i}`}
                className={`
                  flex items-center justify-center border-[3px] border-ink
                  bg-white px-3 py-2.5 font-mono text-lg font-bold
                  shadow-pop-xs transition-all duration-300
                  ${isNew ? 'animate-pop-in' : ''}
                  ${isTop ? `${colorMap[color] || 'bg-grape-soft'}` : ''}
                `}
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
          <div className="absolute bottom-4 left-1.5 right-1.5 flex items-center justify-center py-6">
            <span className="font-mono text-sm text-ink-soft/50">empty</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
