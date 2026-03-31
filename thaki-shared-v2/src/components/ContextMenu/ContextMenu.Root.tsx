import { useEffect, useRef, useState } from 'react';
import type { Direction } from '../../types';

import Portal from '../Portal';

import React from 'react';
import { useClickOutside } from '../../services';
import { cn } from '../../services/utils/cn';
import ContextMenuItem, { type PrivateItemProps as ContextMenuItemProps } from './ContextMenu.Item';
import { contentStyles, contextMenuStyles, triggerStyles } from './ContextMenu.styles';

/**
 * @type
 *
 * 서브 컨텍스트 메뉴의 열리는 방향 (루트 컨텍스트 메뉴의 방향과 다르게 열릴 수 있음)
 */
type SubContextMenuDirection = 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom';

type PortalPosition = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

//외부에서 사용할 수 있는 Public Props
interface Props {
  className?: string;
  disabled?: boolean;
  trigger: ({
    isOpen,
    open,
    close,
    toggle,
  }: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
  }) => React.ReactElement<HTMLElement>;
  /** 포탈이 열릴 방향 (선호 방향, 자동으로 최적 위치 계산됨) */
  direction?: Direction;
  /** 포탈과 트리거 사이의 간격 (픽셀) */
  gap?: number;
  /** 자동 위치 계산 비활성화 */
  disableAutoPosition?: boolean;
  /** 서브 컨텍스트 메뉴의 열리는 위치 */
  subContextMenuDirection?: SubContextMenuDirection;
  /** 컨텍스트 메뉴 컨텐츠 영역에 적용할 클래스 */
  contentClassName?: string;
  /** 포탈 위치에 추가 오프셋 */
  position?: PortalPosition;
  /**
   * true면 메뉴 영역에서 마우스가 벗어났을 때 자동으로 닫습니다.
   * - hover 기반 서브메뉴(openOnHover 등)에서 사용합니다.
   */
  closeOnMouseLeave?: boolean;
  /**
   * closeOnMouseLeave 사용 시 닫힘 지연 시간(ms).
   * - 트리거 → 서브메뉴로 커서를 이동할 때 gap(여백) 때문에 즉시 닫히는 문제를 방지합니다.
   */
  closeDelayMs?: number;
  /** 스크롤이 끝에 도달했을 때 호출됩니다 (무한스크롤 용) */
  onScrollEnd?: () => void;
  children: React.ReactNode;
}

// 내부에서만 사용하는 Private Props
interface PrivateProps extends Props {
  parentContextMenuId?: string;
  parentElement?: HTMLElement;
  closeRoot?: () => void;
}

/**
 * @description
 * ContextMenu 컴포넌트는 컨텍스트 메뉴 형태의 메뉴를 제공하며,
 * 사용자가 원하는 옵션을 선택할 수 있도록 합니다.
 *
 * 주요 기능:
 * - 컨텍스트 메뉴 형태의 메뉴를 제공합니다.
 * - 컨텍스트 메뉴의 열리는 방향을 지정할 수 있습니다.
 * @param className - 컨텍스트 메뉴 컴포넌트의 클래스 이름
 * @param disabled - 컨텍스트 메뉴 컴포넌트의 비활성화 여부 (기본값: false)
 * @param disableAutoPosition - 자동 위치 계산 비활성화 여부
 * @param parentContextMenuId - 부모 컨텍스트 메뉴의 ID
 * @param subContextMenuDirection - 서브 컨텍스트 메뉴의 열리는 방향
 * @param gap - 컨텍스트 메뉴 컴포넌트와 트리거 사이의 간격
 * @param parentElement - 부모 컨텍스트 메뉴의 요소
 * @param children - 컨텍스트 메뉴 컴포넌트의 자식 요소
 * @param trigger - 컨텍스트 메뉴 컴포넌트의 트리거 요소
 * @param direction - 컨텍스트 메뉴 컴포넌트의 열리는 방향
 * @param closeRoot - 컨텍스트 메뉴 컴포넌트의 모든 컨텍스트 메뉴를 닫는 함수
 * @returns 컨텍스트 메뉴 컴포넌트
 */
const RootPrivate = ({
  className,
  disabled = false,
  disableAutoPosition: _disableAutoPosition = false,
  parentContextMenuId = '',
  subContextMenuDirection = 'right-top',
  gap = 8,
  parentElement,
  children,
  trigger: getTrigger,
  direction: defaultDirection = 'bottom',
  closeRoot,
  contentClassName,
  position,
  closeOnMouseLeave = false,
  closeDelayMs = 120,
  onScrollEnd,
}: PrivateProps): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const triggerRef = useRef<HTMLDivElement>(null);
  const contextMenuContentRef = useRef<HTMLUListElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  const clearCloseTimer = (): void => {
    if (closeTimerRef.current === null) {
      return;
    }
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  };

  /** 컨텍스트 메뉴 오픈함수 */
  const handleOpen = (): void => {
    if (disabled) {
      return;
    }

    clearCloseTimer();
    setIsOpen(true);
  };

  /** 컨텍스트 메뉴 닫힘함수 */
  const handleClose = (): void => {
    clearCloseTimer();
    setIsOpen(false);
  };

  const scheduleClose = (): void => {
    if (!closeOnMouseLeave) {
      return;
    }
    if (!isOpen) {
      return;
    }

    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      handleClose();
    }, closeDelayMs);
  };

  /** 컨텍스트 메뉴 토글함수 */
  const handleToggle = (): void => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  /** 컨텍스트 메뉴의 트리거 요소 */
  const triggerElement = getTrigger({
    isOpen,
    open: handleOpen,
    close: handleClose,
    toggle: handleToggle,
  });

  // close 타이머 정리 (unmount)
  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, []);

  /** 부모 컨텍스트 메뉴 컴포넌트의 마운트된 순서 */
  const parentContextMenuOrder = Number(parentElement?.dataset.contextmenuOrder);

  /** 현재 컨텍스트 메뉴 컴포넌트의 마운트된 순서 */
  const currentContextMenuOrder = Number.isInteger(parentContextMenuOrder)
    ? parentContextMenuOrder + 1
    : 0;

  /** 서브 컨텍스트 메뉴의 경우 그 메뉴를 닫는 함수 */
  const closeSubContextMenu = (): void => {
    setIsOpen(false);

    // 비동기 돔업데이트 딜레이때문에 잠깐 기다림
    setTimeout(() => {
      /** 부모 컨텍스트 메뉴 순서 번호 */
      const parentContextMenuOrder = currentContextMenuOrder - 1;

      const parentContextMenu = document.querySelector(
        `[data-contextmenu-order="${parentContextMenuOrder}"]`
      ) as HTMLElement;

      // 현재 컨텍스트 메뉴가 닫히면 부모 컨텍스트 메뉴에 포커스
      (parentContextMenu ?? parentElement)?.focus();
    }, 50);
  };

  /** 아이템이 서브 컨텍스트 메뉴인 경우 이것을 여는 함수 */
  const toggleSubContextMenu = (): void => {
    const focusedItem = contextMenuContentRef.current?.children[focusedIndex];

    const toggleableElement = focusedItem?.querySelector(
      'button.contextmenu-item-trigger'
    ) as HTMLButtonElement | null;

    toggleableElement?.click();
  };

  /** 모든 컨텍스트 메뉴를 닫는 함수 */
  const closeAll = (): void => {
    if (typeof closeRoot === 'function') {
      closeRoot();
    } else {
      setIsOpen(false);
    }
  };

  /**
   * 키보드 엔터 이벤트핸들러 함수
   *
   * @case action이 있는 경우 일반적인 컨텍스트 메뉴 아이템으로서 이벤트 발생 시 액션 실행
   * @case action이 없는 경우 서브아이템으로서 서브 컨텍스트 메뉴 토글
   */
  const handleOnEnter = async (): Promise<void> => {
    const focusedItem = React.Children.toArray(children)[focusedIndex];

    if (!focusedItem) {
      return;
    }

    const {
      props: { action, disabled, preventCloseAfterAction },
    } = focusedItem as React.ReactElement<ContextMenuItemProps>;

    if (disabled) {
      return;
    }

    if (action) {
      // 일반 액션 아이템인 경우
      try {
        const actionResult = action();

        if (actionResult instanceof Promise) {
          actionResult.catch(console.error);
        }
      } catch (error) {
        console.error(error);
      }

      if (preventCloseAfterAction) {
        return;
      }

      closeAll();
    } else {
      // action이 없으면 서브아이템 팝업이므로 토글버튼을 클릭 (서브 컨텍스트 메뉴 토글)
      toggleSubContextMenu();
    }
  };

  /** 컨텍스트 메뉴 포커스 인덱스 증가 함수 */
  const increaseFocusedIndex = (numbersOfChildren: number): void => {
    const next = focusedIndex + 1;

    setFocusedIndex(next >= numbersOfChildren ? 0 : next);
  };

  /** 컨텍스트 메뉴 포커스 인덱스 감소 함수 */
  const decreaseFocusedIndex = (numbersOfChildren: number): void => {
    const prev = focusedIndex - 1;

    setFocusedIndex(prev < 0 ? numbersOfChildren - 1 : prev);
  };

  /** 키보드 이벤트 함수 */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>): void => {
    e.preventDefault();
    e.stopPropagation();

    /** 칠드런의 개수 */
    const numbersOfChildren = React.Children.count(children);

    if (e.key === 'ArrowDown') {
      increaseFocusedIndex(numbersOfChildren);
    } else if (e.key === 'ArrowUp') {
      decreaseFocusedIndex(numbersOfChildren);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      /** 서브 컨텍스트 메뉴인 경우 (contextMenuItemId가 있는 경우) */
      const isSubContextMenu = Boolean(parentContextMenuId);

      if (isSubContextMenu) {
        // 서브 컨텍스트 메뉴는 direction="left"로 열리므로, ArrowRight를 누르면 닫기 및 그 반대케이스의 경우
        if (
          (e.key === 'ArrowRight' && subContextMenuDirection.startsWith('left')) ||
          (e.key === 'ArrowLeft' && subContextMenuDirection.startsWith('right'))
        ) {
          closeSubContextMenu();
          return;
        }
      }

      // 루트에서는 서브 컨텍스트 메뉴가 열린 쪽으로만 키보드가 동작하도록 처리
      if (
        (e.key === 'ArrowRight' && subContextMenuDirection.startsWith('right')) ||
        (e.key === 'ArrowLeft' && subContextMenuDirection.startsWith('left'))
      ) {
        toggleSubContextMenu();
      }
    } else if (e.key === 'Enter') {
      handleOnEnter();
    } else if (e.key === 'Escape') {
      setIsOpen(false);

      setTimeout(() => {
        parentElement?.focus();
      }, 20);
    }
  };

  /** 조상요소에 컨텍스트 메뉴 순서 data-set value가 있는지 재귀적으로 탐색하는 함수 */
  const getTargetContextMenuOrderRecursively = ({
    parentElement: targetParentElement,
    dataset,
  }: HTMLElement): number | null => {
    if (dataset.contextmenuOrder) {
      return Number.isInteger(Number(dataset.contextmenuOrder))
        ? Number(dataset.contextmenuOrder)
        : 0;
    }

    if (!targetParentElement) {
      return null;
    }

    return getTargetContextMenuOrderRecursively(targetParentElement as HTMLElement);
  };

  // <---------- 외부 영역이 클릭되면 현재 컨텍스트 메뉴의 자식 컨텍스트 메뉴나 트리거 요소가 클릭되었는지 판별하여 조건에 따라 컨텍스트 메뉴를 닫는 effect
  useClickOutside(contextMenuContentRef, {
    onClickOutside: ({ target }) => {
      const targetElement = target as HTMLElement;

      const { parentElement: targetParentElement } = targetElement;

      const parentElementId = targetParentElement?.id;

      /** 현재 컨텍스트 메뉴의 루트 트리거 요소 */
      const rootTriggerElement = targetElement.closest(
        '[data-is-root="true"]'
      ) as HTMLElement | null;

      /** 클릭된 요소가 직계 부모 컨텍스트 메뉴인 경우 */
      const isParentContextMenu = parentElementId && parentElementId === parentContextMenuId;

      /** 클릭된 요소가 루트 컨텍스트 메뉴인 경우 */
      const isRootContextMenu = rootTriggerElement && rootTriggerElement === triggerRef.current;

      if (isParentContextMenu || isRootContextMenu) {
        return;
      }

      /** 이벤트 요소에서 찾은 컨텍스트 메뉴 순서 */
      const targetContextMenuOrder = getTargetContextMenuOrderRecursively(targetElement);

      /** 완전 외부가 클릭되었거나(클릭된 요소에서 contextmenu order를 못찾은 경우) 또는, 부모가 아닌 조상 컨텍스트 메뉴인 경우 */
      const isOutsideOrGrandParentContextMenu =
        targetContextMenuOrder === null || targetContextMenuOrder < currentContextMenuOrder;

      if (isOutsideOrGrandParentContextMenu) {
        handleClose();
      }
    },
  });

  // <---------- 현재 컨텍스트 메뉴가 열렸을 때, 메뉴 컨텐츠 영역에 focus를 주는 effect
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setTimeout(() => {
      const { current: contextMenuContent } = contextMenuContentRef;

      if (!contextMenuContent) {
        return;
      }

      contextMenuContent.focus();
    }, 50);

    return () => {
      setFocusedIndex(-1);
    };
  }, [isOpen]);

  return (
    <div
      className={cn(contextMenuStyles, className)}
      aria-label={parentContextMenuId ? 'Submenu' : 'Context menu'}
    >
      <div
        ref={triggerRef}
        className={triggerStyles}
        data-is-root={!parentContextMenuId}
        onMouseEnter={() => {
          if (!closeOnMouseLeave) {
            return;
          }
          clearCloseTimer();
        }}
        onMouseLeave={() => {
          scheduleClose();
        }}
      >
        {triggerElement}
      </div>
      {!disabled && isOpen && (
        <Portal
          triggerRef={triggerRef}
          direction={defaultDirection}
          gap={gap}
          matchWidth={false}
          position={position}
        >
          <ul
            ref={contextMenuContentRef}
            role="menu"
            className={cn(contentStyles, contentClassName)}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            data-contextmenu-order={currentContextMenuOrder}
            data-parent-contextmenu-id={parentContextMenuId || undefined}
            aria-label={parentContextMenuId ? 'Submenu options' : 'Menu options'}
            onScroll={(e) => {
              if (!onScrollEnd) return;
              const target = e.currentTarget;
              const threshold = 20;
              if (target.scrollTop + target.clientHeight >= target.scrollHeight - threshold) {
                onScrollEnd();
              }
            }}
            onMouseEnter={() => {
              if (!closeOnMouseLeave) {
                return;
              }
              clearCloseTimer();
            }}
            onMouseLeave={(event) => {
              if (!closeOnMouseLeave) {
                return;
              }

              const related = event.relatedTarget as HTMLElement | null;

              // 같은 서브메뉴 트리거(부모 메뉴의 SubItems 버튼)로 이동한 경우는 닫지 않음
              if (
                related &&
                parentContextMenuId &&
                related.closest(`[id="${parentContextMenuId}"]`)
              ) {
                return;
              }

              // 더 깊은(자식) 서브메뉴로 이동하는 경우는 닫지 않음
              const relatedOrderElement = related?.closest(
                '[data-contextmenu-order]'
              ) as HTMLElement | null;
              const relatedOrder = relatedOrderElement?.dataset.contextmenuOrder
                ? Number(relatedOrderElement.dataset.contextmenuOrder)
                : null;

              if (
                typeof relatedOrder === 'number' &&
                Number.isFinite(relatedOrder) &&
                relatedOrder > currentContextMenuOrder
              ) {
                return;
              }

              scheduleClose();
            }}
          >
            {React.Children.map(children, (_child, index) => {
              /** 컨텍스트 메뉴 아이템 */
              const child = _child as React.ReactElement<
                | ContextMenuItemProps
                | (ContextMenuItemProps & {
                    parentElement: HTMLUListElement;
                    direction: SubContextMenuDirection;
                    subContextMenuDirection: SubContextMenuDirection;
                  })
              >;

              // 함수 컴포넌트가 자식으로 들어온 경우
              if (typeof child?.type === 'function') {
                /** 컨텍스트 메뉴 함수컴포넌트 디스플레이네임 */
                const childDiplayName = (child.type as unknown as { displayName: string })
                  .displayName;

                if (
                  childDiplayName === 'ContextMenuSubItems' ||
                  childDiplayName === 'ContextMenuItem'
                ) {
                  const props: Readonly<ContextMenuItemProps> = {
                    ...child.props,
                    focused: focusedIndex === index,
                    updateFocusedIndex: () => setFocusedIndex(index),
                    closeAll,
                  };

                  // 컨텍스트 메뉴 아이템인 경우
                  if (child.type === ContextMenuItem) {
                    return React.cloneElement(child, props);
                  }

                  // 컨텍스트 메뉴 서브아이템 메뉴인 경우
                  return React.cloneElement(child, {
                    ...props,
                    direction: subContextMenuDirection,
                    parentElement: contextMenuContentRef.current ?? undefined,
                  });
                }
              }

              // 일반 children은 그대로 반환 (ContextMenuItem은 context를 통해 closeAll을 받음)
              return child;
            })}
          </ul>
        </Portal>
      )}
    </div>
  );
};

// 외부에서 사용할 수 있는 Public 컴포넌트
const Root = (props: Props): React.ReactElement => <RootPrivate {...props} />;

export default Root;
export { RootPrivate };
export type { Props as ContextMenuRootProps, SubContextMenuDirection };
