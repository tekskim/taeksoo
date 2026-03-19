import { useState, useEffect } from 'react';

export function useDrawerAnimation(isOpen: boolean, duration = 300) {
  const [mounted, setMounted] = useState(false);
  const [appeared, setAppeared] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAppeared(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setAppeared(false);
      const timer = setTimeout(() => setMounted(false), duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration]);

  return { mounted, appeared };
}
