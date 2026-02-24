import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RangeSlider } from './RangeSlider';
import { NumberInput } from '../Input/NumberInput';
import { HStack } from '../../layouts';

/**
 * # RangeSlider
 *
 * 두 개의 thumb으로 min~max 범위를 선택하는 슬라이더 컴포넌트입니다.
 *
 * ## 언제 사용하나요?
 * - 가격, 용량, 길이 등의 범위를 지정할 때
 * - min~max 값을 동시에 조정해야 할 때
 * - 비밀번호 길이 정책, 포트 범위 등
 *
 * ## 기능
 * - **두 개의 Thumb**: min/max 값을 독립적으로 조절
 * - **min/max/step**: 범위와 증가 단위 설정
 * - **Controlled/Uncontrolled**: 두 가지 모드 지원
 * - **Track fill**: 두 thumb 사이가 채워짐
 *
 * ## 접근성
 * - 각 thumb에 `role="slider"` 적용
 * - `aria-valuemin`, `aria-valuemax`, `aria-valuenow` 속성
 * - 키보드 조작 지원 (Arrow, Home, End)
 * - 각 thumb에 고유한 `aria-label` 적용
 */
const meta = {
  title: 'Components/RangeSlider',
  component: RangeSlider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '두 개의 thumb으로 min~max 범위를 선택하는 슬라이더 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    min: {
      control: { type: 'number' },
      description: '최소 값',
    },
    max: {
      control: { type: 'number' },
      description: '최대 값',
    },
    step: {
      control: { type: 'number' },
      description: '증가 단위',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    'aria-label': {
      control: 'text',
      description: '접근성 라벨',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RangeSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ----------------------------------------
   Basic Examples
   ---------------------------------------- */

export const Default: Story = {
  args: {
    min: 0,
    max: 100,
    defaultValue: [25, 75],
    'aria-label': 'Default range slider',
  },
};

export const CustomRange: Story = {
  name: 'Custom Range (0–1000)',
  args: {
    min: 0,
    max: 1000,
    step: 50,
    defaultValue: [200, 800],
    'aria-label': 'Custom range slider',
  },
};

export const SmallStep: Story = {
  name: 'Small Step (0.1)',
  args: {
    min: 0,
    max: 1,
    step: 0.1,
    defaultValue: [0.2, 0.8],
    'aria-label': 'Small step range slider',
  },
};

/* ----------------------------------------
   States
   ---------------------------------------- */

export const Disabled: Story = {
  args: {
    min: 0,
    max: 100,
    defaultValue: [20, 60],
    disabled: true,
    'aria-label': 'Disabled range slider',
  },
};

export const FullRange: Story = {
  name: 'Full Range',
  args: {
    min: 0,
    max: 100,
    defaultValue: [0, 100],
    'aria-label': 'Full range slider',
  },
};

export const NarrowRange: Story = {
  name: 'Narrow Range',
  args: {
    min: 0,
    max: 100,
    defaultValue: [45, 55],
    'aria-label': 'Narrow range slider',
  },
};

/* ----------------------------------------
   Controlled Example
   ---------------------------------------- */

export const Controlled: Story = {
  render: function ControlledExample() {
    const [value, setValue] = useState<[number, number]>([25, 75]);

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-4)] w-full">
        <RangeSlider
          min={0}
          max={100}
          value={value}
          onChange={setValue}
          aria-label="Controlled range slider"
        />
        <div className="flex justify-between text-body-md text-[var(--color-text-subtle)]">
          <span>Min: {value[0]}</span>
          <span>Max: {value[1]}</span>
        </div>
        <div className="flex items-center gap-[var(--primitive-spacing-2)]">
          <button
            onClick={() => setValue([0, 100])}
            className="px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]"
          >
            Reset
          </button>
          <button
            onClick={() => setValue([25, 75])}
            className="px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]"
          >
            25–75
          </button>
          <button
            onClick={() => setValue([40, 60])}
            className="px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]"
          >
            40–60
          </button>
        </div>
      </div>
    );
  },
};

/* ----------------------------------------
   Use Cases
   ---------------------------------------- */

export const PasswordLengthPolicy: Story = {
  name: 'Use Case — Password Length Policy',
  render: function PasswordLengthExample() {
    const [range, setRange] = useState<[number, number]>([8, 64]);

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-3)] w-full">
        <label className="text-label-lg text-[var(--color-text-default)]">Password Length</label>
        <HStack gap={3} align="center">
          <NumberInput
            min={4}
            max={range[1]}
            value={range[0]}
            onChange={(v) => setRange([v, range[1]])}
            width="xs"
          />
          <RangeSlider
            min={4}
            max={128}
            value={range}
            onChange={setRange}
            aria-label="Password length range"
          />
          <NumberInput
            min={range[0]}
            max={128}
            value={range[1]}
            onChange={(v) => setRange([range[0], v])}
            width="xs"
          />
        </HStack>
        <span className="text-body-sm text-[var(--color-text-subtle)]">
          Allowed length: {range[0]}–{range[1]} characters
        </span>
      </div>
    );
  },
};

export const PriceRangeFilter: Story = {
  name: 'Use Case — Price Range Filter',
  render: function PriceRangeExample() {
    const [range, setRange] = useState<[number, number]>([100, 500]);

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-3)] w-full">
        <div className="flex justify-between">
          <label className="text-label-lg text-[var(--color-text-default)]">Price Range</label>
          <span className="text-body-md text-[var(--color-text-subtle)]">
            ${range[0]} – ${range[1]}
          </span>
        </div>
        <RangeSlider
          min={0}
          max={1000}
          step={10}
          value={range}
          onChange={setRange}
          aria-label="Price range filter"
        />
        <div className="flex justify-between text-body-sm text-[var(--color-text-subtle)]">
          <span>$0</span>
          <span>$1,000</span>
        </div>
      </div>
    );
  },
};

export const PortRange: Story = {
  name: 'Use Case — Port Range',
  render: function PortRangeExample() {
    const [range, setRange] = useState<[number, number]>([8000, 9000]);

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-3)] w-full">
        <label className="text-label-lg text-[var(--color-text-default)]">Port Range</label>
        <HStack gap={3} align="center">
          <NumberInput
            min={1}
            max={range[1]}
            value={range[0]}
            onChange={(v) => setRange([v, range[1]])}
            width="xs"
          />
          <RangeSlider
            min={1}
            max={65535}
            step={100}
            value={range}
            onChange={setRange}
            aria-label="Port range"
          />
          <NumberInput
            min={range[0]}
            max={65535}
            value={range[1]}
            onChange={(v) => setRange([range[0], v])}
            width="xs"
          />
        </HStack>
      </div>
    );
  },
};
