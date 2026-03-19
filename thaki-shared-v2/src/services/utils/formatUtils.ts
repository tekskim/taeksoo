type StringFormat =
  | 'lowercamelcase'
  | 'uppercamelcase'
  | 'snakecase'
  | 'normal'
  | 'titlecase';

/**
 * @description
 * 문자열 포맷을 서로 변환하는 함수입니다.
 * 지원하는 포맷:
 * - lowercamelcase: lowerCamelCase
 * - uppercamelcase: UpperCamelCase
 * - snakecase: snake_case
 * - normal: normal string format
 * - titlecase: Title Case (구분자 유지)
 *
 * @example:
 *   formatStringCase({ format: 'lowercamelcase', value: 'hello_world' }) // 'helloWorld'
 *   formatStringCase({ format: 'snakecase', value: 'helloWorld' }) // 'hello_world'
 *   formatStringCase({ format: 'titlecase', value: 'VERY_ACTIVE USER' }) // 'Very_active User'
 */
export const formatStringCase = ({
  format,
  value,
}: {
  format: StringFormat;
  value: string;
}): string => {
  if (format === 'normal') {
    // snake_case, camelCase, UpperCamelCase 모두 띄어쓰기로 변환
    return value
      .replace(/([A-Z])/g, ' $1') // camelCase, UpperCamelCase -> 띄어쓰기
      .replace(/[_-]/g, ' ') // snake_case, kebab-case -> 띄어쓰기
      .replace(/\s+/g, ' ') // 여러 공백 -> 하나로
      .trim()
      .replace(/^./, s => s.toUpperCase()); // 첫글자 대문자
  }

  if (format === 'titlecase') {
    // 구분자를 유지하면서 각 단어의 첫 글자만 대문자로 변환
    return value
      .toLocaleLowerCase()
      .replace(/\b\p{L}/gu, ch => ch.toLocaleUpperCase());
  }

  if (format === 'snakecase') {
    // camelCase, UpperCamelCase -> snake_case
    return value
      .replace(/([A-Z])/g, '_$1')
      .replace(/[\s-]+/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_/, '')
      .toLowerCase();
  }

  if (format === 'lowercamelcase') {
    // snake_case, kebab-case, 띄어쓰기 -> lowerCamelCase
    return value
      .replace(/[_\-\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
      .replace(/^([A-Z])/, m => m.toLowerCase());
  }

  if (format === 'uppercamelcase') {
    // snake_case, kebab-case, 띄어쓰기 -> UpperCamelCase
    return value
      .replace(/[_\-\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
      .replace(/^./, m => m.toUpperCase());
  }

  // 지원하지 않는 포맷이면 원본 반환
  return value;
};

export type { StringFormat };
