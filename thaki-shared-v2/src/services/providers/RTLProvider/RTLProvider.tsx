import React, { createContext, useEffect, useState, useCallback } from 'react';
import type { RTLContextValue, RTLProviderProps } from './types';

// Create RTL context
const RTLContext = createContext<RTLContextValue>({
  isRTL: false,
  toggleRTL: () => {},
  setRTL: () => {},
});

/**
 * RTL Provider for global right-to-left layout support
 *
 * 🌍 사용자 요구사항 5: RTL은 아이콘뿐만 아니라 UI, Message 등 전체에서 사용
 *
 * 주요 기능:
 * - Auto-detect RTL from document.dir
 * - Manual RTL control with toggle/set functions
 * - Global state management for entire app
 * - Used by Icon, Text, Layout, Message components
 *
 * @example
 * ```tsx
 * // App level
 * <RTLProvider autoDetect>
 *   <App />
 * </RTLProvider>
 *
 * // Component level
 * const { isRTL, toggleRTL } = useRTL();
 * ```
 */
export const RTLProvider: React.FC<RTLProviderProps> = ({
  initialRTL,
  autoDetect = true,
  children,
}) => {
  const [isRTL, setIsRTL] = useState(() => {
    // Priority: initialRTL > document detection > false
    if (initialRTL !== undefined) return initialRTL;

    if (autoDetect && typeof document !== 'undefined') {
      const dir = document.dir || document.documentElement.dir || '';
      return dir.toLowerCase() === 'rtl';
    }

    return false;
  });

  // Auto-detect RTL from document changes
  useEffect(() => {
    if (!autoDetect || initialRTL !== undefined) return;

    const detectRTL = () => {
      if (typeof document !== 'undefined') {
        const dir = document.dir || document.documentElement.dir || '';
        setIsRTL(dir.toLowerCase() === 'rtl');
      }
    };

    // Watch for document direction changes
    const observer = new MutationObserver(detectRTL);
    if (typeof document !== 'undefined') {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['dir'],
      });
    }

    return () => observer.disconnect();
  }, [autoDetect, initialRTL]);

  // Manual controls
  const toggleRTL = useCallback(() => {
    setIsRTL((prev) => !prev);
  }, []);

  const setRTL = useCallback((newRTL: boolean) => {
    setIsRTL(newRTL);
  }, []);

  const contextValue: RTLContextValue = {
    isRTL,
    toggleRTL,
    setRTL,
  };

  return <RTLContext.Provider value={contextValue}>{children}</RTLContext.Provider>;
};

export { RTLContext };
