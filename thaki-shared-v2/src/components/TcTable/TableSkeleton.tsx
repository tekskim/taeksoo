import React from 'react';
import { cn } from '../../services/utils';
import {
  bodyTrClassnames,
  emptyTextClassnames,
  skeletonClassnames,
  trClassnames,
} from './TcTable.styles';

/** 기본 스켈레톤 콘텐츠: shimmer 애니메이션 */
const DefaultSkeletonContent = () => <div className={skeletonClassnames} />;

/** 기본 빈 상태 UI */
export const DefaultEmptyRow = () => (
  <div className={emptyTextClassnames}>No data</div>
);

/** 기본 에러 UI */
export const DefaultErrorRow = () => (
  <div className={emptyTextClassnames}>Failed to load data</div>
);

/**
 * count 있으면 반복 모드 (skeleton), 없으면 단일 full-width row (empty/error)
 */
export const TableSkeleton = ({
  colSpan,
  count = 5,
  children,
}: {
  colSpan: number;
  count?: number;
  children?: React.ReactNode;
}) => (
  <tbody>
    {Array.from({ length: count }, (_, i) => (
      <tr key={i} className={cn(trClassnames, bodyTrClassnames)}>
        <td colSpan={colSpan} className="h-[inherit]">
          {children ?? <DefaultSkeletonContent />}
        </td>
      </tr>
    ))}
  </tbody>
);
