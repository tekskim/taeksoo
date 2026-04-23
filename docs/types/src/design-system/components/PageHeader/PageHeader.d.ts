import { ReactNode, HTMLAttributes } from 'react';
export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** 페이지 제목 */
    title: string;
    /** 제목 옆 뱃지나 카운트 등 부가 요소 */
    titleExtra?: ReactNode;
    /** 우측 액션 영역 (Create 버튼 등) */
    actions?: ReactNode;
}
export declare function PageHeader({ title, titleExtra, actions, className, ...rest }: PageHeaderProps): import("react/jsx-runtime").JSX.Element;
