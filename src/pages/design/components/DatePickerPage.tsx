import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { DatePicker, VStack } from '@/design-system';

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
        {children}
      </table>
    </div>
  );
}

function Th({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={`text-left text-label-md font-medium p-3 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <td className={`p-3 border border-[var(--color-border-default)] align-top ${className}`}>
      {children}
    </td>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-heading-h4 text-[var(--color-text-default)]">{children}</h3>;
}

function SubSectionTitle({ children }: { children: React.ReactNode }) {
  return <h4 className="text-heading-h5 text-[var(--color-text-default)]">{children}</h4>;
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-body-md text-[var(--color-text-muted)] leading-relaxed space-y-2">
      {children}
    </div>
  );
}

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

function DatePickerGuidelines() {
  return (
    <VStack gap={10}>
      {/* Composition */}
      <VStack gap={4}>
        <SectionTitle>Composition</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>① Trigger</strong>
              </Td>
              <Td>캘린더 팝오버 오픈 트리거 (아이콘 버튼 또는 입력 필드 클릭)</Td>
            </tr>
            <tr>
              <Td>
                <strong>② Calendar Popover</strong>
              </Td>
              <Td>월/일 선택 UI(오버레이)</Td>
            </tr>
            <tr>
              <Td>
                <strong>③ Month Navigation</strong>
              </Td>
              <Td>이전/다음 월 이동, 월/연도 표시</Td>
            </tr>
            <tr>
              <Td>
                <strong>④ Day Grid</strong>
              </Td>
              <Td>
                • 단일 일자 선택 (일자 포인트)
                <br />• 기간 선택 (시작/종료 포인트)
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>⑤ Footer Actions</strong>
              </Td>
              <Td>Apply/Cancel 버튼</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>Design Token</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">속성</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <span className="font-mono">padding</span>
              </Td>
              <Td>12px</Td>
            </tr>
            <tr>
              <Td>
                <span className="font-mono">gap</span>
              </Td>
              <Td>12px</Td>
            </tr>
            <tr>
              <Td>
                <span className="font-mono">radius</span>
              </Td>
              <Td>8px</Td>
            </tr>
            <tr>
              <Td>
                <span className="font-mono">cell</span>
              </Td>
              <Td>32×32px</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Variants */}
      <VStack gap={4}>
        <SectionTitle>Variants</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th>유형</Th>
              <Th>설명</Th>
              <Th>사용 예시</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Single Date</strong>
              </Td>
              <Td>단일 날짜 선택</Td>
              <Td>만료일, 청구일</Td>
            </tr>
            <tr>
              <Td>
                <strong>Date Range</strong>
              </Td>
              <Td>시작/종료 기간 선택</Td>
              <Td>로그 기간, 리포트 기간</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* States */}
      <VStack gap={4}>
        <SectionTitle>States</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[160px]">상태</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Default</strong>
              </Td>
              <Td>값 미선택</Td>
            </tr>
            <tr>
              <Td>
                <strong>Open</strong>
              </Td>
              <Td>캘린더 팝오버가 열린 상태</Td>
            </tr>
            <tr>
              <Td>
                <strong>Selected</strong>
              </Td>
              <Td>날짜(또는 범위)가 선택된 상태</Td>
            </tr>
            <tr>
              <Td>
                <strong>Invalid</strong>
              </Td>
              <Td>입력값이 규칙을 만족하지 못한 상태</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Behavior */}
      <VStack gap={6}>
        <SectionTitle>Behavior</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>1) 오픈/클로즈</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>입력 필드에서 Date 관련 필터 선택 또는 트리거 아이콘 클릭 시 팝오버 오픈</li>
              <li>외부 클릭 시 팝오버 닫힘</li>
              <li>팝오버가 열린 상태에서 스크롤이 불가</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>2) 선택 규칙</SubSectionTitle>
          <Prose>
            <p>
              <strong>Single Date</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>일자 클릭 → 선택 완료</li>
            </ul>
            <p>
              <strong>Date Range</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>첫 클릭: Start date 설정</li>
              <li>두 번째 클릭: End date 설정</li>
              <li>
                End date는 Start date보다 이전일 경우, 이전 날짜를 새로운 Start date로 자동 보정
              </li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>3) 버튼 규칙</SubSectionTitle>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[100px]">버튼</Th>
                <Th>동작</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>
                  <strong>Apply</strong>
                </Td>
                <Td>
                  • Apply 버튼은 유효한 날짜 선택이 완료되었을 때만 활성화
                  <br />
                  • Single Date: 날짜가 선택되면 활성화
                  <br />
                  • Date Range: 시작일과 종료일이 모두 선택되어야 활성화
                  <br />• 선택된 날짜 값 확정
                </Td>
              </tr>
              <tr>
                <Td>
                  <strong>Cancel</strong>
                </Td>
                <Td>변경 사항을 적용하지 않고 팝오버 닫힘</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>4) 월 이동</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>이전/다음 월 이동 버튼 제공</li>
              <li>연 이동 기능 없음</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>5) 제한(Constraints)</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>minDate / maxDate</strong>: 선택 가능 범위를 제한. 범위 밖 날짜는 비활성화.
              </li>
              <li>
                <strong>주 시작일</strong>: 기본 일요일. 필요 시 월요일 시작으로 설정 가능.
              </li>
              <li>
                <strong>과거 날짜 비허용</strong>: 예약/만료 등 미래 날짜만 필요한 경우 minDate를
                오늘로 설정.
              </li>
            </ul>
          </Prose>
        </VStack>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Usage Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Usage Guidelines</SectionTitle>
        <DosDonts
          doItems={[
            '기간 필터(로그/리포트)에는 Date Range + Presets를 권장한다. (Presets 기능은 구현 예정)',
            '값이 필수인 경우 라벨과 required 표시를 명확히 한다.',
            'min/max, 기간 제한 같은 정책이 있으면 입력 영역 근처에 안내한다.',
            '기본값이 있는 경우(예: 최근 7일) 명확히 노출한다.',
          ]}
          dontItems={[
            '날짜 입력 포맷을 화면마다 다르게 만들지 않는다.',
            'Range에서 Start/End가 뒤집히는 케이스를 방치하지 않는다.',
            '제한 정책이 있는데도 사용자가 선택한 뒤에야 에러로 막지 않는다(가능하면 선택 불가 처리).',
          ]}
        />
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Content Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Content Guidelines</SectionTitle>
        <Prose>
          <p>Date Range는 다음과 같이 표기한다.</p>
        </Prose>
        <TableWrapper>
          <thead>
            <tr>
              <Th>언어</Th>
              <Th>단일 날짜 표시</Th>
              <Th>기간 표시</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>한국어</Td>
              <Td>
                <span className="font-mono">YYYY-MM-DD</span>
              </Td>
              <Td>
                <span className="font-mono">YYYY-MM-DD – YYYY-MM-DD</span> (양쪽 연도 포함)
              </Td>
            </tr>
            <tr>
              <Td>영어</Td>
              <Td>
                <span className="font-mono">Mth DD, YYYY</span>
              </Td>
              <Td>
                <span className="font-mono">Mth DD – Mth DD, YYYY</span> (동일 연도/월이면
                종료일에만 연도/월 표시)
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] p-3">
          <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre-wrap">
            {`예시
KO: 2026-03-01 – 2026-03-07
EN: Mar 01 – Mar 07, 2026
EN(연도 다름): Dec 30, 2025 – Jan 02, 2026`}
          </pre>
        </div>
      </VStack>
    </VStack>
  );
}

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
      title="Date Picker"
      description="사용자가 날짜(또는 날짜 범위)를 선택해 검색/필터/예약/기간 설정 등에 사용하는 컴포넌트이다."
      whenToUse={[
        '날짜/기간을 조건으로 데이터를 필터링해야 할 때(예: 로그, 리포트, 결제 내역)',
        '시작일/종료일을 지정해야 할 때(예: 예약, 스케줄, 기간 설정)',
        '단일 날짜 선택이 필요한 폼 입력(예: 만료일, 청구일)',
      ]}
      whenNotToUse={[
        '시간까지 포함한 정밀 선택이 핵심인 경우(→ 시간 설정 기능 추가 필요)',
        '"최근 7일/30일" 같은 프리셋만으로 충분한 경우(→ 버튼 세트로 제공)',
      ]}
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
              <Label>Monday Start</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                주 시작일을 월요일로 설정. firstDayOfWeek=1.
              </span>
            </VStack>
            <DatePicker firstDayOfWeek={1} value={mondayDate} onChange={setMondayDate} />
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
      guidelines={<DatePickerGuidelines />}
      tokens={
        <div className="text-body-sm text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
          <span className="font-mono">padding: 12px</span> ·{' '}
          <span className="font-mono">gap: 12px</span> ·{' '}
          <span className="font-mono">radius: 8px</span> ·{' '}
          <span className="font-mono">cell: 32×32px</span>
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
      keyboardInteractions={[
        { key: 'ArrowRight', description: '다음 날짜로 이동' },
        { key: 'ArrowLeft', description: '이전 날짜로 이동' },
        { key: 'ArrowDown', description: '다음 주 같은 요일로 이동' },
        { key: 'ArrowUp', description: '이전 주 같은 요일로 이동' },
        { key: 'Home', description: '현재 월의 첫째 날로 이동' },
        { key: 'End', description: '현재 월의 마지막 날로 이동' },
        { key: 'Enter / Space', description: '포커스된 날짜 선택' },
      ]}
      relatedLinks={[
        {
          label: 'Input Field',
          path: '/design/components/input',
          description: 'Trigger 표현과 상태 스타일',
        },
        {
          label: 'Monitoring Toolbar',
          path: '/design/patterns/monitoring-toolbar',
          description: 'Trigger 표현과 상태 스타일',
        },
        {
          label: 'Popover',
          path: '/design/components/popover',
          description: '캘린더 레이어/디스미스 규칙',
        },
        { label: 'Button', path: '/design/components/button', description: 'Apply/Cancel/Clear' },
        {
          label: 'Search Input',
          path: '/design/components/search-input',
          description: '리스트/로그 필터 조건과 결합',
        },
        {
          label: 'UX Writing Guide',
          path: '/design/policies/ux-writing',
          description: '버튼/날짜 표기 규칙',
        },
      ]}
    />
  );
}
