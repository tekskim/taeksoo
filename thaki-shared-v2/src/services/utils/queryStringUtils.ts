export type QueryParamPrimitive = string | number | boolean;

export type QueryParamValue =
  | QueryParamPrimitive
  | null
  | undefined
  | Array<QueryParamPrimitive | null | undefined>;

/**
 * query string을 객체로 파싱합니다.
 * - 중복 키는 string[]로 누적합니다. (예: a=1&a=2 → { a: ['1','2'] })
 * - 선행 '?'가 있어도 처리합니다.
 */
export const parseQueryString = (
  queryString?: string
): Record<string, string | string[]> => {
  if (!queryString) {
    return {};
  }

  const raw = queryString.startsWith('?') ? queryString.slice(1) : queryString;
  if (!raw) {
    return {};
  }

  const searchParams = new URLSearchParams(raw);
  const result: Record<string, string | string[]> = {};

  searchParams.forEach((value, key) => {
    const existing = result[key];
    if (existing === undefined) {
      result[key] = value;
      return;
    }
    if (Array.isArray(existing)) {
      result[key] = [...existing, value];
      return;
    }
    result[key] = [existing, value];
  });

  return result;
};

/**
 * query 객체를 안정적으로(stable) 직렬화합니다.
 * - key는 정렬하여 출력 순서를 고정합니다.
 * - undefined/null은 제외합니다.
 * - array는 같은 키를 반복 append합니다. (예: a=['1','2'] → a=1&a=2)
 */
export const serializeQuery = (query: Record<string, unknown>): string => {
  const keys = Object.keys(query).sort((a, b) => a.localeCompare(b));
  const searchParams = new URLSearchParams();

  keys.forEach(key => {
    const value = query[key];

    if (Array.isArray(value)) {
      value.forEach(item => {
        if (item === undefined || item === null) return;
        searchParams.append(key, String(item));
      });
      return;
    }

    if (value === undefined || value === null) return;
    searchParams.append(key, String(value));
  });

  return searchParams.toString();
};

/**
 * query 변경 여부를 안정적으로 비교합니다.
 * - key 정렬 + undefined/null 제외 + array 반복 규칙 기준으로 문자열 비교합니다.
 */
export const areQueryRecordsEqual = (
  a: Record<string, unknown>,
  b: Record<string, unknown>
): boolean => {
  return serializeQuery(a) === serializeQuery(b);
};
