import type { HTMLAttributes, ReactNode } from 'react';

/* ----------------------------------------
   Stack Types
   ---------------------------------------- */

export type StackDirection = 'row' | 'column';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type StackSpacing = 0 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /** 방향 */
  direction?: StackDirection;
  /** 정렬 (align-items) */
  align?: StackAlign;
  /** 배치 (justify-content) */
  justify?: StackJustify;
  /** 간격 */
  gap?: StackSpacing;
  /** 줄바꿈 여부 */
  wrap?: boolean;
  /** 스택 내용 */
  children: ReactNode;
}

/* ----------------------------------------
   Style Mappings
   ---------------------------------------- */

const directionStyles: Record<StackDirection, string> = {
  row: 'flex-row',
  column: 'flex-col',
};

const alignStyles: Record<StackAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const justifyStyles: Record<StackJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const gapStyles: Record<StackSpacing, string> = {
  0: 'gap-0',
  1: 'gap-1',
  1.5: 'gap-1.5',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
  16: 'gap-16',
  20: 'gap-20',
  24: 'gap-24',
};

/* ----------------------------------------
   Stack Component
   ---------------------------------------- */

export function Stack({
  direction = 'column',
  align = 'stretch',
  justify = 'start',
  gap = 6,
  wrap = false,
  children,
  className = '',
  ...props
}: StackProps) {
  const classes = [
    'flex',
    directionStyles[direction],
    alignStyles[align],
    justifyStyles[justify],
    gapStyles[gap],
    wrap ? 'flex-wrap' : '',
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

/* ----------------------------------------
   HStack & VStack Shortcuts
   ---------------------------------------- */

export type HStackProps = Omit<StackProps, 'direction'>;
export type VStackProps = Omit<StackProps, 'direction'>;

export function HStack(props: HStackProps) {
  return <Stack direction="row" {...props} />;
}

export function VStack(props: VStackProps) {
  return <Stack direction="column" {...props} />;
}
