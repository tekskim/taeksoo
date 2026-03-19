/**
 * ActionModal Tailwind Styles
 *
 * Figma 디자인 토큰 기반:
 * - Modal: w-[344px], p-4, rounded-base16, gap-6
 * - Footer: mt-6, gap-2, buttons flex-1
 */

// 모달 컨테이너 스타일 - 344px 너비, 16px radius, 16px padding
export const actionModalStyles = [
  // 너비 오버라이드 (344px)
  '!w-[344px] max-w-[90vw]',
  // border-radius 오버라이드 (16px)
  '![border-radius:var(--semantic-radius-base16)]',
  // 헤더 패딩 제거 및 간격 조정 (header: mb-4)
  '[&>header]:!mb-4',
].join(' ');

// 모달 내용 래퍼 스타일 - gap 24px
export const modalContentStyles = 'flex flex-col gap-6 w-full box-border';

// 푸터 컨테이너 스타일 - gap 8px, margin-top 24px
export const footerContainerStyles =
  'mt-6 flex gap-2 w-full justify-end [&>button]:flex-1 [&>button]:min-w-[80px] px-4 pb-4';
