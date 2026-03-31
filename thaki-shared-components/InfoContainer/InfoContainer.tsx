import { ReactElement } from 'react';
import { cn } from '../../services/utils/cn';
import { infoContainerStyles } from './InfoContainer.styles';

/** 스크롤 없이 표시할 기본 최대 항목 수 */
const DEFAULT_MAX_VISIBLE_ITEMS = 3;

/**
 * InfoContainer Props
 */
export interface InfoContainerProps {
  /** 라벨 텍스트 */
  label: string;
  /** 표시할 값 목록 */
  values: string[];
  /** 스크롤 없이 표시할 최대 항목 수 (기본: 3) */
  maxVisibleItems?: number;
  /** 값을 bullet list로 표시할지 여부 (기본: false) */
  showBullets?: boolean;
  /** 추가 className */
  className?: string;
}

/**
 * 정보 표시용 컨테이너 컴포넌트
 *
 * 라벨과 값 목록을 표시하는 읽기 전용 컨테이너입니다.
 * 주로 모달이나 드로어에서 리소스 정보를 표시할 때 사용됩니다.
 */
const InfoContainer = ({
  label,
  values,
  maxVisibleItems = DEFAULT_MAX_VISIBLE_ITEMS,
  showBullets = false,
  className,
}: InfoContainerProps): ReactElement => {
  const needsScroll = values.length > maxVisibleItems;

  return (
    <div className={cn(infoContainerStyles.root, className)}>
      <span className={infoContainerStyles.label}>{label}</span>
      <div
        className={cn(infoContainerStyles.values, needsScroll && infoContainerStyles.valuesScroll)}
      >
        {showBullets ? (
          <ul className={infoContainerStyles.list}>
            {values.map((value, index) => (
              <li key={index} className={infoContainerStyles.listItem}>
                {value}
              </li>
            ))}
          </ul>
        ) : (
          values.map((value, index) => (
            <span key={index} className={infoContainerStyles.value}>
              {value}
            </span>
          ))
        )}
      </div>
    </div>
  );
};

export default InfoContainer;
