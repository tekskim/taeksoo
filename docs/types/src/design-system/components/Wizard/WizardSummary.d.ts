import { WizardSectionState } from './WizardSection';
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
export declare function WizardSummary({ title, items, onItemClick }: WizardSummaryProps): import("react/jsx-runtime").JSX.Element;
export type { WizardSummaryProps };
