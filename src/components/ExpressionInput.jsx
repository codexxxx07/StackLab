import { useState } from 'react';

export default function ExpressionInput({ label, placeholder, buttonText, onSubmit, validator, color = 'orange', examples, error: externalError }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(null);

  const displayError = externalError || error;

  const colorMap = {
    orange: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-glow',
    indigo: 'bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-700 hover:to-violet-600 shadow-glow-indigo',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500',
    rose: 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600',
    cyan: 'bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-500 hover:to-sky-600',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validator) {
      const result = validator(value);
      if (!result.valid) {
        setError(result.error);
        return;
      }
    }
    setError(null);
    onSubmit(value);
  };

  const handleExampleClick = (ex) => {
    setValue(ex);
    setError(null);
    onSubmit(ex);
  };

  return (
    <form onSubmit={handleSubmit} id="input" className="card p-5 dark:bg-[#0f172a] dark:border-[rgba(255,255,255,0.06)]">
      <label className="mb-2 block font-extrabold text-sm uppercase tracking-wider text-stone-900 dark:text-white">
        {label}
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          placeholder={placeholder}
          className="flex-1 rounded-2xl border border-stone-900/10 bg-white px-4 py-3 font-mono text-lg font-bold tracking-widest outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-stone-400 dark:border-[rgba(255,255,255,0.06)] dark:bg-[#0a0a0a] dark:text-white dark:focus:border-bugbusters-cyan dark:focus:ring-bugbusters-cyan/20 dark:placeholder:text-[#6b7280]"
          style={{ boxShadow: '0 1px 2px rgb(28 25 23 / 0.05)' }}
        />
        <button
          type="submit"
          className={`btn text-white ${colorMap[color] || colorMap.orange}`}
        >
          {buttonText || 'Visualize →'}
        </button>
      </div>

      {/* Example chips */}
      {examples && examples.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-gray-500">Try:</span>
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => handleExampleClick(ex)}
              className="rounded-lg border border-stone-900/5 bg-cream px-2.5 py-1 font-mono text-xs font-bold text-stone-600 transition-all hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-500 dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(255,255,255,0.04)] dark:text-[#9ca3af] dark:hover:border-bugbusters-cyan/30 dark:hover:bg-bugbusters-cyan/10 dark:hover:text-bugbusters-cyan"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {displayError && (
        <div className="mt-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-500">
          {displayError}
        </div>
      )}
    </form>
  );
}
