import { StoryObj } from '@storybook/react-vite';
import { StatusType } from './StatusIndicator';
/**
 * # StatusIndicator
 *
 * 리소스나 작업의 상태를 시각적으로 표시하는 컴포넌트입니다.
 *
 * ## 언제 사용하나요?
 * - 서버/인스턴스 상태 표시 (Active, Error, Building 등)
 * - 작업 진행 상태 표시 (Pending, Deleting 등)
 * - 리소스 사용 상태 표시 (In-use, Mounted 등)
 * - 테이블이나 카드에서 상태 정보 표시
 *
 * ## 상태 카테고리
 * - **Success (녹색)**: active
 * - **Danger (빨강)**: error
 * - **Info (파랑)**: building, deleting
 * - **Warning (주황)**: verify-resized, degraded, no-monitor
 * - **Muted (회색)**: suspended, shelved, shutoff, paused, pending, draft 등
 *
 * ## 레이아웃
 * - **icon-only**: 아이콘만 표시 (원형 배경)
 * - **default**: 아이콘 + 라벨 (pill 형태)
 * - **badge**: 아이콘 + 라벨 (사각형 배지)
 *
 * ## 접근성
 * - `role="status"`로 상태 정보 전달
 * - `aria-label`로 스크린 리더에 상태 설명
 */
declare const meta: {
    title: string;
    component: import('react').NamedExoticComponent<import('./StatusIndicator').StatusIndicatorProps>;
    parameters: {
        layout: string;
        docs: {
            description: {
                component: string;
            };
        };
    };
    tags: string[];
    argTypes: {
        status: {
            control: "select";
            options: StatusType[];
            description: string;
        };
        layout: {
            control: "select";
            options: string[];
            description: string;
        };
        size: {
            control: "select";
            options: string[];
            description: string;
        };
        label: {
            control: "text";
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Active: Story;
export declare const Error: Story;
export declare const Building: Story;
export declare const Pending: Story;
export declare const IconOnly: Story;
export declare const DefaultLayout: Story;
export declare const BadgeLayout: Story;
export declare const AllSizes: Story;
export declare const SuccessStatuses: Story;
export declare const DangerStatuses: Story;
export declare const InfoStatuses: Story;
export declare const WarningStatuses: Story;
export declare const MutedStatuses: Story;
export declare const AllStatuses: Story;
export declare const CustomLabel: Story;
export declare const InstanceTable: Story;
export declare const ResourceCard: Story;
