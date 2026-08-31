import { useEffect, useState } from 'react';
import Lenis from 'lenis';

/**
 * Sets up a single Lenis smooth-scroll instance for the whole app.
 *
 * - Created once, stored on a module-level variable so StrictMode double
 *   mounting (dev) doesn't spawn duplicate instances.
 * - Cleaned up automatically when no consumer is mounted.
 * - Works with React Router: navigation resets scroll to top.
 */
let lenis = null;

function setupLenis() {
  if (lenis) return lenis;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  return lenis;
}

function destroyLenis() {
  if (!lenis) return;
  lenis.destroy();
  lenis = null;
}

let refCount = 0;

/**
 * Register a consumer. The first mount creates Lenis; the last unmount
 * destroys it. Returns the shared instance.
 */
export function useLenis() {
  const [instance, setInstance] = useState(lenis);

  useEffect(() => {
    let active = true;

    if (refCount === 0) {
      setupLenis();
      if (active) setInstance(lenis);
    }
    refCount += 1;

    return () => {
      active = false;
      refCount -= 1;
      if (refCount === 0) {
        destroyLenis();
        if (active) setInstance(null);
      }
    };
  }, []);

  return instance;
}
