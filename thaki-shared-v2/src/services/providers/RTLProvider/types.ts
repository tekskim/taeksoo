// RTL Context for global mirroring (not just icons)
export interface RTLContextValue {
  /** Global RTL state */
  isRTL: boolean;
  /** Toggle RTL on/off */
  toggleRTL: () => void;
  /** Set RTL directly */
  setRTL: (value: boolean) => void;
}

// RTL Provider props
export interface RTLProviderProps {
  /** Initial RTL state (overrides auto-detection) */
  initialRTL?: boolean;
  /** Auto-detect RTL from document direction */
  autoDetect?: boolean;
  children: React.ReactNode;
} 