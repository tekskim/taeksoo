import React from 'react';
import { IconCheck, IconEdit, IconProgress, IconMinus } from '@tabler/icons-react';
import { Button } from '../Button';
import { VStack, HStack } from '../../layouts';

/* ----------------------------------------
   Wizard Section Types
   ---------------------------------------- */

export type WizardSectionState = 'pre' | 'active' | 'done' | 'skipped' | 'writing';

/* ----------------------------------------
   WizardSectionStatusIcon Component
   ---------------------------------------- */

interface WizardSectionStatusIconProps {
  status: WizardSectionState;
}

export function WizardSectionStatusIcon({ status }: WizardSectionStatusIconProps) {
  // done → success (green check)
  if (status === 'done') {
    return (
      <div className="w-4 h-4 shrink-0 rounded-full bg-[var(--color-state-success)] flex items-center justify-center">
        <IconCheck size={10} stroke={2.5} className="text-white" />
      </div>
    );
  }
  
  // active → spinning progress (currently working)
  if (status === 'active') {
    return (
      <div className="w-4 h-4 shrink-0">
        <IconProgress size={16} stroke={1.5} className="text-[var(--color-text-subtle)] animate-spin" />
      </div>
    );
  }
  
  // writing → spinning progress
  if (status === 'writing') {
    return (
      <div className="w-4 h-4 shrink-0">
        <IconProgress size={16} stroke={1.5} className="text-[var(--color-text-subtle)] animate-spin" />
      </div>
    );
  }
  
  // skipped → minus icon
  if (status === 'skipped') {
    return (
      <div className="w-4 h-4 shrink-0">
        <IconMinus size={16} stroke={1.5} className="text-[var(--color-text-subtle)]" />
      </div>
    );
  }
  
  // pre → empty circle (waiting)
  return (
    <div className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-border-default)]" />
  );
}

/* ----------------------------------------
   PreSection Component (대기 중인 섹션)
   ---------------------------------------- */

interface PreSectionProps {
  title: string;
}

export function PreSection({ title }: PreSectionProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
      <div className="h-8 flex items-center">
        <h5 className="text-[length:var(--font-size-14)] font-semibold leading-[var(--line-height-20)] text-[var(--color-text-default)]">
          {title}
        </h5>
      </div>
    </div>
  );
}

/* ----------------------------------------
   WritingSection Component (작업 중인 섹션)
   ---------------------------------------- */

interface WritingSectionProps {
  title: string;
}

export function WritingSection({ title }: WritingSectionProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
      <div className="h-8 flex items-center justify-between">
        <h5 className="text-[length:var(--font-size-14)] font-semibold leading-[var(--line-height-20)] text-[var(--color-text-default)]">
          {title}
        </h5>
        <span className="text-[11px] text-[var(--color-text-subtle)]">Writing...</span>
      </div>
    </div>
  );
}

/* ----------------------------------------
   SkippedSection Component (건너뛴 섹션)
   ---------------------------------------- */

interface SkippedSectionProps {
  title: string;
  onEdit: () => void;
}

export function SkippedSection({ title, onEdit }: SkippedSectionProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
      <div className="flex items-center justify-between h-8">
        <h5 className="text-[length:var(--font-size-14)] font-semibold leading-[var(--line-height-20)] text-[var(--color-text-default)]">
          {title}
        </h5>
        <div className="flex items-center gap-3">
          <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-muted)]">Not configured</span>
          <Button variant="outline" size="sm" leftIcon={<IconEdit size={12} />} onClick={onEdit}>
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   DoneSectionRow Component (완료 섹션 데이터 로우)
   ---------------------------------------- */

interface DoneSectionRowProps {
  label: string;
  value: React.ReactNode;
}

export function DoneSectionRow({ label, value }: DoneSectionRowProps) {
  return (
    <VStack gap={0} className="pt-3">
      <div className="w-full h-px bg-[var(--color-border-subtle)]" />
      <VStack gap={2} className="pt-3">
        <span className="text-[11px] font-medium text-[var(--color-text-subtle)]">
          {label}
        </span>
        <span className="text-[12px] text-[var(--color-text-default)]">
          {value || '-'}
        </span>
      </VStack>
    </VStack>
  );
}

/* ----------------------------------------
   DoneSection Component (완료된 섹션)
   ---------------------------------------- */

interface DoneSectionProps {
  title: string;
  onEdit: () => void;
  children?: React.ReactNode;
}

export function DoneSection({ title, onEdit, children }: DoneSectionProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
      <VStack gap={0}>
        {/* Header */}
        <HStack justify="between" align="center" className="w-full h-8">
          <h5 className="text-[length:var(--font-size-14)] font-semibold leading-[var(--line-height-20)] text-[var(--color-text-default)]">
            {title}
          </h5>
          <Button variant="outline" size="sm" leftIcon={<IconEdit size={12} />} onClick={onEdit}>
            Edit
          </Button>
        </HStack>

        {/* Data Rows */}
        {children}
      </VStack>
    </div>
  );
}

/* ----------------------------------------
   WizardSection - Combined Component
   ---------------------------------------- */

interface WizardSectionProps {
  title: string;
  status: WizardSectionState;
  onEdit?: () => void;
  /** Content to show when status is 'done' */
  summaryContent?: React.ReactNode;
  /** Content to show when status is 'active' */
  children?: React.ReactNode;
}

/**
 * WizardSection - 마법사(Wizard) 패턴의 섹션 컴포넌트
 * 
 * 상태에 따라 다른 UI를 렌더링합니다:
 * - pre: 대기 중 (빈 원 아이콘)
 * - active: 활성화됨 (회전 아이콘, children 렌더링)
 * - done: 완료됨 (체크 아이콘, summaryContent 렌더링)
 * - skipped: 건너뜀 (마이너스 아이콘, Not configured 표시)
 * - writing: 작성 중 (회전 아이콘, Writing... 표시)
 */
export function WizardSection({ 
  title, 
  status, 
  onEdit, 
  summaryContent,
  children 
}: WizardSectionProps) {
  switch (status) {
    case 'pre':
      return <PreSection title={title} />;
    
    case 'writing':
      return <WritingSection title={title} />;
    
    case 'skipped':
      return <SkippedSection title={title} onEdit={onEdit || (() => {})} />;
    
    case 'done':
      return (
        <DoneSection title={title} onEdit={onEdit || (() => {})}>
          {summaryContent}
        </DoneSection>
      );
    
    case 'active':
    default:
      // Active state는 SectionCard를 사용하거나 children을 직접 렌더링
      return <>{children}</>;
  }
}

// Export all components and types
export type { 
  PreSectionProps, 
  WritingSectionProps, 
  SkippedSectionProps, 
  DoneSectionProps, 
  DoneSectionRowProps,
  WizardSectionProps 
};
