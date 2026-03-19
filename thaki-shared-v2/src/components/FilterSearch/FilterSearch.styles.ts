/**
 * FilterSearch component Tailwind styles
 * Shared across FilterSearchInput, FilterLabel, FilterSearchResults
 */

// FilterSearch shared styles (used by FilterSearchInput.tsx)
export const filterSearchStyles = {
  root: 'w-full',
  searchInputWrapper: 'w-[280px]',
  filterControls: 'items-start',

  // Containers
  searchContainer: 'relative w-[280px] flex-shrink-0',
  selectContainer: 'relative w-[280px] flex-shrink-0',
  dateRangeContainer: 'relative w-[280px] flex-shrink-0 [&>div:last-child]:absolute [&>div:last-child]:top-[calc(100%+var(--semantic-space-xs))] [&>div:last-child]:left-0 [&>div:last-child]:z-[1000]',

  // Input wrapper
  inputWrapper:
    'relative w-[280px] h-7 flex items-center bg-surface border border-border-strong rounded-base6 py-2 pl-2.5 pr-2 transition-all duration-200 text-11 leading-[1.125rem] focus-within:border-focus focus-within:shadow-[0_0_0_1px_var(--semantic-color-focus)]',

  // Search/value inputs
  searchInput:
    'flex-1 border-none bg-transparent p-0 font-sans text-11 font-regular leading-16 outline-none cursor-text placeholder:text-text-subtle',
  valueInput:
    'flex-1 min-w-[100px] border-none bg-transparent p-0 font-sans text-11 font-regular leading-16 outline-none cursor-text placeholder:text-text-subtle',

  // Search icon
  searchIcon: 'flex items-center justify-center flex-shrink-0 w-3 h-3 ml-auto',

  // Input mode container
  inputModeContainer:
    'bg-surface ring-1 ring-inset ring-border-strong rounded-base6 py-1 px-2 flex items-center gap-1 min-w-[280px] focus-within:ring-focus focus-within:shadow-[0_0_0_1px_var(--semantic-color-focus)]',

  // Inline value input
  valueInputInline:
    'border-none bg-transparent p-0 font-sans text-11 font-regular leading-16 text-text outline-none cursor-text w-full placeholder:text-text-subtle',

  // Select trigger
  selectTrigger:
    'flex-1 border-none bg-transparent p-0 font-sans text-11 font-regular leading-16 text-text text-left cursor-pointer outline-none min-w-[80px] whitespace-nowrap overflow-hidden text-ellipsis hover:opacity-80',

  // Dropdown list
  dropdownList:
    'absolute top-[calc(100%+var(--semantic-space-xs))] left-0 right-0 bg-surface border border-border-strong rounded-base6 shadow-lg max-h-[300px] overflow-y-auto z-[1000]',

  // Dropdown item
  dropdownItem:
    'w-full min-w-[80px] py-1.5 px-2.5 bg-surface border-none border-b border-border-muted cursor-pointer text-left font-sans text-11 font-medium leading-16 text-text transition-colors duration-200 flex items-center first:rounded-t-base6 last:rounded-b-base6 last:border-b-0 hover:bg-surface-hover focus:outline-2 focus:outline-focus focus:-outline-offset-2',

  // Clear button
  clearButton: 'whitespace-nowrap',
} as const;

// FilterLabel styles
export const filterLabelStyles = {
  filterLabel:
    'bg-surface border border-border rounded-base4 py-0.5 pl-2 pr-1.5 flex items-center gap-1.5 flex-shrink-0',
  labelText: 'font-sans text-11 font-medium leading-16 text-text whitespace-nowrap',
  separator: 'font-sans text-11 leading-16 text-border whitespace-nowrap',
} as const;

// FilterSearchInput styles
export const filterSearchInputStyles = {
  root: 'w-[280px]',
} as const;

// FilterSearchResults styles
export const filterSearchResultsStyles = {
  root: 'w-full bg-surface-muted rounded-md p-2',
  content: 'items-center justify-between',
  tagsWrapper: 'flex flex-wrap gap-1 flex-1 min-w-0',
  clearButton: 'whitespace-nowrap flex-shrink-0',
} as const;
