import type { ReactNode } from 'react';

/* ----------------------------------------
   InfoBox Types
   ---------------------------------------- */

export interface InfoBoxProps {
  /** 라벨 */
  label: string;
  /** 값 (텍스트) */
  value?: string | number;
  /** 복잡한 값은 children으로 */
  children?: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}

export interface InfoBoxGroupProps {
  /** InfoBox 항목들 */
  children: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}

/* ----------------------------------------
   InfoBox Component
   ---------------------------------------- */

export function InfoBox({ label, value, children, className = '' }: InfoBoxProps) {
  return (
    <div
      className={`w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)] ${className}`.trim()}
    >
      <div className="flex flex-col gap-[6px]">
        <span className="text-label-sm text-[var(--color-text-subtle)]">{label}</span>
        {children ?? <span className="text-body-md text-[var(--color-text-default)]">{value}</span>}
      </div>
    </div>
  );
}

/* ----------------------------------------
   InfoBox.Group Component
   ---------------------------------------- */

function InfoBoxGroup({ children, className = '' }: InfoBoxGroupProps) {
  return <div className={`flex flex-col gap-[12px] ${className}`.trim()}>{children}</div>;
}

InfoBox.Group = InfoBoxGroup;
