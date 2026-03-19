import { useContext } from 'react';
import { RTLContext } from './RTLProvider';
import type { RTLContextValue } from './types';

/**
 * Hook to use RTL context
 * 
 * 🌍 전체 UI에서 RTL 상태를 사용할 수 있는 훅
 * 
 * @example
 * ```tsx
 * const { isRTL, toggleRTL, setRTL } = useRTL();
 * 
 * // Icon mirroring
 * <Icon mirrored={isRTL}><CaretRight /></Icon>
 * 
 * // Layout direction
 * <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
 *   Content
 * </div>
 * 
 * // Manual toggle
 * <button onClick={toggleRTL}>
 *   Switch to {isRTL ? 'LTR' : 'RTL'}
 * </button>
 * ```
 */
export const useRTL = (): RTLContextValue => {
  const context = useContext(RTLContext);
  
  if (!context) {
    console.warn('useRTL must be used within RTLProvider. Falling back to default values.');
    return {
      isRTL: false,
      toggleRTL: () => {},
      setRTL: () => {},
    };
  }
  
  return context;
}; 