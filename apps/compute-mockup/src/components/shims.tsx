/**
 * Shim layer — maps the mockup's simplified component API
 * onto actual @thaki/shared v1.23.x components where they exist,
 * and provides local implementations for components not yet in TDS.
 */
import React, { useState, useRef, createContext, useContext } from 'react';
import {
  Button as TDSButton,
  Badge as TDSBadge,
  StatusIndicator as TDSStatusIndicator,
  ContextMenu as TDSContextMenu,
  VStack as TDSVStack,
  HStack as TDSHStack,
} from '@thaki/shared';

// ---------------------------------------------------------------------------
// VStack / HStack — pass numeric gap as Tailwind class override
// ---------------------------------------------------------------------------
interface VStackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: number | 'xs' | 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

const numericGapClass: Record<number, string> = {
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
};

export function VStack({ gap, className, children, ...props }: VStackProps) {
  if (typeof gap === 'string') {
    return (
      <TDSVStack gap={gap} className={className} {...(props as object)}>
        {children}
      </TDSVStack>
    );
  }
  const gapClass = typeof gap === 'number' ? (numericGapClass[gap] ?? `gap-${gap}`) : '';
  return (
    <div className={['flex flex-col', gapClass, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
}

export function HStack({
  gap,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { gap?: number | 'xs' | 'sm' | 'md' | 'lg' }) {
  if (typeof gap === 'string') {
    return (
      <TDSHStack gap={gap} className={className} {...(props as object)}>
        {children}
      </TDSHStack>
    );
  }
  const gapClass = typeof gap === 'number' ? (numericGapClass[gap] ?? `gap-${gap}`) : '';
  return (
    <div
      className={['flex flex-row items-center', gapClass, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Button — wraps TDS Button, adds leftIcon / rightIcon support
// maps 'ghost' shorthand to appearance="ghost"
// ---------------------------------------------------------------------------
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'ghost'
    | 'error'
    | 'success'
    | 'warning'
    | 'muted';
  appearance?: 'solid' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = 'secondary',
  appearance,
  leftIcon,
  rightIcon,
  children,
  ...props
}: ButtonProps) {
  const resolvedVariant = variant === 'ghost' ? 'secondary' : variant;
  const resolvedAppearance = appearance ?? (variant === 'ghost' ? 'ghost' : 'solid');
  return (
    <TDSButton
      variant={resolvedVariant as never}
      appearance={resolvedAppearance}
      {...(props as object)}
    >
      {leftIcon && <span className="inline-flex">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="inline-flex">{rightIcon}</span>}
    </TDSButton>
  );
}

// ---------------------------------------------------------------------------
// Badge — wraps TDS Badge, maps variant → theme
// ---------------------------------------------------------------------------
interface BadgeProps {
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error';
  theme?: 'blu' | 'red' | 'gry' | 'gre' | 'ylw';
  size?: 'sm' | 'md' | 'lg';
  type?: 'subtle' | 'solid';
  className?: string;
  children?: React.ReactNode;
}

const variantToTheme: Record<string, 'blu' | 'red' | 'gry' | 'gre' | 'ylw'> = {
  info: 'blu',
  success: 'gre',
  warning: 'ylw',
  error: 'red',
  default: 'gry',
};

export function Badge({ variant, theme, size, type, className, children }: BadgeProps) {
  const resolvedTheme = theme ?? variantToTheme[variant ?? 'default'] ?? 'gry';
  return (
    <TDSBadge theme={resolvedTheme} size={size} type={type} className={className}>
      {children}
    </TDSBadge>
  );
}

// ---------------------------------------------------------------------------
// StatusIndicator — wraps TDS StatusIndicator, maps status → variant
// 'muted' is not a TDS variant; map to shutoff + muted colorScheme
// ---------------------------------------------------------------------------
type StatusValue =
  | 'active'
  | 'error'
  | 'muted'
  | 'building'
  | 'pending'
  | 'paused'
  | 'shutoff'
  | string;

interface StatusIndicatorProps {
  status?: StatusValue;
  variant?: StatusValue;
  showLabel?: boolean;
  className?: string;
}

const statusVariantMap: Record<string, string> = {
  active: 'active',
  error: 'error',
  building: 'building',
  pending: 'pending',
  paused: 'paused',
  shutoff: 'shutoff',
  muted: 'shutoff',
};

export function StatusIndicator({ status, variant, className }: StatusIndicatorProps) {
  const key = status ?? variant ?? 'shutoff';
  const resolvedVariant = (statusVariantMap[key] ?? key) as never;
  const colorScheme = key === 'muted' ? ('muted' as never) : undefined;
  return (
    <TDSStatusIndicator variant={resolvedVariant} colorScheme={colorScheme} className={className} />
  );
}

// ---------------------------------------------------------------------------
// ContextMenu — wraps TDS ContextMenu.Root + ContextMenu.Item
// ---------------------------------------------------------------------------
interface ContextMenuItem {
  id: string;
  label: string;
  onClick?: () => void;
  status?: 'danger' | string;
  divider?: boolean;
  disabled?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  trigger?: 'click' | 'hover';
  align?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

export function ContextMenu({ items, align = 'left', children, className }: ContextMenuProps) {
  const direction = align === 'right' ? 'bottom-right' : ('bottom-left' as never);
  return (
    <span className={className}>
      <TDSContextMenu.Root
        direction={direction}
        trigger={({ toggle }) => (
          <span onClick={toggle} className="inline-flex">
            {children}
          </span>
        )}
      >
        {items.map((item) => (
          <React.Fragment key={item.id}>
            {item.divider && <div className="my-1 border-t border-[var(--color-border-subtle)]" />}
            <TDSContextMenu.Item
              action={item.onClick ?? (() => {})}
              danger={item.status === 'danger'}
              disabled={item.disabled}
            >
              {item.label}
            </TDSContextMenu.Item>
          </React.Fragment>
        ))}
      </TDSContextMenu.Root>
    </span>
  );
}

// ---------------------------------------------------------------------------
// PageHeader (not in TDS — custom implementation using TDS tokens)
// ---------------------------------------------------------------------------
interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, actions, className }: PageHeaderProps) {
  return (
    <div className={['flex items-center justify-between', className].filter(Boolean).join(' ')}>
      <h1 className="text-heading-h5 font-semibold text-[var(--color-text-default)]">{title}</h1>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SearchInput (not in TDS — uses TDS Input token styling)
// ---------------------------------------------------------------------------
interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  size = 'md',
  className,
  ...props
}: SearchInputProps) {
  const sizeClass =
    size === 'sm'
      ? 'h-7 text-label-sm px-2.5'
      : size === 'lg'
        ? 'h-11 text-label-lg px-4'
        : 'h-9 text-label-md px-3';
  return (
    <div className="relative inline-flex items-center">
      <svg
        className="absolute left-2.5 w-3.5 h-3.5 text-[var(--color-text-subtle)] pointer-events-none"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="7" cy="7" r="5" />
        <path d="M12 12l2.5 2.5" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={[
          'rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] text-[var(--color-text-default)] placeholder:text-[var(--color-text-subtle)] focus:outline-none focus:border-[var(--color-action-primary)] pl-8 transition-colors',
          sizeClass,
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// EmptyState (not in TDS)
// ---------------------------------------------------------------------------
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={['flex flex-col items-center justify-center py-20 gap-4 text-center', className]
        .filter(Boolean)
        .join(' ')}
    >
      {icon && <div className="text-[var(--color-text-subtle)]">{icon}</div>}
      <div className="flex flex-col gap-1">
        <p className="text-label-md font-semibold text-[var(--color-text-default)]">{title}</p>
        {description && (
          <p className="text-label-sm text-[var(--color-text-subtle)]">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Table + TableColumn (not in TDS — TDS Table has no render fn)
// ---------------------------------------------------------------------------
export interface TableColumn<TData = Record<string, unknown>> {
  key: string;
  header?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  render?: (row: TData) => React.ReactNode;
}

interface TableProps<TData> {
  columns: TableColumn<TData>[];
  data: TData[];
  rowKey: keyof TData | ((row: TData) => string);
  selectable?: boolean;
  selectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  emptyMessage?: string;
  className?: string;
}

export function Table<TData>({
  columns,
  data,
  rowKey,
  selectable,
  selectedKeys = [],
  onSelectionChange,
  emptyMessage = 'No data.',
  className,
}: TableProps<TData>) {
  function getKey(row: TData): string {
    if (typeof rowKey === 'function') return rowKey(row);
    return String(row[rowKey]);
  }

  function toggleAll() {
    if (!onSelectionChange) return;
    onSelectionChange(selectedKeys.length === data.length ? [] : data.map(getKey));
  }

  function toggleRow(key: string) {
    if (!onSelectionChange) return;
    onSelectionChange(
      selectedKeys.includes(key) ? selectedKeys.filter((k) => k !== key) : [...selectedKeys, key]
    );
  }

  const alignClass = (a?: string) =>
    a === 'center' ? 'text-center' : a === 'right' ? 'text-right' : 'text-left';

  return (
    <div
      className={[
        'w-full overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-border-default)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <table className="w-full text-label-sm">
        <thead>
          <tr className="border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
            {selectable && (
              <th className="w-10 px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={data.length > 0 && selectedKeys.length === data.length}
                  onChange={toggleAll}
                  className="accent-[var(--color-action-primary)] w-3.5 h-3.5"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={[
                  'px-3 py-2.5 font-medium text-[var(--color-text-subtle)] whitespace-nowrap',
                  alignClass(col.align),
                ].join(' ')}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header ?? col.key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="px-3 py-12 text-center text-[var(--color-text-subtle)]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => {
              const key = getKey(row);
              const isSelected = selectedKeys.includes(key);
              return (
                <tr
                  key={key}
                  className={[
                    'border-b border-[var(--color-border-subtle)] last:border-0 transition-colors',
                    isSelected
                      ? 'bg-[var(--color-action-primary-subtle)]'
                      : 'bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-hover)]',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {selectable && (
                    <td className="px-3 py-2.5 w-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(key)}
                        className="accent-[var(--color-action-primary)] w-3.5 h-3.5"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={[
                        'px-3 py-2.5 text-[var(--color-text-default)]',
                        alignClass(col.align),
                      ].join(' ')}
                    >
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pagination (not in TDS with this API)
// ---------------------------------------------------------------------------
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  selectedCount?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  selectedCount,
  className,
}: PaginationProps) {
  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div
      className={[
        'flex items-center justify-between text-label-sm text-[var(--color-text-subtle)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-center gap-2">
        {totalItems !== undefined && (
          <span>
            {selectedCount !== undefined && selectedCount > 0 ? `${selectedCount} selected / ` : ''}
            {totalItems} items
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] disabled:opacity-40 hover:bg-[var(--color-surface-hover)] transition-colors"
        >
          ‹
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="w-7 text-center">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={[
                'w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] transition-colors',
                p === currentPage
                  ? 'bg-[var(--color-action-primary)] text-white'
                  : 'hover:bg-[var(--color-surface-hover)]',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {p}
            </button>
          )
        )}
        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] disabled:opacity-40 hover:bg-[var(--color-surface-hover)] transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DetailHeader — compound component (not in TDS)
// ---------------------------------------------------------------------------
interface InfoCardProps {
  label: string;
  value?: string;
  status?: string;
  copyable?: boolean;
}

function InfoCard({ label, value, status, copyable }: InfoCardProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const statusColorClass =
    status === 'active'
      ? 'text-[var(--color-feedback-success)]'
      : status === 'error'
        ? 'text-[var(--color-feedback-error)]'
        : status === 'building'
          ? 'text-[var(--color-feedback-warning)]'
          : 'text-[var(--color-text-default)]';

  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-label-xs text-[var(--color-text-subtle)]">{label}</span>
      {status ? (
        <span className={`text-label-sm font-medium capitalize ${statusColorClass}`}>{status}</span>
      ) : (
        <div className="flex items-center gap-1">
          <span className="text-label-sm text-[var(--color-text-default)] truncate">
            {value ?? '-'}
          </span>
          {copyable && value && (
            <button
              onClick={handleCopy}
              className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] transition-colors shrink-0"
              title="Copy"
            >
              {copied ? (
                <svg
                  viewBox="0 0 14 14"
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M2 7l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 14 14"
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="4" y="4" width="8" height="8" rx="1" />
                  <path d="M2 10V3a1 1 0 011-1h7" strokeLinecap="round" />
                </svg>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function DetailHeaderRoot({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-6 flex flex-col gap-4">
      {children}
    </div>
  );
}

function DetailHeaderTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="text-heading-h4 font-bold text-[var(--color-text-default)]">{children}</h1>;
}

function DetailHeaderActions({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-2 flex-wrap">{children}</div>;
}

function DetailHeaderInfoGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-4 border-t border-[var(--color-border-subtle)]">
      {children}
    </div>
  );
}

export const DetailHeader = Object.assign(DetailHeaderRoot, {
  Title: DetailHeaderTitle,
  Actions: DetailHeaderActions,
  InfoGrid: DetailHeaderInfoGrid,
  InfoCard: InfoCard,
});

// ---------------------------------------------------------------------------
// SectionCard — compound component (not in TDS)
// ---------------------------------------------------------------------------
function SectionCardRoot({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        'rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}

function SectionCardHeader({ title, actions }: { title: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-subtle)]">
      <span className="text-label-sm font-semibold text-[var(--color-text-default)]">{title}</span>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

function SectionCardContent({ children }: { children: React.ReactNode }) {
  return <div className="divide-y divide-[var(--color-border-subtle)]">{children}</div>;
}

interface DataRowProps {
  label: string;
  value?: string;
  children?: React.ReactNode;
  isLink?: boolean;
  linkHref?: string;
}

function SectionCardDataRow({ label, value, children, isLink, linkHref }: DataRowProps) {
  return (
    <div className="flex items-start px-4 py-2.5 gap-6">
      <span className="text-label-xs text-[var(--color-text-subtle)] w-36 shrink-0 pt-px">
        {label}
      </span>
      <span className="text-label-sm text-[var(--color-text-default)] flex-1">
        {children ??
          (isLink && linkHref ? (
            <a href={linkHref} className="text-[var(--color-action-primary)] hover:underline">
              {value}
            </a>
          ) : (
            (value ?? '-')
          ))}
      </span>
    </div>
  );
}

export const SectionCard = Object.assign(SectionCardRoot, {
  Header: SectionCardHeader,
  Content: SectionCardContent,
  DataRow: SectionCardDataRow,
});

// ---------------------------------------------------------------------------
// Tabs / TabList / Tab / TabPanel — context-based
// (TDS Tabs has a different structure: <Tab id label>content</Tab>)
// ---------------------------------------------------------------------------
interface TabsContextValue {
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'button';
  size?: 'sm' | 'md';
}

const TabsContext = createContext<TabsContextValue>({
  activeTab: '',
  onChange: () => {},
});

interface TabsProps {
  value?: string;
  activeTabId?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  variant?: 'underline' | 'button';
  size?: 'sm' | 'md';
  className?: string;
  children: React.ReactNode;
}

export function Tabs({
  value,
  activeTabId,
  defaultValue,
  onChange,
  variant = 'underline',
  size = 'md',
  className,
  children,
}: TabsProps) {
  const controlled = value ?? activeTabId;
  const [internalActive, setInternalActive] = useState(defaultValue ?? '');
  const active = controlled ?? internalActive;

  function handleChange(id: string) {
    if (!controlled) setInternalActive(id);
    onChange?.(id);
  }

  return (
    <TabsContext.Provider value={{ activeTab: active, onChange: handleChange, variant, size }}>
      <div className={['flex flex-col', className].filter(Boolean).join(' ')}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabList({ children, className }: TabListProps) {
  const { variant } = useContext(TabsContext);
  return (
    <div
      className={[
        'flex items-end',
        variant === 'underline' ? 'border-b border-[var(--color-border-default)]' : 'gap-1',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}

interface TabButtonProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Tab({ value, children, disabled, className }: TabButtonProps) {
  const { activeTab, onChange, variant, size } = useContext(TabsContext);
  const isActive = activeTab === value;
  const sizeClass = size === 'sm' ? 'text-label-sm px-3 py-2' : 'text-label-md px-4 py-2.5';

  if (variant === 'button') {
    return (
      <button
        disabled={disabled}
        onClick={() => onChange(value)}
        className={[
          'rounded-[var(--radius-sm)] transition-colors font-medium',
          sizeClass,
          isActive
            ? 'bg-[var(--color-action-primary)] text-white'
            : 'text-[var(--color-text-subtle)] hover:bg-[var(--color-surface-hover)]',
          disabled ? 'opacity-40 cursor-not-allowed' : '',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      disabled={disabled}
      onClick={() => onChange(value)}
      className={[
        'font-medium transition-colors border-b-2 -mb-px',
        sizeClass,
        isActive
          ? 'border-[var(--color-action-primary)] text-[var(--color-action-primary)]'
          : 'border-transparent text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]',
        disabled ? 'opacity-40 cursor-not-allowed' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
}

interface TabPanelProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ value, children, className }: TabPanelProps) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;
  return <div className={className}>{children}</div>;
}

// Re-export useRef for convenience (used in ContextMenu previously)
export { useRef };
