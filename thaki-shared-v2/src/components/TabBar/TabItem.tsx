import React from 'react';
import { cn } from '../../services/utils';
import { CloseSmallIcon } from '../Icon';
import { Skeleton } from '../Skeleton';
import { Typography } from '../Typography';
import {
  closeButtonStyles,
  tabItemStyles,
  tabTitleStyles,
  tabTitleSkeletonStyles,
} from './TabItem.styles';

export interface TabItemProps {
  /** 탭의 제목 */
  title: string;
  /** 탭이 활성화된 상태인지 */
  isActive?: boolean;
  /** 닫기 버튼을 항상 표시할지 (단일 탭 등) */
  alwaysShowClose?: boolean;
  /** 탭을 닫을 수 있는지 */
  closable?: boolean;
  /** 탭 클릭 핸들러 */
  onClick?: () => void;
  /** 탭 닫기 핸들러 */
  onClose?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 인라인 스타일 (반응형 너비 조절용) */
  style?: React.CSSProperties;
  /** 드래그앤드롭 관련 props */
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  isDragging?: boolean;
  isDragOver?: boolean;
}

const TabItem: React.FC<TabItemProps> = ({
  title,
  isActive = false,
  alwaysShowClose = false,
  closable = true,
  onClick,
  onClose,
  className,
  style,
  draggable = false,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onMouseDown,
  isDragging = false,
  isDragOver = false,
}) => {
  const handleCloseClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onClose?.();
  };

  return (
    <div
      className={cn(
        tabItemStyles({
          active: isActive,
          isDragging,
          isDragOver,
          alwaysShowClose,
        }),
        className
      )}
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
      tabIndex={0}
      style={style}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onMouseDown={onMouseDown}
    >
      {isActive && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary z-20" />}
      {title ? (
        <Typography.Text variant="detail" className={cn(tabTitleStyles({ active: isActive }))}>
          {title}
        </Typography.Text>
      ) : (
        <span className={tabTitleSkeletonStyles}>
          <Skeleton className="w-16 h-3" borderRadius="2px" />
        </span>
      )}

      {closable && (
        <button
          className={cn(
            closeButtonStyles({
              active: isActive,
              showOnHover: !isActive && !alwaysShowClose,
              alwaysShow: alwaysShowClose,
            })
          )}
          onClick={handleCloseClick}
          aria-label={`Close ${title} tab`}
          type="button"
        >
          <CloseSmallIcon size="xs" variant="secondary" />
        </button>
      )}
    </div>
  );
};

export default TabItem;
