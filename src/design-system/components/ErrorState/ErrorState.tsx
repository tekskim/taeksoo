import type { ReactNode } from 'react';

/* ----------------------------------------
   ErrorState Types
   ---------------------------------------- */

export interface ErrorStateProps {
  /** 아이콘 (ReactNode) */
  icon?: ReactNode;
  /** 에러 제목 */
  title?: string;
  /** 에러 상세 메시지 */
  description?: string;
  /** 재시도/액션 버튼 */
  action?: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}

/* ----------------------------------------
   ErrorState Component
   ---------------------------------------- */

export function ErrorState({
  icon,
  title = 'Something went wrong',
  description,
  action,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      data-figma-name="[TDS] ErrorState"
      className={`flex flex-col items-center justify-center py-20 text-center ${className}`.trim()}
    >
      {icon && <div className="text-[var(--color-state-danger)] mb-[16px]">{icon}</div>}
      <span className="text-heading-h5 text-[var(--color-text-default)] mb-[8px]">{title}</span>
      {description && (
        <p className="text-body-md text-[var(--color-text-muted)] max-w-md mb-[16px]">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
