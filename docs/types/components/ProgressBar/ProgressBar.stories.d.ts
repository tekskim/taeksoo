import { StoryObj } from '@storybook/react-vite';
/**
 * # ProgressBar
 *
 * 진행률이나 사용량을 시각적으로 표시하는 컴포넌트입니다.
 *
 * ## 언제 사용하나요?
 * - 파일 업로드/다운로드 진행률 표시
 * - 리소스 사용량 (CPU, 메모리, 스토리지 등) 표시
 * - 쿼터(할당량) 대비 사용량 표시
 * - 작업 진행 상태 표시
 *
 * ## Variants
 * - **default**: 기본 프로그레스 바 (단일 색상)
 * - **quota**: 쿼터/할당량 표시용 (사용량 + 신규 값 구분)
 *
 * ## 상태 색상
 * - **success** (녹색): 정상 범위 (0-70%)
 * - **warning** (주황): 경고 범위 (70-100%)
 * - **danger** (빨강): 위험/초과 (100%+)
 * - **info** (파랑): 정보 표시용
 * - **neutral** (회색): 무제한 또는 중립
 *
 * ## 접근성
 * - 색상 외에도 수치로 정보 전달
 * - 에러 상태 시 아이콘과 툴팁으로 추가 정보 제공
 */
declare const meta: {
    title: string;
    component: import('react').FC<import('./ProgressBar').ProgressBarProps>;
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
        variant: {
            control: "select";
            options: string[];
            description: string;
        };
        value: {
            control: {
                type: "number";
                min: number;
            };
            description: string;
        };
        max: {
            control: {
                type: "number";
                min: number;
            };
            description: string;
        };
        newValue: {
            control: {
                type: "number";
                min: number;
            };
            description: string;
        };
        label: {
            control: "text";
            description: string;
        };
        showValue: {
            control: "boolean";
            description: string;
        };
        error: {
            control: "boolean";
            description: string;
        };
        errorMessage: {
            control: "text";
            description: string;
        };
        statusText: {
            control: "text";
            description: string;
        };
        status: {
            control: "select";
            options: string[];
            description: string;
        };
        size: {
            control: "select";
            options: string[];
            description: string;
        };
    };
    decorators: ((Story: import('storybook/internal/csf').PartialStoryFn<import('@storybook/react').ReactRenderer, {
        value: number;
        max?: number | undefined;
        newValue?: number | undefined;
        variant?: import('./ProgressBar').ProgressBarVariant | undefined;
        label?: string | undefined;
        showValue?: boolean | undefined;
        error?: boolean | undefined;
        errorMessage?: string | undefined;
        statusText?: string | undefined;
        status?: import('./ProgressBar').ProgressBarStatus | undefined;
        className?: string | undefined;
        size?: "sm" | "md" | undefined;
    }>) => import("react/jsx-runtime").JSX.Element)[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const DefaultWithStatus: Story;
export declare const DefaultSuccess: Story;
export declare const DefaultWarning: Story;
export declare const DefaultDanger: Story;
export declare const DefaultError: Story;
export declare const Quota: Story;
export declare const QuotaWithNewValue: Story;
export declare const QuotaWarning: Story;
export declare const QuotaExceeding: Story;
export declare const QuotaUnlimited: Story;
export declare const AllStatuses: Story;
export declare const QuotaLevels: Story;
