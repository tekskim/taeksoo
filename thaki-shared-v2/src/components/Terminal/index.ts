/**
 * Terminal Component Exports
 */

// Main Component
export { Terminal } from './Terminal';

// Types
export type {
  TerminalProps,
  TerminalConnectionStatus,
  TerminalTheme,
  TerminalMessage,
} from './types';

// Constants (for customization)
export { DEFAULT_THEME, DEFAULT_TERMINAL_CONFIG, DEFAULT_RECONNECT_CONFIG } from './constants';

// Hooks (for advanced usage)
export {
  useContainerReady,
  useTerminalInstance,
  useTerminalConnection,
  useTerminalInput,
} from './hooks';

// Sub-components (for composition)
export { TerminalHeader } from './components';

