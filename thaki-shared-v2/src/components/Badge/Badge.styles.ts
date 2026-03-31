import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center justify-center gap-1 rounded-[4px] font-sans font-medium whitespace-nowrap box-border min-w-[20px] text-center',
  {
    variants: {
      size: {
        sm: 'h-5 px-1.5 text-[11px] leading-[16px]',
        md: 'h-6 px-2 text-[13px] leading-[18px]',
      },
      theme: {
        red: '',
        ylw: '',
        gry: '',
        blu: '',
        gre: '',
        white: '',
      },
      type: {
        subtle: '',
        solid: '',
      },
    },
    compoundVariants: [
      // Blue theme
      { theme: 'blu', type: 'subtle', class: 'bg-[#dbeafe] text-[#1e40af]' },
      { theme: 'blu', type: 'solid', class: 'bg-[#2563eb] text-white' },
      // Red theme
      { theme: 'red', type: 'subtle', class: 'bg-[#fee2e2] text-[#dc2626]' },
      { theme: 'red', type: 'solid', class: 'bg-[#ef4444] text-white' },
      // Green theme
      { theme: 'gre', type: 'subtle', class: 'bg-[#dcfce7] text-[#16a34a]' },
      { theme: 'gre', type: 'solid', class: 'bg-[#22c55e] text-white' },
      // Yellow/Orange theme (TDS uses orange tones for warning)
      { theme: 'ylw', type: 'subtle', class: 'bg-[#ffedd5] text-[#ea580c]' },
      { theme: 'ylw', type: 'solid', class: 'bg-[#f97316] text-white' },
      // Gray theme
      { theme: 'gry', type: 'subtle', class: 'bg-[#f1f5f9] text-[#475569]' },
      { theme: 'gry', type: 'solid', class: 'bg-[#64748b] text-white' },
      // White theme (bordered)
      {
        theme: 'white',
        type: 'subtle',
        class: 'bg-white text-[#0f172a] shadow-[inset_0_0_0_1px_#e2e8f0]',
      },
      {
        theme: 'white',
        type: 'solid',
        class: 'bg-white text-[#0f172a] shadow-[inset_0_0_0_1px_#e2e8f0]',
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
