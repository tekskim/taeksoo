import { useState } from 'react';
import { Button } from '@shared/components/Button';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Toggle } from '@shared/components/Toggle';
import { Checkbox } from '@shared/components/Checkbox';
import { RadioGroup } from '@shared/components/RadioGroup';
import { Input } from '@shared/components/Input';
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
  const [passwordExpirationDays, setPasswordExpirationDays] = useState('30');
  const [preventReuseEnabled, setPreventReuseEnabled] = useState(true);
  const [reuseHistoryCount, setReuseHistoryCount] = useState('3');
  const [reusePeriodDays, setReusePeriodDays] = useState('30');

  const [lockoutEnabled, setLockoutEnabled] = useState(true);
  const [lockoutType, setLockoutType] = useState('permanent_after_temporary');
  const [maxLoginFailures, setMaxLoginFailures] = useState('5');
  const [maxTemporaryLockouts, setMaxTemporaryLockouts] = useState('3');
  const [waitTimeStrategy, setWaitTimeStrategy] = useState('linear');
  const [waitIncrement, setWaitIncrement] = useState('10');
  const [maxWaitTime, setMaxWaitTime] = useState('60');
  const [failureResetTime, setFailureResetTime] = useState('12');

  const showTemporarySettings = lockoutType === 'temporary' || lockoutType === 'permanent_after_temporary';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center h-8">
        <Title title="Login policies" />
      </div>

      <Tabs activeTabId={activeTab} onChange={setActiveTab} variant="line" size="sm" contentClassName="pt-4">
        <Tab id="password-policy" label="Password policy">
          <div className="flex flex-col gap-4">
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 pt-4">
                <h3 className="text-14 font-semibold leading-20 text-text m-0">Password policy</h3>
              </div>
              <div className="flex flex-col gap-0 px-4 pb-4">
                <div className="w-full h-px bg-border-subtle" />

                {/* Length */}
                <div className="py-6">
                  <span className="text-11 font-medium leading-16 text-text block mb-1">Length <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span></span>
                  <span className="text-11 leading-16 text-text-muted block mb-3">Defines the minimum length required for passwords.</span>
                  <div className="flex items-center gap-3 w-fit">
                    <Input value={String(minLength)} onChange={(e) => setMinLength(Number(e.target.value) || 0)} filter={/[^0-9]/g} size="sm" style={{ width: 60 }} />
                    <Range min={6} max={128} value={[minLength, maxLength]} dual onChange={(val) => { if (Array.isArray(val)) { setMinLength(val[0]); setMaxLength(val[1]); } }} width={220} />
                    <Input value={String(maxLength)} onChange={(e) => setMaxLength(Number(e.target.value) || 0)} filter={/[^0-9]/g} size="sm" style={{ width: 60 }} />
                  </div>
                  <span className="text-11 leading-16 text-text-muted mt-2 block">6 - 128 / Maximum length must be greater than or equal to the minimum length.</span>
                </div>

                <div className="w-full h-px bg-border-subtle" />

                {/* Requirements */}
                <div className="py-6">
                  <span className="text-11 font-medium leading-16 text-text block mb-1">Requirements <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span></span>
                  <span className="text-11 leading-16 text-text-muted block mb-3">Specifies the character types that must be included in the password.</span>
                  <div className="flex flex-col gap-2">
                    <Checkbox label="Require at least one uppercase letter from the Latin alphabet (A-Z)" checked={requireUppercase} onChange={setRequireUppercase} />
                    <Checkbox label="Require at least one lowercase letter from the Latin alphabet (a-z)" checked={requireLowercase} onChange={setRequireLowercase} />
                    <Checkbox label="Require at least one number" checked={requireNumber} onChange={setRequireNumber} />
                    <Checkbox label="Require at least one special character ( ! @ # $ % ^ & * ( ) _ + - = [ ] { } | ' )" checked={requireSpecial} onChange={setRequireSpecial} />
                  </div>
                </div>

                <div className="w-full h-px bg-border-subtle" />

                {/* Exclusion rules */}
                <div className="py-6">
                  <span className="text-11 font-medium leading-16 text-text block mb-1">Exclusion rules <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span></span>
                  <span className="text-11 leading-16 text-text-muted block mb-3">Defines words or patterns that cannot be used in passwords.</span>
                  <div className="flex flex-col gap-2">
                    <Checkbox label="Exclude passwords containing the username" checked={excludeUsername} onChange={setExcludeUsername} />
                    <Checkbox label="Exclude passwords containing the email address" checked={excludeEmail} onChange={setExcludeEmail} />
                  </div>
                </div>

                <div className="w-full h-px bg-border-subtle" />

                {/* Password expiration */}
                <div className="py-6">
                  <span className="text-11 font-medium leading-16 text-text block mb-1">Password expiration <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span></span>
                  <span className="text-11 leading-16 text-text-muted block mb-3">Sets the validity period for passwords. After the specified duration, users are required to create a new password.</span>
                  <div className="flex flex-col gap-3">
                    <Toggle checked={passwordExpirationEnabled} onChange={(e) => setPasswordExpirationEnabled(e.target.checked)} checkedLabel="On" uncheckedLabel="Off" />
                    <div className="flex items-center gap-2">
                      <Input value={passwordExpirationDays} onChange={(e) => setPasswordExpirationDays(e.target.value)} filter={/[^0-9]/g} size="sm" style={{ width: 80 }} disabled={!passwordExpirationEnabled} />
                      <span className="text-12 leading-18 text-text">Days</span>
                    </div>
                  </div>
                  <span className="text-11 leading-16 text-text-muted mt-2 block">1 - 1095 Days</span>
                </div>

                <div className="w-full h-px bg-border-subtle" />

                {/* Prevent password reuse */}
                <div className="py-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                      <div>
                        <span className="text-14 font-semibold leading-20 text-text block">Prevent password reuse <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span></span>
                        <p className="text-12 leading-18 text-text-muted mt-1">Prevents users from reusing previously used passwords.</p>
                      </div>
                      <Toggle checked={preventReuseEnabled} onChange={(e) => setPreventReuseEnabled(e.target.checked)} checkedLabel="On" uncheckedLabel="Off" />
                    </div>
                    <div className="flex flex-col gap-6">
                      <FormField label="By recent history" hint="1 - 24">
                        <Input value={reuseHistoryCount} onChange={(e) => setReuseHistoryCount(e.target.value)} filter={/[^0-9]/g} size="sm" style={{ width: 60 }} disabled={!preventReuseEnabled} />
                      </FormField>
                      <div>
                        <span className="text-11 font-medium leading-16 text-text block mb-1">By recent period</span>
                        <div className="flex items-center gap-2">
                          <Input value={reusePeriodDays} onChange={(e) => setReusePeriodDays(e.target.value)} filter={/[^0-9]/g} size="sm" style={{ width: 60 }} disabled={!preventReuseEnabled} />
                          <span className="text-12 leading-18 text-text">Days</span>
                        </div>
                        <span className="text-11 leading-16 text-text-muted mt-2 block">1 - 365 Days</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-border-subtle" />

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button type="button" className="flex items-center gap-1.5 text-primary text-12 font-medium leading-18 bg-transparent border-none cursor-pointer p-0 hover:underline mr-4">
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

        <Tab id="lockout-policy" label="Account lockout policy">
          <div className="flex flex-col gap-4">
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 pt-4">
                <h3 className="text-14 font-semibold leading-20 text-text m-0">Account lockout policy</h3>
              </div>
              <div className="flex flex-col gap-0 px-4 pb-4">
                <div className="w-full h-px bg-border-subtle" />

                {/* Enable Toggle */}
                <div className="py-6">
                  <Toggle checked={lockoutEnabled} onChange={(e) => setLockoutEnabled(e.target.checked)} checkedLabel="On" uncheckedLabel="Off" />
                </div>

                {lockoutEnabled && (
                  <>
                    <div className="w-full h-px bg-border-subtle" />

                    {/* Lockout Type */}
                    <div className="py-6">
                      <FormField label="Lockout Type" required>
                        <Dropdown.Select value={lockoutType} onChange={(val) => setLockoutType(String(val))} placeholder="Select lockout type" size="sm">
                          <Dropdown.Option value="temporary" label="Lockout temporarily" />
                          <Dropdown.Option value="permanent" label="Lockout permanently" />
                          <Dropdown.Option value="permanent_after_temporary" label="Lockout permanently after Temporary lockout" />
                        </Dropdown.Select>
                      </FormField>
                    </div>

                    <div className="w-full h-px bg-border-subtle" />

                    {/* Max login failures */}
                    <div className="py-6">
                      <FormField label="Max Login Failures" hint="1 - 100" required>
                        <Input value={maxLoginFailures} onChange={(e) => setMaxLoginFailures(e.target.value)} filter={/[^0-9]/g} size="sm" style={{ width: 80 }} />
                      </FormField>
                    </div>

                    {lockoutType === 'permanent_after_temporary' && (
                      <>
                        <div className="w-full h-px bg-border-subtle" />
                        <div className="py-6">
                          <FormField label="Maximum Temporary Lockouts" hint="1 - 100" required>
                            <Input value={maxTemporaryLockouts} onChange={(e) => setMaxTemporaryLockouts(e.target.value)} filter={/[^0-9]/g} size="sm" style={{ width: 80 }} />
                          </FormField>
                        </div>
                      </>
                    )}

                    {showTemporarySettings && (
                      <>
                        <div className="w-full h-px bg-border-subtle" />

                        {/* Strategy to increase wait time */}
                        <div className="py-6">
                          <FormField label="Strategy to increase wait time" required>
                            <RadioGroup
                              name="wait-strategy"
                              options={[
                                { value: 'linear', label: 'Linear' },
                                { value: 'multiple', label: 'Multiple' },
                              ]}
                              selectedValue={waitTimeStrategy}
                              onChange={setWaitTimeStrategy}
                              direction="horizontal"
                            />
                          </FormField>
                        </div>

                        <div className="w-full h-px bg-border-subtle" />

                        {/* Wait increment */}
                        <div className="py-6">
                          <span className="text-11 font-medium leading-16 text-text block mb-1">Wait increment <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span></span>
                          <span className="text-11 leading-16 text-text-muted block mb-3">Amount of time added to the wait time for each additional failed login attempt.</span>
                          <div className="flex items-center gap-2">
                            <Input value={waitIncrement} onChange={(e) => setWaitIncrement(e.target.value)} filter={/[^0-9]/g} size="sm" style={{ width: 80 }} />
                            <span className="text-12 leading-18 text-text">Minutes</span>
                          </div>
                          <span className="text-11 leading-16 text-text-muted mt-2 block">1 - 60 Minutes</span>
                        </div>

                        <div className="w-full h-px bg-border-subtle" />

                        {/* Max wait time */}
                        <div className="py-6">
                          <span className="text-11 font-medium leading-16 text-text block mb-1">Max wait time <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span></span>
                          <span className="text-11 leading-16 text-text-muted block mb-3">The maximum time a user must wait before retrying, regardless of failure count.</span>
                          <div className="flex items-center gap-2">
                            <Input value={maxWaitTime} onChange={(e) => setMaxWaitTime(e.target.value)} filter={/[^0-9]/g} size="sm" style={{ width: 80 }} />
                            <span className="text-12 leading-18 text-text">Minutes</span>
                          </div>
                          <span className="text-11 leading-16 text-text-muted mt-2 block">1 - 1440 Minutes</span>
                        </div>

                        <div className="w-full h-px bg-border-subtle" />

                        {/* Failure reset time */}
                        <div className="py-6">
                          <span className="text-11 font-medium leading-16 text-text block mb-1">Failure reset time <span className="text-[var(--semantic-color-danger,#ef4444)]">*</span></span>
                          <span className="text-11 leading-16 text-text-muted block mb-3">Time after which the failed login attempt counter is reset.</span>
                          <div className="flex items-center gap-2">
                            <Input value={failureResetTime} onChange={(e) => setFailureResetTime(e.target.value)} filter={/[^0-9]/g} size="sm" style={{ width: 80 }} />
                            <span className="text-12 leading-18 text-text">Hours</span>
                          </div>
                          <span className="text-11 leading-16 text-text-muted mt-2 block">1 - 72 Hours</span>
                        </div>
                      </>
                    )}
                  </>
                )}

                <div className="w-full h-px bg-border-subtle" />

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button type="button" className="flex items-center gap-1.5 text-primary text-12 font-medium leading-18 bg-transparent border-none cursor-pointer p-0 hover:underline mr-4">
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
