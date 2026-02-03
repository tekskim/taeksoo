import { ReactNode, MouseEvent } from 'react';
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
export declare function TableLink({ children, onClick, className, title, truncate, }: TableLinkProps): import("react/jsx-runtime").JSX.Element;
export default TableLink;
