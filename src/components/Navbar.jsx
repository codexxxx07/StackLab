import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { CONVERSIONS } from '../data/conversions';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  ...CONVERSIONS.map((c) => ({ to: c.path, label: c.title })),
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-paper/80 backdrop-blur-xl">
      <div className="mx-auto mt-3 max-w-6xl rounded-2xl border border-gray-100 bg-white/90 px-4 py-3 shadow-soft-sm lg:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-grape text-white" style={{ boxShadow: 'var(--shadow-glow-grape)' }}>
              <span className="font-display text-sm leading-none">S</span>
            </div>
            <span className="hidden font-display text-base uppercase tracking-tight sm:block heading-skew">
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
                  `rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-grape text-white'
                      : 'text-ink-soft hover:bg-gray-50 hover:text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="btn rounded-xl border border-gray-100 bg-white px-3 py-2 lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <HiX size={20} /> : <HiMenu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-4 mt-2 rounded-2xl border border-gray-100 bg-white p-3 shadow-soft lg:hidden">
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
                      ? 'bg-grape text-white'
                      : 'text-ink-soft hover:bg-gray-50'
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
