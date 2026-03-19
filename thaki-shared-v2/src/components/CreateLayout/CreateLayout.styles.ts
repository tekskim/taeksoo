import { cva } from 'class-variance-authority';

/**
 * CreateLayout 스타일 정의
 *
 * 생성 페이지의 레이아웃을 구성하는 스타일입니다.
 * - 페이지 타이틀
 * - 좌측 콘텐츠 영역 (스크롤)
 * - 우측 FloatingCard 영역 (스크롤 시 고정)
 *
 * sticky 동작을 위한 핵심 구조:
 * - 스크롤 컨테이너가 height를 가져야 함
 * - sidebar의 부모가 스크롤 컨테이너여야 함
 * - sidebar에 align-self: start 필요
 */

export const createLayoutContainerStyles = cva('w-full min-h-full');

export const createLayoutInnerStyles = cva('bg-surface min-h-full', {
  variants: {
    minWidth: {
      sm: 'min-w-[800px]',
      md: 'min-w-[1024px]',
      lg: 'min-w-[1176px]',
      xl: 'min-w-[1400px]',
      none: '',
    },
  },
  defaultVariants: {
    minWidth: 'lg',
  },
});

export const createLayoutHeaderStyles = cva('shrink-0 py-3');

export const createLayoutContentStyles = cva('flex gap-6 items-start w-full');

export const createLayoutMainStyles = cva('relative z-0 flex-1 min-w-0');

export const createLayoutSidebarStyles = cva(
  'relative z-20 shrink-0 sticky top-4 self-start h-fit',
  {
    variants: {
      width: {
        sm: 'w-[280px]',
        md: 'w-[312px]',
        lg: 'w-[360px]',
      },
    },
    defaultVariants: {
      width: 'md',
    },
  }
);

/**
 * Sidebar inner wrapper 스타일
 * Figma: bg-white, border, rounded-lg, pt-3 px-3 pb-4, gap-3
 */
export const createLayoutSidebarInnerStyles = cva(
  'flex flex-col gap-3 bg-surface border border-border rounded-base8 pt-3 px-3 pb-4'
);
