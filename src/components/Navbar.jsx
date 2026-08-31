import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { HiMenu, HiX, HiChevronDown, HiArrowRight } from 'react-icons/hi';
import { FiSun, FiMoon } from 'react-icons/fi';
import { CONVERSIONS } from '../data/conversions';

const LIVE_CONVERSIONS = CONVERSIONS.filter((c) => c.status === 'live');

const COLOR_DOT = {
  orange: 'bg-orange-500',
  indigo: 'bg-indigo-600',
  emerald: 'bg-emerald-500',
  rose: 'bg-rose-500',
  pink: 'bg-pink-500',
  cyan: 'bg-cyan-400',
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bb-theme') === 'dark';
    }
    return false;
  });
  const dropdownRef = useRef(null);
  const location = useLocation();

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('bb-theme', next ? 'dark' : 'light');
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => {
    setDropdownOpen(false);
    setMobileDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isVisualizerActive = () => {
    return CONVERSIONS.some((c) => location.pathname === c.path);
  };

  return (
    <nav className="sticky top-0 z-50 px-4 pt-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between rounded-2xl border border-stone-900/5 bg-white/90 px-4 py-2.5 shadow-soft backdrop-blur-xl sm:px-6 lg:px-8 dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(15,23,42,0.85)]">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-amber-500 text-white transition-all duration-300 group-hover:-rotate-3 group-hover:scale-110" style={{ boxShadow: 'var(--shadow-glow)' }}>
              <span className="font-extrabold text-sm leading-none">S</span>
            </div>
            <span className="hidden font-extrabold text-base tracking-tight text-stone-900 sm:block dark:text-white">
              Stack Lab
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `group relative rounded-xl px-4 py-2 text-sm font-semibold tracking-tight transition-all duration-300 ${
                  isActive
                    ? 'bg-orange-500/10 text-orange-600 -rotate-1 dark:bg-white/6 dark:text-white'
                    : 'text-stone-600 hover:bg-stone-900/5 hover:text-stone-900 hover:-translate-y-0.5 dark:text-[#9ca3af] dark:hover:bg-white/4 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 h-0.75 w-5 -translate-x-1/2 rounded-full bg-orange-500 dark:bg-white" />
                  )}
                  Home
                </>
              )}
            </NavLink>

            {/* Visualizers Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`group flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold tracking-tight transition-all duration-300 ${
                  isVisualizerActive()
                    ? 'bg-orange-500/10 text-orange-600 -rotate-1 dark:bg-white/6 dark:text-white'
                    : 'text-stone-600 hover:bg-stone-900/5 hover:text-stone-900 hover:-translate-y-0.5 dark:text-[#9ca3af] dark:hover:bg-white/4 dark:hover:text-white'
                }`}
              >
                Visualizers
                <HiChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2">
                <div className="w-72 rounded-2xl border border-stone-900/5 bg-white p-2 shadow-lift backdrop-blur-xl animate-dropdown-in dark:border-[rgba(255,255,255,0.06)] dark:bg-bugbusters-card">
                  {/* Available */}
                  <div className="px-3 py-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 dark:text-[#6b7280]">
                      Available
                    </span>
                  </div>
                  {LIVE_CONVERSIONS.map((conv) => (
                    <Link
                      key={conv.id}
                      to={conv.path}
                      onClick={() => setDropdownOpen(false)}
                      className={`group/item flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
                        location.pathname === conv.path
                          ? 'bg-orange-500/10 text-orange-600 dark:bg-white/6 dark:text-white'
                          : 'text-stone-700 hover:bg-stone-900/5 hover:text-stone-900 dark:text-[#9ca3af] dark:hover:bg-white/4 dark:hover:text-white'
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${COLOR_DOT[conv.color]}`} />
                      <span className="flex-1 text-sm font-semibold">{conv.title}</span>
                      <HiArrowRight size={14} className="opacity-0 transition-all duration-200 group-hover/item:translate-x-0.5 group-hover/item:opacity-100" />
                    </Link>
                  ))}

                </div>
                </div>
              )}
            </div>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `group relative rounded-xl px-4 py-2 text-sm font-semibold tracking-tight transition-all duration-300 ${
                  isActive
                    ? 'bg-orange-500/10 text-orange-600 -rotate-1 dark:bg-white/6 dark:text-white'
                    : 'text-stone-600 hover:bg-stone-900/5 hover:text-stone-900 hover:-translate-y-0.5 dark:text-[#9ca3af] dark:hover:bg-white/4 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 h-0.75 w-5 -translate-x-1/2 rounded-full bg-orange-500 dark:bg-white" />
                  )}
                  About
                </>
              )}
            </NavLink>
          </div>

          {/* Right side: Theme Toggle + Mobile Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDark}
              className="group rounded-xl border border-stone-900/5 bg-white p-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft dark:border-[rgba(255,255,255,0.06)] dark:bg-bugbusters-card"
              aria-label="Toggle theme"
            >
              {dark ? (
                <FiSun size={18} className="text-amber-400 transition-transform duration-300 group-hover:rotate-90" />
              ) : (
                <FiMoon size={18} className="text-indigo-600 transition-transform duration-300 group-hover:-rotate-12" />
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="group rounded-xl border border-stone-900/5 bg-white p-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft lg:hidden dark:border-[rgba(255,255,255,0.06)] dark:bg-bugbusters-card"
              aria-label="Toggle menu"
            >
              {open ? (
                <HiX size={20} className="text-stone-700 transition-transform duration-300 group-hover:rotate-90 dark:text-[#9ca3af]" />
              ) : (
                <HiMenu size={20} className="text-stone-700 transition-transform duration-300 group-hover:scale-110 dark:text-[#9ca3af]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="mx-auto mt-2 w-full max-w-5xl rounded-2xl border border-stone-900/5 bg-white p-3 shadow-lift backdrop-blur-xl lg:hidden dark:border-[rgba(255,255,255,0.06)] dark:bg-bugbusters-card">
            <div className="flex flex-col gap-1">
              <NavLink
                to="/"
                end
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2.5 text-sm font-semibold tracking-tight transition-all duration-300 ${
                    isActive
                      ? 'bg-orange-500/10 text-orange-600 -rotate-1 dark:bg-white/6 dark:text-white'
                      : 'text-stone-600 hover:bg-stone-900/5 hover:text-stone-900 dark:text-[#9ca3af] dark:hover:bg-white/4 dark:hover:text-white'
                  }`
                }
              >
                Home
              </NavLink>

              {/* Mobile Visualizers Dropdown */}
              <div>
                <button
                  onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold tracking-tight transition-all duration-300 ${
                    isVisualizerActive()
                      ? 'bg-orange-500/10 text-orange-600 -rotate-1 dark:bg-white/6 dark:text-white'
                      : 'text-stone-600 hover:bg-stone-900/5 hover:text-stone-900 dark:text-[#9ca3af] dark:hover:bg-white/4 dark:hover:text-white'
                  }`}
                >
                  Visualizers
                  <HiChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${mobileDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {mobileDropdownOpen && (
                  <div className="ml-3 mt-1 rounded-xl border border-stone-900/5 bg-stone-900/2 p-2 dark:border-[rgba(255,255,255,0.06)] dark:bg-white/2">
                    <div className="px-3 py-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 dark:text-[#6b7280]">
                        Available
                      </span>
                    </div>
                    {LIVE_CONVERSIONS.map((conv) => (
                      <NavLink
                        key={conv.id}
                        to={conv.path}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
                          location.pathname === conv.path
                            ? 'bg-orange-500/10 text-orange-600 dark:bg-white/6 dark:text-white'
                            : 'text-stone-600 hover:bg-stone-900/5 hover:text-stone-900 dark:text-[#9ca3af] dark:hover:bg-white/4 dark:hover:text-white'
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${COLOR_DOT[conv.color]}`} />
                        <span className="text-sm font-semibold">{conv.title}</span>
                      </NavLink>
                    ))}

                  </div>
                )}
              </div>

              <NavLink
                to="/about"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2.5 text-sm font-semibold tracking-tight transition-all duration-300 ${
                    isActive
                      ? 'bg-orange-500/10 text-orange-600 -rotate-1 dark:bg-white/6 dark:text-white'
                      : 'text-stone-600 hover:bg-stone-900/5 hover:text-stone-900 dark:text-[#9ca3af] dark:hover:bg-white/4 dark:hover:text-white'
                  }`
                }
              >
                About
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
