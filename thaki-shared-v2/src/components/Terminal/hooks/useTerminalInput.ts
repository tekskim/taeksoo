/**
 * useTerminalInput Hook
 *
 * 터미널 입력 처리를 담당하는 훅
 * WebSocket 연결 시 서버로 전송, 미연결 시 로컬 에코 처리
 */

import { useCallback, useEffect, useRef } from 'react';
import type { Terminal as XTerm } from 'xterm';

import type { TerminalMessage } from '../types';
import { ANSI, KEY_CODES } from '../constants';

interface UseTerminalInputOptions {
  /** xterm 인스턴스 ref */
  terminal: React.RefObject<XTerm | null>;
  /** 터미널이 준비되었는지 여부 */
  isTerminalReady: boolean;
  /** WebSocket 연결 여부 */
  isConnected: boolean;
  /** 메시지 전송 함수 */
  sendMessage: (message: TerminalMessage) => void;
  /** 프롬프트 문자 */
  prompt?: string;
  /** 환영 메시지 배열 */
  welcomeMessages?: string[];
  /** Mock 모드 명령어 메시지 포맷 함수 */
  formatMockCommandMessage?: (command: string) => string;
}

/**
 * 터미널 입력을 처리하는 훅
 */
export function useTerminalInput({
  terminal,
  isTerminalReady,
  isConnected,
  sendMessage,
  prompt = '> ',
  welcomeMessages = ['# Terminal ready'],
  formatMockCommandMessage,
}: UseTerminalInputOptions): void {
  const inputBuffer = useRef<string>('');
  const cursorPosition = useRef<number>(0);
  const welcomeMessageShown = useRef<boolean>(false);

  /**
   * 입력 버퍼 초기화
   */
  const resetInputBuffer = useCallback((): void => {
    inputBuffer.current = '';
    cursorPosition.current = 0;
  }, []);

  /**
   * 현재 줄 다시 그리기
   */
  const redrawLine = useCallback((): void => {
    const term = terminal.current;
    if (!term) return;

    term.write(`${ANSI.CLEAR_LINE}${prompt}${inputBuffer.current}`);

    // 커서 위치 복원
    const remainingChars = inputBuffer.current.length - cursorPosition.current;
    if (remainingChars > 0) {
      term.write(`\x1b[${remainingChars}D`);
    }
  }, [terminal, prompt]);

  /**
   * Enter 키 처리
   */
  const handleEnter = useCallback((): void => {
    const term = terminal.current;
    if (!term) return;

    const command = inputBuffer.current;
    term.write('\r\n');

    if (command.trim()) {
      const mockMessage = formatMockCommandMessage
        ? formatMockCommandMessage(command)
        : `${ANSI.GRAY}# Command not executed (local mode): ${command}${ANSI.RESET}`;
      term.writeln(mockMessage);
    }

    resetInputBuffer();
    term.write(prompt);
    term.scrollToBottom();
  }, [terminal, prompt, formatMockCommandMessage, resetInputBuffer]);

  /**
   * Backspace 키 처리
   */
  const handleBackspace = useCallback((): void => {
    if (cursorPosition.current <= 0) return;

    const buffer = inputBuffer.current;
    const pos = cursorPosition.current;
    inputBuffer.current = buffer.slice(0, pos - 1) + buffer.slice(pos);
    cursorPosition.current = pos - 1;

    redrawLine();
  }, [redrawLine]);

  /**
   * Ctrl+C 처리
   */
  const handleCtrlC = useCallback((): void => {
    const term = terminal.current;
    if (!term) return;

    resetInputBuffer();
    term.write(`^C\r\n${prompt}`);
    term.scrollToBottom();
  }, [terminal, prompt, resetInputBuffer]);

  /**
   * 왼쪽 화살표 처리
   */
  const handleArrowLeft = useCallback((): void => {
    if (cursorPosition.current <= 0) return;

    cursorPosition.current -= 1;
    terminal.current?.write(ANSI.CURSOR_LEFT);
  }, [terminal]);

  /**
   * 오른쪽 화살표 처리
   */
  const handleArrowRight = useCallback((): void => {
    if (cursorPosition.current >= inputBuffer.current.length) return;

    cursorPosition.current += 1;
    terminal.current?.write(ANSI.CURSOR_RIGHT);
  }, [terminal]);

  /**
   * 일반 문자 입력 처리
   */
  const handleCharacter = useCallback(
    (data: string): void => {
      const buffer = inputBuffer.current;
      const pos = cursorPosition.current;
      inputBuffer.current = buffer.slice(0, pos) + data + buffer.slice(pos);
      cursorPosition.current = pos + data.length;

      redrawLine();
    },
    [redrawLine]
  );

  /**
   * 로컬 입력 처리 (WebSocket 미연결 시)
   */
  const handleLocalInput = useCallback(
    (data: string): void => {
      switch (data) {
        case KEY_CODES.ENTER:
          handleEnter();
          break;
        case KEY_CODES.BACKSPACE:
          handleBackspace();
          break;
        case KEY_CODES.CTRL_C:
          handleCtrlC();
          break;
        case KEY_CODES.ARROW_LEFT:
          handleArrowLeft();
          break;
        case KEY_CODES.ARROW_RIGHT:
          handleArrowRight();
          break;
        default:
          // 기타 제어 문자 무시
          if (data.startsWith(KEY_CODES.ESCAPE_PREFIX)) {
            return;
          }
          // 일반 문자 또는 탭
          if (data >= ' ' || data === '\t') {
            handleCharacter(data);
          }
          break;
      }
    },
    [handleEnter, handleBackspace, handleCtrlC, handleArrowLeft, handleArrowRight, handleCharacter]
  );

  /**
   * 터미널 데이터 이벤트 핸들링
   */
  useEffect(() => {
    const term = terminal.current;
    if (!isTerminalReady || !term) {
      return;
    }

    // 환영 메시지 출력 (최초 1회)
    if (!welcomeMessageShown.current) {
      welcomeMessageShown.current = true;
      welcomeMessages.forEach((msg) => {
        term.writeln(`${ANSI.GRAY}${msg}${ANSI.RESET}`);
      });
      term.write(prompt);
    }

    // 데이터 이벤트 리스너 설정
    const disposable = term.onData((data: string): void => {
      if (isConnected) {
        // WebSocket 연결됨: 서버로 전송
        sendMessage({
          type: 'input',
          data,
          timestamp: Date.now(),
        });
      } else {
        // 미연결: 로컬 에코
        handleLocalInput(data);
      }
    });

    return () => {
      disposable.dispose();
      resetInputBuffer();
    };
  }, [
    terminal,
    isTerminalReady,
    isConnected,
    prompt,
    welcomeMessages,
    sendMessage,
    handleLocalInput,
    resetInputBuffer,
  ]);

  /**
   * 연결 상태 변경 시 입력 버퍼 초기화
   */
  useEffect(() => {
    resetInputBuffer();
  }, [isConnected, resetInputBuffer]);
}
