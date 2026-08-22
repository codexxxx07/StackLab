import { Link } from 'react-router-dom';
import { COLOR_STYLES } from '../data/conversions';

export default function ConversionCard({ conversion, conv, rotate }) {
  const data = conversion || conv;
  const { path, title, desc, example, color, status, tagline } = data || {};
  const colors = COLOR_STYLES[color] || COLOR_STYLES.grape;
  const isLive = status === 'live';

  return (
    <div
      className={`
        group relative border-[3px] border-ink shadow-pop
        transition-all duration-200 hover:-translate-y-1 hover:shadow-pop-lg hover:rotate-0
        ${colors.soft} ${rotate || ''}
      `}
    >
      {/* Status badge */}
      <div className="absolute -right-2 -top-2 z-10">
        <span
          className={`
            inline-block border-[3px] border-ink px-2.5 py-0.5 font-display text-[10px]
            uppercase tracking-[0.15em] shadow-pop-xs
            ${isLive ? 'bg-mint text-white' : 'bg-lemon text-ink'}
          `}
        >
          {isLive ? 'Live' : 'Coming Soon'}
        </span>
      </div>

      <div className="p-5">
        {/* Color bar */}
        <div className={`mb-3 h-1.5 w-12 ${colors.bar}`} />

        <h3 className="mb-1 font-display text-lg uppercase tracking-tight heading-skew">
          {title}
        </h3>
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-ink-soft">{tagline}</p>
        <p className="mb-4 text-sm text-ink-soft">{desc}</p>

        {/* Example */}
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex items-center border-[3px] border-ink bg-white px-2.5 py-1 font-mono text-sm font-bold shadow-pop-xs">
            {example.in}
          </span>
          <span className="text-lg font-bold text-ink-soft">→</span>
          <span className={`inline-flex items-center border-[3px] border-ink px-2.5 py-1 font-mono text-sm font-bold text-white shadow-pop-xs ${colors.solid}`}>
            {example.out}
          </span>
        </div>

        {/* Button */}
        <Link
          to={path}
          className={`
            btn w-full text-xs ${isLive ? `${colors.solid} border-ink` : 'bg-white text-ink border-2 border-ink/30 cursor-default pointer-events-none opacity-60'}
          `}
        >
          {isLive ? 'Visualize Now' : 'Coming Soon'}
        </Link>
      </div>
    </div>
  );
}
