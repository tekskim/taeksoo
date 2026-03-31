import React from 'react';
import { ErrorTemplate } from './ErrorTemplate';
import type { DualActionErrorProps } from './types';

export type Error404Props = DualActionErrorProps;

/** 404 Not Found - Page not found error page */
export const Error404 = ({
  title = 'Page Not Found',
  description = 'The requested page does not exist or no longer available.',
  statusCode = '404',
  buttonText = 'Go Back',
  homeButtonText = 'Go to Homepage',
  onGoBack,
  onGoHome,
  ...props
}: Error404Props): React.ReactElement => (
  <ErrorTemplate
    {...props}
    title={title}
    description={description}
    statusCode={statusCode}
    buttonText={buttonText}
    secondaryButtonText={homeButtonText}
    onGoBack={onGoBack}
    onSecondaryAction={onGoHome}
    iconVariant="warning"
    titleColor="warning"
  />
);

export default Error404;
