import { cva } from 'class-variance-authority';

/**
 * Toast 컨테이너 스타일
 * Figma: 264px width, 8px radius, 12px padding, white bg, border
 */
export const toastStyles = cva(
  'bg-surface border border-border border-solid rounded-base8 p-3 w-[264px] shadow-lg font-sans overflow-hidden transition-colors duration-fast',
  {
    variants: {
      clickable: {
        true: 'cursor-pointer hover:bg-surface-hover',
        false: 'cursor-default',
      },
    },
    defaultVariants: {
      clickable: false,
    },
  }
);

/**
 * Toast 내부 컨테이너 (아이콘 + 메시지 + 오른쪽 섹션)
 * Figma: 8px gap between elements
 */
export const toastContainerStyles = 'flex items-start gap-2 w-full';

/**
 * 상태 아이콘 스타일
 * Figma: 15x15 icon
 * - positive: green400 (#4ade80)
 * - negative: orange600 (#ea580c)
 */
export const statusIconStyles = cva('flex-shrink-0 inline-flex items-center justify-center', {
  variants: {
    type: {
      positive: '',
      negative: '',
    },
  },
  defaultVariants: {
    type: 'negative',
  },
});

/**
 * 메시지 컨텐츠 영역 (flexible width)
 */
export const toastContentStyles = 'flex-1 flex flex-col gap-2 items-start min-w-0';

/**
 * 메시지 텍스트 스타일
 * Figma: font-size-12, line-height-16, color slate-600
 */
export const messageStyles = 'm-0 font-sans text-12 leading-16 text-text-muted break-words';

/**
 * 리소스 이름 배지 스타일
 * Figma: info-weak-bg (#eff6ff), px-1.5 (6px), py-0.5 (2px), rounded-sm (4px)
 * font-size-11, line-height-16, slate-600 text
 */
export const resourceNameBadgeStyles =
  'inline-flex items-center justify-center px-1.5 py-0.5 rounded-sm bg-info-weak-bg text-11 leading-16 text-text-muted whitespace-nowrap';

/**
 * 확장 버튼 스타일
 * Figma: inline button with "View Detail" text + chevron icon
 */
export const expandButtonStyles =
  'inline-flex items-center gap-0.5 p-0 border-none bg-transparent cursor-pointer transition-colors duration-fast ease outline-none';

/**
 * View Detail 텍스트 스타일
 * Figma: font-size-12, line-height-16, font-medium, color slate-400
 */
export const viewDetailTextStyles =
  'text-12 leading-16 font-medium text-text-subtle whitespace-nowrap';

/**
 * 확장 아이콘 스타일 (회전 애니메이션)
 */
export const expandIconStyles = cva('transition-transform duration-200 ease-in-out', {
  variants: {
    expanded: {
      true: 'rotate-180',
      false: 'rotate-0',
    },
  },
  defaultVariants: {
    expanded: false,
  },
});

/**
 * 설명 컨테이너 스타일
 * Figma: slate-50 background, 8px padding, 6px radius
 */
export const descriptionContainerStyles = 'w-full bg-primitive-slate-50 rounded-base6 p-2';

/**
 * 설명 텍스트 스타일
 * Figma: font-size-12, line-height-16, color slate-500, subtle text
 */
export const descriptionStyles = 'm-0 font-sans text-12 leading-16 text-text-subtle break-words';

/**
 * 오른쪽 섹션 (닫기 버튼 + 타임스탬프)
 * Figma: 4px gap, items aligned to end
 */
export const toastRightSectionStyles = 'flex flex-col items-end gap-1 flex-shrink-0';

/**
 * 닫기 버튼 스타일
 * Figma: 20x20 button with 6px radius
 */
export const closeButtonStyles =
  'inline-flex items-center justify-center size-5 p-0.5 border-none rounded-base6 bg-transparent text-text-muted cursor-pointer transition-colors duration-fast ease hover:bg-border-muted hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2';

/**
 * 타임스탬프 텍스트 스타일
 * Figma: font-size-11, line-height-16, color slate-400
 */
export const timestampStyles = 'text-11 leading-16 text-text-subtle whitespace-nowrap';

/**
 * 앱 아이콘 컨테이너 스타일
 * Figma: 20x20 size
 */
export const appIconStyles = 'flex items-center justify-center size-5 rounded-sm overflow-hidden';
