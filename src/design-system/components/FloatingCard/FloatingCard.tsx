import { type HTMLAttributes, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from '../../utils/cn';
import {
  IconX,
  IconChevronRight,
  IconChevronDown,
  IconTarget,
  IconAlertTriangle,
  IconCheck,
} from '@tabler/icons-react';
import { Button, NumberInput, ProgressBar } from '@/design-system';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type FloatingCardPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type SectionStatus = 'processing' | 'warning' | 'success' | 'default';

export interface SectionItem {
  id: string;
  title: string;
  status: SectionStatus;
  onClick?: () => void;
}

export interface QuotaItem {
  label: string;
  current: number;
  total: number;
  unit?: string;
}

export interface FloatingCardSection {
  tabTitle: string;
  items: SectionItem[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
  showSuccessIcon?: boolean;
  showChevron?: boolean;
}

export interface FloatingCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  title: string; // Required for Summary section
  sections?: FloatingCardSection[];
  quota?: QuotaItem[];
  instanceCount?: number;
  onInstanceCountChange?: (count: number) => void;
  cancelLabel?: string;
  actionLabel?: string;
  actionEnabled?: boolean;
  onCancel?: () => void;
  onAction?: () => void;
  position?: FloatingCardPosition;
  showCloseButton?: boolean;
  onClose?: () => void;
  isOpen?: boolean;
  zIndex?: number;
  portal?: boolean;
  width?: string;
}

/* ----------------------------------------
   Position Styles
   ---------------------------------------- */

const positionStyles: Record<FloatingCardPosition, string> = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
};

/* ----------------------------------------
   Status Icon Component
   ---------------------------------------- */

function StatusIcon({ status }: { status: SectionStatus }) {
  switch (status) {
    case 'success':
      return (
        <div className="size-4 rounded-full border border-[var(--color-state-success)] bg-[var(--color-state-success)] shrink-0 flex items-center justify-center">
          <IconCheck size={10} stroke={2} className="text-white" />
        </div>
      );
    case 'warning':
      return (
        <div className="size-4 rounded-full border border-[var(--color-state-danger)] bg-[var(--color-state-danger)] shrink-0 flex items-center justify-center">
          <IconAlertTriangle size={10} stroke={2} className="text-white" />
        </div>
      );
    case 'processing':
      return (
        <div
          className="size-4 rounded-full border border-[var(--color-text-muted)] shrink-0 animate-spin"
          style={{ borderStyle: 'dashed', animationDuration: '2s' }}
        />
      );
    default:
      return (
        <div
          className="size-4 rounded-full border border-[var(--color-border-default)] shrink-0"
          style={{ borderStyle: 'dashed' }}
        />
      );
  }
}

/* ----------------------------------------
   FloatingCard Component
   ---------------------------------------- */

export function FloatingCard({
  title,
  sections = [],
  quota = [],
  instanceCount = 1,
  onInstanceCountChange,
  cancelLabel = 'Cancel',
  actionLabel = 'Create',
  actionEnabled = false,
  onCancel,
  onAction,
  position = 'top-left',
  showCloseButton = false,
  onClose,
  isOpen = true,
  zIndex,
  portal = true,
  width = '320px',
  className,
  style,
  ...props
}: FloatingCardProps) {
  // All hooks must be called before any early returns
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>(() => {
    const initialState: Record<number, boolean> = {};
    sections.forEach((section, index) => {
      initialState[index] = section.collapsible ? (section.defaultExpanded ?? true) : true;
    });
    return initialState;
  });

  // Update expanded sections when sections prop changes
  useEffect(() => {
    const newState: Record<number, boolean> = {};
    sections.forEach((section, index) => {
      newState[index] = section.collapsible ? (section.defaultExpanded ?? true) : true;
    });
    setExpandedSections(newState);
  }, [sections]);

  // Early return after all hooks
  if (!isOpen) return null;

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const safePosition = position || 'top-left';

  const baseStyles = [
    portal ? 'fixed' : 'relative',
    'z-[var(--z-popover)]',
    'bg-[var(--color-surface-default)]',
    'border border-[var(--color-border-default)]',
    'rounded-[var(--primitive-radius-lg)]',
    'overflow-hidden',
    'flex flex-col',
    'h-fit',
    'max-h-[calc(100vh-2rem)]',
    ...(portal ? [positionStyles[safePosition] || positionStyles['top-left']] : []),
  ];

  const cardStyle: React.CSSProperties = {
    ...style,
    width,
    ...(zIndex && { zIndex }),
  };

  const cardContent = (
    <div className={twMerge(baseStyles.join(' '), className)} style={cardStyle} {...props}>
      {showCloseButton && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="
            absolute top-2 right-2
            flex items-center justify-center
            size-6
            rounded-md
            text-[var(--color-text-muted)]
            hover:bg-[var(--color-surface-subtle)]
            hover:text-[var(--color-text-default)]
            transition-colors duration-[var(--duration-fast)]
            focus:outline-none
            focus:ring-2
            focus:ring-[var(--color-border-focus)]
            z-10
          "
          aria-label="Close"
        >
          <IconX size={12} stroke={1} />
        </button>
      )}

      <div className="flex flex-col h-fit min-h-0 gap-0">
        {/* Summary Section - Scrollable, separated from Quota */}
        {/* Title is required, sections are optional */}
        <div
          className="overflow-y-auto flex flex-col gap-4 shrink-0 m-4 rounded-md"
          style={{
            maxHeight: '340px',
            minHeight: '160px',
            padding: '16px',
            border: '1px solid var(--color-border-default)',
            background: 'var(--color-surface-subtle)',
          }}
        >
          {/* Title - Always required */}
          <h2 className="text-label-lg text-[var(--color-text-default)] shrink-0">{title}</h2>

          {/* Summary Sections - Only render if sections exist */}
          {sections && sections.length > 0 && (
            <div className="flex flex-col gap-6 w-full">
              {sections.map((section, sectionIndex) => {
                const allSuccess =
                  section.items.length > 0 &&
                  section.items.every((item) => item.status === 'success');
                const showIcon = section.showSuccessIcon && allSuccess;

                // If section has items, it should be collapsible and show toggle
                const isCollapsible = section.collapsible ?? section.items.length > 0;
                const isExpanded =
                  expandedSections[sectionIndex] ?? section.defaultExpanded ?? true;

                return (
                  <div key={sectionIndex} className="flex flex-col gap-2 w-full">
                    {/* Section Title (Tab Title) - Always show toggle if collapsible */}
                    {isCollapsible ? (
                      <button
                        type="button"
                        onClick={() => toggleSection(sectionIndex)}
                        className="flex items-center justify-between w-full rounded px-2 -mx-2 py-1 transition-colors duration-[var(--duration-fast)] group cursor-pointer hover:bg-[var(--color-surface-muted)]"
                      >
                        <div className="flex items-center gap-1">
                          {isExpanded ? (
                            <IconChevronDown
                              size={12}
                              stroke={1}
                              className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text-default)] transition-colors"
                            />
                          ) : (
                            <IconChevronRight
                              size={12}
                              stroke={1}
                              className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text-default)] transition-colors"
                            />
                          )}
                          <span className="text-label-md text-[var(--color-text-default)]">
                            {section.tabTitle}
                          </span>
                        </div>
                        {showIcon && (
                          <span className="text-[var(--color-state-success)]">
                            <IconTarget size={12} stroke={1} />
                          </span>
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-label-md text-[var(--color-text-default)]">
                          {section.tabTitle}
                        </span>
                        {showIcon && (
                          <span className="text-[var(--color-state-success)]">
                            <IconTarget size={12} stroke={1} />
                          </span>
                        )}
                      </div>
                    )}

                    {/* Section Items (하위 섹션 타이틀) - Only show when expanded */}
                    {isCollapsible && isExpanded && section.items.length > 0 && (
                      <div className="flex flex-col gap-1 pl-4 w-full">
                        {section.items.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            className="flex items-center justify-between gap-2 w-full rounded px-2 -mx-2 py-1 transition-colors duration-[var(--duration-fast)] text-left group cursor-pointer hover:bg-[var(--color-surface-muted)]"
                            onClick={item.onClick}
                            disabled={!item.onClick}
                          >
                            <span className="text-body-sm text-[var(--color-text-subtle)] group-hover:text-[var(--color-text-default)] transition-colors">
                              {item.title}
                            </span>
                            <StatusIcon status={item.status} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quota Section - Fixed with white background, separated area */}
        {quota.length > 0 && (
          <div
            className="shrink-0 m-4 rounded-md"
            style={{
              padding: '16px',
              border: '1px solid var(--color-border-default)',
              background: 'var(--color-surface-default)',
            }}
          >
            <div className="flex flex-col items-start gap-3 w-full">
              <h3 className="text-label-md text-[var(--color-text-default)]">Quota</h3>
              <div className="flex flex-col gap-3 w-full">
                {quota.map((item, index) => (
                  <div key={index} className="flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between">
                      <span className="text-body-md text-[var(--color-text-default)]">
                        {item.label}
                      </span>
                      <span className="text-body-md text-[var(--color-text-muted)]">
                        {item.current}/{item.total}
                        {item.unit ? ` ${item.unit}` : ''}
                      </span>
                    </div>
                    <ProgressBar
                      value={item.current}
                      max={item.total}
                      variant="default"
                      showValue={false}
                      className="h-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Number of Instances - Fixed with white background */}
        {onInstanceCountChange && (
          <div className="px-6 py-4 flex flex-col gap-2 shrink-0 bg-[var(--color-surface-default)]">
            <label className="text-label-md text-[var(--color-text-default)]">
              Number of Instances
            </label>
            <NumberInput
              value={instanceCount}
              onChange={(value) => onInstanceCountChange(value)}
              min={1}
              size="sm"
            />
          </div>
        )}

        {/* Action Buttons - Fixed at bottom with white background, 3:7 ratio */}
        {(onCancel || onAction) && (
          <div className="px-6 pb-6 pt-4 flex flex-row gap-2 shrink-0 bg-[var(--color-surface-default)]">
            {onCancel && (
              <Button variant="secondary" size="md" onClick={onCancel} className="flex-[0.3]">
                {cancelLabel}
              </Button>
            )}
            {onAction && (
              <Button
                variant={actionEnabled ? 'primary' : 'secondary'}
                size="md"
                onClick={onAction}
                disabled={!actionEnabled}
                className="flex-[0.7]"
              >
                {actionLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (portal) {
    if (typeof document !== 'undefined' && document.body) {
      return createPortal(cardContent, document.body);
    }
    return cardContent;
  }

  return cardContent;
}

export default FloatingCard;
