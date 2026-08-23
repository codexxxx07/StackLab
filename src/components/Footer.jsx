import { Link } from 'react-router-dom';
import { CONVERSIONS } from '../data/conversions';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-100 bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-grape font-display text-sm text-white">
                S
              </div>
              <span className="font-display text-base uppercase tracking-tight heading-skew">
                Stack Lab
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
              A DSA learning tool that shows how expression conversions work step by step using the
              stack data structure.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-display text-sm uppercase tracking-wider">Conversions</h4>
            <ul className="flex flex-col gap-1.5">
              {CONVERSIONS.map((c) => (
                <li key={c.id}>
                  <Link
                    to={c.path}
                    className="text-sm font-medium text-ink-soft transition-colors hover:text-grape"
                  >
                    {c.title}
                    {c.status === 'soon' && (
                      <span className="ml-2 inline-block rounded-md bg-lemon-soft px-1.5 py-0.5 text-[10px] font-bold uppercase">
                        Soon
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-display text-sm uppercase tracking-wider">About</h4>
            <p className="text-sm leading-relaxed text-ink-soft">
              Built for academic purposes. Demonstrates how stacks are used to convert between
              infix, postfix, and prefix notations.
            </p>
            <div className="mt-3 flex gap-2">
              <span className="chip bg-grape-soft">DSA</span>
              <span className="chip bg-sky-soft">Stack</span>
              <span className="chip bg-mint-soft">Algorithms</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">
            DSA Expression Visualizer &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
