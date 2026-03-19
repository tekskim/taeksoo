import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * @thakicloud/shared 패키지의 커스텀 폰트 사이즈를 지원하는 tailwind-merge 확장
 * text-10, text-12, text-14, text-16, text-18, text-24 등이 text-{color}와 충돌하지 않도록 설정
 */
const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      // 커스텀 폰트 사이즈를 별도 그룹으로 등록
      'font-size': [
        'text-9',
        'text-10',
        'text-11',
        'text-12',
        'text-14',
        'text-16',
        'text-18',
        'text-24',
        'text-32',
        'text-40',
        'text-Xs',
        'text-Sm',
        'text-Md',
        'text-Lg',
        'text-Xl',
        'text-control-sm',
        'text-control-md',
        'text-control-lg',
      ],
    },
  },
});

/**
 * Tailwind CSS 클래스를 병합하고 충돌을 해결하는 유틸리티 함수
 * - 커스텀 폰트 사이즈(text-11, text-12 등)를 올바르게 처리
 * - 폰트 사이즈와 텍스트 색상이 충돌하지 않음
 * @param inputs - 병합할 클래스 값들
 * @returns 병합된 클래스 문자열
 */
export function cn(...inputs: ClassValue[]): string {
  return customTwMerge(clsx(inputs));
}
