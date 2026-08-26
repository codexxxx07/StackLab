import { useLivePlayer } from '../hooks/useLivePlayer';

/**
 * LiveExplanationCard — Interactive step-by-step explanation for a conversion method.
 *
 * Props:
 *   methodTitle: string — e.g. "Normal Method" or "Stack Method"
 *   steps: Array — step data (format depends on method type)
 *   methodType: 'normal' | 'stack'
 *   accent: 'orange' | 'indigo'
 *   finalAnswer: string
 */
export default function LiveExplanationCard({
  methodTitle,
  steps = [],
  methodType = 'normal',
  accent = 'orange',
  finalAnswer = '',
}) {
  const {
    step,
    status,
    total,
    play,
    pause,
    next,
    prev,
    restart,
    replay,
  } = useLivePlayer(steps.length);

  const accentMap = {
    orange: {
      bg: 'bg-orange-500',
      text: 'text-orange-500',
      border: 'border-orange-500',
      headBg: 'bg-orange-500',
      badge: 'bg-orange-500/10 border-orange-500/30 text-orange-500',
      glow: 'shadow-[0_10px_32px_-8px_rgb(249,115,22,0.35)]',
      pill: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
      stackBg: 'bg-orange-500/5 border-orange-500/20',
      activeBg: 'bg-orange-500/10',
    },
    indigo: {
      bg: 'bg-indigo-600',
      text: 'text-indigo-600',
      border: 'border-indigo-600',
      headBg: 'bg-indigo-600',
      badge: 'bg-indigo-600/10 border-indigo-600/30 text-indigo-600',
      glow: 'shadow-[0_10px_32px_-8px_rgb(79,70,229,0.35)]',
      pill: 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400',
      stackBg: 'bg-indigo-600/5 border-indigo-600/20',
      activeBg: 'bg-indigo-600/10',
    },
  };

  const a = accentMap[accent] || accentMap.orange;

  const isIdle = status === 'idle';
  const isPlaying = status === 'playing';
  const isPaused = status === 'paused';
  const isCompleted = status === 'completed';
  const currentStep = steps[step];

  // Button label logic
  const playPauseLabel = isPlaying ? '⏸ Pause' : isPaused ? '▶ Resume' : '▶ Play';
  const playPauseAction = isPlaying ? pause : play;

  return (
    <section
      className={`card overflow-hidden rounded-2xl transition-all duration-300 dark:bg-bugbusters-card dark:border-[rgba(255,255,255,0.06)] ${
        isPlaying ? a.glow : ''
      }`}
      aria-label={`Live Explanation — ${methodTitle}`}
    >
      {/* Header */}
      <div className={`flex flex-wrap items-center gap-3 border-b border-stone-900/5 ${a.headBg} px-5 py-4 dark:border-[rgba(255,255,255,0.06)]`}>
        <span className="sticker bg-white/90 border-transparent dark:bg-white/10">✦ Live</span>
        <h3 className="font-extrabold text-lg uppercase tracking-wide text-white">
          Live Explanation
        </h3>
        {!isIdle && (
          <span className={`ml-auto rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${a.pill}`}>
            {isPlaying ? 'Playing' : isPaused ? 'Paused' : isCompleted ? 'Completed' : ''}
          </span>
        )}
      </div>

      <div className="p-5 sm:p-7">
        {/* Subtitle */}
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500 dark:text-gray-400">
          {methodTitle}
        </p>

        {/* IDLE STATE — Show Play button */}
        {isIdle && steps.length > 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="mb-2 text-sm font-semibold text-stone-600 dark:text-gray-300">
              Ready to explore
            </p>
            <p className="mb-6 text-xs text-stone-400 dark:text-gray-500">
              Understand the conversion step by step.
            </p>
            <button
              onClick={play}
              className={`btn ${a.bg} text-white hover:-translate-y-0.5 text-base px-6 py-3`}
            >
              <span className="text-lg">▶</span> Play
            </button>
          </div>
        )}

        {/* ACTIVE STATE — Show steps */}
        {!isIdle && currentStep && (
          <>
            {/* Step counter */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400 dark:text-gray-500">
                Step {step + 1} / {total}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${a.badge}`}>
                {currentStep.operation || (methodType === 'normal' ? 'TRANSFORM' : 'STEP')}
              </span>
            </div>

            {/* Step content based on method type */}
            {methodType === 'normal' && (
              <NormalStepDisplay step={currentStep} accent={a} />
            )}
            {methodType === 'stack' && (
              <StackStepDisplay step={currentStep} accent={a} />
            )}

            {/* Explanation */}
            <div className="mt-4 rounded-2xl border border-stone-900/10 bg-cream/50 p-4 dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(255,255,255,0.02)]">
              <p
                className="text-sm font-medium leading-relaxed text-stone-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: currentStep.explanation }}
              />
            </div>

            {/* Completed state */}
            {isCompleted && (
              <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-emerald-500/30 bg-emerald-500/5 p-4 text-center">
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  ✓ Completed
                </span>
                {finalAnswer && (
                  <span className={`font-mono text-xl font-extrabold ${a.text}`}>
                    {finalAnswer}
                  </span>
                )}
                <button
                  onClick={replay}
                  className={`btn ${a.bg} text-white mt-2 text-sm`}
                >
                  ↻ Replay
                </button>
              </div>
            )}

            {/* Controls */}
            {!isCompleted && (
              <div className="mt-5 flex items-center justify-center gap-2">
                <ControlButton onClick={restart} label="⏮" title="Restart" />
                <ControlButton
                  onClick={prev}
                  label="◀"
                  title="Previous"
                  disabled={step <= 0}
                />
                <ControlButton
                  onClick={playPauseAction}
                  label={playPauseLabel}
                  title={isPlaying ? 'Pause' : 'Play'}
                  primary
                  accent={a}
                />
                <ControlButton onClick={next} label="▶" title="Next" disabled={step >= total - 1} />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

/* ── Control Button ────────────────────────────────────────────────── */

function ControlButton({ onClick, label, title, primary, accent, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`flex items-center justify-center gap-1.5 rounded-xl border border-stone-900/5 bg-white px-3 py-2 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[rgba(255,255,255,0.06)] dark:bg-[#0a0a0a] dark:text-white ${
        primary ? `${accent?.bg || 'bg-orange-500'} text-white border-transparent hover:shadow-lg` : 'text-stone-600 hover:text-stone-900 dark:hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

/* ── Normal Method Step Display ────────────────────────────────────── */

function NormalStepDisplay({ step }) {
  return (
    <div
      className="rounded-2xl border border-stone-900/5 bg-white p-5 dark:border-[rgba(255,255,255,0.06)] dark:bg-[#0a0a0a]"
      style={{ boxShadow: '0 1px 2px rgb(28 25 23 / 0.05)' }}
    >
      <div className="font-mono text-lg font-bold leading-loose text-stone-900 dark:text-white">
        {step.expression}
      </div>
    </div>
  );
}

/* ── Stack Method Step Display ─────────────────────────────────────── */

function StackStepDisplay({ step, accent }) {
  return (
    <div className="space-y-4">
      {/* Current token highlight */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-gray-500">
          Current Token
        </span>
        <span className={`inline-flex size-9 items-center justify-center rounded-xl ${accent.badge} font-mono text-base font-extrabold`}>
          {step.token}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Stack visualization */}
        <div>
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-gray-500">
            Stack
          </span>
          <div
            className={`rounded-2xl border ${accent.stackBg} p-4`}
            style={{ minHeight: '120px' }}
          >
            {step.stack.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-stone-400 dark:text-gray-500">
                Empty
              </div>
            ) : (
              <div className="flex flex-col-reverse items-center gap-0">
                {/* TOP label */}
                <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-gray-500">
                  TOP ↓
                </div>
                {step.stack.map((item, i) => (
                  <div
                    key={i}
                    className={`w-full border font-mono text-sm font-bold ${
                      i === step.stack.length - 1
                        ? `${accent.border} ${accent.activeBg} text-stone-900 dark:text-white`
                        : 'border-stone-900/10 bg-white dark:border-[rgba(255,255,255,0.06)] dark:bg-[#0a0a0a] text-stone-700 dark:text-gray-300'
                    } ${i === 0 ? 'rounded-t-xl' : ''} ${i === step.stack.length - 1 ? 'rounded-b-xl border-b-2' : ''} px-4 py-2.5 text-center`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Output */}
        <div>
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-gray-500">
            Output
          </span>
          <div
            className="rounded-2xl border border-stone-900/5 bg-white p-4 font-mono text-base font-bold text-stone-900 dark:border-[rgba(255,255,255,0.06)] dark:bg-[#0a0a0a] dark:text-white"
            style={{ minHeight: '120px' }}
          >
            {step.output || (
              <span className="text-stone-400 dark:text-gray-500">(empty)</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
