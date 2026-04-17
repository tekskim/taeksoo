import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { Label } from '../../design-system-sections/HelperComponents';
import { Loading, VStack } from '@/design-system';

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
      <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
        {children}
      </table>
    </div>
  );
}

function Th({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={`text-left text-label-md font-medium p-3 bg-[var(--color-surface-subtle)] border-b border-r last:border-r-0 border-[var(--color-border-subtle)] ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <td
      className={`p-3 border-t border-r last:border-r-0 border-[var(--color-border-subtle)] align-top ${className}`}
    >
      {children}
    </td>
  );
}

const SPINNER_GUIDELINES = `## Overview

Spinner는 **작업이 진행 중이거나 시스템이 응답을 기다리는 동안 로딩 상태를 표시하는 컴포넌트**이다.

Spinner는 사용자가 시스템이 정상적으로 동작하고 있음을 인지하도록 하며, 작업이 완료될 때까지 기다려야 한다는 상태를 전달한다.

Spinner는 다음 상황에서 사용된다.

- 작업 진행 중 (Processing state)
- 데이터 요청 대기 상태
- 비동기 작업 수행 중
- 전체 화면 로딩 상태

Spinner는 **작업 완료 시 자동으로 제거되며 실제 UI 또는 결과 상태로 교체된다.**

---

## Composition

| 요소 | 설명 |
| --- | --- |
| Spinner Indicator | 회전하는 로딩 아이콘 |
| Container | Spinner를 감싸는 영역 |
| Optional Label | 로딩 상태 설명 텍스트 |

---

## Variants

| 유형 | 설명 |
| --- | --- |
| Page Spinner | 전체 화면 로딩 표시 |
| Button Spinner | 버튼 내부 작업 진행 표시 |

---

## Behavior

### 1) Loading 시작

- 작업 또는 데이터 요청이 시작되면 Spinner를 표시한다.

### 2) Loading 진행

- Spinner는 작업이 완료될 때까지 계속 표시된다.
- Spinner는 **무한 회전 애니메이션**을 사용한다.
- 작업 진행률을 표시하지 않는다.

### 3) Loading 완료

- 작업이 완료되면 Spinner는 제거되고 다음 상태로 전환된다.

가능한 결과:

- 실제 콘텐츠 표시
- 성공 메시지
- 오류 메시지

### 4) Loading 시간 정책

| 로딩 시간 | 정책 |
| --- | --- |
| < 300ms | Spinner 표시하지 않음 |
| 300ms – 3s | Spinner 표시 |

### 5) 인터랙션 제한

Spinner가 표시되는 동안 다음 정책을 따른다.

| 상태 | 정책 |
| --- | --- |
| Button spinner | 해당 버튼 클릭 제한 |
| Page spinner | 전체 화면 인터랙션 제한 |

### 6) Optional Label

- 전체 화면 로딩이 이뤄질 경우 스피너 아래에 문구를 추가한다.
- 문구: Loading data…

### 7) Spinner와 Progress 구분

| 유형 | 의미 |
| --- | --- |
| Spinner | 진행률 알 수 없음 |
| Progress bar | 진행률 알 수 있음 |

---

## Related

| 이름 | 유형 | 이유 |
| --- | --- | --- |
| Loading | Pattern | 상위 로딩 패턴 |
| Skeleton | Component | 콘텐츠 로딩 표시 |
| Progress Bar | Component | 진행률 표시 |
| Empty State | Pattern | 데이터 없음 상태 |
| Modal | Component | 작업 진행 상태 표시 |
`;

export function SpinnerPage() {
  return (
    <ComponentPageTemplate
      title="Spinner"
      description="작업이 진행 중이거나 시스템이 응답을 기다리는 동안 로딩 상태를 표시하는 컴포넌트. 사용자가 시스템이 정상적으로 동작하고 있음을 인지하도록 하며, 작업이 완료될 때까지 기다려야 한다는 상태를 전달한다. 작업 완료 시 자동으로 제거되며 실제 UI 또는 결과 상태로 교체된다."
      whenToUse={[
        '작업 진행 상태를 표시해야 하는 경우',
        'UI 레이아웃을 미리 표시할 수 없는 경우',
        '전체 화면 로딩 상태',
        '사용자 액션 이후 처리 대기 상태',
      ]}
      whenNotToUse={[
        '콘텐츠 구조를 미리 보여줄 수 있는 경우 (→ Skeleton)',
        '짧은 로딩 (<300ms) (→ 표시하지 않음)',
        '진행률을 표시할 수 있는 작업 (→ Progress bar)',
      ]}
      preview={
        <ComponentPreview code={`<Loading variant="spinner" size="md" text="Loading" />`}>
          <div className="flex gap-8 items-end">
            <VStack gap={2} align="center">
              <span className="text-body-xs text-[var(--color-text-subtle)]">Small</span>
              <Loading variant="spinner" size="sm" text="Loading" />
            </VStack>
            <VStack gap={2} align="center">
              <span className="text-body-xs text-[var(--color-text-subtle)]">Medium</span>
              <Loading variant="spinner" size="md" text="Loading" />
            </VStack>
            <VStack gap={2} align="center">
              <span className="text-body-xs text-[var(--color-text-subtle)]">Large</span>
              <Loading variant="spinner" size="lg" text="Loading" />
            </VStack>
          </div>
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Page Spinner</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                전체 화면 로딩 표시. 레이아웃을 예측할 수 없는 초기 로딩 시 사용.
              </span>
            </VStack>
            <div className="flex gap-8 items-end p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
              <VStack gap={2} align="center">
                <span className="text-body-xs text-[var(--color-text-subtle)]">Small</span>
                <Loading variant="spinner" size="sm" text="Loading" />
              </VStack>
              <VStack gap={2} align="center">
                <span className="text-body-xs text-[var(--color-text-subtle)]">Medium</span>
                <Loading variant="spinner" size="md" text="Loading" />
              </VStack>
              <VStack gap={2} align="center">
                <span className="text-body-xs text-[var(--color-text-subtle)]">Large</span>
                <Loading variant="spinner" size="lg" text="Loading data…" />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Button Spinner</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                버튼 내부 작업 진행 표시. 제출 중인 버튼은 Spinner + disabled 상태로 표시하여 중복
                요청을 방지.
              </span>
            </VStack>
            <div className="flex gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
              <Loading variant="button" buttonLabel="Loading" />
              <Loading variant="button" buttonLabel="Saving" />
              <Loading variant="button" buttonLabel="Processing" />
            </div>
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={6}>
          <NotionRenderer markdown={SPINNER_GUIDELINES} />
          <DosDonts
            doItems={[
              '작업 진행 상태를 명확히 전달한다.',
              'Spinner 표시 시간을 최소화한다.',
              '필요한 경우 상태 메시지를 함께 제공한다.',
              '로딩 영역 범위를 명확히 한다.',
            ]}
            dontItems={[
              'Skeleton과 Spinner를 동시에 사용하지 않는다.',
              'Spinner를 너무 오래 표시하지 않는다.',
              '로딩 상태가 아닌 곳에서 Spinner를 사용하지 않는다.',
              '불필요하게 전체 화면 Spinner를 사용하지 않는다.',
            ]}
          />
        </VStack>
      }
      tokens={
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">토큰</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>spinner size (sm)</Td>
              <Td>16px</Td>
            </tr>
            <tr>
              <Td>spinner size (md)</Td>
              <Td>22px</Td>
            </tr>
            <tr>
              <Td>spinner size (lg)</Td>
              <Td>32px</Td>
            </tr>
            <tr>
              <Td>button min-width</Td>
              <Td>80px</Td>
            </tr>
          </tbody>
        </TableWrapper>
      }
      relatedLinks={[
        { label: 'Loading', path: '/design/components/loading' },
        { label: 'Skeleton', path: '/design/components/skeleton' },
        { label: 'Progress Bar', path: '/design/components/progress-bar' },
        { label: 'Empty State', path: '/design/patterns/empty-states' },
        { label: 'Modal', path: '/design/components/modal' },
      ]}
    />
  );
}
