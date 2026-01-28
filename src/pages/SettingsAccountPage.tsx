import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  VStack,
  TabBar,
  SectionCard,
  Input,
  Modal,
  Table,
  columnMinWidths,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { SettingsSidebar } from '@/components/SettingsSidebar';
import { useDarkMode } from '@/hooks/useDarkMode';
import { IconShieldCheck, IconCheck } from '@tabler/icons-react';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';

/* ----------------------------------------
   Settings Account Page
   ---------------------------------------- */

export default function SettingsAccountPage() {
  const navigate = useNavigate();
  const { isDark } = useDarkMode();

  // Account State
  const [name, setName] = useState('John Doe');
  const [email] = useState('taeksoo.kim@thakicloud.co.kr');
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLastUpdated, setPasswordLastUpdated] = useState('2024-01-10 09:30');

  // 2-Step Verification State
  const [twoStepEnabled, setTwoStepEnabled] = useState(false);
  const [authenticatorSetup, setAuthenticatorSetup] = useState<{
    configured: boolean;
    addedAt?: string;
  }>({ configured: false });

  // Modal State
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Handle window close
  const handleWindowClose = () => {
    navigate('/');
  };

  // Session data
  const sessions = [
    {
      id: '1',
      location: 'Gangnam-gu, Seoul, South Korea',
      ip: '211.234.56.78',
      device: 'Chrome on macOS',
      timestamp: '2026-01-06 14:32:18 +0900',
    },
    {
      id: '2',
      location: 'Gangnam-gu, Seoul, South Korea',
      ip: '211.234.56.78',
      device: 'Safari on iOS',
      timestamp: '2026-01-05 09:15:42 +0900',
    },
    {
      id: '3',
      location: 'Mapo-gu, Seoul, South Korea',
      ip: '175.192.44.123',
      device: 'Firefox on Windows',
      timestamp: '2026-01-04 18:22:05 +0900',
    },
    {
      id: '4',
      location: 'Seocho-gu, Seoul, South Korea',
      ip: '121.167.88.45',
      device: 'Edge on Windows',
      timestamp: '2026-01-03 11:45:33 +0900',
    },
    {
      id: '5',
      location: 'Bundang-gu, Seongnam, South Korea',
      ip: '58.123.201.67',
      device: 'Chrome on Android',
      timestamp: '2026-01-02 08:10:22 +0900',
    },
  ];

  // Session table columns
  const sessionColumns: TableColumn[] = [
    { key: 'location', label: 'Location', minWidth: '180px' },
    { key: 'ip', label: 'IP Address', flex: 1, minWidth: columnMinWidths.ip },
    { key: 'device', label: 'Device', minWidth: '140px' },
    { key: 'timestamp', label: 'Timestamp', flex: 1, minWidth: columnMinWidths.timestamp },
  ];

  return (
    <div className="fixed inset-0 flex flex-col bg-[var(--color-surface-subtle)]">
      {/* Top Bar with Logo and Window controls */}
      <div className="relative flex items-center w-full h-[var(--tabbar-height)] bg-[var(--color-surface-default)] shrink-0 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-[var(--color-border-default)]">
        {/* Logo Area */}
        <div className="w-[200px] h-full px-3 flex items-center">
          <img src={isDark ? ThakiLogoDark : ThakiLogoLight} alt="THAKI Cloud" className="h-4" />
        </div>

        {/* TabBar (Window controls only) */}
        <div className="flex-1">
          <TabBar
            tabs={[]}
            activeTab=""
            onTabChange={() => {}}
            showAddButton={false}
            showWindowControls={true}
            showBottomBorder={false}
            onWindowClose={handleWindowClose}
          />
        </div>
      </div>

      {/* Main Area: Sidebar + Content */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <SettingsSidebar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-[var(--color-surface-default)] overflow-hidden">
          {/* Page Content */}
          <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
            <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
              <VStack gap={6}>
                {/* Header */}
                <div>
                  <h1 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                    Account
                  </h1>
                  <p className="text-[12px] leading-[18px] text-[var(--color-text-muted)] mt-1">
                    Manage your account information and security settings.
                  </p>
                </div>

                {/* Account Information */}
                <SectionCard>
                  <SectionCard.Header title="Account Information" />
                  <SectionCard.Content gap={6}>
                    {/* ID */}
                    <VStack gap={2}>
                      <span className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
                        ID
                      </span>
                      <Input value="john.doe" disabled className="w-[400px]" />
                    </VStack>

                    {/* Divider */}
                    <div className="h-px w-full bg-[var(--color-border-subtle)]" />

                    {/* Name */}
                    <VStack gap={2}>
                      <span className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
                        Name
                      </span>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-[400px]"
                      />
                    </VStack>

                    {/* Divider */}
                    <div className="h-px w-full bg-[var(--color-border-subtle)]" />

                    {/* Email */}
                    <VStack gap={2}>
                      <span className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
                        Email
                      </span>
                      <div className="flex items-center gap-3">
                        <Input value={email} disabled className="w-[400px]" />
                        <Button variant="primary" size="sm">
                          Change email
                        </Button>
                      </div>
                    </VStack>
                  </SectionCard.Content>
                </SectionCard>

                {/* Authentication */}
                <SectionCard>
                  <SectionCard.Header title="Authentication" />
                  <SectionCard.Content gap={6}>
                    {/* Password */}
                    <VStack gap={4}>
                      <VStack gap={2}>
                        <span className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
                          Password
                        </span>
                        <p className="text-[12px] leading-4 text-[var(--color-text-subtle)]">
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
                          Change Password
                        </Button>
                      ) : (
                        <VStack gap={3} className="max-w-[400px]">
                          <VStack gap={2}>
                            <span className="text-[12px] font-medium text-[var(--color-text-default)]">
                              Enter a new password
                            </span>
                            <Input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="New password"
                            />
                          </VStack>
                          <VStack gap={2}>
                            <span className="text-[12px] font-medium text-[var(--color-text-default)]">
                              Confirm your new password
                            </span>
                            <Input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirm password"
                            />
                          </VStack>
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
                              Cancel
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
                              }}
                              disabled={
                                !newPassword || !confirmPassword || newPassword !== confirmPassword
                              }
                            >
                              Save
                            </Button>
                          </div>
                        </VStack>
                      )}
                    </VStack>

                    {/* Divider */}
                    <div className="h-px w-full bg-[var(--color-border-subtle)]" />

                    {/* MFA Setting */}
                    <VStack gap={4}>
                      <VStack gap={2}>
                        <span className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
                          MFA Setting
                        </span>
                        <p className="text-[12px] leading-4 text-[var(--color-text-subtle)]">
                          Add an extra layer of security to your account.
                        </p>
                      </VStack>

                      {/* Verification Methods - Always visible */}
                      <div className="flex items-center justify-between p-4 border border-[var(--color-border-default)] rounded-lg bg-[var(--color-surface-subtle)]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[var(--color-action-primary-subtle)] flex items-center justify-center">
                            <IconShieldCheck
                              size={20}
                              className="text-[var(--color-action-primary)]"
                            />
                          </div>
                          <div>
                            <div className="text-[12px] font-medium text-[var(--color-text-default)]">
                              Authenticator App
                            </div>
                            {authenticatorSetup.configured ? (
                              <div className="flex items-center gap-1.5 text-[12px] text-[var(--color-state-success)]">
                                <IconCheck size={12} />
                                <span>Added {authenticatorSetup.addedAt}</span>
                              </div>
                            ) : (
                              <div className="text-[12px] text-[var(--color-text-muted)]">
                                Use Google Authenticator, Authy, etc.
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant={authenticatorSetup.configured ? 'secondary' : 'primary'}
                          size="sm"
                          onClick={() => {
                            if (authenticatorSetup.configured) {
                              setAuthenticatorSetup({ configured: false });
                            } else {
                              const now = new Date();
                              const formattedDate = now.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              });
                              setAuthenticatorSetup({ configured: true, addedAt: formattedDate });
                            }
                          }}
                        >
                          {authenticatorSetup.configured ? 'Remove' : 'Set up'}
                        </Button>
                      </div>
                    </VStack>
                  </SectionCard.Content>
                </SectionCard>

                {/* Sessions */}
                <SectionCard>
                  <SectionCard.Header title="Sessions" />
                  <SectionCard.Content>
                    <p className="text-[12px] leading-[18px] text-[var(--color-text-muted)] mb-4">
                      View your recent login sessions.
                    </p>
                    <Table
                      columns={sessionColumns}
                      data={sessions}
                      rowKey="id"
                      emptyMessage="No sessions found"
                    />
                  </SectionCard.Content>
                </SectionCard>

                {/* Logout */}
                <div className="pt-6 border-t border-[var(--color-border-default)] flex justify-end">
                  <Button variant="secondary" size="md" onClick={() => setShowLogoutModal(true)}>
                    Logout
                  </Button>
                </div>
              </VStack>
            </div>
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Logout">
        <p className="text-sm text-[var(--color-text-default)] mb-6">
          Are you sure you want to logout of your account?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowLogoutModal(false);
              window.location.href = '/';
            }}
          >
            Logout
          </Button>
        </div>
      </Modal>
    </div>
  );
}
