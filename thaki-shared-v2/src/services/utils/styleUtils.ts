import { clsx } from 'clsx';

/**
 * 파라미터로 들어온 객체의 key값인 클래스네임들을 module css에서 해시화된 클래스네임들로 매핑해주는 함수입니다.
 *
 * @param styles - 클래스네임에 대한 매핑 객체
 * @returns 클래스 문자열을 반환하는 함수
 */
const bindClsx = (styles: Record<string, string>) => {
  return (...args: Parameters<typeof clsx>) => {
    return clsx(...args)
      .split(' ') // 공백 기준으로 나눔
      .map((c) => c.trim()) // 앞뒤 공백 제거
      .filter(Boolean) // falsy 값 제거 (e.g. '')
      .map((cls) => `${styles[cls] || ''} ${cls || ''}`) // 해시가 붙어 있는 클래스네임과 원래 클래스네임을 모두 반환
      .map((c) => c.trim()) // 앞뒤 공백 제거
      .join(' ');
  };
};

export { bindClsx };
