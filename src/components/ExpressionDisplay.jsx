export default function ExpressionDisplay({ expression, currentIndex, label = 'Expression' }) {
  return (
    <div className="panel-flat p-4">
      <h3 className="mb-2 font-display text-xs uppercase tracking-wider text-ink-soft">{label}</h3>
      <div className="flex flex-wrap items-center gap-1">
        {[...expression].map((char, i) => {
          const isCurrent = i === currentIndex;
          const isDone = i < currentIndex;
          return (
            <span
              key={i}
              className={`
                inline-flex h-10 w-10 items-center justify-center border-[3px] border-ink
                font-mono text-lg font-bold shadow-pop-xs transition-all duration-200
                ${isCurrent ? 'bg-lemon animate-pop-in scale-110' : ''}
                ${isDone ? 'bg-mint-soft text-ink' : 'bg-white'}
              `}
            >
              {char}
            </span>
          );
        })}
      </div>
      {currentIndex >= 0 && currentIndex < expression.length && (
        <div className="mt-2 flex items-center gap-1">
          <span className="text-ink-soft">Reading:</span>
          <span className="animate-blink font-mono text-lg font-bold text-coral">↓</span>
        </div>
      )}
    </div>
  );
}
