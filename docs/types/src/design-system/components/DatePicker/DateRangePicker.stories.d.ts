import { default as React } from 'react';
import { StoryObj } from '@storybook/react-vite';
/**
 * # DateRangePicker
 *
 * DatePicker를 감싸는 래퍼 컴포넌트로, START/END 날짜 헤더와 Cancel/Apply 버튼을 포함합니다.
 *
 * ## 언제 사용하나요?
 * - MonitoringToolbar의 커스텀 기간 선택
 * - 대시보드나 차트의 날짜 범위 필터
 * - 날짜 범위를 확인 후 적용하는 워크플로우
 *
 * ## 구성
 * - **Range Header**: 클릭 가능한 START / END 날짜 박스
 * - **Calendar**: 범위 선택 모드의 DatePicker
 * - **Actions**: Cancel + Apply 버튼
 */
declare const meta: {
    title: string;
    component: React.FC<import('./DateRangePicker').DateRangePickerProps>;
    parameters: {
        layout: string;
        docs: {
            description: {
                component: string;
            };
        };
    };
    tags: string[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const WithPreselectedRange: Story;
export declare const WithMinMaxDates: Story;
export declare const MonitoringToolbarUseCase: Story;
