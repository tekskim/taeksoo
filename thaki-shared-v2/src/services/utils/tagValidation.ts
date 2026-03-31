/**
 * 태그 유효성 검사 공통 유틸
 *
 * - Key: 필수, 1~256자, 허용 문자 패턴 검증
 * - Value: 선택, 0~256자 (빈 값/null 허용), 허용 문자 패턴 검증
 * - Key 대소문자 구분 중복 검사
 * - touched 기반 에러 i18n 키 반환
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Tag {
  key: string;
  value: string;
}

export type TagFieldError = 'required' | 'tooLong' | 'duplicate' | 'invalidChars';

export interface TagErrors {
  key?: TagFieldError;
  value?: Exclude<TagFieldError, 'duplicate'>;
}

export interface TagValidationResult {
  errors: Record<number, TagErrors>;
  duplicateIndices: Set<number>;
}

export interface TouchedTagFields {
  key?: boolean;
  value?: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** 태그 Key/Value 최대 길이 */
export const MAX_TAG_LENGTH = 256;

/**
 * Security: 태그 Key/Value에 허용된 문자 패턴
 * 영문 대소문자, 숫자, 언더스코어, 하이픈, 점, 콜론, 슬래시, 등호, @, 한중일 문자
 */
const SAFE_TAG_PATTERN = /^[\w\-_.=:@/\u4e00-\u9fa5\uAC00-\uD7AF]+$/;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

type FieldErrorType = 'required' | 'tooLong' | 'invalidChars';

/** Key 필드 유효성 검사 (필수, 1~256자) */
const validateKeyField = (value: string): FieldErrorType | null => {
  if (!value.trim()) return 'required';
  if (value.length > MAX_TAG_LENGTH) return 'tooLong';
  if (!SAFE_TAG_PATTERN.test(value)) return 'invalidChars';
  return null;
};

/** Value 필드 유효성 검사 (선택, 0~256자, 빈 값/null 허용) */
const validateValueField = (
  value: string | null | undefined
): Exclude<FieldErrorType, 'required'> | null => {
  if (!value || !value.trim()) return null; // 빈 값/null 허용
  if (value.length > MAX_TAG_LENGTH) return 'tooLong';
  if (!SAFE_TAG_PATTERN.test(value)) return 'invalidChars';
  return null;
};

/** 에러 우선순위 테이블 — 위에서부터 순서대로 매칭, 첫 매치의 i18n 키 반환 */
const ERROR_KEY_TABLE: Array<{
  match: (k: TagErrors['key'], v: TagErrors['value'], t: TouchedTagFields) => boolean;
  i18nKey: string;
}> = [
  // required (Key만 필수, Value는 빈 값 허용)
  {
    match: (k, _v, t) => k === 'required' && !!t.key,
    i18nKey: 'tagInput.error.keyRequired',
  },
  // duplicate (대소문자 구분)
  {
    match: (k, _v, t) => k === 'duplicate' && !!t.key,
    i18nKey: 'tagInput.error.duplicateKey',
  },
  // invalidChars
  {
    match: (k, v, t) => k === 'invalidChars' && v === 'invalidChars' && !!t.key && !!t.value,
    i18nKey: 'tagInput.error.keyAndValueInvalidChars',
  },
  {
    match: (k, _v, t) => k === 'invalidChars' && !!t.key,
    i18nKey: 'tagInput.error.keyInvalidChars',
  },
  {
    match: (_k, v, t) => v === 'invalidChars' && !!t.value,
    i18nKey: 'tagInput.error.valueInvalidChars',
  },
  // tooLong
  {
    match: (k, v, t) => k === 'tooLong' && v === 'tooLong' && !!t.key && !!t.value,
    i18nKey: 'tagInput.error.keyAndValueTooLong',
  },
  {
    match: (k, _v, t) => k === 'tooLong' && !!t.key,
    i18nKey: 'tagInput.error.keyTooLong',
  },
  {
    match: (_k, v, t) => v === 'tooLong' && !!t.value,
    i18nKey: 'tagInput.error.valueTooLong',
  },
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * 태그 배열의 유효성을 검사합니다.
 */
export const validateTags = (tags: Tag[]): TagValidationResult => {
  const errors: Record<number, TagErrors> = {};
  const duplicateIndices = new Set<number>();
  const keyIndices = new Map<string, number[]>();

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    const keyError = validateKeyField(tag.key);
    const valueError = validateValueField(tag.value);

    if (keyError || valueError) {
      errors[i] = {
        ...(keyError && { key: keyError }),
        ...(valueError && { value: valueError }),
      };
    }

    // Key가 유효할 때만 중복 검사 대상에 추가 (대소문자 구분)
    if (!keyError) {
      const indices = keyIndices.get(tag.key);
      if (indices) {
        indices.push(i);
      } else {
        keyIndices.set(tag.key, [i]);
      }
    }
  }

  // 중복 Key 마킹
  keyIndices.forEach((indices) => {
    if (indices.length > 1) {
      for (const i of indices) {
        duplicateIndices.add(i);
        errors[i] = { ...errors[i], key: 'duplicate' };
      }
    }
  });

  return { errors, duplicateIndices };
};

/**
 * touched 상태인 필드의 에러를 i18n 키로 변환합니다.
 * 반환된 키는 `global` 네임스페이스 기준입니다.
 */
export const getTagErrorKey = (
  tagErrors: TagErrors | undefined,
  touched: TouchedTagFields | undefined
): string | null => {
  if (!tagErrors || !touched) return null;

  for (const { match, i18nKey } of ERROR_KEY_TABLE) {
    if (match(tagErrors.key, tagErrors.value, touched)) {
      return i18nKey;
    }
  }

  return null;
};

/**
 * 태그 삭제 시 touched 상태를 재조정합니다.
 */
export const reindexTouchedTags = (
  prev: Record<number, TouchedTagFields>,
  removedIndex: number
): Record<number, TouchedTagFields> =>
  Object.entries(prev).reduce<Record<number, TouchedTagFields>>((acc, [key, value]) => {
    const idx = Number(key);
    if (idx < removedIndex) {
      acc[idx] = value;
    } else if (idx > removedIndex) {
      acc[idx - 1] = value;
    }
    return acc;
  }, {});
