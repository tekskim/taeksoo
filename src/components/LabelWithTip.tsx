import { IconHelpCircle } from '@tabler/icons-react';
import type { ReactNode } from 'react';

import { Tooltip } from '@/design-system';

/**
 * 라벨 + ⓘ 안내 툴팁 — 테이블 헤더(headerRender)·폼 라벨(FormField label)·섹션 제목 등에 공용으로 사용.
 * 마우스오버 시 용어 정의나 해당 항목이 표시하는 정보를 안내한다.
 */
export function LabelWithTip({
  label,
  tip,
  className,
}: {
  label: ReactNode;
  tip: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex min-w-0 items-center gap-1 ${className ?? ''}`}>
      <span className="truncate">{label}</span>
      <Tooltip content={tip}>
        <span className="inline-flex shrink-0 text-[var(--color-text-subtle)]">
          <IconHelpCircle size={16} stroke={1.5} />
        </span>
      </Tooltip>
    </span>
  );
}
