import type { ChangeEvent, FocusEvent, PointerEvent } from 'react';
import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../../services/utils/cn';
import {
  dualRangeContainerStyles,
  dualRangeInputStyles,
  inputWrapperStyles,
  rangeContainerStyles,
  rangeInputStyles,
  trackActiveStyles,
  trackStyles,
} from './Range.styles';

import {
  applyStepToValue,
  clampValue,
  getClosestThumbFromEvent,
  getPointerValueFromRect,
  parseStepAttribute,
  type ThumbType,
} from './helpers';

interface SingleRangeProps {
  /** 듀얼 모드 비활성화 */
  dual?: false;
  /** 현재 값 (controlled) */
  value?: number;
  /** 기본 값 (uncontrolled) */
  defaultValue?: number;
  /** 값 변경 핸들러 */
  onChange?: (value: number) => void;
  /** 드래그/키보드 조작 종료 시점 값 변경 핸들러 */
  onChangeEnd?: (value: number) => void;
}

interface DualRangeProps {
  /** 듀얼 모드 활성화 */
  dual: true;
  /** 현재 값 범위 [시작, 끝] (controlled) */
  value?: [number, number];
  /** 기본 값 범위 [시작, 끝] (uncontrolled) */
  defaultValue?: [number, number];
  /** 값 변경 핸들러 */
  onChange?: (value: [number, number]) => void;
  /** 드래그/키보드 조작 종료 시점 값 변경 핸들러 */
  onChangeEnd?: (value: [number, number]) => void;
}

interface CommonProps {
  /** 추가 CSS 클래스명 */
  className?: string;
  /** 컴포넌트 너비 */
  width?: CSSProperties['width'];
  /** 최소값 */
  min?: number;
  /** 최대값 */
  max?: number;
  /** 비활성화 상태 */
  disabled?: boolean;
}

type Props = CommonProps & (SingleRangeProps | DualRangeProps);

/**
 * Range 컴포넌트 - 값을 선택할 수 있는 슬라이더
 *
 * @param props.className - 추가 CSS 클래스명
 * @param props.width - 컴포넌트 너비
 * @param props.min - 최소값
 * @param props.max - 최대값
 * @param props.dual - 듀얼 모드 활성화 (양쪽 끝 조절 가능)
 * @param props.value - 현재 값 (controlled) - dual=true일 때는 [number, number]
 * @param props.defaultValue - 기본 값 (uncontrolled) - dual=true일 때는 [number, number]
 * @param props.onChange - 값 변경 핸들러 - dual=true일 때는 (value: [number, number]) => void
 * @param props.onChangeEnd - 조작 종료 값 변경 핸들러 - dual=true일 때는 (value: [number, number]) => void
 * @param props.disabled - 비활성화 상태
 * @returns Range UI 컴포넌트
 */
const Range = (props: Props) => {
  const {
    className,
    width,
    min = 0,
    max = 100,
    disabled = false,
    dual,
    value,
    defaultValue,
    onChange,
    onChangeEnd,
  } = props;

  // 싱글 모드 상태 (dual=true일 때는 사용되지 않지만 Hook 규칙을 위해 항상 호출)
  const [internalValue, setInternalValue] = useState(
    !dual ? (defaultValue ?? 0) : 0
  );

  const handleSingleChange = useCallback(
    (newValue: number) => {
      if (!dual && value === undefined) {
        setInternalValue(newValue);
      }
      if (!dual) {
        onChange?.(newValue);
      }
    },
    [dual, value, onChange]
  );

  const handleSingleChangeEnd = useCallback(
    (newValue: number) => {
      if (!dual) {
        onChangeEnd?.(newValue);
      }
    },
    [dual, onChangeEnd]
  );

  if (dual) {
    return (
      <DualRangeMode
        className={className}
        width={width}
        min={min}
        max={max}
        value={value}
        defaultValue={defaultValue ?? [min, max]}
        onChange={onChange}
        onChangeEnd={onChangeEnd}
        disabled={disabled}
      />
    );
  }

  // 싱글 모드
  const isControlled = value !== undefined;
  const currentValue = (isControlled ? value : internalValue) as number;

  return (
    <div
      className={cn(rangeContainerStyles({ disabled }), className)}
      style={{ width }}
    >
      <SingleRangeInput
        min={min}
        max={max}
        value={currentValue}
        onChange={handleSingleChange}
        onChangeEnd={handleSingleChangeEnd}
        disabled={disabled}
      />
    </div>
  );
};

/**
 * 싱글 Range Input - 재사용 가능한 input 요소
 */
const SingleRangeInput = ({
  min,
  max,
  value,
  onChange,
  onChangeEnd,
  disabled,
  thumbType,
  isDual = false,
}: {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  disabled: boolean;
  thumbType?: ThumbType;
  isDual?: boolean;
}) => {
  const lastCommittedValueRef = useRef<number | null>(null);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(Number(event.target.value));
    },
    [onChange]
  );

  const commit = useCallback(
    (nextValue: number) => {
      if (!onChangeEnd) {
        return;
      }

      if (lastCommittedValueRef.current === nextValue) {
        return;
      }

      lastCommittedValueRef.current = nextValue;
      onChangeEnd(nextValue);
    },
    [onChangeEnd]
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      commit(Number(event.currentTarget.value));
    },
    [commit]
  );

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLInputElement>) => {
      if (disabled) {
        return;
      }

      commit(Number(event.currentTarget.value));
    },
    [commit, disabled]
  );

  const handlePointerCancel = useCallback(
    (event: PointerEvent<HTMLInputElement>) => {
      if (disabled) {
        return;
      }

      commit(Number(event.currentTarget.value));
    },
    [commit, disabled]
  );

  const rangeSpan = max - min;
  const percentage = rangeSpan === 0 ? 0 : ((value - min) / rangeSpan) * 100;

  return (
    <input
      type="range"
      className={isDual ? dualRangeInputStyles : rangeInputStyles}
      min={min}
      max={max}
      value={value}
      onChange={handleChange}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onBlur={handleBlur}
      disabled={disabled}
      style={{ '--range-progress': `${percentage}%` } as CSSProperties}
      data-thumb-type={thumbType}
    />
  );
};

/**
 * 듀얼 Range 모드 컴포넌트 - SingleRangeMode를 두 개 겹쳐서 구현
 */
const DualRangeMode = ({
  className,
  width,
  min,
  max,
  value,
  defaultValue,
  onChange,
  onChangeEnd,
  disabled,
}: {
  className?: string;
  width?: CSSProperties['width'];
  min: number;
  max: number;
  value?: [number, number];
  defaultValue: [number, number];
  onChange?: (value: [number, number]) => void;
  onChangeEnd?: (value: [number, number]) => void;
  disabled: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [internalValue, setInternalValue] =
    useState<[number, number]>(defaultValue);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const [minValue, maxValue] = currentValue;
  const valueRef = useRef<[number, number]>(currentValue);
  const lastCommittedValueRef = useRef<string | null>(null);

  useEffect(() => {
    valueRef.current = currentValue;
  }, [currentValue]);

  const getSteppedValue = useCallback(
    (rawValue: number, thumb: ThumbType) => {
      const container = containerRef.current;

      if (!container) {
        return clampValue(rawValue, min, max);
      }

      const inputElement = container.querySelector<HTMLInputElement>(
        `input[data-thumb-type="${thumb}"]`
      );

      if (!inputElement) {
        return clampValue(rawValue, min, max);
      }

      const stepValue = parseStepAttribute(inputElement.step);

      return applyStepToValue(rawValue, min, max, stepValue);
    },
    [max, min]
  );

  const handleMinChange = useCallback(
    (newMin: number) => {
      const validMin = Math.min(newMin, maxValue);
      const newValue: [number, number] = [validMin, maxValue];

      if (validMin === minValue) {
        return;
      }

      valueRef.current = newValue;

      if (!isControlled) {
        setInternalValue(newValue);
      }

      onChange?.(newValue);
    },
    [isControlled, maxValue, minValue, onChange]
  );

  const handleMaxChange = useCallback(
    (newMax: number) => {
      const validMax = Math.max(newMax, minValue);
      const newValue: [number, number] = [minValue, validMax];

      if (validMax === maxValue) {
        return;
      }

      valueRef.current = newValue;

      if (!isControlled) {
        setInternalValue(newValue);
      }

      onChange?.(newValue);
    },
    [isControlled, maxValue, minValue, onChange]
  );

  const minPercentage = ((minValue - min) / (max - min)) * 100;
  const maxPercentage = ((maxValue - min) / (max - min)) * 100;

  const pointerIdRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const pendingPointerRef = useRef<{
    clientX: number;
    thumb: ThumbType;
  } | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const [activeThumb, setActiveThumb] = useState<ThumbType | null>(null);

  const releasePointerCapture = useCallback(() => {
    const container = containerRef.current;
    const pointerId = pointerIdRef.current;

    if (
      container &&
      pointerId !== null &&
      typeof container.releasePointerCapture === 'function'
    ) {
      try {
        if (container.hasPointerCapture?.(pointerId)) {
          container.releasePointerCapture(pointerId);
        }
      } catch {
        // Ignore environments that partially support pointer capture APIs.
      }
    }

    pointerIdRef.current = null;
    setActiveThumb(null);
  }, []);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const applyPointer = useCallback(
    (clientX: number, thumb: ThumbType) => {
      const container = containerRef.current;
      const rect = rectRef.current ?? container?.getBoundingClientRect();

      if (!container || !rect) {
        return;
      }
      const pointerValue = getPointerValueFromRect(rect, clientX, min, max);

      if (pointerValue === null) {
        return;
      }

      const nextValue = getSteppedValue(pointerValue, thumb);

      if (thumb === 'min') {
        handleMinChange(nextValue);
      } else {
        handleMaxChange(nextValue);
      }
    },
    [getSteppedValue, handleMaxChange, handleMinChange, max, min]
  );

  const scheduleApplyPointer = useCallback(
    (clientX: number, thumb: ThumbType) => {
      pendingPointerRef.current = { clientX, thumb };

      if (rafIdRef.current !== null) {
        return;
      }

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;

        if (!pendingPointerRef.current) {
          return;
        }

        const pending = pendingPointerRef.current;
        pendingPointerRef.current = null;
        applyPointer(pending.clientX, pending.thumb);
      });
    },
    [applyPointer]
  );

  const commitValue = useCallback(() => {
    if (!onChangeEnd) {
      return;
    }

    const [currentMin, currentMax] = valueRef.current;
    const key = `${currentMin}|${currentMax}`;

    if (lastCommittedValueRef.current === key) {
      return;
    }

    lastCommittedValueRef.current = key;
    onChangeEnd([currentMin, currentMax]);
  }, [onChangeEnd]);

  const handlePointerDownCapture = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (disabled || event.button !== 0) {
        return;
      }

      const container = containerRef.current;

      if (!container) {
        return;
      }

      const rect = container.getBoundingClientRect();
      rectRef.current = rect;
      const pointerValue = getPointerValueFromRect(
        rect,
        event.clientX,
        min,
        max
      );

      if (pointerValue === null) {
        return;
      }

      const closestThumb = getClosestThumbFromEvent(
        event.target,
        pointerValue,
        minValue,
        maxValue
      );

      event.preventDefault();
      event.stopPropagation();

      setActiveThumb(closestThumb);
      pointerIdRef.current = event.pointerId;
      pendingPointerRef.current = null;

      if (typeof container.setPointerCapture === 'function') {
        try {
          container.setPointerCapture(event.pointerId);
        } catch {
          // Ignore environments that do not support pointer capture APIs.
        }
      }

      applyPointer(event.clientX, closestThumb);

      const focusTarget = container.querySelector<HTMLInputElement>(
        `input[data-thumb-type="${closestThumb}"]`
      );

      focusTarget?.focus();
    },
    [applyPointer, disabled, maxValue, minValue, max, min]
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (
        disabled ||
        pointerIdRef.current !== event.pointerId ||
        !activeThumb
      ) {
        return;
      }

      scheduleApplyPointer(event.clientX, activeThumb);
    },
    [activeThumb, disabled, scheduleApplyPointer]
  );

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (disabled) {
        return;
      }

      if (pointerIdRef.current === event.pointerId) {
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
          const pending = pendingPointerRef.current;
          pendingPointerRef.current = null;

          if (pending) {
            applyPointer(pending.clientX, pending.thumb);
          }
        }

        rectRef.current = null;
        releasePointerCapture();
        commitValue();
      }
    },
    [applyPointer, commitValue, disabled, releasePointerCapture]
  );

  const handlePointerCancel = useCallback(() => {
    if (disabled) {
      return;
    }

    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
      const pending = pendingPointerRef.current;
      pendingPointerRef.current = null;

      if (pending) {
        applyPointer(pending.clientX, pending.thumb);
      }
    }

    rectRef.current = null;
    releasePointerCapture();
    commitValue();
  }, [applyPointer, commitValue, disabled, releasePointerCapture]);

  const handleBlurCapture = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      if (!onChangeEnd) {
        return;
      }

      const container = containerRef.current;

      if (!container) {
        return;
      }

      const nextFocused = event.relatedTarget;

      if (nextFocused instanceof Node && container.contains(nextFocused)) {
        return;
      }

      commitValue();
    },
    [commitValue, onChangeEnd]
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        rangeContainerStyles({ disabled }),
        dualRangeContainerStyles({ disabled }),
        className
      )}
      onPointerDownCapture={handlePointerDownCapture}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onBlurCapture={handleBlurCapture}
      style={{ width }}
    >
      <div className={trackStyles}>
        <div
          className={trackActiveStyles}
          style={{
            left: `${minPercentage}%`,
            right: `${100 - maxPercentage}%`,
          }}
        />
      </div>
      <div
        className={cn(
          inputWrapperStyles({ type: activeThumb === 'min' ? 'max' : 'min' }),
          'hover:z-[3] active:z-[4]'
        )}
      >
        <SingleRangeInput
          min={min}
          max={max}
          value={minValue}
          onChange={handleMinChange}
          disabled={disabled}
          thumbType="min"
          isDual
        />
      </div>
      <div
        className={cn(
          inputWrapperStyles({ type: activeThumb === 'max' ? 'max' : 'min' }),
          'hover:z-[3] active:z-[4]'
        )}
      >
        <SingleRangeInput
          min={min}
          max={max}
          value={maxValue}
          onChange={handleMaxChange}
          disabled={disabled}
          thumbType="max"
          isDual
        />
      </div>
    </div>
  );
};

export default Range;
