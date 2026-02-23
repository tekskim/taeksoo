import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { DatePicker, VStack } from '@/design-system';

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
      relatedLinks={[
        { label: 'Input', path: '/design/components/input', description: 'Text fields' },
        {
          label: 'Form Field Spacing',
          path: '/design/components/form-field',
          description: 'Label and input combinations',
        },
        { label: 'Select', path: '/design/components/select', description: 'Dropdown select' },
      ]}
    >
      <VStack gap={8}>
        {/* 사용 정책 */}
        <VStack gap={3}>
          <Label>사용 정책</Label>
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
                    <strong>과거 날짜 비허용</strong>: 예약/만료 등 미래 날짜만 필요한 경우
                    minDate를 오늘로 설정.
                  </li>
                </ul>
              </VStack>
            </VStack>
          </div>
        </VStack>

        {/* Tokens */}
        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>padding: 12px</code> · <code>gap: 12px</code> · <code>radius: 8px</code> ·{' '}
            <code>cell: 32×32px</code>
          </div>
        </VStack>

        {/* Single Selection */}
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

        {/* Range Selection */}
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

        {/* With Min/Max Date */}
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

        {/* Monday Start */}
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

        {/* States */}
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
    </ComponentPageTemplate>
  );
}
