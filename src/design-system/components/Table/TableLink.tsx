import { type ReactNode, type MouseEvent } from 'react';
import { twMerge } from '../../utils/cn';

/* ----------------------------------------
   TableLink Types
   ---------------------------------------- */

export interface TableLinkProps {
  /** Link content */
  children: ReactNode;
  /** Click handler */
  onClick?: (e: MouseEvent<HTMLSpanElement>) => void;
  /** Additional CSS classes */
  className?: string;
  /** Title for tooltip */
  title?: string;
  /** Whether to truncate text */
  truncate?: boolean;
}

/* ----------------------------------------
   TableLink Component
   ---------------------------------------- */

/**
 * TableLink - 테이블 셀 내 링크 스타일 컴포넌트
 *
 * 디자인 시스템 표준 스타일:
 * - font-medium
 * - color-action-primary (파란색)
 * - hover:underline with offset
 *
 * @example
 * // 기본 사용
 * <TableLink onClick={() => navigate(`/detail/${id}`)}>
 *   {name}
 * </TableLink>
 *
 * @example
 * // truncate 비활성화
 * <TableLink truncate={false}>
 *   {longText}
 * </TableLink>
 */
export function TableLink({
  children,
  onClick,
  className,
  title,
  truncate = true,
}: TableLinkProps) {
  return (
    <span
      className={twMerge(
        'font-medium text-[var(--color-action-primary)] cursor-pointer',
        'hover:underline hover:underline-offset-2',
        'transition-colors',
        truncate && 'truncate block',
        className
      )}
      onClick={onClick}
      title={title}
    >
      {children}
    </span>
  );
}

export default TableLink;
