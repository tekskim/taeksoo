const headerInset = 'px-[15px] pt-[14px] pb-3';
const contentInset = 'px-[15px] pb-[11px]';

export const tcAccordionGroupClassnames = 'flex flex-col w-full gap-2';

export const tcAccordionItemClassnames =
  'block relative w-full overflow-hidden border border-border rounded-md';

export const tcAccordionHeaderClassnames = `group block w-full text-left cursor-pointer outline-none border-none transition-colors ${headerInset}`;

export const tcAccordionContentClassnames = [
  'grid grid-rows-[0fr] overflow-hidden transition-[grid-template-rows] duration-normal ease-out',
  '[&>*]:min-h-0 [&>*]:opacity-0 [&>*]:transition-opacity [&>*]:duration-fast [&>*]:ease-out',
].join(' ');

export const tcAccordionOpenClassnames =
  'grid-rows-[1fr] duration-slow overflow-x-auto overflow-y-hidden [&>*]:opacity-100 [&>*]:duration-normal [&>*]:delay-[100ms]';

export const tcAccordionClosedClassnames = 'grid-rows-[0fr]';

export const tcAccordionDividerWrapperClassnames = 'px-[15px]';

export const tcAccordionDividerClassnames = 'w-full border-t border-border';

export const tcAccordionContentPaddingClassnames = contentInset;
