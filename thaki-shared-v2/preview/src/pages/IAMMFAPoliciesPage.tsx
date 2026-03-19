import { useState } from 'react';
import { Button } from '@shared/components/Button';
import { Tabs, Tab } from '@shared/components/Tabs';
import { TabSelector } from '@shared/components/TabSelector';
import { Toggle } from '@shared/components/Toggle';
import { RadioButton } from '@shared/components/RadioButton';
import { Tooltip } from '@shared/components/Tooltip';
import { Input } from '@shared/components/Input';
import { FormField } from '@shared/components/FormField';
import { Badge } from '@shared/components/Badge';
import { Title } from '@shared/components/Title';
import { IconRefresh, IconDeviceMobile, IconInfoCircle } from '@tabler/icons-react';

export function IAMMFAPoliciesPage() {
  const [activeTab, setActiveTab] = useState('enforcement');
  const [mfaEnforcement, setMfaEnforcement] = useState('voluntary');
  const [activeMethodTab, setActiveMethodTab] = useState<'otp' | 'email'>('otp');
  const [otpEnabled, setOtpEnabled] = useState(true);
  const [lookAroundWindow, setLookAroundWindow] = useState('1');
  const [reusableToken, setReusableToken] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [codeValidityPeriod, setCodeValidityPeriod] = useState('300');
  const [resendCooldown, setResendCooldown] = useState('60');
  const [verificationTimeWindow, setVerificationTimeWindow] = useState('10');
  const [verificationMaxAttempts, setVerificationMaxAttempts] = useState('5');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center h-8">
        <Title title="MFA policies" />
      </div>

      <Tabs activeTabId={activeTab} onChange={setActiveTab} variant="line" size="sm">
        <Tab id="enforcement" label="MFA enforcement">
          <div className="flex flex-col gap-4 pt-4">
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 pt-4 pb-4">
                <h3 className="text-14 font-semibold leading-20 text-text m-0">MFA enforcement</h3>
              </div>
              <div className="flex flex-col px-4 pb-3">
                <div className="w-full h-px bg-border-subtle" />

                <div className="py-6">
                  <p className="text-12 leading-18 text-text-muted mb-3">
                    Choose whether to make Multi-Factor Authentication (MFA) mandatory for all users,
                    or let them enable it voluntarily.
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                      <RadioButton
                        name="mfa-enforcement"
                        value="voluntary"
                        checked={mfaEnforcement === 'voluntary'}
                        onChange={() => setMfaEnforcement('voluntary')}
                        label="Voluntary"
                      />
                      <Tooltip content="Users can choose whether to enable MFA for their accounts.">
                        <IconInfoCircle size={14} className="text-text-subtle" />
                      </Tooltip>
                    </div>
                    <RadioButton
                      name="mfa-enforcement"
                      value="required"
                      checked={mfaEnforcement === 'required'}
                      onChange={() => setMfaEnforcement('required')}
                      label="Required for all users"
                    />
                  </div>
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
                  <Button variant="secondary" appearance="outline" size="sm">Reload</Button>
                  <Button variant="primary" size="sm">Save</Button>
                </div>
              </div>
            </div>
          </div>
        </Tab>

        <Tab id="methods" label="MFA methods">
          <div className="flex flex-col gap-4 pt-4">
            <TabSelector
              options={[{ id: 'otp', label: 'OTP' }, { id: 'email', label: 'Email' }]}
              value={activeMethodTab}
              onChange={(id) => setActiveMethodTab(id as 'otp' | 'email')}
              variant="small"
            />

            {activeMethodTab === 'otp' && (
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 pt-4 pb-4">
                  <h3 className="text-14 font-semibold leading-20 text-text m-0">OTP policy</h3>
                </div>
                <div className="flex flex-col px-4 pb-3">
                  <div className="w-full h-px bg-border-subtle" />

                  <div className="py-6">
                    <FormField label="Enable OTP">
                      <Toggle
                        checked={otpEnabled}
                        onChange={() => setOtpEnabled(!otpEnabled)}
                        checkedLabel="On"
                        uncheckedLabel="Off"
                      />
                    </FormField>
                  </div>

                  <div className="w-full h-px bg-border-subtle" />

                  <div className="py-6">
                    <FormField
                      label="Look around window"
                      hint="Allows for slight time differences between the server and the user's device to prevent login failures. 1 is recommended."
                      required
                    >
                      <Input
                        value={lookAroundWindow}
                        onChange={(e) => setLookAroundWindow(e.target.value)}
                        filter={/[^0-9]/g}
                        size="sm"
                        style={{ width: 80 }}
                        disabled={!otpEnabled}
                      />
                    </FormField>
                  </div>

                  <div className="w-full h-px bg-border-subtle" />

                  <div className="py-6">
                    <FormField
                      label="Reusable token"
                      hint="For security, always keep this disabled. Enabling it may expose the system to replay attacks."
                    >
                      <Toggle
                        checked={reusableToken}
                        onChange={() => setReusableToken(!reusableToken)}
                        disabled={!otpEnabled}
                      />
                    </FormField>
                  </div>

                  <div className="w-full h-px bg-border-subtle" />

                  <div className="py-6">
                    <FormField
                      label="Supported applications"
                      hint="Recommended authenticator apps that support this policy."
                    >
                      <div className="flex gap-1.5">
                        <Badge theme="gry" size="sm" layout="left-icon" icon={<IconDeviceMobile size={12} stroke={1.5} />}>
                          Google auth
                        </Badge>
                        <Badge theme="gry" size="sm" layout="left-icon" icon={<IconDeviceMobile size={12} stroke={1.5} />}>
                          MS Auth
                        </Badge>
                      </div>
                    </FormField>
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
                    <Button variant="secondary" appearance="outline" size="sm">Reload</Button>
                    <Button variant="primary" size="sm">Save</Button>
                  </div>
                </div>
              </div>
            )}

            {activeMethodTab === 'email' && (
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 pt-4 pb-4">
                  <h3 className="text-14 font-semibold leading-20 text-text m-0">Email policy</h3>
                </div>
                <div className="flex flex-col px-4 pb-3">
                  <div className="w-full h-px bg-border-subtle" />

                  <div className="py-6">
                    <FormField label="Enable Email verification">
                      <Toggle
                        checked={emailEnabled}
                        onChange={() => setEmailEnabled(!emailEnabled)}
                        checkedLabel="On"
                        uncheckedLabel="Off"
                      />
                    </FormField>
                  </div>

                  <div className="w-full h-px bg-border-subtle" />

                  <div className="py-6">
                    <FormField
                      label="Code validity period"
                      hint="Set the time limit within which the user must enter the email code. 1-600 Seconds"
                      required
                    >
                      <div className="flex items-center gap-2 w-fit">
                        <Input
                          value={codeValidityPeriod}
                          onChange={(e) => setCodeValidityPeriod(e.target.value)}
                          filter={/[^0-9]/g}
                          size="sm"
                          style={{ width: 80 }}
                          disabled={!emailEnabled}
                        />
                        <span className="text-12 leading-18 text-text-muted">Seconds</span>
                      </div>
                    </FormField>
                  </div>

                  <div className="w-full h-px bg-border-subtle" />

                  <div className="py-6">
                    <FormField
                      label="Resend cooldown"
                      hint="The minimum time a user must wait before requesting a new authentication code. 1-120 Seconds"
                      required
                    >
                      <div className="flex items-center gap-2 w-fit">
                        <Input
                          value={resendCooldown}
                          onChange={(e) => setResendCooldown(e.target.value)}
                          filter={/[^0-9]/g}
                          size="sm"
                          style={{ width: 80 }}
                          disabled={!emailEnabled}
                        />
                        <span className="text-12 leading-18 text-text-muted">Seconds</span>
                      </div>
                    </FormField>
                  </div>

                  <div className="w-full h-px bg-border-subtle" />

                  <div className="py-6">
                    <div>
                      <span className="text-14 font-semibold leading-20 text-text block mb-1">
                        Verification attempts <span className="text-error">*</span>
                      </span>
                      <p className="text-12 leading-18 text-text-muted mb-3">
                        Protect user accounts from unusual activities by limiting the number of
                        verification attempts allowed within a time frame.
                      </p>
                      <div className="flex flex-col gap-4">
                        <FormField label="Time window" hint="1-60 Minutes" required>
                          <div className="flex items-center gap-2 w-fit">
                            <Input
                              value={verificationTimeWindow}
                              onChange={(e) => setVerificationTimeWindow(e.target.value)}
                              filter={/[^0-9]/g}
                              size="sm"
                              style={{ width: 80 }}
                              disabled={!emailEnabled}
                            />
                            <span className="text-12 leading-18 text-text-muted">Minutes</span>
                          </div>
                        </FormField>
                        <FormField label="Max attempts" hint="1-10 Times" required>
                          <div className="flex items-center gap-2 w-fit">
                            <Input
                              value={verificationMaxAttempts}
                              onChange={(e) => setVerificationMaxAttempts(e.target.value)}
                              filter={/[^0-9]/g}
                              size="sm"
                              style={{ width: 80 }}
                              disabled={!emailEnabled}
                            />
                            <span className="text-12 leading-18 text-text-muted">Times</span>
                          </div>
                        </FormField>
                      </div>
                    </div>
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
                    <Button variant="secondary" appearance="outline" size="sm">Reload</Button>
                    <Button variant="primary" size="sm">Save</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
