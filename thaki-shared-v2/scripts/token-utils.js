/**
 * 토큰 관련 공통 유틸리티 함수들
 */

/**
 * 소수점을 언더스코어로 변환
 */
const sanitizeKey = key => key.replace(/\./g, '_');

/**
 * 토큰 참조를 CSS Variable 이름으로 변환
 */
const createCSSVarName = parts => {
  const sanitizedParts = parts.map(sanitizeKey);
  return `var(--${sanitizedParts.join('-')})`;
};

/**
 * 토큰 참조를 실제 값으로 해결
 * 예: "{primitive.color.blue500}" → "var(--primitive-color-blue500)"
 */
export function resolveTokenReference(value, allTokens) {
  if (
    typeof value !== 'string' ||
    !value.startsWith('{') ||
    !value.endsWith('}')
  ) {
    return value;
  }

  const reference = value.slice(1, -1); // { } 제거
  const parts = reference.split('.');

  // 참조된 토큰 값 찾기
  let current = allTokens;
  for (const part of parts) {
    if (current && typeof current === 'object' && current[part] !== undefined) {
      current = current[part];
    } else {
      // 참조를 찾을 수 없으면 CSS Variable로 변환
      return createCSSVarName(parts);
    }
  }

  // 실제 값이면 그대로 반환, 또 다른 참조면 재귀적으로 해결
  return typeof current === 'string' && current.startsWith('{')
    ? resolveTokenReference(current, allTokens)
    : current;
}

/**
 * 객체를 CSS Variables로 변환
 */
export function generateCSSVarsFromObject(
  obj,
  prefix = '',
  allTokens = obj,
  indent = '  '
) {
  const cssLines = [];

  for (const [key, value] of Object.entries(obj)) {
    const sanitizedKey = sanitizeKey(key);
    const varName = `${prefix}-${sanitizedKey}`;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // 중첩 객체 처리 (재귀)
      const nestedCSS = generateCSSVarsFromObject(
        value,
        varName,
        allTokens,
        indent
      );
      if (nestedCSS) {
        cssLines.push(nestedCSS);
      }
    } else {
      // 값이 토큰 참조인지 확인하고 해결
      const resolvedValue = resolveTokenReference(value, allTokens);
      cssLines.push(`${indent}--${varName}: ${resolvedValue};`);
    }
  }

  return cssLines.join('\n') + (cssLines.length > 0 ? '\n' : '');
}
