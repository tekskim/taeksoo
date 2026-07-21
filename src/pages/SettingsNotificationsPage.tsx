import { useState } from 'react';
import {
  Badge,
  Breadcrumb,
  VStack,
  HStack,
  SectionCard,
  Toggle,
  Disclosure,
  FormField,
  PageShell,
  TabBar,
  TopBar,
  useToast,
} from '@/design-system';
import { SettingsSidebar } from '@/components/SettingsSidebar';

import imgCompute from '@/assets/appIcon/compute.png';
import imgStorage from '@/assets/appIcon/storage.png';
import imgContainer from '@/assets/appIcon/container.png';
import imgAgent from '@/assets/appIcon/agentops.png';
import imgAi from '@/assets/appIcon/aiplatform.png';

interface AppNotificationState {
  notification: boolean;
  sound: boolean;
}

const APP_LIST = [
  { key: 'compute', label: 'Aegis Compute', icon: imgCompute },
  { key: 'storage', label: 'Aegis Storage', icon: imgStorage },
  { key: 'container', label: 'Aegis Container', icon: imgContainer },
  { key: 'agent', label: 'Agent Studio', icon: imgAgent },
  { key: 'aiPlatform', label: 'AI Platform', icon: imgAi },
] as const;

export default function SettingsNotificationsPage() {
  const { success } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;

  const [globalNotifications, setGlobalNotifications] = useState(true);
  const [globalSound, setGlobalSound] = useState(true);

  const [appNotifications, setAppNotifications] = useState<Record<string, AppNotificationState>>(
    () => Object.fromEntries(APP_LIST.map(({ key }) => [key, { notification: true, sound: true }]))
  );

  const updateApp = (key: string, field: keyof AppNotificationState, value: boolean) => {
    setAppNotifications((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
    success('Notification preference updated.');
  };

  const getStatusLabel = (state: AppNotificationState) => {
    const notif = state.notification ? 'On' : 'Off';
    const sound = state.sound ? 'Sound on' : 'Sound off';
    return { notif, sound };
  };

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
          breadcrumb={<Breadcrumb items={[{ label: 'Notifications' }]} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={6}>
        <div>
          <h1 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
            Notifications
          </h1>
        </div>

        <SectionCard>
          <SectionCard.Header title="Global notifications" />
          <SectionCard.Content>
            <FormField
              label="Enable notifications"
              description="When turned off, all notifications and sounds are blocked. Your per-app preferences are preserved."
              spacing="loose"
            >
              <Toggle
                checked={globalNotifications}
                onChange={(e) => {
                  setGlobalNotifications(e.target.checked);
                  success(e.target.checked ? 'Notifications enabled.' : 'Notifications disabled.');
                }}
              />
            </FormField>

            <FormField
              label="Notification sound"
              description="Play a sound for every notification."
              spacing="loose"
            >
              <Toggle
                checked={globalSound}
                onChange={(e) => {
                  setGlobalSound(e.target.checked);
                  success(
                    e.target.checked
                      ? 'Notification sound enabled.'
                      : 'Notification sound disabled.'
                  );
                }}
                disabled={!globalNotifications}
              />
            </FormField>
          </SectionCard.Content>
        </SectionCard>

        <SectionCard>
          <SectionCard.Header title="App notifications" />
          <SectionCard.Content>
            <VStack gap={3}>
              {APP_LIST.map(({ key, label, icon }) => {
                const state = appNotifications[key];
                const { notif, sound } = getStatusLabel(state);
                return (
                  <Disclosure
                    key={key}
                    className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden"
                  >
                    <Disclosure.Trigger className="w-full py-3 px-4 bg-[var(--color-surface-subtle)]">
                      <HStack align="center" className="w-full">
                        <HStack gap={2} align="center" className="flex-1 min-w-0">
                          <img src={icon} alt={label} className="w-5 h-5 object-cover shrink-0" />
                          <span className="text-label-md text-[var(--color-text-default)]">
                            {label}
                          </span>
                        </HStack>
                        <HStack gap={1} align="center" className="shrink-0">
                          <Badge variant={state.notification ? 'success' : 'default'} size="sm">
                            {notif}
                          </Badge>
                          {state.notification && (
                            <Badge variant={state.sound ? 'info' : 'default'} size="sm">
                              {sound}
                            </Badge>
                          )}
                        </HStack>
                      </HStack>
                    </Disclosure.Trigger>
                    <Disclosure.Panel className="px-4 py-3 border-t border-[var(--color-border-default)]">
                      <VStack gap={4}>
                        <FormField label="Notification" spacing="loose">
                          <Toggle
                            checked={state.notification}
                            onChange={(e) => updateApp(key, 'notification', e.target.checked)}
                            disabled={!globalNotifications}
                          />
                        </FormField>
                        <FormField label="Sound" spacing="loose">
                          <Toggle
                            checked={state.sound}
                            onChange={(e) => updateApp(key, 'sound', e.target.checked)}
                            disabled={!globalNotifications || !state.notification}
                          />
                        </FormField>
                      </VStack>
                    </Disclosure.Panel>
                  </Disclosure>
                );
              })}
            </VStack>
          </SectionCard.Content>
        </SectionCard>
      </VStack>
    </PageShell>
  );
}
