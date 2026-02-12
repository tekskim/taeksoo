import {
  createContext,
  useContext,
  useState,
  useCallback,
  useId,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
} from 'react';
import { twMerge } from '../../utils/cn';
import { IconChevronDown } from '@tabler/icons-react';

/* ----------------------------------------
   Context
   ---------------------------------------- */

interface AccordionContextValue {
  expandedItems: string[];
  toggleItem: (id: string) => void;
  allowMultiple: boolean;
  variant: AccordionVariant;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion.Root');
  }
  return context;
};

interface AccordionItemContextValue {
  itemId: string;
  isExpanded: boolean;
  triggerId: string;
  panelId: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

const useAccordionItemContext = () => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('Accordion.Trigger and Accordion.Panel must be used within an Accordion.Item');
  }
  return context;
};

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type AccordionVariant = 'default' | 'bordered' | 'separated';

export interface AccordionRootProps extends HTMLAttributes<HTMLDivElement> {
  /** Allow multiple items to be expanded */
  allowMultiple?: boolean;
  /** Default expanded items */
  defaultExpanded?: string[];
  /** Controlled expanded items */
  expanded?: string[];
  /** Callback when expanded items change */
  onChange?: (expanded: string[]) => void;
  /** Visual variant */
  variant?: AccordionVariant;
  /** Children (Accordion.Item) */
  children: ReactNode;
}

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Unique identifier for this item */
  id: string;
  /** Disabled state */
  disabled?: boolean;
  /** Children */
  children: ReactNode;
}

export interface AccordionTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  /** Trigger content */
  children: ReactNode;
  /** Icon position */
  iconPosition?: 'left' | 'right';
  /** Hide icon */
  hideIcon?: boolean;
}

export interface AccordionPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Panel content */
  children: ReactNode;
}

/* ----------------------------------------
   Accordion.Root
   ---------------------------------------- */

export const AccordionRoot = forwardRef<HTMLDivElement, AccordionRootProps>(
  (
    {
      allowMultiple = false,
      defaultExpanded = [],
      expanded: controlledExpanded,
      onChange,
      variant = 'default',
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [internalExpanded, setInternalExpanded] = useState<string[]>(defaultExpanded);

    const isControlled = controlledExpanded !== undefined;
    const expandedItems = isControlled ? controlledExpanded : internalExpanded;

    const toggleItem = useCallback(
      (itemId: string) => {
        let newExpanded: string[];

        if (expandedItems.includes(itemId)) {
          // Collapse
          newExpanded = expandedItems.filter((id) => id !== itemId);
        } else {
          // Expand
          if (allowMultiple) {
            newExpanded = [...expandedItems, itemId];
          } else {
            newExpanded = [itemId];
          }
        }

        if (!isControlled) {
          setInternalExpanded(newExpanded);
        }
        onChange?.(newExpanded);
      },
      [expandedItems, allowMultiple, isControlled, onChange]
    );

    const variantStyles: Record<AccordionVariant, string> = {
      default: '',
      bordered: 'border border-[var(--color-border-default)] rounded-[var(--radius-md)]',
      separated: 'space-y-2',
    };

    return (
      <AccordionContext.Provider value={{ expandedItems, toggleItem, allowMultiple, variant }}>
        <div ref={ref} className={twMerge(variantStyles[variant], className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

AccordionRoot.displayName = 'Accordion.Root';

/* ----------------------------------------
   Accordion.Item
   ---------------------------------------- */

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ id, disabled = false, children, className, ...props }, ref) => {
    const { expandedItems, variant } = useAccordionContext();
    const uniqueId = useId();

    const isExpanded = expandedItems.includes(id);
    const triggerId = `accordion-trigger-${uniqueId}`;
    const panelId = `accordion-panel-${uniqueId}`;

    const variantStyles: Record<AccordionVariant, string> = {
      default: 'border-b border-[var(--color-border-subtle)] last:border-b-0',
      bordered: 'border-b border-[var(--color-border-subtle)] last:border-b-0',
      separated:
        'border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden',
    };

    return (
      <AccordionItemContext.Provider value={{ itemId: id, isExpanded, triggerId, panelId }}>
        <div
          ref={ref}
          data-state={isExpanded ? 'open' : 'closed'}
          data-disabled={disabled || undefined}
          className={twMerge(variantStyles[variant], disabled && 'opacity-50', className)}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);

AccordionItem.displayName = 'Accordion.Item';

/* ----------------------------------------
   Accordion.Trigger
   ---------------------------------------- */

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, iconPosition = 'right', hideIcon = false, className, ...props }, ref) => {
    const { toggleItem, variant } = useAccordionContext();
    const { itemId, isExpanded, triggerId, panelId } = useAccordionItemContext();

    const handleClick = () => {
      toggleItem(itemId);
    };

    const bgStyles: Record<AccordionVariant, string> = {
      default: '',
      bordered: isExpanded ? 'bg-[var(--color-surface-subtle)]' : '',
      separated: isExpanded ? 'bg-[var(--color-surface-subtle)]' : '',
    };

    return (
      <button
        ref={ref}
        type="button"
        id={triggerId}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={handleClick}
        className={twMerge(
          'flex items-center justify-between w-full',
          'px-4 py-3',
          'text-body-md font-medium text-[var(--color-text-default)]',
          'cursor-pointer',
          'hover:bg-[var(--color-surface-subtle)]',
          'transition-colors duration-[var(--duration-fast)]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-action-primary)]',
          bgStyles[variant],
          iconPosition === 'left' && 'flex-row-reverse',
          className
        )}
        {...props}
      >
        <span className="flex-1 text-left">{children}</span>

        {!hideIcon && (
          <IconChevronDown
            size={12}
            stroke={1.5}
            className={twMerge(
              'shrink-0 text-[var(--color-text-muted)]',
              'transition-transform duration-[var(--duration-fast)]',
              isExpanded && 'rotate-180',
              iconPosition === 'left' && 'mr-2',
              iconPosition === 'right' && 'ml-2'
            )}
          />
        )}
      </button>
    );
  }
);

AccordionTrigger.displayName = 'Accordion.Trigger';

/* ----------------------------------------
   Accordion.Panel
   ---------------------------------------- */

export const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>(
  ({ children, className, ...props }, ref) => {
    const { isExpanded, triggerId, panelId } = useAccordionItemContext();

    if (!isExpanded) return null;

    return (
      <div
        ref={ref}
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={twMerge('px-4 py-3 text-body-md text-[var(--color-text-default)]', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AccordionPanel.displayName = 'Accordion.Panel';

/* ----------------------------------------
   Compound Export
   ---------------------------------------- */

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
};

export default Accordion;
