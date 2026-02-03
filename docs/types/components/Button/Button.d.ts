import { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import { VariantProps } from 'class-variance-authority';
declare const buttonVariants: (props?: ({
    variant?: "link" | "primary" | "secondary" | "outline" | "ghost" | "muted" | "danger" | "warning" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
    fullWidth?: boolean | null | undefined;
    iconOnly?: boolean | null | undefined;
} & import('class-variance-authority/types').ClassProp) | undefined) => string;
type AsProp<C extends ElementType> = {
    as?: C;
};
type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);
type PolymorphicComponentProp<C extends ElementType, Props = object> = React.PropsWithChildren<Props & AsProp<C>> & Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;
type PolymorphicRef<C extends ElementType> = ComponentPropsWithoutRef<C>['ref'] extends never ? React.Ref<Element> : ComponentPropsWithoutRef<C>['ref'];
type PolymorphicComponentPropWithRef<C extends ElementType, Props = object> = PolymorphicComponentProp<C, Props> & {
    ref?: PolymorphicRef<C>;
};
export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
export type ButtonSize = VariantProps<typeof buttonVariants>['size'];
type ButtonBaseProps = {
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    icon?: ReactNode;
} & VariantProps<typeof buttonVariants>;
type IconOnlyProps = {
    icon: ReactNode;
    'aria-label': string;
    children?: never;
};
type TextButtonProps = {
    icon?: never;
    'aria-label'?: string;
    children?: ReactNode;
};
export type ButtonProps<C extends ElementType = 'button'> = PolymorphicComponentPropWithRef<C, ButtonBaseProps & (IconOnlyProps | TextButtonProps)>;
type ButtonComponent = <C extends ElementType = 'button'>(props: ButtonProps<C>) => React.ReactElement | null;
export declare const Button: ButtonComponent;
export { buttonVariants };
