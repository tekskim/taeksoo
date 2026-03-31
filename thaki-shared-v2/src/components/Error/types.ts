import type React from 'react';
import type { IconVariant } from '../Icon';

/** Color variants for error page titles */
export type ErrorTitleColor =
  | 'primary'
  | 'secondary'
  | 'text'
  | 'text-muted'
  | 'error'
  | 'warning'
  | 'info'
  | 'success';

/** Base props shared by all error components */
export interface BaseErrorProps {
  className?: string;
  icon?: React.ReactNode;
  iconSize?: number;
  iconVariant?: IconVariant;
  titleColor?: ErrorTitleColor;
}

/** Error content props (optional for specific error pages) */
export interface ErrorContentProps {
  title?: string;
  description?: string;
  statusCode?: string;
  buttonText?: string;
  onGoBack?: () => void;
}

/** Props for single-action error pages (403) */
export type SingleActionErrorProps = BaseErrorProps & ErrorContentProps;

/** Props for dual-action error pages (404, 500) */
export interface DualActionErrorProps extends SingleActionErrorProps {
  onGoHome?: () => void;
  homeButtonText?: string;
}

/** Props for ErrorTemplate (internal) */
export interface ErrorTemplateProps extends BaseErrorProps {
  title: string;
  description: string;
  statusCode: string;
  buttonText?: string;
  secondaryButtonText?: string;
  onGoBack?: () => void;
  onSecondaryAction?: () => void;
}
