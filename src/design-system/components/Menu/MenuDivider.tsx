/* ----------------------------------------
   MenuDivider Types
   ---------------------------------------- */

export interface MenuDividerProps {
  /** Vertical spacing */
  spacing?: 'sm' | 'md' | 'lg';
}

/* ----------------------------------------
   MenuDivider Component (using design tokens)
   ---------------------------------------- */

export function MenuDivider({ spacing = 'md' }: MenuDividerProps) {
  const spacingStyles = {
    sm: 'my-1',
    md: 'my-[var(--menu-divider-margin)]',
    lg: 'my-3',
  };

  return (
    <div className={`w-full h-px bg-[var(--color-border-default)] ${spacingStyles[spacing]}`} />
  );
}
