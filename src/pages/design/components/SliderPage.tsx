import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Slider, RangeSlider, NumberInput, VStack } from '@/design-system';

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
      <Label>Pattern B: Slider + NumberInput</Label>
      <div className="flex items-center gap-3">
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
      <Label>Pattern B: Storage Capacity (0-1000 GiB)</Label>
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
    </VStack>
  );
}

function RangeSliderDemo() {
  const [minLength, setMinLength] = useState(8);
  const [maxLength, setMaxLength] = useState(64);

  return (
    <VStack gap={3}>
      <Label>Pattern D: RangeSlider + NumberInput 2개</Label>
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
            <Label>States</Label>
            <div className="flex flex-col gap-4">
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
      guidelines={
        <VStack gap={6}>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Variants</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        구분
                      </th>
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        사용 예시
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Slider + NumberInput
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        단일 값 선택 + 정밀 입력
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        스토리지(GiB), vCPU, 메모리
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        RangeSlider + NumberInput×2
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        min-max 범위 직접 정의
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        비밀번호 길이 정책, 포트 범위
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                Composition (구성 요소)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        요소
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Label
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">필드 라벨</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Track
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">슬라이더 배경 트랙</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Fill
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">선택된 구간 표시</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Thumb
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">드래그 가능한 핸들</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Min/Max Label
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">범위 라벨 (선택)</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        NumberInput
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">정밀 값 입력</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Unit Label
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">단위 표시 (GiB, % 등)</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Second Thumb
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">RangeSlider 전용</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Helper Text
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">도움말 텍스트</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-body-sm text-[var(--color-text-muted)] mt-3">
                Slider 트랙은 고정 220px이다.
              </p>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Design Tokens
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        값
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">track-width</td>
                      <td className="py-2 font-medium text-[var(--color-text-default)]">220px</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">track-height</td>
                      <td className="py-2 font-medium text-[var(--color-text-default)]">6px</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">thumb-size</td>
                      <td className="py-2 font-medium text-[var(--color-text-default)]">16px</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">thumb-border</td>
                      <td className="py-2 font-medium text-[var(--color-text-default)]">3px</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">fill-color</td>
                      <td className="py-2 font-medium text-[var(--color-text-default)]">primary</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">States</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        상태
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Default
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">기본 상태</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Hover
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">마우스 오버 시</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Focus
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">키보드 포커스 시</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Active Dragging
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">드래그 중</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Disabled
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">비활성화</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Error
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">에러 상태</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Read-only
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">읽기 전용</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Behavior</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        인터랙션
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        동작
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        트랙 클릭
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">클릭 위치로 값 이동</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        핸들 드래그
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">드래그로 값 조정</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        NumberInput 직접 입력
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">정밀 값 입력</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        ← / →
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">step 단위로 감소/증가</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Home
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">최소값으로 이동</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        End
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">최대값으로 이동</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-body-sm text-[var(--color-text-muted)] font-medium mt-4">
                Range Slider 추가 규칙
              </p>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>두 핸들 간 min &lt; max 관계를 유지한다.</li>
                <li>NumberInput 두 개와 양방향 동기화한다.</li>
                <li>한쪽 값 변경 시 다른 쪽의 min/max 제약을 반영한다.</li>
                <li>접근성: 두 핸들 모두 키보드로 포커스 및 조작 가능해야 한다.</li>
              </ul>
              <p className="text-body-sm text-[var(--color-text-muted)] font-medium mt-4">
                Number Input 연동
              </p>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>Slider와 NumberInput은 동일한 state를 공유한다.</li>
                <li>
                  Slider step은 빠른 조절용으로 크게, NumberInput step은 정밀 입력용으로 1을
                  권장한다.
                </li>
                <li>단위(GiB, % 등)가 있을 경우 NumberInput suffix 또는 인접 라벨로 표시한다.</li>
              </ul>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Usage Guidelines</h4>
              <p className="text-body-sm text-[var(--color-text-muted)] font-medium">Do ✅</p>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  넓은 범위(20개 이상) + 정밀 입력이 필요할 때 Slider + NumberInput 조합을 사용한다.
                </li>
                <li>FormField로 감싸 라벨과 Helper Text를 제공한다.</li>
                <li>
                  범위가 넓으면 Slider step을 크게(5, 10, 50) 설정하고 NumberInput step은 1로
                  유지한다.
                </li>
                <li>단위(GiB, %, vCPU 등)가 있으면 suffix 또는 인접 라벨로 명시한다.</li>
                <li>
                  min-max 범위를 사용자가 정의할 때는 RangeSlider + NumberInput 2개를 사용한다.
                </li>
                <li>트랙 너비는 고정 220px을 유지한다.</li>
              </ul>
              <p className="text-body-sm text-[var(--color-text-muted)] font-medium mt-2">
                Don&apos;t ❌
              </p>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>날짜·시간 선택에는 Slider를 사용하지 않는다 → DatePicker 사용.</li>
                <li>범위가 매우 크면(1–1000+) Slider 없이 NumberInput 단독 사용을 검토한다.</li>
                <li>범위가 매우 작으면(1–3) Select 사용을 검토한다.</li>
                <li>트랙 너비를 임의로 변경하지 않는다.</li>
                <li>Slider 단독으로 정밀 입력이 필요한 필드를 구성하지 않는다.</li>
              </ul>
            </VStack>
          </div>
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>track: 6px height</code> · <code>thumb: 16px, 3px border</code> ·{' '}
          <code>fill: primary</code> · <code>--slider-track-width: 220px</code>
        </div>
      }
      apiReference={sliderProps}
      accessibility={
        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
          <li>Arrow keys: Adjust value by step</li>
          <li>Home/End: Min/Max value</li>
          <li>Tab: Move focus</li>
        </ul>
      }
      relatedLinks={[
        { label: 'Number Input', path: '/design/components/input' },
        { label: 'Form Pattern', path: '/design/patterns/form-validation' },
      ]}
    />
  );
}
