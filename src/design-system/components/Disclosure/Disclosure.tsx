import {
  type ReactNode,
  type HTMLAttributes,
  useState,
  useId,
  createContext,
  useContext,
} from 'react';
import { twMerge } from '../../utils/cn';
import { IconChevronRight, IconChevronDown } from '@tabler/icons-react';

/* ----------------------------------------
   Context
   ---------------------------------------- */

interface DisclosureContextValue {
  isOpen: boolean;
  toggle: () => void;
  triggerId: string;
  panelId: string;
}

const DisclosureContext = createContext<DisclosureContextValue | null>(null);

function useDisclosureContext() {
  const context = useContext(DisclosureContext);
  if (!context) {
    throw new Error('Disclosure components must be used within a Disclosure');
  }
  return context;
}

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface DisclosureProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onChange?: (open: boolean) => void;
  children: ReactNode;
}

export interface DisclosureTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export interface DisclosurePanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/* ----------------------------------------
   Disclosure (Root)
   ---------------------------------------- */

export function Disclosure({
  defaultOpen = false,
  open: controlledOpen,
  onChange,
  children,
  className,
  ...props
}: DisclosureProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const id = useId();

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const toggle = () => {
    const newValue = !isOpen;
    if (!isControlled) {
      setInternalOpen(newValue);
    }
    onChange?.(newValue);
  };

  const contextValue: DisclosureContextValue = {
    isOpen,
    toggle,
    triggerId: `disclosure-trigger-${id}`,
    panelId: `disclosure-panel-${id}`,
  };

  return (
    <DisclosureContext.Provider value={contextValue}>
      <div data-figma-name="[TDS] Disclosure" className={twMerge('', className)} {...props}>
        {children}
      </div>
    </DisclosureContext.Provider>
  );
}

/* ----------------------------------------
   Disclosure.Trigger
   ---------------------------------------- */

export function DisclosureTrigger({ children, className, ...props }: DisclosureTriggerProps) {
  const { isOpen, toggle, triggerId, panelId } = useDisclosureContext();

  return (
    <button
      type="button"
      id={triggerId}
      aria-expanded={isOpen}
      aria-controls={panelId}
      onClick={toggle}
      className={twMerge(
        'flex items-center gap-[var(--disclosure-gap)]',
        'text-label-lg',
        'text-[var(--color-text-default)]',
        'cursor-pointer select-none',
        'hover:text-[var(--color-text-subtle)]',
        'transition-colors duration-[var(--duration-fast)]',
        className
      )}
      {...props}
    >
      {/* Icon */}
      <span className="shrink-0 flex items-center justify-center w-[var(--disclosure-icon-size)] h-[var(--disclosure-icon-size)]">
        {isOpen ? (
          <IconChevronDown size={12} strokeWidth={2} />
        ) : (
          <IconChevronRight size={12} strokeWidth={2} />
        )}
      </span>

      {/* Label */}
      {children}
    </button>
  );
}

/* ----------------------------------------
   Disclosure.Panel
   ---------------------------------------- */

export function DisclosurePanel({ children, className, ...props }: DisclosurePanelProps) {
  const { isOpen, triggerId, panelId } = useDisclosureContext();

  if (!isOpen) return null;

  return (
    <div
      id={panelId}
      role="region"
      aria-labelledby={triggerId}
      className={twMerge('', className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Compound component pattern
Disclosure.Trigger = DisclosureTrigger;
Disclosure.Panel = DisclosurePanel;
