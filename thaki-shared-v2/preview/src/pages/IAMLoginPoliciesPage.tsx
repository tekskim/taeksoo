import { useState } from 'react';
import { Button } from '@shared/components/Button';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Toggle } from '@shared/components/Toggle';
import { Checkbox } from '@shared/components/Checkbox';
import { RadioGroup } from '@shared/components/RadioGroup';
import { NumberInput } from '@shared/components/Input';
import { FormField } from '@shared/components/FormField';
import { Dropdown } from '@shared/components/Dropdown';
import { Range } from '@shared/components/Range';
import { Title } from '@shared/components/Title';
import { IconRefresh } from '@tabler/icons-react';

export function IAMLoginPoliciesPage() {
  const [activeTab, setActiveTab] = useState('password-policy');

  const [minLength, setMinLength] = useState(8);
  const [maxLength, setMaxLength] = useState(64);
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireLowercase, setRequireLowercase] = useState(true);
  const [requireNumber, setRequireNumber] = useState(true);
  const [requireSpecial, setRequireSpecial] = useState(true);
  const [excludeUsername, setExcludeUsername] = useState(true);
  const [excludeEmail, setExcludeEmail] = useState(true);
  const [passwordExpirationEnabled, setPasswordExpirationEnabled] = useState(true);
  const [passwordExpirationDays, setPasswordExpirationDays] = useState(30);
  const [preventReuseEnabled, setPreventReuseEnabled] = useState(true);
  const [reuseHistoryCount, setReuseHistoryCount] = useState(3);
  const [reusePeriodDays, setReusePeriodDays] = useState(30);

  const [lockoutEnabled, setLockoutEnabled] = useState(true);
  const [lockoutType, setLockoutType] = useState('permanent_after_temporary');
  const [maxLoginFailures, setMaxLoginFailures] = useState(5);
  const [maxTemporaryLockouts, setMaxTemporaryLockouts] = useState(3);
  const [waitTimeStrategy, setWaitTimeStrategy] = useState('linear');
  const [waitIncrement, setWaitIncrement] = useState(10);
  const [maxWaitTime, setMaxWaitTime] = useState(60);
  const [failureResetTime, setFailureResetTime] = useState(12);

  const showTemporarySettings =
    lockoutType === 'temporary' || lockoutType === 'permanent_after_temporary';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center h-8">
        <Title title="Login policies" />
      </div>

      <Tabs
        activeTabId={activeTab}
        onChange={setActiveTab}
        variant="line"
        size="sm"
        contentClassName="pt-4"
      >
        <Tab id="password-policy" label="Password policy">
          <div className="flex flex-col gap-4">
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="px-4 pt-4 pb-4">
                <h3 className="text-[16px] font-semibold leading-24 text-text m-0">
                  Password policy
                </h3>
              </div>
              <div className="flex flex-col gap-0 px-4 pb-3">
                <div className="w-full h-px bg-border-subtle" />

                {/* Length */}
                <div className="py-6">
                  <span className="text-11 font-medium leading-16 text-text block mb-1">
                    Length <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span>
                  </span>
                  <span className="text-12 leading-18 text-text-muted block mb-2">
                    Defines the minimum length required for passwords.
                  </span>
                  <div className="flex items-center gap-3 w-fit">
                    <NumberInput
                      value={minLength}
                      onChange={setMinLength}
                      min={6}
                      max={maxLength}
                      step={1}
                      size="sm"
                      style={{ width: 80 }}
                    />
                    <Range
                      min={6}
                      max={128}
                      value={[minLength, maxLength]}
                      dual
                      onChange={(val) => {
                        if (Array.isArray(val)) {
                          setMinLength(val[0]);
                          setMaxLength(val[1]);
                        }
                      }}
                      width={220}
                    />
                    <NumberInput
                      value={maxLength}
                      onChange={setMaxLength}
                      min={minLength}
                      max={128}
                      step={1}
                      size="sm"
                      style={{ width: 80 }}
                    />
                  </div>
                  <span className="text-11 leading-16 text-text-muted mt-2 block">
                    6 - 128 / Maximum length must be greater than or equal to the minimum length.
                  </span>
                </div>

                <div className="w-full h-px bg-border-subtle" />

                {/* Requirements */}
                <div className="py-6">
                  <span className="text-11 font-medium leading-16 text-text block mb-1">
                    Requirements{' '}
                    <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span>
                  </span>
                  <span className="text-12 leading-18 text-text-muted block mb-3">
                    Specifies the character types that must be included in the password.
                  </span>
                  <div className="flex flex-col gap-2">
                    <Checkbox
                      label="Require at least one uppercase letter from the Latin alphabet (A-Z)"
                      checked={requireUppercase}
                      onChange={setRequireUppercase}
                    />
                    <Checkbox
                      label="Require at least one lowercase letter from the Latin alphabet (a-z)"
                      checked={requireLowercase}
                      onChange={setRequireLowercase}
                    />
                    <Checkbox
                      label="Require at least one number"
                      checked={requireNumber}
                      onChange={setRequireNumber}
                    />
                    <Checkbox
                      label="Require at least one special character ( ! @ # $ % ^ & * ( ) _ + - = [ ] { } | ' )"
                      checked={requireSpecial}
                      onChange={setRequireSpecial}
                    />
                  </div>
                </div>

                <div className="w-full h-px bg-border-subtle" />

                {/* Exclusion rules */}
                <div className="py-6">
                  <span className="text-11 font-medium leading-16 text-text block mb-1">
                    Exclusion rules{' '}
                    <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span>
                  </span>
                  <span className="text-12 leading-18 text-text-muted block mb-3">
                    Defines words or patterns that cannot be used in passwords.
                  </span>
                  <div className="flex flex-col gap-2">
                    <Checkbox
                      label="Exclude passwords containing the username"
                      checked={excludeUsername}
                      onChange={setExcludeUsername}
                    />
                    <Checkbox
                      label="Exclude passwords containing the email address"
                      checked={excludeEmail}
                      onChange={setExcludeEmail}
                    />
                  </div>
                </div>

                <div className="w-full h-px bg-border-subtle" />

                {/* Password expiration */}
                <div className="py-6">
                  <span className="text-11 font-medium leading-16 text-text block mb-1">
                    Password expiration{' '}
                    <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span>
                  </span>
                  <span className="text-12 leading-18 text-text-muted block mb-3">
                    Sets the validity period for passwords. After the specified duration, users are
                    required to create a new password.
                  </span>
                  <div className="flex flex-col gap-3">
                    <Toggle
                      checked={passwordExpirationEnabled}
                      onChange={(e) => setPasswordExpirationEnabled(e.target.checked)}
                      checkedLabel="On"
                      uncheckedLabel="Off"
                    />
                    <NumberInput
                      value={passwordExpirationDays}
                      onChange={setPasswordExpirationDays}
                      min={1}
                      max={1095}
                      step={1}
                      size="sm"
                      style={{ width: 80 }}
                      disabled={!passwordExpirationEnabled}
                      suffix="Days"
                    />
                  </div>
                  <span className="text-11 leading-16 text-text-muted mt-2 block">
                    1 - 1095 Days
                  </span>
                </div>

                <div className="w-full h-px bg-border-subtle" />

                {/* Prevent password reuse */}
                <div className="py-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-14 font-semibold leading-20 text-text">
                          Prevent password reuse{' '}
                          <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span>
                        </span>
                        <span className="text-12 leading-18 text-text-muted">
                          Prevents users from reusing previously used passwords.
                        </span>
                      </div>
                      <Toggle
                        checked={preventReuseEnabled}
                        onChange={(e) => setPreventReuseEnabled(e.target.checked)}
                        checkedLabel="On"
                        uncheckedLabel="Off"
                      />
                    </div>
                    <div className="flex flex-col gap-6">
                      <FormField label="By recent history" hint="1 - 24">
                        <NumberInput
                          value={reuseHistoryCount}
                          onChange={setReuseHistoryCount}
                          min={1}
                          max={24}
                          step={1}
                          size="sm"
                          style={{ width: 80 }}
                          disabled={!preventReuseEnabled}
                        />
                      </FormField>
                      <div>
                        <span className="text-11 font-medium leading-16 text-text block mb-2">
                          By recent period
                        </span>
                        <NumberInput
                          value={reusePeriodDays}
                          onChange={setReusePeriodDays}
                          min={1}
                          max={365}
                          step={1}
                          size="sm"
                          style={{ width: 80 }}
                          disabled={!preventReuseEnabled}
                          suffix="Days"
                        />
                        <span className="text-11 leading-16 text-text-muted mt-2 block">
                          1 - 365 Days
                        </span>
                      </div>
                    </div>
                  </div>
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

        <Tab id="lockout-policy" label="Account lockout policy">
          <div className="flex flex-col gap-4">
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="px-4 pt-4 pb-4">
                <h3 className="text-[16px] font-semibold leading-24 text-text m-0">
                  Account lockout policy
                </h3>
              </div>
              <div className="flex flex-col gap-0 px-4 pb-3">
                <div className="w-full h-px bg-border-subtle" />

                {/* Enable Toggle */}
                <div className="py-6">
                  <Toggle
                    checked={lockoutEnabled}
                    onChange={(e) => setLockoutEnabled(e.target.checked)}
                    checkedLabel="On"
                    uncheckedLabel="Off"
                  />
                </div>

                {lockoutEnabled && (
                  <>
                    <div className="w-full h-px bg-border-subtle" />

                    {/* Lockout Type */}
                    <div className="py-6">
                      <span className="text-11 font-medium leading-16 text-text block mb-1">
                        Lockout Type{' '}
                        <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span>
                      </span>
                      <span className="text-12 leading-18 text-text-muted block mb-2">
                        Choose how the account is locked after login failures.
                      </span>
                      <Dropdown.Select
                        value={lockoutType}
                        onChange={(val) => setLockoutType(String(val))}
                        placeholder="Select lockout type"
                        size="sm"
                      >
                        <Dropdown.Option value="temporary" label="Lockout temporarily" />
                        <Dropdown.Option value="permanent" label="Lockout permanently" />
                        <Dropdown.Option
                          value="permanent_after_temporary"
                          label="Lockout permanently after Temporary lockout"
                        />
                      </Dropdown.Select>
                    </div>

                    <div className="w-full h-px bg-border-subtle" />

                    {/* Max login failures */}
                    <div className="py-6">
                      <span className="text-11 font-medium leading-16 text-text block mb-1">
                        Max Login Failures{' '}
                        <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span>
                      </span>
                      <span className="text-12 leading-18 text-text-muted block mb-2">
                        The maximum number of failed login attempts allowed before the account is
                        locked.
                      </span>
                      <NumberInput
                        value={maxLoginFailures}
                        onChange={setMaxLoginFailures}
                        min={1}
                        max={100}
                        step={1}
                        size="sm"
                        style={{ width: 80 }}
                      />
                      <span className="text-11 leading-16 text-text-muted mt-2 block">1 - 100</span>
                    </div>

                    {lockoutType === 'permanent_after_temporary' && (
                      <>
                        <div className="w-full h-px bg-border-subtle" />
                        <div className="py-6">
                          <span className="text-11 font-medium leading-16 text-text block mb-1">
                            Maximum Temporary Lockouts{' '}
                            <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span>
                          </span>
                          <span className="text-12 leading-18 text-text-muted block mb-2">
                            The total number of temporary lockouts allowed before the account is
                            permanently locked.
                          </span>
                          <NumberInput
                            value={maxTemporaryLockouts}
                            onChange={setMaxTemporaryLockouts}
                            min={1}
                            max={100}
                            step={1}
                            size="sm"
                            style={{ width: 80 }}
                          />
                          <span className="text-11 leading-16 text-text-muted mt-2 block">
                            1 - 100
                          </span>
                        </div>
                      </>
                    )}

                    {showTemporarySettings && (
                      <>
                        <div className="w-full h-px bg-border-subtle" />

                        {/* Strategy to increase wait time */}
                        <div className="py-6">
                          <span className="text-11 font-medium leading-16 text-text block mb-1">
                            Strategy to increase wait time{' '}
                            <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span>
                          </span>
                          <span className="text-12 leading-18 text-text-muted block mb-3">
                            Defines how the wait time increases after repeated failed login
                            attempts.
                          </span>
                          <RadioGroup
                            name="wait-strategy"
                            options={[
                              { value: 'linear', label: 'Linear' },
                              { value: 'multiple', label: 'Multiple' },
                            ]}
                            selectedValue={waitTimeStrategy}
                            onChange={setWaitTimeStrategy}
                            direction="vertical"
                          />
                        </div>

                        <div className="w-full h-px bg-border-subtle" />

                        {/* Wait increment */}
                        <div className="py-6">
                          <span className="text-11 font-medium leading-16 text-text block mb-1">
                            Wait increment{' '}
                            <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span>
                          </span>
                          <span className="text-12 leading-18 text-text-muted block mb-2">
                            Amount of time added to the wait time for each additional failed login
                            attempt.
                          </span>
                          <NumberInput
                            value={waitIncrement}
                            onChange={setWaitIncrement}
                            min={1}
                            max={60}
                            step={1}
                            size="sm"
                            style={{ width: 80 }}
                            suffix="Minutes"
                          />
                          <span className="text-11 leading-16 text-text-muted mt-2 block">
                            1 - 60 Minutes
                          </span>
                        </div>

                        <div className="w-full h-px bg-border-subtle" />

                        {/* Max wait time */}
                        <div className="py-6">
                          <span className="text-11 font-medium leading-16 text-text block mb-1">
                            Max wait time{' '}
                            <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span>
                          </span>
                          <span className="text-12 leading-18 text-text-muted block mb-2">
                            The maximum time a user must wait before retrying, regardless of failure
                            count.
                          </span>
                          <NumberInput
                            value={maxWaitTime}
                            onChange={setMaxWaitTime}
                            min={1}
                            max={1440}
                            step={1}
                            size="sm"
                            style={{ width: 80 }}
                            suffix="Minutes"
                          />
                          <span className="text-11 leading-16 text-text-muted mt-2 block">
                            1 - 1440 Minutes
                          </span>
                        </div>

                        <div className="w-full h-px bg-border-subtle" />

                        {/* Failure reset time */}
                        <div className="py-6">
                          <span className="text-11 font-medium leading-16 text-text block mb-1">
                            Failure reset time{' '}
                            <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span>
                          </span>
                          <span className="text-12 leading-18 text-text-muted block mb-2">
                            Time after which the failed login attempt counter is reset.
                          </span>
                          <NumberInput
                            value={failureResetTime}
                            onChange={setFailureResetTime}
                            min={1}
                            max={72}
                            step={1}
                            size="sm"
                            style={{ width: 80 }}
                            suffix="Hours"
                          />
                          <span className="text-11 leading-16 text-text-muted mt-2 block">
                            1 - 72 Hours
                          </span>
                        </div>
                      </>
                    )}
                  </>
                )}

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
