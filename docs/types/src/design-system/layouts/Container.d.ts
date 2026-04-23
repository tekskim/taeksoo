import { HTMLAttributes, ReactNode } from 'react';
export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    /** 최대 너비 */
    size?: ContainerSize;
    /** 중앙 정렬 여부 */
    centered?: boolean;
    /** 내부 패딩 여부 */
    padding?: boolean;
    /** 컨테이너 내용 */
    children: ReactNode;
}
export declare function Container({ size, centered, padding, children, className, ...props }: ContainerProps): import("react/jsx-runtime").JSX.Element;
