import { useState } from 'react';
import {
  VStack,
  SectionCard,
  Select,
  Toggle,
  Radio,
  RadioGroup,
  Disclosure,
  FormField,
  PageShell,
  TabBar,
  useToast,
} from '@/design-system';
import { SettingsSidebar } from '@/components/SettingsSidebar';

/* ----------------------------------------
   Settings Notifications Page ---------------------------------------- */

export default function SettingsNotificationsPage() {
  const { success } = useToast();
  const sidebarWidth = 200;

  // Global Notifications State
  const [globalWhatToNotify, setGlobalWhatToNotify] = useState('all');
  const [globalSound, setGlobalSound] = useState(true);
  const [globalDuration, setGlobalDuration] = useState('3s');

  // Per Service Notifications State
  const [serviceNotifications, setServiceNotifications] = useState<
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
    value: string | boolean
  ) => {
    setServiceNotifications((prev) => ({
      ...prev,
      [service]: { ...prev[service], [field]: value },
    }));
    success('Notification preference updated.');
  };

  // Duration options
  const durationOptions = [
    { value: '1s', label: '1s' },
    { value: '2s', label: '2s' },
    { value: '3s', label: '3s' },
    { value: '5s', label: '5s' },
    { value: 'keep', label: 'Keep visible' },
  ];

  // Service list
  const services = [
    { key: 'compute', label: 'Compute' },
    { key: 'iam', label: 'IAM' },
    { key: 'storage', label: 'Storage' },
    { key: 'container', label: 'Container' },
    { key: 'aiPlatform', label: 'AI Platform' },
    { key: 'agentOps', label: 'Agent ops' },
  ];

  return (
    <PageShell
      sidebar={<SettingsSidebar />}
      sidebarWidth={sidebarWidth}
      tabBar={<TabBar tabs={[]} activeTab="" onTabChange={() => {}} showAddButton={false} />}
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={6}>
        {/* Header */}
        <div>
          <h1 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
            Notifications{' '}
          </h1>
          <p className="text-body-md leading-[18px] text-[var(--color-text-muted)] mt-1">
            Configure how you receive notifications.
          </p>
        </div>

        {/* Notification Preferences */}
        <SectionCard>
          <SectionCard.Header title="Notification preferences" />
          <SectionCard.Content>
            {/* Global Notification Setting */}
            <VStack gap={4}>
              <span className="text-label-lg text-[var(--color-text-default)]">
                Global Notification Setting
              </span>

              <div className="pl-2">
                <FormField label="What to Notify" spacing="loose">
                  <RadioGroup
                    value={globalWhatToNotify}
                    onChange={(val) => {
                      setGlobalWhatToNotify(val);
                      success('Notification preference updated.');
                    }}
                  >
                    <Radio value="all" label="All" />
                    <Radio value="errors" label="Errors only" />
                    <Radio value="off" label="Off" />
                  </RadioGroup>
                </FormField>
              </div>

              <div className={`pl-2 ${globalWhatToNotify === 'off' ? 'opacity-50' : ''}`}>
                <FormField label="Duration">
                  <Select
                    value={globalDuration}
                    onChange={(val) => {
                      setGlobalDuration(val);
                      success('Duration updated.');
                    }}
                    options={durationOptions}
                    width="sm"
                    disabled={globalWhatToNotify === 'off'}
                  />
                </FormField>
              </div>

              <div className={`pl-2 ${globalWhatToNotify === 'off' ? 'opacity-50' : ''}`}>
                <FormField label="Sound" spacing="loose">
                  <Toggle
                    checked={globalSound}
                    onChange={(e) => {
                      setGlobalSound(e.target.checked);
                      success(e.target.checked ? 'Sound enabled.' : 'Sound disabled.');
                    }}
                    disabled={globalWhatToNotify === 'off'}
                  />
                </FormField>
              </div>
            </VStack>

            {/* In-app Notification Setting */}
            <VStack gap={4}>
              <span className="text-label-lg text-[var(--color-text-default)]">
                In-app Notification Setting
              </span>

              {/* Service-specific settings */}
              {services.map(({ key, label }) => (
                <Disclosure
                  key={key}
                  className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden"
                >
                  <Disclosure.Trigger className="w-full py-3 px-4 bg-[var(--color-surface-subtle)]">
                    <span className="text-label-md text-[var(--color-text-default)]">{label}</span>
                  </Disclosure.Trigger>
                  <Disclosure.Panel className="space-y-3 px-4 py-3 border-t border-[var(--color-border-default)]">
                    <FormField label="What to Notify" spacing="loose">
                      <RadioGroup
                        value={serviceNotifications[key].whatToNotify}
                        onChange={(value) => updateServiceNotification(key, 'whatToNotify', value)}
                      >
                        <Radio value="all" label="All" />
                        <Radio value="errors" label="Errors only" />
                        <Radio value="off" label="Off" />
                      </RadioGroup>
                    </FormField>

                    <div
                      className={
                        serviceNotifications[key].whatToNotify === 'off' ? 'opacity-50' : ''
                      }
                    >
                      <FormField label="Duration">
                        <Select
                          value={serviceNotifications[key].duration}
                          onChange={(value) => updateServiceNotification(key, 'duration', value)}
                          options={durationOptions}
                          width="sm"
                          disabled={serviceNotifications[key].whatToNotify === 'off'}
                        />
                      </FormField>
                    </div>

                    <div
                      className={
                        serviceNotifications[key].whatToNotify === 'off' ? 'opacity-50' : ''
                      }
                    >
                      <FormField label="Sound" spacing="loose">
                        <Toggle
                          checked={serviceNotifications[key].sound}
                          onChange={(e) =>
                            updateServiceNotification(key, 'sound', e.target.checked)
                          }
                          disabled={serviceNotifications[key].whatToNotify === 'off'}
                        />
                      </FormField>
                    </div>
                  </Disclosure.Panel>
                </Disclosure>
              ))}
            </VStack>
          </SectionCard.Content>
        </SectionCard>
      </VStack>
    </PageShell>
  );
}
