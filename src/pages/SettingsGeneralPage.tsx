import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HStack,
  VStack,
  TabBar,
  SectionCard,
  Select,
  Toggle,
} from '@/design-system';
import { SettingsSidebar } from '@/components/SettingsSidebar';
import { useDarkMode } from '@/hooks/useDarkMode';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';

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
   Settings General Page
   ---------------------------------------- */

export default function SettingsGeneralPage() {
  const navigate = useNavigate();
  const { theme, setTheme, isDark } = useDarkMode();

  // General settings state
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('Asia/Seoul');
  const [useLocationTimezone, setUseLocationTimezone] = useState(false);

  // Handle theme change
  const handleThemeChange = (value: string) => {
    setTheme(value as 'light' | 'dark' | 'system');
  };

  // Handle window close
  const handleWindowClose = () => {
    navigate('/');
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[var(--color-surface-subtle)]">
      {/* Top Bar with Logo and Window controls */}
      <div className="relative flex items-center w-full h-[var(--tabbar-height)] bg-[var(--color-surface-default)] shrink-0 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-[var(--color-border-default)]">
        {/* Logo Area */}
        <div className="w-[200px] h-full px-3 flex items-center">
          <img 
            src={isDark ? ThakiLogoDark : ThakiLogoLight} 
            alt="THAKI Cloud" 
            className="h-4"
          />
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
                    General
                  </h1>
                  <p className="text-[12px] leading-[18px] text-[var(--color-text-muted)] mt-1">
                    Configure your display and localization preferences.
                  </p>
                </div>

                {/* Settings Card */}
                <SectionCard>
                  <SectionCard.Header title="Preferences" />
                  <SectionCard.Content gap={6}>
                    {/* Theme */}
                    <VStack gap={4}>
                      <VStack gap={2}>
                        <span className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
                          Theme
                        </span>
                        <p className="text-[12px] leading-4 text-[var(--color-text-subtle)]">
                          Choose your preferred color theme.
                        </p>
                      </VStack>
                      <Select
                        value={theme}
                        onChange={handleThemeChange}
                        options={themeOptions}
                        width="md"
                      />
                    </VStack>

                    {/* Divider */}
                    <div className="h-px w-full bg-[var(--color-border-subtle)]" />

                    {/* Language */}
                    <VStack gap={4}>
                      <VStack gap={2}>
                        <span className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
                          Language
                        </span>
                        <p className="text-[12px] leading-4 text-[var(--color-text-subtle)]">
                          Select your preferred language for the interface.
                        </p>
                      </VStack>
                      <Select
                        value={language}
                        onChange={setLanguage}
                        options={languageOptions}
                        width="md"
                      />
                    </VStack>

                    {/* Divider */}
                    <div className="h-px w-full bg-[var(--color-border-subtle)]" />

                    {/* Time Zone */}
                    <VStack gap={4}>
                      <VStack gap={2}>
                        <span className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
                          Time Zone
                        </span>
                        <p className="text-[12px] leading-4 text-[var(--color-text-subtle)]">
                          Select your time zone. This affects timestamps globally.
                        </p>
                      </VStack>
                      <Select
                        value={timezone}
                        onChange={setTimezone}
                        options={timezoneOptions}
                        width="md"
                        disabled={useLocationTimezone}
                      />
                      <HStack gap={2} align="center" className="mt-2">
                        <Toggle
                          checked={useLocationTimezone}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setUseLocationTimezone(checked);
                            if (checked) {
                              const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                              const matchingOption = timezoneOptions.find(opt => opt.value === detectedTimezone);
                              if (matchingOption) {
                                setTimezone(detectedTimezone);
                              }
                            }
                          }}
                          label="Set current time zone"
                        />
                      </HStack>
                      <p className="text-[11px] leading-4 text-[var(--color-text-subtle)]">
                        Automatically set time zone based on your location
                      </p>
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
