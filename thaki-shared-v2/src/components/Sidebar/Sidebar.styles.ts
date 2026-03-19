/**
 * Sidebar component Tailwind styles
 *
 * Figma 디자인 토큰 기반:
 * - Sidebar width: 200px
 * - Content padding: py-2 (8px), px-3 (12px)
 * - Section gap: 24px (gap-6)
 * - Section header: 11px Medium, slate500/blueGray500
 * - MenuItem: py-1.5 (6px), px-2 (8px), gap-1.5 (6px), rounded-base6
 * - MenuItem text: 12px Regular/Medium, slate900/primary
 * - Active bg: blue50 (#eff6ff)
 */
import { cva } from 'class-variance-authority';

// Main sidebar container - slides to left when collapsed
export const sidebarStyles = cva(
  [
    'border-r border-border bg-surface',
    'w-[200px] min-w-[200px]',
    'text-[length:var(--semantic-font-size12,0.75rem)] leading-[var(--semantic-font-lineHeight18,1.125rem)]',
    'transition-all duration-300 ease-in-out',
    'will-change-[width,margin,opacity]',
    'overflow-hidden',
  ],
  {
    variants: {
      collapsed: {
        true: 'w-0 min-w-0 opacity-0 border-r-0',
        false: 'ml-0 opacity-100',
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  }
);

// Sidebar content container - px: 12px, no vertical padding (header sits flush)
export const sidebarContentStyles =
  'px-3 py-2 h-full flex flex-col overflow-hidden';

// Sidebar title
export const sidebarTitleStyles = 'text-text font-semibold m-0';

// Sidebar toggle button
export const sidebarToggleStyles =
  'py-xs px-sm rounded-sm transition-all min-w-[32px] min-h-[32px] hover:bg-surface-hover hover:scale-105 active:bg-surface-pressed active:scale-[0.98]';

// Menu area - py: 8px, gap between sections: 16px
export const sidebarMenuStyles =
  'flex-1 flex flex-col overflow-y-auto min-h-0';

// Fixed menu item (Dashboard, Home, etc.) - py: 6px, px: 8px, gap: 6px, radius: 6px
export const fixedMenuItemStyles = cva(
  [
    'flex items-center gap-1.5',
    'py-1.5 px-2',
    'rounded-base6 bg-transparent border-none cursor-pointer',
    'w-full text-left transition-colors duration-150',
    'hover:bg-surface-hover focus:bg-surface-hover',
  ],
  {
    variants: {
      active: {
        true: 'bg-info-weak-bg',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

// Fixed menu text - 11px Regular/Medium (matches TDS text-body-sm)
export const fixedMenuTextStyles = cva(
  [
    'font-sans text-[length:var(--semantic-font-size11,0.6875rem)] leading-[var(--semantic-font-lineHeight16,1rem)] m-0',
    'text-text',
  ],
  {
    variants: {
      active: {
        true: 'font-medium text-primary',
        false: 'font-normal',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

// Accordion item - gap between sections: 16px (handled by parent sidebarMenuStyles)
export const accordionItemStyles = [
  // Override TcAccordion root defaults (border/round/background).
  'border-none rounded-none bg-transparent m-0 overflow-visible',
  // Override TcAccordion header defaults (inset + muted background).
  '[&>div[aria-expanded]]:p-0',
  // Override TcAccordion content padding wrapper.
  '[&>div[role=region]>div>div]:p-0',
  // Hide TcAccordion divider line (not present in TDS sidebar).
  '[&>div[role=region]>div>div:first-child]:hidden',
].join(' ');

// Accordion header - gap: 4px, flex layout, px-2 py-1 (matches TDS MenuSection header padding)
export const accordionHeaderStyles =
  'flex items-center gap-1 px-2 py-1 bg-transparent cursor-pointer border-none transition-none m-0 hover:bg-transparent';

// Accordion title - 11px Medium, slate500 (matches TDS text-label-sm text-subtle)
export const accordionTitleStyles =
  'font-sans text-[length:var(--semantic-font-size11,0.6875rem)] leading-[var(--semantic-font-lineHeight16,1rem)] font-medium text-text-subtle m-0';

// Accordion arrow - 12x12px (16px container, 12px icon), slate500 (matches TDS text-subtle)
export const accordionArrowStyles =
  'w-3 h-3 min-w-[12px] min-h-[12px] transition-transform duration-200 text-text-subtle group-aria-[expanded=true]:rotate-90';

// Accordion arrow when open (use data attribute selector in parent)
export const accordionArrowOpenStyles = 'rotate-90';

// Accordion content - gap between header and menu: 6px (matches TDS MenuSection VStack gap={1.5})
export const accordionContentStyles =
  'p-0 mt-1.5 flex flex-col gap-0 bg-transparent';

// Submenu item - py: 6px, px: 8px, gap: 6px, radius: 6px
export const submenuItemStyles = cva(
  [
    'flex items-center gap-1.5',
    'py-1.5 px-2',
    'rounded-base6 bg-transparent border-none cursor-pointer',
    'transition-all duration-150',
    'w-full text-left',
    'hover:bg-surface-hover focus:bg-surface-hover',
  ],
  {
    variants: {
      active: {
        true: 'bg-info-weak-bg',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

// Submenu text - 11px Regular/Medium (matches TDS text-body-sm)
export const submenuTextStyles = cva(
  [
    'font-sans text-[length:var(--semantic-font-size11,0.6875rem)] leading-[var(--semantic-font-lineHeight16,1rem)] whitespace-nowrap m-0',
    'text-text',
  ],
  {
    variants: {
      active: {
        true: 'font-medium text-primary',
        false: 'font-normal',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);
