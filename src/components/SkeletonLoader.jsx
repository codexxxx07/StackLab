import { useState, useEffect } from 'react';

const SkeletonBlock = ({ className = '', rounded = 'rounded-xl' }) => (
  <div
    className={`relative overflow-hidden bg-stone-200/80 dark:bg-white/[0.06] ${rounded} ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-shimmer-bg bg-gradient-to-r from-transparent via-white/40 dark:via-white/[0.08] to-transparent" />
  </div>
);

const NavbarSkeleton = () => (
  <nav className="sticky top-0 z-50 px-4 pt-3 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between rounded-2xl border border-stone-900/5 bg-white/90 px-4 py-2.5 shadow-soft backdrop-blur-xl sm:px-6 lg:px-8 dark:border-white/10 dark:bg-bugbusters-card/90">
        <div className="flex items-center gap-2.5">
          <SkeletonBlock className="h-9 w-9" rounded="rounded-xl" />
          <SkeletonBlock className="hidden h-5 w-20 sm:block" rounded="rounded-lg" />
        </div>

        <div className="hidden items-center gap-1 lg:flex">
          <SkeletonBlock className="h-9 w-16" rounded="rounded-xl" />
          <SkeletonBlock className="h-9 w-24" rounded="rounded-xl" />
          <SkeletonBlock className="h-9 w-16" rounded="rounded-xl" />
        </div>

        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-9 w-9" rounded="rounded-xl" />
          <SkeletonBlock className="h-9 w-9 lg:hidden" rounded="rounded-xl" />
        </div>
      </div>
    </div>
  </nav>
);

const HeroSkeleton = () => (
  <section className="relative mx-auto max-w-6xl px-4 pb-28 pt-36 sm:px-6 sm:pt-44">
    <div className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-20"
      style={{
        backgroundImage: 'linear-gradient(rgb(28 25 23 / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(28 25 23 / 0.05) 1px, transparent 1px)',
        backgroundSize: '56px 56px',
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, black, transparent)',
      }}
    />

    <span aria-hidden className="absolute -left-32 top-20 size-96 rounded-full bg-orange-500/20 blur-3xl dark:bg-orange-500/10" />
    <span aria-hidden className="absolute -right-32 top-40 size-80 rounded-full bg-indigo-600/20 blur-3xl dark:bg-indigo-600/10" />
    <span aria-hidden className="absolute bottom-0 left-1/3 size-72 rounded-full bg-amber-500/15 blur-3xl dark:bg-amber-500/5" />

    <div className="relative text-center">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <SkeletonBlock className="h-7 w-48" rounded="rounded-full" />
      </div>

      <div className="mt-7 space-y-2">
        <SkeletonBlock className="mx-auto h-12 w-72 sm:h-14 sm:w-80 lg:h-16 lg:w-96" rounded="rounded-2xl" />
        <SkeletonBlock className="mx-auto h-12 w-56 sm:h-14 sm:w-64 lg:h-16 lg:w-80" rounded="rounded-2xl" />
      </div>

      <div className="mx-auto mt-4 flex items-center justify-center gap-2">
        <SkeletonBlock className="h-1.5 w-16 -rotate-2" rounded="rounded-full" />
        <SkeletonBlock className="h-1.5 w-8 rotate-1" rounded="rounded-full" />
        <SkeletonBlock className="h-1.5 w-4 -rotate-1" rounded="rounded-full" />
      </div>

      <div className="mx-auto mt-6 max-w-2xl space-y-2">
        <SkeletonBlock className="mx-auto h-5 w-full max-w-lg" rounded="rounded-lg" />
        <SkeletonBlock className="mx-auto h-5 w-full max-w-md" rounded="rounded-lg" />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <SkeletonBlock className="h-12 w-40" rounded="rounded-2xl" />
        <SkeletonBlock className="h-12 w-44" rounded="rounded-2xl" />
      </div>
    </div>

    <div className="relative mt-14">
      <div className="panel mx-auto max-w-3xl -rotate-1 p-5 sm:p-7 dark:bg-bugbusters-card dark:border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SkeletonBlock className="h-6 w-32" rounded="rounded-full" />
          <SkeletonBlock className="h-4 w-28" rounded="rounded-lg" />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.2fr)]">
          <div className="rounded-2xl border border-dashed border-stone-900/10 bg-cream p-3 dark:border-white/10 dark:bg-[#0a0a0a]">
            <SkeletonBlock className="h-2.5 w-12" rounded="rounded-sm" />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[...Array(5)].map((_, i) => (
                <SkeletonBlock key={i} className="size-8" rounded="rounded-xl" />
              ))}
            </div>
            <SkeletonBlock className="mt-2 h-2.5 w-16" rounded="rounded-sm" />
            <SkeletonBlock className="mt-1 h-7 w-24" rounded="rounded-lg" />
          </div>

          <div className="hidden items-center justify-center sm:flex">
            <SkeletonBlock className="h-8 w-8" rounded="rounded-full" />
          </div>

          <div className="rounded-2xl border border-dashed border-stone-900/10 bg-indigo-600/5 p-3 dark:border-white/10 dark:bg-indigo-600/10">
            <SkeletonBlock className="h-2.5 w-20" rounded="rounded-sm" />
            <div className="mt-2 flex min-h-20 flex-col-reverse items-start gap-1.5">
              {[...Array(3)].map((_, i) => (
                <SkeletonBlock key={i} className="h-10 w-10" rounded="rounded-xl" />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-dashed border-stone-900/10 pt-3 dark:border-white/10">
          <SkeletonBlock className="h-4 w-4 shrink-0" rounded="rounded-full" />
          <SkeletonBlock className="h-4 w-48" rounded="rounded-lg" />
        </div>
      </div>
    </div>
  </section>
);

const MarqueeSkeleton = () => (
  <div className="bg-stone-900 py-3.5 dark:bg-bugbusters-card" aria-hidden>
    <div className="flex w-max gap-8 whitespace-nowrap pr-8">
      {[...Array(16)].map((_, i) => (
        <span key={i} className="flex items-center gap-8">
          <SkeletonBlock className="h-4 w-20" rounded="rounded-full" />
          <SkeletonBlock className="size-2" rounded="rounded-full" />
        </span>
      ))}
    </div>
  </div>
);

const FeatureCardSkeleton = ({ rotate }) => (
  <div className={`card p-6 ${rotate}`}>
    <div className="flex items-center justify-between">
      <SkeletonBlock className="size-12" rounded="rounded-2xl" />
      <SkeletonBlock className="h-10 w-10" rounded="rounded-xl" />
    </div>
    <SkeletonBlock className="mt-4 h-6 w-36" rounded="rounded-lg" />
    <div className="mt-2 space-y-1.5">
      <SkeletonBlock className="h-4 w-full" rounded="rounded-md" />
      <SkeletonBlock className="h-4 w-4/5" rounded="rounded-md" />
    </div>
  </div>
);

const FeatureCardsSkeleton = () => (
  <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
    <div className="grid gap-6 md:grid-cols-3">
      <FeatureCardSkeleton rotate="-rotate-1" />
      <FeatureCardSkeleton rotate="rotate-1" />
      <FeatureCardSkeleton rotate="-rotate-1" />
    </div>
  </section>
);

const ConversionSectionSkeleton = () => (
  <section id="conversions" className="mx-auto max-w-6xl scroll-mt-28 px-4 pb-8 sm:px-6">
    <div className="text-center">
      <SkeletonBlock className="mx-auto h-7 w-28" rounded="rounded-full" />
      <SkeletonBlock className="mx-auto mt-4 h-10 w-48 sm:w-64" rounded="rounded-2xl" />
    </div>

    <div className="mt-10 grid gap-8 md:grid-cols-2">
      {[...Array(2)].map((_, i) => (
        <div key={i} className={`card p-6 ${i % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}>
          <SkeletonBlock className="h-6 w-20" rounded="rounded-full" />
          <SkeletonBlock className="mt-4 h-1.5 w-full rounded-full" />
          <SkeletonBlock className="mt-4 h-7 w-48" rounded="rounded-lg" />
          <SkeletonBlock className="mt-2 h-5 w-32" rounded="rounded-md" />
          <div className="mt-4 space-y-1.5">
            <SkeletonBlock className="h-4 w-full" rounded="rounded-md" />
            <SkeletonBlock className="h-4 w-3/4" rounded="rounded-md" />
          </div>
          <div className="mt-4 flex gap-2">
            <SkeletonBlock className="h-10 w-20" rounded="rounded-xl" />
            <SkeletonBlock className="h-10 w-20" rounded="rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default function SkeletonLoader() {
  return (
    <div className="min-h-screen overflow-x-clip bg-cream dark:bg-black">
      <NavbarSkeleton />
      <HeroSkeleton />
      <MarqueeSkeleton />
      <FeatureCardsSkeleton />
      <ConversionSectionSkeleton />
    </div>
  );
}
