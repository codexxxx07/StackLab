import { useState } from 'react';

export default function ExpressionInput({ label, placeholder, buttonText, onSubmit, validator, color = 'grape' }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(null);

  const colorMap = {
    grape: 'bg-grape hover:bg-grape/90',
    sky: 'bg-sky hover:bg-sky/90',
    mint: 'bg-mint hover:bg-mint/90',
    coral: 'bg-coral hover:bg-coral/90',
    flamingo: 'bg-flamingo hover:bg-flamingo/90',
    lemon: 'bg-lemon hover:bg-lemon/90 text-ink',
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

  return (
    <form onSubmit={handleSubmit} className="panel p-5">
      <label className="mb-2 block font-display text-sm uppercase tracking-wider">
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
          className="flex-1 border-[3px] border-ink bg-white px-4 py-3 font-mono text-lg font-bold tracking-widest shadow-pop-xs outline-none transition-shadow focus:shadow-pop placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-ink-soft"
        />
        <button
          type="submit"
          className={`btn text-white ${colorMap[color] || colorMap.grape}`}
        >
          {buttonText || 'Visualize'}
        </button>
      </div>
      {error && (
        <div className="mt-3 border-[3px] border-coral bg-coral-soft px-4 py-2 text-sm font-medium text-coral">
          {error}
        </div>
      )}
    </form>
  );
}
