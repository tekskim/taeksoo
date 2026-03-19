export const toggleWrapperStyles =
  'flex items-center gap-2 cursor-pointer select-none [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] has-[:disabled]:opacity-disabled has-[:disabled]:cursor-not-allowed';

export const toggleInputStyles = 'peer absolute size-1 opacity-0 pointer-events-none';

export const toggleTrackStyles =
  'relative w-9 h-5 rounded-full bg-border transition-colors duration-200 ease-out peer-checked:bg-primary peer-disabled:opacity-disabled peer-checked:[&>div]:translate-x-4';

export const toggleThumbStyles =
  'absolute top-1 left-1 size-3 rounded-full bg-surface transition-transform duration-200 ease-out';

export const toggleLabelStyles = 'font-sans text-12 font-normal leading-16 text-text select-none';
