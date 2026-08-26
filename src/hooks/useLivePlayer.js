import { useCallback, useEffect, useRef, useState } from 'react';

const AUTO_ADVANCE_MS = 1800;

/**
 * Drives step-by-step playback for a LiveExplanationCard.
 * Each card gets its own independent instance.
 *
 * States: idle | playing | paused | completed
 *
 * All timer logic lives inside this hook — the consumer never manages timers.
 */
export function useLivePlayer(totalSteps) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState('idle');
  const timerRef = useRef(null);
  const total = totalSteps || 0;

  // ── Timer helpers ──────────────────────────────────────────────────

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setStep((prev) => {
        if (prev >= total - 1) {
          // Reached the end — complete
          setStatus('completed');
          return total - 1;
        }
        return prev + 1;
      });
    }, AUTO_ADVANCE_MS);
  }, [total, clearTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  // When playing and step changes (not at end), schedule next advance
  useEffect(() => {
    if (status === 'playing' && step < total - 1) {
      startTimer();
    }
  }, [status, step, total, startTimer]);

  // ── Public API ─────────────────────────────────────────────────────

  const play = useCallback(() => {
    if (total === 0) return;
    setStatus('playing');
    startTimer();
  }, [total, startTimer]);

  const pause = useCallback(() => {
    clearTimer();
    setStatus('paused');
  }, [clearTimer]);

  /** Manual next — if playing, restart the timer after advancing. */
  const next = useCallback(() => {
    clearTimer();
    setStep((prev) => {
      if (prev >= total - 1) {
        setStatus('completed');
        return total - 1;
      }
      // Keep playing if was playing, otherwise paused
      setStatus((s) => (s === 'playing' ? 'playing' : 'paused'));
      return prev + 1;
    });
  }, [total, clearTimer]);

  /** Manual previous — if playing, restart the timer after going back. */
  const prev = useCallback(() => {
    clearTimer();
    setStep((p) => Math.max(0, p - 1));
    setStatus((s) => (s === 'playing' ? 'playing' : 'paused'));
  }, [clearTimer]);

  const restart = useCallback(() => {
    clearTimer();
    setStep(0);
    setStatus('idle');
  }, [clearTimer]);

  const replay = useCallback(() => {
    clearTimer();
    setStep(0);
    setStatus('playing');
    // startTimer will be triggered by the useEffect watching status + step
  }, [clearTimer]);

  return {
    step,
    status,
    total,
    play,
    pause,
    next,
    prev,
    restart,
    replay,
  };
}
