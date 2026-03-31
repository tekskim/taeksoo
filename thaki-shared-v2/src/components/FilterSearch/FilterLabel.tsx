import React from 'react';
import { cn } from '../../services/utils/cn';
import { filterLabelStyles as styles } from './FilterSearch.styles';

interface FilterLabelProps {
  label: string;
  className?: string;
}

/**
 * FilterLabel 컴포넌트
 *
 * 필터 키를 표시하는 작은 태그 형태의 컴포넌트
 * Figma 디자인: 흰색 배경, 테두리, 라벨 + | 구분자
 */
const FilterLabel: React.FC<FilterLabelProps> = ({ label, className }): React.ReactElement => {
  return (
    <div className={cn(styles.filterLabel, className)}>
      <span className={styles.labelText}>{label}</span>
      <span className={styles.separator}>|</span>
    </div>
  );
};

export default FilterLabel;
