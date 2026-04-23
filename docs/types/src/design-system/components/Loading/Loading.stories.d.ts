import { StoryObj } from '@storybook/react-vite';
/**
 * # Loading
 *
 * 로딩 상태를 표시하는 컴포넌트입니다.
 *
 * ## 언제 사용하나요?
 * - 데이터를 불러오는 중일 때
 * - 비동기 작업이 진행 중일 때
 * - 버튼 클릭 후 처리 중일 때
 *
 * ## Variants
 * - **spinner**: 기본 스피너 (아이콘 + 텍스트)
 * - **progress**: 진행률 표시 (프로그레스 바 포함)
 * - **button**: 버튼 형태의 로딩 상태
 *
 * ## 접근성
 * - 스크린 리더가 로딩 상태를 인식할 수 있도록 텍스트 제공
 * - 애니메이션이 있어 시각적으로 상태 변화 인지 가능
 */
declare const meta: {
    title: string;
    component: import('react').FC<import('./Loading').LoadingProps>;
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
        size: {
            control: "select";
            options: string[];
            description: string;
        };
        text: {
            control: "text";
            description: string;
        };
        description: {
            control: "text";
            description: string;
        };
        progress: {
            control: {
                type: "range";
                min: number;
                max: number;
                step: number;
            };
            description: string;
        };
        statusText: {
            control: "text";
            description: string;
        };
        buttonLabel: {
            control: "text";
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const SpinnerSmall: Story;
export declare const SpinnerMedium: Story;
export declare const SpinnerLarge: Story;
export declare const SpinnerWithoutText: Story;
export declare const Progress: Story;
export declare const ProgressStart: Story;
export declare const ProgressHalfway: Story;
export declare const ProgressAlmostDone: Story;
export declare const ProgressComplete: Story;
export declare const Button: Story;
export declare const ButtonSaving: Story;
export declare const ButtonSubmitting: Story;
export declare const AllSizes: Story;
export declare const AllVariants: Story;
