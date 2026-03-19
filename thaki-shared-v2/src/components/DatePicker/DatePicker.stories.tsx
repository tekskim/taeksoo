import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { DateRange } from './DatePicker.types';
import { DatePicker } from './index';

const meta = {
  title: 'Form/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## 스타일 옵션

### 선택 모드 (Selection Mode)
- **range**: 시작일과 종료일을 선택하는 범위 모드 (기본값)

### 상태 (State)
- **기본 상태**: 날짜가 선택되지 않은 상태
- **부분 선택**: 시작일만 선택된 상태
- **범위 선택**: 시작일과 종료일 모두 선택된 상태
- **비활성화**: Apply 버튼이 비활성화된 상태 (날짜 미선택 시)

## 주요 기능
- **날짜 범위 선택**: 시작일과 종료일을 직관적으로 선택
- **월 표시 제어**: numberOfMonths로 표시할 월 개수 설정
- **제어 모드**: Controlled 모드로 외부에서 상태 관리
- **Apply/Cancel**: 선택 확정 또는 취소 버튼
- **시각적 피드백**: 선택된 날짜 범위 하이라이트
- **키보드 탐색**: 화살표 키로 날짜 이동, Enter로 선택
- **접근성**: 완전한 키보드 탐색 및 ARIA 지원

## 사용 가이드라인

### 언제 사용하나요?
- 날짜 범위를 선택해야 할 때 (예: 조회 기간)
- 필터에서 날짜 기준 검색이 필요할 때
- 예약이나 일정 설정 시 시작일과 종료일 선택
- 통계나 리포트의 기간 설정
- 이벤트나 프로모션 기간 설정

### 언제 사용하지 말아야 하나요?
- 단일 날짜만 선택하면 될 때 (단순 날짜 입력 권장)
- 시간까지 선택해야 할 때 (DateTimePicker 권장)
- 매우 먼 과거나 미래의 날짜를 선택해야 할 때 (직접 입력 권장)
- 생년월일처럼 특정 날짜를 입력해야 할 때

### 사용 팁
- **월 개수**: 데스크톱에서는 2개월, 모바일에서는 1개월 표시 권장
- **초기값**: 자주 사용되는 범위(최근 7일, 이번 달 등)를 프리셋으로 제공
- **범위 제한**: 필요시 최소/최대 날짜 범위 제한 추가
- **Apply 필수**: 즉시 적용보다 Apply 버튼으로 명시적 확정 권장
- **취소 동작**: Cancel 시 이전 선택값으로 복원하거나 초기화
- **모바일 대응**: 작은 화면에서는 numberOfMonths={1} 사용

## 접근성
- **키보드 지원**: 
  - 화살표 키로 날짜 이동
  - Enter/Space로 날짜 선택
  - Tab으로 Apply/Cancel 버튼 이동
- **ARIA 속성**: 완전한 ARIA 지원
- **스크린 리더**: 선택된 날짜와 범위를 명확히 전달
- **포커스 관리**: 캘린더 열림 시 자동 포커스
- **시각적 피드백**: 선택된 범위를 색상으로 명확히 표시

## 성능 최적화
- **상태 동기화**: useEffect로 외부 value prop과 내부 상태 동기화
- **메모이제이션**: 핸들러 함수 안정화로 불필요한 리렌더링 방지
- **조건부 활성화**: 날짜 선택 전까지 Apply 버튼 비활성화
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = Partial<StoryObj<typeof meta>>;

const DefaultComponent = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <div style={{ position: 'relative', minHeight: '400px' }}>
      <DatePicker
        value={dateRange}
        onChange={setDateRange}
        onApply={range => {
          console.log('Applied date range:', range);
          alert(`Selected: ${range?.from} ~ ${range?.to}`);
        }}
        onCancel={() => {
          console.log('Cancelled');
          setDateRange(undefined);
        }}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <DefaultComponent />,
};
