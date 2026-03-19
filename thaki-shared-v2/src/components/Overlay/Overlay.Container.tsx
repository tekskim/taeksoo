import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useStore } from 'zustand';
import {
  IOverlayPrivate,
  OverlayOptions,
  OverlayStoreApi,
  PropsOf,
} from '../../services/stores/overlayStore';
import {
  checkIsFocusedAppFrame,
  lockElementScroll,
  lockGlobalScroll,
  unlockElementScroll,
  unlockGlobalScroll,
} from '../../services/utils';

/** 오버레이 컨테이너의 콘텐츠 루트 엘리먼트를 찾는 헬퍼 */
const findContentRoot = (ref: React.RefObject<HTMLDivElement | null>) =>
  ref.current?.closest<HTMLElement>('[data-app-content="true"]') ??
  ref.current?.closest<HTMLElement>('main.content') ??
  null;

/**
 * @description 오버레이 컴포넌트에서 appeared 상태로 오버레이 컴포넌트가 나타나도록 설정하는 래핑 컴포넌트
 *
 * appeared 상태로 오버레이의 트랜지션 관리 및 esc 키보드 입력으로 최상위 오버레이 닫기 기능을 책임지는 컴포넌트
 */
const OverlayElement = <T extends FunctionComponent<PropsOf<T>>>({
  resolve,
  reject,
  id,
  isTop,
  ref,
  closeOverlayById,
  isActiveTab,
  portalScope,
  ...overlay
}: IOverlayPrivate<T> & {
  isTop: boolean;
  closeOverlayById: (id: string) => void;
  ref: React.RefObject<HTMLDivElement | null>;
  isActiveTab: boolean;
  portalScope?: string;
}) => {
  /** 오버레이 등장 트랜지션 상태 */
  const [appeared, setAppeared] = useState(false);

  /** 오버레이 트랜지션 지속 시간(ms) */
  const duration = overlay.options?.duration ?? 300;

  /** 취소 액션 - rejectOnCancel가 falsy일 경우 Promise를 완료시키는 resolve 함수를 호출 */
  const cancelAction = overlay.options?.rejectOnCancel ? reject : resolve;

  /** 공통 취소 로직 (버튼 클릭, 딤 클릭, ESC 키 모두에서 사용) */
  const handleCancelAction = useCallback(
    (options?: { isEscapeKey?: boolean }) => {
      setAppeared(false);
      cancelAction(null);
      // ESC 키로 닫힐 때 props.onClose 콜백 호출 (selectedAgent 초기화 등)
      if (options?.isEscapeKey && overlay.props && 'onClose' in overlay.props) {
        const onClose = overlay.props.onClose as (() => void) | undefined;
        onClose?.();
      }
      setTimeout(() => closeOverlayById(id), duration);
    },
    [cancelAction, duration, id, closeOverlayById, overlay.props]
  );

  /** esc로 오버레이 닫기함수 */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Escape') {
        return;
      }

      /** 이 오버레이 컨테이너가 쉘 오버레이인지 여부 */
      const isShellOverlay = ref.current?.dataset.shellOverlay === 'true';

      /** 쉘 오버레이 컨테이너에 자식 노드가 있는지 여부 */
      const hasChildInShellOverlay =
        Number(
          document.querySelector<HTMLDivElement>('[data-shell-overlay="true"]')
            ?.dataset.childCount
        ) > 0;

      /** 이 오버레이 컨테이너가 포커스된 앱 프레임인지 여부 */
      const isFocusedAppFrame = checkIsFocusedAppFrame(ref.current);

      /**
       * 1. 쉘 오버레이이면서 자식 드로어가 있는 경우
       * 2. 쉘 오버레이 컨테이너에 자식 노드가 없고 포커스된 앱 프레임인 경우
       * 3. 리모트 앱을 단독으로 구동하여 실행한 경우
       * 위의 경우에 해당하면 esc로 오버레이 닫기
       * */
      if (
        (isShellOverlay && hasChildInShellOverlay) ||
        (!hasChildInShellOverlay && isFocusedAppFrame !== 'false')
      ) {
        handleCancelAction({ isEscapeKey: true });
      }
    },
    [ref, handleCancelAction]
  );

  // 오버레이가 최상위에 위치하고 있으면 esc로 닫기
  useEffect(() => {
    if (isTop && isActiveTab) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isTop, handleKeyDown, isActiveTab]);

  useEffect(() => {
    /** 오버레이 컴포넌트 마운트 이후 30ms 후에 오버레이 컴포넌트가 나타나도록 설정 */
    const timeout = setTimeout(() => {
      setAppeared(true);
    }, 30);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return React.createElement(
    overlay.component as unknown as FunctionComponent<object>,
    {
      ...(overlay.props || {}),
      ...(overlay.options || {}),
      portalScope,
      appeared,
      onConfirm: (result: unknown) => {
        setAppeared(false);
        resolve(result);
        setTimeout(() => closeOverlayById(id), duration);
      },
      onCancel: () => handleCancelAction(),
    }
  );
};

/**
 * @description 오버레이 컨테이너 컴포넌트
 *
 * 외부에서 레이아웃 내부에 배치하여 오버레이 리스트들의 렌더링을 직접적으로 책임지는 컴포넌트
 *
 * @param isShell - 앱이 아닌 쉘 오버레이인지 여부
 */
const OverlayContainer = ({
  isShell = false,
  overlayStore,
  isActiveTab = true,
}: {
  isShell?: boolean;
  overlayStore: OverlayStoreApi;
  isActiveTab?: boolean;
}) => {
  /** 현재 컨테이너가 앱 프레임 내부인지 여부 */
  const [isFocusedAppFrame, setIsFocusedAppFrame] =
    useState<ReturnType<typeof checkIsFocusedAppFrame>>();

  /** 포탈 스코프 식별자 */
  const [portalScope, setPortalScope] = useState<string | undefined>();

  /** 오버레이 컨테이너 DOM 참조 */
  const overlayContainerRef = useRef<HTMLDivElement>(null);

  /** 현재 열린 오버레이 목록 */
  const overlays = useStore(overlayStore, state => state.overlays);

  /** 컨테이너 마운트 시 앱 프레임 상태 및 포탈 스코프 초기화 */
  const handleContainerRef = useCallback((node: HTMLDivElement | null) => {
    overlayContainerRef.current = node;

    if (!node) {
      return;
    }

    const nextValue = checkIsFocusedAppFrame(node);
    setIsFocusedAppFrame(prev => (prev === nextValue ? prev : nextValue));

    const rootEl = node.closest<HTMLElement>('[data-portal-root]');
    const nextScope = rootEl?.id;
    setPortalScope(prev => (prev === nextScope ? prev : nextScope));
  }, []);

  /** 스크롤 잠금 및 포탈 대상으로 사용되는 콘텐츠 루트 */
  const contentRoot = findContentRoot(overlayContainerRef);

  useEffect(() => {
    const inStandalone = isFocusedAppFrame === 'not-in-appframe';
    // Standalone/local dev: lock the document body
    if (inStandalone) {
      if (isActiveTab && overlays.length === 1) {
        lockGlobalScroll();
      }
      if (!isActiveTab || overlays.length === 0) {
        unlockGlobalScroll();
      }
      return;
    }

    // AppFrame: lock the active tab scroll area inside the frame
    const activeTab =
      contentRoot?.querySelector<HTMLDivElement>(
        '[data-tab-content="true"][data-active="true"]'
      ) ?? null;

    if (activeTab) {
      if (isActiveTab && overlays.length === 1) {
        lockElementScroll(activeTab);
      }
      if (!isActiveTab || overlays.length === 0) {
        unlockElementScroll(activeTab);
      }
    }
  }, [overlays.length, isFocusedAppFrame, isActiveTab, contentRoot]);

  const containerEl = (
    <div
      ref={handleContainerRef}
      className="overlay-container"
      aria-label="overlay-container"
      data-shell-overlay={isShell}
      data-child-count={overlays.length}
      style={{ display: isActiveTab ? 'block' : 'none' }}
    >
      {overlays.map(({ resolve, reject, id, ...overlay }, index) => {
        const overlayOptions: OverlayOptions = overlay.options ?? {};
        const shouldDisableDimClick = overlayOptions.type === 'modal';
        const optionsWithOverrides: OverlayOptions = {
          ...overlayOptions,
          ...(shouldDisableDimClick ? { closeOnDimClick: false } : {}),
          isGlobal:
            isFocusedAppFrame === 'not-in-appframe'
              ? true
              : overlayOptions.isGlobal,
        };

        return (
          <OverlayElement
            {...{
              ...overlay,
              options: {
                ...optionsWithOverrides,
              },
            }}
            key={id}
            id={id}
            isTop={index === overlays.length - 1}
            ref={overlayContainerRef}
            closeOverlayById={overlayStore.getState().closeOverlayById}
            isActiveTab={isActiveTab}
            resolve={resolve}
            reject={reject}
            portalScope={portalScope}
          />
        );
      })}
    </div>
  );

  // In AppFrame, mount overlays at the Frame content root to avoid clipping by tab paddings
  const shouldPortalIntoFrame =
    isFocusedAppFrame !== 'not-in-appframe' && Boolean(contentRoot);

  return shouldPortalIntoFrame && contentRoot
    ? createPortal(containerEl, contentRoot)
    : containerEl;
};

export default OverlayContainer;
