import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCheckSquare, FiClock, FiLoader } from 'react-icons/fi';
import { COLOR_STYLES, LIVE_CONVERSIONS } from '../data/conversions';

export default function ComingSoonCard({ title, desc, color = 'mint', planned = [], example }) {
  const styles = COLOR_STYLES[color] ?? COLOR_STYLES.mint;
  const [from, to] = title.split('\u2192').map((s) => s.trim());

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="panel relative rotate-1 p-8 pt-12 text-center sm:p-12">
        <span className={`sticker absolute -top-4 left-1/2 -translate-x-1/2 ${styles.solid} border-transparent`}>
          UNDER CONSTRUCTION
        </span>

        <FiLoader
          className={`mx-auto mt-4 size-16 animate-spin-slow text-ink ${styles.bar}`}
          strokeWidth={2.5}
        />

        <h1 className="heading-skew mt-6 text-3xl sm:text-5xl">
          {from}
          <span className={`mx-3 inline-block h-6 w-10 rounded-full align-middle ${styles.bar}`}>&nbsp;</span>
          {to}
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base font-medium leading-relaxed text-ink-soft">
          {desc}
        </p>

        <div
          className={`mx-auto mt-8 max-w-md rounded-xl border border-dashed border-gray-300 p-5 text-left ${styles.soft}`}
        >
          <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-ink-soft">
            <FiClock /> On the roadmap
          </p>
          <ul className="space-y-2">
            {planned.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm font-semibold">
                <FiCheckSquare className="mt-0.5 size-4 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {example && (
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 bg-paper px-4 py-2 font-mono text-sm opacity-60">
            <s>{example.in}</s> &rarr; <s>{example.out}</s>
            <span className="text-xs uppercase tracking-widest">(not yet!)</span>
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="btn bg-white border border-gray-200">
            <FiArrowLeft /> Back Home
          </Link>
          <Link to="/infix-to-postfix" className={`btn ${styles.solid} border-transparent`}>
            Try a Live Visualizer
          </Link>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <span className="sticker -rotate-2 bg-lemon border-lemon/30">Meanwhile...</span>
        {LIVE_CONVERSIONS.map((c) => (
          <Link key={c.id} to={c.path} className="btn bg-white border border-gray-200 px-3 py-2 font-mono text-sm !normal-case">
            {c.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
