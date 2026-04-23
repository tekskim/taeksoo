import { default as React } from 'react';
import { StoryObj } from '@storybook/react-vite';
/**
 * # DatePicker
 *
 * 날짜를 선택하는 캘린더 컴포넌트입니다.
 *
 * ## 언제 사용하나요?
 * - 단일 날짜 선택 (예약일, 생일 등)
 * - 날짜 범위 선택 (여행 기간, 필터 등)
 * - 이벤트가 있는 날짜 표시
 * - 예약 가능한 날짜 표시
 *
 * ## 모드
 * - **single**: 단일 날짜 선택
 * - **range**: 시작일~종료일 범위 선택
 *
 * ## 기능
 * - **eventDates**: 이벤트가 있는 날짜에 점 표시
 * - **minDate/maxDate**: 선택 가능한 날짜 범위 제한
 * - **firstDayOfWeek**: 주 시작일 설정 (일요일/월요일)
 *
 * ## 접근성
 * - 각 날짜 버튼에 `aria-label` 제공
 * - `aria-selected`로 선택 상태 표시
 * - 키보드 네비게이션 지원
 */
declare const meta: {
    title: string;
    component: React.FC<import('./DatePicker').DatePickerProps>;
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
        mode: {
            control: "select";
            options: string[];
            description: string;
        };
        disabled: {
            control: "boolean";
            description: string;
        };
        firstDayOfWeek: {
            control: "select";
            options: number[];
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const SingleMode: Story;
export declare const RangeMode: Story;
export declare const WithPreselectedDate: Story;
export declare const WithPreselectedRange: Story;
export declare const WithEventDates: Story;
export declare const WithMinMaxDates: Story;
export declare const MondayStart: Story;
export declare const SundayStart: Story;
export declare const Disabled: Story;
export declare const BookingCalendar: Story;
export declare const TravelDateRange: Story;
export declare const EventScheduler: Story;
