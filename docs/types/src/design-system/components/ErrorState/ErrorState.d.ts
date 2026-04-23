import { ReactNode } from 'react';
export interface ErrorStateProps {
    /** 아이콘 (ReactNode) */
    icon?: ReactNode;
    /** 에러 제목 */
    title?: string;
    /** 에러 상세 메시지 */
    description?: string;
    /** 재시도/액션 버튼 */
    action?: ReactNode;
    /** 추가 CSS 클래스 */
    className?: string;
}
export declare function ErrorState({ icon, title, description, action, className, }: ErrorStateProps): import("react/jsx-runtime").JSX.Element;
