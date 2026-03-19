export interface PasswordPolicy {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireDigit: boolean;
  requireSpecialChar: boolean;
  maxHistory: number;
  expiryDays: number;
}

/**
 * IAM API password policy response format.
 * Used for mapping API responses to the shared PasswordPolicy format.
 */
export interface IamPasswordPolicyResponse {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireDigit: boolean;
  requireSpecial: boolean;
  passwordHistoryCount: number;
  expiryDays: number;
}

/**
 * Maps IAM API password policy response to the shared PasswordPolicy format.
 */
export const mapIamPasswordPolicyToShared = (
  policy: IamPasswordPolicyResponse
): PasswordPolicy => ({
  minLength: policy.minLength,
  maxLength: policy.maxLength,
  requireUppercase: policy.requireUppercase,
  requireLowercase: policy.requireLowercase,
  requireDigit: policy.requireDigit,
  requireSpecialChar: policy.requireSpecial,
  maxHistory: policy.passwordHistoryCount,
  expiryDays: policy.expiryDays,
});

export interface PasswordRequirementsValidation {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export const DEFAULT_MIN_PASSWORD_LENGTH = 8;
export const DEFAULT_MAX_PASSWORD_LENGTH = 128;

export const PASSWORD_PATTERNS = {
  UPPERCASE: /[A-Z]/,
  LOWERCASE: /[a-z]/,
  DIGIT: /[0-9]/,
  SPECIAL_CHAR: /[!@#$%^&*(),.?":{}|<>]/,
} as const;

export const validatePasswordRequirements = (
  password: string,
  policy?: PasswordPolicy
): PasswordRequirementsValidation => {
  const minLength = policy?.minLength ?? DEFAULT_MIN_PASSWORD_LENGTH;
  const maxLength = policy?.maxLength ?? DEFAULT_MAX_PASSWORD_LENGTH;

  const hasValidLength =
    password.length >= minLength && password.length <= maxLength;

  return {
    hasMinLength: hasValidLength,
    hasUppercase: policy?.requireUppercase
      ? PASSWORD_PATTERNS.UPPERCASE.test(password)
      : true,
    hasLowercase: policy?.requireLowercase
      ? PASSWORD_PATTERNS.LOWERCASE.test(password)
      : true,
    hasNumber: policy?.requireDigit
      ? PASSWORD_PATTERNS.DIGIT.test(password)
      : true,
    hasSpecialChar: policy?.requireSpecialChar
      ? PASSWORD_PATTERNS.SPECIAL_CHAR.test(password)
      : true,
  };
};
