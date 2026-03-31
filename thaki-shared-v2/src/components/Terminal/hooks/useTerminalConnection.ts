/**
 * useTerminalConnection Hook
 *
 * WebSocket 연결을 관리하는 훅
 * 연결, 재연결, 메시지 송수신, 에러 처리를 담당
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Terminal as XTerm } from 'xterm';
import type { FitAddon } from 'xterm-addon-fit';

import type { TerminalConnectionStatus, TerminalMessage } from '../types';
import { ANSI, DEFAULT_RECONNECT_CONFIG } from '../constants';

interface UseTerminalConnectionOptions {
  /** xterm 인스턴스 ref */
  terminal: React.RefObject<XTerm | null>;
  /** FitAddon 인스턴스 ref */
  fitAddon: React.RefObject<FitAddon | null>;
  /** 터미널이 준비되었는지 여부 */
  isTerminalReady: boolean;
  /** WebSocket URL */
  wsUrl?: string;
  /** WebSocket URL 빌더 함수 */
  buildWsUrl?: () => string;
  /** WebSocket 메시지 포맷 */
  wsMessageFormat?: 'json' | 'raw';
  /** 인증 토큰 */
  authToken?: string;
  /** Mock 모드 여부 */
  mockMode?: boolean;
  /** 자동 재연결 여부 */
  autoReconnect?: boolean;
  /** 최대 재연결 시도 횟수 */
  maxReconnectAttempts?: number;
  /** 재연결 대기 시간 (ms) */
  reconnectDelay?: number;
  /** 프롬프트 문자 */
  prompt?: string;
  /** 연결 성공 메시지 포맷 함수 */
  formatConnectedMessage?: () => string;
  /** 연결 상태 변경 콜백 */
  onConnectionChange?: (status: TerminalConnectionStatus) => void;
  /** 에러 콜백 */
  onError?: (error: Error) => void;
  /** 디버그 모드 */
  debug?: boolean;
}

interface UseTerminalConnectionReturn {
  /** 현재 연결 상태 */
  connectionStatus: TerminalConnectionStatus;
  /** WebSocket 연결 함수 */
  connect: () => void;
  /** WebSocket 연결 해제 함수 */
  disconnect: () => void;
  /** 메시지 전송 함수 */
  sendMessage: (message: TerminalMessage) => void;
  /** 터미널 크기 조정 및 서버 알림 */
  handleResize: () => void;
  /** WebSocket 연결 여부 */
  isConnected: boolean;
}

/**
 * WebSocket 연결을 관리하는 훅
 */
export function useTerminalConnection({
  terminal,
  fitAddon,
  isTerminalReady,
  wsUrl,
  buildWsUrl,
  wsMessageFormat = 'json',
  authToken,
  mockMode = false,
  autoReconnect = DEFAULT_RECONNECT_CONFIG.autoReconnect,
  maxReconnectAttempts = DEFAULT_RECONNECT_CONFIG.maxReconnectAttempts,
  reconnectDelay = DEFAULT_RECONNECT_CONFIG.reconnectDelay,
  prompt = '> ',
  formatConnectedMessage,
  onConnectionChange,
  onError,
  debug = false,
}: UseTerminalConnectionOptions): UseTerminalConnectionReturn {
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef<number>(0);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isManualDisconnecting = useRef<boolean>(false);

  const [connectionStatus, setConnectionStatus] =
    useState<TerminalConnectionStatus>('disconnected');

  /**
   * 연결 상태 업데이트
   */
  const updateConnectionStatus = useCallback(
    (status: TerminalConnectionStatus): void => {
      setConnectionStatus(status);
      onConnectionChange?.(status);

      if (debug) {
        console.log('[Terminal] Connection status:', status);
      }
    },
    [onConnectionChange, debug]
  );

  /**
   * 에러 핸들링
   */
  const handleError = useCallback(
    (error: Error): void => {
      if (debug) {
        console.error('[Terminal] Error:', error);
      }
      onError?.(error);
      terminal.current?.writeln(`\r\n${ANSI.RED}# Error: ${error.message}${ANSI.RESET}`);
      terminal.current?.scrollToBottom();
    },
    [terminal, onError, debug]
  );

  /**
   * WebSocket 메시지 전송
   */
  const sendMessage = useCallback(
    (message: TerminalMessage): void => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        if (wsMessageFormat === 'raw') {
          if (message.type === 'input' && typeof message.data === 'string') {
            ws.current.send(message.data);
          }
          // raw 모드에서는 resize/ping/pong 등은 전송하지 않음 (서버가 문자열 입력만 기대)
        } else {
          ws.current.send(JSON.stringify(message));
        }

        if (debug) {
          console.log('[Terminal] Send message:', message);
        }
      }
    },
    [debug, wsMessageFormat]
  );

  /**
   * 터미널 크기 조정 및 서버 알림
   */
  const handleResize = useCallback((): void => {
    if (fitAddon.current && terminal.current) {
      try {
        requestAnimationFrame(() => {
          if (fitAddon.current && terminal.current) {
            fitAddon.current.fit();
            // raw 모드에서는 resize 메시지 미전송 (서버 입력 오염 방지)
            if (wsMessageFormat !== 'raw') {
              const { rows, cols } = terminal.current;
              sendMessage({
                type: 'resize',
                rows,
                cols,
                timestamp: Date.now(),
              });
            }
          }
        });
      } catch (error) {
        if (debug) {
          console.error('[Terminal] Resize error:', error);
        }
      }
    }
  }, [terminal, fitAddon, sendMessage, debug, wsMessageFormat]);

  /**
   * WebSocket 연결
   */
  const connect = useCallback((): void => {
    // Mock 모드일 때는 WebSocket 연결 하지 않음
    if (mockMode) {
      updateConnectionStatus('disconnected');
      if (debug) {
        console.log('[Terminal] Mock mode enabled - skipping WebSocket connection');
      }
      return;
    }

    // 새 연결 시작 시 manual disconnect 플래그 해제
    isManualDisconnecting.current = false;

    // wsUrl이나 buildWsUrl이 없으면 연결하지 않음
    if (!wsUrl && !buildWsUrl) {
      if (debug) {
        console.log('[Terminal] No WebSocket URL provided - skipping connection');
      }
      return;
    }

    try {
      updateConnectionStatus('connecting');

      const url = buildWsUrl ? buildWsUrl() : wsUrl;
      if (!url) {
        throw new Error('WebSocket URL is required');
      }

      // 인증 토큰이 있으면 URL에 추가
      const fullUrl = authToken ? `${url}&wsstoken=${authToken}` : url;

      if (debug) {
        console.log('[Terminal] Connecting to:', fullUrl);
      }

      // 이미 연결 중이거나 연결되어 있으면 종료
      if (ws.current && ws.current.readyState !== WebSocket.CLOSED) {
        if (debug) {
          console.log('[Terminal] WebSocket already exists, skipping connection');
        }
        return;
      }

      ws.current = new WebSocket(fullUrl);

      // 연결 성공
      ws.current.onopen = (): void => {
        updateConnectionStatus('connected');
        reconnectAttempts.current = 0;

        const connectedMessage = formatConnectedMessage
          ? formatConnectedMessage()
          : `\r\n${ANSI.GREEN}# Connected${ANSI.RESET}`;
        terminal.current?.writeln(connectedMessage);
        terminal.current?.scrollToBottom();

        // 초기 크기 전송
        handleResize();
      };

      // 메시지 수신
      ws.current.onmessage = (event: MessageEvent): void => {
        if (wsMessageFormat === 'raw') {
          terminal.current?.write(event.data as string);
          terminal.current?.scrollToBottom();
          return;
        }

        try {
          const message: TerminalMessage = JSON.parse(event.data as string) as TerminalMessage;

          if (message.type === 'output' && message.data) {
            terminal.current?.write(message.data);
            terminal.current?.scrollToBottom();
          } else if (message.type === 'error' && message.data) {
            terminal.current?.writeln(`\r\n${ANSI.BOLD_RED}${message.data}${ANSI.RESET}`);
            terminal.current?.scrollToBottom();
          } else if (message.type === 'ping') {
            sendMessage({ type: 'pong', timestamp: Date.now() });
          } else {
            // JSON 파싱은 되었지만 우리가 아는 프로토콜이 아니면 raw로 출력
            terminal.current?.write(event.data as string);
            terminal.current?.scrollToBottom();
          }

          if (debug) {
            console.log('[Terminal] Received message:', message);
          }
        } catch {
          // Raw text output
          terminal.current?.write(event.data as string);
          terminal.current?.scrollToBottom();
        }
      };

      // 연결 종료
      ws.current.onclose = (): void => {
        updateConnectionStatus('disconnected');
        terminal.current?.writeln(`\r\n${ANSI.YELLOW}# Connection closed${ANSI.RESET}`);
        terminal.current?.scrollToBottom();

        // 사용자가 직접 닫은 경우(언마운트/닫기 버튼/URL 변경 등) 자동 재연결 금지
        if (isManualDisconnecting.current) {
          isManualDisconnecting.current = false;
          return;
        }

        // 자동 재연결
        if (autoReconnect && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current += 1;
          terminal.current?.writeln(
            `${ANSI.GRAY}# Reconnecting... (${reconnectAttempts.current}/${maxReconnectAttempts})${ANSI.RESET}`
          );
          terminal.current?.scrollToBottom();

          reconnectTimer.current = setTimeout(() => {
            connect();
          }, reconnectDelay);
        } else if (!autoReconnect || reconnectAttempts.current >= maxReconnectAttempts) {
          terminal.current?.writeln(
            `${ANSI.GRAY}# Connection failed. Local echo mode enabled.${ANSI.RESET}`
          );
          terminal.current?.write(prompt);
          terminal.current?.scrollToBottom();
        }
      };

      // 에러 발생
      ws.current.onerror = (event: Event): void => {
        updateConnectionStatus('error');
        handleError(new Error('WebSocket connection error'));

        if (debug) {
          console.error('[Terminal] WebSocket error:', event);
        }
      };
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Connection failed'));
    }
  }, [
    mockMode,
    wsUrl,
    buildWsUrl,
    wsMessageFormat,
    authToken,
    autoReconnect,
    maxReconnectAttempts,
    reconnectDelay,
    prompt,
    formatConnectedMessage,
    terminal,
    debug,
    updateConnectionStatus,
    handleError,
    handleResize,
    sendMessage,
  ]);

  /**
   * WebSocket 연결 종료
   */
  const disconnect = useCallback((): void => {
    isManualDisconnecting.current = true;

    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }

    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }

    updateConnectionStatus('disconnected');
  }, [updateConnectionStatus]);

  /**
   * 터미널 준비되면 연결
   */
  useEffect(() => {
    if (isTerminalReady) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [isTerminalReady, connect, disconnect]);

  /**
   * 윈도우 리사이즈 이벤트 핸들링
   */
  useEffect(() => {
    if (!isTerminalReady) {
      return;
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isTerminalReady, handleResize]);

  return {
    connectionStatus,
    connect,
    disconnect,
    sendMessage,
    handleResize,
    isConnected: connectionStatus === 'connected',
  };
}
