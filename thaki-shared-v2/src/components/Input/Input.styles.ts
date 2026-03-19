import { cva, type VariantProps } from "class-variance-authority";

export const inputContainerStyles = "relative block w-full";

export const inputVariants = cva(
  [
    "w-full border rounded-md",
    "font-sans font-normal text-12",
    "bg-[var(--component-input-color-bg)]",
    "border-[var(--component-input-color-border)]",
    "[color:var(--component-input-color-text)]",
    "placeholder:text-[var(--component-input-color-placeholder)] placeholder:opacity-100",
    "transition-[border-color,background-color,box-shadow] duration-normal ease-in-out",
    "outline-none",
    "hover:enabled:border-[var(--component-input-color-borderFocus)]",
    "hover:enabled:bg-[var(--component-input-color-bgHover)]",
    "focus:border-[var(--component-input-color-borderFocus)]",
    "focus:bg-[var(--component-input-color-bg)]",
  ],
  {
    variants: {
      size: {
        sm: "h-7 py-1.5 px-2",
        md: "h-8 py-2 px-2.5",
        lg: "h-10 py-2.5 px-3",
      },
      error: {
        true: [
          "border-[var(--component-input-color-borderError)]",
          "hover:enabled:border-[var(--component-input-color-borderError)]",
          "focus:border-[var(--component-input-color-borderError)]",
        ],
      },
      success: {
        true: [
          "border-[var(--component-input-color-borderSuccess)]",
          "hover:enabled:border-[var(--component-input-color-borderSuccess)]",
          "focus:border-[var(--component-input-color-borderSuccess)]",
          "focus:shadow-[0_0_0_1px_var(--component-input-color-borderSuccess)]",
        ],
      },
      disabled: {
        true: [
          "border-[var(--semantic-color-borderMuted)]",
          "bg-[var(--component-input-color-bgDisabled)]",
          "[color:var(--semantic-color-textMuted)]",
          "cursor-not-allowed",
          "placeholder:[color:var(--semantic-color-textLight)]",
        ],
      },
      hasToggle: {
        true: "",
      },
    },
    compoundVariants: [
      // Toggle padding adjustments
      { size: "sm", hasToggle: true, class: "pr-10" },
      { size: "md", hasToggle: true, class: "pr-12" },
      { size: "lg", hasToggle: true, class: "pr-14" },
    ],
    defaultVariants: {
      size: "md",
    },
  },
);

export const passwordToggleStyles = cva([
  "absolute right-3 top-1/2 -translate-y-1/2",
  "bg-transparent border-none cursor-pointer p-1 rounded-sm",
  "flex items-center justify-center",
  "[color:var(--component-input-color-placeholder)]",
  "transition-colors duration-normal ease-in-out",
  "hover:enabled:bg-[var(--component-input-color-bgHover)]",
  "hover:enabled:[color:var(--component-input-color-text)]",
  "focus:outline-none focus:bg-[var(--component-input-color-bgHover)]",
  "disabled:[color:var(--semantic-color-textLight)] disabled:cursor-not-allowed disabled:opacity-50",
]);

export type InputVariants = VariantProps<typeof inputVariants>;
