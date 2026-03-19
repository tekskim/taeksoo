/**
 * useTerminalInstance Hook
 *
 * xterm.js 인스턴스를 생성하고 관리하는 훅
 * 터미널 초기화, 애드온 로딩, 크기 조정, cleanup을 담당
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';

import type { TerminalTheme } from '../types';
import {
  DEFAULT_TERMINAL_CONFIG,
  DEFAULT_THEME,
  resolveTerminalTheme,
} from '../constants';

interface UseTerminalInstanceOptions {
  /** 터미널이 마운트될 컨테이너 ref */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** 컨테이너가 준비되었는지 여부 */
  isContainerReady: boolean;
  /** 터미널 테마 */
  theme?: TerminalTheme;
  /** 폰트 크기 */
  fontSize?: number;
  /** 폰트 패밀리 */
  fontFamily?: string;
  /** 커서 블링크 여부 */
  cursorBlink?: boolean;
  /** 디버그 모드 */
  debug?: boolean;
}

interface UseTerminalInstanceReturn {
  /** xterm 인스턴스 ref */
  terminal: React.RefObject<XTerm | null>;
  /** FitAddon 인스턴스 ref */
  fitAddon: React.RefObject<FitAddon | null>;
  /** 터미널이 준비되었는지 여부 */
  isTerminalReady: boolean;
  /** 터미널에 포커스 */
  focusTerminal: () => void;
  /** 터미널 크기 맞춤 */
  fitTerminal: () => void;
}

/**
 * xterm.js 인스턴스를 관리하는 훅
 */
export function useTerminalInstance({
  containerRef,
  isContainerReady,
  theme = DEFAULT_THEME,
  fontSize = DEFAULT_TERMINAL_CONFIG.fontSize,
  fontFamily = DEFAULT_TERMINAL_CONFIG.fontFamily,
  cursorBlink = DEFAULT_TERMINAL_CONFIG.cursorBlink,
  debug = false,
}: UseTerminalInstanceOptions): UseTerminalInstanceReturn {
  const terminal = useRef<XTerm | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const initialized = useRef<boolean>(false);
  const [isTerminalReady, setIsTerminalReady] = useState(false);

  /**
   * 터미널에 포커스
   */
  const focusTerminal = useCallback((): void => {
    terminal.current?.focus();
  }, []);

  /**
   * 터미널 크기 맞춤
   */
  const fitTerminal = useCallback((): void => {
    if (fitAddon.current && terminal.current) {
      try {
        fitAddon.current.fit();
      } catch (error) {
        if (debug) {
          console.error('[Terminal] Fit error:', error);
        }
      }
    }
  }, [debug]);

  /**
   * 터미널 초기화
   */
  useEffect(() => {
    if (!isContainerReady || !containerRef.current || initialized.current) {
      return;
    }

    const container = containerRef.current;
    initialized.current = true;

    if (debug) {
      console.log('[Terminal] Initializing xterm instance');
    }

    // 터미널 생성
    const resolvedTheme = resolveTerminalTheme(theme);

    terminal.current = new XTerm({
      cursorBlink,
      fontSize,
      fontFamily,
      theme: resolvedTheme,
      convertEol: true,
      scrollback: DEFAULT_TERMINAL_CONFIG.scrollback,
      tabStopWidth: DEFAULT_TERMINAL_CONFIG.tabStopWidth,
      lineHeight: DEFAULT_TERMINAL_CONFIG.lineHeight,
      scrollOnUserInput: true,
      smoothScrollDuration: DEFAULT_TERMINAL_CONFIG.smoothScrollDuration,
    });

    // FitAddon 설정
    fitAddon.current = new FitAddon();
    terminal.current.loadAddon(fitAddon.current);

    // WebLinksAddon 설정
    terminal.current.loadAddon(new WebLinksAddon());

    // 터미널 열기
    terminal.current.open(container);

    // 터미널 준비 완료 표시
    setIsTerminalReady(true);

    // 크기 조정 (여러 번 시도하여 안정화)
    setTimeout(() => {
      if (fitAddon.current && terminal.current && initialized.current) {
        fitAddon.current.fit();
        setTimeout(() => fitAddon.current?.fit(), 50);
        setTimeout(() => fitAddon.current?.fit(), 150);
        terminal.current.focus();
      }
    }, 100);

    // Cleanup
    return () => {
      setIsTerminalReady(false);

      // xterm dispose를 안전하게 처리
      const termToDispose = terminal.current;
      const fitToDispose = fitAddon.current;
      terminal.current = null;
      fitAddon.current = null;
      initialized.current = false;

      if (termToDispose) {
        try {
          // 1. 터미널 요소를 먼저 숨겨서 viewport refresh 차단
          const termElement = termToDispose.element;
          if (termElement) {
            termElement.style.visibility = 'hidden';
            termElement.style.display = 'none';
          }

          // 2. blur 호출
          termToDispose.blur();
        } catch {
          // ignore
        }

        // 3. 동기적으로 즉시 dispose 호출
        try {
          fitToDispose?.dispose();
        } catch {
          // ignore fitAddon dispose errors
        }

        try {
          termToDispose.dispose();
        } catch {
          // xterm dispose 중 발생하는 오류 무시
        }
      }
    };
  }, [
    isContainerReady,
    containerRef,
    cursorBlink,
    fontSize,
    fontFamily,
    theme,
    debug,
  ]);

  return {
    terminal,
    fitAddon,
    isTerminalReady,
    focusTerminal,
    fitTerminal,
  };
}
