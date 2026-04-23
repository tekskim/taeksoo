import { ReactNode } from 'react';
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
export declare function EmptyState({ icon, title, description, action, variant, className, }: EmptyStateProps): import("react/jsx-runtime").JSX.Element;
