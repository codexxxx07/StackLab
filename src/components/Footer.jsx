import { Link } from 'react-router-dom';
import { CONVERSIONS } from '../data/conversions';
import { FaLinkedinIn, FaGithub, FaInstagram } from 'react-icons/fa6';

const SOCIAL_LINKS = [
  {
    icon: FaLinkedinIn,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/krishanjit-chakraborty-258a5237a',
    hoverColor: 'group-hover:text-[#0A66C2]',
    darkHoverColor: 'dark:group-hover:text-[#0A66C2]',
    hoverBorder: 'hover:border-[#0A66C2]/50',
    darkHoverBorder: 'dark:hover:border-[#0A66C2]/40',
    hoverShadow: 'hover:shadow-[0_0_15px_rgba(10,102,194,0.3)]',
    darkHoverShadow: 'dark:hover:shadow-[0_0_15px_rgba(10,102,194,0.4)]',
  },
  {
    icon: FaGithub,
    label: 'GitHub',
    href: 'https://github.com/codexxxx07',
    hoverColor: 'group-hover:text-gray-900',
    darkHoverColor: 'dark:group-hover:text-white',
    hoverBorder: 'hover:border-gray-900/30',
    darkHoverBorder: 'dark:hover:border-white/20',
    hoverShadow: 'hover:shadow-[0_0_12px_rgba(0,0,0,0.15)]',
    darkHoverShadow: 'dark:hover:shadow-[0_0_12px_rgba(255,255,255,0.15)]',
  },
  {
    icon: FaInstagram,
    label: 'Instagram',
    href: 'https://www.instagram.com/_k_r_i_s_h_x_',
    hoverColor: 'group-hover:text-[#E1306C]',
    darkHoverColor: 'dark:group-hover:text-[#E1306C]',
    hoverBorder: 'hover:border-[#E1306C]/50',
    darkHoverBorder: 'dark:hover:border-[#E1306C]/40',
    hoverShadow: 'hover:shadow-[0_0_15px_rgba(225,48,108,0.3)]',
    darkHoverShadow: 'dark:hover:shadow-[0_0_15px_rgba(225,48,108,0.4)]',
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-900/5 bg-cream-dark dark:border-[rgba(255,255,255,0.06)] dark:bg-[#050505]">
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-amber-500 font-extrabold text-sm text-white">
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

        <div className="mt-8 border-t border-stone-900/5 pt-8 text-center dark:border-[rgba(255,255,255,0.06)]">
          <p className="text-sm font-medium text-stone-600 dark:text-gray-400">
            &copy; 2026 Krish | Built with ❤️ and Code | All rights reserved.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            {SOCIAL_LINKS.map(({ icon: Icon, label, href, hoverColor, darkHoverColor, hoverBorder, darkHoverBorder, hoverShadow, darkHoverShadow }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`group flex h-10 w-10 items-center justify-center rounded-full border border-stone-900/5 bg-white transition-all duration-300 -rotate-1 hover:-translate-y-1 hover:rotate-0 hover:scale-105 ${hoverBorder} ${hoverShadow} dark:border-[rgba(255,255,255,0.08)] dark:bg-bugbusters-card ${darkHoverBorder} ${darkHoverShadow}`}
              >
                <Icon size={18} className={`text-stone-500 transition-colors duration-300 ${hoverColor} dark:text-gray-400 ${darkHoverColor}`} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
