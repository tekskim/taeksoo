import { useState, type ReactNode } from 'react';
import { twMerge } from '../../utils/cn';
import { Tooltip } from '../Tooltip';
import { StatusIndicator, type StatusType } from '../StatusIndicator';
import { IconInfoCircle, IconCopy, IconCheck } from '@tabler/icons-react';

/* ----------------------------------------
   InfoBox Types
   ---------------------------------------- */

export interface InfoBoxProps {
  /** 라벨 */
  label: string;
  /** 값 (텍스트 또는 ReactNode) */
  value?: ReactNode;
  /** 복잡한 값은 children으로 */
  children?: ReactNode;
  /** 라벨 옆 tooltip 텍스트 (info 아이콘 표시) */
  tooltip?: string;
  /** 값 복사 버튼 표시 (string value만 지원) */
  copyable?: boolean;
  /** 우측 StatusIndicator 표시 */
  status?: StatusType;
  /** 추가 CSS 클래스 */
  className?: string;
}

export interface InfoBoxGroupProps {
  /** InfoBox 항목들 */
  children: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}

/* ----------------------------------------
   InfoBox Component
   ---------------------------------------- */

export function InfoBox({
  label,
  value,
  children,
  tooltip,
  copyable = false,
  status,
  className = '',
}: InfoBoxProps) {
  const [copied, setCopied] = useState(false);
  const isStringValue = typeof value === 'string';

  const handleCopy = () => {
    if (isStringValue) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderValue = () => {
    if (children) return children;
    if (value == null) return null;
    if (isStringValue) {
      return (
        <span className="text-body-md text-[var(--color-text-default)] truncate" title={value}>
          {value}
        </span>
      );
    }
    return <span className="text-body-md text-[var(--color-text-default)]">{value}</span>;
  };

  return (
    <div
      data-figma-name="InfoBox"
      className={twMerge(
        'w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)] relative min-w-0',
        className
      )}
    >
      {status && (
        <div className="absolute top-1/2 right-3 -translate-y-1/2">
          <StatusIndicator status={status} layout="icon-only" size="md" />
        </div>
      )}

      <div className={twMerge('flex flex-col gap-[6px] min-w-0', status && 'pr-6')}>
        <div className="flex items-center gap-[4px]">
          <span className="text-label-sm text-[var(--color-text-subtle)] whitespace-nowrap">
            {label}
          </span>
          {tooltip && (
            <Tooltip content={tooltip}>
              <IconInfoCircle size={14} className="text-[var(--color-text-subtle)]" />
            </Tooltip>
          )}
        </div>
        {(renderValue() !== null || (copyable && isStringValue)) && (
          <div className="flex items-center gap-1 min-w-0">
            {renderValue()}
            {copyable && isStringValue && (
              <button
                onClick={handleCopy}
                className="shrink-0 p-0.5 rounded hover:bg-[var(--color-surface-default)] transition-colors"
                aria-label="Copy to clipboard"
              >
                {copied ? (
                  <IconCheck size={12} className="text-[var(--color-state-success)]" />
                ) : (
                  <IconCopy size={12} className="text-[var(--color-action-primary)]" />
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------
   InfoBox.Group Component
   ---------------------------------------- */

function InfoBoxGroup({ children, className = '' }: InfoBoxGroupProps) {
  return <div className={`flex flex-col gap-[12px] ${className}`.trim()}>{children}</div>;
}

InfoBox.Group = InfoBoxGroup;
