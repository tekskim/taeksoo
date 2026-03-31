import { RefObject, useCallback, useEffect } from 'react';

interface UseClickOutsideOptions {
  onClickOutside: (event: MouseEvent) => void;
  enabled?: boolean;
}

const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: UseClickOutsideOptions
) => {
  const { onClickOutside, enabled = true } = options;

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (enabled && ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside(event);
      }
    },
    [ref, onClickOutside, enabled]
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside, enabled]);
};

export default useClickOutside;
