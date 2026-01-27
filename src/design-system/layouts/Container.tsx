import type { HTMLAttributes, ReactNode } from 'react';

/* ----------------------------------------
   Container Types
   ---------------------------------------- */

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** 최대 너비 */
  size?: ContainerSize;
  /** 중앙 정렬 여부 */
  centered?: boolean;
  /** 내부 패딩 여부 */
  padding?: boolean;
  /** 컨테이너 내용 */
  children: ReactNode;
}

/* ----------------------------------------
   Size Styles
   ---------------------------------------- */

const sizes = {
  sm: 'max-w-screen-sm', // 640px
  md: 'max-w-screen-md', // 768px
  lg: 'max-w-screen-lg', // 1024px
  xl: 'max-w-screen-xl', // 1280px
  full: 'max-w-full',
} as const;

/* ----------------------------------------
   Container Component
   ---------------------------------------- */

export function Container({
  size = 'lg',
  centered = true,
  padding = true,
  children,
  className = '',
  ...props
}: ContainerProps) {
  const classes = [
    'w-full',
    sizes[size],
    centered ? 'mx-auto' : '',
    padding ? 'px-4 sm:px-6 lg:px-8' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
