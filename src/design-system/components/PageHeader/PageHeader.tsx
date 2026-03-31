import type { ReactNode, HTMLAttributes } from 'react';

/* ----------------------------------------
   PageHeader Types
   ---------------------------------------- */

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 페이지 제목 */
  title: string;
  /** 제목 옆 뱃지나 카운트 등 부가 요소 */
  titleExtra?: ReactNode;
  /** 우측 액션 영역 (Create 버튼 등) */
  actions?: ReactNode;
}

/* ----------------------------------------
   PageHeader Component
   ---------------------------------------- */

export function PageHeader({
  title,
  titleExtra,
  actions,
  className = '',
  ...rest
}: PageHeaderProps) {
  return (
    <div
      data-figma-name="[TDS] Title"
      className={`flex items-center justify-between w-full min-h-8 ${className}`.trim()}
      {...rest}
    >
      <div className="flex items-center gap-[8px]">
        <h1 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">{title}</h1>
        {titleExtra}
      </div>
      {actions && <div className="flex items-center gap-[8px]">{actions}</div>}
    </div>
  );
}
