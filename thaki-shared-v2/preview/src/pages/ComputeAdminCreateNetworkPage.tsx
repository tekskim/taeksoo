import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@shared/components/Input';
import { NumberInput } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Toggle } from '@shared/components/Toggle';
import { ActionModal } from '@shared/components/ActionModal';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import { Stepper } from '@shared/components/Stepper';
import { Disclosure } from '@shared/components/Disclosure';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';

const STEP_IDS = ['basic', 'subnet'] as const;

export function ComputeAdminCreateNetworkPage() {
  const navigate = useNavigate();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [allComplete, setAllComplete] = useState(false);

  // Basic info
  const [networkName, setNetworkName] = useState('');
  const [description, setDescription] = useState('');
  const [adminState, setAdminState] = useState(true);
  const [portSecurity, setPortSecurity] = useState(true);
  const [mtu, setMtu] = useState<number>(1500);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Subnet
  const [createSubnet, setCreateSubnet] = useState(false);
  const [subnetName, setSubnetName] = useState('');
  const [cidr, setCidr] = useState('');
  const [gateway, setGateway] = useState(false);
  const [gatewayIp, setGatewayIp] = useState('');
  const [subnetAdvancedOpen, setSubnetAdvancedOpen] = useState(false);
  const [dhcp, setDhcp] = useState(true);
  const [allocationPools, setAllocationPools] = useState('');
  const [dns, setDns] = useState('');
  const [hostRoutes, setHostRoutes] = useState('');

  // Validation
  const [submitted, setSubmitted] = useState(false);
  const networkNameError = submitted && !networkName.trim() ? 'Please enter a network name.' : null;
  const cidrError = submitted && createSubnet && !cidr.trim() ? 'Please enter a CIDR.' : null;

  // Stepper -> FloatingCard sync
  const [stepStatuses, setStepStatuses] = useState<Record<string, FloatingCardStatus>>({
    basic: 'processing',
    subnet: 'default',
  });

  const validateBasicInfo = useCallback((): boolean => {
    setSubmitted(true);
    return !!networkName.trim();
  }, [networkName]);

  const handleStepChange = useCallback(
    ({ current }: { prev: string | number; current: string | number }) => {
      setStepStatuses((prev) => {
        const next = { ...prev };
        for (const id of STEP_IDS) {
          if (id === current) {
            next[id] = 'processing';
          } else if (prev[id] === 'processing') {
            next[id] = 'writing';
          }
        }
        return next;
      });
    },
    []
  );

  const handleAllComplete = useCallback(() => {
    setAllComplete(true);
    setStepStatuses((prev) => {
      const next = { ...prev };
      for (const id of STEP_IDS) next[id] = 'success';
      return next;
    });
  }, []);

  return (
    <CreateLayout
      title="Create network"
      sidebar={
        <FloatingCard
          summaryTitle="Summary"
          sections={[
            {
              items: [
                { label: 'Basic information', status: stepStatuses.basic },
                { label: 'Subnet', status: stepStatuses.subnet },
              ],
            },
          ]}
          onCancel={() => navigate('/compute-admin/networks')}
          onAction={() => {
            setConfirmOpen(true);
          }}
          actionEnabled={allComplete}
          cancelLabel="Cancel"
          actionLabel="Create"
        />
      }
    >
      <Stepper
        stepIds={STEP_IDS}
        defaultOpenedId="basic"
        onAllStepsCompleted={handleAllComplete}
        onStepChange={handleStepChange}
      >
        {[
          {
            id: 'basic' as const,
            label: 'Basic information',
            onComplete: validateBasicInfo,
            editUI: (
              <div className="flex flex-col gap-0">
                {/* Network name */}
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">
                      Network name <span className="text-error">*</span>
                    </span>
                    <Input
                      placeholder="Enter network name"
                      value={networkName}
                      onChange={(e) => {
                        setNetworkName(e.target.value);
                        setSubmitted(false);
                      }}
                      error={!!networkNameError}
                    />
                    {networkNameError && (
                      <span className="text-11 text-error">{networkNameError}</span>
                    )}
                    <span className="text-11 text-text-subtle">
                      Allowed: 1–128 characters, letters, numbers, &quot;-&quot;, &quot;_&quot;,
                      &quot;.&quot;, &quot;()&quot;, &quot;[]&quot;
                    </span>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                {/* Description */}
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">Description</span>
                    <Input
                      placeholder="Enter description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <span className="text-11 text-text-subtle">
                      You can use letters, numbers, and special characters (+=,.@-_()), and maximum
                      255 characters.
                    </span>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                {/* Advanced */}
                <div className="py-6">
                  <Disclosure
                    label="Advanced"
                    expanded={advancedOpen}
                    onExpandChange={setAdvancedOpen}
                  >
                    <div className="flex flex-col gap-6 pt-4">
                      {/* Admin state */}
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-13 font-medium text-text">Admin state</span>
                          <span className="text-12 text-text-muted">
                            Indicates whether the network&apos;s administrative state is Up or Down.
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Toggle
                            checked={adminState}
                            onChange={(e) => setAdminState(e.target.checked)}
                          />
                          <span className="text-12 text-text">{adminState ? 'Up' : 'Down'}</span>
                        </div>
                      </div>

                      {/* Port security */}
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-13 font-medium text-text">Port security</span>
                          <span className="text-12 text-text-muted">
                            Enhances security by allowing only permitted devices to access this
                            network. It is recommended to keep this enabled in most cases.
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Toggle
                            checked={portSecurity}
                            onChange={(e) => setPortSecurity(e.target.checked)}
                          />
                          <span className="text-12 text-text">{portSecurity ? 'On' : 'Off'}</span>
                        </div>
                      </div>

                      {/* MTU */}
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-13 font-medium text-text">MTU</span>
                          <span className="text-12 text-text-muted">
                            Specifies the MTU value used by the network.
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <NumberInput
                            value={mtu}
                            onChange={(v) => setMtu(v)}
                            min={68}
                            max={65535}
                            size="sm"
                            suffix="bytes"
                          />
                        </div>
                        <span className="text-11 text-text-subtle">68 - 65535 bytes</span>
                      </div>
                    </div>
                  </Disclosure>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Network name</span>
                  <span className="text-12 text-text">{networkName || '-'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Admin state</span>
                  <span className="text-12 text-text">{adminState ? 'Up' : 'Down'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Port security</span>
                  <span className="text-12 text-text">{portSecurity ? 'On' : 'Off'}</span>
                </div>
                {mtu && (
                  <>
                    <div className="h-px w-full bg-border-muted" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">MTU</span>
                      <span className="text-12 text-text">{mtu} bytes</span>
                    </div>
                  </>
                )}
                {description && (
                  <>
                    <div className="h-px w-full bg-border-muted" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">Description</span>
                      <span className="text-12 text-text">{description}</span>
                    </div>
                  </>
                )}
              </div>
            ),
          },
          {
            id: 'subnet' as const,
            label: 'Subnet',
            skippable: true,
            editUI: (
              <div className="flex flex-col gap-0">
                {/* Create subnet */}
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <span className="text-13 font-medium text-text">Create subnet</span>
                    <div className="flex items-center gap-2">
                      <Toggle
                        checked={createSubnet}
                        onChange={(e) => setCreateSubnet(e.target.checked)}
                      />
                      <span className="text-12 text-text">{createSubnet ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                {createSubnet && (
                  <>
                    <div className="w-full h-px bg-border-muted" />

                    {/* Subnet name */}
                    <div className="py-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-13 font-medium text-text">
                          Subnet name <span className="text-error">*</span>
                        </span>
                        <Input
                          placeholder="e.g. private-net-subnet-001"
                          value={subnetName}
                          onChange={(e) => setSubnetName(e.target.value)}
                        />
                        <span className="text-11 text-text-subtle">
                          You can use letters, numbers, and special characters (+=,.@-_), and the
                          length must be between 2-128 characters.
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-px bg-border-muted" />

                    {/* CIDR */}
                    <div className="py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-13 font-medium text-text">
                            CIDR <span className="text-error">*</span>
                          </span>
                          <span className="text-12 text-text-muted">
                            Defines the network address (CIDR) for the subnet.
                          </span>
                        </div>
                        <Input
                          placeholder="e.g. 192.168.0.0/24"
                          value={cidr}
                          onChange={(e) => {
                            setCidr(e.target.value);
                            setSubmitted(false);
                          }}
                          error={!!cidrError}
                        />
                        {cidrError && <span className="text-11 text-error">{cidrError}</span>}
                      </div>
                    </div>

                    <div className="w-full h-px bg-border-muted" />

                    {/* Gateway */}
                    <div className="py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-13 font-medium text-text">
                            Gateway <span className="text-error">*</span>
                          </span>
                          <span className="text-12 text-text-muted">
                            Specifies the gateway IP address for the subnet. Gateway must be an IP
                            address within the subnet range, excluding the network and broadcast
                            addresses.
                          </span>
                        </div>
                        <div className="flex flex-col gap-3 pt-1">
                          <div className="flex items-center gap-2">
                            <Toggle
                              checked={gateway}
                              onChange={(e) => setGateway(e.target.checked)}
                            />
                            <span className="text-12 text-text">{gateway ? 'On' : 'Off'}</span>
                          </div>
                          {gateway && (
                            <Input
                              placeholder="e.g. 192.168.0.1"
                              value={gatewayIp}
                              onChange={(e) => setGatewayIp(e.target.value)}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-px bg-border-muted" />

                    {/* Subnet Advanced */}
                    <div className="py-6">
                      <Disclosure
                        label="Advanced"
                        expanded={subnetAdvancedOpen}
                        onExpandChange={setSubnetAdvancedOpen}
                      >
                        <div className="flex flex-col gap-6 pt-4">
                          {/* DHCP */}
                          <div className="flex flex-col gap-3">
                            <span className="text-13 font-medium text-text">DHCP</span>
                            <div className="flex items-center gap-2">
                              <Toggle checked={dhcp} onChange={(e) => setDhcp(e.target.checked)} />
                              <span className="text-12 text-text">
                                {dhcp ? 'Enabled' : 'Disabled'}
                              </span>
                            </div>
                          </div>

                          {/* Allocation pools */}
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-13 font-medium text-text">
                                Allocation pools
                              </span>
                              <span className="text-12 text-text-muted">
                                Manually define the range of IP addresses to be automatically
                                allocated by DHCP. IPs outside this range will not be allocated,
                                which is useful for reserving static IPs.
                              </span>
                            </div>
                            <Textarea
                              placeholder="e.g. 192.168.0.100,192.168.0.200"
                              value={allocationPools}
                              onChange={(e) => setAllocationPools(e.target.value)}
                              rows={3}
                            />
                            <span className="text-11 text-text-subtle">
                              Enter one IP address allocation range per line.
                            </span>
                          </div>

                          {/* DNS */}
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-13 font-medium text-text">DNS</span>
                              <span className="text-12 text-text-muted">
                                The address of the server that acts like a phonebook for the
                                internet, translating domain names into IP addresses for your
                                instances.
                              </span>
                            </div>
                            <Textarea
                              placeholder="e.g. 10.10.0.0/24,192.168.0.254"
                              value={dns}
                              onChange={(e) => setDns(e.target.value)}
                              rows={3}
                            />
                            <span className="text-11 text-text-subtle">
                              Enter one DNS server address per line.
                            </span>
                          </div>

                          {/* Host routes */}
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-13 font-medium text-text">Host routes</span>
                              <span className="text-12 text-text-muted">
                                An advanced feature for manually specifying a route to a specific
                                network destination.
                              </span>
                            </div>
                            <Textarea
                              placeholder="e.g. 10.10.0.0/24,192.168.0.254"
                              value={hostRoutes}
                              onChange={(e) => setHostRoutes(e.target.value)}
                              rows={3}
                            />
                            <span className="text-11 text-text-subtle">
                              Enter the destination CIDR and the next hop IP address.
                            </span>
                          </div>
                        </div>
                      </Disclosure>
                    </div>
                  </>
                )}
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Create subnet</span>
                  <span className="text-12 text-text">{createSubnet ? 'Yes' : 'No'}</span>
                </div>
                {createSubnet && (
                  <>
                    {subnetName && (
                      <>
                        <div className="h-px w-full bg-border-muted" />
                        <div className="flex flex-col gap-1.5">
                          <span className="text-11 font-medium text-text-muted">Subnet name</span>
                          <span className="text-12 text-text">{subnetName}</span>
                        </div>
                      </>
                    )}
                    <div className="h-px w-full bg-border-muted" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">CIDR</span>
                      <span className="text-12 text-text">{cidr || '-'}</span>
                    </div>
                    <div className="h-px w-full bg-border-muted" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">Gateway</span>
                      <span className="text-12 text-text">
                        {gateway ? gatewayIp || 'Auto' : 'Off'}
                      </span>
                    </div>
                    <div className="h-px w-full bg-border-muted" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">DHCP</span>
                      <span className="text-12 text-text">{dhcp ? 'On' : 'Off'}</span>
                    </div>
                    <div className="h-px w-full bg-border-muted" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">Allocation pools</span>
                      <span className="text-12 text-text">{allocationPools || '-'}</span>
                    </div>
                    <div className="h-px w-full bg-border-muted" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">DNS</span>
                      <span className="text-12 text-text">{dns || '-'}</span>
                    </div>
                    <div className="h-px w-full bg-border-muted" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">Host routes</span>
                      <span className="text-12 text-text">{hostRoutes || '-'}</span>
                    </div>
                  </>
                )}
              </div>
            ),
          },
        ]}
      </Stepper>

      {confirmOpen && (
        <ActionModal
          appeared={confirmOpen}
          onConfirm={() => {
            setConfirmOpen(false);
            navigate('/compute-admin/networks');
          }}
          onCancel={() => setConfirmOpen(false)}
          actionConfig={{
            title: 'Create network',
            subtitle: 'This is UI-only. No actual network will be created.',
            actionButtonText: 'OK',
            actionButtonVariant: 'primary',
          }}
        />
      )}
    </CreateLayout>
  );
}
