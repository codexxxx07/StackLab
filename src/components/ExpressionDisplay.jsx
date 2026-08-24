export default function ExpressionDisplay({ expression, currentIndex, label = 'Expression' }) {
  return (
    <div className="panel-flat p-4 dark:bg-bugbusters-card dark:border-[rgba(255,255,255,0.06)]">
      <h3 className="mb-2 font-extrabold text-xs uppercase tracking-wider text-stone-500 dark:text-gray-400">{label}</h3>
      <div className="flex flex-wrap items-center gap-1">
        {[...expression].map((char, i) => {
          const isCurrent = i === currentIndex;
          const isDone = i < currentIndex;
          return (
            <span
              key={i}
              className={`
                tile h-10 w-10
                font-mono text-lg font-bold transition-all duration-200
                ${isCurrent ? 'bg-amber-500 text-stone-900 border-amber-500 animate-pop-in scale-110' : ''}
                ${isDone ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-white dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.06)] dark:text-white'}
              `}
            >
              {char}
            </span>
          );
        })}
      </div>
      {currentIndex >= 0 && currentIndex < expression.length && (
        <div className="mt-2 flex items-center gap-1">
          <span className="text-stone-500 dark:text-gray-400">Reading:</span>
          <span className="animate-blink font-mono text-lg font-bold text-rose-500">&darr;</span>
        </div>
      )}
    </div>
  );
}
