import { useCallback, useRef, useState } from 'react';

/**
 * Drives step-by-step playback for a LiveExplanationCard.
 * Each card gets its own independent instance.
 *
 * States: idle | playing | paused | completed
 */
export function useLivePlayer(totalSteps) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | playing | paused | completed
  const timerRef = useRef(null);
  const total = totalSteps || 0;

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const advance = useCallback(() => {
    setStep((prev) => {
      if (prev >= total - 1) {
        clearTimer();
        setStatus('completed');
        return total - 1;
      }
      return prev + 1;
    });
  }, [total]);

  const play = useCallback(() => {
    if (total === 0) return;
    setStatus('playing');
    clearTimer();
    timerRef.current = setTimeout(() => {
      advance();
    }, 1600);
  }, [total, advance]);

  const pause = useCallback(() => {
    clearTimer();
    setStatus('paused');
  }, []);

  const next = useCallback(() => {
    clearTimer();
    setStep((prev) => {
      if (prev >= total - 1) {
        setStatus('completed');
        return total - 1;
      }
      setStatus('paused');
      return prev + 1;
    });
  }, [total]);

  const restart = useCallback(() => {
    clearTimer();
    setStep(0);
    setStatus('idle');
  }, []);

  const replay = useCallback(() => {
    clearTimer();
    setStep(0);
    setStatus('idle');
  }, []);

  // Auto-advance when playing and step changes
  const scheduleNext = useCallback(() => {
    if (status === 'playing') {
      clearTimer();
      timerRef.current = setTimeout(() => {
        advance();
      }, 1600);
    }
  }, [status, advance]);

  return {
    step,
    status,
    total,
    play,
    pause,
    next,
    restart,
    replay,
    scheduleNext,
    setStep,
    setStatus,
  };
}
