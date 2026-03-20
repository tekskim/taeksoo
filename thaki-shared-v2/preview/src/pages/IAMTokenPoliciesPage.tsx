import { useState } from 'react';
import { Button } from '@shared/components/Button';
import { Tabs, Tab } from '@shared/components/Tabs';
import { NumberInput } from '@shared/components/Input';
import { Title } from '@shared/components/Title';
import { IconRefresh } from '@tabler/icons-react';

export function IAMTokenPoliciesPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [accessTokenLifespan, setAccessTokenLifespan] = useState(10);
  const [refreshTokenLifespan, setRefreshTokenLifespan] = useState(7);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center h-8">
        <Title title="Token policies" />
      </div>

      <Tabs activeTabId={activeTab} onChange={setActiveTab} variant="line" size="sm">
        <Tab id="general" label="General policy">
          <div className="flex flex-col gap-4 pt-4">
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="px-4 pt-4 pb-4">
                <h3 className="text-[16px] font-semibold leading-24 text-text m-0">
                  General policy
                </h3>
              </div>
              <div className="flex flex-col gap-0 px-4 pb-3">
                <div className="w-full h-px bg-border-subtle" />

                {/* Access Token Lifespan */}
                <div className="py-6">
                  <span className="text-11 font-medium leading-16 text-text block mb-1">
                    Access token lifespan{' '}
                    <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span>
                  </span>
                  <span className="text-12 leading-18 text-text-muted block mb-2">
                    Defines how long an access token remains valid before it needs to be renewed.
                  </span>
                  <NumberInput
                    value={accessTokenLifespan}
                    onChange={setAccessTokenLifespan}
                    min={5}
                    max={15}
                    step={1}
                    size="sm"
                    style={{ width: 80 }}
                    suffix="Minutes"
                  />
                  <span className="text-11 leading-16 text-text-muted mt-2 block">
                    5 - 15 Minutes
                  </span>
                </div>

                <div className="w-full h-px bg-border-subtle" />

                {/* Refresh Token Lifespan */}
                <div className="py-6">
                  <span className="text-11 font-medium leading-16 text-text block mb-1">
                    Refresh token lifespan{' '}
                    <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span>
                  </span>
                  <span className="text-12 leading-18 text-text-muted block mb-2">
                    Defines how long a user can stay signed in using a refresh token.
                  </span>
                  <NumberInput
                    value={refreshTokenLifespan}
                    onChange={setRefreshTokenLifespan}
                    min={1}
                    max={30}
                    step={1}
                    size="sm"
                    style={{ width: 80 }}
                    suffix="Days"
                  />
                  <span className="text-11 leading-16 text-text-muted mt-2 block">1 - 30 Days</span>
                </div>

                <div className="w-full h-px bg-border-subtle" />

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-primary text-12 font-medium leading-18 bg-transparent border-none cursor-pointer p-0 hover:underline mr-4"
                  >
                    <IconRefresh size={12} stroke={1.5} />
                    Reset to default
                  </button>
                  <Button variant="secondary" appearance="outline" size="sm">
                    Reload
                  </Button>
                  <Button variant="primary" size="sm">
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
