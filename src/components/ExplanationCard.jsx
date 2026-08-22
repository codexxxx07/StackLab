/**
 * Titled wrapper for the explanation sections.
 * Gives every explainer the same numbered, sticker-headed frame.
 */
export default function ExplanationCard({ number, title, tint = 'bg-grape', children }) {
  return (
    <section className="panel p-0" aria-label={title}>
      <div className={`flex flex-wrap items-center gap-3 border-b-[3px] border-ink ${tint} px-5 py-4`}>
        <span className="sticker bg-white">{number}</span>
        <h3 className="font-display text-lg uppercase tracking-wide text-white [text-shadow:2px_2px_0_var(--color-ink)]">
          {title}
        </h3>
      </div>
      <div className="p-5 sm:p-7">{children}</div>
    </section>
  );
}
