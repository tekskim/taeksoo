import { useSyncExternalStore } from 'react';

type Breakpoint = 'compact' | 'normal' | 'wide';

const THRESHOLDS = { compact: 1280, wide: 1440 } as const;

function getBreakpoint(): Breakpoint {
  const w = window.innerWidth;
  if (w < THRESHOLDS.compact) return 'compact';
  if (w >= THRESHOLDS.wide) return 'wide';
  return 'normal';
}

let cached: Breakpoint = typeof window !== 'undefined' ? getBreakpoint() : 'wide';

function subscribe(cb: () => void) {
  const handler = () => {
    const next = getBreakpoint();
    if (next !== cached) {
      cached = next;
      cb();
    }
  };
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}

function getSnapshot() {
  return cached;
}

export function useBreakpoint(): Breakpoint {
  return useSyncExternalStore(subscribe, getSnapshot, () => 'wide' as Breakpoint);
}
