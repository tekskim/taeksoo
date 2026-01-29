import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VStack,
  TabBar,
  SectionCard,
  Select,
  Toggle,
  Radio,
  RadioGroup,
  Disclosure,
} from '@/design-system';
import { SettingsSidebar } from '@/components/SettingsSidebar';
import { useDarkMode } from '@/hooks/useDarkMode';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';

/* ----------------------------------------
   Settings Notifications Page ---------------------------------------- */

export default function SettingsNotificationsPage() {
  const navigate = useNavigate();
  const { isDark } = useDarkMode();

  // Global Notifications State const [globalWhatToNotify, setGlobalWhatToNotify] = useState('all');
  const [globalSound, setGlobalSound] = useState(true);
  const [globalDuration, setGlobalDuration] = useState('3s');

  // Per Service Notifications State const [serviceNotifications, setServiceNotifications] = useState<
    Record<string, { whatToNotify: string; duration: string; sound: boolean }>
  >({
    compute: { whatToNotify: 'all', duration: '3s', sound: true },
    iam: { whatToNotify: 'all', duration: '3s', sound: true },
    storage: { whatToNotify: 'all', duration: '3s', sound: true },
    container: { whatToNotify: 'all', duration: '3s', sound: true },
    aiPlatform: { whatToNotify: 'all', duration: '3s', sound: true },
    agentOps: { whatToNotify: 'all', duration: '3s', sound: true },
  });

  const updateServiceNotification = (
    service: string,
    field: 'whatToNotify' | 'duration' | 'sound',
    value: string | boolean ) => {
    setServiceNotifications((prev) => ({
      ...prev,
      [service]: { ...prev[service], [field]: value },
    }));
  };

  // Handle window close const handleWindowClose = () => {
    navigate('/');
  };

  // Duration options const durationOptions = [
    { value: '1s', label: '1s' },
    { value: '2s', label: '2s' },
    { value: '3s', label: '3s' },
    { value: '5s', label: '5s' },
    { value: 'keep', label: 'Keep visible' },
  ];

  // Service list const services = [
    { key: 'compute', label: 'Compute' },
    { key: 'iam', label: 'IAM' },
    { key: 'storage', label: 'Storage' },
    { key: 'container', label: 'Container' },
    { key: 'aiPlatform', label: 'AI Platform' },
    { key: 'agentOps', label: 'Agent ops' },
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
          <TabBar tabs={[]}
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
                  <h1 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                    Notifications </h1>
                  <p className="text-body-md leading-[18px] text-[var(--color-text-muted)] mt-1">
                    Configure how you receive notifications.
                  </p>
                </div>

                {/* Notification Preferences */}
                <SectionCard>
                  <SectionCard.Header title="Notification Preferences" />
                  <SectionCard.Content gap={6}>
                    {/* Global Notification Setting */}
                    <VStack gap={4}>
                      <span className="text-body-lg font-semibold leading-5 text-[var(--color-text-default)]">
                        Global Notification Setting </span>

                      {/* What to Notify */}
                      <VStack gap={2} className="pl-2">
                        <span className="text-label-md text-[var(--color-text-default)]">
                          What to Notify </span>
                        <RadioGroup value={globalWhatToNotify}
                          onChange={setGlobalWhatToNotify}
                          direction="horizontal"
                        >
                          <Radio value="all" label="All" />
                          <Radio value="errors" label="Errors only" />
                          <Radio value="off" label="Off" />
                        </RadioGroup>
                      </VStack>

                      {/* Duration */}
                      <VStack gap={2}
                        className={`pl-2 ${globalWhatToNotify === 'off' ? 'opacity-50' : ''}`}
                      >
                        <span className="text-label-md text-[var(--color-text-default)]">
                          Duration </span>
                        <Select value={globalDuration}
                          onChange={setGlobalDuration}
                          options={durationOptions}
                          width="sm"
                          disabled={globalWhatToNotify === 'off'}
                        />
                      </VStack>

                      {/* Sound */}
                      <VStack gap={2}
                        className={`pl-2 ${globalWhatToNotify === 'off' ? 'opacity-50' : ''}`}
                      >
                        <span className="text-label-md text-[var(--color-text-default)]">
                          Sound </span>
                        <Toggle checked={globalSound}
                          onChange={(e) => setGlobalSound(e.target.checked)}
                          disabled={globalWhatToNotify === 'off'}
                        />
                      </VStack>
                    </VStack>

                    {/* Divider */}
                    <div className="h-px w-full bg-[var(--color-border-subtle)]" />

                    {/* In-app Notification Setting */}
                    <VStack gap={4}>
                      <span className="text-body-lg font-semibold leading-5 text-[var(--color-text-default)]">
                        In-app Notification Setting </span>

                      {/* Service-specific settings */}
                      {services.map(({ key, label }) => (
                        <Disclosure key={key}
                          className="border border-[var(--color-border-default)] rounded-lg overflow-hidden"
                        >
                          <Disclosure.Trigger className="w-full py-3 px-4 bg-[var(--color-surface-subtle)]">
                            <span className="text-label-md text-[var(--color-text-default)]">
                              {label}
                            </span>
                          </Disclosure.Trigger>
                          <Disclosure.Panel className="space-y-3 px-4 py-3 border-t border-[var(--color-border-default)]">
                            {/* What to Notify */}
                            <div>
                              <span className="text-label-md text-[var(--color-text-default)] block mb-2">
                                What to Notify </span>
                              <RadioGroup value={serviceNotifications[key].whatToNotify}
                                onChange={(value) =>
                                  updateServiceNotification(key, 'whatToNotify', value)
                                }
                                direction="horizontal"
                              >
                                <Radio value="all" label="All" />
                                <Radio value="errors" label="Errors only" />
                                <Radio value="off" label="Off" />
                              </RadioGroup>
                            </div>

                            {/* Duration */}
                            <div className={
                                serviceNotifications[key].whatToNotify === 'off' ? 'opacity-50' : ''
                              }
                            >
                              <span className="text-label-md text-[var(--color-text-default)] block mb-2">
                                Duration </span>
                              <Select value={serviceNotifications[key].duration}
                                onChange={(value) =>
                                  updateServiceNotification(key, 'duration', value)
                                }
                                options={durationOptions}
                                width="sm"
                                disabled={serviceNotifications[key].whatToNotify === 'off'}
                              />
                            </div>

                            {/* Sound */}
                            <div className={
                                serviceNotifications[key].whatToNotify === 'off' ? 'opacity-50' : ''
                              }
                            >
                              <span className="text-label-md text-[var(--color-text-default)] block mb-2">
                                Sound </span>
                              <Toggle checked={serviceNotifications[key].sound}
                                onChange={(e) =>
                                  updateServiceNotification(key, 'sound', e.target.checked)
                                }
                                disabled={serviceNotifications[key].whatToNotify === 'off'}
                              />
                            </div>
                          </Disclosure.Panel>
                        </Disclosure>
                      ))}
                    </VStack>
                  </SectionCard.Content>
                </SectionCard>
              </VStack>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
