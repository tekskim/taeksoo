import type { ReactNode } from 'react';

/* ----------------------------------------
   EmptyState Types
   ---------------------------------------- */

export type EmptyStateVariant = 'card' | 'inline';

export interface EmptyStateProps {
  /** 아이콘 (ReactNode) */
  icon?: ReactNode;
  /** 제목 */
  title: string;
  /** 설명 텍스트 */
  description?: string;
  /** 액션 버튼 등 */
  action?: ReactNode;
  /** 스타일 변형: card (테두리+배경), inline (패딩만) */
  variant?: EmptyStateVariant;
  /** 추가 CSS 클래스 */
  className?: string;
}

/* ----------------------------------------
   EmptyState Component
   ---------------------------------------- */

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'card',
  className = '',
}: EmptyStateProps) {
  const variantClasses =
    variant === 'card'
      ? 'bg-[var(--color-surface-default)] rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-subtle)] p-16'
      : 'py-20';

  return (
    <div className={`${variantClasses} ${className}`.trim()}>
      <div className="flex flex-col items-center gap-[16px]">
        {icon && <div className="text-[var(--color-text-disabled)]">{icon}</div>}
        <div className="flex flex-col items-center gap-[8px] text-center">
          <span className="text-heading-h5 text-[var(--color-text-default)]">{title}</span>
          {description && (
            <span className="text-body-lg text-[var(--color-text-subtle)] max-w-md">
              {description}
            </span>
          )}
        </div>
        {action && <div className="mt-[8px]">{action}</div>}
      </div>
    </div>
  );
}
