import React from 'react';
import { cn } from '../../services/utils/cn';
import { Button } from '../Button';
import { AlertIcon } from '../Icon';
import Layout from '../Layout';
import { Typography } from '../Typography';
import type { ErrorTemplateProps } from './types';

export type { ErrorTemplateProps };

/** Error page template with icon, title, description, and action buttons */
export const ErrorTemplate = ({
  className,
  icon,
  iconSize = 48,
  iconVariant = 'warning',
  onGoBack,
  onSecondaryAction,
  title,
  titleColor = 'warning',
  description,
  statusCode,
  buttonText = 'Go Back',
  secondaryButtonText,
}: ErrorTemplateProps): React.ReactElement => {
  const descriptionLines = description.split('\n');
  const defaultIcon = icon ?? <AlertIcon variant={iconVariant} size={iconSize} />;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'bg-surface rounded-modal px-6 py-6',
        className
      )}
    >
      <Layout.VStack gap="lg" align="center" className="w-full gap-[45px]">
        <Layout.HStack gap="sm" align="center" justify="center" className="w-full pr-5">
          {defaultIcon}
          <Typography.Title
            level={1}
            color={titleColor}
            className="text-4xl leading-48 font-semibold whitespace-nowrap"
          >
            {title}
          </Typography.Title>
        </Layout.HStack>

        <Layout.VStack gap="sm" align="center" className="w-full text-center">
          {descriptionLines.map((line, index) => (
            <Typography.Text
              key={index}
              variant="paragraph"
              color="text-muted"
              className="text-Xl leading-28"
            >
              {line}
            </Typography.Text>
          ))}
          <Typography.Text
            variant="caption"
            className="text-11 leading-16 tracking-[0.275px] uppercase text-text-light"
          >
            Status code: {statusCode}
          </Typography.Text>
        </Layout.VStack>

        {(onGoBack || onSecondaryAction) && (
          <Layout.HStack gap="sm" align="center" justify="center">
            {onGoBack && (
              <Button variant="secondary" appearance="outline" size="lg" onClick={onGoBack}>
                {buttonText}
              </Button>
            )}
            {onSecondaryAction && secondaryButtonText && (
              <Button variant="primary" appearance="solid" size="lg" onClick={onSecondaryAction}>
                {secondaryButtonText}
              </Button>
            )}
          </Layout.HStack>
        )}
      </Layout.VStack>
    </div>
  );
};

export default ErrorTemplate;
