export default function OutputDisplay({ output, label = 'Output' }) {
  return (
    <div className="panel-flat p-4 dark:bg-bugbusters-card dark:border-white/10">
      <h3 className="mb-2 font-extrabold text-xs uppercase tracking-wider text-stone-500 dark:text-gray-400">{label}</h3>
      <div className="flex flex-wrap items-center gap-1">
        {output.length > 0 ? (
          [...output].map((char, i) => (
            <span
              key={i}
              className="tile h-10 w-10 bg-orange-500/10 border-orange-500/30 text-orange-500 font-mono text-lg font-bold animate-pop-in"
            >
              {char}
            </span>
          ))
        ) : (
          <span className="font-mono text-sm text-stone-300 dark:text-gray-600">&mdash;</span>
        )}
      </div>
    </div>
  );
}
