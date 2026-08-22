import { Link } from 'react-router-dom';
import { FiArrowRight, FiBookOpen, FiCpu, FiEye, FiGitBranch, FiTarget } from 'react-icons/fi';
import PageHeader from '../components/PageHeader';
import { LIVE_CONVERSIONS } from '../data/conversions';

const NOTATIONS = [
  {
    name: 'Infix',
    example: 'A + B',
    tone: 'bg-grape text-white',
    desc: 'Operator between operands. Human-friendly, machine-ambiguous without precedence rules.',
  },
  {
    name: 'Postfix (Reverse Polish)',
    example: 'A B +',
    tone: 'bg-sky text-white',
    desc: 'Operator after operands. No brackets ever needed — perfect for stack evaluation.',
  },
  {
    name: 'Prefix (Polish)',
    example: '+ A B',
    tone: 'bg-lemon',
    desc: 'Operator before operands. Same bracket-free superpower, mirrored scanning.',
  },
];

export default function About() {
  return (
    <div>
      <PageHeader
        title={<>About this <span className="border-b-8 border-flamingo">Stack Lab</span></>}
        subtitle="An academic Data Structures project that turns invisible stack operations into something you can literally watch."
        algo="LEARN BY SEEING"
        accent="bg-flamingo"
      />

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        {/* Mission */}
        <section className="panel -rotate-[0.3deg] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="grid size-11 place-items-center border-[3px] border-ink bg-grape text-white shadow-pop-xs">
              <FiTarget />
            </span>
            <h2 className="heading-skew text-xl sm:text-2xl">The mission</h2>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-soft sm:text-base">
            Expression conversion is where most students first meet a stack doing real work — and
            it&apos;s usually taught as a wall of trace tables. This project flips that: the{' '}
            <b className="text-ink">algorithm generates steps, the UI plays them</b>. Push a block,
            pop a block, watch the output tape grow — with every decision narrated in plain
            language. If you can watch it, you can trace it on paper in your exam.
          </p>
        </section>

        {/* Notations */}
        <section>
          <div className="flex items-center gap-3">
            <span className="sticker rotate-1 bg-turq">Theory corner</span>
            <h2 className="heading-skew text-xl sm:text-2xl">Three ways to write A+B</h2>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {NOTATIONS.map((n, i) => (
              <div key={n.name} className={`panel p-5 ${['-rotate-1', 'rotate-1', '-rotate-1'][i]} hover:rotate-0 transition-transform duration-200`}>
                <span className={`tile w-full px-3 py-2.5 font-mono text-lg ${n.tone}`}>{n.example}</span>
                <h3 className="mt-3 font-display text-sm uppercase tracking-wide">{n.name}</h3>
                <p className="mt-2 text-xs leading-relaxed font-semibold text-ink-soft">{n.desc}</p>
              </div>
            ))}
          </div>

          {/* Precedence table */}
          <div className="panel mt-6 p-0">
            <div className="border-b-[3px] border-ink bg-cream px-5 py-3">
              <h3 className="font-display text-sm uppercase tracking-wide">Precedence used by the algorithms</h3>
            </div>
            <div className="grid grid-cols-2 divide-x-2 divide-ink/10 sm:grid-cols-4">
              {[
                { op: '^', p: 3, note: 'highest' },
                { op: '* /', p: 2, note: 'multiplicative' },
                { op: '+ -', p: 1, note: 'additive' },
                { op: '( )', p: '—', note: 'grouping floor' },
              ].map((row) => (
                <div key={row.op} className="p-4 text-center">
                  <code className={`tile mx-auto px-3 py-1.5 text-base ${row.p === 3 ? 'bg-coral text-white' : row.p === 2 ? 'bg-lemon' : row.p === 1 ? 'bg-sky text-white' : 'bg-paper'}`}>
                    {row.op}
                  </code>
                  <p className="mt-2 font-mono text-xs font-bold">P:{row.p}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-soft">{row.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to use */}
        <section>
          <div className="flex items-center gap-3">
            <span className="sticker -rotate-1 bg-mint text-white">Field guide</span>
            <h2 className="heading-skew text-xl sm:text-2xl">How to use a lab</h2>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {[
              { icon: FiCpu, t: 'Enter & validate', d: 'Type an expression or tap an example chip. Bad input gets a friendly warning, never a crash.' },
              { icon: FiEye, t: 'Scrub the timeline', d: 'Play, pause, step ±, jump via the table rows, or drag the speed slider from Slow to Fast.' },
              { icon: FiBookOpen, t: 'Read both explainers', d: 'Every lab ends with a plain-language idea and the full stack mechanics replay of YOUR expression.' },
            ].map((s, i) => (
              <div key={s.t} className="panel-flat flex gap-4 p-5">
                <span className={`grid size-11 shrink-0 place-items-center border-[3px] border-ink text-white shadow-pop-xs ${['bg-grape', 'bg-coral', 'bg-mint'][i]}`}>
                  <s.icon />
                </span>
                <div>
                  <h3 className="font-display text-sm">{s.t}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed font-semibold text-ink-soft">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech + roadmap */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="panel p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center border-[3px] border-ink bg-ink text-white shadow-pop-xs">
                <FiGitBranch />
              </span>
              <h2 className="heading-skew text-lg">Built with</h2>
            </div>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {['React 19', 'React Router', 'Tailwind CSS v4', 'Vite', 'react-icons'].map((t) => (
                <span key={t} className="chip bg-lemon-soft">{t}</span>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed font-semibold text-ink-soft">
              Algorithms live in pure util modules that emit step lists — the UI is just a player.
              That&apos;s what makes the four upcoming conversions plug-and-play.
            </p>
          </div>

          <div className="panel rotate-[0.4deg] p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center border-[3px] border-ink bg-flamingo text-white shadow-pop-xs">
                <FiArrowRight />
              </span>
              <h2 className="heading-skew text-lg">On the roadmap</h2>
            </div>
            <ul className="mt-4 space-y-2 font-mono text-sm font-bold">
              <li className="flex justify-between border-b-2 border-dashed border-ink/15 pb-1.5"><span>Infix → Prefix</span><span className="text-ink/30">soon</span></li>
              <li className="flex justify-between border-b-2 border-dashed border-ink/15 pb-1.5"><span>Prefix → Infix</span><span className="text-ink/30">soon</span></li>
              <li className="flex justify-between border-b-2 border-dashed border-ink/15 pb-1.5"><span>Postfix → Prefix</span><span className="text-ink/30">soon</span></li>
              <li className="flex justify-between"><span>Prefix → Postfix</span><span className="text-ink/30">soon</span></li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {LIVE_CONVERSIONS.map((c) => (
                <Link key={c.id} to={c.path} className="btn bg-white px-3 py-2 text-xs">
                  Open {c.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
