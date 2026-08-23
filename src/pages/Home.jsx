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
import { CONVERSIONS, LIVE_CONVERSIONS, SOON_CONVERSIONS } from '../data/conversions';
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
    <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16">
      {/* Floating deco shapes — soft rounded, no hard borders */}
      <span aria-hidden className="absolute -left-2 top-24 hidden size-16 -rotate-12 rounded-2xl bg-lemon animate-bob md:block" style={{ boxShadow: '0 8px 24px rgba(255,200,61,0.2)' }} />
      <span aria-hidden className="absolute right-4 top-40 hidden size-12 rotate-12 rounded-full bg-sky animate-bob-slow md:block" style={{ boxShadow: '0 8px 24px rgba(76,111,255,0.2)' }} />
      <span aria-hidden className="absolute bottom-10 left-10 hidden size-9 rotate-45 rounded-xl bg-flamingo animate-bob lg:block" style={{ boxShadow: '0 8px 24px rgba(255,79,139,0.2)' }} />
      <span aria-hidden className="absolute -right-1 bottom-20 hidden size-14 -rotate-6 rounded-2xl bg-mint animate-bob-slow lg:block" style={{ boxShadow: '0 8px 24px rgba(0,201,154,0.2)' }} />

      <div className="text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="sticker -rotate-2 bg-grape text-white border-transparent">Data Structures</span>
          <span className="sticker rotate-1">Stack Algorithm</span>
          <span className="sticker -rotate-1 bg-lemon border-lemon/30">Step-by-step</span>
        </div>

        <h1 className="heading-skew mt-7 text-[42px] leading-[0.95] sm:text-7xl">
          EXPRESSION
          <span className="mt-1 block text-grape">VISUALIZED.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold leading-relaxed text-ink-soft sm:text-xl">
          Understand expression conversion by{' '}
          <mark className="rounded-md bg-lemon/60 px-1.5 py-0.5">seeing every step happen</mark> &mdash; watch operands
          sprint to the output while operators wait their turn on the stack.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/infix-to-postfix" className="btn bg-grape px-7 py-3.5 text-base text-white border-transparent">
            Start Visualizing <FiArrowRight />
          </Link>
          <a href="#conversions" className="btn bg-white px-7 py-3.5 text-base border border-gray-200">
            Explore Conversions
          </a>
        </div>
      </div>

      <div className="mt-14">
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
    <div className="panel mx-auto max-w-3xl rotate-1 p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="sticker -rotate-1 bg-coral text-white border-transparent">Live demo &middot; looping</span>
        <code className="font-mono text-xs font-bold uppercase tracking-widest text-ink-soft">
          A+B*C &rarr; ABC*+
        </code>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.2fr)]">
        {/* Input stream */}
        <div className="rounded-xl border border-dashed border-gray-200 bg-paper p-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-ink-soft">Input</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[...'A+B*C'].map((c, i) => (
              <span
                key={i}
                className={`tile size-8 text-base ${
                  i === step.charIndex ? 'z-10 scale-110 bg-coral text-white border-coral' : i < step.charIndex ? 'opacity-30' : 'bg-white'
                }`}
              >
                {c}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.25em] text-ink-soft">Output tape</p>
          <p className="mt-1 min-h-7 break-all font-mono text-xl font-extrabold text-flamingo">
            {step.output}
            <span className="ml-0.5 inline-block h-5 w-1.5 animate-blink bg-ink align-middle" />
          </p>
        </div>

        {/* Arrow */}
        <div className="hidden items-center justify-center sm:flex">
          <FiArrowDown className="-rotate-90 size-8 text-coral" strokeWidth={3} />
        </div>

        {/* Stack */}
        <div className="rounded-xl border border-dashed border-gray-200 bg-sky-soft/50 p-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-ink-soft">
            Stack &middot; {step.stack.length === 0 ? 'empty' : `top = ${step.stack[step.stack.length - 1]}`}
          </p>
          <div className="mt-2 flex min-h-20 flex-col-reverse items-start gap-1.5">
            {step.stack.map((v, i) => (
              <span key={`${i}-${v}`} className="tile min-w-10 bg-white px-2 py-1 text-base">
                {v}
              </span>
            ))}
            {step.stack.length === 0 && (
              <span className="font-mono text-[11px] uppercase tracking-widest text-ink/30">&mdash;</span>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-2 border-t border-dashed border-gray-200 pt-3 text-sm font-bold">
        <FiZap className="shrink-0 text-coral" />
        {step.reason?.[0]?.text}
      </p>
    </div>
  );
}

/* ---------------- MARQUEE ---------------- */

function Marquee() {
  const row = [...MARQUEE_WORDS, ...MARQUEE_WORDS];
  return (
    <div className="bg-ink py-3.5 text-paper" aria-hidden>
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap pr-8">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-8 font-display text-sm tracking-[0.2em]">
            {w}
            <span className={`size-2 rounded-full ${['bg-lemon', 'bg-coral', 'bg-mint', 'bg-sky'][i % 4]}`} />
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
    color: 'bg-grape',
    title: 'Type an expression',
    desc: 'Any infix like A+B*C or postfix like ABC*+. Friendly validation keeps mistakes out.',
  },
  {
    icon: FiSliders,
    color: 'bg-coral',
    title: 'Drive the machine',
    desc: 'Play, pause, scrub step-by-step or crank the speed. You are in full control.',
  },
  {
    icon: FiEye,
    color: 'bg-mint',
    title: 'Watch it click',
    desc: 'Stack, output tape and a narrated operation panel update together. It finally makes sense.',
  },
];

function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-6 md:grid-cols-3">
        {STEPS_INFO.map((s, i) => (
          <div
            key={s.title}
            className={`panel p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg ${
              i % 2 === 0 ? '-rotate-1' : 'rotate-1'
            } hover:rotate-0`}
          >
            <div className="flex items-center justify-between">
              <span className={`grid size-12 place-items-center rounded-xl text-white ${s.color}`} style={{ boxShadow: 'var(--shadow-soft-sm)' }}>
                <s.icon className="size-6" />
              </span>
              <span className="font-display text-4xl text-ink/10">0{i + 1}</span>
            </div>
            <h3 className="heading-skew mt-4 text-lg">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- CONVERSION CARDS ---------------- */

function ConversionsGrid() {
  const live = CONVERSIONS.filter((c) => c.status === 'live');
  const soon = SOON_CONVERSIONS;

  return (
    <section id="conversions" className="mx-auto max-w-6xl scroll-mt-28 px-4 pb-8 sm:px-6">
      <div className="text-center">
        <span className="sticker rotate-1 bg-mint text-white border-transparent">Pick your lab</span>
        <h2 className="heading-skew mt-4 text-3xl sm:text-5xl">Available Now</h2>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {live.map((c, i) => (
          <ConversionCard key={c.id} conv={c} rotate={i % 2 === 0 ? '-rotate-1' : 'rotate-1'} />
        ))}
      </div>

      <div className="mt-16 text-center">
        <span className="sticker -rotate-1">Locked</span>
        <h2 className="heading-skew mt-4 text-3xl sm:text-4xl">Coming Soon</h2>
        <p className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-ink-soft">
          Same labs, new algorithms &mdash; currently being wired up
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {soon.map((c, i) => (
          <ConversionCard
            key={c.id}
            conv={c}
            rotate={['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2'][i % 4]}
          />
        ))}
      </div>
    </section>
  );
}

/* ---------------- WHY STACKS ---------------- */

function WhyStacks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="panel overflow-hidden p-0">
        <div className="grid md:grid-cols-[1.3fr_1fr]">
          <div className="p-7 sm:p-10">
            <span className="sticker -rotate-1 bg-flamingo text-white border-transparent">Why stacks?</span>
            <h2 className="heading-skew mt-4 text-2xl sm:text-4xl">
              Operators need patience.<br />Stacks give them memory.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-soft sm:text-base">
              While scanning an expression, an operator often arrives{' '}
              <b className="text-ink">before</b> it can be applied &mdash; its second operand hasn&apos;t
              been read yet. A stack parks those waiting operators in exactly the right order
              (Last-In-First-Out) so higher-priority work finishes first.
            </p>
            <ul className="mt-5 space-y-2 text-sm font-semibold">
              <li className="flex items-start gap-2">
                <span className="chip !py-0.5 bg-mint-soft border-mint/30">push()</span> drop an operator onto the pile
              </li>
              <li className="flex items-start gap-2">
                <span className="chip !py-0.5 bg-coral-soft border-coral/30">pop()</span> take the most recent one back
              </li>
              <li className="flex items-start gap-2">
                <span className="chip !py-0.5 bg-lemon-soft border-lemon/30">peek()</span> check who&apos;s on top before deciding
              </li>
            </ul>
            <Link to="/about" className="btn mt-7 bg-white border border-gray-200">
              Learn more <FiArrowRight />
            </Link>
          </div>

          {/* Plate stack illustration */}
          <div className="relative border-t border-gray-100 bg-cream p-7 sm:p-10 md:border-l md:border-t-0">
            <div className="mx-auto flex w-fit flex-col-reverse items-center gap-2">
              {[
                { v: '+', c: 'bg-grape-soft border-grape/30' },
                { v: '*', c: 'bg-lemon border-lemon/30' },
                { v: 'C', c: 'bg-mint-soft border-mint/30' },
                { v: 'B', c: 'bg-mint-soft border-mint/30' },
              ].map((b, i) => (
                <span key={i} className={`tile w-28 px-4 py-3 text-xl ${b.c}`}>
                  {b.v}
                </span>
              ))}
              <span className="mt-3 h-2 w-36 rounded-full bg-gray-300" />
            </div>
            <span className="sticker absolute right-6 top-8 rotate-3 bg-coral text-white border-transparent sm:right-10">
              TOP &rsaquo;
            </span>
            <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-ink-soft">
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
      <div className="panel relative -rotate-1 overflow-hidden bg-grape p-8 text-center text-white sm:p-12" style={{ boxShadow: 'var(--shadow-glow-grape)' }}>
        <span aria-hidden className="absolute -left-6 -top-6 size-24 rotate-12 rounded-2xl bg-lemon opacity-90" />
        <span aria-hidden className="absolute -bottom-8 -right-6 size-28 -rotate-6 rounded-2xl bg-mint opacity-90" />

        <h2 className="heading-skew relative text-3xl sm:text-5xl">
          Ready to see stacks<br className="hidden sm:block" /> do real work?
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-sm font-semibold text-white/85 sm:text-base">
          Two full labs are live. Ten minutes with the step slider beats an hour of re-reading notes.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          {LIVE_CONVERSIONS.map((c) => (
            <Link key={c.id} to={c.path} className="btn bg-white px-6 py-3.5 text-base text-ink border-transparent">
              {c.title} <FiPlay />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
