/**
 * Toast 타입 정의
 * @description 성공/실패 시 표시되는 토스트 메시지의 타입
 */
interface ToastType {
  /** 토스트 타입 */
  type?: 'positive' | 'negative';
  /** 타임스탬프 (milliseconds from Date.now()) */
  timestamp?: number;
  /** 앱 식별 아이콘 (각 앱에서 주입) */
  appIcon?: React.ReactElement;
  /** 토스트 메시지 */
  message: string;
  /** 토스트 설명 (하위 호환성 유지) */
  description?: string;
  /** 토스트를 클릭하면 실행되는 네비게이션 함수 (각 훅에서 주입) */
  onNavigate?: () => void;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const css: string;
  export default css;
}
declare module '*.svg?component' {
  const Component: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  export default Component;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}
