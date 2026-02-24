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
      description="Draggable slider for selecting values within a range"
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
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={6}>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">패턴 선택 기준</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        질문
                      </th>
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        예
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        아니오
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        사용자가 값을 미리 알고 있는가?
                      </td>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        NumberInput 단독
                      </td>
                      <td className="py-2 text-[var(--color-text-subtle)]">다음 질문 →</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        명확한 min~max 범위가 있는가?
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-subtle)]">다음 질문 →</td>
                      <td className="py-2 font-medium text-[var(--color-text-default)]">
                        NumberInput 단독
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        정확한 값 입력이 필요한가?
                      </td>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Slider + NumberInput
                      </td>
                      <td className="py-2 font-medium text-[var(--color-text-default)]">
                        Slider + NumberInput
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        min~max 범위 자체를 정의하는가?
                      </td>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        RangeSlider + NumberInput ×2
                      </td>
                      <td className="py-2 text-[var(--color-text-subtle)]">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">3가지 패턴</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        패턴
                      </th>
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        사용 조건
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        적용 대상
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        A. NumberInput 단독
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        값을 미리 알고 있거나 범위가 좁음 (~20개)
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        포트 번호, 레플리카 수, Parallelism
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        B. Slider + NumberInput
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        넓은 범위 + 정밀 입력 + 위치 인지 필요
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        스토리지(GiB), vCPU, 메모리, 디스크
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        C. RangeSlider + NumberInput ×2
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        min~max 범위 자체를 사용자가 정의
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        비밀번호 길이 정책, 포트 범위
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Slider 트랙 너비</h4>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                Slider 트랙은 고정 220px입니다. 별도의 max-width 래퍼 없이 Slider 컴포넌트만
                배치하면 됩니다.
              </p>
              <div className="text-body-xs text-[var(--color-text-subtle)] p-2 bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)]">
                <code>--slider-track-width: 220px</code>
              </div>
            </VStack>
          </VStack>
        </div>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>track: 6px height</code> · <code>thumb: 16px, 3px border</code> ·{' '}
          <code>fill: primary</code>
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
        { label: 'Input', path: '/design/components/input', description: 'NumberInput component' },
        {
          label: 'Form Field Spacing',
          path: '/design/components/form-field',
          description: 'Label and input combinations',
        },
        { label: 'Toggle', path: '/design/components/toggle', description: 'On/Off switch' },
      ]}
    />
  );
}
