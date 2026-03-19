import { useState } from 'react';
import { Button } from '@shared/components/Button';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Input } from '@shared/components/Input';
import { Title } from '@shared/components/Title';
import { IconRefresh } from '@tabler/icons-react';

function PolicyField({
  label,
  description,
  value,
  onChange,
  unit,
  helperText,
}: {
  label: string;
  description: string;
  value: string;
  onChange: (v: string) => void;
  unit: string;
  helperText: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <span className="text-[13px] font-medium leading-18 text-text">
          {label} <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span>
        </span>
        <span className="text-12 leading-18 text-text-muted">{description}</span>
      </div>
      <div className="flex items-center gap-2 w-fit">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          filter={/[^0-9]/g}
          size="sm"
          style={{ width: 80 }}
        />
        <span className="text-12 leading-18 text-text">{unit}</span>
      </div>
      <span className="text-11 leading-16 text-text-muted">{helperText}</span>
    </div>
  );
}

export function IAMTokenPoliciesPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [accessTokenLifespan, setAccessTokenLifespan] = useState('10');
  const [refreshTokenLifespan, setRefreshTokenLifespan] = useState('7');

  return (
    <div className="flex flex-col gap-6">
      <Title title="Token policies" />

      <Tabs activeTabId={activeTab} onChange={setActiveTab} variant="line" size="sm">
        <Tab id="general" label="General policy">
          <div className="flex flex-col gap-4 pt-4">
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="text-14 font-semibold leading-20 text-text m-0">General policy</h3>
              </div>
              <div className="flex flex-col gap-6 p-4">
                <PolicyField
                  label="Access token lifespan"
                  description="Defines how long an access token remains valid before it needs to be renewed."
                  value={accessTokenLifespan}
                  onChange={setAccessTokenLifespan}
                  unit="Minutes"
                  helperText="5 - 15 Minutes"
                />
                <PolicyField
                  label="Refresh token lifespan"
                  description="Defines how long a user can stay signed in using a refresh token."
                  value={refreshTokenLifespan}
                  onChange={setRefreshTokenLifespan}
                  unit="Days"
                  helperText="1-30 Days"
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    className="text-primary text-12 leading-18 bg-transparent border-none cursor-pointer p-0 hover:underline flex items-center gap-1.5 mr-4"
                  >
                    <IconRefresh size={12} stroke={1.5} />
                    Reset to default
                  </button>
                  <Button variant="secondary" appearance="outline" size="sm">Reload</Button>
                  <Button variant="primary" size="sm">Save</Button>
                </div>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
