import Editor, { EditorProps } from '@monaco-editor/react';
import { RefObject, useImperativeHandle, useRef } from 'react';
import { cn } from '../../services/utils/cn';
import { ComponentSize } from '../../types';
import { promptEditorStyles } from './PromptEditor.styles';

/** 에디터 객체를 참조하기 위한 타입(라이브러리에서 타입이 지원되지 않아 선언해서 사용 및 현재 에디터의 두 메소드만 지원) */
type PromptEditorRef = {
  getValue: () => string;
  setValue: (value: string) => void;
};

type Props = {
  /** 스타일을 위한 클래스네임 */
  className?: string;
  /** 에디터의 너비 */
  size?: ComponentSize;
  /** 에디터의 테마 */
  isDarkMode?: boolean;
  /** 에디터의 기본 값(프롬프트의 내용) */
  defaultValue?: EditorProps['defaultValue'];
  /** 에디터의 읽기 전용 여부 */
  readOnly?: boolean;
  /** 폰트 크기 (px 단위) */
  fontSize?: number;
  /** 줄 간격 (em 단위) */
  lineHeight?: number;
  /** 에디터가 마운트될 때 포커스를 설정할지 여부 */
  focusOnMount?: boolean;
  /**
   * 에디터의 옵션
   * @see 공식 문서 - https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneEditorConstructionOptions.html
   */
  options?: EditorProps['options'];
  /** 에디터가 포커스될 때 호출되는 함수 */
  onFocus?: () => void;
  /** 에디터가 포커스를 잃을 때 호출되는 함수 */
  onBlur?: () => void;
  /** 에디터 객체를 참조하기 위한 ref */
  ref?: RefObject<PromptEditorRef | null>;
} & EditorProps;

/**
 * `언어 모델의 프롬프트를 편집할 수 있는 에디터 컴포넌트`
 */
const PromptEditor = ({
  className,
  size = 'md',
  language = 'yaml',
  isDarkMode = true,
  defaultValue = '',
  focusOnMount = false,
  readOnly = false,
  fontSize = 14,
  lineHeight = 1.5,
  options,
  onFocus,
  onBlur,
  ref,
  ...props
}: Props) => {
  /** 에디터 객체를 저장해서 메소드를 사용하기 위한 ref */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);

  // 외부에서 ref를 주입해 에디터를 참조할 수 있는 훅
  useImperativeHandle(ref, () => {
    return {
      getValue: () => editorRef.current?.getValue(),
      setValue: (value: string) => editorRef.current?.setValue(value),
    };
  });

  return (
    <div className={cn(promptEditorStyles({ size }), className)}>
      <Editor
        height="100%"
        width="100%"
        theme={isDarkMode ? 'vs-dark' : 'light'}
        onMount={(editor, monaco) => {
          if (focusOnMount) {
            editor.focus();
          }

          editor.onDidFocusEditorText(() => {
            onFocus?.();
          });

          editor.onDidBlurEditorText(() => {
            onBlur?.();
          });

          // 내부적으로 editor 객체를 참조하기 위해 저장
          editorRef.current = editor;

          // 기본동작 실행
          return props.onMount?.(editor, monaco);
        }}
        defaultValue={defaultValue}
        language={language}
        options={{
          folding: true,
          ariaLabel: 'Editor',
          readOnly,
          minimap: {
            enabled: false,
          },
          fontSize,
          lineHeight,
          ...options,
        }}
        {...props}
      />
    </div>
  );
};

export { PromptEditor };
export type { Props as PromptEditorProps, PromptEditorRef };
