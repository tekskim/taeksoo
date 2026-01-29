import { useState, useEffect } from 'react';
import { Drawer, Button, Radio, Input } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconEye, IconEyeOff, IconCheck, IconX } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type PasswordResetOption = 'temporary' | 'manual';

export interface ResetPasswordData {
  resetOption: PasswordResetOption;
  newPassword?: string;
  confirmPassword?: string;
}

export interface ResetPasswordDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  onSubmit?: (data: ResetPasswordData) => void;
}

/* ----------------------------------------
   Password Requirements Check
   ---------------------------------------- */

interface PasswordRequirement {
  label: string;
  check: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: '8-64 characters long', check: (p) => p.length >= 8 && p.length <= 64 },
  { label: 'At least one uppercase letter (A-Z)', check: (p) => /[A-Z]/.test(p) },
  { label: 'At least one lowercase letter (a-z)', check: (p) => /[a-z]/.test(p) },
  { label: 'At least one number', check: (p) => /[0-9]/.test(p) },
  {
    label: 'At least one special character',
    check: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p),
  },
];

/* ----------------------------------------
   ResetPasswordDrawer Component
   ---------------------------------------- */

export function ResetPasswordDrawer({
  isOpen,
  onClose,
  userName = 'thaki.kim',
  onSubmit,
}: ResetPasswordDrawerProps) {
  const [resetOption, setResetOption] = useState<PasswordResetOption>('temporary');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setResetOption('temporary');
      setNewPassword('');
      setConfirmPassword('');
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  const isPasswordValid = passwordRequirements.every((req) => req.check(newPassword));
  const doPasswordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const canSubmit = resetOption === 'temporary' || (isPasswordValid && doPasswordsMatch);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        resetOption,
        ...(resetOption === 'manual' && {
          newPassword,
          confirmPassword,
        }),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setResetOption('temporary');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      width={376}
      showCloseButton={false}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={handleClose} className="flex-1 h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || !canSubmit}
            className="flex-1 h-8"
          >
            {isSubmitting ? 'Resetting...' : 'Reset'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="pb-6">
        {/* Header */}
        <VStack gap={3}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
            Reset password
          </h2>
          <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
            Resets the user's login password. The new password takes effect immediately.
          </p>

          {/* User Info Box */}
          <div className="w-full bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
            <VStack gap={1.5}>
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                User
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                {userName}
              </span>
            </VStack>
          </div>
        </VStack>

        {/* Password Section */}
        <VStack gap={2}>
          {/* Section Header */}
          <VStack gap={2}>
            <div className="flex items-start gap-[3px]">
              <span className="text-label-lg text-[var(--color-text-default)] leading-5">
                Password
              </span>
              <span className="text-label-lg text-[var(--color-state-danger)] leading-5">
                *
              </span>
            </div>
            <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
              Choose how to set a password for the user account.
            </p>
          </VStack>

          {/* Radio Options */}
          <VStack gap={3}>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <Radio
                checked={resetOption === 'temporary'}
                onChange={() => setResetOption('temporary')}
              />
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                Issue a temporary password (email sent automatically)
              </span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <Radio checked={resetOption === 'manual'} onChange={() => setResetOption('manual')} />
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                Set password manually (no email sent)
              </span>
            </label>
          </VStack>

          {/* Manual Password Fields - only shown when manual option is selected */}
          {resetOption === 'manual' && (
            <VStack gap={4} className="mt-2">
              {/* New Password Field */}
              <VStack gap={2}>
                <span className="text-label-md text-[var(--color-text-default)] leading-4">
                  New Password
                </span>
                <div className="relative w-full">
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    fullWidth
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors"
                  >
                    {showNewPassword ? (
                      <IconEyeOff size={16} stroke={1.5} />
                    ) : (
                      <IconEye size={16} stroke={1.5} />
                    )}
                  </button>
                </div>
              </VStack>

              {/* Confirm New Password Field */}
              <VStack gap={2}>
                <span className="text-label-md text-[var(--color-text-default)] leading-4">
                  Confirm New Password
                </span>
                <div className="relative w-full">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Enter new password again"
                    fullWidth
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors"
                  >
                    {showConfirmPassword ? (
                      <IconEyeOff size={16} stroke={1.5} />
                    ) : (
                      <IconEye size={16} stroke={1.5} />
                    )}
                  </button>
                </div>
                {confirmPassword && !doPasswordsMatch && (
                  <span className="text-body-sm text-[var(--color-state-danger)] leading-4">
                    Passwords do not match
                  </span>
                )}
              </VStack>

              {/* Password Requirements */}
              <VStack gap={1.5} className="mt-1 p-3 bg-[var(--color-surface-subtle)] rounded-lg">
                <span className="text-label-sm text-[var(--color-text-subtle)] leading-4 mb-1">
                  Password Requirements
                </span>
                {passwordRequirements.map((req, index) => {
                  const isMet = req.check(newPassword);
                  return (
                    <HStack key={index} gap={1.5} align="center">
                      {isMet ? (
                        <IconCheck
                          size={12}
                          stroke={2}
                          className="text-[var(--color-state-success)]"
                        />
                      ) : (
                        <IconX size={12} stroke={2} className="text-[var(--color-text-muted)]" />
                      )}
                      <span
                        className={`text-body-sm leading-4 ${isMet ? 'text-[var(--color-state-success)]' : 'text-[var(--color-text-muted)]'}`}
                      >
                        {req.label}
                      </span>
                    </HStack>
                  );
                })}
              </VStack>
            </VStack>
          )}
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ResetPasswordDrawer;
