import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, VStack, HStack, Input } from '@/design-system';
import { IconArrowLeft, IconCopy, IconCheck, IconCode, IconEye } from '@tabler/icons-react';
import thakiLogoLight from '@/assets/thakiLogo_light.svg';

/* ----------------------------------------
   Template Configurations ---------------------------------------- */

type TemplateType = 'account-invitation' | 'reset-password' | 'email-mfa';

const templateConfig: Record<TemplateType, { title: string; description: string }> = {
  'account-invitation': {
    title: 'Account Invitation',
    description: 'Sent when an administrator creates a new account',
  },
  'reset-password': {
    title: 'Reset Password',
    description: 'Sent when a user requests to reset their password',
  },
  'email-mfa': {
    title: 'Email MFA',
    description: 'Sent for email-based multi-factor authentication',
  },
};

/* ----------------------------------------
   THAKI Logo Component ---------------------------------------- */

function ThakiLogo() {
  return (
    <img
      src={thakiLogoLight}
      alt="THAKI Cloud"
      style={{ height: '20px', display: 'block', alignSelf: 'flex-start' }}
    />
  );
}

/* ----------------------------------------
   1. Account Invitation Template ---------------------------------------- */

interface AccountInvitationProps {
  displayName: string;
  domainName: string;
  username: string;
  expiryDays: number;
  actionUrl: string;
  lang?: 'en' | 'ko';
}

function AccountInvitationTemplate({
  displayName,
  domainName,
  username,
  expiryDays,
  actionUrl,
  lang = 'en',
}: AccountInvitationProps) {
  const t = {
    en: {
      greeting: 'Hello',
      greetingSuffix: ',',
      body1: 'Your administrator from',
      body2: 'in Thaki Cloud has created a new account for you.',
      body3: 'To get started, please set your password using the secure link below.',
      usernameLabel: 'Your username',
      buttonText: 'Get Started',
      warning: 'This link will expire in',
      warningDays: 'days.',
    },
    ko: {
      greeting: '안녕하세요',
      greetingSuffix: ' 님,',
      body1: '',
      body2: '조직의 관리자가 Thaki Cloud 계정을 생성했습니다.',
      body3: '아래의 보안 링크를 통해 비밀번호를 설정하여 사용을 시작해 주세요.',
      usernameLabel: '사용자 이름',
      buttonText: '시작하기',
      warning: '이 링크는',
      warningDays: '일 후 만료됩니다.',
    },
  }[lang];

  return (
    <div className="flex flex-col gap-3 items-start w-full max-w-[600px]">
      <div className="bg-white rounded-lg p-6 w-full flex flex-col gap-6 border border-[var(--color-border-default)]">
        <ThakiLogo />
        <div className="text-body-md leading-[18px] mt-4" style={{ color: '#64748b' }}>
          <p className="mb-4">
            {t.greeting}{' '}
            <span className="text-label-md " style={{ color: '#0f172a' }}>
              {displayName}
            </span>
            {t.greetingSuffix}
          </p>
          <p className="mb-0">
            {lang === 'en' ? (
              <>
                {t.body1}{' '}
                <span className="text-label-md " style={{ color: '#0f172a' }}>
                  {domainName}
                </span>{' '}
                {t.body2}
                <br />
                {t.body3}
              </>
            ) : (
              <>
                <span className="text-label-md " style={{ color: '#0f172a' }}>
                  {domainName}
                </span>{' '}
                {t.body2}
                <br />
                {t.body3}
              </>
            )}
          </p>
        </div>
        <div
          className="rounded-lg px-4 py-3 flex flex-col gap-1.5 w-full"
          style={{ backgroundColor: '#f8fafc' }}
        >
          <span className="text-label-sm leading-4" style={{ color: '#64748b' }}>
            {t.usernameLabel}{' '}
          </span>
          <span className="text-heading-h3" style={{ color: '#0f172a' }}>
            {username}
          </span>
        </div>
        <Button as="a" href={actionUrl} variant="primary" size="lg" className="self-start">
          {t.buttonText}{' '}
        </Button>
        <div
          className="flex items-start gap-2 p-3 rounded-md w-full"
          style={{ backgroundColor: '#fff7ed' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ea580c"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0 mt-0.5"
          >
            <path d="M10.24 3.957l-8.424 14.566a1.998 1.998 0 0 0 1.735 2.917h16.848a1.998 1.998 0 0 0 1.735 -2.917l-8.424 -14.566a1.998 1.998 0 0 0 -3.47 0z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
          <span className="text-body-sm leading-4" style={{ color: '#475569' }}>
            {t.warning}{' '}
            <span className="font-medium" style={{ color: '#0f172a' }}>
              {expiryDays} {t.warningDays}
            </span>
          </span>
        </div>
      </div>
      <span className="text-body-sm leading-4 text-center w-full" style={{ color: '#64748b' }}>
        © Thaki Cloud, All rights reserved.
      </span>
    </div>
  );
}

/* ----------------------------------------
   2. Reset Password Template ---------------------------------------- */

interface ResetPasswordProps {
  displayName: string;
  domainName: string;
  username: string;
  expiryHours: number;
  actionUrl: string;
  lang?: 'en' | 'ko';
}

function ResetPasswordTemplate({
  displayName,
  domainName,
  username,
  expiryHours,
  actionUrl,
  lang = 'en',
}: ResetPasswordProps) {
  const t = {
    en: {
      greeting: 'Hello',
      greetingSuffix: ',',
      body1: 'Your administrator from',
      body2: 'in Thaki Cloud has reset your password.',
      body3:
        'To regain access to your account, please create a new password using the secure link below.',
      usernameLabel: 'Your username',
      buttonText: 'Reset password',
      warning: 'This temporary password will expire in',
      warningTime: 'hour.',
    },
    ko: {
      greeting: '안녕하세요',
      greetingSuffix: '님,',
      body1: '',
      body2: '조직의 관리자가 Thaki Cloud 계정의 비밀번호 변경을 요청했습니다.',
      body3: '계정에 다시 접근하려면 아래의 보안 링크를 통해 새 비밀번호를 설정해 주세요.',
      usernameLabel: '사용자 이름',
      buttonText: '비밀번호 재설정',
      warning: '이 링크는',
      warningTime: '시간 후 만료됩니다.',
    },
  }[lang];

  return (
    <div className="flex flex-col gap-3 items-start w-full max-w-[600px]">
      <div className="bg-white rounded-lg p-6 w-full flex flex-col gap-6 border border-[var(--color-border-default)]">
        <ThakiLogo />
        <div className="text-body-md leading-[18px] mt-4" style={{ color: '#0f172a' }}>
          <p className="mb-4">
            {t.greeting}{' '}
            <span className="text-label-md " style={{ color: '#0f172a' }}>
              {displayName}
            </span>
            {t.greetingSuffix}
          </p>
          <p className="mb-0">
            {lang === 'en' ? (
              <>
                {t.body1}{' '}
                <span className="text-label-md " style={{ color: '#0f172a' }}>
                  {domainName}
                </span>{' '}
                {t.body2}
                <br />
                {t.body3}
              </>
            ) : (
              <>
                <span className="text-label-md " style={{ color: '#0f172a' }}>
                  {domainName}
                </span>{' '}
                {t.body2}
                <br />
                {t.body3}
              </>
            )}
          </p>
        </div>
        <div
          className="rounded-lg px-4 py-3 flex flex-col gap-1.5 w-full"
          style={{ backgroundColor: '#f8fafc' }}
        >
          <span className="text-label-sm leading-4" style={{ color: '#64748b' }}>
            {t.usernameLabel}{' '}
          </span>
          <span className="text-heading-h3" style={{ color: '#0f172a' }}>
            {username}
          </span>
        </div>
        <Button as="a" href={actionUrl} variant="primary" size="lg" className="self-start">
          {t.buttonText}{' '}
        </Button>
        <div
          className="flex items-start gap-2 p-3 rounded-md w-full"
          style={{ backgroundColor: '#fff7ed' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ea580c"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0 mt-0.5"
          >
            <path d="M10.24 3.957l-8.424 14.566a1.998 1.998 0 0 0 1.735 2.917h16.848a1.998 1.998 0 0 0 1.735 -2.917l-8.424 -14.566a1.998 1.998 0 0 0 -3.47 0z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
          <span className="text-body-sm leading-4" style={{ color: '#475569' }}>
            {t.warning}{' '}
            <span className="font-medium" style={{ color: '#0f172a' }}>
              {expiryHours} {t.warningTime}
            </span>
          </span>
        </div>
      </div>
      <span className="text-body-sm leading-4 text-center w-full" style={{ color: '#64748b' }}>
        © Thaki Cloud, All rights reserved.
      </span>
    </div>
  );
}

/* ----------------------------------------
   3. Email MFA Template ---------------------------------------- */

interface EmailMFAProps {
  displayName: string;
  domainName: string;
  verificationCode: string;
  expirySeconds: number;
  lang?: 'en' | 'ko';
}

function EmailMFATemplate({
  displayName,
  domainName,
  verificationCode,
  expirySeconds,
  lang = 'en',
}: EmailMFAProps) {
  // Format code as "123 456" (split in middle)
  const formattedCode =
    verificationCode.length === 6
      ? `${verificationCode.slice(0, 3)} ${verificationCode.slice(3)}`
      : verificationCode;

  const t = {
    en: {
      greeting: 'Hello',
      greetingSuffix: ',',
      body1: 'To complete your sign-in to',
      body2: 'in Thaki Cloud, we need to verify your identity.',
      body3: 'Please enter the verification code below into the sign-in screen.',
      codeLabel: 'Verification code',
      warning: 'This temporary password will expire in',
      warningTime: 'seconds.',
    },
    ko: {
      greeting: '안녕하세요',
      greetingSuffix: '님,',
      body1: '',
      body2: '조직의 Thaki Cloud에 로그인하기 위해 추가 인증이 필요합니다.',
      body3: '아래의 인증 코드를 로그인 화면에 입력해 주세요.',
      codeLabel: '인증 코드',
      warning: '이 코드는',
      warningTime: '초 후 만료됩니다.',
    },
  }[lang];

  return (
    <div className="flex flex-col gap-3 items-start w-full max-w-[600px]">
      <div className="bg-white rounded-lg p-6 w-full flex flex-col gap-6 border border-[var(--color-border-default)]">
        <ThakiLogo />
        <div className="text-body-md leading-[18px] mt-4" style={{ color: '#0f172a' }}>
          <p className="mb-4">
            {t.greeting}{' '}
            <span className="text-label-md " style={{ color: '#0f172a' }}>
              {displayName}
            </span>
            {t.greetingSuffix}
          </p>
          <p className="mb-0">
            {lang === 'en' ? (
              <>
                {t.body1}{' '}
                <span className="text-label-md " style={{ color: '#0f172a' }}>
                  {domainName}
                </span>{' '}
                {t.body2}
                <br />
                {t.body3}
              </>
            ) : (
              <>
                <span className="text-label-md " style={{ color: '#0f172a' }}>
                  {domainName}
                </span>{' '}
                {t.body2}
                <br />
                {t.body3}
              </>
            )}
          </p>
        </div>
        <div
          className="rounded-lg px-4 py-3 flex flex-col gap-1.5 w-full"
          style={{ backgroundColor: '#f8fafc' }}
        >
          <span className="text-label-sm leading-4" style={{ color: '#64748b' }}>
            {t.codeLabel}{' '}
          </span>
          <span className="text-heading-h3" style={{ color: '#0f172a' }}>
            {formattedCode}
          </span>
        </div>
        <div
          className="flex items-start gap-2 p-3 rounded-md w-full"
          style={{ backgroundColor: '#fff7ed' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ea580c"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0 mt-0.5"
          >
            <path d="M10.24 3.957l-8.424 14.566a1.998 1.998 0 0 0 1.735 2.917h16.848a1.998 1.998 0 0 0 1.735 -2.917l-8.424 -14.566a1.998 1.998 0 0 0 -3.47 0z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
          <span className="text-body-sm leading-4" style={{ color: '#475569' }}>
            {t.warning}{' '}
            <span className="font-medium" style={{ color: '#0f172a' }}>
              {expirySeconds} {t.warningTime}
            </span>
          </span>
        </div>
      </div>
      <span className="text-body-sm leading-4 text-center w-full" style={{ color: '#64748b' }}>
        © Thaki Cloud, All rights reserved.
      </span>
    </div>
  );
}

/* ----------------------------------------
   HTML Generation Functions ---------------------------------------- */

function generateAccountInvitationHTML(props: AccountInvitationProps): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Invitation - THAKI Cloud</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
    <tr>
      <td>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 8px; padding: 24px;">
          <tr>
            <td style="padding-bottom: 24px;">
              <img src="https://thakicloud.github.io/tds_ssot/assets/thakiLogo_light-D4_vGfZ3.svg" alt="THAKI Cloud" height="20" style="display: block;" />
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 24px;">
              <p style="margin: 0; font-size: 12px; line-height: 18px; color: #0f172a;">Hello <span style="font-weight: 500; color: #0f172a;">${props.displayName}</span>,</p>
              <p style="margin: 16px 0 0 0; font-size: 12px; line-height: 18px; color: #0f172a;">
                Your administrator from <span style="font-weight: 500; color: #0f172a;">${props.domainName}</span> in Thaki Cloud has created a new account for you.<br />
                To get started, please set your password using the secure link below.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 24px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9fafb; border-radius: 8px;">
                <tr>
                  <td style="padding: 12px 16px;">
                    <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 500; line-height: 16px; color: #64748b;">Your username</p>
                    <p style="margin: 0; font-size: 14px; font-weight: 500; line-height: 20px; color: #0f172a;">${props.username}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 24px;">
              <a href="${props.actionUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-size: 14px; font-weight: 500; line-height: 16px; padding: 10px 12px; border-radius: 6px; text-decoration: none; min-width: 80px; text-align: center;">Get started</a>
            </td>
          </tr>
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fff7ed; border-radius: 6px;">
                <tr>
                  <td style="padding: 12px; font-size: 11px; line-height: 16px;">
                    <span style="color: #475569;">This link will expire in </span>
                    <span style="color: #0f172a; font-weight: 500;">${props.expiryDays} days.</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 12px;">
          <tr>
            <td style="text-align: center;"><p style="margin: 0; font-size: 11px; line-height: 16px; color: #64748b;">© Thaki Cloud, All rights reserved.</p></td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function generateResetPasswordHTML(props: ResetPasswordProps): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password - THAKI Cloud</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
    <tr>
      <td>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 8px; padding: 24px;">
          <tr>
            <td style="padding-bottom: 24px;">
              <img src="https://thakicloud.github.io/tds_ssot/assets/thakiLogo_light-D4_vGfZ3.svg" alt="THAKI Cloud" height="20" style="display: block;" />
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 24px;">
              <p style="margin: 0; font-size: 12px; line-height: 18px; color: #0f172a;">Hello <span style="font-weight: 500; color: #0f172a;">${props.displayName}</span>,</p>
              <p style="margin: 16px 0 0 0; font-size: 12px; line-height: 18px; color: #0f172a;">
                Your administrator from <span style="font-weight: 500; color: #0f172a;">${props.domainName}</span> in Thaki Cloud has reset your password.<br />
                To regain access to your account, please create a new password using the secure link below.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 24px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9fafb; border-radius: 8px;">
                <tr>
                  <td style="padding: 12px 16px;">
                    <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 500; line-height: 16px; color: #64748b;">Your username</p>
                    <p style="margin: 0; font-size: 14px; font-weight: 500; line-height: 20px; color: #0f172a;">${props.username}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 24px;">
              <a href="${props.actionUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-size: 14px; font-weight: 500; line-height: 16px; padding: 10px 12px; border-radius: 6px; text-decoration: none; min-width: 80px; text-align: center;">Reset password</a>
            </td>
          </tr>
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fff7ed; border-radius: 6px;">
                <tr>
                  <td style="padding: 12px; font-size: 11px; line-height: 16px;">
                    <span style="color: #475569;">This temporary password will expire in </span>
                    <span style="color: #0f172a; font-weight: 500;">${props.expiryHours} hour.</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 12px;">
          <tr>
            <td style="text-align: center;"><p style="margin: 0; font-size: 11px; line-height: 16px; color: #64748b;">© Thaki Cloud, All rights reserved.</p></td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function generateEmailMFAHTML(props: EmailMFAProps): string {
  // Format code as "123 456"
  const formattedCode =
    props.verificationCode.length === 6
      ? `${props.verificationCode.slice(0, 3)} ${props.verificationCode.slice(3)}`
      : props.verificationCode;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code - THAKI Cloud</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
    <tr>
      <td>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 8px; padding: 24px;">
          <tr>
            <td style="padding-bottom: 24px;">
              <img src="https://thakicloud.github.io/tds_ssot/assets/thakiLogo_light-D4_vGfZ3.svg" alt="THAKI Cloud" height="20" style="display: block;" />
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 24px;">
              <p style="margin: 0; font-size: 12px; line-height: 18px; color: #0f172a;">Hello <span style="font-weight: 500; color: #0f172a;">${props.displayName}</span>,</p>
              <p style="margin: 16px 0 0 0; font-size: 12px; line-height: 18px; color: #0f172a;">
                To complete your sign-in to <span style="font-weight: 500; color: #0f172a;">${props.domainName}</span> in Thaki Cloud, we need to verify your identity.<br />
                Please enter the verification code below into the sign-in screen.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 24px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9fafb; border-radius: 8px;">
                <tr>
                  <td style="padding: 12px 16px;">
                    <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 500; line-height: 16px; color: #64748b;">Verification code</p>
                    <p style="margin: 0; font-size: 14px; font-weight: 500; line-height: 20px; color: #0f172a;">${formattedCode}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fff7ed; border-radius: 6px;">
                <tr>
                  <td style="padding: 12px; font-size: 11px; line-height: 16px;">
                    <span style="color: #475569;">This temporary password will expire in </span>
                    <span style="color: #0f172a; font-weight: 500;">${props.expirySeconds} seconds.</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 12px;">
          <tr>
            <td style="text-align: center;"><p style="margin: 0; font-size: 11px; line-height: 16px; color: #64748b;">© Thaki Cloud, All rights reserved.</p></td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ----------------------------------------
   MailTemplatePreviewPage ---------------------------------------- */

export function MailTemplatePreviewPage() {
  const navigate = useNavigate();
  const { templateId } = useParams<{ templateId: string }>();
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [lang, setLang] = useState<'en' | 'ko'>('en');

  // Account Invitation fields
  const [displayName, setDisplayName] = useState('{DISPLAY_NAME}');
  const [domainName, setDomainName] = useState('{DOMAIN_NAME}');
  const [username, setUsername] = useState('{USERNAME}');
  const [expiryDays, setExpiryDays] = useState(7);
  const [actionUrl, setActionUrl] = useState('https://cloud.thaki.io/set-password?token=xxx');

  // Reset Password fields
  const [expiryHours, setExpiryHours] = useState(1);
  const [resetUrl, setResetUrl] = useState('https://cloud.thaki.io/reset-password?token=xxx');

  // Email MFA fields
  const [verificationCode, setVerificationCode] = useState('123456');
  const [mfaExpirySeconds, setMfaExpirySeconds] = useState(30);

  const config = templateConfig[templateId as TemplateType] || templateConfig['account-invitation'];

  const getHtmlCode = () => {
    switch (templateId) {
      case 'reset-password':
        return generateResetPasswordHTML({
          displayName,
          domainName,
          username,
          expiryHours,
          actionUrl: resetUrl,
        });
      case 'email-mfa':
        return generateEmailMFAHTML({
          displayName,
          domainName,
          verificationCode,
          expirySeconds: mfaExpirySeconds,
        });
      default:
        return generateAccountInvitationHTML({
          displayName,
          domainName,
          username,
          expiryDays,
          actionUrl,
        });
    }
  };

  const handleCopyHTML = async () => {
    try {
      await navigator.clipboard.writeText(getHtmlCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const renderVariables = () => {
    switch (templateId) {
      case 'reset-password':
        return (
          <>
            <VStack gap={1}>
              <label className="text-label-sm text-[var(--color-text-subtle)]">Display Name </label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                fullWidth
              />
            </VStack>
            <VStack gap={1}>
              <label className="text-label-sm text-[var(--color-text-subtle)]">Domain Name </label>
              <Input value={domainName} onChange={(e) => setDomainName(e.target.value)} fullWidth />
            </VStack>
            <VStack gap={1}>
              <label className="text-label-sm text-[var(--color-text-subtle)]">Username </label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} fullWidth />
            </VStack>
            <VStack gap={1}>
              <label className="text-label-sm text-[var(--color-text-subtle)]">
                Expiry (hours)
              </label>
              <Input
                type="number"
                value={expiryHours}
                onChange={(e) => setExpiryHours(Number(e.target.value))}
                fullWidth
              />
            </VStack>
            <VStack gap={1}>
              <label className="text-label-sm text-[var(--color-text-subtle)]">Reset URL </label>
              <Input value={resetUrl} onChange={(e) => setResetUrl(e.target.value)} fullWidth />
            </VStack>
          </>
        );
      case 'email-mfa':
        return (
          <>
            <VStack gap={1}>
              <label className="text-label-sm text-[var(--color-text-subtle)]">Display Name </label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                fullWidth
              />
            </VStack>
            <VStack gap={1}>
              <label className="text-label-sm text-[var(--color-text-subtle)]">Domain Name </label>
              <Input value={domainName} onChange={(e) => setDomainName(e.target.value)} fullWidth />
            </VStack>
            <VStack gap={1}>
              <label className="text-label-sm text-[var(--color-text-subtle)]">
                Verification Code{' '}
              </label>
              <Input
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                fullWidth
              />
            </VStack>
            <VStack gap={1}>
              <label className="text-label-sm text-[var(--color-text-subtle)]">
                Expiry (seconds)
              </label>
              <Input
                type="number"
                value={mfaExpirySeconds}
                onChange={(e) => setMfaExpirySeconds(Number(e.target.value))}
                fullWidth
              />
            </VStack>
          </>
        );
      default:
        return (
          <>
            <VStack gap={1}>
              <label className="text-label-sm text-[var(--color-text-subtle)]">Display Name </label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                fullWidth
              />
            </VStack>
            <VStack gap={1}>
              <label className="text-label-sm text-[var(--color-text-subtle)]">Domain Name </label>
              <Input value={domainName} onChange={(e) => setDomainName(e.target.value)} fullWidth />
            </VStack>
            <VStack gap={1}>
              <label className="text-label-sm text-[var(--color-text-subtle)]">Username </label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} fullWidth />
            </VStack>
            <VStack gap={1}>
              <label className="text-label-sm text-[var(--color-text-subtle)]">Expiry (days)</label>
              <Input
                type="number"
                value={expiryDays}
                onChange={(e) => setExpiryDays(Number(e.target.value))}
                fullWidth
              />
            </VStack>
            <VStack gap={1}>
              <label className="text-label-sm text-[var(--color-text-subtle)]">Action URL </label>
              <Input value={actionUrl} onChange={(e) => setActionUrl(e.target.value)} fullWidth />
            </VStack>
          </>
        );
    }
  };

  const renderPreview = () => {
    switch (templateId) {
      case 'reset-password':
        return (
          <ResetPasswordTemplate
            displayName={displayName}
            domainName={domainName}
            username={username}
            expiryHours={expiryHours}
            actionUrl={resetUrl}
            lang={lang}
          />
        );
      case 'email-mfa':
        return (
          <EmailMFATemplate
            displayName={displayName}
            domainName={domainName}
            verificationCode={verificationCode}
            expirySeconds={mfaExpirySeconds}
            lang={lang}
          />
        );
      default:
        return (
          <AccountInvitationTemplate
            displayName={displayName}
            domainName={domainName}
            username={username}
            expiryDays={expiryDays}
            actionUrl={actionUrl}
            lang={lang}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      <header className="sticky top-0 z-50 bg-[var(--color-surface-default)] border-b border-[var(--color-border-default)]">
        <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-between">
          <HStack gap={3} align="center">
            <Button
              variant="ghost"
              size="sm"
              icon={<IconArrowLeft size={16} stroke={1.5} />}
              onClick={() => navigate('/mail-template')}
            />
            <h1 className="text-heading-h5 text-[var(--color-text-default)]">{config.title}</h1>
          </HStack>
          <HStack gap={2}>
            <Button
              variant={viewMode === 'preview' ? 'primary' : 'secondary'}
              size="sm"
              icon={<IconEye size={14} stroke={1.5} />}
              onClick={() => setViewMode('preview')}
            >
              Preview{' '}
            </Button>
            <Button
              variant={viewMode === 'code' ? 'primary' : 'secondary'}
              size="sm"
              icon={<IconCode size={14} stroke={1.5} />}
              onClick={() => setViewMode('code')}
            >
              HTML{' '}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={
                copied ? <IconCheck size={14} stroke={1.5} /> : <IconCopy size={14} stroke={1.5} />
              }
              onClick={handleCopyHTML}
            >
              {copied ? 'Copied!' : 'Copy HTML'}
            </Button>
          </HStack>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex gap-8">
          <div className="w-[var(--search-input-width)] flex-shrink-0">
            <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4">
              <h2 className="text-body-lg font-semibold text-[var(--color-text-default)] mb-4">
                Template Variables{' '}
              </h2>
              <VStack gap={4}>
                <VStack gap={1}>
                  <label className="text-label-sm text-[var(--color-text-subtle)]">Language</label>
                  <HStack gap={2}>
                    <Button
                      variant={lang === 'en' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setLang('en')}
                      className="flex-1"
                    >
                      English
                    </Button>
                    <Button
                      variant={lang === 'ko' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setLang('ko')}
                      className="flex-1"
                    >
                      한국어
                    </Button>
                  </HStack>
                </VStack>
                {renderVariables()}
              </VStack>
            </div>
          </div>

          <div className="flex-1 min-w-[700px]" style={{ colorScheme: 'light' }}>
            {viewMode === 'preview' ? (
              <div
                className="rounded-lg p-8 min-h-[600px] flex justify-center items-start pt-12"
                style={{ backgroundColor: '#f8fafc' }}
              >
                {renderPreview()}
              </div>
            ) : (
              <div className="bg-slate-800 rounded-lg p-4 min-h-[600px] overflow-auto">
                <pre className="text-body-md text-slate-200 font-mono whitespace-pre-wrap break-all">
                  {getHtmlCode()}
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MailTemplatePreviewPage;
