import { ReactNode } from 'react';
import { StatusType } from '../StatusIndicator';
export interface InfoBoxProps {
    /** 라벨 */
    label: string;
    /** 값 (텍스트 또는 ReactNode) */
    value?: ReactNode;
    /** 복잡한 값은 children으로 */
    children?: ReactNode;
    /** 라벨 옆 tooltip 텍스트 (info 아이콘 표시) */
    tooltip?: string;
    /** 값 복사 버튼 표시 (string value만 지원) */
    copyable?: boolean;
    /** 우측 StatusIndicator 표시 */
    status?: StatusType;
    /** 추가 CSS 클래스 */
    className?: string;
}
export interface InfoBoxGroupProps {
    /** InfoBox 항목들 */
    children: ReactNode;
    /** 추가 CSS 클래스 */
    className?: string;
}
export declare function InfoBox({ label, value, children, tooltip, copyable, status, className, }: InfoBoxProps): import("react/jsx-runtime").JSX.Element;
export declare namespace InfoBox {
    var Group: typeof InfoBoxGroup;
}
declare function InfoBoxGroup({ children, className }: InfoBoxGroupProps): import("react/jsx-runtime").JSX.Element;
export {};
