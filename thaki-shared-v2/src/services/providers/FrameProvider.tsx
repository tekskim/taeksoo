import React, { createContext, useContext, useMemo } from 'react';

/**
 * 프레임 컨텍스트 값 타입
 * @property frameId - 프레임의 고유 식별자 (각 앱 인스턴스를 구분)
 * @property orgId - 현재 선택된 조직 ID
 * @property dragHandleClassName - 드래그 가능한 영역의 CSS 클래스명 (선택적)
 */
interface FrameContextValue {
  frameId: string;
  orgId: string;
  dragHandleClassName?: string;
}

const FrameContext = createContext<FrameContextValue | null>(null);

/**
 * FrameProvider Props 타입
 * @property frameId - 프레임 ID (기본값: 'app')
 * @property orgId - 현재 선택된 조직 ID (기본값: '')
 * @property dragHandleClassName - 드래그 핸들 클래스명 (선택적)
 * @property children - 자식 컴포넌트
 */
interface FrameProviderProps {
  frameId?: string;
  orgId?: string;
  dragHandleClassName?: string;
  children: React.ReactNode;
}

/**
 * 프레임 컨텍스트 Provider
 *
 * 앱 인스턴스의 프레임 ID와 드래그 핸들 정보를 하위 컴포넌트에 제공합니다.
 * 모듈 페더레이션 환경에서 여러 앱 인스턴스를 구분하고,
 * 창 드래그 기능을 위한 핸들 클래스를 관리합니다.
 *
 * @example
 * ```tsx
 * <FrameProvider frameId="compute-app" dragHandleClassName="drag-handle">
 *   <App />
 * </FrameProvider>
 * ```
 */
export const FrameProvider: React.FC<FrameProviderProps> = ({
  frameId = 'app',
  orgId = '',
  dragHandleClassName,
  children,
}) => {
  const value = useMemo(
    () => ({
      frameId,
      orgId,
      dragHandleClassName,
    }),
    [frameId, orgId, dragHandleClassName]
  );

  return <FrameContext.Provider value={value}>{children}</FrameContext.Provider>;
};

/**
 * 프레임 컨텍스트 훅
 *
 * 현재 프레임의 ID와 드래그 핸들 클래스명을 가져옵니다.
 * FrameProvider 내부에서만 사용 가능합니다.
 *
 * @returns frameId와 dragHandleClassName을 포함한 객체
 * @throws FrameProvider 외부에서 사용 시 에러 발생
 *
 * @example
 * ```tsx
 * const { frameId, dragHandleClassName } = useFrame();
 * console.log(frameId); // 'compute-app'
 * ```
 */
const useFrame = (): FrameContextValue => {
  const context = useContext(FrameContext);
  if (!context) {
    throw new Error('useFrame must be used within FrameProvider');
  }
  return context;
};

export { useFrame };
