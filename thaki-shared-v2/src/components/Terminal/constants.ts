/**
 * Terminal Constants
 *
 * 터미널 컴포넌트에서 사용하는 상수 정의
 */

import type { TerminalTheme } from './types';

/**
 * 기본 터미널 테마
 */
export const DEFAULT_THEME: TerminalTheme = {
  background: 'var(--semantic-color-surface)',
  foreground: 'var(--semantic-color-text)',
  cursor: 'var(--semantic-color-text)',
  cursorAccent: 'var(--semantic-color-surface)',
  selection: 'var(--semantic-color-border)',
  black: 'var(--semantic-color-text)',
  red: 'var(--semantic-color-error)',
  green: 'var(--semantic-color-success)',
  yellow: 'var(--semantic-color-warning)',
  blue: 'var(--semantic-color-info)',
  magenta: 'var(--semantic-color-tertiary)',
  cyan: 'var(--semantic-color-info)',
  white: 'var(--semantic-color-textInverse)',
  brightBlack: 'var(--semantic-color-textMuted)',
  brightRed: 'var(--semantic-color-error)',
  brightGreen: 'var(--semantic-color-success)',
  brightYellow: 'var(--semantic-color-warning)',
  brightBlue: 'var(--semantic-color-info)',
  brightMagenta: 'var(--semantic-color-tertiary)',
  brightCyan: 'var(--semantic-color-info)',
  brightWhite: 'var(--semantic-color-textInverse)',
};

const resolveCssVar = (value: string, root: CSSStyleDeclaration): string => {
  const match = value.match(/^var\((--[^)]+)\)$/);
  if (!match) {
    return value;
  }
  const resolved = root.getPropertyValue(match[1]).trim();
  return resolved || value;
};

export const resolveTerminalTheme = (
  theme: TerminalTheme = DEFAULT_THEME
): TerminalTheme => {
  if (typeof window === 'undefined') {
    return theme;
  }

  const root = getComputedStyle(document.documentElement);
  return Object.fromEntries(
    Object.entries(theme).map(([key, value]) => [
      key,
      resolveCssVar(value, root),
    ])
  ) as TerminalTheme;
};

/**
 * 기본 터미널 설정
 */
export const DEFAULT_TERMINAL_CONFIG = {
  fontSize: 12,
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  cursorBlink: true,
  scrollback: 1000,
  tabStopWidth: 4,
  lineHeight: 1.5,
  smoothScrollDuration: 100,
} as const;

/**
 * WebSocket 재연결 설정
 */
export const DEFAULT_RECONNECT_CONFIG = {
  autoReconnect: true,
  maxReconnectAttempts: 3,
  reconnectDelay: 3000,
} as const;

/**
 * ANSI 이스케이프 코드
 */
export const ANSI = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  GRAY: '\x1b[90m',
  BOLD_RED: '\x1b[1;31m',
  CURSOR_LEFT: '\x1b[D',
  CURSOR_RIGHT: '\x1b[C',
  CLEAR_LINE: '\r\x1b[K',
} as const;

/**
 * 키 코드
 */
export const KEY_CODES = {
  ENTER: '\r',
  BACKSPACE: '\u007F',
  CTRL_C: '\u0003',
  ARROW_LEFT: '\x1b[D',
  ARROW_RIGHT: '\x1b[C',
  ESCAPE_PREFIX: '\x1b[',
} as const;
