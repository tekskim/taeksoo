import React from 'react';
import { ErrorTemplate } from './ErrorTemplate';
import type { DualActionErrorProps } from './types';

export type Error500Props = DualActionErrorProps;

/** 500 Internal Server Error - Server error page */
export const Error500 = ({
  title = 'Something went wrong',
  description = 'An error occurred while processing your request.',
  statusCode = '500',
  buttonText = 'Go Back',
  homeButtonText = 'Go to Homepage',
  onGoBack,
  onGoHome,
  ...props
}: Error500Props): React.ReactElement => (
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

export default Error500;
