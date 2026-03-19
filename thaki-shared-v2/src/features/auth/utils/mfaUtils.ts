/**
 * MFA (Multi-Factor Authentication) utility functions
 */

/**
 * Returns the i18n key suffix for MFA verification error messages based on HTTP status code.
 *
 * This function maps HTTP error status codes to appropriate error message keys.
 * The returned key is a suffix that should be combined with your namespace prefix.
 *
 * @param status - HTTP status code from the error response
 * @returns i18n key suffix for the error message
 *
 * @example
 * // In platform (login flow):
 * const messageKey = `otpSetup.error.${getMfaVerifyErrorKey(status)}`;
 *
 * // In user-settings:
 * const messageKey = `userSettings:auth.mfa.error.${getMfaVerifyErrorKey(status)}`;
 */
/**
 * Returns the i18n key suffix for MFA email send error messages based on HTTP status code.
 *
 * @param status - HTTP status code from the error response
 * @returns i18n key suffix for the error message
 *
 * @example
 * const messageKey = `mfaVerification.error.${getMfaEmailSendErrorKey(status)}`;
 */
export const getMfaEmailSendErrorKey = (
  status?: number
): 'emailRateLimit' | 'codeExpired' | 'emailSendFailed' => {
  switch (status) {
    case 429:
      return 'emailRateLimit';
    case 401:
    case 408:
      return 'codeExpired';
    default:
      return 'emailSendFailed';
  }
};

export const getMfaVerifyErrorKey = (
  status?: number
): 'codeIncorrect' | 'codeExpired' | 'verifyFailed' => {
  switch (status) {
    case 400:
    case 422:
      return 'codeIncorrect';
    case 401:
    case 408:
      return 'codeExpired';
    default:
      return 'verifyFailed';
  }
};
