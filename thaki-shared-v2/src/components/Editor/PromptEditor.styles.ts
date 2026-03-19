import { cva, type VariantProps } from 'class-variance-authority';

export const promptEditorStyles = cva(
  [
    'p-3 box-border',
    'border border-solid border-border rounded-control',
  ],
  {
    variants: {
      size: {
        xs: 'w-10 h-[5rem]',
        sm: 'w-20 h-[10rem]',
        md: 'w-[60rem] h-[30rem]',
        lg: 'w-[100rem] h-[50rem]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export type PromptEditorStyleVariants = VariantProps<typeof promptEditorStyles>;
