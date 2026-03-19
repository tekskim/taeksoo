import React, { useEffect, useRef, ReactNode } from 'react';

/**
 * FilterDropdown 컴포넌트
 *
 * FilterSearch 내부에서 사용되는 범용 드롭다운 컴포넌트
 * - 필터 키 선택 드롭다운
 * - 선택형 필터 옵션 드롭다운
 *
 * 기능:
 * - 외부 클릭 시 자동 닫기
 * - Escape 키로 닫기
 *
 * @param isOpen - 드롭다운 열림 상태
 * @param onClose - 드롭다운 닫기 핸들러
 * @param trigger - 드롭다운 트리거 요소 (옵션)
 * @param children - 드롭다운 내용
 * @param className - 추가 CSS 클래스
 */
interface FilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: ReactNode;
  children: ReactNode;
  className?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  isOpen,
  onClose,
  trigger,
  children,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 및 Escape 키로 드롭다운 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as Node;

      if (containerRef.current && !containerRef.current.contains(target)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    // 다음 이벤트 루프에서 리스너 등록하여 현재 클릭 이벤트와 충돌 방지
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={containerRef} className={className}>
      {trigger}
      {isOpen && children}
    </div>
  );
};

export default FilterDropdown;
