import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
  // Base styles
  'inline-flex items-center gap-1 rounded-base6 font-sans font-medium whitespace-nowrap box-border',
  {
    variants: {
      size: {
        sm: 'py-0.5 px-1.5 text-11 leading-16',
        md: 'py-1 px-2 text-12 leading-16',
        lg: 'py-1 px-3 text-14 leading-20',
      },
      theme: {
        red: '',
        ylw: '',
        gry: '',
        blu: '',
        gre: '',
      },
      type: {
        subtle: '',
        solid: '',
      },
    },
    compoundVariants: [
      // Red theme
      {
        theme: 'red',
        type: 'subtle',
        class: 'text-primitive-red-600 bg-primitive-red-50',
      },
      {
        theme: 'red',
        type: 'solid',
        class: 'text-primitive-red-50 bg-primitive-red-600',
      },
      // Yellow theme
      {
        theme: 'ylw',
        type: 'subtle',
        class: 'text-primitive-yellow-500 bg-primitive-yellow-50',
      },
      {
        theme: 'ylw',
        type: 'solid',
        class: 'text-primitive-yellow-50 bg-primitive-yellow-500',
      },
      // Gray theme
      {
        theme: 'gry',
        type: 'subtle',
        class: 'text-text-muted bg-primitive-blueGray-100',
      },
      {
        theme: 'gry',
        type: 'solid',
        class: 'text-primitive-blueGray-50 bg-text-muted',
      },
      // Blue theme
      {
        theme: 'blu',
        type: 'subtle',
        class: 'text-primitive-blue-500 bg-primitive-blue-50',
      },
      {
        theme: 'blu',
        type: 'solid',
        class: 'text-primitive-blue-50 bg-primitive-blue-500',
      },
      // Green theme
      {
        theme: 'gre',
        type: 'subtle',
        class: 'text-primitive-green-600 bg-primitive-green-50',
      },
      {
        theme: 'gre',
        type: 'solid',
        class: 'text-primitive-green-50 bg-primitive-green-600',
      },
    ],
    defaultVariants: {
      size: 'md',
      theme: 'gry',
      type: 'subtle',
    },
  }
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
