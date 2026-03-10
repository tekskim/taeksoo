import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Slider, RangeSlider, NumberInput, VStack } from '@/design-system';

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

const sliderProps: PropDef[] = [
  { name: 'min', type: 'number', default: '0', required: false, description: 'Minimum value' },
  { name: 'max', type: 'number', default: '100', required: false, description: 'Maximum value' },
  { name: 'step', type: 'number', default: '1', required: false, description: 'Step increment' },
  { name: 'value', type: 'number', required: false, description: 'Controlled value' },
  {
    name: 'defaultValue',
    type: 'number',
    default: '0',
    required: false,
    description: 'Default value',
  },
  {
    name: 'onChange',
    type: '(value: number) => void',
    required: false,
    description: 'Change handler',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Disabled state',
  },
  {
    name: 'showValue',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Show current value',
  },
  {
    name: 'formatValue',
    type: '(value: number) => string',
    required: false,
    description: 'Format display value',
  },
];

function SliderPreview() {
  const [value, setValue] = useState(40);

  return (
    <div className="flex items-center gap-3">
      <Slider value={value} onChange={setValue} min={0} max={100} step={1} />
      <NumberInput value={value} onChange={setValue} min={0} max={100} step={1} width="xs" />
    </div>
  );
}

function SliderWithNumberInputDemo() {
  const [value, setValue] = useState(50);

  return (
    <VStack gap={3}>
      <VStack gap={1}>
        <Label>Pattern B: Slider + NumberInput</Label>
        <span className="text-body-sm text-[var(--color-text-subtle)]">
          단일 값 선택 + 정밀 입력. 넓은 범위에서 사용.
        </span>
      </VStack>
      <div className="flex items-center gap-3 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
        <Slider value={value} onChange={setValue} min={0} max={100} step={1} />
        <NumberInput value={value} onChange={setValue} min={0} max={100} step={1} width="xs" />
      </div>
    </VStack>
  );
}

function SliderWithCustomRangeDemo() {
  const [value, setValue] = useState(250);

  return (
    <VStack gap={3}>
      <VStack gap={1}>
        <Label>Pattern B: Storage Capacity (0-1000 GiB)</Label>
        <span className="text-body-sm text-[var(--color-text-subtle)]">
          넓은 범위 + 단위 표시. Slider step은 크게, NumberInput step은 1로 설정.
        </span>
      </VStack>
      <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
        <VStack gap={1}>
          <div className="flex items-center gap-3">
            <Slider value={value} onChange={setValue} min={0} max={1000} step={10} />
            <NumberInput
              value={value}
              onChange={setValue}
              min={0}
              max={1000}
              step={1}
              width="xs"
              suffix="GiB"
            />
          </div>
          <span className="text-body-sm text-[var(--color-text-subtle)]">0-1000 GiB</span>
        </VStack>
      </div>
    </VStack>
  );
}

function RangeSliderDemo() {
  const [minLength, setMinLength] = useState(8);
  const [maxLength, setMaxLength] = useState(64);

  return (
    <VStack gap={3}>
      <VStack gap={1}>
        <Label>Pattern D: RangeSlider + NumberInput 2개</Label>
        <span className="text-body-sm text-[var(--color-text-subtle)]">
          min-max 범위를 사용자가 직접 정의. 두 핸들 간 min &lt; max 관계 유지.
        </span>
      </VStack>
      <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
        <VStack gap={2}>
          <div className="flex items-center gap-3">
            <NumberInput
              value={minLength}
              onChange={(val) => {
                if (val < maxLength) {
                  setMinLength(val);
                }
              }}
              min={6}
              max={maxLength - 1}
              step={1}
              width="xs"
            />
            <RangeSlider
              value={[minLength, maxLength]}
              onChange={([min, max]) => {
                setMinLength(min);
                setMaxLength(max);
              }}
              min={6}
              max={128}
              step={1}
            />
            <NumberInput
              value={maxLength}
              onChange={(val) => {
                if (val > minLength) {
                  setMaxLength(val);
                }
              }}
              min={minLength + 1}
              max={128}
              step={1}
              width="xs"
            />
          </div>
          <p className="text-body-sm text-[var(--color-text-subtle)]">
            6 - 128 / Maximum length must be greater than or equal to the minimum length.
          </p>
        </VStack>
      </div>
    </VStack>
  );
}

function SliderGuidelines() {
  return (
    <VStack gap={10}>
      {/* Variants */}
      <VStack gap={4}>
        <SectionTitle>Variants</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">구분</Th>
              <Th>설명</Th>
              <Th>사용 예시</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Slider + NumberInput</strong>
              </Td>
              <Td>단일 값 선택 + 정밀 입력</Td>
              <Td>스토리지(GiB), vCPU, 메모리</Td>
            </tr>
            <tr>
              <Td>
                <strong>RangeSlider + NumberInput×2</strong>
              </Td>
              <Td>min-max 범위 직접 정의</Td>
              <Td>비밀번호 길이 정책, 포트 범위</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Composition */}
      <VStack gap={4}>
        <SectionTitle>Composition</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[160px]">요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Label</strong>
              </Td>
              <Td>필드 라벨</Td>
            </tr>
            <tr>
              <Td>
                <strong>Track</strong>
              </Td>
              <Td>슬라이더 배경 트랙</Td>
            </tr>
            <tr>
              <Td>
                <strong>Fill</strong>
              </Td>
              <Td>선택된 구간 표시</Td>
            </tr>
            <tr>
              <Td>
                <strong>Thumb</strong>
              </Td>
              <Td>드래그 가능한 핸들</Td>
            </tr>
            <tr>
              <Td>
                <strong>Min/Max Label</strong>
              </Td>
              <Td>범위 라벨 (선택)</Td>
            </tr>
            <tr>
              <Td>
                <strong>NumberInput</strong>
              </Td>
              <Td>정밀 값 입력</Td>
            </tr>
            <tr>
              <Td>
                <strong>Unit Label</strong>
              </Td>
              <Td>단위 표시 (GiB, % 등)</Td>
            </tr>
            <tr>
              <Td>
                <strong>Second Thumb</strong>
              </Td>
              <Td>RangeSlider 전용</Td>
            </tr>
            <tr>
              <Td>
                <strong>Helper Text</strong>
              </Td>
              <Td>도움말 텍스트</Td>
            </tr>
          </tbody>
        </TableWrapper>
        <Prose>
          <p>Slider 트랙은 고정 220px이다.</p>
        </Prose>

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
                <code>track-width</code>
              </Td>
              <Td>220px</Td>
            </tr>
            <tr>
              <Td>
                <code>track-height</code>
              </Td>
              <Td>6px</Td>
            </tr>
            <tr>
              <Td>
                <code>thumb-size</code>
              </Td>
              <Td>16px</Td>
            </tr>
            <tr>
              <Td>
                <code>thumb-border</code>
              </Td>
              <Td>3px</Td>
            </tr>
            <tr>
              <Td>
                <code>fill-color</code>
              </Td>
              <Td>primary</Td>
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
              <Td>기본 상태</Td>
            </tr>
            <tr>
              <Td>
                <strong>Hover</strong>
              </Td>
              <Td>마우스 오버 시</Td>
            </tr>
            <tr>
              <Td>
                <strong>Focus</strong>
              </Td>
              <Td>키보드 포커스 시</Td>
            </tr>
            <tr>
              <Td>
                <strong>Active Dragging</strong>
              </Td>
              <Td>드래그 중</Td>
            </tr>
            <tr>
              <Td>
                <strong>Disabled</strong>
              </Td>
              <Td>비활성화</Td>
            </tr>
            <tr>
              <Td>
                <strong>Error</strong>
              </Td>
              <Td>에러 상태</Td>
            </tr>
            <tr>
              <Td>
                <strong>Read-only</strong>
              </Td>
              <Td>읽기 전용</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Behavior */}
      <VStack gap={4}>
        <SectionTitle>Behavior</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">인터랙션</Th>
              <Th>동작</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>트랙 클릭</strong>
              </Td>
              <Td>클릭 위치로 값 이동</Td>
            </tr>
            <tr>
              <Td>
                <strong>핸들 드래그</strong>
              </Td>
              <Td>드래그로 값 조정</Td>
            </tr>
            <tr>
              <Td>
                <strong>NumberInput 직접 입력</strong>
              </Td>
              <Td>정밀 값 입력</Td>
            </tr>
            <tr>
              <Td>
                <kbd>←</kbd> / <kbd>→</kbd>
              </Td>
              <Td>step 단위로 감소/증가</Td>
            </tr>
            <tr>
              <Td>
                <kbd>Home</kbd>
              </Td>
              <Td>최소값으로 이동</Td>
            </tr>
            <tr>
              <Td>
                <kbd>End</kbd>
              </Td>
              <Td>최대값으로 이동</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <VStack gap={3}>
          <SubSectionTitle>Range Slider 추가 규칙</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>두 핸들 간 min &lt; max 관계를 유지한다.</li>
              <li>NumberInput 두 개와 양방향 동기화한다.</li>
              <li>한쪽 값 변경 시 다른 쪽의 min/max 제약을 반영한다.</li>
              <li>접근성: 두 핸들 모두 키보드로 포커스 및 조작 가능해야 한다.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>Number Input 연동</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>Slider와 NumberInput은 동일한 state를 공유한다.</li>
              <li>
                Slider step은 빠른 조절용으로 크게, NumberInput step은 정밀 입력용으로 1을 권장한다.
              </li>
              <li>단위(GiB, % 등)가 있을 경우 NumberInput suffix 또는 인접 라벨로 표시한다.</li>
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
            '넓은 범위(20개 이상) + 정밀 입력이 필요할 때 Slider + NumberInput 조합을 사용한다.',
            'FormField로 감싸 라벨과 Helper Text를 제공한다.',
            '범위가 넓으면 Slider step을 크게(5, 10, 50) 설정하고 NumberInput step은 1로 유지한다.',
            '단위(GiB, %, vCPU 등)가 있으면 suffix 또는 인접 라벨로 명시한다.',
            'min-max 범위를 사용자가 정의할 때는 RangeSlider + NumberInput 2개를 사용한다.',
            '트랙 너비는 고정 220px을 유지한다.',
          ]}
          dontItems={[
            '날짜·시간 선택에는 Slider를 사용하지 않는다 → DatePicker 사용.',
            '범위가 매우 크면(1–1000+) Slider 없이 NumberInput 단독 사용을 검토한다.',
            '범위가 매우 작으면(1–3) Select 사용을 검토한다.',
            '트랙 너비를 임의로 변경하지 않는다.',
            'Slider 단독으로 정밀 입력이 필요한 필드를 구성하지 않는다.',
          ]}
        />
      </VStack>
    </VStack>
  );
}

export function SliderPage() {
  return (
    <ComponentPageTemplate
      title="Slider"
      description="범위 내에서 값을 선택하기 위한 드래그 가능한 슬라이더 컴포넌트다. 트랙 위의 핸들을 드래그하거나 클릭하여 단일 값 또는 min-max 범위를 조작하며, Number Input과 함께 사용해 정밀 입력을 병행한다."
      whenToUse={[
        '연속적인 수치 범위(스토리지 용량, CPU, 메모리 등) 내에서 값을 직관적으로 조정해야 할 때',
        '슬라이더의 현재 위치로 값의 상대적 크기를 시각적으로 인지해야 할 때',
        'Number Input과 함께 사용해 슬라이더(대략적인 값 입력) + 직접 입력(정밀도)을 동시에 제공해야 할 때',
        '사용자가 min-max 범위 자체를 직접 정의해야 할 때 (Range Slider)',
      ]}
      whenNotToUse={[
        '날짜·시간 선택 목적 → Date Picker 사용',
        '범위가 매우 큰 경우(1–1000 이상) → Number Input 사용',
        '범위가 매우 작은 경우(1–3) → Select 사용',
      ]}
      keyboardInteractions={[
        { key: '← / →', description: 'Decrease / increase value by one step' },
        { key: 'Home', description: 'Move to minimum value' },
        { key: 'End', description: 'Move to maximum value' },
      ]}
      preview={
        <ComponentPreview
          code={`<div className="flex items-center gap-3">\n  <Slider value={value} onChange={setValue} min={0} max={100} />\n  <NumberInput value={value} onChange={setValue} min={0} max={100} width="xs" />\n</div>`}
        >
          <SliderPreview />
        </ComponentPreview>
      }
      usage={{
        code: `import { Slider, NumberInput } from '@/design-system';\n\nconst [value, setValue] = useState(50);\n\n<div className="flex items-center gap-3">\n  <Slider value={value} onChange={setValue} min={0} max={100} />\n  <NumberInput value={value} onChange={setValue} min={0} max={100} />\n</div>`,
      }}
      examples={
        <VStack gap={8}>
          <SliderWithNumberInputDemo />
          <SliderWithCustomRangeDemo />

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>States</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Default와 Disabled 상태 비교.
              </span>
            </VStack>
            <div className="flex flex-col gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <VStack gap={1}>
                <span className="text-body-xs text-[var(--color-text-subtle)]">Default</span>
                <Slider defaultValue={30} showValue />
              </VStack>
              <VStack gap={1}>
                <span className="text-body-xs text-[var(--color-text-subtle)]">Disabled</span>
                <Slider defaultValue={60} disabled showValue />
              </VStack>
            </div>
          </VStack>

          <RangeSliderDemo />
        </VStack>
      }
      guidelines={<SliderGuidelines />}
      tokens={
        <div className="text-body-sm text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
          <code>track: 6px height</code> · <code>thumb: 16px, 3px border</code> ·{' '}
          <code>fill: primary</code> · <code>--slider-track-width: 220px</code>
        </div>
      }
      apiReference={sliderProps}
      accessibility={
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <kbd>←</kbd> / <kbd>→</kbd>: step 단위로 값 조정
            </li>
            <li>
              <kbd>Home</kbd> / <kbd>End</kbd>: 최소/최대값으로 이동
            </li>
            <li>
              <kbd>Tab</kbd>: 포커스 이동
            </li>
            <li>Range Slider: 두 핸들 모두 키보드로 포커스 및 조작 가능</li>
          </ul>
        </Prose>
      }
      relatedLinks={[
        {
          label: 'Number Input',
          path: '/design/components/number-input',
          description: '정밀 값 입력을 위한 동반 컴포넌트',
        },
        {
          label: 'Form Field',
          path: '/design/patterns/form-field',
          description: '라벨, Helper Text 등 폼 필드 패턴',
        },
        { label: 'Select', path: '/design/components/select', description: '범위가 작을 때 대안' },
        {
          label: 'Date Picker',
          path: '/design/components/datepicker',
          description: '날짜·시간 선택 시 대안',
        },
      ]}
    />
  );
}
