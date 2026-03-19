// DatePicker Tailwind styles for non-global elements

export const rootStyles =
  'bg-surface border border-solid border-border rounded-base8 p-3 w-fit flex flex-col gap-3';

export const customHeaderStyles =
  'flex items-center justify-start gap-2 h-6 m-0 p-0';

export const navButtonStyles = [
  'w-6 h-6 p-0 m-0',
  'flex items-center justify-center',
  'border-none bg-transparent cursor-pointer',
  'rounded-base4 transition-all duration-150 ease-in-out',
  'flex-shrink-0 text-text',
  'hover:enabled:bg-surface-hover',
  'disabled:opacity-50 disabled:cursor-not-allowed',
].join(' ');

export const monthLabelStyles = [
  'font-sans text-16 font-semibold leading-24',
  'text-text',
  'm-0 p-0 text-center whitespace-nowrap',
].join(' ');

export const buttonGroupStyles =
  'flex justify-end items-center gap-2 w-full [&>button]:flex-1 [&>button]:min-w-[80px]';

export const monthStyles = 'm-0 p-0 w-full flex flex-col gap-3';

export const weekdaysStyles = 'flex flex-nowrap gap-1.5 mb-1.5 m-0 p-0 w-full';

export const weekdayStyles =
  'flex-none w-8 h-5 py-0.5 px-2 font-sans text-11 font-medium leading-16 text-text-muted text-center capitalize m-0 border-0 bg-transparent box-border';

export const weeksStyles = 'flex flex-col gap-1.5 m-0 p-0';

export const weekStyles = 'flex flex-nowrap gap-1.5 m-0 p-0 w-full';

export const dayStyles = [
  'flex-none w-8 h-8 p-0 m-0 relative box-border',
  "before:content-[''] before:absolute before:top-0 before:left-[-3px] before:right-[-3px] before:bottom-0 before:bg-transparent before:z-0 before:pointer-events-none",
].join(' ');

export const dayRangeMiddleStyles = 'before:bg-info-weak-bg';

export const dayRangeStartStyles =
  'before:bg-[linear-gradient(to_right,transparent_50%,var(--semantic-color-infoWeakBg)_50%)]';

export const dayRangeEndStyles =
  'before:bg-[linear-gradient(to_right,var(--semantic-color-infoWeakBg)_50%,transparent_50%)]';

export const dayRangeSameStyles = 'before:bg-transparent';

export const dayButtonStyles = [
  'w-8 h-8 p-2 m-0',
  'font-sans text-12 font-medium leading-16 text-text',
  'border-0 rounded-full bg-transparent cursor-pointer',
  'flex items-center justify-center relative z-[1] transition-all duration-150 ease',
  'hover:enabled:bg-surface-hover',
  'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
  'disabled:text-text-light disabled:bg-transparent disabled:cursor-not-allowed disabled:opacity-40 disabled:pointer-events-none',
].join(' ');

export const dayButtonSelectedStyles =
  'bg-primary text-on-primary hover:enabled:bg-primary-hover';

export const dayButtonRangeMiddleStyles =
  'bg-transparent text-text rounded-none hover:enabled:bg-info-weak-bg hover:enabled:rounded-full';

export const dayButtonOutsideStyles = 'text-text-muted';

export const dayButtonTodayStyles =
  "after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary";
