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
// Curated IANA zones, sorted by standard (non-DST) offset ascending.
// Labels use the UTC standard offset notation (ISO 8601, two-digit HH:MM)
// and English IANA identifiers.
const timezoneOptions = [
  { value: 'Pacific/Honolulu', label: '(UTC-10:00) Pacific/Honolulu' },
  { value: 'America/Anchorage', label: '(UTC-09:00) America/Anchorage' },
  { value: 'America/Los_Angeles', label: '(UTC-08:00) America/Los_Angeles' },
  { value: 'America/Denver', label: '(UTC-07:00) America/Denver' },
  { value: 'America/Chicago', label: '(UTC-06:00) America/Chicago' },
  { value: 'America/New_York', label: '(UTC-05:00) America/New_York' },
  { value: 'America/Sao_Paulo', label: '(UTC-03:00) America/Sao_Paulo' },
  { value: 'UTC', label: '(UTC+00:00) UTC' },
  { value: 'Europe/London', label: '(UTC+00:00) Europe/London' },
  { value: 'Europe/Paris', label: '(UTC+01:00) Europe/Paris' },
  { value: 'Europe/Berlin', label: '(UTC+01:00) Europe/Berlin' },
  { value: 'Africa/Cairo', label: '(UTC+02:00) Africa/Cairo' },
  { value: 'Europe/Athens', label: '(UTC+02:00) Europe/Athens' },
  { value: 'Europe/Moscow', label: '(UTC+03:00) Europe/Moscow' },
  { value: 'Asia/Riyadh', label: '(UTC+03:00) Asia/Riyadh' },
  { value: 'Asia/Tehran', label: '(UTC+03:30) Asia/Tehran' },
  { value: 'Asia/Dubai', label: '(UTC+04:00) Asia/Dubai' },
  { value: 'Asia/Karachi', label: '(UTC+05:00) Asia/Karachi' },
  { value: 'Asia/Kolkata', label: '(UTC+05:30) Asia/Kolkata' },
  { value: 'Asia/Kathmandu', label: '(UTC+05:45) Asia/Kathmandu' },
  { value: 'Asia/Dhaka', label: '(UTC+06:00) Asia/Dhaka' },
  { value: 'Asia/Bangkok', label: '(UTC+07:00) Asia/Bangkok' },
  { value: 'Asia/Jakarta', label: '(UTC+07:00) Asia/Jakarta' },
  { value: 'Asia/Hong_Kong', label: '(UTC+08:00) Asia/Hong_Kong' },
  { value: 'Asia/Shanghai', label: '(UTC+08:00) Asia/Shanghai' },
  { value: 'Asia/Singapore', label: '(UTC+08:00) Asia/Singapore' },
  { value: 'Asia/Seoul', label: '(UTC+09:00) Asia/Seoul' },
  { value: 'Asia/Tokyo', label: '(UTC+09:00) Asia/Tokyo' },
  { value: 'Australia/Sydney', label: '(UTC+10:00) Australia/Sydney' },
  { value: 'Pacific/Auckland', label: '(UTC+12:00) Pacific/Auckland' },
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
          breadcrumb={<Breadcrumb items={[{ label: 'General' }]} />}
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
            </VStack>
          </SectionCard.Content>
        </SectionCard>
      </VStack>
    </PageShell>
  );
}
