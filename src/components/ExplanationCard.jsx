/**
 * Titled wrapper for the explanation sections.
 * Gives every explainer the same numbered, sticker-headed frame.
 */
export default function ExplanationCard({ number, title, tint = 'bg-grape', children }) {
  return (
    <section className="panel overflow-hidden rounded-2xl" aria-label={title}>
      <div className={`flex flex-wrap items-center gap-3 border-b border-gray-100 ${tint} px-5 py-4`}>
        <span className="sticker bg-white border-transparent">{number}</span>
        <h3 className="font-display text-lg uppercase tracking-wide text-white">
          {title}
        </h3>
      </div>
      <div className="p-5 sm:p-7">{children}</div>
    </section>
  );
}
