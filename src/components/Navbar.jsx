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
    <nav className="sticky top-0 z-50 border-b-[3px] border-ink bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center border-[3px] border-ink bg-grape text-white shadow-pop-sm">
            <span className="font-display text-lg leading-none">S</span>
          </div>
          <span className="hidden font-display text-lg uppercase tracking-tight sm:block heading-skew">
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
                `rounded-none border-2 border-ink px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                  isActive
                    ? 'bg-grape text-white shadow-pop-xs'
                    : 'bg-white text-ink hover:-translate-y-0.5 hover:shadow-pop-xs'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="btn border-2 px-3 py-2 lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <HiX size={20} /> : <HiMenu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t-[3px] border-ink bg-paper px-4 pb-4 lg:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `border-2 border-ink px-3 py-2 text-sm font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-grape text-white shadow-pop-xs'
                      : 'bg-white text-ink hover:bg-cream'
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
