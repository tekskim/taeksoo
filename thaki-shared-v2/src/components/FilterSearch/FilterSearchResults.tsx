import React from 'react';
import Layout from '../Layout';
import { Tag } from '../Tag';
import { Button } from '../Button';
import { cn } from '../../services/utils/cn';
import { filterSearchResultsStyles as styles } from './FilterSearch.styles';
import type { FilterKeyWithValue } from './FilterSearch.types';

export interface FilterSearchResultsProps {
  filters: FilterKeyWithValue[];
  onRemoveFilter: (id: string) => void;
  onClearAll: () => void;
  className?: string;
}

/**
 * FilterSearchResults 컴포넌트
 *
 * 선택된 필터를 태그로 표시하고 제거할 수 있는 결과 표시 컴포넌트
 *
 * @param filters - 현재 적용된 필터 목록
 * @param onRemoveFilter - 개별 필터 제거 핸들러
 * @param onClearAll - 모든 필터 제거 핸들러
 * @param className - 추가 CSS 클래스
 */
const FilterSearchResults: React.FC<FilterSearchResultsProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
  className,
}): React.ReactElement | null => {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className={cn(styles.root, className)}>
      <Layout.HStack gap="sm" className={styles.content}>
        <div className={styles.tagsWrapper}>
          {filters.map(filter => (
            <Tag
              key={filter.id}
              label={filter.label}
              value={filter.displayValue || filter.value || ''}
              onClose={() => onRemoveFilter(filter.id || '')}
              ariaLabel={`Remove ${filter.label} filter`}
            />
          ))}
        </div>

        <Button
          size="sm"
          appearance="ghost"
          onClick={onClearAll}
          className={styles.clearButton}
        >
          Clear Filters
        </Button>
      </Layout.HStack>
    </div>
  );
};

export default FilterSearchResults;
