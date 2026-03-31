import { useCallback, useId, useRef, useState } from 'react';
import { cn } from '../../services/utils/cn';
import { Direction } from '../../types';
import Portal from '../Portal';
import { tooltipContentStyles } from '../Tooltip/Tooltip.styles';
import { menuItemStyles } from './ContextMenu.styles';

const TOOLTIP_GAP_PX = 8;

interface Props {
  className?: string;
  disabled?: boolean | { reason: string; direction?: Direction };
  danger?: boolean;
  preventCloseAfterAction?: boolean;
  children: React.ReactNode;
  action: () => void | Promise<void>;
}

/** 외부에 노출될 필요 없는 props (ContextMenu 컴포넌트 내부에서만 주입가능) */
interface PrivateProps extends Props {
  focused?: boolean;
  updateFocusedIndex?: () => void;
  closeAll?: () => void;
}

/**
 * @description
 * ContextMenuItem 컴포넌트는 컨텍스트 메뉴의 아이템을 제공하며,
 * 사용자가 원하는 옵션을 선택할 수 있도록 합니다.
 *
 * 주요 기능:
 * - 컨텍스트 메뉴의 아이템을 제공합니다.
 * - 컨텍스트 메뉴의 아이템을 비활성화할 수 있습니다. (기본값: false)
 * - 컨텍스트 메뉴의 아이템을 삭제할 수 있습니다. (기본값: false)
 * - 컨텍스트 메뉴의 아이템을 클릭할 때 액션을 실행할 수 있습니다.
 * - 컨텍스트 메뉴의 아이템을 포커스 인덱스를 업데이트할 수 있습니다.
 * - 컨텍스트 메뉴의 아이템을 모든 컨텍스트 메뉴를 닫을 수 있습니다.
 * @param className - 컨텍스트 메뉴의 아이템의 클래스 이름
 * @param disabled - 컨텍스트 메뉴의 아이템의 비활성화 여부 (메세지 문자열 또는 불리언)
 * @param focused - 컨텍스트 메뉴의 아이템의 포커스 여부
 * @param preventCloseAfterAction - 컨텍스트 메뉴의 아이템의 액션 실행 후 컨텍스트 메뉴를 닫을 것인지 여부 (기본값: false)
 * @param danger - 컨텍스트 메뉴의 아이템의 삭제 여부
 * @param children - 컨텍스트 메뉴의 아이템의 자식 요소
 * @param action - 컨텍스트 메뉴의 아이템의 액션
 * @param updateFocusedIndex - 컨텍스트 메뉴의 아이템의 포커스 인덱스를 업데이트하는 함수
 * @param closeAll - 컨텍스트 메뉴의 아이템의 모든 컨텍스트 메뉴를 닫는 함수
 * @returns 컨텍스트 메뉴의 아이템 컴포넌트
 */
const ItemPrivate = ({
  className,
  disabled = false,
  focused = false,
  preventCloseAfterAction = false,
  danger = false,
  children,
  action,
  updateFocusedIndex,
  closeAll,
}: PrivateProps): React.ReactElement => {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLLIElement>(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const hasTooltip = disabled && typeof disabled === 'object' && 'reason' in disabled;
  const preferredDirection: Direction =
    (typeof disabled === 'object' && disabled.direction) || 'left';

  const showTooltip = useCallback(() => {
    if (!hasTooltip) return;
    setIsTooltipVisible(true);
  }, [hasTooltip]);

  const hideTooltip = useCallback(() => {
    setIsTooltipVisible(false);
  }, []);

  return (
    <>
      <li
        ref={triggerRef}
        className={cn(menuItemStyles({ focused, disabled: Boolean(disabled), danger }), className)}
        role="menuitem"
        onClick={async () => {
          if (disabled) {
            return;
          }

          updateFocusedIndex!();

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

          setTimeout(closeAll!, 80);
        }}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        aria-disabled={Boolean(disabled)}
        aria-selected={focused}
        aria-label={typeof children === 'string' ? children : undefined}
        aria-describedby={isTooltipVisible ? tooltipId : undefined}
      >
        {children}
      </li>
      {hasTooltip && isTooltipVisible && (
        <Portal
          triggerRef={triggerRef}
          direction={preferredDirection}
          gap={TOOLTIP_GAP_PX}
          matchWidth={false}
        >
          <div id={tooltipId} className={tooltipContentStyles} role="tooltip" aria-live="polite">
            {disabled.reason}
          </div>
        </Portal>
      )}
    </>
  );
};

const Item = (props: Props): React.ReactElement => <ItemPrivate {...props} />;

Item.displayName = 'ContextMenuItem' as const;

export default Item;
export type { Props as ItemProps, PrivateProps as PrivateItemProps };
