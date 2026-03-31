import { useState } from 'react';
import { Button } from '@shared/components/Button';
import { Tabs, Tab } from '@shared/components/Tabs';
import { NumberInput } from '@shared/components/Input';
import { Title } from '@shared/components/Title';
import { IconRefresh } from '@tabler/icons-react';

function PolicyField({
  label,
  description,
  value,
  onChange,
  unit,
  helperText,
  min,
  max,
}: {
  label: string;
  description: string;
  value: number;
  onChange: (v: number) => void;
  unit: string;
  helperText: string;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <span className="text-[13px] font-medium leading-18 text-text">
          {label} <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span>
        </span>
        <span className="text-12 leading-18 text-text-muted">{description}</span>
      </div>
      <NumberInput
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={1}
        size="sm"
        style={{ width: 80 }}
        suffix={unit}
      />
      <span className="text-11 leading-16 text-text-muted">{helperText}</span>
    </div>
  );
}

export function IAMSessionPoliciesPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [sessionIdleTimeout, setSessionIdleTimeout] = useState(30);
  const [sessionMaxLifespan, setSessionMaxLifespan] = useState(8);
  const [loginTimeout, setLoginTimeout] = useState(30);
  const [loginActionTimeout, setLoginActionTimeout] = useState(5);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center h-8">
        <Title title="Session policies" />
      </div>

      <Tabs activeTabId={activeTab} onChange={setActiveTab} variant="line" size="sm">
        <Tab id="general" label="General policy">
          <div className="flex flex-col gap-4 pt-4">
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 pt-4 pb-4">
                <h3 className="text-14 font-semibold leading-20 text-text m-0">General policy</h3>
              </div>
              <div className="flex flex-col px-4 pb-3">
                <div className="w-full h-px bg-border-subtle" />

                <div className="py-6">
                  <PolicyField
                    label="Session idle timeout"
                    description="Defines how long a user session can remain idle before expiring."
                    value={sessionIdleTimeout}
                    onChange={setSessionIdleTimeout}
                    unit="Minutes"
                    helperText="15 - 60 Minutes"
                    min={15}
                    max={60}
                  />
                </div>

                <div className="w-full h-px bg-border-subtle" />

                <div className="py-6">
                  <PolicyField
                    label="Session max lifespan"
                    description="Defines the absolute maximum duration a session can remain active, regardless of user activity."
                    value={sessionMaxLifespan}
                    onChange={setSessionMaxLifespan}
                    unit="Hours"
                    helperText="1 - 24 Hours"
                    min={1}
                    max={24}
                  />
                </div>

                <div className="w-full h-px bg-border-subtle" />

                <div className="py-6">
                  <PolicyField
                    label="Login timeout"
                    description="Defines the maximum time allowed for a login request to complete."
                    value={loginTimeout}
                    onChange={setLoginTimeout}
                    unit="Minutes"
                    helperText="1 - 60 Minutes"
                    min={1}
                    max={60}
                  />
                </div>

                <div className="w-full h-px bg-border-subtle" />

                <div className="py-6">
                  <PolicyField
                    label="Login action timeout"
                    description="Defines how long additional authentication steps during login remain valid."
                    value={loginActionTimeout}
                    onChange={setLoginActionTimeout}
                    unit="Minutes"
                    helperText="1 - 10 Minutes"
                    min={1}
                    max={10}
                  />
                </div>

                <div className="w-full h-px bg-border-subtle" />

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    className="text-primary text-12 leading-18 bg-transparent border-none cursor-pointer p-0 hover:underline flex items-center gap-1.5 mr-4"
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
