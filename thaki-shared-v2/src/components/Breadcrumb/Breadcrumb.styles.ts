import { cva } from 'class-variance-authority';

// Breadcrumb container
export const breadcrumbStyles = 'flex items-center';

// Breadcrumb list
export const breadcrumbListStyles = 'flex items-center gap-1';

// Breadcrumb link button
export const breadcrumbLinkStyles = [
  'appearance-none bg-transparent border-none p-0 m-0',
  'cursor-pointer flex items-center',
  'hover:[&_.breadcrumb-text]:text-text',
].join(' ');

// Breadcrumb text
export const breadcrumbTextStyles = cva(
  ['font-sans text-11 font-medium leading-16 whitespace-nowrap', 'breadcrumb-text'],
  {
    variants: {
      current: {
        true: 'text-text',
        false: 'text-text-subtle',
      },
    },
    defaultVariants: {
      current: false,
    },
  }
);

// Separator
export const separatorStyles =
  'flex items-center justify-center size-2 flex-shrink-0 text-text-subtle [&_svg]:size-2';

// Skeleton container
export const breadcrumbSkeletonStyles = 'flex items-center';
