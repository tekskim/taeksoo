import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Button,
  Modal,
  SectionCard,
  Input,
  WindowControls,
  Pagination,
  Table,
  columnMinWidths,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { IconCheck, IconEye, IconEyeClosed, IconEdit, IconLock } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SettingsTab = 'account';

interface WindowPosition {
  x: number;
  y: number;
}

interface WindowSize {
  width: number;
  height: number;
}

interface SettingsPageProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: SettingsTab;
}

/* ----------------------------------------
   Settings Page Component
   ---------------------------------------- */

// Generate 100 mock activity sessions
const generateActivitySessions = () => {
  const sessions = [];
  const devices = [
    'Chrome on macOS',
    'Safari on iOS',
    'Firefox on Windows',
    'Edge on Windows',
    'Chrome on Android',
    'Safari on macOS',
    'Chrome on Windows',
    'Firefox on macOS',
  ];
  const ipRanges = [
    { base: '211.234.56', suffix: 78 },
    { base: '175.192.44', suffix: 123 },
    { base: '121.167.88', suffix: 45 },
    { base: '58.123.201', suffix: 67 },
    { base: '192.168.1', suffix: 100 },
    { base: '10.0.0', suffix: 50 },
  ];

  for (let i = 0; i < 100; i++) {
    const now = new Date();
    now.setDate(now.getDate() - Math.floor(i / 5));
    now.setHours(now.getHours() - (i % 24));
    now.setMinutes(now.getMinutes() - (i % 60));

    const ipRange = ipRanges[i % ipRanges.length];
    const ip = `${ipRange.base}.${(ipRange.suffix + i) % 255}`;
    const device = devices[i % devices.length];

    const timestamp =
      now.toLocaleDateString('en-CA') +
      ' ' +
      now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    sessions.push({
      id: `session-${i + 1}`,
      ipAddress: ip,
      device: device,
      timestamp: timestamp,
    });
  }

  return sessions;
};

export function SettingsPage({ isOpen, onClose, initialTab = 'account' }: SettingsPageProps) {
  const [isFocused, setIsFocused] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [activitySessions] = useState(generateActivitySessions());

  const totalPages = Math.ceil(activitySessions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedSessions = activitySessions.slice(startIndex, endIndex);

  // Session table columns
  const sessionColumns: TableColumn[] = [
    { key: 'ipAddress', label: 'IP Address', flex: 1, minWidth: columnMinWidths.ipAddress },
    { key: 'device', label: 'Device', flex: 1 },
    { key: 'timestamp', label: 'Time', flex: 1, minWidth: columnMinWidths.timestamp },
  ];

  // Reset focus when window opens
  useEffect(() => {
    if (isOpen) {
      setIsFocused(true);
    }
  }, [isOpen]);
  // Center the window: fixed 648px width
  const [size, setSize] = useState<WindowSize>(() => ({
    width: 648,
    height: typeof window !== 'undefined' ? window.innerHeight * 0.5 : 540,
  }));
  const [position, setPosition] = useState<WindowPosition>(() => ({
    x: typeof window !== 'undefined' ? (window.innerWidth - 648) / 2 : 300,
    y: typeof window !== 'undefined' ? (window.innerHeight - window.innerHeight * 0.5) / 2 : 100,
  }));
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
  });
  const windowRef = useRef<HTMLDivElement>(null);

  // Account State
  const [name, setName] = useState('John Doe');
  const [localName, setLocalName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@thakicloud.co.kr');
  const [localEmail, setLocalEmail] = useState('john.doe@thakicloud.co.kr');
  const [isEditingAccount, setIsEditingAccount] = useState(false);

  // Sync local values when entering edit mode
  useEffect(() => {
    if (isEditingAccount) {
      setLocalName(name);
      setLocalEmail(email);
    }
  }, [isEditingAccount, name, email]);

  // Sync localName with name when name changes externally
  useEffect(() => {
    setLocalName(name);
  }, [name]);

  // Handle click outside window to unfocus (but don't close)
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (windowRef.current && !windowRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };

    // Use capture phase to catch clicks before they reach other elements
    document.addEventListener('mousedown', handleClickOutside, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isOpen]);

  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLastUpdated, setPasswordLastUpdated] = useState('Jan 14, 2026');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Password validation function
  const validatePasswordChange = useCallback(() => {
    let hasError = false;
    setNewPasswordError('');
    setConfirmPasswordError('');

    // 포함 규칙 검사 (최소 8자, 대문자, 소문자, 숫자, 특수문자)
    const isValidFormat =
      newPassword.length >= 8 &&
      /[A-Z]/.test(newPassword) &&
      /[a-z]/.test(newPassword) &&
      /[0-9]/.test(newPassword) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!isValidFormat) {
      setNewPasswordError('Please enter a valid password.');
      hasError = true;
    }

    // 불포함 규칙 검사 - username과 email이 동일하면 username 에러만 표시
    const username = name.toLowerCase();
    const userEmail = email.toLowerCase();
    const passwordLower = newPassword.toLowerCase();

    if (username && passwordLower.includes(username)) {
      setNewPasswordError('The password cannot contain the username.');
      hasError = true;
    } else if (userEmail && passwordLower.includes(userEmail.split('@')[0])) {
      // email의 @ 앞부분만 검사 (username과 다를 경우에만)
      if (username !== userEmail.split('@')[0]) {
        setNewPasswordError('The password cannot contain the email address.');
        hasError = true;
      }
    }

    // 비밀번호 확인 불일치
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    }

    return !hasError;
  }, [newPassword, confirmPassword, name, email]);

  const handlePasswordChangeSubmit = useCallback(() => {
    if (validatePasswordChange()) {
      const now = new Date();
      const formattedDate = `Jan ${now.getDate()}, ${now.getFullYear()}`;
      setPasswordLastUpdated(formattedDate);
      setShowPasswordChangeModal(false);
      setIsEditingPassword(false);
      setNewPassword('');
      setConfirmPassword('');
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setNewPasswordError('');
      setConfirmPasswordError('');
    }
  }, [validatePasswordChange]);

  // Email Change Flow State
  const [showEmailChangeModal, setShowEmailChangeModal] = useState(false);
  const [emailChangeStep, setEmailChangeStep] = useState<1 | 2 | 3>(1); // 1: Password, 2: New email + send code, 3: Verification code
  const [emailChangePassword, setEmailChangePassword] = useState('');
  const [emailChangePasswordError, setEmailChangePasswordError] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  // 2-Step Verification State
  const [twoStepEnabled, setTwoStepEnabled] = useState(false);
  const [authenticatorSetup, setAuthenticatorSetup] = useState<{
    configured: boolean;
    addedAt?: string;
  }>({ configured: false });

  // 2-Step Verification Setup Flow State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [currentSetupMethod, setCurrentSetupMethod] = useState<'authenticator' | null>(null);
  const [setupStep, setSetupStep] = useState<1 | 2 | 3>(1); // 1: Password, 2: Enrollment, 3: Verification
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [secretKeyCopied, setSecretKeyCopied] = useState(false);

  // Demo secret key for authenticator
  const demoSecretKey = 'JBSWY3DPEHPK3PXP';

  // Modal State
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Drag handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMaximized) return;
      if ((e.target as HTMLElement).closest('.window-controls')) return;

      setIsDragging(true);
      const rect = windowRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    },
    [isMaximized]
  );

  // Resize handlers
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, direction: string) => {
      if (isMaximized) return;
      e.preventDefault();
      e.stopPropagation();

      setIsResizing(direction);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height,
        posX: position.x,
        posY: position.y,
      });
    },
    [isMaximized, size, position]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        setPosition({
          x: Math.max(0, Math.min(newX, window.innerWidth - 400)),
          y: Math.max(0, Math.min(newY, window.innerHeight - 200)),
        });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const minWidth = 720;
        const minHeight = 480;
        const maxWidth = 1320;
        const maxHeight = 960;

        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newX = resizeStart.posX;
        let newY = resizeStart.posY;

        if (isResizing.includes('e')) {
          newWidth = Math.min(maxWidth, Math.max(minWidth, resizeStart.width + deltaX));
        }
        if (isResizing.includes('w')) {
          const potentialWidth = resizeStart.width - deltaX;
          if (potentialWidth >= minWidth && potentialWidth <= maxWidth) {
            newWidth = potentialWidth;
            newX = resizeStart.posX + deltaX;
          }
        }
        if (isResizing.includes('s')) {
          newHeight = Math.min(maxHeight, Math.max(minHeight, resizeStart.height + deltaY));
        }
        if (isResizing.includes('n')) {
          const potentialHeight = resizeStart.height - deltaY;
          if (potentialHeight >= minHeight && potentialHeight <= maxHeight) {
            newHeight = potentialHeight;
            newY = resizeStart.posY + deltaY;
          }
        }

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isResizing, resizeStart]);

  if (!isOpen) return null;

  // 60% screen width, centered
  const windowStyle = isMaximized
    ? { top: 68, left: 20, width: 'calc(100vw - 40px)', height: 'calc(100vh - 88px)' }
    : {
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
      };

  return (
    <>
      {/* Settings Window */}
      <div
        ref={windowRef}
        className="fixed z-[2001] bg-[var(--color-surface-default)] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        style={windowStyle}
        onClick={(e) => {
          e.stopPropagation();
          setIsFocused(true);
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          setIsFocused(true);
        }}
      >
        {/* Resize Handles */}
        {!isMaximized && (
          <>
            {/* Edges */}
            <div
              className="absolute top-0 left-2 right-2 h-1 cursor-n-resize z-10"
              onMouseDown={(e) => handleResizeStart(e, 'n')}
            />
            <div
              className="absolute bottom-0 left-2 right-2 h-1 cursor-s-resize z-10"
              onMouseDown={(e) => handleResizeStart(e, 's')}
            />
            <div
              className="absolute left-0 top-2 bottom-2 w-1 cursor-w-resize z-10"
              onMouseDown={(e) => handleResizeStart(e, 'w')}
            />
            <div
              className="absolute right-0 top-2 bottom-2 w-1 cursor-e-resize z-10"
              onMouseDown={(e) => handleResizeStart(e, 'e')}
            />
            {/* Corners */}
            <div
              className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize z-20"
              onMouseDown={(e) => handleResizeStart(e, 'nw')}
            />
            <div
              className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize z-20"
              onMouseDown={(e) => handleResizeStart(e, 'ne')}
            />
            <div
              className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize z-20"
              onMouseDown={(e) => handleResizeStart(e, 'sw')}
            />
            <div
              className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize z-20"
              onMouseDown={(e) => handleResizeStart(e, 'se')}
            />
          </>
        )}

        {/* Window Header */}
        <div
          className="h-12 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-default)] flex items-center justify-between px-4 cursor-move select-none shrink-0"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2 text-label-lg text-[var(--color-text-default)]">
            <span>Settings</span>
          </div>
          <div className="window-controls">
            <WindowControls
              onMinimize={() => {}}
              onMaximize={() => setIsMaximized(!isMaximized)}
              onClose={onClose}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Content Area */}
          <main className="flex-1 overflow-y-auto settings-scroll p-6 bg-[var(--color-surface-default)]">
            <div className="max-w-[1000px]">
              {/* Account Content */}
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                {/* Account Information */}
                <SectionCard className="mb-6 min-w-[600px]" isActive={isEditingAccount}>
                  <SectionCard.Header
                    title="Account Information"
                    actions={
                      isEditingAccount ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsEditingAccount(false);
                              setLocalName(name);
                              setLocalEmail(email);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setName(localName);
                              setEmail(localEmail);
                              setIsEditingAccount(false);
                            }}
                          >
                            Done
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => setIsEditingAccount(true)}
                        >
                          <IconEdit size={16} />
                          Edit
                        </Button>
                      )
                    }
                  />
                  {isEditingAccount ? (
                    <SectionCard.Content>
                      {/* ID - Read only */}
                      <SectionCard.DataRow label="ID" value="john.doe" />
                      {/* Email - Editable */}
                      <Input
                        label="Email"
                        value={localEmail}
                        onChange={(e) => setLocalEmail(e.target.value)}
                        fullWidth
                      />
                      {/* Name - Editable */}
                      <Input
                        label="Name"
                        value={localName}
                        onChange={(e) => setLocalName(e.target.value)}
                        fullWidth
                      />
                    </SectionCard.Content>
                  ) : (
                    <SectionCard.Content>
                      <SectionCard.DataRow label="ID" value="john.doe" />
                      <SectionCard.DataRow label="Email" value={email} />
                      <SectionCard.DataRow label="Name" value={name} />
                    </SectionCard.Content>
                  )}
                </SectionCard>

                {/* Authentication */}
                <SectionCard className="mb-6 min-w-[600px]" isActive={isEditingPassword}>
                  <SectionCard.Header
                    title="Authentication"
                    actions={
                      isEditingPassword ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsEditingPassword(false);
                              setNewPassword('');
                              setConfirmPassword('');
                              setShowNewPassword(false);
                              setShowConfirmPassword(false);
                              setNewPasswordError('');
                              setConfirmPasswordError('');
                            }}
                          >
                            Cancel
                          </Button>
                          <Button variant="primary" size="sm" onClick={handlePasswordChangeSubmit}>
                            Change
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingPassword(true)}
                        >
                          Change Password
                        </Button>
                      )
                    }
                  />
                  <SectionCard.Content>
                    {isEditingPassword ? (
                      <>
                        {/* Password change description */}
                        <p className="text-body-md text-[var(--color-text-subtle)]">
                          Enter your new password below.
                        </p>
                        {/* New Password Field */}
                        <Input
                          label="New password"
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            setNewPasswordError('');
                          }}
                          placeholder="Enter new password"
                          fullWidth
                          error={newPasswordError}
                          rightElement={
                            <button
                              type="button"
                              className="flex items-center justify-center p-0 leading-none"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? (
                                <IconEye size={16} />
                              ) : (
                                <IconEyeClosed size={16} />
                              )}
                            </button>
                          }
                        />
                        {/* Confirm New Password Field */}
                        <Input
                          label="Confirm new password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setConfirmPasswordError('');
                          }}
                          placeholder="Enter new password again"
                          fullWidth
                          error={confirmPasswordError}
                          rightElement={
                            <button
                              type="button"
                              className="flex items-center justify-center p-0 leading-none"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <IconEye size={16} />
                              ) : (
                                <IconEyeClosed size={16} />
                              )}
                            </button>
                          }
                        />
                      </>
                    ) : (
                      /* Password - View Mode */
                      <SectionCard.DataRow
                        label="Password"
                        value={`Last updated ${passwordLastUpdated}`}
                      />
                    )}
                    {/* MFA Setting */}
                    <div className="flex flex-col gap-1.5 w-full">
                      <span className="text-label-sm text-[var(--color-text-subtle)]">
                        MFA Setting
                      </span>
                      <p className="text-body-md text-[var(--color-text-subtle)]">
                        Add an extra layer of security to your account.
                      </p>
                    </div>
                    {/* Authenticator App Card */}
                    <div className="flex items-center justify-between p-3 border border-[var(--color-border-default)] rounded-md bg-[var(--color-surface-subtle)]">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-md bg-[var(--color-surface-default)] border border-[var(--color-border-default)] flex items-center justify-center">
                          <IconLock size={16} className="text-[var(--color-text-subtle)]" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-label-sm text-[var(--color-text-subtle)]">
                            Authenticator App
                          </span>
                          {authenticatorSetup.configured ? (
                            <div className="flex items-center gap-1.5 text-body-sm text-[var(--color-state-success)]">
                              <IconCheck size={16} />
                              <span>Added {authenticatorSetup.addedAt}</span>
                            </div>
                          ) : (
                            <span className="text-body-sm text-[var(--color-text-subtle)]">
                              Use Google Authenticator, Authy, etc.
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentSetupMethod('authenticator');
                          if (authenticatorSetup.configured) {
                            setSetupStep(1);
                            setShowPasswordModal(true);
                          } else {
                            setShowEnrollmentModal(true);
                          }
                        }}
                      >
                        {authenticatorSetup.configured ? 'Remove' : 'Set up'}
                      </Button>
                    </div>
                  </SectionCard.Content>
                </SectionCard>

                {/* Sessions */}
                <SectionCard className="mb-6 min-w-[600px]">
                  <SectionCard.Header title="Activity" showDivider={false} />
                  <SectionCard.Content>
                    <div>
                      <p className="text-body-md text-[var(--color-text-muted)] mb-4">
                        Displaying your latest account activity.
                      </p>

                      {/* Pagination */}
                      <div className="mb-4">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                          totalItems={activitySessions.length}
                        />
                      </div>

                      <Table
                        columns={sessionColumns}
                        data={paginatedSessions}
                        rowKey="id"
                        rowHeight="40px"
                        emptyMessage="No sessions found"
                      />
                    </div>
                  </SectionCard.Content>
                </SectionCard>

                {/* Logout */}
                <div className="mt-6 flex justify-end min-w-[600px]">
                  <Button variant="secondary" size="lg" onClick={() => setShowLogoutModal(true)}>
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Logout">
        <p className="text-sm text-[var(--color-text-default)] mb-6">
          This action logs you out of your account.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowLogoutModal(false);
              // In real app: redirect to login screen
              window.location.href = '/login';
            }}
          >
            Logout
          </Button>
        </div>
      </Modal>

      {/* Email Change Modal */}
      <Modal
        isOpen={showEmailChangeModal}
        onClose={() => {
          setShowEmailChangeModal(false);
          setEmailChangeStep(1);
          setEmailChangePassword('');
          setEmailChangePasswordError('');
          setNewEmail('');
          setEmailVerificationCode('');
          setEmailVerificationSent(false);
        }}
        title="Change Email"
      >
        <div className="space-y-4">
          {/* Current email display */}
          <p className="text-body-md text-[var(--color-text-default)]">
            Your current email is <span className="font-semibold">{email}</span>.
          </p>

          {/* Step 1: Password verification */}
          <div>
            <p className="text-body-md text-[var(--color-text-default)] mb-2">
              Please enter your password.
            </p>
            <Input
              type="password"
              value={emailChangePassword}
              onChange={(e) => {
                setEmailChangePassword(e.target.value);
                setEmailChangePasswordError('');
              }}
              placeholder="Password"
              fullWidth
              className={emailChangePasswordError ? 'border-[var(--color-status-danger)]' : ''}
              disabled={emailChangeStep >= 2}
            />
            {emailChangePasswordError && (
              <p className="text-xs text-[var(--color-status-danger)] mt-1">
                {emailChangePasswordError}
              </p>
            )}
          </div>

          {/* Step 2+: New email input (visible after password verified) */}
          {emailChangeStep >= 2 && (
            <div>
              <p className="text-body-md text-[var(--color-text-default)] mb-2">
                Please enter a new email and we will send you a verification code.
              </p>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="New email address"
                fullWidth
                disabled={emailVerificationSent}
              />
            </div>
          )}

          {/* Step 3: Verification code (visible after code sent) */}
          {emailChangeStep >= 3 && emailVerificationSent && (
            <div>
              <p className="text-body-md text-[var(--color-text-default)] mb-2">
                We just sent you a temporary verification code to{' '}
                <span className="font-semibold text-[var(--color-action-primary)]">{newEmail}</span>
                .
              </p>
              <Input
                type="text"
                value={emailVerificationCode}
                onChange={(e) => setEmailVerificationCode(e.target.value)}
                placeholder="Enter verification code"
                fullWidth
              />
            </div>
          )}

          {/* Action button */}
          <Button
            variant="primary"
            className="w-full"
            onClick={() => {
              if (emailChangeStep === 1) {
                // Verify password (simulated - in real app, validate against server)
                if (emailChangePassword.length < 1) {
                  setEmailChangePasswordError('Please enter your password');
                  return;
                }
                // Simulate password verification success
                setEmailChangeStep(2);
              } else if (emailChangeStep === 2) {
                // Send verification code
                if (!newEmail || !newEmail.includes('@')) {
                  return;
                }
                setEmailVerificationSent(true);
                setEmailChangeStep(3);
              } else if (emailChangeStep === 3) {
                // Verify code and change email
                if (emailVerificationCode.length < 1) {
                  return;
                }
                // Simulate successful email change
                setEmail(newEmail);
                setShowEmailChangeModal(false);
                setEmailChangeStep(1);
                setEmailChangePassword('');
                setNewEmail('');
                setEmailVerificationCode('');
                setEmailVerificationSent(false);
              }
            }}
            disabled={
              (emailChangeStep === 1 && !emailChangePassword) ||
              (emailChangeStep === 2 && (!newEmail || !newEmail.includes('@'))) ||
              (emailChangeStep === 3 && !emailVerificationCode)
            }
          >
            {emailChangeStep === 1 && 'Verify password'}
            {emailChangeStep === 2 && 'Send verification code'}
            {emailChangeStep === 3 && 'Change email'}
          </Button>
        </div>
      </Modal>

      {/* Step 1: Password Re-authentication Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordInput('');
          setPasswordError('');
          setCurrentSetupMethod(null);
        }}
        title="Verify Your Identity"
      >
        <div className="space-y-4">
          <p className="text-body-md text-[var(--color-text-default)]">
            Please enter your current password to verify your identity before modifying security
            settings.
          </p>

          <div className="space-y-2">
            <label className="block text-label-md text-[var(--color-text-default)]">
              Current Password
            </label>
            <Input
              type="password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError('');
              }}
              placeholder="Enter your password"
              fullWidth
              className={passwordError ? 'border-[var(--color-state-danger)]' : ''}
            />
            {passwordError && (
              <p className="text-body-md text-[var(--color-state-danger)]">{passwordError}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordInput('');
                setPasswordError('');
                setCurrentSetupMethod(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                // Simulate password verification (accept any password for demo)
                if (passwordInput.length >= 1) {
                  setShowPasswordModal(false);
                  setPasswordInput('');

                  if (currentSetupMethod === null) {
                    // Disabling 2-Step Verification
                    setTwoStepEnabled(false);
                  } else if (
                    currentSetupMethod === 'authenticator' &&
                    authenticatorSetup.configured
                  ) {
                    // Removing existing method
                    setAuthenticatorSetup({ configured: false });
                    setTwoStepEnabled(false);
                    setCurrentSetupMethod(null);
                  } else {
                    // Setting up new method - proceed to enrollment
                    setSetupStep(2);
                    setShowEnrollmentModal(true);
                  }
                } else {
                  setPasswordError('Please enter your password');
                }
              }}
              disabled={!passwordInput}
            >
              Verify
            </Button>
          </div>
        </div>
      </Modal>

      {/* OTP App Setup Modal - Figma Design */}
      <Modal
        isOpen={showEnrollmentModal}
        onClose={() => {
          setShowEnrollmentModal(false);
          setSetupStep(1);
          setOtpCode('');
          setOtpError('');
          setSecretKeyCopied(false);
          setCurrentSetupMethod(null);
        }}
      >
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-start justify-between">
            <svg
              width="33"
              height="33"
              viewBox="0 0 33 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_otp_modal)">
                <path
                  d="M14.4773 1.36957C14.292 1.07001 13.8151 0.0290544 12.9604 0C11.9405 0.0150282 11.151 0.521978 10.6852 1.3345L8.4299 5.27689C7.70854 6.53425 6.65254 7.57319 5.37413 8.27751L1.35756 10.4927L1.36057 10.4897C0.520982 10.9545 0 11.8252 0 12.7729V19.1339C0 18.2572 1.06701 17.7693 1.37058 17.5809C1.67416 17.3926 9.48388 13.1005 9.48388 13.1005C10.7643 12.3912 11.8213 11.3523 12.5396 10.0919L15.9751 4.06261C15.1947 2.64796 14.5484 1.48178 14.4783 1.36756L14.4773 1.36957Z"
                  fill="url(#paint0_linear_otp_modal)"
                />
                <path
                  d="M30.6908 14.4771C30.9904 14.2918 32.0313 13.8149 32.0604 12.9603C32.0453 11.9404 31.5384 11.1509 30.7259 10.685L26.7834 8.42979C25.5261 7.70844 24.4871 6.65246 23.7828 5.37407L21.5676 1.35754L21.5706 1.36055C21.1057 0.520976 20.2351 0 19.2873 0H12.9253C13.8019 0 14.2899 1.067 14.4782 1.37057C14.6666 1.67414 18.9587 9.48377 18.9587 9.48377C19.668 10.7642 20.707 11.8211 21.9673 12.5395L27.9967 15.9749C29.4114 15.1945 30.5776 14.5483 30.6918 14.4781L30.6908 14.4771Z"
                  fill="url(#paint1_linear_otp_modal)"
                />
                <path
                  d="M17.5833 30.6906C17.7686 30.9901 18.2455 32.0311 19.1001 32.0601C20.1201 32.0451 20.9095 31.5381 21.3754 30.7256L23.6307 26.7832C24.352 25.5259 25.408 24.4869 26.6864 23.7826L30.703 21.5675L30.7 21.5705C31.5396 21.1056 32.0606 20.235 32.0606 19.2872V12.9263C32.0606 13.8029 30.9936 14.2908 30.69 14.4792C30.3864 14.6675 22.5767 18.9596 22.5767 18.9596C21.2963 19.6689 20.2393 20.7079 19.5209 21.9682L16.0854 27.9975C16.8659 29.4122 17.5121 30.5784 17.5823 30.6926L17.5833 30.6906Z"
                  fill="url(#paint2_linear_otp_modal)"
                />
                <path
                  d="M1.36958 17.583C1.07002 17.7684 0.0290548 18.2453 0 19.0999C0.0150283 20.1198 0.521984 20.9092 1.33452 21.3751L5.27695 23.6303C6.53432 24.3517 7.57328 25.4077 8.27761 26.6861L10.4928 30.7026L10.4898 30.6996C10.9547 31.5392 11.8253 32.0601 12.7731 32.0601H19.1351C18.2584 32.0601 17.7705 30.9931 17.5822 30.6896C17.3938 30.386 13.1017 22.5764 13.1017 22.5764C12.3924 21.296 11.3534 20.239 10.093 19.5206L4.06366 16.0852C2.64899 16.8657 1.4828 17.5119 1.36858 17.582L1.36958 17.583Z"
                  fill="url(#paint3_linear_otp_modal)"
                />
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear_otp_modal"
                  x1="0.0318047"
                  y1="-0.00281913"
                  x2="15.9751"
                  y2="-0.00281574"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#888B8D" />
                  <stop offset="1" stopColor="#101820" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_otp_modal"
                  x1="12.9634"
                  y1="-0.0023537"
                  x2="32.0604"
                  y2="-0.00234787"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#888B8D" />
                  <stop offset="1" stopColor="#101820" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_otp_modal"
                  x1="16.1173"
                  y1="12.9235"
                  x2="32.0606"
                  y2="12.9235"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#101820" />
                  <stop offset="1" stopColor="#888B8D" />
                </linearGradient>
                <linearGradient
                  id="paint3_linear_otp_modal"
                  x1="0.0380958"
                  y1="16.0829"
                  x2="19.1351"
                  y2="16.0829"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#101820" />
                  <stop offset="1" stopColor="#888B8D" />
                </linearGradient>
                <clipPath id="clip0_otp_modal">
                  <rect width="32.0605" height="32.0601" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h2 className="text-heading-h4 text-[var(--color-text-default)]">Set up the OTP App</h2>
            <p className="text-body-md text-[var(--color-text-muted)]">
              For security, you must set up OTP verification.
            </p>
          </div>

          {/* Step 1 */}
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-action-primary)] flex items-center justify-center">
              <span className="text-white text-label-md">1</span>
            </div>
            <p className="text-body-md text-[var(--color-text-default)] pt-0.5">
              Install a compatible application such as Google or Microsoft Authenticator app on your
              mobile device or computer.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-action-primary)] flex items-center justify-center">
              <span className="text-white text-label-md">2</span>
            </div>
            <div className="space-y-3 flex-1">
              <p className="text-body-md text-[var(--color-text-default)] pt-0.5">
                Open your authenticator app and scan the QR code below.
                <br />
                <span className="text-[var(--color-text-muted)]">
                  Alternatively, you can enter this code :
                </span>
              </p>

              {/* Secret Key */}
              <div className="px-3 py-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-md">
                <code className="font-mono text-body-sm tracking-wider text-[var(--color-text-default)] break-all">
                  {demoSecretKey}
                </code>
              </div>

              {/* QR Code */}
              <div className="flex justify-center py-4">
                <div className="w-[120px] h-[120px] bg-white border border-[var(--color-border-default)] flex items-center justify-center overflow-hidden">
                  <svg
                    width="99"
                    height="99"
                    viewBox="0 0 99 99"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.7031 78.9324V69.5676H29.4329V88.2973H10.7031V78.9324ZM26.7572 78.9324V72.2432H13.3788V85.6216H26.7572V78.9324ZM16.0545 78.9324V74.9189H24.0815V82.946H16.0545V78.9324ZM34.7842 86.9595V85.6216H32.1085V80.2703H34.7842V72.2432H37.4599V69.5676H32.1085V66.8919H21.4058V64.2162H24.0815V61.5405H18.7302V66.8919H16.0545V64.2162H10.7031V61.5405H16.0545V56.1892H13.3788V58.8649H10.7031V53.5135H16.0545V56.1892H18.7302V58.8649H21.4058V56.1892H24.0815V58.8649H29.4329V56.1892H26.7572V53.5135H18.7302V50.8378H26.7572V48.1622H18.7302V45.4865H16.0545V48.1622H10.7031V40.1351H13.3788V42.8108H29.4329V40.1351H26.7572V37.4595H21.4058V40.1351H18.7302V37.4595H13.3788V32.1081H18.7302V37.4595H21.4058V34.7838H26.7572V32.1081H29.4329V34.7838H26.7572V37.4595H29.4329V40.1351H32.1085V34.7838H34.7842V32.1081H32.1085V24.0811H37.4599V26.7568H40.1356V29.4324H37.4599V32.1081H40.1356V48.1622H34.7842V45.4865H32.1085V48.1622H29.4329V50.8378H26.7572V53.5135H29.4329V56.1892H32.1085V58.8649H37.4599V56.1892H34.7842V53.5135H32.1085V50.8378H37.4599V56.1892H40.1356V50.8378H42.8112V56.1892H45.4869V48.1622H48.1626V45.4865H50.8383V48.1622H48.1626V50.8378H50.8383V53.5135H58.8653V50.8378H56.1896V48.1622H53.5139V42.8108H50.8383V40.1351H53.5139V37.4595H56.1896V34.7838H53.5139V32.1081H50.8383V37.4595H48.1626V34.7838H45.4869V37.4595H42.8112V34.7838H45.4869V32.1081H42.8112V24.0811H40.1356V21.4054H42.8112V24.0811H45.4869V13.3784H48.1626V18.7297H53.5139V16.0541H50.8383V10.7027H56.1896V13.3784H53.5139V16.0541H58.8653V13.3784H61.541V10.7027H66.8923V18.7297H61.541V16.0541H58.8653V21.4054H61.541V29.4324H64.2166V26.7568H66.8923V40.1351H72.2437V37.4595H69.568V32.1081H74.9193V40.1351H80.2707V37.4595H77.595V32.1081H80.2707V37.4595H82.9464V34.7838H88.2977V40.1351H85.622V37.4595H82.9464V40.1351H80.2707V48.1622H82.9464V50.8378H80.2707V53.5135H74.9193V56.1892H72.2437V58.8649H66.8923V56.1892H64.2166V53.5135H61.541V58.8649H64.2166V61.5405H72.2437V64.2162H77.595V61.5405H74.9193V58.8649H77.595V56.1892H80.2707V58.8649H82.9464V61.5405H85.622V56.1892H82.9464V53.5135H88.2977V61.5405H85.622V66.8919H88.2977V72.2432H85.622V80.2703H88.2977V82.946H80.2707V88.2973H72.2437V85.6216H77.595V82.946H72.2437V77.5946H69.568V82.946H66.8923V85.6216H69.568V88.2973H64.2166V80.2703H61.541V85.6216H58.8653V82.946H56.1896V72.2432H58.8653V80.2703H61.541V72.2432H64.2166V66.8919H61.541V64.2162H58.8653V61.5405H61.541V58.8649H58.8653V56.1892H56.1896V66.8919H58.8653V69.5676H53.5139V74.9189H50.8383V80.2703H53.5139V82.946H50.8383V85.6216H56.1896V88.2973H50.8383V85.6216H48.1626V82.946H45.4869V88.2973H34.7842V86.9595ZM42.8112 82.946V80.2703H45.4869V72.2432H40.1356V74.9189H42.8112V77.5946H37.4599V80.2703H34.7842V82.946H37.4599V85.6216H42.8112V82.946ZM80.2707 80.2703V77.5946H82.9464V72.2432H85.622V69.5676H82.9464V61.5405H80.2707V69.5676H82.9464V72.2432H80.2707V74.9189H77.595V82.946H80.2707V80.2703ZM66.8923 78.9324V77.5946H64.2166V80.2703H66.8923V78.9324ZM50.8383 73.5811V72.2432H48.1626V74.9189H50.8383V73.5811ZM74.9193 70.9054V66.8919H66.8923V74.9189H74.9193V70.9054ZM69.568 70.9054V69.5676H72.2437V72.2432H69.568V70.9054ZM48.1626 68.2297V66.8919H53.5139V64.2162H48.1626V61.5405H45.4869V64.2162H48.1626V66.8919H42.8112V64.2162H40.1356V66.8919H37.4599V64.2162H34.7842V61.5405H32.1085V58.8649H29.4329V61.5405H26.7572V64.2162H29.4329V61.5405H32.1085V64.2162H34.7842V66.8919H37.4599V69.5676H48.1626V68.2297ZM40.1356 60.2027V58.8649H37.4599V61.5405H40.1356V60.2027ZM53.5139 58.8649V56.1892H48.1626V58.8649H50.8383V61.5405H53.5139V58.8649ZM69.568 54.8514V53.5135H66.8923V56.1892H69.568V54.8514ZM74.9193 52.1757V50.8378H77.595V42.8108H74.9193V45.4865H72.2437V48.1622H69.568V45.4865H64.2166V42.8108H61.541V40.1351H64.2166V32.1081H61.541V29.4324H58.8653V26.7568H56.1896V29.4324H53.5139V21.4054H56.1896V24.0811H58.8653V21.4054H56.1896V18.7297H53.5139V21.4054H50.8383V29.4324H53.5139V32.1081H56.1896V29.4324H58.8653V37.4595H56.1896V40.1351H53.5139V42.8108H56.1896V48.1622H58.8653V45.4865H64.2166V48.1622H66.8923V50.8378H72.2437V53.5135H74.9193V52.1757ZM72.2437 49.5V48.1622H74.9193V50.8378H72.2437V49.5ZM29.4329 46.8243V45.4865H32.1085V42.8108H29.4329V45.4865H26.7572V48.1622H29.4329V46.8243ZM37.4599 41.473V40.1351H34.7842V42.8108H37.4599V41.473ZM37.4599 28.0946V26.7568H34.7842V29.4324H37.4599V28.0946ZM48.1626 26.7568V24.0811H45.4869V29.4324H48.1626V26.7568ZM64.2166 14.7162V13.3784H61.541V16.0541H64.2166V14.7162ZM85.622 86.9595V85.6216H88.2977V88.2973H85.622V86.9595ZM85.622 48.1622V45.4865H82.9464V42.8108H85.622V45.4865H88.2977V50.8378H85.622V48.1622ZM10.7031 20.0676V10.7027H29.4329V29.4324H10.7031V20.0676ZM26.7572 20.0676V13.3784H13.3788V26.7568H26.7572V20.0676ZM16.0545 20.0676V16.0541H24.0815V24.0811H16.0545V20.0676ZM69.568 20.0676V10.7027H88.2977V29.4324H69.568V20.0676ZM85.622 20.0676V13.3784H72.2437V26.7568H85.622V20.0676ZM74.9193 20.0676V16.0541H82.9464V24.0811H74.9193V20.0676ZM32.1085 20.0676V18.7297H34.7842V21.4054H32.1085V20.0676ZM37.4599 17.3919V16.0541H34.7842V10.7027H37.4599V13.3784H40.1356V10.7027H42.8112V13.3784H40.1356V18.7297H37.4599V17.3919Z"
                      fill="black"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-action-primary)] flex items-center justify-center">
              <span className="text-white text-label-md">3</span>
            </div>
            <div className="space-y-3 flex-1">
              <p className="text-body-md text-[var(--color-text-default)] pt-0.5">
                Enter the 6-digit verification code generated by your authenticator app to complete
                the setup.
              </p>

              {/* Verification Code Input */}
              <div className="space-y-2">
                <label className="block text-label-md text-[var(--color-text-default)]">
                  Verification Code
                </label>
                <Input
                  value={otpCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtpCode(value);
                    setOtpError('');
                  }}
                  placeholder="Enter code"
                  fullWidth
                  error={!!otpError}
                />
                {otpError && (
                  <p className="text-body-sm text-[var(--color-state-danger)]">{otpError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowEnrollmentModal(false);
                setSetupStep(1);
                setOtpCode('');
                setOtpError('');
                setCurrentSetupMethod(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                // Validate and save OTP setup
                if (otpCode.length === 6) {
                  const now = new Date();
                  const formattedDate = now.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  setAuthenticatorSetup({ configured: true, addedAt: formattedDate });
                  setTwoStepEnabled(true);
                  setShowEnrollmentModal(false);
                  setSetupStep(1);
                  setOtpCode('');
                  setCurrentSetupMethod(null);
                } else {
                  setOtpError('Please enter a valid 6-digit code');
                }
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>

      {/* Password Change Modal */}
      <Modal
        isOpen={showPasswordChangeModal}
        onClose={() => {
          setShowPasswordChangeModal(false);
          setNewPassword('');
          setConfirmPassword('');
          setShowNewPassword(false);
          setShowConfirmPassword(false);
          setNewPasswordError('');
          setConfirmPasswordError('');
        }}
        title="Change Password"
      >
        <div className="space-y-5">
          {/* New Password Field */}
          <div className="space-y-2">
            <label className="block text-label-md text-[var(--color-text-default)]">
              New Password
            </label>
            <div className="relative">
              <Input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setNewPasswordError('');
                }}
                placeholder="Enter new password"
                fullWidth
                error={!!newPasswordError}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <IconEye size={16} stroke={1.5} />
                ) : (
                  <IconEyeClosed size={16} stroke={1.5} />
                )}
              </button>
            </div>
            {newPasswordError && (
              <p className="text-body-sm text-[var(--color-state-danger)]">{newPasswordError}</p>
            )}
          </div>

          {/* Confirm New Password Field */}
          <div className="space-y-2">
            <label className="block text-label-md text-[var(--color-text-default)]">
              Confirm New Password
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError('');
                }}
                placeholder="Enter new password again"
                fullWidth
                error={!!confirmPasswordError}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <IconEye size={16} stroke={1.5} />
                ) : (
                  <IconEyeClosed size={16} stroke={1.5} />
                )}
              </button>
            </div>
            {confirmPasswordError && (
              <p className="text-body-sm text-[var(--color-state-danger)]">
                {confirmPasswordError}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setShowPasswordChangeModal(false);
                setNewPassword('');
                setConfirmPassword('');
                setShowNewPassword(false);
                setShowConfirmPassword(false);
                setNewPasswordError('');
                setConfirmPasswordError('');
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handlePasswordChangeSubmit}>
              Change
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default SettingsPage;
