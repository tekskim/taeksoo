import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react';

export interface ChainedSelectSegment {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

export interface ChainedSelectProps {
  segments: ChainedSelectSegment[];
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function ChainedSelect({
  segments,
  values,
  onChange,
  className = '',
  disabled = false,
  fullWidth = false,
}: ChainedSelectProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getFirstEmptyIndex = useCallback((): number => {
    for (let i = 0; i < segments.length; i++) {
      if (!values[segments[i].key]) return i;
    }
    return -1;
  }, [segments, values]);

  const isSegmentClickable = (index: number): boolean => {
    if (disabled) return false;
    if (index === 0) return true;
    for (let i = 0; i < index; i++) {
      if (!values[segments[i].key]) return false;
    }
    return true;
  };

  const handleSegmentClick = (index: number) => {
    if (!isSegmentClickable(index)) return;
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleOptionSelect = (segmentKey: string, value: string, index: number) => {
    const updated = { ...values, [segmentKey]: value };
    for (let i = index + 1; i < segments.length; i++) {
      delete updated[segments[i].key];
    }
    onChange(updated);
    setOpenIndex(null);

    const nextEmpty = index + 1;
    if (nextEmpty < segments.length) {
      requestAnimationFrame(() => {
        segmentRefs.current[nextEmpty]?.focus();
        setOpenIndex(nextEmpty);
      });
    }
  };

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    if (e.key === 'Escape') {
      setOpenIndex(null);
      segmentRefs.current[index]?.focus();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative ${fullWidth ? 'flex w-full' : 'inline-flex'} ${className}`}
    >
      <div
        className={`flex items-center gap-1 border rounded-[var(--radius-md)] p-1 h-[32px] ${fullWidth ? 'w-full' : ''} ${
          disabled
            ? 'border-[var(--color-border-default)] bg-[var(--color-surface-muted)] cursor-not-allowed'
            : 'border-[var(--color-border-strong)] bg-[var(--color-surface-default)]'
        }`}
      >
        {segments.map((segment, index) => {
          const hasValue = !!values[segment.key];
          const clickable = isSegmentClickable(index);
          const isOpen = openIndex === index;
          const selectedOption = segment.options.find((o) => o.value === values[segment.key]);

          return (
            <div
              key={segment.key}
              className={fullWidth ? 'flex items-center flex-1 min-w-0' : 'contents'}
            >
              {index > 0 && (
                <span className="text-body-md text-[var(--color-text-default)] select-none shrink-0">
                  :
                </span>
              )}
              <div className={`relative ${fullWidth ? 'flex-1 min-w-0' : ''}`}>
                <button
                  ref={(el) => {
                    segmentRefs.current[index] = el;
                  }}
                  type="button"
                  onClick={() => handleSegmentClick(index)}
                  disabled={!clickable}
                  className={`flex items-center gap-1 px-[5px] py-1 rounded-[3px] ${fullWidth ? 'w-full' : 'w-[120px]'} text-body-md transition-colors duration-[var(--duration-fast)] ${
                    isOpen
                      ? 'bg-[var(--color-surface-muted)]'
                      : clickable
                        ? 'hover:bg-[var(--color-surface-subtle)]'
                        : ''
                  } ${
                    hasValue
                      ? 'text-[var(--color-text-default)]'
                      : 'text-[var(--color-text-disabled)]'
                  } ${!clickable ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                  <span className="flex-1 text-left truncate">
                    {selectedOption?.label ?? segment.label}
                  </span>
                </button>

                {isOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 mt-1 z-50 min-w-[160px] max-h-[200px] overflow-y-auto bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] shadow-lg py-1"
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  >
                    {segment.options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleOptionSelect(segment.key, option.value, index)}
                        className={`w-full text-left px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md transition-colors duration-[var(--duration-fast)] ${
                          values[segment.key] === option.value
                            ? 'bg-[var(--color-action-primary-subtle)] text-[var(--color-action-primary)] font-medium'
                            : 'text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)]'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
