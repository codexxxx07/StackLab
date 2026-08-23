import { Link } from 'react-router-dom';
import { CONVERSIONS } from '../data/conversions';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-900/5 bg-cream-dark dark:border-[rgba(255,255,255,0.06)] dark:bg-[#050505]">
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 font-extrabold text-sm text-white">
                S
              </div>
              <span className="font-extrabold text-base uppercase tracking-tight heading-skew text-stone-900 dark:text-white">
                Stack Lab
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-stone-600 dark:text-[#9ca3af]">
              A DSA learning tool that shows how expression conversions work step by step using the
              stack data structure.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-extrabold text-sm uppercase tracking-wider text-stone-900 dark:text-white">Conversions</h4>
            <ul className="flex flex-col gap-1.5">
              {CONVERSIONS.map((c) => (
                <li key={c.id}>
                  <Link
                    to={c.path}
                    className="text-sm font-medium text-stone-600 transition-colors hover:text-orange-500 dark:text-[#9ca3af] dark:hover:text-white"
                  >
                    {c.title}
                    {c.status === 'soon' && (
                      <span className="ml-2 inline-block rounded-lg bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-500">
                        Soon
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-extrabold text-sm uppercase tracking-wider text-stone-900 dark:text-white">About</h4>
            <p className="text-sm leading-relaxed text-stone-600 dark:text-bugbusters-soft">
              Built for academic purposes. Demonstrates how stacks are used to convert between
              infix, postfix, and prefix notations.
            </p>
            <div className="mt-3 flex gap-2">
              <span className="chip bg-indigo-600/10 text-indigo-600">DSA</span>
              <span className="chip bg-orange-500/10 text-orange-500">Stack</span>
              <span className="chip bg-emerald-500/10 text-emerald-500">Algorithms</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-stone-900/5 pt-4 text-center dark:border-[rgba(255,255,255,0.06)]">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-gray-500">
            DSA Expression Visualizer &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
