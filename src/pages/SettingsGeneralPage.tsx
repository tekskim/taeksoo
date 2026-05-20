import { useState } from 'react';
import {
  Breadcrumb,
  VStack,
  SectionCard,
  Select,
  Toggle,
  FormField,
  PageShell,
  TabBar,
  TopBar,
  useToast,
} from '@/design-system';
import { SettingsSidebar } from '@/components/SettingsSidebar';
import { useDarkMode } from '@/hooks/useDarkMode';

// Language options
const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'ko', label: 'Korean' },
];

// Theme options
const themeOptions = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

// Timezone options
const timezoneOptions = [
  { value: 'Pacific/Honolulu', label: '(GMT-10:00) Pacific/Honolulu' },
  { value: 'America/Los_Angeles', label: '(GMT-8:00) America/Los_Angeles' },
  { value: 'America/Denver', label: '(GMT-7:00) America/Denver' },
  { value: 'America/Chicago', label: '(GMT-6:00) America/Chicago' },
  { value: 'America/New_York', label: '(GMT-5:00) America/New_York' },
  { value: 'UTC', label: '(GMT+0:00) UTC' },
  { value: 'Europe/London', label: '(GMT+0:00) Europe/London' },
  { value: 'Europe/Paris', label: '(GMT+1:00) Europe/Paris' },
  { value: 'Asia/Dubai', label: '(GMT+4:00) Asia/Dubai' },
  { value: 'Asia/Singapore', label: '(GMT+8:00) Asia/Singapore' },
  { value: 'Asia/Tokyo', label: '(GMT+9:00) Asia/Tokyo' },
  { value: 'Asia/Seoul', label: '(GMT+9:00) Asia/Seoul' },
  { value: 'Australia/Sydney', label: '(GMT+10:00) Australia/Sydney' },
];

/* ----------------------------------------
   Settings General Page ---------------------------------------- */

export default function SettingsGeneralPage() {
  const { theme, setTheme } = useDarkMode();
  const { success } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;

  const [language, setLanguage] = useState(() => localStorage.getItem('tds-language') || 'en');
  const [timezone, setTimezone] = useState('Asia/Seoul');
  const [useLocationTimezone, setUseLocationTimezone] = useState(false);

  const handleThemeChange = (value: string) => {
    setTheme(value as 'light' | 'dark' | 'system');
    success('Theme updated successfully.');
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
          breadcrumb={<Breadcrumb items={[{ label: 'Settings' }, { label: 'General' }]} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={6}>
        {/* Header */}
        <div>
          <h1 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">General</h1>
        </div>

        {/* Settings Card */}
        <SectionCard>
          <SectionCard.Header title="Preferences" />
          <SectionCard.Content>
            <FormField label="Theme" description="Choose your preferred color theme.">
              <Select
                value={theme}
                onChange={handleThemeChange}
                options={themeOptions}
                width="md"
              />
            </FormField>

            <FormField
              label="Language"
              description="Select your preferred language for the interface."
            >
              <Select
                value={language}
                onChange={(val) => {
                  setLanguage(val);
                  localStorage.setItem('tds-language', val);
                  success('Language updated successfully.');
                }}
                options={languageOptions}
                width="md"
              />
            </FormField>

            <VStack gap={4}>
              <FormField
                label="Time Zone"
                description="Select your time zone. This affects timestamps globally."
              >
                <Select
                  value={timezone}
                  onChange={(val) => {
                    setTimezone(val);
                    success('Time zone updated successfully.');
                  }}
                  options={timezoneOptions}
                  width="md"
                  disabled={useLocationTimezone}
                />
              </FormField>
              <FormField
                label="Set current time zone"
                helperText="Automatically set time zone based on your location"
                spacing="loose"
              >
                <Toggle
                  checked={useLocationTimezone}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setUseLocationTimezone(checked);
                    if (checked) {
                      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                      const matchingOption = timezoneOptions.find(
                        (opt) => opt.value === detectedTimezone
                      );
                      if (matchingOption) {
                        setTimezone(detectedTimezone);
                      }
                    }
                    success(
                      checked
                        ? 'Location-based time zone enabled.'
                        : 'Location-based time zone disabled.'
                    );
                  }}
                />
              </FormField>
            </VStack>
          </SectionCard.Content>
        </SectionCard>
      </VStack>
    </PageShell>
  );
}
