/**
 * Page header band for the conversion labs:
 * academic labels (DATA STRUCTURE / ALGORITHM) + big skewed title.
 */
export default function PageHeader({ title, subtitle, algo, accent = 'bg-grape' }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="sticker">Data Structure · Stack</span>
        <span className={`sticker ${accent} text-white border-transparent`}>Algorithm · {algo}</span>
      </div>

      <h1 className="heading-skew mt-6 text-4xl leading-[1.05] sm:text-6xl">{title}</h1>

      {subtitle && (
        <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-ink-soft sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
