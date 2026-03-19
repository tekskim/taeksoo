import React, { ReactElement, useId } from 'react';
import { cn } from '../../services/utils/cn';
import { ChevronRightIcon } from '../Icon/svg/wrapped';
import Item from './ContextMenu.Item';
import {
  subitemContextMenuStyles,
  itemTriggerStyles,
  subitemTriggerStyles,
  chevronHoverStyles,
} from './ContextMenu.styles';
import {
  RootPrivate as ContextMenu,
  SubContextMenuDirection,
} from './ContextMenu.Root';

/**
 * @type
 *
 * ContextMenu.Item 컴포넌트 타입 정의
 */
type ContextMenuItemElement = ReactElement<React.ComponentProps<typeof Item>>;

/**
 * @type
 *
 * ContextMenu.SubItems 컴포넌트 타입 정의
 */
type ContextMenuSubItemsElement = ReactElement<
  React.ComponentProps<typeof SubItems>
>;

interface OffsetPosition {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

interface Props {
  className?: string;
  disabled?: boolean;
  label: React.ReactNode;
  children: React.ReactNode;
  subContextMenuDirection?: SubContextMenuDirection;
  gap?: number;
  position?: OffsetPosition;
  /** true면 클릭 없이 호버만으로 서브메뉴를 엽니다. */
  openOnHover?: boolean;
  /** 서브메뉴가 열릴 때 호출됩니다. */
  onOpen?: () => void;
  /** 컨텍스트 메뉴 컨텐츠 영역에 적용할 클래스 (스크롤 등) */
  contentClassName?: string;
  /** 스크롤이 끝에 도달했을 때 호출됩니다 (무한스크롤 용) */
  onScrollEnd?: () => void;
}

/** 외부에 노출될 필요 없는 props (ContextMenu 컴포넌트 내부에서만 주입가능) */
interface PrivateProps extends Props {
  focused?: boolean;
  direction?: SubContextMenuDirection;
  parentElement?: HTMLUListElement;
  updateFocusedIndex?: () => void;
  closeAll?: () => void;
}

/** children이 ContextMenu.Item 또는 ContextMenu.SubItems인지 확인하는 타입 가드 */
const isContextMenuItem = (
  child: React.ReactNode
): child is ContextMenuItemElement | ContextMenuSubItemsElement => {
  const displayName =
    React.isValidElement(child) && typeof child.type === 'function'
      ? (child.type as unknown as { displayName?: string }).displayName
      : undefined;

  return (
    React.isValidElement(child) &&
    (child.type === Item ||
      child.type === SubItems ||
      displayName === 'ContextMenuItem' ||
      displayName === 'ContextMenuSubItems')
  );
};

/**
 * @description
 * ContextMenuSubItems 컴포넌트는 컨텍스트 메뉴의 서브아이템을 제공하며,
 * 사용자가 원하는 옵션을 선택할 수 있도록 합니다.
 *
 * 주요 기능:
 * - 컨텍스트 메뉴의 서브아이템을 제공합니다.
 * - 컨텍스트 메뉴의 서브아이템을 비활성화할 수 있습니다. (기본값: false)
 * - 컨텍스트 메뉴의 서브아이템을 포커스 인덱스를 업데이트할 수 있습니다.
 * - 컨텍스트 메뉴의 서브아이템을 모든 컨텍스트 메뉴를 닫을 수 있습니다.
 * @param className - 컨텍스트 메뉴의 서브아이템의 클래스 이름
 * @param label - 컨텍스트 메뉴의 서브아이템의 라벨
 * @param focused - 컨텍스트 메뉴의 서브아이템의 포커스 여부
 * @param disabled - 컨텍스트 메뉴의 서브아이템의 비활성화 여부
 * @param subContextMenuDirection - 컨텍스트 메뉴의 서브아이템의 서브 컨텍스트 메뉴의 열리는 방향
 * @param children - 컨텍스트 메뉴의 서브아이템의 자식 요소
 * @param parentElement - 컨텍스트 메뉴의 서브아이템의 부모 요소
 * @param updateFocusedIndex - 컨텍스트 메뉴의 서브아이템의 포커스 인덱스를 업데이트하는 함수
 * @param closeAll - 컨텍스트 메뉴의 서브아이템의 모든 컨텍스트 메뉴를 닫는 함수
 * @returns 컨텍스트 메뉴의 서브아이템 컴포넌트
 */
const SubItemsPrivate = ({
  className,
  label,
  focused = false,
  disabled = false,
  direction,
  subContextMenuDirection,
  children,
  parentElement,
  updateFocusedIndex,
  closeAll,
  gap = 8,
  position,
  openOnHover = false,
  onOpen,
  contentClassName,
  onScrollEnd,
}: PrivateProps): React.ReactElement => {
  const contextMenuItemId = useId();

  return (
    <ContextMenu
      className={subitemContextMenuStyles}
      parentContextMenuId={contextMenuItemId}
      direction={direction}
      subContextMenuDirection={subContextMenuDirection}
      parentElement={parentElement}
      gap={gap}
      position={position}
      closeRoot={closeAll}
      closeOnMouseLeave={openOnHover}
      closeDelayMs={openOnHover ? 120 : 0}
      contentClassName={contentClassName}
      onScrollEnd={onScrollEnd}
      trigger={({ isOpen, open, toggle }) => (
        <button
          id={contextMenuItemId}
          className={cn(
            'contextmenu-item-trigger',
            itemTriggerStyles({ focused, disabled }),
            subitemTriggerStyles,
            chevronHoverStyles,
            focused && 'focused',
            disabled && 'disabled',
            className
          )}
          disabled={disabled}
          onMouseEnter={() => {
            if (disabled || !openOnHover) {
              return;
            }
            updateFocusedIndex!();
            onOpen?.();
            open();
          }}
          onClick={() => {
            if (disabled) {
              return;
            }

            updateFocusedIndex!();
            if (!isOpen) {
              onOpen?.();
            }
            toggle();
          }}
          aria-label={typeof label === 'string' ? label : 'submenu-item'}
          aria-haspopup="menu"
          aria-expanded={isOpen}
        >
          {label}
          <ChevronRightIcon size={12} className="chevron-icon" />
        </button>
      )}
    >
      {React.Children.map(children, child => {
        if (!isContextMenuItem(child)) {
          throw Error(
            '컨텍스트 메뉴 서브아이템의 children은 컨텍스트 메뉴 아이템 컴포넌트이어야만합니다!'
          );
        }

        return child;
      })}
    </ContextMenu>
  );
};

const SubItems = (props: Props): React.ReactElement => (
  <SubItemsPrivate {...props} />
);

SubItems.displayName = 'ContextMenuSubItems' as const;

export default SubItems;
export type { PrivateProps as PrivateSubItemsProps, Props as SubItemsProps };
