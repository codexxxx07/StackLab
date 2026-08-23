export default function ExplanationCard({ number, title, tint = 'bg-orange-500', children }) {
  return (
    <section className="card overflow-hidden rounded-2xl dark:bg-[#0f172a] dark:border-[rgba(255,255,255,0.06)]" aria-label={title}>
      <div className={`flex flex-wrap items-center gap-3 border-b border-stone-900/5 ${tint} px-5 py-4 dark:border-[rgba(255,255,255,0.06)]`}>
        <span className="sticker bg-white/90 border-transparent dark:bg-white/10">{number}</span>
        <h3 className="font-extrabold text-lg uppercase tracking-wide text-white">
          {title}
        </h3>
      </div>
      <div className="p-5 sm:p-7">{children}</div>
    </section>
  );
}
