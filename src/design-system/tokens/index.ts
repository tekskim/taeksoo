/**
 * TDS Design System Tokens
 * Based on tokens.json structure
 *
 * Layers:
 * 1. primitive - Raw values
 * 2. semantic - Purpose-driven tokens
 * 3. component - Component-specific tokens
 */

/* ========================================
   PRIMITIVE TOKENS
   ======================================== */

export const primitive = {
  color: {
    white: 'var(--color-white)',
    black: 'var(--color-black)',
    slate: {
      50: 'var(--color-slate-50)',
      100: 'var(--color-slate-100)',
      200: 'var(--color-slate-200)',
      300: 'var(--color-slate-300)',
      400: 'var(--color-slate-400)',
      500: 'var(--color-slate-500)',
      600: 'var(--color-slate-600)',
      700: 'var(--color-slate-700)',
      800: 'var(--color-slate-800)',
      900: 'var(--color-slate-900)',
    },
    blue: {
      50: 'var(--color-blue-50)',
      100: 'var(--color-blue-100)',
      200: 'var(--color-blue-200)',
      300: 'var(--color-blue-300)',
      400: 'var(--color-blue-400)',
      500: 'var(--color-blue-500)',
      600: 'var(--color-blue-600)',
      700: 'var(--color-blue-700)',
      800: 'var(--color-blue-800)',
      900: 'var(--color-blue-900)',
    },
    red: {
      50: 'var(--color-red-50)',
      100: 'var(--color-red-100)',
      500: 'var(--color-red-500)',
      600: 'var(--color-red-600)',
      700: 'var(--color-red-700)',
      800: 'var(--color-red-800)',
    },
    green: {
      50: 'var(--color-green-50)',
      100: 'var(--color-green-100)',
      500: 'var(--color-green-500)',
      600: 'var(--color-green-600)',
      700: 'var(--color-green-700)',
      800: 'var(--color-green-800)',
    },
    orange: {
      50: 'var(--color-orange-50)',
      100: 'var(--color-orange-100)',
      500: 'var(--color-orange-500)',
      600: 'var(--color-orange-600)',
      700: 'var(--color-orange-700)',
      800: 'var(--color-orange-800)',
    },
    yellow: {
      50: 'var(--color-yellow-50)',
      100: 'var(--color-yellow-100)',
    },
  },
  spacing: {
    0: 'var(--spacing-0)',
    '0-5': 'var(--spacing-0-5)',
    1: 'var(--spacing-1)',
    '1-5': 'var(--spacing-1-5)',
    2: 'var(--spacing-2)',
    '2-5': 'var(--spacing-2-5)',
    3: 'var(--spacing-3)',
    4: 'var(--spacing-4)',
    5: 'var(--spacing-5)',
    6: 'var(--spacing-6)',
    7: 'var(--spacing-7)',
    8: 'var(--spacing-8)',
    9: 'var(--spacing-9)',
    10: 'var(--spacing-10)',
    12: 'var(--spacing-12)',
    14: 'var(--spacing-14)',
    16: 'var(--spacing-16)',
    20: 'var(--spacing-20)',
    24: 'var(--spacing-24)',
    32: 'var(--spacing-32)',
  },
  fontSize: {
    10: 'var(--font-size-10)', // xs - Caption
    11: 'var(--font-size-11)', // sm - Small labels
    12: 'var(--font-size-12)', // base - Default body
    14: 'var(--font-size-14)', // md - Large body
    16: 'var(--font-size-16)', // lg - Small heading
    18: 'var(--font-size-18)', // xl - Heading
    24: 'var(--font-size-24)', // 2xl - Large heading
    32: 'var(--font-size-32)', // 3xl - Display
    40: 'var(--font-size-40)', // 4xl - Hero
  },
  lineHeight: {
    14: 'var(--line-height-14)',
    16: 'var(--line-height-16)',
    18: 'var(--line-height-18)',
    20: 'var(--line-height-20)',
    24: 'var(--line-height-24)',
    28: 'var(--line-height-28)',
    32: 'var(--line-height-32)',
    40: 'var(--line-height-40)',
    48: 'var(--line-height-48)',
  },
  fontWeight: {
    regular: 'var(--font-weight-regular)', // 400
    medium: 'var(--font-weight-medium)', // 500
    semibold: 'var(--font-weight-semibold)', // 600
  },
  fontFamily: {
    sans: 'var(--font-sans)',
    mono: 'var(--font-mono)',
  },
  radius: {
    none: 'var(--radius-none)',
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    full: 'var(--radius-full)',
  },
  duration: {
    fast: 'var(--duration-fast)', // 150ms
    normal: 'var(--duration-normal)', // 200ms
    slow: 'var(--duration-slow)', // 300ms
  },
  shadow: {
    xs: 'var(--shadow-xs)',
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
    xl: 'var(--shadow-xl)',
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1100,
    modal: 1200,
    popover: 1300,
    tooltip: 1400,
    toast: 1500,
  },
} as const;

/* ========================================
   SEMANTIC TOKENS
   ======================================== */

export const semantic = {
  color: {
    action: {
      primary: 'var(--color-action-primary)',
      primaryHover: 'var(--color-action-primary-hover)',
      primaryActive: 'var(--color-action-primary-active)',
    },
    text: {
      default: 'var(--color-text-default)',
      muted: 'var(--color-text-muted)',
      subtle: 'var(--color-text-subtle)',
      disabled: 'var(--color-text-disabled)',
      inverse: 'var(--color-text-inverse)',
      onPrimary: 'var(--color-text-on-primary)',
    },
    surface: {
      default: 'var(--color-surface-default)',
      subtle: 'var(--color-surface-subtle)',
      muted: 'var(--color-surface-muted)',
      inverse: 'var(--color-surface-inverse)',
    },
    border: {
      default: 'var(--color-border-default)',
      subtle: 'var(--color-border-subtle)',
      strong: 'var(--color-border-strong)',
      focus: 'var(--color-border-focus)',
    },
    state: {
      info: {
        default: 'var(--color-state-info)',
        bg: 'var(--color-state-info-bg)',
        text: 'var(--color-state-info-text)',
      },
      success: {
        default: 'var(--color-state-success)',
        bg: 'var(--color-state-success-bg)',
        text: 'var(--color-state-success-text)',
      },
      warning: {
        default: 'var(--color-state-warning)',
        bg: 'var(--color-state-warning-bg)',
        text: 'var(--color-state-warning-text)',
      },
      danger: {
        default: 'var(--color-state-danger)',
        bg: 'var(--color-state-danger-bg)',
        text: 'var(--color-state-danger-text)',
      },
    },
  },
  radius: {
    field: 'var(--radius-field)',
    button: 'var(--radius-button)',
    card: 'var(--radius-card)',
    modal: 'var(--radius-modal)',
    pill: 'var(--radius-pill)',
  },
  spacing: {
    component: {
      '3xs': 'var(--spacing-component-3xs)', // 2px
      '2xs': 'var(--spacing-component-2xs)', // 4px
      xs: 'var(--spacing-component-xs)', // 6px
      sm: 'var(--spacing-component-sm)', // 8px
      md: 'var(--spacing-component-md)', // 12px
      lg: 'var(--spacing-component-lg)', // 16px
      xl: 'var(--spacing-component-xl)', // 24px
    },
    layout: {
      xs: 'var(--spacing-layout-xs)', // 16px
      sm: 'var(--spacing-layout-sm)', // 24px
      md: 'var(--spacing-layout-md)', // 32px
      lg: 'var(--spacing-layout-lg)', // 48px
      xl: 'var(--spacing-layout-xl)', // 64px
      '2xl': 'var(--spacing-layout-2xl)', // 96px
    },
  },
  typography: {
    heading: {
      h1: { fontSize: primitive.fontSize[40], lineHeight: primitive.lineHeight[48] },
      h2: { fontSize: primitive.fontSize[32], lineHeight: primitive.lineHeight[40] },
      h3: { fontSize: primitive.fontSize[24], lineHeight: primitive.lineHeight[32] },
      h4: { fontSize: primitive.fontSize[18], lineHeight: primitive.lineHeight[28] },
      h5: { fontSize: primitive.fontSize[16], lineHeight: primitive.lineHeight[24] },
      h6: { fontSize: primitive.fontSize[14], lineHeight: primitive.lineHeight[20] },
    },
    body: {
      lg: { fontSize: primitive.fontSize[14], lineHeight: primitive.lineHeight[20] },
      md: { fontSize: primitive.fontSize[12], lineHeight: primitive.lineHeight[18] },
      sm: { fontSize: primitive.fontSize[11], lineHeight: primitive.lineHeight[16] },
      xs: { fontSize: primitive.fontSize[10], lineHeight: primitive.lineHeight[14] },
    },
    label: {
      lg: { fontSize: primitive.fontSize[14], lineHeight: primitive.lineHeight[20] },
      md: { fontSize: primitive.fontSize[12], lineHeight: primitive.lineHeight[16] },
      sm: { fontSize: primitive.fontSize[11], lineHeight: primitive.lineHeight[16] },
    },
    button: {
      lg: { fontSize: primitive.fontSize[14], lineHeight: primitive.lineHeight[20] },
      md: { fontSize: primitive.fontSize[12], lineHeight: primitive.lineHeight[16] },
      sm: { fontSize: primitive.fontSize[11], lineHeight: primitive.lineHeight[16] },
    },
    code: {
      md: { fontSize: primitive.fontSize[12], lineHeight: primitive.lineHeight[18] },
      sm: { fontSize: primitive.fontSize[11], lineHeight: primitive.lineHeight[16] },
    },
  },
} as const;

/* ========================================
   COMPONENT TOKENS
   ======================================== */

export const component = {
  button: {
    height: {
      sm: 'var(--button-height-sm)', // 28px
      md: 'var(--button-height-md)', // 28px
      lg: 'var(--button-height-lg)', // 40px
    },
    minWidth: {
      sm: 'var(--button-min-width-sm)', // 68px
      md: 'var(--button-min-width-md)', // 80px
      lg: 'var(--button-min-width-lg)', // 80px
    },
    paddingX: {
      sm: 'var(--button-padding-x-sm)', // 10px
      md: 'var(--button-padding-x-md)', // 12px
      lg: 'var(--button-padding-x-lg)', // 12px
    },
    paddingY: {
      sm: 'var(--button-padding-y-sm)', // 6px
      md: 'var(--button-padding-y-md)', // 8px
      lg: 'var(--button-padding-y-lg)', // 10px
    },
    gap: {
      sm: 'var(--button-gap-sm)', // 6px
      md: 'var(--button-gap-md)', // 6px
      lg: 'var(--button-gap-lg)', // 8px
    },
    radius: 'var(--button-radius)', // 6px
    fontSize: {
      sm: 'var(--button-font-size-sm)', // 12px
      md: 'var(--button-font-size-md)', // 11px
      lg: 'var(--button-font-size-lg)', // 12px
    },
    // Border colors per Figma spec
    borderColor: {
      default: 'var(--color-border-strong)', // slate-300 for secondary
      disabled: 'var(--color-border-default)', // slate-200 for disabled
    },
    // Disabled backgrounds per Figma spec
    disabledBg: {
      primary: 'var(--color-border-default)', // slate-200
      secondary: 'var(--color-surface-subtle)', // slate-50
    },
    // Disabled text colors (WCAG AA compliant)
    disabledText: {
      primary: 'var(--color-text-subtle)', // slate-500 (4.57:1 contrast)
      secondary: 'var(--color-text-disabled)', // slate-400
    },
  },
  input: {
    height: {
      sm: 'var(--input-height-sm)', // 28px
      md: 'var(--input-height-md)', // 32px
      lg: 'var(--input-height-lg)', // 40px
    },
    paddingX: 'var(--input-padding-x)', // 10px
    paddingY: 'var(--input-padding-y)', // 8px
    radius: 'var(--input-radius)', // 6px
    radiusCode: 'var(--input-radius-code)', // 4px
    iconOffset: 'var(--input-icon-offset)', // 8px
    labelGap: 'var(--input-label-gap)', // 8px
    fontSize: 'var(--input-font-size)', // 12px
    fontSizeSm: 'var(--input-font-size-sm)', // 11px
    lineHeight: 'var(--input-line-height)', // 16px
    borderWidth: 'var(--input-border-width)', // 1px
    borderWidthFocus: 'var(--input-border-width-focus)', // 2px
    bg: 'var(--input-bg)',
    border: 'var(--input-border)',
    borderFocus: 'var(--input-border-focus)',
    borderReadonly: 'var(--input-border-readonly)',
    borderError: 'var(--input-border-error)',
    bgDisabled: 'var(--input-bg-disabled)',
    textDisabled: 'var(--input-text-disabled)',
  },
  textarea: {
    minHeight: 'var(--textarea-min-height)', // 70px
  },
  numberInput: {
    height: 'var(--number-input-height)', // 32px
    paddingY: 'var(--number-input-padding-y)', // 4px
    buttonSize: 'var(--number-input-button-size)', // 12px
  },
  searchInput: {
    heightSm: 'var(--search-input-height-sm)', // 28px
    heightMd: 'var(--search-input-height-md)', // 28px
    iconSize: 'var(--search-input-icon-size)', // 12px
  },
  badge: {
    // Size: SM - padding 6×2px, font 11px
    paddingX: {
      sm: 'var(--badge-padding-x-sm)', // 6px
      md: 'var(--badge-padding-x-md)', // 8px
      lg: 'var(--badge-padding-x-lg)', // 12px
    },
    paddingY: {
      sm: 'var(--badge-padding-y-sm)', // 2px
      md: 'var(--badge-padding-y-md)', // 4px
      lg: 'var(--badge-padding-y-lg)', // 4px
    },
    fontSize: {
      sm: 'var(--badge-font-size-sm)', // 11px
      md: 'var(--badge-font-size-md)', // 12px
      lg: 'var(--badge-font-size-lg)', // 14px
    },
    lineHeight: {
      sm: 'var(--badge-line-height-sm)', // 16px
      md: 'var(--badge-line-height-md)', // 16px
      lg: 'var(--badge-line-height-lg)', // 20px
    },
    radius: 'var(--badge-radius)', // 6px (md)
    gap: 'var(--badge-gap)', // 4px
    dotSize: 'var(--badge-dot-size)', // 6px
  },
  menu: {
    item: {
      paddingX: 'var(--menu-item-padding-x)',
      paddingY: 'var(--menu-item-padding-y)',
      gap: 'var(--menu-item-gap)',
      radius: 'var(--menu-item-radius)',
    },
    section: {
      paddingX: 'var(--menu-section-padding-x)',
      paddingY: 'var(--menu-section-padding-y)',
    },
    divider: {
      margin: 'var(--menu-divider-margin)',
    },
  },
  card: {
    padding: {
      sm: 'var(--card-padding-sm)',
      md: 'var(--card-padding-md)',
      lg: 'var(--card-padding-lg)',
    },
    radius: 'var(--card-radius)',
    gap: 'var(--card-gap)',
  },
  modal: {
    padding: 'var(--modal-padding)',
    radius: 'var(--modal-radius)',
    gap: 'var(--modal-gap)',
  },
  chip: {
    paddingLeft: 'var(--chip-padding-left)', // 8px
    paddingRight: 'var(--chip-padding-right)', // 6px
    paddingY: 'var(--chip-padding-y)', // 4px
    gap: 'var(--chip-gap)', // 6px
    radius: 'var(--chip-radius)', // 6px
    fontSize: 'var(--chip-font-size)', // 11px
    lineHeight: 'var(--chip-line-height)', // 16px
    bg: 'var(--chip-bg)', // surface-default
    border: 'var(--chip-border)', // border-default
    separatorColor: 'var(--chip-separator-color)', // border-default
  },
  slider: {
    trackHeight: 'var(--slider-track-height)', // 6px
    trackRadius: 'var(--slider-track-radius)', // 8px
    trackBg: 'var(--slider-track-bg)', // border-subtle
    fillBg: 'var(--slider-fill-bg)', // action-primary
    thumbSize: 'var(--slider-thumb-size)', // 16px
    thumbBg: 'var(--slider-thumb-bg)', // surface-default
    thumbBorder: 'var(--slider-thumb-border)', // action-primary
    thumbBorderWidth: 'var(--slider-thumb-border-width)', // 3px
    thumbShadow: 'var(--slider-thumb-shadow)', // shadow-sm
    gap: 'var(--slider-gap)', // 12px
    valueFontSize: 'var(--slider-value-font-size)', // 12px
  },
  select: {
    paddingX: 'var(--select-padding-x)', // 10px
    paddingY: 'var(--select-padding-y)', // 8px
    radius: 'var(--select-radius)', // 6px
    fontSize: 'var(--select-font-size)', // 12px
    lineHeight: 'var(--select-line-height)', // 16px
    borderWidth: 'var(--select-border-width)', // 1px
    borderWidthFocus: 'var(--select-border-width-focus)', // 2px
    bg: 'var(--select-bg)',
    border: 'var(--select-border)',
    borderFocus: 'var(--select-border-focus)',
    bgDisabled: 'var(--select-bg-disabled)',
    menu: {
      bg: 'var(--select-menu-bg)',
      border: 'var(--select-menu-border)',
      radius: 'var(--select-menu-radius)',
      shadow: 'var(--select-menu-shadow)',
    },
    item: {
      paddingX: 'var(--select-item-padding-x)', // 10px
      paddingY: 'var(--select-item-padding-y)', // 6px
      fontSize: 'var(--select-item-font-size)', // 11px
      lineHeight: 'var(--select-item-line-height)', // 16px
      hoverBg: 'var(--select-item-hover-bg)', // slate-50
      selectedBg: 'var(--select-item-selected-bg)', // blue-50
      selectedText: 'var(--select-item-selected-text)', // action-primary
    },
  },
  disclosure: {
    gap: 'var(--disclosure-gap)', // 6px
    iconSize: 'var(--disclosure-icon-size)', // 12px
    fontSize: 'var(--disclosure-font-size)', // 14px
    lineHeight: 'var(--disclosure-line-height)', // 20px
  },
  inlineMessage: {
    padding: 'var(--inline-message-padding)', // 12px
    gap: 'var(--inline-message-gap)', // 8px
    radius: 'var(--inline-message-radius)', // 6px
    fontSize: 'var(--inline-message-font-size)', // 12px
    lineHeight: 'var(--inline-message-line-height)', // 16px
    text: 'var(--inline-message-text)', // text-default
    success: {
      bg: 'var(--inline-message-success-bg)', // green-50
      icon: 'var(--inline-message-success-icon)', // green-600
    },
    warning: {
      bg: 'var(--inline-message-warning-bg)', // orange-50
      icon: 'var(--inline-message-warning-icon)', // orange-600
    },
    error: {
      bg: 'var(--inline-message-error-bg)', // red-50
      icon: 'var(--inline-message-error-icon)', // red-600
    },
    info: {
      bg: 'var(--inline-message-info-bg)', // blue-50
      icon: 'var(--inline-message-info-icon)', // blue-600
    },
  },
  tabs: {
    gap: 'var(--tabs-gap)', // 24px
    minWidth: 'var(--tabs-min-width)', // 80px
    paddingX: 'var(--tabs-padding-x)', // 12px
    indicatorGap: 'var(--tabs-indicator-gap)', // 10px
    indicatorHeight: 'var(--tabs-indicator-height)', // 2px
    panelPadding: 'var(--tabs-panel-padding)', // 0
    fontSize: {
      sm: 'var(--tabs-font-size-sm)', // 12px
      md: 'var(--tabs-font-size-md)', // 14px
    },
    lineHeight: {
      sm: 'var(--tabs-line-height-sm)', // 16px
      md: 'var(--tabs-line-height-md)', // 20px
    },
    activeColor: 'var(--tabs-active-color)', // action-primary
    // Boxed variant
    boxed: {
      padding: 'var(--tabs-boxed-padding)', // 0px
      bg: 'var(--tabs-boxed-bg)', // transparent
      border: 'var(--tabs-boxed-border)', // border-default
      radius: 'var(--tabs-boxed-radius)', // 4px
      itemPaddingX: 'var(--tabs-boxed-item-padding-x)', // 24px
      itemPaddingY: 'var(--tabs-boxed-item-padding-y)', // 8px
      itemRadius: 'var(--tabs-boxed-item-radius)', // 4px
      activeBg: 'var(--tabs-boxed-active-bg)', // surface-default
    },
    inactiveColor: 'var(--tabs-inactive-color)', // text-subtle
    hoverColor: 'var(--tabs-hover-color)', // text-default
    indicatorColor: 'var(--tabs-indicator-color)', // action-primary
  },
  radio: {
    size: 'var(--radio-size)', // 16px
    dotSize: 'var(--radio-dot-size)', // 6px
    gap: 'var(--radio-gap)', // 6px
    border: 'var(--radio-border)', // slate-300
    borderHover: 'var(--radio-border-hover)', // action-primary
    checkedBorder: 'var(--radio-checked-border)', // action-primary
    checkedDot: 'var(--radio-checked-dot)', // action-primary
    disabledBg: 'var(--radio-disabled-bg)',
    disabledBorder: 'var(--radio-disabled-border)',
    disabledDot: 'var(--radio-disabled-dot)',
    errorText: 'var(--radio-error-text)',
    label: {
      size: 'var(--radio-label-size)',
      lineHeight: 'var(--radio-label-line-height)',
      color: 'var(--radio-label-color)',
      disabled: 'var(--radio-label-disabled)',
    },
    description: {
      gap: 'var(--radio-description-gap)',
      size: 'var(--radio-description-size)',
      lineHeight: 'var(--radio-description-line-height)',
      color: 'var(--radio-description-color)',
    },
    group: {
      gap: 'var(--radio-group-gap)',
      labelSize: 'var(--radio-group-label-size)',
      labelGap: 'var(--radio-group-label-gap)',
      itemGap: 'var(--radio-group-item-gap)',
      itemGapHorizontal: 'var(--radio-group-item-gap-horizontal)',
    },
  },
  toggle: {
    width: 'var(--toggle-width)', // 48px
    height: 'var(--toggle-height)', // 24px
    padding: 'var(--toggle-padding)', // 4px
    radius: 'var(--toggle-radius)', // pill
    gap: 'var(--toggle-gap)', // 8px
    thumbSize: 'var(--toggle-thumb-size)', // 16px
    thumbTranslate: 'var(--toggle-thumb-translate)', // 24px
    bg: 'var(--toggle-bg)', // slate-200
    checkedBg: 'var(--toggle-checked-bg)', // action-primary
    disabledBg: 'var(--toggle-disabled-bg)',
    checkedDisabledBg: 'var(--toggle-checked-disabled-bg)',
    thumb: 'var(--toggle-thumb)', // white
    thumbDisabled: 'var(--toggle-thumb-disabled)',
    label: {
      size: 'var(--toggle-label-size)',
      lineHeight: 'var(--toggle-label-line-height)',
      color: 'var(--toggle-label-color)',
      disabled: 'var(--toggle-label-disabled)',
    },
    description: {
      gap: 'var(--toggle-description-gap)',
      size: 'var(--toggle-description-size)',
      lineHeight: 'var(--toggle-description-line-height)',
      color: 'var(--toggle-description-color)',
    },
  },
  checkbox: {
    size: 'var(--checkbox-size)', // 16px
    radius: 'var(--checkbox-radius)', // 4px
    gap: 'var(--checkbox-gap)', // 6px
    border: 'var(--checkbox-border)', // border-strong
    borderHover: 'var(--checkbox-border-hover)', // action-primary
    checkedBg: 'var(--checkbox-checked-bg)', // action-primary
    iconColor: 'var(--checkbox-icon-color)', // white
    disabledBg: 'var(--checkbox-disabled-bg)',
    disabledBorder: 'var(--checkbox-disabled-border)',
    disabledCheckedBg: 'var(--checkbox-disabled-checked-bg)',
    iconDisabled: 'var(--checkbox-icon-disabled)',
    errorBg: 'var(--checkbox-error-bg)',
    errorBorder: 'var(--checkbox-error-border)',
    errorText: 'var(--checkbox-error-text)',
    label: {
      size: 'var(--checkbox-label-size)',
      lineHeight: 'var(--checkbox-label-line-height)',
      color: 'var(--checkbox-label-color)',
      disabled: 'var(--checkbox-label-disabled)',
    },
    description: {
      gap: 'var(--checkbox-description-gap)',
      size: 'var(--checkbox-description-size)',
      lineHeight: 'var(--checkbox-description-line-height)',
      color: 'var(--checkbox-description-color)',
    },
    group: {
      gap: 'var(--checkbox-group-gap)',
      labelSize: 'var(--checkbox-group-label-size)',
      itemGap: 'var(--checkbox-group-item-gap)',
      itemGapHorizontal: 'var(--checkbox-group-item-gap-horizontal)',
    },
  },
  breadcrumb: {
    gap: 'var(--breadcrumb-gap)', // 4px
    fontSize: 'var(--breadcrumb-font-size)', // 11px
    lineHeight: 'var(--breadcrumb-line-height)', // 16px
    textColor: 'var(--breadcrumb-text-color)', // text-subtle
    textHover: 'var(--breadcrumb-text-hover)', // text-default
    textCurrent: 'var(--breadcrumb-text-current)', // text-default
    separatorColor: 'var(--breadcrumb-separator-color)', // text-subtle
  },
  statusIndicator: {
    paddingX: 'var(--status-padding-x)', // 6px
    paddingY: 'var(--status-padding-y)', // 4px
    paddingIconOnly: 'var(--status-padding-icon-only)', // 4px
    gap: 'var(--status-gap)', // 4px
    radius: 'var(--status-radius)', // pill (16px)
    fontSize: 'var(--status-font-size)', // 11px
    lineHeight: 'var(--status-line-height)', // 16px
    text: 'var(--status-text)', // white
    activeBg: 'var(--status-active-bg)', // green-400
    errorBg: 'var(--status-error-bg)', // red-400
    mutedBg: 'var(--status-muted-bg)', // slate-600
    buildingBg: 'var(--status-building-bg)', // blue-400
  },
  tooltip: {
    paddingX: 'var(--tooltip-padding-x)', // 8px
    paddingY: 'var(--tooltip-padding-y)', // 4px
    radius: 'var(--tooltip-radius)', // 4px
    fontSize: 'var(--tooltip-font-size)', // 11px
    lineHeight: 'var(--tooltip-line-height)', // 16px
    minWidth: 'var(--tooltip-min-width)', // 60px
    maxWidth: 'var(--tooltip-max-width)', // 230px
    bg: 'var(--tooltip-bg)', // slate-900
    text: 'var(--tooltip-text)', // white
    arrowSize: 'var(--tooltip-arrow-size)', // 4px
    valueFontWeight: 'var(--tooltip-value-font-weight)', // 500
  },
} as const;

/* ========================================
   LEGACY EXPORTS (for backward compatibility)
   ======================================== */

/** @deprecated Use `primitive.color` instead */
export const colors = primitive.color;

/** @deprecated Use `primitive` instead */
export const typography = {
  fontFamily: primitive.fontFamily,
  fontSize: primitive.fontSize,
  fontWeight: primitive.fontWeight,
};

/** @deprecated Use `primitive.spacing` instead */
export const spacing = primitive.spacing;

/** @deprecated Use `primitive.radius` instead */
export const radius = primitive.radius;

/** @deprecated Use `primitive.shadow` instead */
export const shadows = primitive.shadow;

/** @deprecated Use `primitive.zIndex` instead */
export const zIndex = primitive.zIndex;

/** @deprecated Use `primitive.duration` instead */
export const transitions = primitive.duration;

/** @deprecated Use `component.button` instead */
export const button = component.button;

/** @deprecated Use `component.input` instead */
export const input = component.input;

/** @deprecated Use `component.badge` instead */
export const badge = component.badge;

/** @deprecated Use `component.menu` instead */
export const menu = component.menu;
