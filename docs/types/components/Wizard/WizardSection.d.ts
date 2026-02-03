import { default as React } from 'react';
export type WizardSectionState = 'pre' | 'active' | 'done' | 'skipped' | 'writing';
interface WizardSectionStatusIconProps {
    status: WizardSectionState;
}
export declare function WizardSectionStatusIcon({ status }: WizardSectionStatusIconProps): import("react/jsx-runtime").JSX.Element;
interface PreSectionProps {
    title: string;
}
export declare function PreSection({ title }: PreSectionProps): import("react/jsx-runtime").JSX.Element;
interface WritingSectionProps {
    title: string;
    onEdit?: () => void;
}
export declare function WritingSection({ title, onEdit }: WritingSectionProps): import("react/jsx-runtime").JSX.Element;
interface SkippedSectionProps {
    title: string;
    onEdit: () => void;
}
export declare function SkippedSection({ title, onEdit }: SkippedSectionProps): import("react/jsx-runtime").JSX.Element;
interface DoneSectionRowProps {
    label: string;
    value: React.ReactNode;
}
export declare function DoneSectionRow({ label, value }: DoneSectionRowProps): import("react/jsx-runtime").JSX.Element;
interface DoneSectionProps {
    title: string;
    onEdit: () => void;
    children?: React.ReactNode;
}
export declare function DoneSection({ title, onEdit, children }: DoneSectionProps): import("react/jsx-runtime").JSX.Element;
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
export declare function WizardSection({ title, status, onEdit, summaryContent, children }: WizardSectionProps): import("react/jsx-runtime").JSX.Element;
export type { PreSectionProps, WritingSectionProps, SkippedSectionProps, DoneSectionProps, DoneSectionRowProps, WizardSectionProps };
