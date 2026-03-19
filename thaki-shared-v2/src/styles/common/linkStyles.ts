import { cva } from 'class-variance-authority';

/**
 * 공통 Link 스타일 (Tailwind)
 *
 * DetailCard 내부에서 사용 시 [&>*]:!font-normal 스타일을 오버라이드하기 위해
 * !font-medium을 사용합니다.
 *
 * @example
 * import { linkStyles } from '@thaki/shared';
 *
 * <button className={linkStyles()}>Link Text</button>
 */
export const linkStyles = cva(
  [
    // 버튼 기본 스타일 리셋
    'inline-flex items-center gap-1.5',
    'bg-transparent border-0 p-0 m-0',
    'cursor-pointer',
    'min-w-0',

    // 링크 텍스트 스타일
    'text-primary',
    'font-medium',
    'text-12 leading-16',
    'no-underline',

    // 텍스트 오버플로우 처리
    'whitespace-nowrap overflow-hidden text-ellipsis max-w-full',

    // hover 스타일 - text-decoration은 텍스트에만 적용됨
    'hover:underline hover:underline-offset-[3px]',
  ]
);

/**
 * Link focus-visible 스타일 (별도 적용 필요 시)
 */
export const linkFocusStyles =
  'focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 focus-visible:rounded-xs';

/**
 * linkStyles + focusStyles 조합
 */
export const linkStylesWithFocus = (
  options?: Parameters<typeof linkStyles>[0]
): string => `${linkStyles(options)} ${linkFocusStyles}`;

