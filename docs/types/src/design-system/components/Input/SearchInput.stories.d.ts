import { StoryObj } from '@storybook/react-vite';
/**
 * # SearchInput
 *
 * 검색 전용 입력 컴포넌트입니다. 오른쪽에 검색 아이콘이 고정되며, 값이 있을 때 클리어 버튼이 표시됩니다.
 *
 * ## 언제 사용하나요?
 * - 리스트 페이지에서 간단한 텍스트 검색이 필요할 때
 * - 필터 없이 단순 키워드 검색만 필요할 때
 * - FilterSearchInput의 복잡한 필터가 불필요한 경우
 *
 * ## 기능
 * - **검색 아이콘**: 오른쪽에 항상 표시
 * - **클리어 버튼**: 값이 있을 때 자동 표시 (`clearable` prop)
 * - **Controlled/Uncontrolled**: 두 가지 모드 지원
 * - **Label**: 옵션으로 라벨 표시 가능
 *
 * ## 접근성
 * - `type="search"` 네이티브 시맨틱
 * - `aria-label` 자동 적용 (label prop 또는 기본값 "Search")
 * - 클리어 버튼에 `aria-label="Clear search"` 적용
 */
declare const meta: {
    title: string;
    component: import('react').ForwardRefExoticComponent<import('./SearchInput').SearchInputProps & import('react').RefAttributes<HTMLInputElement>>;
    parameters: {
        layout: string;
        docs: {
            description: {
                component: string;
            };
        };
    };
    tags: string[];
    argTypes: {
        size: {
            control: "select";
            options: string[];
            description: string;
            table: {
                type: {
                    summary: string;
                };
                defaultValue: {
                    summary: string;
                };
            };
        };
        label: {
            control: "text";
            description: string;
        };
        placeholder: {
            control: "text";
            description: string;
        };
        fullWidth: {
            control: "boolean";
            description: string;
            table: {
                type: {
                    summary: string;
                };
                defaultValue: {
                    summary: string;
                };
            };
        };
        clearable: {
            control: "boolean";
            description: string;
            table: {
                type: {
                    summary: string;
                };
                defaultValue: {
                    summary: string;
                };
            };
        };
        disabled: {
            control: "boolean";
            description: string;
        };
    };
    decorators: ((Story: import('storybook/internal/csf').PartialStoryFn<import('@storybook/react').ReactRenderer, {
        size?: "sm" | "md" | undefined;
        label?: string | undefined;
        fullWidth?: boolean | undefined;
        clearable?: boolean | undefined;
        onClear?: (() => void) | undefined;
        color?: string | undefined | undefined;
        suppressHydrationWarning?: boolean | undefined | undefined;
        className?: string | undefined | undefined;
        height?: number | string | undefined | undefined;
        id?: string | undefined | undefined;
        lang?: string | undefined | undefined;
        max?: number | string | undefined | undefined;
        min?: number | string | undefined | undefined;
        name?: string | undefined | undefined;
        nonce?: string | undefined | undefined;
        part?: string | undefined | undefined;
        slot?: string | undefined | undefined;
        style?: import('react').CSSProperties | undefined;
        width?: number | string | undefined | undefined;
        role?: import('react').AriaRole | undefined;
        tabIndex?: number | undefined | undefined;
        "aria-activedescendant"?: string | undefined | undefined;
        "aria-atomic"?: (boolean | "true" | "false") | undefined;
        "aria-autocomplete"?: "none" | "inline" | "list" | "both" | undefined | undefined;
        "aria-braillelabel"?: string | undefined | undefined;
        "aria-brailleroledescription"?: string | undefined | undefined;
        "aria-busy"?: (boolean | "true" | "false") | undefined;
        "aria-checked"?: boolean | "false" | "mixed" | "true" | undefined | undefined;
        "aria-colcount"?: number | undefined | undefined;
        "aria-colindex"?: number | undefined | undefined;
        "aria-colindextext"?: string | undefined | undefined;
        "aria-colspan"?: number | undefined | undefined;
        "aria-controls"?: string | undefined | undefined;
        "aria-current"?: boolean | "false" | "true" | "page" | "step" | "location" | "date" | "time" | undefined | undefined;
        "aria-describedby"?: string | undefined | undefined;
        "aria-description"?: string | undefined | undefined;
        "aria-details"?: string | undefined | undefined;
        "aria-disabled"?: (boolean | "true" | "false") | undefined;
        "aria-dropeffect"?: "none" | "copy" | "execute" | "link" | "move" | "popup" | undefined | undefined;
        "aria-errormessage"?: string | undefined | undefined;
        "aria-expanded"?: (boolean | "true" | "false") | undefined;
        "aria-flowto"?: string | undefined | undefined;
        "aria-grabbed"?: (boolean | "true" | "false") | undefined;
        "aria-haspopup"?: boolean | "false" | "true" | "menu" | "listbox" | "tree" | "grid" | "dialog" | undefined | undefined;
        "aria-hidden"?: (boolean | "true" | "false") | undefined;
        "aria-invalid"?: boolean | "false" | "true" | "grammar" | "spelling" | undefined | undefined;
        "aria-keyshortcuts"?: string | undefined | undefined;
        "aria-label"?: string | undefined | undefined;
        "aria-labelledby"?: string | undefined | undefined;
        "aria-level"?: number | undefined | undefined;
        "aria-live"?: "off" | "assertive" | "polite" | undefined | undefined;
        "aria-modal"?: (boolean | "true" | "false") | undefined;
        "aria-multiline"?: (boolean | "true" | "false") | undefined;
        "aria-multiselectable"?: (boolean | "true" | "false") | undefined;
        "aria-orientation"?: "horizontal" | "vertical" | undefined | undefined;
        "aria-owns"?: string | undefined | undefined;
        "aria-placeholder"?: string | undefined | undefined;
        "aria-posinset"?: number | undefined | undefined;
        "aria-pressed"?: boolean | "false" | "mixed" | "true" | undefined | undefined;
        "aria-readonly"?: (boolean | "true" | "false") | undefined;
        "aria-relevant"?: "additions" | "additions removals" | "additions text" | "all" | "removals" | "removals additions" | "removals text" | "text" | "text additions" | "text removals" | undefined | undefined;
        "aria-required"?: (boolean | "true" | "false") | undefined;
        "aria-roledescription"?: string | undefined | undefined;
        "aria-rowcount"?: number | undefined | undefined;
        "aria-rowindex"?: number | undefined | undefined;
        "aria-rowindextext"?: string | undefined | undefined;
        "aria-rowspan"?: number | undefined | undefined;
        "aria-selected"?: (boolean | "true" | "false") | undefined;
        "aria-setsize"?: number | undefined | undefined;
        "aria-sort"?: "none" | "ascending" | "descending" | "other" | undefined | undefined;
        "aria-valuemax"?: number | undefined | undefined;
        "aria-valuemin"?: number | undefined | undefined;
        "aria-valuenow"?: number | undefined | undefined;
        "aria-valuetext"?: string | undefined | undefined;
        children?: import('react').ReactNode | Iterable<import('react').ReactNode>;
        dangerouslySetInnerHTML?: {
            __html: string | TrustedHTML;
        } | undefined | undefined;
        onCopy?: import('react').ClipboardEventHandler<HTMLInputElement> | undefined;
        onCopyCapture?: import('react').ClipboardEventHandler<HTMLInputElement> | undefined;
        onCut?: import('react').ClipboardEventHandler<HTMLInputElement> | undefined;
        onCutCapture?: import('react').ClipboardEventHandler<HTMLInputElement> | undefined;
        onPaste?: import('react').ClipboardEventHandler<HTMLInputElement> | undefined;
        onPasteCapture?: import('react').ClipboardEventHandler<HTMLInputElement> | undefined;
        onCompositionEnd?: import('react').CompositionEventHandler<HTMLInputElement> | undefined;
        onCompositionEndCapture?: import('react').CompositionEventHandler<HTMLInputElement> | undefined;
        onCompositionStart?: import('react').CompositionEventHandler<HTMLInputElement> | undefined;
        onCompositionStartCapture?: import('react').CompositionEventHandler<HTMLInputElement> | undefined;
        onCompositionUpdate?: import('react').CompositionEventHandler<HTMLInputElement> | undefined;
        onCompositionUpdateCapture?: import('react').CompositionEventHandler<HTMLInputElement> | undefined;
        onFocus?: import('react').FocusEventHandler<HTMLInputElement> | undefined;
        onFocusCapture?: import('react').FocusEventHandler<HTMLInputElement> | undefined;
        onBlur?: import('react').FocusEventHandler<HTMLInputElement> | undefined;
        onBlurCapture?: import('react').FocusEventHandler<HTMLInputElement> | undefined;
        onChange?: import('react').ChangeEventHandler<HTMLInputElement, HTMLInputElement> | undefined;
        onChangeCapture?: import('react').ChangeEventHandler<HTMLInputElement, Element> | undefined;
        onBeforeInput?: import('react').InputEventHandler<HTMLInputElement> | undefined;
        onBeforeInputCapture?: import('react').InputEventHandler<HTMLInputElement> | undefined;
        onInput?: import('react').InputEventHandler<HTMLInputElement> | undefined;
        onInputCapture?: import('react').InputEventHandler<HTMLInputElement> | undefined;
        onReset?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onResetCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onSubmit?: import('react').SubmitEventHandler<HTMLInputElement> | undefined;
        onSubmitCapture?: import('react').SubmitEventHandler<HTMLInputElement> | undefined;
        onInvalid?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onInvalidCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onLoad?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onLoadCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onError?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onErrorCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onKeyDown?: import('react').KeyboardEventHandler<HTMLInputElement> | undefined;
        onKeyDownCapture?: import('react').KeyboardEventHandler<HTMLInputElement> | undefined;
        onKeyPress?: import('react').KeyboardEventHandler<HTMLInputElement> | undefined;
        onKeyPressCapture?: import('react').KeyboardEventHandler<HTMLInputElement> | undefined;
        onKeyUp?: import('react').KeyboardEventHandler<HTMLInputElement> | undefined;
        onKeyUpCapture?: import('react').KeyboardEventHandler<HTMLInputElement> | undefined;
        onAbort?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onAbortCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onCanPlay?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onCanPlayCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onCanPlayThrough?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onCanPlayThroughCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onDurationChange?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onDurationChangeCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onEmptied?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onEmptiedCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onEncrypted?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onEncryptedCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onEnded?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onEndedCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onLoadedData?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onLoadedDataCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onLoadedMetadata?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onLoadedMetadataCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onLoadStart?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onLoadStartCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onPause?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onPauseCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onPlay?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onPlayCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onPlaying?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onPlayingCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onProgress?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onProgressCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onRateChange?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onRateChangeCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onSeeked?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onSeekedCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onSeeking?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onSeekingCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onStalled?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onStalledCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onSuspend?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onSuspendCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onTimeUpdate?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onTimeUpdateCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onVolumeChange?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onVolumeChangeCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onWaiting?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onWaitingCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onAuxClick?: import('react').MouseEventHandler<HTMLInputElement> | undefined;
        onAuxClickCapture?: import('react').MouseEventHandler<HTMLInputElement> | undefined;
        onClick?: import('react').MouseEventHandler<HTMLInputElement> | undefined;
        onClickCapture?: import('react').MouseEventHandler<HTMLInputElement> | undefined;
        onContextMenu?: import('react').MouseEventHandler<HTMLInputElement> | undefined;
        onContextMenuCapture?: import('react').MouseEventHandler<HTMLInputElement> | undefined;
        onDoubleClick?: import('react').MouseEventHandler<HTMLInputElement> | undefined;
        onDoubleClickCapture?: import('react').MouseEventHandler<HTMLInputElement> | undefined;
        onDrag?: import('react').DragEventHandler<HTMLInputElement> | undefined;
        onDragCapture?: import('react').DragEventHandler<HTMLInputElement> | undefined;
        onDragEnd?: import('react').DragEventHandler<HTMLInputElement> | undefined;
        onDragEndCapture?: import('react').DragEventHandler<HTMLInputElement> | undefined;
        onDragEnter?: import('react').DragEventHandler<HTMLInputElement> | undefined;
        onDragEnterCapture?: import('react').DragEventHandler<HTMLInputElement> | undefined;
        onDragExit?: import('react').DragEventHandler<HTMLInputElement> | undefined;
        onDragExitCapture?: import('react').DragEventHandler<HTMLInputElement> | undefined;
        onDragLeave?: import('react').DragEventHandler<HTMLInputElement> | undefined;
        onDragLeaveCapture?: import('react').DragEventHandler<HTMLInputElement> | undefined;
        onDragOver?: import('react').DragEventHandler<HTMLInputElement> | undefined;
        onDragOverCapture?: import('react').DragEventHandler<HTMLInputElement> | undefined;
        onDragStart?: import('react').DragEventHandler<HTMLInputElement> | undefined;
        onDragStartCapture?: import('react').DragEventHandler<HTMLInputElement> | undefined;
        onDrop?: import('react').DragEventHandler<HTMLInputElement> | undefined;
        onDropCapture?: import('react').DragEventHandler<HTMLInputElement> | undefined;
        onMouseDown?: import('react').MouseEventHandler<HTMLInputElement> | undefined;
        onMouseDownCapture?: import('react').MouseEventHandler<HTMLInputElement> | undefined;
        onMouseEnter?: import('react').MouseEventHandler<HTMLInputElement> | undefined;
        onMouseLeave?: import('react').MouseEventHandler<HTMLInputElement> | undefined;
        onMouseMove?: import('react').MouseEventHandler<HTMLInputElement> | undefined;
        onMouseMoveCapture?: import('react').MouseEventHandler<HTMLInputElement> | undefined;
        onMouseOut?: import('react').MouseEventHandler<HTMLInputElement> | undefined;
        onMouseOutCapture?: import('react').MouseEventHandler<HTMLInputElement> | undefined;
        onMouseOver?: import('react').MouseEventHandler<HTMLInputElement> | undefined;
        onMouseOverCapture?: import('react').MouseEventHandler<HTMLInputElement> | undefined;
        onMouseUp?: import('react').MouseEventHandler<HTMLInputElement> | undefined;
        onMouseUpCapture?: import('react').MouseEventHandler<HTMLInputElement> | undefined;
        onSelect?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onSelectCapture?: import('react').ReactEventHandler<HTMLInputElement> | undefined;
        onTouchCancel?: import('react').TouchEventHandler<HTMLInputElement> | undefined;
        onTouchCancelCapture?: import('react').TouchEventHandler<HTMLInputElement> | undefined;
        onTouchEnd?: import('react').TouchEventHandler<HTMLInputElement> | undefined;
        onTouchEndCapture?: import('react').TouchEventHandler<HTMLInputElement> | undefined;
        onTouchMove?: import('react').TouchEventHandler<HTMLInputElement> | undefined;
        onTouchMoveCapture?: import('react').TouchEventHandler<HTMLInputElement> | undefined;
        onTouchStart?: import('react').TouchEventHandler<HTMLInputElement> | undefined;
        onTouchStartCapture?: import('react').TouchEventHandler<HTMLInputElement> | undefined;
        onPointerDown?: import('react').PointerEventHandler<HTMLInputElement> | undefined;
        onPointerDownCapture?: import('react').PointerEventHandler<HTMLInputElement> | undefined;
        onPointerMove?: import('react').PointerEventHandler<HTMLInputElement> | undefined;
        onPointerMoveCapture?: import('react').PointerEventHandler<HTMLInputElement> | undefined;
        onPointerUp?: import('react').PointerEventHandler<HTMLInputElement> | undefined;
        onPointerUpCapture?: import('react').PointerEventHandler<HTMLInputElement> | undefined;
        onPointerCancel?: import('react').PointerEventHandler<HTMLInputElement> | undefined;
        onPointerCancelCapture?: import('react').PointerEventHandler<HTMLInputElement> | undefined;
        onPointerEnter?: import('react').PointerEventHandler<HTMLInputElement> | undefined;
        onPointerLeave?: import('react').PointerEventHandler<HTMLInputElement> | undefined;
        onPointerOver?: import('react').PointerEventHandler<HTMLInputElement> | undefined;
        onPointerOverCapture?: import('react').PointerEventHandler<HTMLInputElement> | undefined;
        onPointerOut?: import('react').PointerEventHandler<HTMLInputElement> | undefined;
        onPointerOutCapture?: import('react').PointerEventHandler<HTMLInputElement> | undefined;
        onGotPointerCapture?: import('react').PointerEventHandler<HTMLInputElement> | undefined;
        onGotPointerCaptureCapture?: import('react').PointerEventHandler<HTMLInputElement> | undefined;
        onLostPointerCapture?: import('react').PointerEventHandler<HTMLInputElement> | undefined;
        onLostPointerCaptureCapture?: import('react').PointerEventHandler<HTMLInputElement> | undefined;
        onScroll?: import('react').UIEventHandler<HTMLInputElement> | undefined;
        onScrollCapture?: import('react').UIEventHandler<HTMLInputElement> | undefined;
        onScrollEnd?: import('react').UIEventHandler<HTMLInputElement> | undefined;
        onScrollEndCapture?: import('react').UIEventHandler<HTMLInputElement> | undefined;
        onWheel?: import('react').WheelEventHandler<HTMLInputElement> | undefined;
        onWheelCapture?: import('react').WheelEventHandler<HTMLInputElement> | undefined;
        onAnimationStart?: import('react').AnimationEventHandler<HTMLInputElement> | undefined;
        onAnimationStartCapture?: import('react').AnimationEventHandler<HTMLInputElement> | undefined;
        onAnimationEnd?: import('react').AnimationEventHandler<HTMLInputElement> | undefined;
        onAnimationEndCapture?: import('react').AnimationEventHandler<HTMLInputElement> | undefined;
        onAnimationIteration?: import('react').AnimationEventHandler<HTMLInputElement> | undefined;
        onAnimationIterationCapture?: import('react').AnimationEventHandler<HTMLInputElement> | undefined;
        onToggle?: import('react').ToggleEventHandler<HTMLInputElement> | undefined;
        onBeforeToggle?: import('react').ToggleEventHandler<HTMLInputElement> | undefined;
        onTransitionCancel?: import('react').TransitionEventHandler<HTMLInputElement> | undefined;
        onTransitionCancelCapture?: import('react').TransitionEventHandler<HTMLInputElement> | undefined;
        onTransitionEnd?: import('react').TransitionEventHandler<HTMLInputElement> | undefined;
        onTransitionEndCapture?: import('react').TransitionEventHandler<HTMLInputElement> | undefined;
        onTransitionRun?: import('react').TransitionEventHandler<HTMLInputElement> | undefined;
        onTransitionRunCapture?: import('react').TransitionEventHandler<HTMLInputElement> | undefined;
        onTransitionStart?: import('react').TransitionEventHandler<HTMLInputElement> | undefined;
        onTransitionStartCapture?: import('react').TransitionEventHandler<HTMLInputElement> | undefined;
        form?: string | undefined | undefined;
        list?: string | undefined | undefined;
        step?: number | string | undefined | undefined;
        title?: string | undefined | undefined;
        pattern?: string | undefined | undefined;
        content?: string | undefined | undefined;
        translate?: "yes" | "no" | undefined | undefined;
        prefix?: string | undefined | undefined;
        disabled?: boolean | undefined | undefined;
        formAction?: string | ((formData: FormData) => void | Promise<void>) | undefined;
        formEncType?: string | undefined | undefined;
        formMethod?: string | undefined | undefined;
        formNoValidate?: boolean | undefined | undefined;
        formTarget?: string | undefined | undefined;
        value?: string | number | readonly string[] | undefined;
        defaultChecked?: boolean | undefined | undefined;
        defaultValue?: string | number | readonly string[] | undefined;
        suppressContentEditableWarning?: boolean | undefined | undefined;
        accessKey?: string | undefined | undefined;
        autoCapitalize?: "off" | "none" | "on" | "sentences" | "words" | "characters" | undefined | (string & {}) | undefined;
        autoFocus?: boolean | undefined | undefined;
        contentEditable?: "inherit" | (boolean | "true" | "false") | "plaintext-only" | undefined;
        contextMenu?: string | undefined | undefined;
        dir?: string | undefined | undefined;
        draggable?: (boolean | "true" | "false") | undefined;
        enterKeyHint?: "enter" | "done" | "go" | "next" | "previous" | "search" | "send" | undefined | undefined;
        hidden?: boolean | undefined | undefined;
        spellCheck?: (boolean | "true" | "false") | undefined;
        radioGroup?: string | undefined | undefined;
        about?: string | undefined | undefined;
        datatype?: string | undefined | undefined;
        inlist?: any;
        property?: string | undefined | undefined;
        rel?: string | undefined | undefined;
        resource?: string | undefined | undefined;
        rev?: string | undefined | undefined;
        typeof?: string | undefined | undefined;
        vocab?: string | undefined | undefined;
        autoCorrect?: string | undefined | undefined;
        autoSave?: string | undefined | undefined;
        itemProp?: string | undefined | undefined;
        itemScope?: boolean | undefined | undefined;
        itemType?: string | undefined | undefined;
        itemID?: string | undefined | undefined;
        itemRef?: string | undefined | undefined;
        results?: number | undefined | undefined;
        security?: string | undefined | undefined;
        unselectable?: "on" | "off" | undefined | undefined;
        popover?: "" | "auto" | "manual" | "hint" | undefined | undefined;
        popoverTargetAction?: "toggle" | "show" | "hide" | undefined | undefined;
        popoverTarget?: string | undefined | undefined;
        inert?: boolean | undefined | undefined;
        inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search" | undefined | undefined;
        is?: string | undefined | undefined;
        exportparts?: string | undefined | undefined;
        autoComplete?: import('react').HTMLInputAutoCompleteAttribute | undefined;
        alt?: string | undefined | undefined;
        accept?: string | undefined | undefined;
        capture?: boolean | "user" | "environment" | undefined | undefined;
        checked?: boolean | undefined | undefined;
        multiple?: boolean | undefined | undefined;
        maxLength?: number | undefined | undefined;
        minLength?: number | undefined | undefined;
        src?: string | undefined | undefined;
        placeholder?: string | undefined | undefined;
        readOnly?: boolean | undefined | undefined;
        required?: boolean | undefined | undefined;
        ref?: import('react').Ref<HTMLInputElement> | undefined;
        key?: import('react').Key | null | undefined;
    }>) => import("react/jsx-runtime").JSX.Element)[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const WithLabel: Story;
export declare const WithDefaultValue: Story;
export declare const Sizes: Story;
export declare const Disabled: Story;
export declare const DisabledWithValue: Story;
export declare const NotClearable: Story;
export declare const Controlled: Story;
export declare const ResourceSearch: Story;
export declare const CustomWidth: Story;
