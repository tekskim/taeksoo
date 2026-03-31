import { createContext, FunctionComponent, useCallback, useMemo } from 'react';
import { IOverlay, OverlayStoreApi, PropsOf } from '../../stores/overlayStore';

type OverlayProvider = {
  overlayStore: OverlayStoreApi;
  openOverlay: OpenOverlay;
  closeOverlayById: (overlayId: string) => Promise<void>;
};

/**
 * @description 오버레이 Context. 직접 사용하지 말고 useOverlay() 훅을 사용하세요.
 */
const OverlayContext = createContext<OverlayProvider | null>(null);

/**
 * @description openOverlay 함수 타입. Promise를 반환하여 사용자 응답을 처리합니다.
 */
type OpenOverlay = <T extends FunctionComponent<PropsOf<T>>>(
  overlay: IOverlay<T>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<any>;

/**
 * @description 오버레이(모달, 드로어) 시스템 Provider
 *
 * ## 핵심 로직
 * - openOverlay: 고유 ID 생성 → Promise로 감싸서 스토어에 추가 → 사용자 응답 대기
 * - closeOverlayById: 스토어에서 제거 → Promise resolve/reject 호출
 *
 * ## 설정
 * ```tsx
 * const overlayStore = createOverlayStore();
 * <OverlayProvider overlayStore={overlayStore}>
 *   <App />
 *   <Overlay.Container overlayStore={overlayStore} />
 * </OverlayProvider>
 * ```
 *
 * ## 사용
 * ```tsx
 * const { openOverlay } = useOverlay();
 * const result = await openOverlay({
 *   component: MyModal,
 *   props: { data },
 *   options: { type: 'modal' }
 * });
 * ```
 */
const OverlayProvider = ({
  children,
  overlayStore,
}: {
  children: React.ReactNode;
  overlayStore: OverlayStoreApi;
}) => {
  /** 오버레이 열기: ID 생성 → Promise로 감싸서 스토어에 추가 */
  const openOverlay: OpenOverlay = useCallback(
    (overlay) => {
      return new Promise((resolve, reject) => {
        overlayStore.getState().addOverlay({
          ...overlay,
          resolve,
          reject,
          id: `overlayID-${Date.now()}-${Math.random()}`,
        });
      });
    },
    [overlayStore]
  );

  /** 오버레이 닫기: 스토어에서 제거 → Promise resolve/reject */
  const closeOverlayById = useCallback(
    async (overlayId: string) => {
      overlayStore.getState().closeOverlayById(overlayId);
    },
    [overlayStore]
  );

  const value = useMemo(
    () => ({
      overlayStore,
      openOverlay,
      closeOverlayById,
    }),
    [overlayStore, openOverlay, closeOverlayById]
  );

  return <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>;
};

export { OverlayContext, OverlayProvider };
