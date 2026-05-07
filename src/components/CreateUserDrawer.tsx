import { useState, useEffect } from 'react';
import { Drawer, Button, Input, FormField, Radio, RadioGroup, Toggle } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

export interface CreateUserData {
  username: string;
  passwordOption: 'temporary' | 'manual';
  email: string;
  displayName: string;
  enabled: boolean;
}

export interface CreateUserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: CreateUserData) => void;
}

export function CreateUserDrawer({ isOpen, onClose, onSubmit }: CreateUserDrawerProps) {
  const [username, setUsername] = useState('');
  const [passwordOption, setPasswordOption] = useState<'temporary' | 'manual'>('temporary');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPasswordOption('temporary');
      setEmail('');
      setDisplayName('');
      setEnabled(true);
      setHasAttemptedSubmit(false);
      setUsernameError(null);
      setEmailError(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    let hasError = false;

    if (!username.trim()) {
      setUsernameError('Please enter a username.');
      hasError = true;
    } else if (username.length < 3 || username.length > 64) {
      setUsernameError('Username must be between 3-64 characters.');
      hasError = true;
    } else {
      setUsernameError(null);
    }

    if (!email.trim()) {
      setEmailError('Please enter an email address.');
      hasError = true;
    } else {
      setEmailError(null);
    }

    if (hasError) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({ username, passwordOption, email, displayName, enabled });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHasAttemptedSubmit(false);
    setUsernameError(null);
    setEmailError(null);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Create user"
      width={376}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <FormField required error={hasAttemptedSubmit && !!usernameError}>
          <FormField.Label>Username</FormField.Label>
          <FormField.Description>
            This is the user's unique identifier for signing in. It cannot be changed once created.
          </FormField.Description>
          <FormField.Control>
            <Input
              placeholder="Enter username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (usernameError) setUsernameError(null);
              }}
              fullWidth
              error={hasAttemptedSubmit && !!usernameError}
            />
          </FormField.Control>
          {hasAttemptedSubmit && usernameError ? (
            <FormField.ErrorMessage>{usernameError}</FormField.ErrorMessage>
          ) : (
            <FormField.HelperText>
              You can use letters, numbers, and special characters (-_.), and the length must be
              between 3-64 characters.
            </FormField.HelperText>
          )}
        </FormField>

        <FormField
          label="Password"
          description="Choose how to set the initial password for the user account."
          spacing="loose"
          required
        >
          <RadioGroup
            value={passwordOption}
            onChange={(val) => setPasswordOption(val as 'temporary' | 'manual')}
          >
            <Radio
              value="temporary"
              label="Issue a temporary password (email sent automatically)"
            />
            <Radio value="manual" label="Set password manually (no email sent)" />
          </RadioGroup>
        </FormField>

        <FormField required error={hasAttemptedSubmit && !!emailError}>
          <FormField.Label>Email address</FormField.Label>
          <FormField.Description>
            The email address used for user invitations and notifications.
          </FormField.Description>
          <FormField.Control>
            <Input
              placeholder="user@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(null);
              }}
              fullWidth
              error={hasAttemptedSubmit && !!emailError}
            />
          </FormField.Control>
          {hasAttemptedSubmit && emailError && (
            <FormField.ErrorMessage>{emailError}</FormField.ErrorMessage>
          )}
        </FormField>

        <FormField
          label="Display name"
          helperText="Must be between 2-64 characters. If left blank, the username will be shown instead."
        >
          <Input
            placeholder="Enter display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            fullWidth
          />
        </FormField>

        <FormField
          label="Status"
          description="Select the user's status. If 'Disabled', the user will be prevented from signing in."
          spacing="loose"
        >
          <HStack gap={2} align="center">
            <Toggle checked={enabled} onChange={(checked) => setEnabled(checked)} />
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              {enabled ? 'Active' : 'Disabled'}
            </span>
          </HStack>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default CreateUserDrawer;
