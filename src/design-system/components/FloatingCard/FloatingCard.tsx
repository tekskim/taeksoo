import { type HTMLAttributes, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { twMerge } from '../../utils/cn';
import {
  IconX,
  IconChevronRight,
  IconChevronDown,
  IconAlertTriangle,
  IconCheck,
  IconProgress,
  IconCircleDashed,
} from '@tabler/icons-react';
import { Button, NumberInput, ProgressBar } from '@/design-system';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type FloatingCardPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type SectionStatus = 'processing' | 'warning' | 'success' | 'default' | 'writing';

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
          <IconCheck size={10} stroke={2} className="text-[var(--color-text-on-primary)]" />
        </div>
      );
    case 'warning':
      return (
        <div className="size-4 rounded-full border border-[var(--color-state-danger)] bg-[var(--color-state-danger)] shrink-0 flex items-center justify-center">
          <IconAlertTriangle size={10} stroke={2} className="text-[var(--color-text-on-primary)]" />
        </div>
      );
    case 'processing':
      return (
        <div className="size-4 shrink-0 flex items-center justify-center">
          <IconProgress size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
        </div>
      );
    default:
      return (
        <div className="size-4 shrink-0 flex items-center justify-center">
          <IconCircleDashed size={16} stroke={1.5} className="text-[var(--color-border-default)]" />
        </div>
      );
  }
}

function deriveSectionStatus(items: SectionItem[]): SectionStatus {
  if (items.length === 0) return 'default';
  if (items.every((item) => item.status === 'success')) return 'success';
  if (items.some((item) => item.status === 'warning')) return 'warning';
  return 'processing';
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
    <div
      data-figma-name="[TDS] FloatingCard"
      className={twMerge(baseStyles.join(' '), className)}
      style={cardStyle}
      {...props}
    >
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
        <OverlayScrollbarsComponent
          options={{
            overflow: { x: 'hidden', y: 'scroll' },
            scrollbars: { autoHide: 'scroll', autoHideDelay: 800 },
          }}
          defer={false}
          className="shrink-0 m-3 rounded-[var(--radius-lg)]"
          style={{
            maxHeight: '340px',
            minHeight: '160px',
            border: '1px solid var(--color-border-default)',
            background: 'var(--color-surface-subtle)',
          }}
        >
          <div className="flex flex-col gap-4 pl-4 pr-3 py-4">
            <h2 className="text-heading-h5 text-[var(--color-text-default)] shrink-0">{title}</h2>

            {sections && sections.length > 0 && (
              <div className="flex flex-col gap-4 w-full">
                {sections.map((section, sectionIndex) => {
                  const sectionStatus = deriveSectionStatus(section.items);
                  const isCollapsible = section.collapsible ?? section.items.length > 0;
                  const isExpanded =
                    expandedSections[sectionIndex] ?? section.defaultExpanded ?? true;
                  const showItems = isCollapsible ? isExpanded : true;

                  return (
                    <div key={sectionIndex} className="flex flex-col gap-2 w-full">
                      {isCollapsible ? (
                        <button
                          type="button"
                          onClick={() => toggleSection(sectionIndex)}
                          className="flex items-center justify-between w-full pr-2 transition-colors duration-[var(--duration-fast)] group cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5">
                            {isExpanded ? (
                              <IconChevronDown
                                size={12}
                                stroke={2}
                                className="text-[var(--color-text-default)] shrink-0"
                              />
                            ) : (
                              <IconChevronRight
                                size={12}
                                stroke={2}
                                className="text-[var(--color-text-default)] shrink-0"
                              />
                            )}
                            <span className="text-heading-h6 text-[var(--color-text-default)]">
                              {section.tabTitle}
                            </span>
                          </div>
                          <StatusIcon status={sectionStatus} />
                        </button>
                      ) : section.tabTitle ? (
                        <div className="flex items-center justify-between w-full pr-2">
                          <span className="text-heading-h6 text-[var(--color-text-default)]">
                            {section.tabTitle}
                          </span>
                          <StatusIcon status={sectionStatus} />
                        </div>
                      ) : null}

                      {showItems && section.items.length > 0 && (
                        <div className="flex flex-col gap-0 w-full">
                          {section.items.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              className="flex items-center justify-between gap-2 w-full px-2 py-1 transition-colors duration-[var(--duration-fast)] text-left group cursor-pointer hover:bg-[var(--color-surface-muted)] rounded"
                              onClick={item.onClick}
                              disabled={!item.onClick}
                            >
                              <span className="text-body-md text-[var(--color-text-default)] transition-colors">
                                {item.title}
                              </span>
                              {item.status === 'writing' ? (
                                <span className="text-body-sm text-[var(--color-text-subtle)] shrink-0">
                                  Writing...
                                </span>
                              ) : (
                                <StatusIcon status={item.status} />
                              )}
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
        </OverlayScrollbarsComponent>

        {/* Quota Section - Fixed with white background, separated area */}
        {quota.length > 0 && (
          <div
            className="shrink-0 m-3 rounded-[var(--radius-lg)]"
            style={{
              padding: '16px',
              border: '1px solid var(--color-border-default)',
              background: 'var(--color-surface-default)',
            }}
          >
            <div className="flex flex-col items-start gap-3 w-full">
              <h3 className="text-heading-h5 text-[var(--color-text-default)]">Quota</h3>
              <div className="flex flex-col gap-3 w-full">
                {quota.map((item, index) => (
                  <div key={index} className="flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between">
                      <span className="text-label-lg text-[var(--color-text-default)]">
                        {item.label}
                      </span>
                      <span className="text-body-md text-[var(--color-text-default)]">
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
              fullWidth
            />
          </div>
        )}

        {/* Action Buttons */}
        {(onCancel || onAction) && (
          <div className="px-3 pb-4 pt-3 flex flex-row gap-2 shrink-0 bg-[var(--color-surface-default)]">
            {onCancel && (
              <Button
                variant="secondary"
                size="md"
                onClick={onCancel}
                className="w-[80px] shrink-0"
              >
                {cancelLabel}
              </Button>
            )}
            {onAction && (
              <Button
                variant="primary"
                size="md"
                onClick={onAction}
                disabled={!actionEnabled}
                className="flex-1"
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
