import { cva } from 'class-variance-authority';

export const detailCardStyles = cva(
  'flex flex-col gap-3 bg-surface border border-border rounded-md box-border px-4 pt-3 pb-4 min-w-0 overflow-hidden'
);

export const cardHeaderStyles = 'flex items-center justify-between';

export const cardTitleStyles = 'm-0 text-text text-14 font-medium leading-20';

export const cardContentStyles = cva(
  'flex flex-col gap-3 w-full box-border px-4 pt-3 pb-4 [&>*]:box-border min-w-0 overflow-hidden',
  {
    variants: {
      standalone: {
        true: 'pt-0',
      },
      insideCard: {
        true: 'p-0',
      },
    },
  }
);

export const fieldDlStyles = 'flex flex-col gap-0 m-0 w-full min-w-0';

export const fieldRowStyles = cva(
  'flex flex-col gap-1.5 items-start py-3 w-full box-border min-w-0',
  {
    variants: {
      isFirst: {
        true: 'border-t border-border-subtle',
      },
      hasTopBorder: {
        true: 'border-t border-border-subtle',
      },
      isLast: {
        true: 'pb-0',
      },
      topAlign: {
        true: 'items-start',
      },
    },
  }
);

export const fieldLabelStyles =
  'm-0 text-text-subtle text-11 font-medium leading-16';

export const fieldValueStyles =
  'm-0 flex items-center gap-4 text-text w-full min-w-0 overflow-hidden';

export const fieldValueTextStyles =
  'text-12 font-normal leading-16 [&>*]:!text-12 [&>*]:!leading-16 [&>*]:!font-normal';
