/**
 * Terminal Component
 *
 * WebSocket 기반 원격 터미널
 * xterm.js를 사용하여 브라우저에서 터미널 명령어 실행
 */

import type React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';
import 'xterm/css/xterm.css';

import type { TerminalProps } from './types';
import { DEFAULT_THEME, DEFAULT_TERMINAL_CONFIG, DEFAULT_RECONNECT_CONFIG } from './constants';
import {
  useContainerReady,
  useTerminalInstance,
  useTerminalConnection,
  useTerminalInput,
} from './hooks';
import { TerminalHeader } from './components';

/**
 * Terminal Component
 *
 * 리팩토링된 터미널 컴포넌트
 * - useContainerReady: 컨테이너 크기 모니터링
 * - useTerminalInstance: xterm 인스턴스 관리
 * - useTerminalConnection: WebSocket 연결 관리
 * - useTerminalInput: 사용자 입력 처리
 */
export const Terminal = ({
  title = 'Terminal',
  wsUrl,
  buildWsUrl,
  wsMessageFormat = 'json',
  authToken,
  theme = DEFAULT_THEME,
  fontSize = DEFAULT_TERMINAL_CONFIG.fontSize,
  fontFamily = DEFAULT_TERMINAL_CONFIG.fontFamily,
  cursorBlink = DEFAULT_TERMINAL_CONFIG.cursorBlink,
  onConnectionChange,
  onError,
  onClose,
  onOpenInNewWindow,
  debug = false,
  mockMode = false,
  clearSignal,
  autoReconnect = DEFAULT_RECONNECT_CONFIG.autoReconnect,
  maxReconnectAttempts = DEFAULT_RECONNECT_CONFIG.maxReconnectAttempts,
  reconnectDelay = DEFAULT_RECONNECT_CONFIG.reconnectDelay,
  className,
  fullWidth = false,
  welcomeMessages = ['# Terminal ready'],
  prompt = '> ',
  formatConnectedMessage,
  formatMockCommandMessage,
  renderIcon,
  hideHeader = false,
  autoFocus = false,
  focusSignal,
  dragHandleClassName,
  isNewWindow = false,
}: TerminalProps): React.ReactElement => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const prevClearSignalRef = useRef<number | undefined>(clearSignal);
  const lastFocusSignalRef = useRef<number | undefined>(focusSignal);

  // 1. 컨테이너 준비 상태 모니터링
  // - 패널 모드 (isNewWindow=false): 즉시 준비 완료
  // - 새 창 모드 (isNewWindow=true): ResizeObserver로 크기 확보 대기
  const { isContainerReady } = useContainerReady(terminalRef, { isNewWindow });

  // 2. xterm 인스턴스 관리
  const { terminal, fitAddon, isTerminalReady, focusTerminal } = useTerminalInstance({
    containerRef: terminalRef,
    isContainerReady,
    theme,
    fontSize,
    fontFamily,
    cursorBlink,
    debug,
  });

  // 3. WebSocket 연결 관리
  const { isConnected, sendMessage, handleResize } = useTerminalConnection({
    terminal,
    fitAddon,
    isTerminalReady,
    wsUrl,
    buildWsUrl,
    wsMessageFormat,
    authToken,
    mockMode,
    autoReconnect,
    maxReconnectAttempts,
    reconnectDelay,
    prompt,
    formatConnectedMessage,
    onConnectionChange,
    onError,
    debug,
  });

  /**
   * 패널/컨테이너 리사이즈 대응
   * - Split panel 드래그 리사이즈는 window resize 이벤트가 발생하지 않으므로,
   *   ResizeObserver로 컨테이너 크기 변화를 감지하여 xterm fit을 수행합니다.
   */
  useEffect(() => {
    if (!isTerminalReady) {
      return;
    }

    const container = terminalRef.current;
    if (!container) {
      return;
    }

    let rafId: number | null = null;

    const scheduleFit = (): void => {
      if (rafId !== null) {
        return;
      }
      rafId = requestAnimationFrame(() => {
        rafId = null;
        handleResize();
      });
    };

    // 초기 1회 fit (드래그 패널 진입 직후 레이아웃 확정 보장)
    scheduleFit();

    const resizeObserver = new ResizeObserver(() => {
      scheduleFit();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
  }, [handleResize, isTerminalReady]);

  // 4. 사용자 입력 처리
  useTerminalInput({
    terminal,
    isTerminalReady,
    isConnected,
    sendMessage,
    prompt,
    welcomeMessages,
    formatMockCommandMessage,
  });

  const requestFocus = useCallback((): void => {
    handleResize();
    if (terminal.current) {
      const lastRow = Math.max(0, terminal.current.rows - 1);
      terminal.current.refresh(0, lastRow);
    }
    focusTerminal();
  }, [focusTerminal, handleResize, terminal]);

  /**
   * 활성화 시 자동 포커스
   */
  useEffect(() => {
    if (!isTerminalReady) {
      return;
    }

    if (!autoFocus) {
      terminal.current?.blur();
      lastFocusSignalRef.current = focusSignal;
      return;
    }

    const frame = requestAnimationFrame(() => {
      requestFocus();
    });

    return () => cancelAnimationFrame(frame);
  }, [autoFocus, focusSignal, isTerminalReady, requestFocus, terminal]);

  /**
   * 포커스 시그널 처리 (활성 탭 클릭 등)
   */
  useEffect(() => {
    if (!isTerminalReady || !autoFocus) {
      lastFocusSignalRef.current = focusSignal;
      return;
    }

    if (typeof focusSignal !== 'number') {
      return;
    }

    if (lastFocusSignalRef.current === focusSignal) {
      return;
    }

    lastFocusSignalRef.current = focusSignal;
    const frame = requestAnimationFrame(() => {
      requestFocus();
    });

    return () => cancelAnimationFrame(frame);
  }, [autoFocus, focusSignal, isTerminalReady, requestFocus]);

  /**
   * 외부 Clear 시그널 처리 (세션 유지)
   * - WebSocket 연결/세션은 유지하고, xterm 화면만 초기화합니다.
   */
  useEffect(() => {
    if (!isTerminalReady) {
      return;
    }

    if (typeof clearSignal !== 'number') {
      return;
    }

    // 최초 렌더에서는 clear를 실행하지 않음
    if (typeof prevClearSignalRef.current === 'undefined') {
      prevClearSignalRef.current = clearSignal;
      return;
    }

    if (prevClearSignalRef.current === clearSignal) {
      return;
    }

    prevClearSignalRef.current = clearSignal;

    terminal.current?.clear();
    terminal.current?.write(prompt);
    terminal.current?.scrollToBottom();
  }, [clearSignal, isTerminalReady, prompt, terminal]);

  /**
   * 터미널 클릭 시 포커스
   */
  const handleTerminalClick = useCallback((): void => {
    focusTerminal();
  }, [focusTerminal]);

  return (
    <div
      className={clsx(
        'tw-terminal-container flex h-full w-full flex-col overflow-hidden bg-surface',
        fullWidth &&
          'mx-[calc(var(--semantic-space-lg)*-1)] my-[calc(var(--semantic-space-lg)*-1)] h-[calc(100%+var(--semantic-space-lg)*2)] w-[calc(100%+var(--semantic-space-lg)*2)]',
        className
      )}
    >
      {/* 헤더 */}
      {!hideHeader && (
        <TerminalHeader
          title={title}
          onClose={onClose}
          onOpenInNewWindow={onOpenInNewWindow}
          renderIcon={renderIcon}
          dragHandleClassName={dragHandleClassName}
        />
      )}

      {/* 터미널 영역 */}
      <div className="relative flex-1 overflow-hidden bg-surface-elevated">
        {/* 로딩 오버레이 - 터미널이 준비되기 전까지 표시 */}
        {!isTerminalReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-elevated">
            <div className="flex flex-col items-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
              <span className="text-xs text-text-muted">Initializing terminal...</span>
            </div>
          </div>
        )}
        <div
          ref={terminalRef}
          className="tw-terminal-content h-full w-full cursor-text overflow-hidden [&_.xterm]:h-full [&_.xterm]:w-full [&_.xterm-viewport]:!overflow-y-auto [&_.xterm-screen]:h-full"
          onClick={handleTerminalClick}
          role="textbox"
          tabIndex={0}
          aria-label="Terminal"
        />
      </div>
    </div>
  );
};

Terminal.displayName = 'Terminal';
