import type { ReactNode } from 'react';

/* ----------------------------------------
   PageHeader Types
   ---------------------------------------- */

export interface PageHeaderProps {
  /** 페이지 제목 */
  title: string;
  /** 제목 옆 뱃지나 카운트 등 부가 요소 */
  titleExtra?: ReactNode;
  /** 우측 액션 영역 (Create 버튼 등) */
  actions?: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}

/* ----------------------------------------
   PageHeader Component
   ---------------------------------------- */

export function PageHeader({ title, titleExtra, actions, className = '' }: PageHeaderProps) {
  return (
    <div className={`flex items-center justify-between w-full min-h-8 ${className}`.trim()}>
      <div className="flex items-center gap-[8px]">
        <h1 className="text-heading-h5 text-[var(--color-text-default)]">{title}</h1>
        {titleExtra}
      </div>
      {actions && <div className="flex items-center gap-[8px]">{actions}</div>}
    </div>
  );
}
