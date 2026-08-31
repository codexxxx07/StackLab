import { FiBookOpen, FiCpu, FiEye, FiGitBranch, FiTarget } from 'react-icons/fi';
import PageHeader from '../components/PageHeader';

const NOTATIONS = [
  {
    name: 'Infix',
    example: 'A + B',
    tone: 'bg-orange-500 text-white border-orange-500',
    desc: 'Operator between operands. Human-friendly, machine-ambiguous without precedence rules.',
  },
  {
    name: 'Postfix (Reverse Polish)',
    example: 'A B +',
    tone: 'bg-indigo-600 text-white border-indigo-600',
    desc: 'Operator after operands. No brackets ever needed \u2014 perfect for stack evaluation.',
  },
  {
    name: 'Prefix (Polish)',
    example: '+ A B',
    tone: 'bg-amber-500/10 border-amber-500/30 text-amber-600',
    desc: 'Operator before operands. Same bracket-free superpower, mirrored scanning.',
  },
];

export default function About() {
  return (
    <div>
      <PageHeader
        title={<>About this <span className="border-b-8 border-pink-500">Stack Lab</span></>}
        subtitle="An academic Data Structures project that turns invisible stack operations into something you can literally watch."
        algo="LEARN BY SEEING"
        accent="bg-pink-500"
      />

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        {/* Mission */}
        <section className="card rotate-[-0.3deg] p-6 transition-all duration-300 hover:rotate-0 sm:p-8 dark:bg-bugbusters-card dark:border-[rgba(255,255,255,0.06)]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-linear-to-br from-orange-500 to-amber-500 text-white" style={{ boxShadow: '0 8px 24px rgba(249,115,22,0.2)' }}>
              <FiTarget />
            </span>
            <h2 className="heading-skew text-xl font-extrabold text-stone-900 sm:text-2xl dark:text-white">The mission</h2>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-stone-600 sm:text-base dark:text-bugbusters-soft">
            Expression conversion is where most students first meet a stack doing real work &mdash; and
            it&apos;s usually taught as a wall of trace tables. This project flips that: the{' '}
            <b className="text-stone-900 dark:text-white">algorithm generates steps, the UI plays them</b>. Push a block,
            pop a block, watch the output tape grow &mdash; with every decision narrated in plain
            language. If you can watch it, you can trace it on paper in your exam.
          </p>
        </section>

        {/* Notations */}
        <section>
          <div className="flex items-center gap-3">
            <span className="section-eyebrow rotate-1">
              <span className="inline-block size-1.5 rounded-full bg-cyan-400" />
              Theory corner
            </span>
            <h2 className="heading-skew text-xl font-extrabold text-stone-900 sm:text-2xl dark:text-white">Three ways to write A+B</h2>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {NOTATIONS.map((n, i) => (
              <div key={n.name} className={`card card-hover p-5 ${['-rotate-1', 'rotate-1', '-rotate-1'][i]}`}>
                <span className={`tile w-full px-3 py-2.5 font-mono text-lg ${n.tone}`}>{n.example}</span>
                <h3 className="mt-3 font-extrabold text-sm uppercase tracking-wide text-stone-900 dark:text-white">{n.name}</h3>
                <p className="mt-2 text-xs leading-relaxed font-semibold text-stone-600 dark:text-bugbusters-soft">{n.desc}</p>
              </div>
            ))}
          </div>

          {/* Precedence table */}
          <div className="card mt-6 overflow-hidden dark:bg-bugbusters-card dark:border-[rgba(255,255,255,0.06)]">
            <div className="border-b border-stone-900/5 bg-cream-dark px-5 py-3 dark:border-[rgba(255,255,255,0.06)] dark:bg-[#050505]">
              <h3 className="font-extrabold text-sm uppercase tracking-wide text-stone-900 dark:text-white">Precedence used by the algorithms</h3>
            </div>
            <div className="grid grid-cols-2 divide-x divide-stone-900/5 sm:grid-cols-4 dark:divide-[rgba(255,255,255,0.06)]">
              {[
                { op: '^', p: 3, note: 'highest' },
                { op: '* /', p: 2, note: 'multiplicative' },
                { op: '+ -', p: 1, note: 'additive' },
                { op: '( )', p: '\u2014', note: 'grouping floor' },
              ].map((row) => (
                <div key={row.op} className="p-4 text-center">
                  <code className={`tile mx-auto px-3 py-1.5 text-base ${row.p === 3 ? 'bg-rose-500 text-white border-rose-500' : row.p === 2 ? 'bg-amber-500/10 border-amber-500/30 text-amber-600' : row.p === 1 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-cream border-stone-900/5 dark:bg-[#0a0a0a] dark:border-[rgba(255,255,255,0.06)] dark:text-white'}`}>
                    {row.op}
                  </code>
                  <p className="mt-2 font-mono text-xs font-bold text-stone-900 dark:text-white">P:{row.p}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-500 dark:text-gray-400">{row.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to use */}
        <section>
          <div className="flex items-center gap-3">
            <span className="section-eyebrow -rotate-1">
              <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
              Field guide
            </span>
            <h2 className="heading-skew text-xl font-extrabold text-stone-900 sm:text-2xl dark:text-white">How to use a lab</h2>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {[
              { icon: FiCpu, t: 'Enter & validate', d: 'Type an expression or tap an example chip. Bad input gets a friendly warning, never a crash.' },
              { icon: FiEye, t: 'Scrub the timeline', d: 'Play, pause, step \u00b1, jump via the table rows, or drag the speed slider from Slow to Fast.' },
              { icon: FiBookOpen, t: 'Read both explainers', d: 'Every lab ends with a plain-language idea and the full stack mechanics replay of YOUR expression.' },
            ].map((s, i) => (
              <div key={s.t} className="panel-flat flex gap-4 p-5 dark:bg-bugbusters-card dark:border-[rgba(255,255,255,0.06)]">
                <span className={`grid size-11 shrink-0 place-items-center rounded-2xl text-white ${['bg-linear-to-br from-orange-500 to-amber-500', 'bg-linear-to-br from-rose-500 to-pink-500', 'bg-linear-to-br from-emerald-500 to-teal-400'][i]}`} style={{ boxShadow: '0 1px 2px rgb(28 25 23 / 0.05), 0 4px 12px -2px rgb(28 25 23 / 0.08)' }}>
                  <s.icon />
                </span>
                <div>
                  <h3 className="font-extrabold text-sm text-stone-900 dark:text-white">{s.t}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed font-semibold text-stone-600 dark:text-bugbusters-soft">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech */}
        <section>
          <div className="card p-6 dark:bg-bugbusters-card dark:border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-stone-900 text-white" style={{ boxShadow: '0 1px 2px rgb(28 25 23 / 0.05), 0 4px 12px -2px rgb(28 25 23 / 0.08)' }}>
                <FiGitBranch />
              </span>
              <h2 className="heading-skew text-lg font-extrabold text-stone-900 dark:text-white">Built with</h2>
            </div>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {['React 19', 'React Router', 'Tailwind CSS v4', 'Vite', 'react-icons'].map((t) => (
                <span key={t} className="chip bg-amber-500/10 text-amber-600 border-amber-500/30">{t}</span>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed font-semibold text-stone-600 dark:text-bugbusters-soft">
              Algorithms live in pure util modules that emit step lists &mdash; the UI is just a player.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
