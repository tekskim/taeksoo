import { useState, type ReactNode } from 'react';
import { VStack } from '../../layouts';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';

/* ----------------------------------------
   MenuSection Types
   ---------------------------------------- */

export interface MenuSectionProps {
  /** Section title */
  title: string;
  /** Menu items */
  children: ReactNode;
  /** Default open state */
  defaultOpen?: boolean;
  /** Collapsible */
  collapsible?: boolean;
  /** Click handler for title */
  onTitleClick?: () => void;
}

/* ----------------------------------------
   MenuSection Component (using design tokens)
   ---------------------------------------- */

export function MenuSection({
  title,
  children,
  defaultOpen = true,
  collapsible = true,
  onTitleClick,
}: MenuSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleTitleClick = () => {
    if (collapsible) {
      setIsOpen(!isOpen);
    }
    if (onTitleClick) {
      onTitleClick();
    }
  };

  return (
    <VStack gap={2} className="w-full">
      {/* Section Header */}
      {collapsible ? (
        <button
          onClick={handleTitleClick}
          className="flex items-center gap-1 w-full group focus:outline-none px-[var(--menu-section-padding-x)] py-[var(--menu-section-padding-y)]"
        >
          <span className="text-[length:var(--font-size-11)] font-medium text-[var(--color-text-subtle)] group-hover:text-[var(--color-text-muted)] transition-colors duration-[var(--duration-fast)]">
            {title}
          </span>
          {isOpen ? (
            <IconChevronDown size={16} className="text-[var(--color-text-disabled)]" stroke={1} />
          ) : (
            <IconChevronRight size={16} className="text-[var(--color-text-disabled)]" stroke={1} />
          )}
        </button>
      ) : (
        <span className="text-[length:var(--font-size-11)] font-medium text-[var(--color-text-subtle)] px-[var(--menu-section-padding-x)] py-[var(--menu-section-padding-y)]">
          {title}
        </span>
      )}

      {/* Section Content */}
      {isOpen && (
        <VStack gap={0} className="w-full">
          {children}
        </VStack>
      )}
    </VStack>
  );
}
