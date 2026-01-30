import { StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from './Breadcrumb';
/**
 * # Breadcrumb
 *
 * 현재 페이지의 위치를 계층 구조로 표시하는 네비게이션 컴포넌트입니다.
 *
 * ## 언제 사용하나요?
 * - 사용자가 현재 위치를 파악해야 할 때
 * - 상위 페이지로 쉽게 이동해야 할 때
 * - 깊은 계층 구조의 페이지에서
 * - 파일 탐색기나 폴더 구조 표시
 *
 * ## 기능
 * - React Router `Link` 컴포넌트 사용
 * - 커스텀 구분자 지원
 * - 아이콘 지원
 * - 긴 경로 축소 (maxItems)
 * - 클릭 핸들러 지원
 *
 * ## 접근성
 * - `nav` 요소에 `aria-label="Breadcrumb"` 적용
 * - 현재 페이지에 `aria-current="page"` 적용
 * - 구분자에 `aria-hidden="true"` 적용
 */
declare const meta: {
    title: string;
    component: typeof Breadcrumb;
    parameters: {
        layout: string;
        docs: {
            description: {
                component: string;
            };
        };
    };
    tags: string[];
    decorators: ((Story: import('storybook/internal/csf').PartialStoryFn<import('@storybook/react').ReactRenderer, {
        items: import('./Breadcrumb').BreadcrumbItem[];
        separator?: import('react').ReactNode;
        className?: string | undefined;
        maxItems?: number | undefined;
    }>) => import("react/jsx-runtime").JSX.Element)[];
    argTypes: {
        items: {
            control: "object";
            description: string;
        };
        separator: {
            control: false;
            description: string;
        };
        maxItems: {
            control: {
                type: "number";
                min: number;
                max: number;
            };
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const TwoLevels: Story;
export declare const ThreeLevels: Story;
export declare const WithIcons: Story;
export declare const HomeIconOnly: Story;
export declare const SlashSeparator: Story;
export declare const TextSeparator: Story;
export declare const Collapsed: Story;
export declare const CollapsedThreeItems: Story;
export declare const WithClickHandler: Story;
export declare const FileExplorer: Story;
export declare const ECommerce: Story;
export declare const AdminPanel: Story;
