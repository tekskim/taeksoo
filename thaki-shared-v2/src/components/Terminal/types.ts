/**
 * Terminal Types
 *
 * WebSocket 기반 원격 터미널 컴포넌트 타입 정의
 */

/**
 * 터미널 연결 상태
 */
export type TerminalConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

/**
 * 터미널 테마 설정
 */
export interface TerminalTheme {
  background?: string;
  foreground?: string;
  cursor?: string;
  cursorAccent?: string;
  selection?: string;
  black?: string;
  red?: string;
  green?: string;
  yellow?: string;
  blue?: string;
  magenta?: string;
  cyan?: string;
  white?: string;
  brightBlack?: string;
  brightRed?: string;
  brightGreen?: string;
  brightYellow?: string;
  brightBlue?: string;
  brightMagenta?: string;
  brightCyan?: string;
  brightWhite?: string;
}

/**
 * Terminal Props
 */
export interface TerminalProps {
  /**
   * 터미널 제목 (헤더에 표시)
   */
  title?: string;

  /**
   * WebSocket 연결 URL
   */
  wsUrl?: string;

  /**
   * WebSocket URL 빌더 함수 (wsUrl 대신 동적 URL 생성)
   */
  buildWsUrl?: () => string;

  /**
   * WebSocket 메시지 포맷
   * - json: {type, data, rows, cols} 형태로 송수신 (기본)
   * - raw: 문자열을 그대로 송수신 (kubectl exec 등)
   */
  wsMessageFormat?: 'json' | 'raw';

  /**
   * 인증 토큰 (선택 사항)
   */
  authToken?: string;

  /**
   * 터미널 테마 (선택 사항)
   */
  theme?: TerminalTheme;

  /**
   * 터미널 폰트 크기 (기본값: 12)
   */
  fontSize?: number;

  /**
   * 터미널 폰트 패밀리 (기본값: 'Menlo, Monaco, "Courier New", monospace')
   */
  fontFamily?: string;

  /**
   * 커서 블링크 활성화 (기본값: true)
   */
  cursorBlink?: boolean;

  /**
   * 연결 상태 변경 시 콜백
   */
  onConnectionChange?: (status: TerminalConnectionStatus) => void;

  /**
   * 에러 발생 시 콜백
   */
  onError?: (error: Error) => void;

  /**
   * 터미널 닫기 시 콜백
   */
  onClose?: () => void;

  /**
   * 새 창으로 열기 시 콜백
   */
  onOpenInNewWindow?: () => void;

  /**
   * 디버그 모드 (콘솔 로그 출력)
   */
  debug?: boolean;

  /**
   * Mock 모드 (WebSocket 연결 없이 로컬 에코만 사용, 기본값: false)
   */
  mockMode?: boolean;

  /**
   * 외부에서 터미널 화면을 초기화하기 위한 시그널 값
   * - 값이 변경될 때마다 xterm 화면만 clear 합니다. (세션/연결 유지)
   * - 예: 버튼 클릭 시 setClearSignal(prev => prev + 1)
   */
  clearSignal?: number;

  /**
   * 자동 재연결 활성화 (기본값: true)
   */
  autoReconnect?: boolean;

  /**
   * 재연결 시도 횟수 (기본값: 3)
   */
  maxReconnectAttempts?: number;

  /**
   * 재연결 대기 시간 (ms, 기본값: 3000)
   */
  reconnectDelay?: number;

  /**
   * 커스텀 CSS 클래스명
   */
  className?: string;

  /**
   * 전체 너비 모드 (부모 padding 무시)
   */
  fullWidth?: boolean;

  /**
   * 초기 환영 메시지 (배열로 여러 줄)
   */
  welcomeMessages?: string[];

  /**
   * 프롬프트 문자 (기본값: '> ')
   */
  prompt?: string;

  /**
   * 연결 성공 시 표시할 메시지 포맷 함수
   */
  formatConnectedMessage?: () => string;

  /**
   * Mock 모드에서 명령어 실행 시 메시지 포맷 함수
   */
  formatMockCommandMessage?: (command: string) => string;

  /**
   * 터미널 아이콘 (커스텀 아이콘 렌더링)
   */
  renderIcon?: () => React.ReactNode;

  /**
   * 헤더 숨김 여부
   */
  hideHeader?: boolean;

  /**
   * 활성화 시 자동 포커스 여부
   */
  autoFocus?: boolean;

  /**
   * 외부에서 포커스를 요청하는 시그널
   * - 값이 변경될 때마다 autoFocus=true인 터미널에 포커스를 다시 적용합니다.
   */
  focusSignal?: number;

  /**
   * 드래그 핸들 클래스명 (창 이동에 사용)
   * 설정 시 터미널 헤더에 해당 클래스가 적용됨
   */
  dragHandleClassName?: string;

  /**
   * 새 창 모드 여부
   * - true: ResizeObserver로 컨테이너 크기 확보 대기 (새 창/팝업에서 사용)
   * - false: 즉시 초기화 (일반 패널에서 사용)
   * @default false
   */
  isNewWindow?: boolean;
}

/**
 * WebSocket 메시지 타입
 */
export interface TerminalMessage {
  type: 'input' | 'output' | 'error' | 'resize' | 'ping' | 'pong';
  data?: string;
  rows?: number;
  cols?: number;
  timestamp?: number;
}
