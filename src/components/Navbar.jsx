import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { FiSun, FiMoon } from 'react-icons/fi';
import { CONVERSIONS } from '../data/conversions';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  ...CONVERSIONS.map((c) => ({ to: c.path, label: c.title })),
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bb-theme') === 'dark';
    }
    return false;
  });

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('bb-theme', next ? 'dark' : 'light');
  };

  // Apply initial dark mode on mount
  if (dark && typeof document !== 'undefined' && !document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.add('dark');
  }

  return (
    <nav className="sticky top-0 z-50 bg-cream/80 backdrop-blur-xl dark:bg-black/80">
      <div className="mx-auto mt-3 max-w-6xl rounded-2xl border border-stone-900/5 bg-white/90 px-4 py-3 shadow-soft lg:px-6 dark:border-white/10 dark:bg-bugbusters-card/90">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white" style={{ boxShadow: 'var(--shadow-glow)' }}>
              <span className="font-extrabold text-sm leading-none">S</span>
            </div>
            <span className="hidden font-extrabold text-base uppercase tracking-tight sm:block heading-skew text-stone-900 dark:text-white">
              Stack Lab
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-glow'
                      : 'text-stone-600 hover:bg-orange-500/10 hover:text-orange-500 dark:text-gray-300 dark:hover:text-cyan-300'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDark}
              className="btn rounded-xl border border-stone-900/5 bg-white px-3 py-2 dark:border-white/10 dark:bg-bugbusters-card"
              aria-label="Toggle theme"
            >
              {dark ? <FiSun size={18} className="text-amber-400" /> : <FiMoon size={18} className="text-indigo-600" />}
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="btn rounded-xl border border-stone-900/5 bg-white px-3 py-2 lg:hidden dark:border-white/10 dark:bg-bugbusters-card"
              aria-label="Toggle menu"
            >
              {open ? <HiX size={20} /> : <HiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="mx-4 mt-2 rounded-2xl border border-stone-900/5 bg-white p-3 shadow-soft lg:hidden dark:border-white/10 dark:bg-bugbusters-card">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2.5 text-sm font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white'
                      : 'text-stone-600 hover:bg-orange-500/10 dark:text-gray-300 dark:hover:bg-white/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
