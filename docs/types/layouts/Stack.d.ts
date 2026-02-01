import { HTMLAttributes, ReactNode } from 'react';
export type StackDirection = 'row' | 'column';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type StackSpacing = 0 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
export interface StackProps extends HTMLAttributes<HTMLDivElement> {
    /** 방향 */
    direction?: StackDirection;
    /** 정렬 (align-items) */
    align?: StackAlign;
    /** 배치 (justify-content) */
    justify?: StackJustify;
    /** 간격 */
    gap?: StackSpacing;
    /** 줄바꿈 여부 */
    wrap?: boolean;
    /** 스택 내용 */
    children: ReactNode;
}
export declare function Stack({ direction, align, justify, gap, wrap, children, className, ...props }: StackProps): import("react/jsx-runtime").JSX.Element;
export type HStackProps = Omit<StackProps, 'direction'>;
export type VStackProps = Omit<StackProps, 'direction'>;
export declare function HStack(props: HStackProps): import("react/jsx-runtime").JSX.Element;
export declare function VStack(props: VStackProps): import("react/jsx-runtime").JSX.Element;
