import { Link } from 'react-router-dom';
import { COLOR_STYLES } from '../data/conversions';

export default function ConversionCard({ conversion, conv, rotate }) {
  const data = conversion || conv;
  const { path, title, desc, example, color, tagline } = data || {};
  const colors = COLOR_STYLES[color] || COLOR_STYLES.orange;

  return (
    <div
      className={`
        cursor-target group card card-hover card-shimmer
        ${rotate || ''}
      `}
    >
      {/* Status badge */}
      <div className="absolute -right-2 -top-2 z-10">
        <span
          className="inline-block rounded-full px-3 py-0.5 font-bold text-[10px] uppercase tracking-[0.15em] bg-emerald-500 text-white"
          style={{ boxShadow: '0 1px 2px rgb(28 25 23 / 0.05)' }}
        >
          Live
        </span>
      </div>

      <div className="p-5">
        {/* Gradient bar */}
        <div className={`deco-bar mb-3 w-12 ${colors.bar}`} />

        <h3 className="mb-1 font-extrabold text-lg uppercase tracking-tight heading-skew text-stone-900 dark:text-white">
          {title}
        </h3>
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-gray-400">{tagline}</p>
        <p className="mb-4 text-sm text-stone-600 dark:text-bugbusters-soft">{desc}</p>

        {/* Example */}
        <div className="mb-4 flex items-center gap-2">
          <span className="tile px-2.5 py-1 text-sm text-stone-900 dark:text-white">
            {example.in}
          </span>
          <span className="text-lg font-bold text-stone-400 dark:text-gray-500">&rarr;</span>
          <span className={`tile px-2.5 py-1 text-sm text-white ${colors.solid}`}>
            {example.out}
          </span>
        </div>

        {/* Button */}
        <Link
          to={path}
          className={`
            btn w-full text-xs ${colors.solid}
          `}
        >
          Visualize Now
        </Link>
      </div>
    </div>
  );
}
