import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { DatePicker, VStack } from '@/design-system';

const datePickerProps: PropDef[] = [
  {
    name: 'mode',
    type: "'single' | 'range'",
    default: "'single'",
    required: false,
    description: 'Selection mode',
  },
  {
    name: 'value',
    type: 'Date | null',
    required: false,
    description: 'Selected date (single mode)',
  },
  {
    name: 'rangeValue',
    type: '{ start: Date | null; end: Date | null }',
    required: false,
    description: 'Selected range',
  },
  {
    name: 'onChange',
    type: '(date: Date | null) => void',
    required: false,
    description: 'Date change handler',
  },
  {
    name: 'onRangeChange',
    type: '(range: { start; end }) => void',
    required: false,
    description: 'Range change handler',
  },
  {
    name: 'eventDates',
    type: 'Date[]',
    default: '[]',
    required: false,
    description: 'Dates with event indicators',
  },
  { name: 'minDate', type: 'Date', required: false, description: 'Minimum selectable date' },
  { name: 'maxDate', type: 'Date', required: false, description: 'Maximum selectable date' },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Disabled state',
  },
  {
    name: 'firstDayOfWeek',
    type: '0 | 1',
    default: '0',
    required: false,
    description: 'First day of week (0=Sun, 1=Mon)',
  },
];

export function DatePickerPage() {
  const [singleDate, setSingleDate] = useState<Date | null>(new Date(2025, 2, 8));
  const [rangeValue, setRangeValue] = useState<{ start: Date | null; end: Date | null }>({
    start: new Date(2025, 2, 8),
    end: new Date(2025, 2, 23),
  });
  const [minMaxDate, setMinMaxDate] = useState<Date | null>(null);
  const [mondayDate, setMondayDate] = useState<Date | null>(new Date(2025, 2, 8));

  return (
    <ComponentPageTemplate
      title="DatePicker"
      description="Calendar-based date selection with single and range modes"
      preview={
        <ComponentPreview code={`<DatePicker value={date} onChange={setDate} />`}>
          <DatePicker value={singleDate} onChange={setSingleDate} />
        </ComponentPreview>
      }
      usage={{
        code: `import { DatePicker } from '@/design-system';\n\nconst [date, setDate] = useState<Date | null>(null);\n\n<DatePicker value={date} onChange={setDate} />`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>
              Single Selection{' '}
              {singleDate && (
                <span className="font-normal text-[var(--color-text-muted)]">
                  — {singleDate.toLocaleDateString()}
                </span>
              )}
            </Label>
            <DatePicker
              value={singleDate}
              onChange={setSingleDate}
              eventDates={[new Date(2025, 2, 7)]}
            />
          </VStack>

          <VStack gap={3}>
            <Label>
              Range Selection
              {rangeValue.start && rangeValue.end && (
                <span className="font-normal text-[var(--color-text-muted)]">
                  — {rangeValue.start.toLocaleDateString()} ~ {rangeValue.end.toLocaleDateString()}
                </span>
              )}
            </Label>
            <DatePicker
              mode="range"
              rangeValue={rangeValue}
              onRangeChange={setRangeValue}
              eventDates={[new Date(2025, 2, 7)]}
            />
          </VStack>

          <VStack gap={3}>
            <Label>
              With Min/Max Date (5th ~ 25th){' '}
              {minMaxDate && (
                <span className="font-normal text-[var(--color-text-muted)]">
                  — {minMaxDate.toLocaleDateString()}
                </span>
              )}
            </Label>
            <DatePicker
              value={minMaxDate}
              onChange={setMinMaxDate}
              minDate={new Date(2025, 2, 5)}
              maxDate={new Date(2025, 2, 25)}
            />
          </VStack>

          <VStack gap={3}>
            <Label>
              Monday Start{' '}
              {mondayDate && (
                <span className="font-normal text-[var(--color-text-muted)]">
                  — {mondayDate.toLocaleDateString()}
                </span>
              )}
            </Label>
            <DatePicker firstDayOfWeek={1} value={mondayDate} onChange={setMondayDate} />
          </VStack>

          <VStack gap={3}>
            <Label>States</Label>
            <div className="flex gap-4 items-start">
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Default
                </span>
                <DatePicker value={singleDate} onChange={setSingleDate} />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Disabled
                </span>
                <DatePicker value={new Date(2025, 2, 8)} disabled />
              </VStack>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={4}>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">모드 선택 기준</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        모드
                      </th>
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        사용 조건
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        예시
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Single
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        특정 날짜 하나를 선택
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">만료일, 생성일</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Range
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        시작일~종료일 기간을 선택
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        모니터링 기간, 예약 기간
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">날짜 형식 규칙</h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  표시 형식: <code>YYYY-MM-DD</code> (예: 2026-02-09)
                </li>
                <li>
                  시간 포함 시: <code>YYYY-MM-DD HH:mm</code> (예: 2026-02-09 14:30)
                </li>
                <li>
                  범위 표시: <code>YYYY-MM-DD ~ YYYY-MM-DD</code>
                </li>
                <li>미선택 상태: placeholder로 형식 안내 (예: &quot;Select date&quot;)</li>
              </ul>
            </VStack>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">제한 정책</h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  <strong>minDate / maxDate</strong>: 선택 가능 범위를 제한. 범위 밖 날짜는
                  비활성화.
                </li>
                <li>
                  <strong>주 시작일</strong>: 기본 일요일. 필요 시 월요일 시작으로 설정 가능.
                </li>
                <li>
                  <strong>과거 날짜 비허용</strong>: 예약/만료 등 미래 날짜만 필요한 경우 minDate를
                  오늘로 설정.
                </li>
              </ul>
            </VStack>
          </VStack>
        </div>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>padding: 12px</code> · <code>gap: 12px</code> · <code>radius: 8px</code> ·{' '}
          <code>cell: 32×32px</code>
        </div>
      }
      apiReference={datePickerProps}
      accessibility={
        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
          <li>Arrow keys: Navigate dates</li>
          <li>Enter/Space: Select date</li>
          <li>Tab: Move focus</li>
        </ul>
      }
      relatedLinks={[
        { label: 'Input', path: '/design/components/input', description: 'Text fields' },
        {
          label: 'Form Field Spacing',
          path: '/design/components/form-field',
          description: 'Label and input combinations',
        },
        { label: 'Select', path: '/design/components/select', description: 'Dropdown select' },
      ]}
    />
  );
}
