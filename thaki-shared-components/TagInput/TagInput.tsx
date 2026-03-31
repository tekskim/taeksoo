import React, {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import Layout from '../Layout/Layout';
import Input from '../Input/Input';
import { Button } from '../Button/Button';
import { AddIcon, CloseSmallIcon } from '../Icon/svg/wrapped';
import {
  validateTags as defaultValidateTags,
  reindexTouchedTags,
} from '../../services/utils/tagValidation';
import type {
  Tag,
  TagErrors,
  TagValidationResult,
  TouchedTagFields,
} from '../../services/utils/tagValidation';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

/** 태그 컴포넌트에서 사용하는 라벨 문자열. 사용처에서 번역된 값을 주입합니다. */
export interface TagInputLabels {
  /** "추가" 버튼 텍스트 (기본: "Add") */
  add?: string;
  /** Key 라벨 텍스트 (기본: "Key") */
  key?: string;
  /** Value 라벨 텍스트 (기본: "Value") */
  value?: string;
  /** 삭제 버튼 aria-label (기본: "Delete") */
  delete?: string;
}

interface TagInputContextValue {
  tags: Tag[];
  validation: TagValidationResult;
  touchedTags: Record<number, TouchedTagFields>;
  maxTags: number;
  disabled: boolean;
  readOnly: boolean;
  labels: Required<TagInputLabels>;
  handleTagChange: (index: number, field: 'key' | 'value', value: string) => void;
  handleTagBlur: (index: number, field: 'key' | 'value') => void;
  handleAddTag: () => void;
  handleRemoveTag: (index: number) => void;
  /** 모든 태그 필드를 touched 상태로 전환 (submit 시 전체 유효성 검증 트리거용) */
  touchAll: () => void;
  /** 최대 태그 수 도달 시 호출되는 콜백 */
  onMaxReached?: () => void;
}

const DEFAULT_LABELS: Required<TagInputLabels> = {
  add: 'Add',
  key: 'Key',
  value: 'Value',
  delete: 'Delete',
};

const TagInputContext = createContext<TagInputContextValue | null>(null);

const useTagInputContext = (): TagInputContextValue => {
  const context = useContext(TagInputContext);
  if (!context) {
    throw new Error('TagInput compound components must be used within <TagInput>');
  }
  return context;
};

// ---------------------------------------------------------------------------
// TagInput (Root) — Context Provider
// ---------------------------------------------------------------------------

/** TagInput 외부에서 호출 가능한 imperative 핸들 */
export interface TagInputHandle {
  /** 모든 필드를 touched 처리하여 전체 유효성 검증을 트리거합니다 */
  touchAll: () => void;
}

export interface TagInputProps {
  /** 현재 태그 목록 */
  tags: Tag[];
  /** 태그 변경 콜백 */
  onTagsChange: (tags: Tag[]) => void;
  /** 유효성 검증 함수 (기본: validateTags) */
  validate?: (tags: Tag[]) => TagValidationResult;
  /** 유효성 검증 결과를 상위에 전달하는 콜백 */
  onValidationChange?: (result: TagValidationResult) => void;
  /** imperative 핸들 ref (touchAll 등) */
  handleRef?: React.Ref<TagInputHandle>;
  /** 최대 태그 수 (기본값: 50) */
  maxTags?: number;
  /** 최대 태그 수 도달 시 Add 버튼 클릭 콜백 */
  onMaxReached?: () => void;
  /** 비활성화 상태 */
  disabled?: boolean;
  /** 읽기 전용 모드 */
  readOnly?: boolean;
  /** 다국어 라벨. 사용처에서 번역된 문자열을 전달합니다. */
  labels?: TagInputLabels;
  children: React.ReactNode;
}

const TagInputRoot: React.FC<TagInputProps> = ({
  tags,
  onTagsChange,
  validate = defaultValidateTags,
  onValidationChange,
  handleRef,
  maxTags = 50,
  onMaxReached,
  disabled = false,
  readOnly = false,
  labels: labelsProp,
  children,
}) => {
  const mergedLabels = useMemo<Required<TagInputLabels>>(
    () => ({ ...DEFAULT_LABELS, ...labelsProp }),
    [labelsProp]
  );
  const [touchedTags, setTouchedTags] = useState<Record<number, TouchedTagFields>>({});

  const validation = useMemo(() => validate(tags), [tags, validate]);

  // touched 필터링된 에러만 외부에 전달 (untouched 필드의 에러는 제외)
  const touchedValidation = useMemo((): TagValidationResult => {
    const filteredErrors: Record<number, (typeof validation.errors)[number]> = {};
    for (const [key, tagErrors] of Object.entries(validation.errors)) {
      const idx = Number(key);
      const touched = touchedTags[idx];
      if (!touched) continue;
      const filtered: typeof tagErrors = {};
      if (touched.key && tagErrors.key) filtered.key = tagErrors.key;
      if (touched.value && tagErrors.value) filtered.value = tagErrors.value;
      if (filtered.key || filtered.value) {
        filteredErrors[idx] = filtered;
      }
    }
    return { errors: filteredErrors, duplicateIndices: validation.duplicateIndices };
  }, [validation, touchedTags]);

  useEffect(() => {
    onValidationChange?.(touchedValidation);
  }, [touchedValidation, onValidationChange]);

  const handleAddTag = useCallback((): void => {
    if (disabled || readOnly) return;
    if (tags.length >= maxTags) {
      onMaxReached?.();
      return;
    }
    onTagsChange([...tags, { key: '', value: '' }]);
  }, [tags, onTagsChange, maxTags, onMaxReached, disabled, readOnly]);

  const handleRemoveTag = useCallback(
    (index: number): void => {
      if (disabled || readOnly) return;
      onTagsChange(tags.filter((_, i) => i !== index));
      setTouchedTags((prev) => reindexTouchedTags(prev, index));
    },
    [tags, onTagsChange, disabled, readOnly]
  );

  const handleTagChange = useCallback(
    (index: number, field: 'key' | 'value', value: string): void => {
      if (disabled || readOnly) return;
      onTagsChange(tags.map((tag, i) => (i === index ? { ...tag, [field]: value } : tag)));
    },
    [tags, onTagsChange, disabled, readOnly]
  );

  const handleTagBlur = useCallback((index: number, field: 'key' | 'value'): void => {
    setTouchedTags((prev) => ({
      ...prev,
      [index]: { ...prev[index], [field]: true },
    }));
  }, []);

  const touchAll = useCallback((): void => {
    const allTouched: Record<number, TouchedTagFields> = {};
    for (let i = 0; i < tags.length; i++) {
      allTouched[i] = { key: true, value: true };
    }
    setTouchedTags(allTouched);
  }, [tags.length]);

  // Imperative handle 노출
  useImperativeHandle(handleRef, () => ({ touchAll }), [touchAll]);

  const contextValue = useMemo(
    () => ({
      tags,
      validation,
      touchedTags,
      maxTags,
      disabled,
      readOnly,
      labels: mergedLabels,
      handleTagChange,
      handleTagBlur,
      handleAddTag,
      handleRemoveTag,
      touchAll,
      onMaxReached,
    }),
    [
      tags,
      validation,
      touchedTags,
      maxTags,
      disabled,
      readOnly,
      mergedLabels,
      handleTagChange,
      handleTagBlur,
      handleAddTag,
      handleRemoveTag,
      touchAll,
      onMaxReached,
    ]
  );

  return <TagInputContext.Provider value={contextValue}>{children}</TagInputContext.Provider>;
};

// ---------------------------------------------------------------------------
// TagInput.AddButton
// ---------------------------------------------------------------------------

export interface TagInputAddButtonProps {
  /** 커스텀 버튼. 없으면 기본 "Add Tag" 버튼 렌더링. onClick 자동 주입 */
  children?: React.ReactElement<{ onClick?: () => void }>;
}

const TagInputAddButton: React.FC<TagInputAddButtonProps> = ({ children }) => {
  const { disabled, readOnly, handleAddTag, labels } = useTagInputContext();

  const isAddDisabled = disabled || readOnly;

  if (children && isValidElement(children)) {
    return cloneElement(children, { onClick: handleAddTag });
  }

  return (
    <Button
      size="sm"
      appearance="outline"
      variant="secondary"
      onClick={handleAddTag}
      disabled={isAddDisabled}
    >
      <AddIcon size="xs" />
      {labels.add}
    </Button>
  );
};

// ---------------------------------------------------------------------------
// TagInput.Form — 태그 행 렌더링 (Key/Value 입력 + 삭제)
// ---------------------------------------------------------------------------

export interface TagInputFormProps {
  /** Key placeholder */
  keyPlaceholder?: string;
  /** Value placeholder */
  valuePlaceholder?: string;
  /** 에러 메시지 렌더링 함수. tagErrors와 touched를 받아 ReactNode를 반환합니다. */
  renderError?: (
    tagErrors: TagErrors | undefined,
    touched: TouchedTagFields | undefined
  ) => React.ReactNode;
}

const TagInputForm: React.FC<TagInputFormProps> = ({
  keyPlaceholder = 'e.g. team',
  valuePlaceholder = 'e.g. team',
  renderError,
}) => {
  const {
    tags,
    validation,
    touchedTags,
    disabled,
    readOnly,
    labels,
    handleTagChange,
    handleTagBlur,
    handleRemoveTag,
  } = useTagInputContext();

  if (tags.length === 0) return null;

  return (
    <Layout.VStack gap="sm">
      {tags.map((tag, index) => {
        const tagErrors = validation.errors[index];
        const touched = touchedTags[index];
        const hasKeyError = Boolean(touched?.key && tagErrors?.key);
        const hasValueError = Boolean(touched?.value && tagErrors?.value);
        const hasError = hasKeyError || hasValueError;

        return (
          <Layout.VStack key={index} gap="xs">
            <div
              className={`flex items-center gap-[var(--primitive-space-6)] px-[var(--primitive-space-4)] py-[var(--primitive-space-2)] rounded-[6px] border ${
                hasError
                  ? 'border-[var(--semantic-color-error)]'
                  : 'border-[var(--semantic-color-border)]'
              } bg-[var(--semantic-color-surface)]`}
            >
              <div className="flex items-center gap-[var(--primitive-space-3)] flex-1 min-w-0">
                <span className="text-[14px] font-medium leading-[20px] text-[var(--semantic-color-text)] shrink-0">
                  {labels.key}
                </span>
                <div className="flex-1 min-w-[80px]">
                  <Input
                    value={tag.key}
                    onChange={(e) => handleTagChange(index, 'key', e.target.value)}
                    onBlur={() => handleTagBlur(index, 'key')}
                    placeholder={keyPlaceholder}
                    error={hasKeyError}
                    disabled={disabled || readOnly}
                    maxLength={256}
                    size="sm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-[var(--primitive-space-3)] flex-1 min-w-0">
                <span className="text-[14px] font-medium leading-[20px] text-[var(--semantic-color-text)] shrink-0">
                  {labels.value}
                </span>
                <div className="flex-1 min-w-[80px]">
                  <Input
                    value={tag.value}
                    onChange={(e) => handleTagChange(index, 'value', e.target.value)}
                    onBlur={() => handleTagBlur(index, 'value')}
                    placeholder={valuePlaceholder}
                    error={hasValueError}
                    disabled={disabled || readOnly}
                    maxLength={256}
                    size="sm"
                  />
                </div>
              </div>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  disabled={disabled}
                  className="shrink-0 flex items-center justify-center w-4 h-4 p-0 bg-transparent border-none cursor-pointer text-[var(--semantic-color-text)] hover:text-[var(--semantic-color-text-subtle)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={labels.delete}
                >
                  <CloseSmallIcon size="sm" />
                </button>
              )}
            </div>
            {hasError && renderError && renderError(tagErrors, touched)}
          </Layout.VStack>
        );
      })}
    </Layout.VStack>
  );
};

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

type TagInputType = typeof TagInputRoot & {
  AddButton: typeof TagInputAddButton;
  Form: typeof TagInputForm;
  useContext: typeof useTagInputContext;
};

const TagInput = TagInputRoot as TagInputType;

TagInput.AddButton = TagInputAddButton;
TagInput.Form = TagInputForm;
TagInput.useContext = useTagInputContext;

export { TagInput };
