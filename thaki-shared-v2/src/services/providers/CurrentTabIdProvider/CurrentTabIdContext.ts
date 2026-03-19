import { createContext } from 'react';

/**
 * 현재 탭 ID를 제공하는 컨텍스트
 * 각 탭 내부의 컴포넌트가 자신의 탭 ID를 알 수 있게 합니다.
 */
export const CurrentTabIdContext = createContext<string | null>(null);

