import { useState, useRef, useEffect } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { Label } from '../../design-system-sections/HelperComponents';
import { DatePicker, DateRangePicker, VStack } from '@/design-system';
import { IconCalendar } from '@tabler/icons-react';

const DATE_PICKER_GUIDELINES = `## Overview

사용자가 날짜(또는 날짜 범위, 또는 **날짜+시간**)을 선택해 검색/필터/예약/기간 설정 등에 사용하는 컴포넌트이다.

---

## Composition

| 요소 | 설명 |
| --- | --- |
| ① Trigger | 캘린더 팝오버 오픈 트리거 (아이콘 버튼 또는 입력 필드 클릭) |
| ② Calendar Popover | 월/일 선택 UI(오버레이) |
| ③ Month Navigation | 이전/다음 월 이동, 월/연도 표시 |
| ④ Day Grid | 단일 일자 선택(일자 포인트) · 기간 선택(시작/종료 포인트) |
| ⑤ Time control | **날짜+시간** Variant에서 시·(분) 선택. 스크롤 리스트, 스텝 입력, 마스크 입력 등 **제품 내 한 패턴으로 통일** |
| ⑥ Footer Actions | Apply / Cancel 버튼 |

---

## Variants

| 유형 | 설명 | 사용 예시 |
| --- | --- | --- |
| Single Date | 단일 날짜 선택 | 만료일, 청구일 |
| Date Range | 시작/종료 기간 선택 | 로그 기간, 리포트 기간 |
| Date & Time | 단일 날짜에 **시간(및 필요 시 분)** 까지 선택 | 예약 시작 시각, 작업 마감 일시, “해당 일의 특정 시각 이후” 필터 |
| DateTime Range (선택) | 시작·종료 **일시** 구간 | 장애 구간, 유지보수 창구 등 기간이 시각 단위로 의미가 있을 때 |

---

## States

| 상태 | 설명 |
| --- | --- |
| Default | 값 미선택 |
| Open | 캘린더 팝오버가 열린 상태 |
| Selected | 날짜(또는 범위, 일시)가 선택된 상태 |
| Invalid | 입력값이 규칙을 만족하지 못한 상태 |

---

## Behavior

### 1) 오픈/클로즈

- 입력 필드에서 Date 관련 필터 선택 또는 트리거 아이콘 클릭 시 팝오버 오픈
- 외부 클릭 시 팝오버 닫힘
- 팝오버가 열린 상태에서 스크롤이 불가(제품 표준에 따름)

### 2) 선택 규칙

- **Single Date**: 일자 클릭 → 선택 완료
- **Date Range**: 첫 클릭 Start, 두 번째 클릭 End. End가 Start보다 이전이면 이전 날짜를 새 Start로 보정
- **Date & Time**: 날짜 선택 후 Time control에서 시·분 조정. **Apply**는 날짜와 시간이 모두 유효할 때 활성화
- **DateTime Range** (사용 시): 시작 일시·종료 일시 모두 확정 전까지 Apply 비활성 또는 단계 규칙을 제품에서 단일하게 정함

### 3) 버튼 규칙

| 버튼 | 동작 |
| --- | --- |
| Apply | 유효한 선택이 완료되었을 때만 활성화. Single Date: 날짜 선택 시. Date Range: 시작·종료 모두. Date & Time / DateTime Range: **날짜·시간(및 분) 규칙을 모두 만족**할 때 |
| Cancel | 변경 없이 팝오버 닫힘 |

### 4) 월 이동

- 이전/다음 월 이동 버튼 제공. 연 이동은 제품 필요 시 확장

### 5) 제한(Constraints)

- **minDate / maxDate**: 범위 밖 날짜 비활성화
- 날짜 변경으로 시간이 규칙 밖이 되면 **가장 가까운 유효 시각으로 보정**하거나 **비활성 처리** 중 하나로 통일
- **주 시작일**: 기본 일요일, 필요 시 월요일 시작 설정 가능
- **과거 날짜 비허용**: 예약/만료 등 미래 날짜만 필요한 경우 minDate를 오늘로 설정

---

## Content Guidelines

### 날짜·기간 (기존)

| 언어 | 단일 날짜 | 기간 |
| --- | --- | --- |
| 한국어 | YYYY-MM-DD | YYYY-MM-DD – YYYY-MM-DD (양쪽 연도 포함) |
| 영어 | Mth DD, YYYY | Mth DD – Mth DD, YYYY (동일 연도/월이면 종료일에만 연도/월 표시) |

\`\`\`
예시
KO: 2026-03-01 – 2026-03-07
EN: Mar 01 – Mar 07, 2026
EN(연도 다름): Dec 30, 2025 – Jan 02, 2026
\`\`\`

### 날짜+시간 (추가)

| 언어 | 단일 일시 | 일시 구간 (DateTime Range) |
| --- | --- | --- |
| 한국어 | YYYY-MM-DD HH:mm (24h, leading zero 통일) | YYYY-MM-DD HH:mm – YYYY-MM-DD HH:mm (시작–종료) |
| 영어 | 로캘별 단일 포맷 고정 (예: MMM DD, YYYY, h:mm a) | 동일 원칙으로 시작–종료 표기 |

---

## Related

| 이름 | 유형 | 관련 이유 |
| --- | --- | --- |
| Input Field | Component | Trigger 표현과 상태 스타일 |
| Popover | Component | 캘린더 레이어/디스미스 규칙 |
| Button | Component | Apply/Cancel |
| UX Writing Guide | Foundation | 버튼·날짜·시간 표기 |
`;

function formatDate(d: Date | null): string {
  if (!d) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function DatePickerTrigger() {
  const [date, setDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const [pendingDate, setPendingDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setPendingDate(date);
  }, [open, date]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        const el = target instanceof Element ? target : target.parentElement;
        if (el?.closest('[role="listbox"]')) return;
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="flex items-center gap-2 w-[160px] h-[var(--input-height-md)] px-[var(--input-padding-x)] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[var(--input-radius)] text-body-md cursor-pointer hover:border-[var(--color-border-focus)] transition-colors"
        onClick={() => setOpen((p) => !p)}
      >
        <IconCalendar size={14} stroke={1.5} className="shrink-0 text-[var(--color-text-subtle)]" />
        <span
          className={date ? 'text-[var(--color-text-default)]' : 'text-[var(--color-text-subtle)]'}
        >
          {date ? formatDate(date) : 'Select date'}
        </span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50">
          <DatePicker
            value={pendingDate}
            onChange={setPendingDate}
            showActions
            onApply={(d) => {
              setDate(d);
              setOpen(false);
            }}
            onCancel={() => {
              setPendingDate(date);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

export function DatePickerPage() {
  const [singleDate, setSingleDate] = useState<Date | null>(new Date(2025, 2, 8));
  const [dateTimeValue, setDateTimeValue] = useState<Date | null>(new Date(2025, 2, 8, 14, 30));
  const [rangeValue, setRangeValue] = useState<{ start: Date | null; end: Date | null }>({
    start: new Date(2025, 2, 8),
    end: new Date(2025, 2, 23),
  });
  const [minMaxDate, setMinMaxDate] = useState<Date | null>(null);

  return (
    <ComponentPageTemplate
      title="Date Picker"
      description="사용자가 날짜(또는 날짜 범위, 또는 날짜+시간)을 선택해 검색/필터/예약/기간 설정 등에 사용하는 컴포넌트이다."
      whenToUse={[
        '날짜/기간을 조건으로 데이터를 필터링해야 할 때(예: 로그, 리포트, 결제 내역)',
        '시작일/종료일을 지정해야 할 때(예: 예약, 스케줄, 기간 설정)',
        '단일 날짜 선택이 필요한 폼 입력(예: 만료일, 청구일)',
        '특정 일시(날짜+시간)가 필요한 폼·필터(예: 예약 시작, 마감 일시, 로그 조회의 “해당 일의 시각 이후”)',
      ]}
      whenNotToUse={['“최근 7일/30일” 같은 프리셋만으로 충분한 경우(→ 버튼 세트로 제공)']}
      preview={
        <ComponentPreview code={`<DatePicker value={date} onChange={setDate} />`}>
          <DatePicker value={singleDate} onChange={setSingleDate} />
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Trigger (Input + Calendar Icon)</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                160px 너비의 입력 트리거로 DatePicker 팝오버를 오픈. 날짜 선택 후 입력 필드에 값
                표시. Drawer에서 사용 시: sm Drawer에서는 width: 100% (fill), md/lg Drawer에서는
                160px.
              </span>
            </VStack>
            <DatePickerTrigger />
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Single Date</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                단일 날짜 선택. 만료일, 청구일 등에 사용.
              </span>
            </VStack>
            <DatePicker
              value={singleDate}
              onChange={setSingleDate}
              eventDates={[new Date(2025, 2, 7)]}
            />
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Date & Time</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                날짜와 시간(시/분) 함께 선택. showTime 프로퍼티를 사용.
              </span>
            </VStack>
            <div className="flex gap-4 flex-wrap">
              <DatePicker
                value={dateTimeValue}
                onChange={setDateTimeValue}
                showTime
                timeFormat="12h"
              />
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Date Range</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                시작/종료 기간 선택. 로그 기간, 리포트 기간 등에 사용.
              </span>
            </VStack>
            <DatePicker
              mode="range"
              rangeValue={rangeValue}
              onRangeChange={setRangeValue}
              eventDates={[new Date(2025, 2, 7)]}
            />
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Min/Max Date Constraint</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                선택 가능 범위를 5일~25일로 제한. 범위 밖 날짜는 비활성화.
              </span>
            </VStack>
            <DatePicker
              value={minMaxDate}
              onChange={setMinMaxDate}
              minDate={new Date(2025, 2, 5)}
              maxDate={new Date(2025, 2, 25)}
            />
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Date Range Picker</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                START/END 날짜 헤더와 Cancel/Apply 버튼을 포함하는 래퍼. MonitoringToolbar 등에서
                사용.
              </span>
            </VStack>
            <DateRangePicker
              value={{
                start: new Date(2026, 2, 26),
                end: new Date(2026, 3, 2),
              }}
              maxDate={new Date()}
              onApply={(range) => console.log('Applied:', range)}
              onCancel={() => console.log('Cancelled')}
            />
          </VStack>

          <VStack gap={3}>
            <Label>States</Label>
            <div className="flex gap-6 items-start">
              <VStack gap={1} align="center">
                <span className="text-body-xs text-[var(--color-text-subtle)]">Default</span>
                <DatePicker value={singleDate} onChange={setSingleDate} />
              </VStack>
              <VStack gap={1} align="center">
                <span className="text-body-xs text-[var(--color-text-subtle)]">Disabled</span>
                <DatePicker value={new Date(2025, 2, 8)} disabled />
              </VStack>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={6}>
          <NotionRenderer markdown={DATE_PICKER_GUIDELINES} />
          <DosDonts
            doItems={[
              '기간 필터(로그/리포트)에는 Date Range + Presets를 권장한다.',
              '값이 필수인 경우 라벨과 required 표시를 명확히 한다.',
              'min/max, 기간·시간 제한이 있으면 입력 영역 근처에 안내한다.',
              '날짜만과 날짜+시간을 같은 화면에서 혼용하지 말고 목적에 맞는 Variant 하나를 쓴다.',
              '저장·표시 시 UTC vs 로컬 규칙은 제품 글로벌 정책과 맞춘다.',
            ]}
            dontItems={[
              '날짜 입력 포맷을 화면마다 다르게 만들지 않는다.',
              'Range에서 Start/End가 뒤집히는 케이스를 방치하지 않는다.',
              '제한이 있는데 선택 후에야 에러로 막지 않는다(가능하면 선택 불가 처리).',
              '시간이 필수 의미인 필드에 Date만 제공하지 않는다.',
            ]}
          />
        </VStack>
      }
      tokens={
        <div className="text-body-sm text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          padding: 12px · gap: 12px · radius: 8px · cell: 32×32px
        </div>
      }
      relatedLinks={[
        { label: 'Input', path: '/design/components/input' },
        { label: 'Popover', path: '/design/components/popover' },
        { label: 'Button', path: '/design/components/button' },
        { label: 'UX Writing Guide', path: '/design/policies/ux-writing' },
      ]}
    />
  );
}
