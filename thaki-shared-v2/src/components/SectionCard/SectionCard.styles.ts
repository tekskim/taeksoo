import { cva } from 'class-variance-authority';

export const sectionCardStyles = cva(
  'flex flex-col items-start gap-4 bg-surface rounded-md w-full min-w-0 overflow-hidden box-border',
  {
    variants: {
      isActive: {
        true: 'border-2 border-primary pt-[14px] pb-[11px] px-[15px]',
        false: 'border border-border pt-4 pb-3 px-4',
      },
    },
    defaultVariants: { isActive: false },
  }
);

export const headerWrapperStyles = cva('flex flex-col w-full', {
  variants: {
    showDivider: {
      true: 'pb-3 border-b border-border-subtle',
      false: 'gap-3',
    },
  },
  defaultVariants: { showDivider: true },
});

export const headerRowStyles = 'flex items-center justify-between w-full h-7';

export const headerTitleStyles =
  'm-0 text-text text-16 font-semibold leading-24 h-7 flex items-center';

export const headerDescriptionStyles = 'text-11 leading-16 text-text-subtle';

export const contentStyles = cva('flex flex-col w-full min-w-0', {
  variants: {
    showDividers: {
      true: 'gap-3',
      false: 'gap-0',
    },
  },
  defaultVariants: { showDividers: true },
});

export const dataRowDividerStyles = 'h-px w-full bg-border-subtle';

export const dataRowStyles = 'flex flex-col gap-1.5 w-full';

export const dataRowLabelStyles = 'm-0 text-text-subtle text-11 font-medium leading-16';

export const dataRowValueStyles =
  'm-0 flex items-center gap-4 text-text w-full min-w-0 overflow-hidden text-12 leading-16';

export const dataRowValueTextStyles =
  'text-12 font-normal leading-16 [&>*]:!text-12 [&>*]:!leading-16 [&>*]:!font-normal';

export const fieldsApiContentStyles = cva(
  'flex flex-col gap-3 w-full box-border px-4 pt-3 pb-4 [&>*]:box-border min-w-0 overflow-hidden',
  {
    variants: {
      standalone: { true: 'pt-0' },
      insideCard: { true: 'p-0' },
    },
  }
);

export const fieldsDlStyles = 'flex flex-col gap-0 m-0 w-full min-w-0';

export const fieldsRowStyles = cva(
  'flex flex-col gap-1.5 items-start py-3 w-full box-border min-w-0',
  {
    variants: {
      isFirst: { true: 'border-t border-border-subtle' },
      hasTopBorder: { true: 'border-t border-border-subtle' },
      isLast: { true: 'pb-0' },
      topAlign: { true: 'items-start' },
    },
  }
);

export const fieldsLabelStyles = 'm-0 text-text-subtle text-11 font-medium leading-16';

export const fieldsValueStyles =
  'm-0 flex items-center gap-4 text-text w-full min-w-0 overflow-hidden';
