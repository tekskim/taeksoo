import { useState } from 'react';
import {
  Breadcrumb,
  Button,
  VStack,
  SectionCard,
  Input,
  Modal,
  Table,
  Pagination,
  PageShell,
  TabBar,
  TopBar,
  CopyButton,
  FormField,
  columnMinWidths,
  useToast,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { SettingsSidebar } from '@/components/SettingsSidebar';
import { IconShieldCheck, IconCheck, IconEdit } from '@tabler/icons-react';

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
    sessions.push({ id: `session-${i + 1}`, ipAddress: ip, device, timestamp });
  }
  return sessions;
};

/* ----------------------------------------
   Settings Account Page ---------------------------------------- */

export default function SettingsAccountPage() {
  const { success } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Account State
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@thakicloud.co.kr');
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [draftName, setDraftName] = useState('John Doe');
  const [draftEmail, setDraftEmail] = useState('john.doe@thakicloud.co.kr');
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLastUpdated, setPasswordLastUpdated] = useState('Jan 10, 2026');

  // 2-Step Verification State
  const [twoStepEnabled, setTwoStepEnabled] = useState(false);
  const [authenticatorSetup, setAuthenticatorSetup] = useState<{
    configured: boolean;
    addedAt?: string;
  }>({ configured: false });

  // MFA Setup Flow State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [currentSetupMethod, setCurrentSetupMethod] = useState<'authenticator' | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const demoSecretKey = 'JBSWY3DPEHPK3PXP';

  // Modal State
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Activity data
  const [activitySessions] = useState(generateActivitySessions);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(activitySessions.length / rowsPerPage);
  const paginatedSessions = activitySessions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const sessionColumns: TableColumn[] = [
    { key: 'ipAddress', label: 'IP Address', flex: 1, minWidth: columnMinWidths.ipAddress },
    { key: 'device', label: 'Device', flex: 1 },
    { key: 'timestamp', label: 'Time', flex: 1, minWidth: columnMinWidths.timestamp },
  ];

  return (
    <PageShell
      sidebar={
        <SettingsSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={<TabBar tabs={[]} activeTab="" onTabChange={() => {}} showAddButton={false} />}
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={false}
          breadcrumb={<Breadcrumb items={[{ label: 'Settings' }, { label: 'Account' }]} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={6}>
        {/* Header */}
        <div>
          <h1 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">Account</h1>
          <p className="text-body-md leading-[18px] text-[var(--color-text-muted)] mt-1">
            Manage your account information and security settings.
          </p>
        </div>

        {/* Account Information */}
        <SectionCard isActive={isEditingAccount}>
          <SectionCard.Header
            title="Account information"
            actions={
              isEditingAccount ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setIsEditingAccount(false);
                      setDraftName(name);
                      setDraftEmail(email);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setName(draftName);
                      setEmail(draftEmail);
                      setIsEditingAccount(false);
                      success('Profile updated successfully.');
                    }}
                    disabled={!draftName.trim() || !draftEmail.trim()}
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<IconEdit size={12} />}
                  onClick={() => {
                    setDraftName(name);
                    setDraftEmail(email);
                    setIsEditingAccount(true);
                  }}
                >
                  Edit
                </Button>
              )
            }
          />
          {isEditingAccount ? (
            <SectionCard.Content>
              <SectionCard.DataRow label="ID" value="john.doe" />
              <Input
                label="Email"
                value={draftEmail}
                onChange={(e) => setDraftEmail(e.target.value)}
                fullWidth
              />
              <Input
                label="Name"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
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
        <SectionCard>
          <SectionCard.Header title="Authentication" />
          <SectionCard.Content>
            {/* Password */}
            <VStack gap={4}>
              <VStack gap={2}>
                <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                  Password{' '}
                </span>
                <p className="text-body-md leading-4 text-[var(--color-text-subtle)]">
                  Last updated: {passwordLastUpdated}
                </p>
              </VStack>
              {!isEditingPassword ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsEditingPassword(true)}
                  className="w-fit"
                >
                  Change Password{' '}
                </Button>
              ) : (
                <VStack gap={3} className="max-w-[400px]">
                  <FormField label="Enter a new password">
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      fullWidth
                    />
                  </FormField>
                  <FormField label="Confirm your new password">
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      fullWidth
                    />
                  </FormField>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setIsEditingPassword(false);
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                    >
                      Cancel{' '}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        const now = new Date();
                        const formattedDate =
                          now.toLocaleDateString('en-CA') +
                          ' ' +
                          now.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          });
                        setPasswordLastUpdated(formattedDate);
                        setIsEditingPassword(false);
                        setNewPassword('');
                        setConfirmPassword('');
                        success('Password updated successfully.');
                      }}
                      disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
                    >
                      Save{' '}
                    </Button>
                  </div>
                </VStack>
              )}
            </VStack>

            {/* MFA Setting */}
            <VStack gap={4}>
              <VStack gap={2}>
                <span className="text-label-lg leading-5 text-[var(--color-text-default)]">
                  MFA Setting{' '}
                </span>
                <p className="text-body-md leading-4 text-[var(--color-text-subtle)]">
                  Add an extra layer of security to your account.
                </p>
              </VStack>

              {/* Verification Methods - Always visible */}
              <div className="flex items-center justify-between p-4 border border-[var(--color-border-default)] rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-[var(--color-action-primary-subtle)] flex items-center justify-center">
                    <IconShieldCheck size={20} className="text-[var(--color-action-primary)]" />
                  </div>
                  <div>
                    <div className="text-label-md text-[var(--color-text-default)]">
                      Authenticator App{' '}
                    </div>
                    {authenticatorSetup.configured ? (
                      <div className="flex items-center gap-1.5 text-body-md text-[var(--color-state-success)]">
                        <IconCheck size={16} />
                        <span>Added {authenticatorSetup.addedAt}</span>
                      </div>
                    ) : (
                      <div className="text-body-md text-[var(--color-text-muted)]">
                        Use Google Authenticator, Authy, etc.
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant={authenticatorSetup.configured ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => {
                    setCurrentSetupMethod('authenticator');
                    if (authenticatorSetup.configured) {
                      setShowPasswordModal(true);
                    } else {
                      setShowEnrollmentModal(true);
                    }
                  }}
                >
                  {authenticatorSetup.configured ? 'Remove' : 'Set up'}
                </Button>
              </div>
            </VStack>
          </SectionCard.Content>
        </SectionCard>

        {/* Activity */}
        <SectionCard>
          <SectionCard.Header title="Activity" showDivider={false} />
          <SectionCard.Content>
            <div>
              <p className="text-body-md text-[var(--color-text-muted)] mb-4">
                Displaying your latest account activity.
              </p>
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
        <div className="pt-6 border-t border-[var(--color-border-default)] flex justify-end">
          <Button variant="secondary" size="md" onClick={() => setShowLogoutModal(true)}>
            Logout{' '}
          </Button>
        </div>
      </VStack>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Logout">
        <p className="text-sm text-[var(--color-text-default)] mb-6">
          This action logs you out of your account.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel{' '}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowLogoutModal(false);
              window.location.href = '/login';
            }}
          >
            Logout{' '}
          </Button>
        </div>
      </Modal>

      {/* Password Re-authentication Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordInput('');
          setPasswordError('');
          setCurrentSetupMethod(null);
        }}
        title="Verify your identity"
      >
        <div className="space-y-4">
          <p className="text-body-md text-[var(--color-text-default)]">
            Please enter your current password to verify your identity before modifying security
            settings.
          </p>
          <FormField
            label="Current Password"
            error={!!passwordError}
            errorMessage={passwordError || undefined}
          >
            <Input
              type="password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError('');
              }}
              placeholder="Enter your password"
              fullWidth
              error={!!passwordError}
            />
          </FormField>
          <div className="flex gap-2 w-full">
            <Button
              variant="secondary"
              className="flex-1"
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
              className="flex-1"
              onClick={() => {
                if (passwordInput.length >= 1) {
                  setShowPasswordModal(false);
                  setPasswordInput('');
                  if (currentSetupMethod === 'authenticator' && authenticatorSetup.configured) {
                    setAuthenticatorSetup({ configured: false });
                    setTwoStepEnabled(false);
                    setCurrentSetupMethod(null);
                  } else {
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

      {/* OTP App Setup Modal */}
      <Modal
        isOpen={showEnrollmentModal}
        onClose={() => {
          setShowEnrollmentModal(false);
          setOtpCode('');
          setOtpError('');
          setCurrentSetupMethod(null);
        }}
        title="Set up the OTP App"
        description="For security, you must set up OTP verification."
      >
        <div className="space-y-4">
          <p className="text-body-md text-[var(--color-text-default)]">
            1. Install a compatible application such as Google or Microsoft Authenticator app on
            your mobile device or computer.
          </p>

          <div className="space-y-3">
            <p className="text-body-md text-[var(--color-text-default)]">
              2. Open your authenticator app and scan the QR code below, or enter the code manually.
            </p>
            <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-md">
              <code className="font-mono text-body-md tracking-wider text-[var(--color-text-default)] break-all flex-1">
                {demoSecretKey}
              </code>
              <CopyButton value={demoSecretKey} size="sm" iconOnly tooltip="Copy secret key" />
            </div>
            <div className="flex justify-center">
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

          <div className="space-y-6">
            <p className="text-body-md text-[var(--color-text-default)]">
              3. Enter the 6-digit verification code generated by your authenticator app to complete
              the setup.
            </p>
            <FormField
              label="Verification Code"
              error={!!otpError}
              errorMessage={otpError || undefined}
            >
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
            </FormField>
          </div>

          <div className="flex gap-2 w-full">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowEnrollmentModal(false);
                setOtpCode('');
                setOtpError('');
                setCurrentSetupMethod(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
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
    </PageShell>
  );
}
