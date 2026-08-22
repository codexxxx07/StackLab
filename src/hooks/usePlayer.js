import { useCallback, useEffect, useState } from 'react';

/** Slider position (1..5) → delay in ms. Position 1 = slow, 5 = fast. */
export const SPEEDS = [1800, 1150, 700, 420, 240];
export const SPEED_LABELS = ['Slow', 'Relaxed', 'Normal', 'Brisk', 'Fast'];

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/**
 * Drives step-by-step playback over a list of visualization steps.
 * Manual navigation pauses autoplay; reaching the end stops it.
 */
export function usePlayer(total) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedPos, setSpeedPos] = useState(3); // 1..5

  useEffect(() => {
    if (!playing) return undefined;
    if (total === 0 || index >= total - 1) {
      setPlaying(false);
      return undefined;
    }
    const t = setTimeout(() => {
      setIndex((i) => Math.min(i + 1, total - 1));
    }, SPEEDS[speedPos - 1]);
    return () => clearTimeout(t);
  }, [playing, index, speedPos, total]);

  const play = useCallback(() => setPlaying(true), []);

  const pause = useCallback(() => setPlaying(false), []);

  const toggle = useCallback(() => {
    setPlaying((p) => {
      if (!p && total > 0 && index >= total - 1) {
        setIndex(0);
        return true;
      }
      return !p;
    });
  }, [index, total]);

  const next = useCallback(() => {
    setPlaying(false);
    setIndex((i) => clamp(i + 1, 0, Math.max(total - 1, 0)));
  }, [total]);

  const prev = useCallback(() => {
    setPlaying(false);
    setIndex((i) => clamp(i - 1, 0, Math.max(total - 1, 0)));
  }, [total]);

  const reset = useCallback(() => {
    setPlaying(false);
    setIndex(0);
  }, []);

  const goTo = useCallback(
    (i) => {
      setPlaying(false);
      setIndex(clamp(i, 0, Math.max(total - 1, 0)));
    },
    [total]
  );

  return {
    index,
    playing,
    speedPos,
    speedLabel: SPEED_LABELS[speedPos - 1],
    delay: SPEEDS[speedPos - 1],
    setSpeedPos,
    play,
    pause,
    toggle,
    next,
    prev,
    reset,
    goTo,
  };
}
