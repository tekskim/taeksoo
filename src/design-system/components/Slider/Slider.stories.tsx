import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from './Slider';

/**
 * # Slider
 *
 * 범위 내에서 값을 선택하는 슬라이더 컴포넌트입니다.
 *
 * ## 언제 사용하나요?
 * - 볼륨, 밝기 등 연속적인 값 조절
 * - 가격 범위 필터
 * - 줌 레벨 조절
 * - 수량 선택
 *
 * ## 기능
 * - **min/max**: 최소/최대 값 설정
 * - **step**: 증가 단위 설정
 * - **showValue**: 현재 값 표시
 * - **formatValue**: 값 포맷팅 (%, px 등)
 * - **Controlled/Uncontrolled**: 두 가지 모드 지원
 *
 * ## 접근성
 * - `role="slider"` 적용
 * - `aria-valuemin`, `aria-valuemax`, `aria-valuenow` 속성
 * - 키보드 조작 지원 (Arrow, Home, End)
 * - `aria-label` 지원
 */
const meta = {
  title: 'Components/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '범위 내에서 값을 선택하는 슬라이더 컴포넌트입니다.',
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
    value: {
      control: { type: 'number' },
      description: '현재 값 (제어)',
    },
    defaultValue: {
      control: { type: 'number' },
      description: '기본 값 (비제어)',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    showValue: {
      control: 'boolean',
      description: '값 표시 여부',
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
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ----------------------------------------
   Basic Examples
   ---------------------------------------- */

export const Default: Story = {
  args: {
    min: 0,
    max: 100,
    defaultValue: 50,
    'aria-label': 'Default slider',
  },
};

export const WithValue: Story = {
  name: 'With Value Display',
  args: {
    min: 0,
    max: 100,
    defaultValue: 50,
    showValue: true,
    'aria-label': 'Slider with value',
  },
};

export const CustomRange: Story = {
  name: 'Custom Range (0-1000)',
  args: {
    min: 0,
    max: 1000,
    step: 50,
    defaultValue: 500,
    showValue: true,
    'aria-label': 'Custom range slider',
  },
};

export const SmallStep: Story = {
  name: 'Small Step (0.1)',
  args: {
    min: 0,
    max: 1,
    step: 0.1,
    defaultValue: 0.5,
    showValue: true,
    formatValue: (v) => v.toFixed(1),
    'aria-label': 'Small step slider',
  },
};

/* ----------------------------------------
   Formatted Values
   ---------------------------------------- */

export const PercentageFormat: Story = {
  name: 'Percentage Format',
  args: {
    min: 0,
    max: 100,
    defaultValue: 75,
    showValue: true,
    formatValue: (v) => `${v}%`,
    'aria-label': 'Percentage slider',
  },
};

export const PixelFormat: Story = {
  name: 'Pixel Format',
  args: {
    min: 0,
    max: 500,
    step: 10,
    defaultValue: 200,
    showValue: true,
    formatValue: (v) => `${v}px`,
    'aria-label': 'Pixel slider',
  },
};

export const CurrencyFormat: Story = {
  name: 'Currency Format',
  args: {
    min: 0,
    max: 1000,
    step: 10,
    defaultValue: 500,
    showValue: true,
    formatValue: (v) => `$${v}`,
    'aria-label': 'Currency slider',
  },
};

/* ----------------------------------------
   States
   ---------------------------------------- */

export const Disabled: Story = {
  args: {
    min: 0,
    max: 100,
    defaultValue: 30,
    disabled: true,
    showValue: true,
    'aria-label': 'Disabled slider',
  },
};

export const AtMinimum: Story = {
  name: 'At Minimum',
  args: {
    min: 0,
    max: 100,
    defaultValue: 0,
    showValue: true,
    'aria-label': 'Slider at minimum',
  },
};

export const AtMaximum: Story = {
  name: 'At Maximum',
  args: {
    min: 0,
    max: 100,
    defaultValue: 100,
    showValue: true,
    'aria-label': 'Slider at maximum',
  },
};

/* ----------------------------------------
   Controlled Example
   ---------------------------------------- */

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState(50);

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-4)] w-full">
        <Slider
          min={0}
          max={100}
          value={value}
          onChange={setValue}
          showValue
          aria-label="Controlled slider"
        />
        <div className="flex items-center gap-[var(--primitive-spacing-2)]">
          <button
            onClick={() => setValue(0)}
            className="px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]"
          >
            Min
          </button>
          <button
            onClick={() => setValue(50)}
            className="px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]"
          >
            50%
          </button>
          <button
            onClick={() => setValue(100)}
            className="px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] text-body-sm bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-sm)] hover:bg-[var(--color-surface-hover)]"
          >
            Max
          </button>
          <span className="text-body-md text-[var(--color-text-subtle)] ml-auto">
            Current: {value}
          </span>
        </div>
      </div>
    );
  },
};

/* ----------------------------------------
   Use Cases
   ---------------------------------------- */

export const VolumeControl: Story = {
  name: 'Use Case - Volume Control',
  render: () => {
    const [volume, setVolume] = useState(70);

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-2)] w-full">
        <label className="text-label-lg text-[var(--color-text-default)]">Volume</label>
        <Slider
          min={0}
          max={100}
          value={volume}
          onChange={setVolume}
          showValue
          formatValue={(v) => `${v}%`}
          aria-label="Volume control"
        />
      </div>
    );
  },
};

export const BrightnessControl: Story = {
  name: 'Use Case - Brightness',
  render: () => {
    const [brightness, setBrightness] = useState(80);

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-2)] w-full">
        <label className="text-label-lg text-[var(--color-text-default)]">Brightness</label>
        <Slider
          min={10}
          max={100}
          value={brightness}
          onChange={setBrightness}
          showValue
          formatValue={(v) => `${v}%`}
          aria-label="Brightness control"
        />
      </div>
    );
  },
};

export const PriceFilter: Story = {
  name: 'Use Case - Price Filter',
  render: () => {
    const [maxPrice, setMaxPrice] = useState(500);

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-2)] w-full">
        <div className="flex justify-between text-body-md">
          <span className="text-label-lg">Max Price</span>
          <span className="text-[var(--color-text-subtle)]">${maxPrice}</span>
        </div>
        <Slider
          min={0}
          max={1000}
          step={50}
          value={maxPrice}
          onChange={setMaxPrice}
          aria-label="Maximum price filter"
        />
        <div className="flex justify-between text-body-sm text-[var(--color-text-subtle)]">
          <span>$0</span>
          <span>$1,000</span>
        </div>
      </div>
    );
  },
};

export const ZoomLevel: Story = {
  name: 'Use Case - Zoom Level',
  render: () => {
    const [zoom, setZoom] = useState(100);

    return (
      <div className="flex items-center gap-[var(--primitive-spacing-3)] w-full">
        <button
          onClick={() => setZoom(Math.max(25, zoom - 25))}
          className="p-[var(--primitive-spacing-1)] text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]"
        >
          −
        </button>
        <Slider
          min={25}
          max={200}
          step={25}
          value={zoom}
          onChange={setZoom}
          showValue
          formatValue={(v) => `${v}%`}
          aria-label="Zoom level"
        />
        <button
          onClick={() => setZoom(Math.min(200, zoom + 25))}
          className="p-[var(--primitive-spacing-1)] text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]"
        >
          +
        </button>
      </div>
    );
  },
};

/* ----------------------------------------
   Multiple Sliders
   ---------------------------------------- */

export const MultipleSliders: Story = {
  name: 'Multiple Sliders',
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-6)] w-full">
      <div className="flex flex-col gap-[var(--primitive-spacing-2)]">
        <label className="text-label-lg text-[var(--color-text-default)]">Red</label>
        <Slider min={0} max={255} defaultValue={128} showValue aria-label="Red channel" />
      </div>
      <div className="flex flex-col gap-[var(--primitive-spacing-2)]">
        <label className="text-label-lg text-[var(--color-text-default)]">Green</label>
        <Slider min={0} max={255} defaultValue={200} showValue aria-label="Green channel" />
      </div>
      <div className="flex flex-col gap-[var(--primitive-spacing-2)]">
        <label className="text-label-lg text-[var(--color-text-default)]">Blue</label>
        <Slider min={0} max={255} defaultValue={64} showValue aria-label="Blue channel" />
      </div>
    </div>
  ),
};
