/**
 * ContextMenu component Tailwind styles
 */
import { cva } from 'class-variance-authority';

// Root contextmenu container
export const contextMenuStyles = 'relative inline-block';

// Trigger wrapper
export const triggerStyles = 'block';

// Subitem contextmenu wrapper
export const subitemContextMenuStyles =
  'block [&_.contextmenu-trigger]:block [&_.contextmenu-item-trigger]:flex [&_.contextmenu-item-trigger]:text-left';

// Content menu list styles
export const contentStyles =
  'static min-w-[5rem] w-max max-w-[20rem] font-sans text-11 leading-16 animate-contextmenu-enter overflow-hidden focus:outline-none bg-surface border border-border rounded-base6 shadow-lg p-0';

// Menu item (li element)
export const menuItemStyles = cva(
  [
    'list-none relative cursor-pointer text-text',
    'py-1.5 px-3 m-0 border-none',
    'transition-colors duration-fast ease-ease-out',
    'flex items-center gap-2 w-full min-w-[80px]',
    'text-11 font-normal leading-16 whitespace-nowrap',
    'hover:bg-surface-muted',
  ],
  {
    variants: {
      focused: {
        true: 'bg-info-weak-bg text-primary',
        false: '',
      },
      disabled: {
        true: 'text-text-muted cursor-not-allowed opacity-disabled hover:bg-transparent',
        false: '',
      },
      danger: {
        true: 'text-error hover:bg-surface-muted',
        false: '',
      },
    },
    compoundVariants: [
      {
        danger: true,
        focused: true,
        class: 'bg-danger-bg text-error',
      },
    ],
    defaultVariants: {
      focused: false,
      disabled: false,
      danger: false,
    },
  }
);

// Item trigger button
export const itemTriggerStyles = cva(
  [
    'bg-transparent border-none text-left cursor-pointer text-text',
    'py-1.5 px-3 m-0',
    'transition-colors duration-fast ease-ease-out',
    'flex items-center gap-2 w-full min-w-[80px]',
    'text-11 font-normal leading-16 whitespace-nowrap',
    'hover:bg-surface-muted focus:outline-none',
  ],
  {
    variants: {
      focused: {
        true: 'bg-info-weak-bg text-primary',
        false: '',
      },
      disabled: {
        true: 'text-text-muted cursor-not-allowed opacity-disabled hover:bg-transparent',
        false: '',
      },
    },
    defaultVariants: {
      focused: false,
      disabled: false,
    },
  }
);

// SubItem trigger - justify between with chevron
export const subitemTriggerStyles =
  'justify-between [&_.chevron-icon]:flex-shrink-0 [&_.chevron-icon]:text-text-muted [&_.chevron-icon]:transition-colors [&_.chevron-icon]:duration-150';

// Chevron hover/focus state
export const chevronHoverStyles =
  'hover:[&_.chevron-icon]:text-primary [&.focused_.chevron-icon]:text-primary [&.disabled_.chevron-icon]:opacity-40';
