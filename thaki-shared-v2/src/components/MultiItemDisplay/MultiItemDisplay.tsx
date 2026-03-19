import React from 'react';
import { Tooltip } from '../Tooltip';

export interface MultiItemDisplayProps {
  /** 표시할 항목 목록 (string[] 또는 Record<string, string>) */
  items: string[] | Record<string, string>;
  /** 항목이 없을 때 표시할 텍스트 (기본값: '-') */
  emptyText?: string;
}

/**
 * 여러 항목을 (+N) 형태로 축약하여 표시하는 컴포넌트
 * - 항목이 없으면 emptyText 표시 (기본: '-')
 * - 항목이 1개면 그대로 표시
 * - 항목이 2개 이상이면 첫 번째 항목 + (+N) 표시
 * - (+N) 호버 시 전체 항목들을 툴팁으로 표시 (줄바꿈으로 구분)
 *
 * @example
 * // String array
 * <MultiItemDisplay items={['item1', 'item2', 'item3']} />
 *
 * // Key-value object (labels, annotations)
 * <MultiItemDisplay items={{ key1: 'value1', key2: 'value2' }} />
 */
const MultiItemDisplay: React.FC<MultiItemDisplayProps> = ({
  items,
  emptyText = '-',
}) => {
  // Convert Record to string array if needed
  const itemArray: string[] = Array.isArray(items)
    ? items
    : Object.entries(items).map(([key, value]) => `${key}: ${value}`);

  if (itemArray.length === 0) {
    return <span className="text-xs">{emptyText}</span>;
  }

  if (itemArray.length === 1) {
    return (
      <span className="text-xs truncate max-w-full" title={itemArray[0]}>
        {itemArray[0]}
      </span>
    );
  }

  const firstItem = itemArray[0];
  const remainingCount = itemArray.length - 1;

  // 전체 항목을 줄바꿈으로 구분하여 툴팁 컨텐츠 생성
  const tooltipContent = (
    <div style={{ whiteSpace: 'pre-line' }}>{itemArray.join('\n')}</div>
  );

  return (
    <span className="inline-flex items-center gap-1 text-xs min-w-0">
      <span className="truncate" title={firstItem}>
        {firstItem}
      </span>
      <Tooltip content={tooltipContent} direction="top">
        <span className="text-text-muted cursor-pointer shrink-0">
          (+{remainingCount})
        </span>
      </Tooltip>
    </span>
  );
};

export default MultiItemDisplay;
