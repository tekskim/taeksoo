export const infoContainerStyles = {
  root: 'flex w-full flex-col gap-1.5 rounded-base8 bg-[var(--primitive-color-gray50)] py-3 px-4',
  label: 'font-sans text-11 font-medium leading-16 text-text-muted whitespace-nowrap',
  values: 'flex flex-col gap-2',
  valuesScroll:
    'max-h-[calc(var(--primitive-space-4)*3+var(--primitive-space-1)*2)] overflow-y-auto pr-1',
  value: 'font-sans text-12 font-normal leading-16 text-text whitespace-normal break-words',
  list: 'list-disc m-0 pl-[calc(var(--primitive-space-4)+0.125rem)] text-text',
  listItem: 'font-sans text-12 font-normal leading-16 mb-0',
} as const;
