import { ElementType } from 'react';

export type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'text'
  | 'text-muted'
  | 'error'
  | 'warning'
  | 'info'
  | 'success';

type AsProp<C extends ElementType> = {
  as?: C;
};
type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);
type PolymorphicComponentProp<
  C extends ElementType,
  Props = {},
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

export const TITLE_LEVELS = [1, 2, 3, 4] as const;
export type TitleLevel = (typeof TITLE_LEVELS)[number];

export type TitleProps<C extends ElementType = 'h1'> = PolymorphicComponentProp<
  C,
  {
    level?: TitleLevel;
    color?: TypographyColor;
    className?: string;
  }
>;

export type TextVariant = 'paragraph' | 'detail' | 'caption';
export type TextProps<C extends ElementType = 'p'> = PolymorphicComponentProp<
  C,
  {
    variant?: TextVariant;
    color?: TypographyColor;
    className?: string;
  }
>;

export type LabelProps<C extends ElementType = 'label'> =
  PolymorphicComponentProp<
    C,
    {
      color?: TypographyColor;
      className?: string;
    }
  >;
