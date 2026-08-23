import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCheckSquare, FiClock, FiLoader } from 'react-icons/fi';
import { COLOR_STYLES, LIVE_CONVERSIONS } from '../data/conversions';

export default function ComingSoonCard({ title, desc, color = 'emerald', planned = [], example }) {
  const styles = COLOR_STYLES[color] ?? COLOR_STYLES.emerald;
  const [from, to] = title.split('\u2192').map((s) => s.trim());

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="card relative rotate-1 p-8 pt-12 text-center sm:p-12 dark:bg-bugbusters-card dark:border-white/10">
        <span className={`sticker absolute -top-4 left-1/2 -translate-x-1/2 ${styles.solid} border-transparent`}>
          UNDER CONSTRUCTION
        </span>

        <FiLoader
          className={`mx-auto mt-4 size-16 animate-spin-slow text-stone-400 ${styles.bar}`}
          strokeWidth={2.5}
        />

        <h1 className="heading-skew mt-6 text-3xl font-extrabold text-stone-900 sm:text-5xl dark:text-white">
          {from}
          <span className={`mx-3 inline-block h-6 w-10 rounded-full align-middle ${styles.bar}`}>&nbsp;</span>
          {to}
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base font-medium leading-relaxed text-stone-600 dark:text-bugbusters-soft">
          {desc}
        </p>

        <div
          className={`mx-auto mt-8 max-w-md rounded-2xl border border-dashed border-stone-900/10 p-5 text-left ${styles.soft} dark:border-white/10`}
        >
          <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500 dark:text-gray-400">
            <FiClock /> On the roadmap
          </p>
          <ul className="space-y-2">
            {planned.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm font-semibold text-stone-700 dark:text-gray-300">
                <FiCheckSquare className="mt-0.5 size-4 shrink-0 text-stone-400 dark:text-gray-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {example && (
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-dashed border-stone-900/10 bg-cream px-4 py-2 font-mono text-sm opacity-60 dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white">
            <s>{example.in}</s> &rarr; <s>{example.out}</s>
            <span className="text-xs uppercase tracking-widest">(not yet!)</span>
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="btn bg-white border border-stone-900/5 dark:bg-bugbusters-card dark:border-white/10 dark:text-white">
            <FiArrowLeft /> Back Home
          </Link>
          <Link to="/infix-to-postfix" className={`btn ${styles.solid} border-transparent`}>
            Try a Live Visualizer
          </Link>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <span className="sticker -rotate-2 bg-amber-500/10 text-amber-600 border-amber-500/30">Meanwhile...</span>
        {LIVE_CONVERSIONS.map((c) => (
          <Link key={c.id} to={c.path} className="btn bg-white border border-stone-900/5 px-3 py-2 font-mono text-sm !normal-case dark:bg-bugbusters-card dark:border-white/10 dark:text-white">
            {c.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
