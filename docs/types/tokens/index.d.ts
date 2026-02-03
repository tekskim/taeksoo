/**
 * TDS Design System Tokens
 * Based on tokens.json structure
 *
 * Layers:
 * 1. primitive - Raw values
 * 2. semantic - Purpose-driven tokens
 * 3. component - Component-specific tokens
 */
export declare const primitive: {
    readonly color: {
        readonly white: "var(--color-white)";
        readonly black: "var(--color-black)";
        readonly slate: {
            readonly 50: "var(--color-slate-50)";
            readonly 100: "var(--color-slate-100)";
            readonly 200: "var(--color-slate-200)";
            readonly 300: "var(--color-slate-300)";
            readonly 400: "var(--color-slate-400)";
            readonly 500: "var(--color-slate-500)";
            readonly 600: "var(--color-slate-600)";
            readonly 700: "var(--color-slate-700)";
            readonly 800: "var(--color-slate-800)";
            readonly 900: "var(--color-slate-900)";
        };
        readonly blue: {
            readonly 50: "var(--color-blue-50)";
            readonly 100: "var(--color-blue-100)";
            readonly 200: "var(--color-blue-200)";
            readonly 300: "var(--color-blue-300)";
            readonly 400: "var(--color-blue-400)";
            readonly 500: "var(--color-blue-500)";
            readonly 600: "var(--color-blue-600)";
            readonly 700: "var(--color-blue-700)";
            readonly 800: "var(--color-blue-800)";
            readonly 900: "var(--color-blue-900)";
        };
        readonly red: {
            readonly 50: "var(--color-red-50)";
            readonly 100: "var(--color-red-100)";
            readonly 500: "var(--color-red-500)";
            readonly 600: "var(--color-red-600)";
            readonly 700: "var(--color-red-700)";
            readonly 800: "var(--color-red-800)";
        };
        readonly green: {
            readonly 50: "var(--color-green-50)";
            readonly 100: "var(--color-green-100)";
            readonly 500: "var(--color-green-500)";
            readonly 600: "var(--color-green-600)";
            readonly 700: "var(--color-green-700)";
            readonly 800: "var(--color-green-800)";
        };
        readonly orange: {
            readonly 50: "var(--color-orange-50)";
            readonly 100: "var(--color-orange-100)";
            readonly 500: "var(--color-orange-500)";
            readonly 600: "var(--color-orange-600)";
            readonly 700: "var(--color-orange-700)";
            readonly 800: "var(--color-orange-800)";
        };
        readonly yellow: {
            readonly 50: "var(--color-yellow-50)";
            readonly 100: "var(--color-yellow-100)";
        };
    };
    readonly spacing: {
        readonly 0: "var(--spacing-0)";
        readonly '0-5': "var(--spacing-0-5)";
        readonly 1: "var(--spacing-1)";
        readonly '1-5': "var(--spacing-1-5)";
        readonly 2: "var(--spacing-2)";
        readonly '2-5': "var(--spacing-2-5)";
        readonly 3: "var(--spacing-3)";
        readonly 4: "var(--spacing-4)";
        readonly 5: "var(--spacing-5)";
        readonly 6: "var(--spacing-6)";
        readonly 7: "var(--spacing-7)";
        readonly 8: "var(--spacing-8)";
        readonly 9: "var(--spacing-9)";
        readonly 10: "var(--spacing-10)";
        readonly 12: "var(--spacing-12)";
        readonly 14: "var(--spacing-14)";
        readonly 16: "var(--spacing-16)";
        readonly 20: "var(--spacing-20)";
        readonly 24: "var(--spacing-24)";
        readonly 32: "var(--spacing-32)";
    };
    readonly fontSize: {
        readonly 10: "var(--font-size-10)";
        readonly 11: "var(--font-size-11)";
        readonly 12: "var(--font-size-12)";
        readonly 14: "var(--font-size-14)";
        readonly 16: "var(--font-size-16)";
        readonly 18: "var(--font-size-18)";
        readonly 24: "var(--font-size-24)";
        readonly 32: "var(--font-size-32)";
        readonly 40: "var(--font-size-40)";
    };
    readonly lineHeight: {
        readonly 14: "var(--line-height-14)";
        readonly 16: "var(--line-height-16)";
        readonly 18: "var(--line-height-18)";
        readonly 20: "var(--line-height-20)";
        readonly 24: "var(--line-height-24)";
        readonly 28: "var(--line-height-28)";
        readonly 32: "var(--line-height-32)";
        readonly 40: "var(--line-height-40)";
        readonly 48: "var(--line-height-48)";
    };
    readonly fontWeight: {
        readonly regular: "var(--font-weight-regular)";
        readonly medium: "var(--font-weight-medium)";
        readonly semibold: "var(--font-weight-semibold)";
    };
    readonly fontFamily: {
        readonly sans: "var(--font-sans)";
        readonly mono: "var(--font-mono)";
    };
    readonly radius: {
        readonly none: "var(--radius-none)";
        readonly sm: "var(--radius-sm)";
        readonly md: "var(--radius-md)";
        readonly lg: "var(--radius-lg)";
        readonly xl: "var(--radius-xl)";
        readonly full: "var(--radius-full)";
    };
    readonly duration: {
        readonly fast: "var(--duration-fast)";
        readonly normal: "var(--duration-normal)";
        readonly slow: "var(--duration-slow)";
    };
    readonly shadow: {
        readonly xs: "var(--shadow-xs)";
        readonly sm: "var(--shadow-sm)";
        readonly md: "var(--shadow-md)";
        readonly lg: "var(--shadow-lg)";
        readonly xl: "var(--shadow-xl)";
    };
    readonly zIndex: {
        readonly dropdown: 1000;
        readonly sticky: 1100;
        readonly modal: 1200;
        readonly popover: 1300;
        readonly tooltip: 1400;
        readonly toast: 1500;
    };
};
export declare const semantic: {
    readonly color: {
        readonly action: {
            readonly primary: "var(--color-action-primary)";
            readonly primaryHover: "var(--color-action-primary-hover)";
            readonly primaryActive: "var(--color-action-primary-active)";
        };
        readonly text: {
            readonly default: "var(--color-text-default)";
            readonly muted: "var(--color-text-muted)";
            readonly subtle: "var(--color-text-subtle)";
            readonly disabled: "var(--color-text-disabled)";
            readonly inverse: "var(--color-text-inverse)";
            readonly onPrimary: "var(--color-text-on-primary)";
        };
        readonly surface: {
            readonly default: "var(--color-surface-default)";
            readonly subtle: "var(--color-surface-subtle)";
            readonly muted: "var(--color-surface-muted)";
            readonly inverse: "var(--color-surface-inverse)";
        };
        readonly border: {
            readonly default: "var(--color-border-default)";
            readonly subtle: "var(--color-border-subtle)";
            readonly strong: "var(--color-border-strong)";
            readonly focus: "var(--color-border-focus)";
        };
        readonly state: {
            readonly info: {
                readonly default: "var(--color-state-info)";
                readonly bg: "var(--color-state-info-bg)";
                readonly text: "var(--color-state-info-text)";
            };
            readonly success: {
                readonly default: "var(--color-state-success)";
                readonly bg: "var(--color-state-success-bg)";
                readonly text: "var(--color-state-success-text)";
            };
            readonly warning: {
                readonly default: "var(--color-state-warning)";
                readonly bg: "var(--color-state-warning-bg)";
                readonly text: "var(--color-state-warning-text)";
            };
            readonly danger: {
                readonly default: "var(--color-state-danger)";
                readonly bg: "var(--color-state-danger-bg)";
                readonly text: "var(--color-state-danger-text)";
            };
        };
    };
    readonly radius: {
        readonly field: "var(--radius-field)";
        readonly button: "var(--radius-button)";
        readonly card: "var(--radius-card)";
        readonly modal: "var(--radius-modal)";
        readonly pill: "var(--radius-pill)";
    };
    readonly spacing: {
        readonly component: {
            readonly '3xs': "var(--spacing-component-3xs)";
            readonly '2xs': "var(--spacing-component-2xs)";
            readonly xs: "var(--spacing-component-xs)";
            readonly sm: "var(--spacing-component-sm)";
            readonly md: "var(--spacing-component-md)";
            readonly lg: "var(--spacing-component-lg)";
            readonly xl: "var(--spacing-component-xl)";
        };
        readonly layout: {
            readonly xs: "var(--spacing-layout-xs)";
            readonly sm: "var(--spacing-layout-sm)";
            readonly md: "var(--spacing-layout-md)";
            readonly lg: "var(--spacing-layout-lg)";
            readonly xl: "var(--spacing-layout-xl)";
            readonly '2xl': "var(--spacing-layout-2xl)";
        };
    };
    readonly typography: {
        readonly heading: {
            readonly h1: {
                readonly fontSize: "var(--font-size-40)";
                readonly lineHeight: "var(--line-height-48)";
            };
            readonly h2: {
                readonly fontSize: "var(--font-size-32)";
                readonly lineHeight: "var(--line-height-40)";
            };
            readonly h3: {
                readonly fontSize: "var(--font-size-24)";
                readonly lineHeight: "var(--line-height-32)";
            };
            readonly h4: {
                readonly fontSize: "var(--font-size-18)";
                readonly lineHeight: "var(--line-height-28)";
            };
            readonly h5: {
                readonly fontSize: "var(--font-size-16)";
                readonly lineHeight: "var(--line-height-24)";
            };
            readonly h6: {
                readonly fontSize: "var(--font-size-14)";
                readonly lineHeight: "var(--line-height-20)";
            };
        };
        readonly body: {
            readonly lg: {
                readonly fontSize: "var(--font-size-14)";
                readonly lineHeight: "var(--line-height-20)";
            };
            readonly md: {
                readonly fontSize: "var(--font-size-12)";
                readonly lineHeight: "var(--line-height-18)";
            };
            readonly sm: {
                readonly fontSize: "var(--font-size-11)";
                readonly lineHeight: "var(--line-height-16)";
            };
            readonly xs: {
                readonly fontSize: "var(--font-size-10)";
                readonly lineHeight: "var(--line-height-14)";
            };
        };
        readonly label: {
            readonly lg: {
                readonly fontSize: "var(--font-size-14)";
                readonly lineHeight: "var(--line-height-20)";
            };
            readonly md: {
                readonly fontSize: "var(--font-size-12)";
                readonly lineHeight: "var(--line-height-16)";
            };
            readonly sm: {
                readonly fontSize: "var(--font-size-11)";
                readonly lineHeight: "var(--line-height-16)";
            };
        };
        readonly button: {
            readonly lg: {
                readonly fontSize: "var(--font-size-14)";
                readonly lineHeight: "var(--line-height-20)";
            };
            readonly md: {
                readonly fontSize: "var(--font-size-12)";
                readonly lineHeight: "var(--line-height-16)";
            };
            readonly sm: {
                readonly fontSize: "var(--font-size-11)";
                readonly lineHeight: "var(--line-height-16)";
            };
        };
        readonly code: {
            readonly md: {
                readonly fontSize: "var(--font-size-12)";
                readonly lineHeight: "var(--line-height-18)";
            };
            readonly sm: {
                readonly fontSize: "var(--font-size-11)";
                readonly lineHeight: "var(--line-height-16)";
            };
        };
    };
};
export declare const component: {
    readonly button: {
        readonly height: {
            readonly sm: "var(--button-height-sm)";
            readonly md: "var(--button-height-md)";
            readonly lg: "var(--button-height-lg)";
        };
        readonly minWidth: {
            readonly sm: "var(--button-min-width-sm)";
            readonly md: "var(--button-min-width-md)";
            readonly lg: "var(--button-min-width-lg)";
        };
        readonly paddingX: {
            readonly sm: "var(--button-padding-x-sm)";
            readonly md: "var(--button-padding-x-md)";
            readonly lg: "var(--button-padding-x-lg)";
        };
        readonly paddingY: {
            readonly sm: "var(--button-padding-y-sm)";
            readonly md: "var(--button-padding-y-md)";
            readonly lg: "var(--button-padding-y-lg)";
        };
        readonly gap: {
            readonly sm: "var(--button-gap-sm)";
            readonly md: "var(--button-gap-md)";
            readonly lg: "var(--button-gap-lg)";
        };
        readonly radius: "var(--button-radius)";
        readonly fontSize: {
            readonly sm: "var(--button-font-size-sm)";
            readonly md: "var(--button-font-size-md)";
            readonly lg: "var(--button-font-size-lg)";
        };
        readonly borderColor: {
            readonly default: "var(--color-border-strong)";
            readonly disabled: "var(--color-border-default)";
        };
        readonly disabledBg: {
            readonly primary: "var(--color-border-default)";
            readonly secondary: "var(--color-surface-subtle)";
        };
        readonly disabledText: {
            readonly primary: "var(--color-text-subtle)";
            readonly secondary: "var(--color-text-disabled)";
        };
    };
    readonly input: {
        readonly height: {
            readonly sm: "var(--input-height-sm)";
            readonly md: "var(--input-height-md)";
            readonly lg: "var(--input-height-lg)";
        };
        readonly paddingX: "var(--input-padding-x)";
        readonly paddingY: "var(--input-padding-y)";
        readonly radius: "var(--input-radius)";
        readonly radiusCode: "var(--input-radius-code)";
        readonly iconOffset: "var(--input-icon-offset)";
        readonly labelGap: "var(--input-label-gap)";
        readonly fontSize: "var(--input-font-size)";
        readonly fontSizeSm: "var(--input-font-size-sm)";
        readonly lineHeight: "var(--input-line-height)";
        readonly borderWidth: "var(--input-border-width)";
        readonly borderWidthFocus: "var(--input-border-width-focus)";
        readonly bg: "var(--input-bg)";
        readonly border: "var(--input-border)";
        readonly borderFocus: "var(--input-border-focus)";
        readonly borderReadonly: "var(--input-border-readonly)";
        readonly borderError: "var(--input-border-error)";
        readonly bgDisabled: "var(--input-bg-disabled)";
        readonly textDisabled: "var(--input-text-disabled)";
    };
    readonly textarea: {
        readonly minHeight: "var(--textarea-min-height)";
    };
    readonly numberInput: {
        readonly height: "var(--number-input-height)";
        readonly paddingY: "var(--number-input-padding-y)";
        readonly buttonSize: "var(--number-input-button-size)";
    };
    readonly searchInput: {
        readonly heightSm: "var(--search-input-height-sm)";
        readonly heightMd: "var(--search-input-height-md)";
        readonly iconSize: "var(--search-input-icon-size)";
    };
    readonly badge: {
        readonly paddingX: {
            readonly sm: "var(--badge-padding-x-sm)";
            readonly md: "var(--badge-padding-x-md)";
            readonly lg: "var(--badge-padding-x-lg)";
        };
        readonly paddingY: {
            readonly sm: "var(--badge-padding-y-sm)";
            readonly md: "var(--badge-padding-y-md)";
            readonly lg: "var(--badge-padding-y-lg)";
        };
        readonly fontSize: {
            readonly sm: "var(--badge-font-size-sm)";
            readonly md: "var(--badge-font-size-md)";
            readonly lg: "var(--badge-font-size-lg)";
        };
        readonly lineHeight: {
            readonly sm: "var(--badge-line-height-sm)";
            readonly md: "var(--badge-line-height-md)";
            readonly lg: "var(--badge-line-height-lg)";
        };
        readonly radius: "var(--badge-radius)";
        readonly gap: "var(--badge-gap)";
        readonly dotSize: "var(--badge-dot-size)";
    };
    readonly menu: {
        readonly item: {
            readonly paddingX: "var(--menu-item-padding-x)";
            readonly paddingY: "var(--menu-item-padding-y)";
            readonly gap: "var(--menu-item-gap)";
            readonly radius: "var(--menu-item-radius)";
        };
        readonly section: {
            readonly paddingX: "var(--menu-section-padding-x)";
            readonly paddingY: "var(--menu-section-padding-y)";
        };
        readonly divider: {
            readonly margin: "var(--menu-divider-margin)";
        };
    };
    readonly card: {
        readonly padding: {
            readonly sm: "var(--card-padding-sm)";
            readonly md: "var(--card-padding-md)";
            readonly lg: "var(--card-padding-lg)";
        };
        readonly radius: "var(--card-radius)";
        readonly gap: "var(--card-gap)";
    };
    readonly modal: {
        readonly padding: "var(--modal-padding)";
        readonly radius: "var(--modal-radius)";
        readonly gap: "var(--modal-gap)";
    };
    readonly chip: {
        readonly paddingLeft: "var(--chip-padding-left)";
        readonly paddingRight: "var(--chip-padding-right)";
        readonly paddingY: "var(--chip-padding-y)";
        readonly gap: "var(--chip-gap)";
        readonly radius: "var(--chip-radius)";
        readonly fontSize: "var(--chip-font-size)";
        readonly lineHeight: "var(--chip-line-height)";
        readonly bg: "var(--chip-bg)";
        readonly border: "var(--chip-border)";
        readonly separatorColor: "var(--chip-separator-color)";
    };
    readonly slider: {
        readonly trackHeight: "var(--slider-track-height)";
        readonly trackRadius: "var(--slider-track-radius)";
        readonly trackBg: "var(--slider-track-bg)";
        readonly fillBg: "var(--slider-fill-bg)";
        readonly thumbSize: "var(--slider-thumb-size)";
        readonly thumbBg: "var(--slider-thumb-bg)";
        readonly thumbBorder: "var(--slider-thumb-border)";
        readonly thumbBorderWidth: "var(--slider-thumb-border-width)";
        readonly thumbShadow: "var(--slider-thumb-shadow)";
        readonly gap: "var(--slider-gap)";
        readonly valueFontSize: "var(--slider-value-font-size)";
    };
    readonly select: {
        readonly paddingX: "var(--select-padding-x)";
        readonly paddingY: "var(--select-padding-y)";
        readonly radius: "var(--select-radius)";
        readonly fontSize: "var(--select-font-size)";
        readonly lineHeight: "var(--select-line-height)";
        readonly borderWidth: "var(--select-border-width)";
        readonly borderWidthFocus: "var(--select-border-width-focus)";
        readonly bg: "var(--select-bg)";
        readonly border: "var(--select-border)";
        readonly borderFocus: "var(--select-border-focus)";
        readonly bgDisabled: "var(--select-bg-disabled)";
        readonly menu: {
            readonly bg: "var(--select-menu-bg)";
            readonly border: "var(--select-menu-border)";
            readonly radius: "var(--select-menu-radius)";
            readonly shadow: "var(--select-menu-shadow)";
        };
        readonly item: {
            readonly paddingX: "var(--select-item-padding-x)";
            readonly paddingY: "var(--select-item-padding-y)";
            readonly fontSize: "var(--select-item-font-size)";
            readonly lineHeight: "var(--select-item-line-height)";
            readonly hoverBg: "var(--select-item-hover-bg)";
            readonly selectedBg: "var(--select-item-selected-bg)";
            readonly selectedText: "var(--select-item-selected-text)";
        };
    };
    readonly disclosure: {
        readonly gap: "var(--disclosure-gap)";
        readonly iconSize: "var(--disclosure-icon-size)";
        readonly fontSize: "var(--disclosure-font-size)";
        readonly lineHeight: "var(--disclosure-line-height)";
    };
    readonly inlineMessage: {
        readonly padding: "var(--inline-message-padding)";
        readonly gap: "var(--inline-message-gap)";
        readonly radius: "var(--inline-message-radius)";
        readonly fontSize: "var(--inline-message-font-size)";
        readonly lineHeight: "var(--inline-message-line-height)";
        readonly text: "var(--inline-message-text)";
        readonly success: {
            readonly bg: "var(--inline-message-success-bg)";
            readonly icon: "var(--inline-message-success-icon)";
        };
        readonly warning: {
            readonly bg: "var(--inline-message-warning-bg)";
            readonly icon: "var(--inline-message-warning-icon)";
        };
        readonly error: {
            readonly bg: "var(--inline-message-error-bg)";
            readonly icon: "var(--inline-message-error-icon)";
        };
        readonly info: {
            readonly bg: "var(--inline-message-info-bg)";
            readonly icon: "var(--inline-message-info-icon)";
        };
    };
    readonly tabs: {
        readonly gap: "var(--tabs-gap)";
        readonly minWidth: "var(--tabs-min-width)";
        readonly paddingX: "var(--tabs-padding-x)";
        readonly indicatorGap: "var(--tabs-indicator-gap)";
        readonly indicatorHeight: "var(--tabs-indicator-height)";
        readonly panelPadding: "var(--tabs-panel-padding)";
        readonly fontSize: {
            readonly sm: "var(--tabs-font-size-sm)";
            readonly md: "var(--tabs-font-size-md)";
        };
        readonly lineHeight: {
            readonly sm: "var(--tabs-line-height-sm)";
            readonly md: "var(--tabs-line-height-md)";
        };
        readonly activeColor: "var(--tabs-active-color)";
        readonly boxed: {
            readonly padding: "var(--tabs-boxed-padding)";
            readonly bg: "var(--tabs-boxed-bg)";
            readonly border: "var(--tabs-boxed-border)";
            readonly radius: "var(--tabs-boxed-radius)";
            readonly itemPaddingX: "var(--tabs-boxed-item-padding-x)";
            readonly itemPaddingY: "var(--tabs-boxed-item-padding-y)";
            readonly itemRadius: "var(--tabs-boxed-item-radius)";
            readonly activeBg: "var(--tabs-boxed-active-bg)";
        };
        readonly inactiveColor: "var(--tabs-inactive-color)";
        readonly hoverColor: "var(--tabs-hover-color)";
        readonly indicatorColor: "var(--tabs-indicator-color)";
    };
    readonly radio: {
        readonly size: "var(--radio-size)";
        readonly dotSize: "var(--radio-dot-size)";
        readonly gap: "var(--radio-gap)";
        readonly border: "var(--radio-border)";
        readonly borderHover: "var(--radio-border-hover)";
        readonly checkedBorder: "var(--radio-checked-border)";
        readonly checkedDot: "var(--radio-checked-dot)";
        readonly disabledBg: "var(--radio-disabled-bg)";
        readonly disabledBorder: "var(--radio-disabled-border)";
        readonly disabledDot: "var(--radio-disabled-dot)";
        readonly errorText: "var(--radio-error-text)";
        readonly label: {
            readonly size: "var(--radio-label-size)";
            readonly lineHeight: "var(--radio-label-line-height)";
            readonly color: "var(--radio-label-color)";
            readonly disabled: "var(--radio-label-disabled)";
        };
        readonly description: {
            readonly gap: "var(--radio-description-gap)";
            readonly size: "var(--radio-description-size)";
            readonly lineHeight: "var(--radio-description-line-height)";
            readonly color: "var(--radio-description-color)";
        };
        readonly group: {
            readonly gap: "var(--radio-group-gap)";
            readonly labelSize: "var(--radio-group-label-size)";
            readonly labelGap: "var(--radio-group-label-gap)";
            readonly itemGap: "var(--radio-group-item-gap)";
            readonly itemGapHorizontal: "var(--radio-group-item-gap-horizontal)";
        };
    };
    readonly toggle: {
        readonly width: "var(--toggle-width)";
        readonly height: "var(--toggle-height)";
        readonly padding: "var(--toggle-padding)";
        readonly radius: "var(--toggle-radius)";
        readonly gap: "var(--toggle-gap)";
        readonly thumbSize: "var(--toggle-thumb-size)";
        readonly thumbTranslate: "var(--toggle-thumb-translate)";
        readonly bg: "var(--toggle-bg)";
        readonly checkedBg: "var(--toggle-checked-bg)";
        readonly disabledBg: "var(--toggle-disabled-bg)";
        readonly checkedDisabledBg: "var(--toggle-checked-disabled-bg)";
        readonly thumb: "var(--toggle-thumb)";
        readonly thumbDisabled: "var(--toggle-thumb-disabled)";
        readonly label: {
            readonly size: "var(--toggle-label-size)";
            readonly lineHeight: "var(--toggle-label-line-height)";
            readonly color: "var(--toggle-label-color)";
            readonly disabled: "var(--toggle-label-disabled)";
        };
        readonly description: {
            readonly gap: "var(--toggle-description-gap)";
            readonly size: "var(--toggle-description-size)";
            readonly lineHeight: "var(--toggle-description-line-height)";
            readonly color: "var(--toggle-description-color)";
        };
    };
    readonly checkbox: {
        readonly size: "var(--checkbox-size)";
        readonly radius: "var(--checkbox-radius)";
        readonly gap: "var(--checkbox-gap)";
        readonly border: "var(--checkbox-border)";
        readonly borderHover: "var(--checkbox-border-hover)";
        readonly checkedBg: "var(--checkbox-checked-bg)";
        readonly iconColor: "var(--checkbox-icon-color)";
        readonly disabledBg: "var(--checkbox-disabled-bg)";
        readonly disabledBorder: "var(--checkbox-disabled-border)";
        readonly disabledCheckedBg: "var(--checkbox-disabled-checked-bg)";
        readonly iconDisabled: "var(--checkbox-icon-disabled)";
        readonly errorBg: "var(--checkbox-error-bg)";
        readonly errorBorder: "var(--checkbox-error-border)";
        readonly errorText: "var(--checkbox-error-text)";
        readonly label: {
            readonly size: "var(--checkbox-label-size)";
            readonly lineHeight: "var(--checkbox-label-line-height)";
            readonly color: "var(--checkbox-label-color)";
            readonly disabled: "var(--checkbox-label-disabled)";
        };
        readonly description: {
            readonly gap: "var(--checkbox-description-gap)";
            readonly size: "var(--checkbox-description-size)";
            readonly lineHeight: "var(--checkbox-description-line-height)";
            readonly color: "var(--checkbox-description-color)";
        };
        readonly group: {
            readonly gap: "var(--checkbox-group-gap)";
            readonly labelSize: "var(--checkbox-group-label-size)";
            readonly itemGap: "var(--checkbox-group-item-gap)";
            readonly itemGapHorizontal: "var(--checkbox-group-item-gap-horizontal)";
        };
    };
    readonly breadcrumb: {
        readonly gap: "var(--breadcrumb-gap)";
        readonly fontSize: "var(--breadcrumb-font-size)";
        readonly lineHeight: "var(--breadcrumb-line-height)";
        readonly textColor: "var(--breadcrumb-text-color)";
        readonly textHover: "var(--breadcrumb-text-hover)";
        readonly textCurrent: "var(--breadcrumb-text-current)";
        readonly separatorColor: "var(--breadcrumb-separator-color)";
    };
    readonly statusIndicator: {
        readonly paddingX: "var(--status-padding-x)";
        readonly paddingY: "var(--status-padding-y)";
        readonly paddingIconOnly: "var(--status-padding-icon-only)";
        readonly gap: "var(--status-gap)";
        readonly radius: "var(--status-radius)";
        readonly fontSize: "var(--status-font-size)";
        readonly lineHeight: "var(--status-line-height)";
        readonly text: "var(--status-text)";
        readonly activeBg: "var(--status-active-bg)";
        readonly errorBg: "var(--status-error-bg)";
        readonly mutedBg: "var(--status-muted-bg)";
        readonly buildingBg: "var(--status-building-bg)";
    };
    readonly tooltip: {
        readonly paddingX: "var(--tooltip-padding-x)";
        readonly paddingY: "var(--tooltip-padding-y)";
        readonly radius: "var(--tooltip-radius)";
        readonly fontSize: "var(--tooltip-font-size)";
        readonly lineHeight: "var(--tooltip-line-height)";
        readonly minWidth: "var(--tooltip-min-width)";
        readonly maxWidth: "var(--tooltip-max-width)";
        readonly bg: "var(--tooltip-bg)";
        readonly text: "var(--tooltip-text)";
        readonly arrowSize: "var(--tooltip-arrow-size)";
        readonly valueFontWeight: "var(--tooltip-value-font-weight)";
    };
};
/** @deprecated Use `primitive.color` instead */
export declare const colors: {
    readonly white: "var(--color-white)";
    readonly black: "var(--color-black)";
    readonly slate: {
        readonly 50: "var(--color-slate-50)";
        readonly 100: "var(--color-slate-100)";
        readonly 200: "var(--color-slate-200)";
        readonly 300: "var(--color-slate-300)";
        readonly 400: "var(--color-slate-400)";
        readonly 500: "var(--color-slate-500)";
        readonly 600: "var(--color-slate-600)";
        readonly 700: "var(--color-slate-700)";
        readonly 800: "var(--color-slate-800)";
        readonly 900: "var(--color-slate-900)";
    };
    readonly blue: {
        readonly 50: "var(--color-blue-50)";
        readonly 100: "var(--color-blue-100)";
        readonly 200: "var(--color-blue-200)";
        readonly 300: "var(--color-blue-300)";
        readonly 400: "var(--color-blue-400)";
        readonly 500: "var(--color-blue-500)";
        readonly 600: "var(--color-blue-600)";
        readonly 700: "var(--color-blue-700)";
        readonly 800: "var(--color-blue-800)";
        readonly 900: "var(--color-blue-900)";
    };
    readonly red: {
        readonly 50: "var(--color-red-50)";
        readonly 100: "var(--color-red-100)";
        readonly 500: "var(--color-red-500)";
        readonly 600: "var(--color-red-600)";
        readonly 700: "var(--color-red-700)";
        readonly 800: "var(--color-red-800)";
    };
    readonly green: {
        readonly 50: "var(--color-green-50)";
        readonly 100: "var(--color-green-100)";
        readonly 500: "var(--color-green-500)";
        readonly 600: "var(--color-green-600)";
        readonly 700: "var(--color-green-700)";
        readonly 800: "var(--color-green-800)";
    };
    readonly orange: {
        readonly 50: "var(--color-orange-50)";
        readonly 100: "var(--color-orange-100)";
        readonly 500: "var(--color-orange-500)";
        readonly 600: "var(--color-orange-600)";
        readonly 700: "var(--color-orange-700)";
        readonly 800: "var(--color-orange-800)";
    };
    readonly yellow: {
        readonly 50: "var(--color-yellow-50)";
        readonly 100: "var(--color-yellow-100)";
    };
};
/** @deprecated Use `primitive` instead */
export declare const typography: {
    fontFamily: {
        readonly sans: "var(--font-sans)";
        readonly mono: "var(--font-mono)";
    };
    fontSize: {
        readonly 10: "var(--font-size-10)";
        readonly 11: "var(--font-size-11)";
        readonly 12: "var(--font-size-12)";
        readonly 14: "var(--font-size-14)";
        readonly 16: "var(--font-size-16)";
        readonly 18: "var(--font-size-18)";
        readonly 24: "var(--font-size-24)";
        readonly 32: "var(--font-size-32)";
        readonly 40: "var(--font-size-40)";
    };
    fontWeight: {
        readonly regular: "var(--font-weight-regular)";
        readonly medium: "var(--font-weight-medium)";
        readonly semibold: "var(--font-weight-semibold)";
    };
};
/** @deprecated Use `primitive.spacing` instead */
export declare const spacing: {
    readonly 0: "var(--spacing-0)";
    readonly '0-5': "var(--spacing-0-5)";
    readonly 1: "var(--spacing-1)";
    readonly '1-5': "var(--spacing-1-5)";
    readonly 2: "var(--spacing-2)";
    readonly '2-5': "var(--spacing-2-5)";
    readonly 3: "var(--spacing-3)";
    readonly 4: "var(--spacing-4)";
    readonly 5: "var(--spacing-5)";
    readonly 6: "var(--spacing-6)";
    readonly 7: "var(--spacing-7)";
    readonly 8: "var(--spacing-8)";
    readonly 9: "var(--spacing-9)";
    readonly 10: "var(--spacing-10)";
    readonly 12: "var(--spacing-12)";
    readonly 14: "var(--spacing-14)";
    readonly 16: "var(--spacing-16)";
    readonly 20: "var(--spacing-20)";
    readonly 24: "var(--spacing-24)";
    readonly 32: "var(--spacing-32)";
};
/** @deprecated Use `primitive.radius` instead */
export declare const radius: {
    readonly none: "var(--radius-none)";
    readonly sm: "var(--radius-sm)";
    readonly md: "var(--radius-md)";
    readonly lg: "var(--radius-lg)";
    readonly xl: "var(--radius-xl)";
    readonly full: "var(--radius-full)";
};
/** @deprecated Use `primitive.shadow` instead */
export declare const shadows: {
    readonly xs: "var(--shadow-xs)";
    readonly sm: "var(--shadow-sm)";
    readonly md: "var(--shadow-md)";
    readonly lg: "var(--shadow-lg)";
    readonly xl: "var(--shadow-xl)";
};
/** @deprecated Use `primitive.zIndex` instead */
export declare const zIndex: {
    readonly dropdown: 1000;
    readonly sticky: 1100;
    readonly modal: 1200;
    readonly popover: 1300;
    readonly tooltip: 1400;
    readonly toast: 1500;
};
/** @deprecated Use `primitive.duration` instead */
export declare const transitions: {
    readonly fast: "var(--duration-fast)";
    readonly normal: "var(--duration-normal)";
    readonly slow: "var(--duration-slow)";
};
/** @deprecated Use `component.button` instead */
export declare const button: {
    readonly height: {
        readonly sm: "var(--button-height-sm)";
        readonly md: "var(--button-height-md)";
        readonly lg: "var(--button-height-lg)";
    };
    readonly minWidth: {
        readonly sm: "var(--button-min-width-sm)";
        readonly md: "var(--button-min-width-md)";
        readonly lg: "var(--button-min-width-lg)";
    };
    readonly paddingX: {
        readonly sm: "var(--button-padding-x-sm)";
        readonly md: "var(--button-padding-x-md)";
        readonly lg: "var(--button-padding-x-lg)";
    };
    readonly paddingY: {
        readonly sm: "var(--button-padding-y-sm)";
        readonly md: "var(--button-padding-y-md)";
        readonly lg: "var(--button-padding-y-lg)";
    };
    readonly gap: {
        readonly sm: "var(--button-gap-sm)";
        readonly md: "var(--button-gap-md)";
        readonly lg: "var(--button-gap-lg)";
    };
    readonly radius: "var(--button-radius)";
    readonly fontSize: {
        readonly sm: "var(--button-font-size-sm)";
        readonly md: "var(--button-font-size-md)";
        readonly lg: "var(--button-font-size-lg)";
    };
    readonly borderColor: {
        readonly default: "var(--color-border-strong)";
        readonly disabled: "var(--color-border-default)";
    };
    readonly disabledBg: {
        readonly primary: "var(--color-border-default)";
        readonly secondary: "var(--color-surface-subtle)";
    };
    readonly disabledText: {
        readonly primary: "var(--color-text-subtle)";
        readonly secondary: "var(--color-text-disabled)";
    };
};
/** @deprecated Use `component.input` instead */
export declare const input: {
    readonly height: {
        readonly sm: "var(--input-height-sm)";
        readonly md: "var(--input-height-md)";
        readonly lg: "var(--input-height-lg)";
    };
    readonly paddingX: "var(--input-padding-x)";
    readonly paddingY: "var(--input-padding-y)";
    readonly radius: "var(--input-radius)";
    readonly radiusCode: "var(--input-radius-code)";
    readonly iconOffset: "var(--input-icon-offset)";
    readonly labelGap: "var(--input-label-gap)";
    readonly fontSize: "var(--input-font-size)";
    readonly fontSizeSm: "var(--input-font-size-sm)";
    readonly lineHeight: "var(--input-line-height)";
    readonly borderWidth: "var(--input-border-width)";
    readonly borderWidthFocus: "var(--input-border-width-focus)";
    readonly bg: "var(--input-bg)";
    readonly border: "var(--input-border)";
    readonly borderFocus: "var(--input-border-focus)";
    readonly borderReadonly: "var(--input-border-readonly)";
    readonly borderError: "var(--input-border-error)";
    readonly bgDisabled: "var(--input-bg-disabled)";
    readonly textDisabled: "var(--input-text-disabled)";
};
/** @deprecated Use `component.badge` instead */
export declare const badge: {
    readonly paddingX: {
        readonly sm: "var(--badge-padding-x-sm)";
        readonly md: "var(--badge-padding-x-md)";
        readonly lg: "var(--badge-padding-x-lg)";
    };
    readonly paddingY: {
        readonly sm: "var(--badge-padding-y-sm)";
        readonly md: "var(--badge-padding-y-md)";
        readonly lg: "var(--badge-padding-y-lg)";
    };
    readonly fontSize: {
        readonly sm: "var(--badge-font-size-sm)";
        readonly md: "var(--badge-font-size-md)";
        readonly lg: "var(--badge-font-size-lg)";
    };
    readonly lineHeight: {
        readonly sm: "var(--badge-line-height-sm)";
        readonly md: "var(--badge-line-height-md)";
        readonly lg: "var(--badge-line-height-lg)";
    };
    readonly radius: "var(--badge-radius)";
    readonly gap: "var(--badge-gap)";
    readonly dotSize: "var(--badge-dot-size)";
};
/** @deprecated Use `component.menu` instead */
export declare const menu: {
    readonly item: {
        readonly paddingX: "var(--menu-item-padding-x)";
        readonly paddingY: "var(--menu-item-padding-y)";
        readonly gap: "var(--menu-item-gap)";
        readonly radius: "var(--menu-item-radius)";
    };
    readonly section: {
        readonly paddingX: "var(--menu-section-padding-x)";
        readonly paddingY: "var(--menu-section-padding-y)";
    };
    readonly divider: {
        readonly margin: "var(--menu-divider-margin)";
    };
};
