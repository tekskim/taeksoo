import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Toggle, 
  Button, 
  Modal,
  SectionCard,
  Input,
  WindowControls,
} from '@/design-system';
import { 
  IconShieldCheck,
  IconCheck,
  IconCopy,
} from '@tabler/icons-react';

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

export function SettingsPage({ isOpen, onClose, initialTab = 'account' }: SettingsPageProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  // Center the window: 50% of screen size, centered position
  const [size, setSize] = useState<WindowSize>(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth * 0.5 : 960,
    height: typeof window !== 'undefined' ? window.innerHeight * 0.5 : 540,
  }));
  const [position, setPosition] = useState<WindowPosition>(() => ({
    x: typeof window !== 'undefined' ? (window.innerWidth - window.innerWidth * 0.5) / 2 : 300,
    y: typeof window !== 'undefined' ? (window.innerHeight - window.innerHeight * 0.5) / 2 : 100,
  }));
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Account State
  const [name, setName] = useState('John Doe');
  const [localName, setLocalName] = useState('John Doe');
  const [email, setEmail] = useState('taeksoo.kim@thakicloud.co.kr');

  // Sync localName with name when name changes externally
  useEffect(() => {
    setLocalName(name);
  }, [name]);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLastUpdated, setPasswordLastUpdated] = useState('2024-01-10 09:30');
  
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
  const [authenticatorSetup, setAuthenticatorSetup] = useState<{ configured: boolean; addedAt?: string }>({ configured: false });
  
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
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
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
  }, [isMaximized]);

  // Resize handlers
  const handleResizeStart = useCallback((e: React.MouseEvent, direction: string) => {
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
  }, [isMaximized, size, position]);

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
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[2000] pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Settings Window */}
      <div
        ref={windowRef}
        className="fixed z-[2001] bg-[var(--color-surface-default)] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        style={windowStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Resize Handles */}
        {!isMaximized && (
          <>
            {/* Edges */}
            <div className="absolute top-0 left-2 right-2 h-1 cursor-n-resize z-10" onMouseDown={(e) => handleResizeStart(e, 'n')} />
            <div className="absolute bottom-0 left-2 right-2 h-1 cursor-s-resize z-10" onMouseDown={(e) => handleResizeStart(e, 's')} />
            <div className="absolute left-0 top-2 bottom-2 w-1 cursor-w-resize z-10" onMouseDown={(e) => handleResizeStart(e, 'w')} />
            <div className="absolute right-0 top-2 bottom-2 w-1 cursor-e-resize z-10" onMouseDown={(e) => handleResizeStart(e, 'e')} />
            {/* Corners */}
            <div className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize z-20" onMouseDown={(e) => handleResizeStart(e, 'nw')} />
            <div className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize z-20" onMouseDown={(e) => handleResizeStart(e, 'ne')} />
            <div className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize z-20" onMouseDown={(e) => handleResizeStart(e, 'sw')} />
            <div className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize z-20" onMouseDown={(e) => handleResizeStart(e, 'se')} />
          </>
        )}

        {/* Window Header */}
        <div 
          className="h-12 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-default)] flex items-center justify-between px-4 cursor-move select-none shrink-0"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2 text-[length:var(--font-size-14)] leading-[var(--line-height-20)] font-medium text-[var(--color-text-default)]">
            <span>⚙️</span>
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
                <h5 className="text-[length:var(--font-size-16)] leading-[var(--line-height-24)] font-semibold text-[var(--color-text-default)]">Account</h5>
                  <p className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-muted)] mb-6">Manage your account information and security settings.</p>
                  
                  {/* Account Information */}
                  <SectionCard className="mb-6">
                    <SectionCard.Header title="Account Information" />
                    <SectionCard.Content gap={4}>
                      {/* ID - Read only */}
                      <div>
                        <label className="block text-[length:var(--font-size-12)] leading-[var(--line-height-16)] font-medium text-[var(--color-text-default)] mb-2">ID</label>
                        <Input value="john.doe" disabled className="min-w-[300px] max-w-[750px]" />
                      </div>
                      {/* Email - Read only */}
                      <div>
                        <label className="block text-[length:var(--font-size-12)] leading-[var(--line-height-16)] font-medium text-[var(--color-text-default)] mb-2">Email</label>
                        <Input value={email} disabled className="min-w-[300px] max-w-[750px]" />
                      </div>
                      {/* Name - Always editable */}
                      <div>
                        <label className="block text-[length:var(--font-size-12)] leading-[var(--line-height-16)] font-medium text-[var(--color-text-default)] mb-2">Name</label>
                        <Input 
                          value={localName}
                          onChange={(e) => setLocalName(e.target.value)}
                          onBlur={() => setName(localName)}
                          className="min-w-[300px] max-w-[750px]"
                        />
                      </div>
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Authentication */}
                  <SectionCard className="mb-6">
                    <SectionCard.Header title="Authentication" />
                    <SectionCard.Content gap={4}>
                      <div>
                        <label className="block text-[length:var(--font-size-12)] leading-[var(--line-height-16)] font-medium text-[var(--color-text-default)] mb-1">
                          Password
                          <span className="font-normal text-[var(--color-text-muted)] ml-2">Last updated: {passwordLastUpdated}</span>
                        </label>
                        {!isEditingPassword ? (
                          <Button variant="primary" size="sm" onClick={() => setIsEditingPassword(true)} className="mt-2">
                            Change Password
                          </Button>
                        ) : (
                          <div className="space-y-3 mt-3 max-w-[750px]">
                            <div>
                              <label className="block text-[length:var(--font-size-12)] leading-[var(--line-height-16)] font-medium text-[var(--color-text-default)] mb-1">Enter a new password</label>
                              <Input 
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New password"
                                className="w-[300px]"
                              />
                            </div>
                            <div>
                              <label className="block text-[length:var(--font-size-12)] leading-[var(--line-height-16)] font-medium text-[var(--color-text-default)] mb-1">Confirm your new password</label>
                              <Input 
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm password"
                                className="w-[300px]"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button variant="secondary" size="sm" onClick={() => {
                                setIsEditingPassword(false);
                                setNewPassword('');
                                setConfirmPassword('');
                              }}>Cancel</Button>
                              <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={() => {
                                  const now = new Date();
                                  const formattedDate = now.toLocaleDateString('en-CA') + ' ' + 
                                    now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                                  setPasswordLastUpdated(formattedDate);
                                  setIsEditingPassword(false);
                                  setNewPassword('');
                                  setConfirmPassword('');
                                }}
                                disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
                              >Save</Button>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* 2-Step Verification */}
                      <div className="space-y-4 pt-4 border-t border-[var(--color-border-default)]">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="block text-[length:var(--font-size-12)] leading-[var(--line-height-16)] font-medium text-[var(--color-text-default)] mb-1">2-Step Verification</label>
                            <p className="text-[length:var(--font-size-12)] leading-[var(--line-height-16)] text-[var(--color-text-muted)] max-w-[400px]">
                              Add an extra layer of security to your account.
                            </p>
                          </div>
                          <Toggle 
                            checked={twoStepEnabled}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTwoStepEnabled(true);
                              } else {
                                // Disable requires password re-entry
                                setCurrentSetupMethod(null);
                                setShowPasswordModal(true);
                              }
                            }}
                          />
                        </div>

                        {/* Verification Methods - Only show when toggle is ON */}
                        {twoStepEnabled && (
                          <div className="space-y-3 mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                            <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-16)] font-medium text-[var(--color-text-muted)]">Verification Methods</span>
                            
                            {/* Authenticator App */}
                            <div className="flex items-center justify-between p-4 border border-[var(--color-border-default)] rounded-lg bg-[var(--color-surface-subtle)]">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[var(--color-action-primary-subtle)] flex items-center justify-center">
                                  <IconShieldCheck size={20} className="text-[var(--color-action-primary)]" />
                                </div>
                                <div>
                                  <div className="text-[length:var(--font-size-12)] leading-[var(--line-height-16)] font-medium text-[var(--color-text-default)]">
                                    Authenticator App
                                  </div>
                                  {authenticatorSetup.configured ? (
                                    <div className="flex items-center gap-1.5 text-[length:var(--font-size-12)] leading-[var(--line-height-14)] text-[var(--color-state-success)]">
                                      <IconCheck size={12} />
                                      <span>Added {authenticatorSetup.addedAt}</span>
                                    </div>
                                  ) : (
                                    <div className="text-[length:var(--font-size-12)] leading-[var(--line-height-14)] text-[var(--color-text-muted)]">
                                      Use Google Authenticator, Authy, etc.
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Button 
                                variant={authenticatorSetup.configured ? "secondary" : "primary"} 
                                size="sm"
                                onClick={() => {
                                  setCurrentSetupMethod('authenticator');
                                  setSetupStep(1);
                                  setShowPasswordModal(true);
                                }}
                              >
                                {authenticatorSetup.configured ? 'Remove' : 'Set up'}
                              </Button>
                            </div>

                          </div>
                        )}
                      </div>
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Sessions */}
                  <SectionCard className="mb-6">
                    <SectionCard.Header title="Sessions" />
                    <SectionCard.Content>
                      <p className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-muted)] mb-4">View your recent login sessions.</p>
                      <div className="border border-[var(--color-border-default)] rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-[var(--color-surface-subtle)]">
                            <tr>
                              <th className="px-4 py-3 text-left text-[length:var(--font-size-12)] leading-[var(--line-height-16)] font-semibold text-[var(--color-text-muted)]">Location</th>
                              <th className="px-4 py-3 text-left text-[length:var(--font-size-12)] leading-[var(--line-height-16)] font-semibold text-[var(--color-text-muted)]">IP Address</th>
                              <th className="px-4 py-3 text-left text-[length:var(--font-size-12)] leading-[var(--line-height-16)] font-semibold text-[var(--color-text-muted)]">Device</th>
                              <th className="px-4 py-3 text-left text-[length:var(--font-size-12)] leading-[var(--line-height-16)] font-semibold text-[var(--color-text-muted)]">Timestamp</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t border-[var(--color-border-default)]">
                              <td className="px-4 py-3 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">Gangnam-gu, Seoul, South Korea</td>
                              <td className="px-4 py-3 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">211.234.56.78</td>
                              <td className="px-4 py-3 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">Chrome on macOS</td>
                              <td className="px-4 py-3 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">2026-01-06 14:32:18 +0900</td>
                            </tr>
                            <tr className="border-t border-[var(--color-border-default)]">
                              <td className="px-4 py-3 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">Gangnam-gu, Seoul, South Korea</td>
                              <td className="px-4 py-3 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">211.234.56.78</td>
                              <td className="px-4 py-3 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">Safari on iOS</td>
                              <td className="px-4 py-3 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">2026-01-05 09:15:42 +0900</td>
                            </tr>
                            <tr className="border-t border-[var(--color-border-default)]">
                              <td className="px-4 py-3 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">Mapo-gu, Seoul, South Korea</td>
                              <td className="px-4 py-3 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">175.192.44.123</td>
                              <td className="px-4 py-3 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">Firefox on Windows</td>
                              <td className="px-4 py-3 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">2026-01-04 18:22:05 +0900</td>
                            </tr>
                            <tr className="border-t border-[var(--color-border-default)]">
                              <td className="px-4 py-3 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">Seocho-gu, Seoul, South Korea</td>
                              <td className="px-4 py-3 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">121.167.88.45</td>
                              <td className="px-4 py-3 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">Edge on Windows</td>
                              <td className="px-4 py-3 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">2026-01-03 11:45:33 +0900</td>
                            </tr>
                            <tr className="border-t border-[var(--color-border-default)]">
                              <td className="px-4 py-3 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">Bundang-gu, Seongnam, South Korea</td>
                              <td className="px-4 py-3 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">58.123.201.67</td>
                              <td className="px-4 py-3 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">Chrome on Android</td>
                              <td className="px-4 py-3 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">2026-01-02 08:10:22 +0900</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </SectionCard.Content>
                  </SectionCard>

                  {/* Logout - No boundary stroke as per spec */}
                  <div className="mt-6 pt-6 border-t border-[var(--color-border-default)]">
                    <Button variant="danger" size="lg" onClick={() => setShowLogoutModal(true)}>
                      Logout
                    </Button>
                  </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Logout"
      >
        <p className="text-sm text-[var(--color-text-default)] mb-6">Are you sure you want to logout of your account?</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => {
            setShowLogoutModal(false);
            // In real app: redirect to login screen
            window.location.href = '/login';
          }}>Logout</Button>
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
          <p className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">
            Your current email is <span className="font-semibold">{email}</span>.
          </p>

          {/* Step 1: Password verification */}
          <div>
            <p className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)] mb-2">Please enter your password.</p>
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
              <p className="text-xs text-[var(--color-status-danger)] mt-1">{emailChangePasswordError}</p>
            )}
          </div>

          {/* Step 2+: New email input (visible after password verified) */}
          {emailChangeStep >= 2 && (
            <div>
              <p className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)] mb-2">
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
              <p className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)] mb-2">
                We just sent you a temporary verification code to{' '}
                <span className="font-semibold text-[var(--color-action-primary)]">{newEmail}</span>.
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
          <p className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">
            Please enter your current password to verify your identity before modifying security settings.
          </p>
          
          <div className="space-y-2">
            <label className="block text-[length:var(--font-size-12)] leading-[var(--line-height-16)] font-medium text-[var(--color-text-default)]">
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
              <p className="text-[length:var(--font-size-12)] text-[var(--color-state-danger)]">{passwordError}</p>
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
                  } else if (currentSetupMethod === 'authenticator' && authenticatorSetup.configured) {
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

      {/* Step 2 & 3: Enrollment & Verification Modal */}
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
        title="Set up Authenticator App"
      >
        <div className="space-y-5">
          {/* Step 2: Enrollment */}
          {setupStep === 2 && (
            <>
              {currentSetupMethod === 'authenticator' && (
                <div className="space-y-4">
                  <p className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">
                    Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                  </p>
                  
                  {/* QR Code */}
                  <div className="flex justify-center p-6 bg-white rounded-lg border border-[var(--color-border-default)]">
                    <div className="w-[180px] h-[180px] bg-[#000] rounded-lg flex items-center justify-center relative overflow-hidden">
                      {/* Simulated QR Code Pattern */}
                      <svg viewBox="0 0 100 100" className="w-full h-full p-3">
                        <rect x="0" y="0" width="100" height="100" fill="white"/>
                        {/* Position detection patterns */}
                        <rect x="5" y="5" width="25" height="25" fill="black"/>
                        <rect x="8" y="8" width="19" height="19" fill="white"/>
                        <rect x="11" y="11" width="13" height="13" fill="black"/>
                        
                        <rect x="70" y="5" width="25" height="25" fill="black"/>
                        <rect x="73" y="8" width="19" height="19" fill="white"/>
                        <rect x="76" y="11" width="13" height="13" fill="black"/>
                        
                        <rect x="5" y="70" width="25" height="25" fill="black"/>
                        <rect x="8" y="73" width="19" height="19" fill="white"/>
                        <rect x="11" y="76" width="13" height="13" fill="black"/>
                        
                        {/* Random pattern */}
                        <rect x="35" y="5" width="5" height="5" fill="black"/>
                        <rect x="45" y="5" width="5" height="5" fill="black"/>
                        <rect x="55" y="5" width="5" height="5" fill="black"/>
                        <rect x="35" y="15" width="5" height="5" fill="black"/>
                        <rect x="50" y="15" width="5" height="5" fill="black"/>
                        <rect x="35" y="25" width="5" height="5" fill="black"/>
                        <rect x="45" y="25" width="5" height="5" fill="black"/>
                        <rect x="55" y="25" width="5" height="5" fill="black"/>
                        <rect x="35" y="35" width="5" height="5" fill="black"/>
                        <rect x="45" y="35" width="5" height="5" fill="black"/>
                        <rect x="55" y="35" width="5" height="5" fill="black"/>
                        <rect x="65" y="35" width="5" height="5" fill="black"/>
                        <rect x="75" y="35" width="5" height="5" fill="black"/>
                        <rect x="85" y="35" width="5" height="5" fill="black"/>
                        <rect x="5" y="45" width="5" height="5" fill="black"/>
                        <rect x="15" y="45" width="5" height="5" fill="black"/>
                        <rect x="25" y="45" width="5" height="5" fill="black"/>
                        <rect x="45" y="45" width="5" height="5" fill="black"/>
                        <rect x="65" y="45" width="5" height="5" fill="black"/>
                        <rect x="85" y="45" width="5" height="5" fill="black"/>
                        <rect x="5" y="55" width="5" height="5" fill="black"/>
                        <rect x="25" y="55" width="5" height="5" fill="black"/>
                        <rect x="35" y="55" width="5" height="5" fill="black"/>
                        <rect x="55" y="55" width="5" height="5" fill="black"/>
                        <rect x="75" y="55" width="5" height="5" fill="black"/>
                        <rect x="35" y="65" width="5" height="5" fill="black"/>
                        <rect x="45" y="65" width="5" height="5" fill="black"/>
                        <rect x="65" y="65" width="5" height="5" fill="black"/>
                        <rect x="85" y="65" width="5" height="5" fill="black"/>
                        <rect x="35" y="75" width="5" height="5" fill="black"/>
                        <rect x="55" y="75" width="5" height="5" fill="black"/>
                        <rect x="65" y="75" width="5" height="5" fill="black"/>
                        <rect x="75" y="75" width="5" height="5" fill="black"/>
                        <rect x="35" y="85" width="5" height="5" fill="black"/>
                        <rect x="45" y="85" width="5" height="5" fill="black"/>
                        <rect x="55" y="85" width="5" height="5" fill="black"/>
                        <rect x="65" y="85" width="5" height="5" fill="black"/>
                        <rect x="85" y="85" width="5" height="5" fill="black"/>
                      </svg>
                    </div>
                  </div>

                  {/* Manual Secret Key */}
                  <div className="space-y-2">
                    <p className="text-[length:var(--font-size-12)] leading-[var(--line-height-16)] text-[var(--color-text-muted)]">
                      Or enter this code manually:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-md font-mono text-[length:var(--font-size-12)] tracking-wider text-center">
                        {demoSecretKey}
                      </code>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(demoSecretKey);
                          setSecretKeyCopied(true);
                          setTimeout(() => setSecretKeyCopied(false), 2000);
                        }}
                      >
                        {secretKeyCopied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button 
                      variant="secondary" 
                      onClick={() => {
                        setShowEnrollmentModal(false);
                        setSetupStep(1);
                        setCurrentSetupMethod(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={() => setSetupStep(3)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

            </>
          )}

          {/* Step 3: OTP Verification */}
          {setupStep === 3 && (
            <div className="space-y-4">
              <p className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">
                Enter the 6-digit code from your authenticator app to complete setup.
              </p>
              
              <div className="space-y-2">
                <label className="block text-[length:var(--font-size-12)] leading-[var(--line-height-16)] font-medium text-[var(--color-text-default)]">
                  Verification Code
                </label>
                <Input
                  value={otpCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtpCode(value);
                    setOtpError('');
                  }}
                  placeholder="000000"
                  className={`text-center font-mono text-lg tracking-[0.5em] ${otpError ? 'border-[var(--color-state-danger)]' : ''}`}
                  maxLength={6}
                />
                {otpError && (
                  <p className="text-[length:var(--font-size-12)] text-[var(--color-state-danger)]">{otpError}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button 
                  variant="secondary" 
                  onClick={() => setSetupStep(2)}
                >
                  Back
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => {
                    // Simulate OTP verification (accept any 6-digit code for demo)
                    if (otpCode.length === 6) {
                      const now = new Date();
                      const formattedDate = now.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
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
                  disabled={otpCode.length !== 6}
                >
                  Verify and Enable
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

export default SettingsPage;
