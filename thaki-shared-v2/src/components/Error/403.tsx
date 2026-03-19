import React from 'react';
import { ErrorTemplate } from './ErrorTemplate';
import type { SingleActionErrorProps } from './types';

export type Error403Props = SingleActionErrorProps;

/** 403 Forbidden - Access denied error page */
export const Error403 = ({
  title = 'Access denied',
  description = "You don't have permission to access this resource.\nContact the administrator to request access.",
  statusCode = '403',
  buttonText = 'Go Back',
  onGoBack,
  ...props
}: Error403Props): React.ReactElement => (
  <ErrorTemplate
    {...props}
    title={title}
    description={description}
    statusCode={statusCode}
    buttonText={buttonText}
    onGoBack={onGoBack}
    iconVariant="warning"
    titleColor="warning"
  />
);

export default Error403;
