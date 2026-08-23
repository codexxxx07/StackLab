export default function OutputDisplay({ output, label = 'Output' }) {
  return (
    <div className="panel-flat p-4">
      <h3 className="mb-2 font-display text-xs uppercase tracking-wider text-ink-soft">{label}</h3>
      <div className="flex flex-wrap items-center gap-1">
        {output.length > 0 ? (
          [...output].map((char, i) => (
            <span
              key={i}
              className="tile h-10 w-10 bg-grape-soft border-grape/30 font-mono text-lg font-bold animate-pop-in"
            >
              {char}
            </span>
          ))
        ) : (
          <span className="font-mono text-sm text-ink-soft/50">&mdash;</span>
        )}
      </div>
    </div>
  );
}
