import React from 'react';
import { VStack, HStack } from '../../layouts';
import type { WizardSectionState } from './WizardSection';
import { WizardSectionStatusIcon } from './WizardSection';

/* ----------------------------------------
   WizardSummary Types
   ---------------------------------------- */

export interface WizardSummaryItem {
  key: string;
  label: string;
  status: WizardSectionState;
}

interface WizardSummaryProps {
  /** 제목 (기본값: "Summary") */
  title?: string;
  /** 섹션 목록 */
  items: WizardSummaryItem[];
  /** 섹션 클릭 시 호출되는 콜백 */
  onItemClick?: (key: string) => void;
}

/* ----------------------------------------
   WizardSummary Component
   ---------------------------------------- */

/**
 * WizardSummary - 마법사(Wizard) 패턴의 요약 컴포넌트
 *
 * 각 섹션의 진행 상태를 시각적으로 표시합니다.
 * - done: 녹색 체크 아이콘
 * - active: 회전하는 진행 아이콘
 * - writing: "Writing..." 텍스트
 * - skipped: 마이너스 아이콘
 * - pre: 빈 원 아이콘
 */
export function WizardSummary({ title = 'Summary', items, onItemClick }: WizardSummaryProps) {
  return (
    <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4">
      <VStack gap={3}>
        {/* Title */}
        <span className="text-heading-h5 text-[var(--color-text-default)]">{title}</span>

        {/* Section List */}
        <VStack gap={0}>
          {items.map((item) => (
            <HStack
              key={item.key}
              justify="between"
              align="center"
              className={`py-1 ${onItemClick ? 'cursor-pointer hover:bg-[var(--color-surface-muted)] rounded px-1 -mx-1' : ''}`}
              onClick={() => onItemClick?.(item.key)}
            >
              <span className="text-body-md text-[var(--color-text-default)]">{item.label}</span>

              {item.status === 'writing' ? (
                <span className="text-body-sm text-[var(--color-text-subtle)]">Writing...</span>
              ) : (
                <WizardSectionStatusIcon status={item.status} />
              )}
            </HStack>
          ))}
        </VStack>
      </VStack>
    </div>
  );
}

export type { WizardSummaryProps };
