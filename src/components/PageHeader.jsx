export default function PageHeader({ title, subtitle, algo, accent = 'bg-orange-500' }) {
  return (
    <div className="relative mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20 dark:opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgb(28 25 23 / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(28 25 23 / 0.05) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, black, transparent)',
        }}
      />

      <div className="relative flex flex-wrap items-center gap-2.5">
        <span className="sticker">Data Structure &middot; Stack</span>
        <span className={`sticker ${accent} text-white border-transparent`}>Algorithm &middot; {algo}</span>
      </div>

      <h1 className="heading-skew relative mt-6 text-4xl font-extrabold leading-[1.05] text-stone-900 sm:text-6xl dark:text-white">{title}</h1>

      {subtitle && (
        <p className="relative mt-4 max-w-2xl text-base font-medium leading-relaxed text-stone-600 sm:text-lg dark:text-bugbusters-soft">
          {subtitle}
        </p>
      )}
    </div>
  );
}
