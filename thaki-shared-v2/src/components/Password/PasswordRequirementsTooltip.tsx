import React from 'react';
import type {
  PasswordPolicy,
  PasswordRequirementsValidation,
} from '../../features/auth/utils/passwordUtils';
import {
  DEFAULT_MAX_PASSWORD_LENGTH,
  DEFAULT_MIN_PASSWORD_LENGTH,
} from '../../features/auth/utils/passwordUtils';
import { CheckCircleIcon } from '../Icon';
import Layout from '../Layout';
import { Typography } from '../Typography';

interface Labels {
  minLength?: (minLength: number, maxLength: number) => string;
  uppercase?: string;
  lowercase?: string;
  number?: string;
  specialChar?: string;
  excludeUsername?: string;
  excludeEmail?: string;
}

interface PasswordRequirementsTooltipProps {
  validation: PasswordRequirementsValidation;
  policy?: PasswordPolicy;
  labels?: Labels;
}

const ValidationItem: React.FC<{ isValid: boolean; text: string }> = ({
  isValid,
  text,
}) => {
  const textColor = isValid ? undefined : 'var(--semantic-color-textInverse)';

  return (
    <Layout.HStack gap="sm" align="center">
      <CheckCircleIcon variant={isValid ? 'success' : 'inverse'} size="sm" />
      <Typography.Text
        variant="detail"
        color={isValid ? 'success' : undefined}
        style={{
          whiteSpace: 'nowrap',
          color: textColor,
        }}
      >
        {text}
      </Typography.Text>
    </Layout.HStack>
  );
};

const PasswordRequirementsTooltip: React.FC<
  PasswordRequirementsTooltipProps
> = ({ validation, policy, labels }) => {
  const minLength = policy?.minLength ?? DEFAULT_MIN_PASSWORD_LENGTH;
  const maxLength = policy?.maxLength ?? DEFAULT_MAX_PASSWORD_LENGTH;

  const defaultLabels: Required<Labels> = {
    minLength: (min: number, max: number) => `${min}-${max} characters long`,
    uppercase: 'At least one uppercase letters (A-Z)',
    lowercase: 'At least one lowercase letters (a-z)',
    number: 'At least one number (0-9)',
    specialChar: 'At least one special character',
    excludeUsername: 'Cannot contain username',
    excludeEmail: 'Cannot contain email',
  };

  const l = { ...defaultLabels, ...labels };

  return (
    <Layout.VStack gap="sm" align="start" className="px-xs py-sm">
      <ValidationItem
        isValid={validation.hasMinLength}
        text={l.minLength(minLength, maxLength)}
      />
      {policy?.requireUppercase && (
        <ValidationItem isValid={validation.hasUppercase} text={l.uppercase} />
      )}
      {policy?.requireLowercase && (
        <ValidationItem isValid={validation.hasLowercase} text={l.lowercase} />
      )}
      {policy?.requireDigit && (
        <ValidationItem isValid={validation.hasNumber} text={l.number} />
      )}
      {policy?.requireSpecialChar && (
        <ValidationItem
          isValid={validation.hasSpecialChar}
          text={l.specialChar}
        />
      )}
    </Layout.VStack>
  );
};

export default PasswordRequirementsTooltip;
