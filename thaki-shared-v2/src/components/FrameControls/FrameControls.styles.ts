import { cva } from 'class-variance-authority';

export const windowControlsStyles = 'flex items-center gap-xs select-none flex-shrink-0 pr-2';

export const controlButtonStyles = cva(
  [
    'flex items-center justify-center',
    'border-none bg-transparent cursor-pointer rounded-sm',
    'transition-all duration-normal ease-in-out',
    'outline-none relative',
    'hover:bg-surface-hover',
    'disabled:cursor-not-allowed disabled:opacity-disabled',
    'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1',
  ],
  {
    variants: {
      size: {
        sm: 'w-lg h-lg',
        md: 'w-xl h-xl',
        lg: 'w-2xl h-2xl',
      },
      pressed: {
        true: 'bg-surface-pressed scale-95',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  }
);

export const controlIconStyles = cva(
  'font-bold leading-none text-text-muted transition-colors duration-normal',
  {
    variants: {
      size: {
        sm: 'text-11',
        md: 'text-14',
        lg: 'text-16',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  }
);

export const controlWrapperStyles = 'relative inline-block';

export const snapPanelStyles = cva(
  [
    'relative',
    'flex flex-col items-start',
    'bg-text rounded-[4px]',
    'min-w-[60px] max-w-[230px]',
    // Fade-in animation (keyframes in global.css)
    'animate-[snapPanelFadeIn_150ms_ease-out_forwards]',
  ],
  {
    variants: {
      size: {
        // Figma: pt=4px, pb=8px, px=8px, gap=8px
        sm: 'gap-[8px] pt-[4px] pb-[8px] px-[8px]',
        md: 'gap-sm pt-xs pb-sm px-sm',
        lg: 'gap-md pt-sm pb-md px-md',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  }
);

export const snapOptionStyles = cva(
  [
    'inline-flex items-center justify-center',
    'border-none bg-transparent text-text-muted cursor-pointer',
    'transition-all duration-fast ease-in-out',
    'outline-none rounded-xs',
    'hover:text-text-inverse hover:bg-text/10',
    'active:scale-[0.96]',
    'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1',
  ],
  {
    variants: {
      size: {
        // Figma: icons are 24x24
        sm: 'w-[24px] h-[24px]',
        md: 'w-[28px] h-[28px]',
        lg: 'w-[32px] h-[32px]',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  }
);

export const snapIconStyles = cva('leading-none', {
  variants: {
    size: {
      // Figma: icons are 24x24
      sm: 'w-[24px] h-[24px]',
      md: 'w-[28px] h-[28px]',
      lg: 'w-[32px] h-[32px]',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

export const snapArrowStyles = cva(
  'absolute left-1/2 -translate-x-1/2 w-0 h-0 border-solid border-transparent border-b-text',
  {
    variants: {
      size: {
        sm: 'bottom-full border-b-[4px] border-x-[3.5px]',
        md: 'bottom-full border-b-[5px] border-x-[4.5px]',
        lg: 'bottom-full border-b-[6px] border-x-[5.5px]',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  }
);

export const snapLabelStyles = cva('text-text-muted whitespace-nowrap', {
  variants: {
    size: {
      // Figma: 11px font, 16px line-height
      sm: 'text-[11px] leading-[16px]',
      md: 'text-[12px] leading-[18px]',
      lg: 'text-[14px] leading-[20px]',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

export const snapOptionsContainerStyles = cva('flex items-center', {
  variants: {
    size: {
      sm: 'gap-[10px]',
      md: 'gap-sm',
      lg: 'gap-md',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});
