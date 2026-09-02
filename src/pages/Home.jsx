import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowDown,
  FiArrowRight,
  FiEye,
  FiMousePointer,
  FiPlay,
  FiSliders,
  FiZap,
} from 'react-icons/fi';
import ConversionCard from '../components/ConversionCard';
import { CONVERSIONS, LIVE_CONVERSIONS } from '../data/conversions';
import { infixToPostfix } from '../utils/infixToPostfix';

const MARQUEE_WORDS = [
  'PUSH()', 'POP()', 'PEEK()', 'LIFO', 'PRECEDENCE', 'OPERAND',
  'OPERATOR', 'SHUNTING YARD', 'POSTFIX', 'INFIX', '^ * / + -',
];

export default function Home() {
  return (
    <div className="overflow-x-clip">
      <Hero />
      <Marquee />
      <HowItWorks />
      <ConversionsGrid />
      <WhyStacks />
      <FinalCta />
    </div>
  );
}

/* ---------------- HERO ---------------- */

function Hero() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 pb-28 pt-36 sm:px-6 sm:pt-44">
      {/* Background grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgb(28 25 23 / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(28 25 23 / 0.05) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, black, transparent)',
        }}
      />

      {/* Blurred decorative blobs */}
      <span aria-hidden className="absolute -left-32 top-20 size-96 rounded-full bg-orange-500/20 blur-3xl dark:bg-orange-500/4" />
      <span aria-hidden className="absolute -right-32 top-40 size-80 rounded-full bg-indigo-600/20 blur-3xl dark:bg-indigo-600/4" />
      <span aria-hidden className="absolute bottom-0 left-1/3 size-72 rounded-full bg-amber-500/15 blur-3xl dark:bg-amber-500/3" />

      {/* Floating deco shapes */}
      <span aria-hidden className="absolute -left-2 top-24 hidden size-16 -rotate-12 rounded-2xl bg-amber-500 animate-bob md:block dark:bg-bugbusters-card dark:border dark:border-[rgba(255,255,255,0.06)]" style={{ boxShadow: '0 8px 24px rgba(245,158,11,0.2)' }} />
      <span aria-hidden className="absolute right-4 top-40 hidden size-12 rotate-12 rounded-full bg-indigo-600 animate-bob-slow md:block dark:bg-bugbusters-card dark:border dark:border-[rgba(255,255,255,0.06)]" style={{ boxShadow: '0 8px 24px rgba(79,70,229,0.2)' }} />
      <span aria-hidden className="absolute bottom-10 left-10 hidden size-9 rotate-45 rounded-xl bg-pink-500 animate-bob lg:block dark:bg-bugbusters-card dark:border dark:border-[rgba(255,255,255,0.06)]" style={{ boxShadow: '0 8px 24px rgba(236,72,153,0.2)' }} />
      <span aria-hidden className="absolute -right-1 bottom-20 hidden size-14 -rotate-6 rounded-2xl bg-emerald-500 animate-bob-slow lg:block dark:bg-bugbusters-card dark:border dark:border-[rgba(255,255,255,0.06)]" style={{ boxShadow: '0 8px 24px rgba(16,185,129,0.2)' }} />

      <div className="relative text-center">
        {/* Eyebrow badge */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="section-eyebrow -rotate-1">
            <span className="inline-block size-1.5 rounded-full bg-orange-500" />
            Data Structures &middot; Stack Algorithm
          </span>
        </div>

        <h1 className="mt-7 text-5xl font-extrabold leading-[0.95] tracking-tight text-stone-900 sm:text-6xl lg:text-7xl dark:text-white">
          DSA Expression
          <span className="mt-1 block bg-linear-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent dark:from-cyan-300 dark:via-bugbusters-blue dark:to-bugbusters-purple">
            Visualizer
          </span>
        </h1>

        {/* Skewed accent bar under title */}
        <div className="mx-auto mt-4 flex items-center justify-center gap-2">
          <span className="h-1.5 w-16 -rotate-2 rounded-full bg-linear-to-r from-orange-500 to-amber-500" />
          <span className="h-1.5 w-8 rotate-1 rounded-full bg-linear-to-r from-indigo-600 to-violet-500" />
          <span className="h-1.5 w-4 -rotate-1 rounded-full bg-linear-to-r from-emerald-500 to-teal-400" />
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-lg font-normal leading-relaxed text-stone-600 sm:text-xl dark:text-bugbusters-soft">
          Understand expression conversion by{' '}
          <mark className="rounded-lg bg-amber-500/20 px-1.5 py-0.5 font-semibold text-stone-900 dark:bg-cyan-400/20 dark:text-white">seeing every step happen</mark> &mdash; watch operands
          sprint to the output while operators wait their turn on the stack.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/infix-to-postfix"
            className="btn -rotate-1 bg-linear-to-r from-orange-500 to-amber-500 px-8 py-3.5 text-base text-white shadow-glow hover:rotate-0 hover:shadow-lift dark:from-bugbusters-cyan dark:via-bugbusters-blue dark:to-bugbusters-purple dark:shadow-none dark:hover:shadow-dark-card"
          >
            Start Visualizing <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#conversions"
            className="btn rotate-1 bg-white px-8 py-3.5 text-base border border-stone-900/5 hover:rotate-0 dark:bg-bugbusters-card dark:border-[rgba(255,255,255,0.06)] dark:text-white dark:hover:border-[rgba(255,255,255,0.12)]"
          >
            Explore Conversions
          </a>
        </div>
      </div>

      <div className="relative mt-14">
        <HeroDemo />
      </div>
    </section>
  );
}

/** Self-playing miniature of the A+B*C conversion. Loops forever. */
function HeroDemo() {
  const { steps } = useMemo(() => infixToPostfix('A+B*C'), []);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setTick((v) => (v >= steps.length + 2 ? 0 : v + 1));
    }, 850);
    return () => clearInterval(t);
  }, [steps.length]);

  const step = steps[Math.min(tick, steps.length - 1)];

  return (
    <div className="panel mx-auto max-w-3xl -rotate-1 p-5 transition-all duration-300 hover:rotate-0 sm:p-7 dark:bg-bugbusters-card dark:border-[rgba(255,255,255,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="sticker -rotate-1 bg-orange-500 text-white border-transparent">Live demo &middot; looping</span>
        <code className="font-mono text-xs font-bold uppercase tracking-widest text-stone-600 dark:text-gray-400">
          A+B*C &rarr; ABC*+
        </code>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.2fr)]">
        {/* Input stream */}
        <div className="rounded-2xl border border-dashed border-stone-900/10 bg-cream p-3 dark:border-[rgba(255,255,255,0.06)] dark:bg-[#0a0a0a]">
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-stone-500 dark:text-gray-500">Input</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[...'A+B*C'].map((c, i) => (
              <span
                key={i}
                  className={`tile size-8 text-base transition-all duration-200 ${
                    i === step.charIndex ? 'z-10 scale-110 bg-rose-500 text-white border-rose-500' : i < step.charIndex ? 'opacity-30' : 'bg-white dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.06)]'
                  }`}
              >
                {c}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.25em] text-stone-500 dark:text-gray-500">Output tape</p>
          <p className="mt-1 min-h-7 break-all font-mono text-xl font-extrabold text-pink-500">
            {step.output}
            <span className="ml-0.5 inline-block h-5 w-0.5 animate-blink bg-stone-900 align-middle dark:bg-white" />
          </p>
        </div>

        {/* Arrow */}
        <div className="hidden items-center justify-center sm:flex">
          <FiArrowDown className="-rotate-90 size-8 text-rose-500" strokeWidth={3} />
        </div>

        {/* Stack */}
        <div className="rounded-2xl border border-dashed border-stone-900/10 bg-indigo-600/5 p-3 dark:border-[rgba(255,255,255,0.06)] dark:bg-indigo-600/6">
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-stone-500 dark:text-gray-500">
            Stack &middot; {step.stack.length === 0 ? 'empty' : `top = ${step.stack[step.stack.length - 1]}`}
          </p>
          <div className="mt-2 flex min-h-20 flex-col-reverse items-start gap-1.5">
            {step.stack.map((v, i) => (
              <span key={`${i}-${v}`} className="tile min-w-10 bg-white px-2 py-1 text-base dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.06)]">
                {v}
              </span>
            ))}
            {step.stack.length === 0 && (
              <span className="font-mono text-[11px] uppercase tracking-widest text-stone-400 dark:text-gray-500">&mdash;</span>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-2 border-t border-dashed border-stone-900/10 pt-3 text-sm font-bold dark:border-white/10">
        <FiZap className="shrink-0 text-rose-500" />
        {step.reason?.[0]?.text}
      </p>
    </div>
  );
}

/* ---------------- MARQUEE ---------------- */

function Marquee() {
  const row = [...MARQUEE_WORDS, ...MARQUEE_WORDS];
  const dotColors = ['bg-amber-500', 'bg-orange-500', 'bg-emerald-500', 'bg-indigo-600'];
  return (
    <div className="bg-stone-900 py-3.5 text-cream dark:bg-[#050505]" aria-hidden>
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap pr-8">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-8 font-extrabold text-sm tracking-[0.2em] uppercase text-cream dark:text-bugbusters-soft">
            {w}
            <span className={`size-2 rounded-full ${dotColors[i % 4]}`} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- HOW IT WORKS ---------------- */

const STEPS_INFO = [
  {
    icon: FiMousePointer,
    gradient: 'from-orange-500 to-amber-500',
    shadow: 'shadow-glow',
    darkShadow: 'dark:shadow-none',
    title: 'Type an expression',
    desc: 'Any infix like A+B*C or postfix like ABC*+. Friendly validation keeps mistakes out.',
  },
  {
    icon: FiSliders,
    gradient: 'from-indigo-600 to-violet-500',
    shadow: 'shadow-glow-indigo',
    darkShadow: 'dark:shadow-none',
    title: 'Drive the machine',
    desc: 'Play, pause, scrub step-by-step or crank the speed. You are in full control.',
  },
  {
    icon: FiEye,
    gradient: 'from-emerald-500 to-teal-400',
    shadow: '',
    darkShadow: '',
    title: 'Watch it click',
    desc: 'Stack, output tape and a narrated operation panel update together. It finally makes sense.',
  },
];

function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="grid gap-6 md:grid-cols-3">
        {STEPS_INFO.map((s, i) => (
          <div
            key={s.title}
            className={`card card-hover card-shimmer p-6 ${i % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
          >
            <div className="flex items-center justify-between">
              <span className={`grid size-12 place-items-center rounded-2xl bg-linear-to-br ${s.gradient} text-white ${s.shadow} ${s.darkShadow}`}>
                <s.icon className="size-6" />
              </span>
              <span className="font-extrabold text-4xl text-stone-900 dark:text-white/5">0{i + 1}</span>
            </div>
            <h3 className="heading-skew mt-4 text-lg text-stone-900 dark:text-white">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-bugbusters-soft">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- CONVERSION CARDS ---------------- */

function ConversionsGrid() {
  const live = CONVERSIONS.filter((c) => c.status === 'live');

  return (
    <section id="conversions" className="mx-auto max-w-6xl scroll-mt-28 px-4 pb-8 sm:px-6">
      <div className="text-center">
        <span className="section-eyebrow rotate-1">
          <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
          Pick your lab
        </span>
        <h2 className="heading-skew mt-4 text-3xl font-extrabold text-stone-900 sm:text-5xl dark:text-white">Available Now</h2>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {live.map((c, i) => (
          <ConversionCard key={c.id} conv={c} rotate={i % 2 === 0 ? '-rotate-1' : 'rotate-1'} />
        ))}
      </div>
    </section>
  );
}

/* ---------------- WHY STACKS ---------------- */

function WhyStacks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="card overflow-hidden p-0 dark:bg-bugbusters-card dark:border-[rgba(255,255,255,0.06)]">
        <div className="grid md:grid-cols-[1.3fr_1fr]">
          <div className="p-7 sm:p-10">
            <span className="section-eyebrow -rotate-1">
              <span className="inline-block size-1.5 rounded-full bg-pink-500" />
              Why stacks?
            </span>
            <h2 className="heading-skew mt-4 text-2xl font-extrabold text-stone-900 sm:text-4xl dark:text-white">
              Operators need patience.<br />Stacks give them memory.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-stone-600 sm:text-base dark:text-bugbusters-soft">
              While scanning an expression, an operator often arrives{' '}
              <b className="text-stone-900 dark:text-white">before</b> it can be applied &mdash; its second operand hasn&apos;t
              been read yet. A stack parks those waiting operators in exactly the right order
              (Last-In-First-Out) so higher-priority work finishes first.
            </p>
            <ul className="mt-5 space-y-2 text-sm font-semibold">
              <li className="flex items-start gap-2 text-stone-700 dark:text-gray-300">
                <span className="chip py-0.5! bg-emerald-500/10 text-emerald-500">push()</span> drop an operator onto the pile
              </li>
              <li className="flex items-start gap-2 text-stone-700 dark:text-gray-300">
                <span className="chip py-0.5! bg-rose-500/10 text-rose-500">pop()</span> take the most recent one back
              </li>
              <li className="flex items-start gap-2 text-stone-700 dark:text-gray-300">
                <span className="chip py-0.5! bg-amber-500/10 text-amber-500">peek()</span> check who&apos;s on top before deciding
              </li>
            </ul>
            <Link to="/about" className="btn mt-7 bg-white border border-stone-900/5 dark:bg-bugbusters-card dark:border-[rgba(255,255,255,0.06)] dark:text-white dark:hover:border-[rgba(255,255,255,0.12)]">
              Learn more <FiArrowRight />
            </Link>
          </div>

          {/* Plate stack illustration */}
          <div className="relative border-t border-stone-900/5 bg-cream p-7 sm:p-10 md:border-l md:border-t-0 dark:border-[rgba(255,255,255,0.06)] dark:bg-[#050505]">
            <div className="mx-auto flex w-fit flex-col-reverse items-center gap-2">
              {[
                { v: '+', c: 'bg-orange-500/10 border-orange-500/30 text-orange-500' },
                { v: '*', c: 'bg-amber-500/10 border-amber-500/30 text-amber-500' },
                { v: 'C', c: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' },
                { v: 'B', c: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' },
              ].map((b, i) => (
                <span key={i} className={`tile w-28 px-4 py-3 text-xl ${b.c}`}>
                  {b.v}
                </span>
              ))}
              <span className="mt-3 h-2 w-36 rounded-full bg-stone-300 dark:bg-gray-700" />
            </div>
            <span className="sticker absolute right-6 top-8 rotate-3 bg-rose-500 text-white border-transparent sm:right-10">
              TOP &rsaquo;
            </span>
            <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500 dark:text-gray-500">
              LIFO &mdash; last in, first out
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FINAL CTA ---------------- */

function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
      <div className="card relative -rotate-1 overflow-hidden bg-linear-to-br from-orange-500 to-amber-500 p-8 text-center text-white sm:p-12 shadow-glow dark:from-bugbusters-cyan dark:via-bugbusters-blue dark:to-bugbusters-purple dark:shadow-none">
        <span aria-hidden className="absolute -left-6 -top-6 size-24 rotate-12 rounded-2xl bg-white opacity-20" />
        <span aria-hidden className="absolute -bottom-8 -right-6 size-28 -rotate-6 rounded-2xl bg-white opacity-20" />

        <h2 className="heading-skew relative text-3xl font-extrabold sm:text-5xl">
          Ready to see stacks<br className="hidden sm:block" /> do real work?
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-sm font-semibold text-white/85 sm:text-base">
          Two full labs are live. Ten minutes with the step slider beats an hour of re-reading notes.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          {LIVE_CONVERSIONS.map((c) => (
            <Link key={c.id} to={c.path} className="btn bg-white px-6 py-3.5 text-base text-stone-900 border-transparent shadow-soft hover:shadow-lift">
              {c.title} <FiPlay />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}