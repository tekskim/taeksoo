import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title } from '@shared/components/Title';
import { FormField } from '@shared/components/FormField';
import { Input, NumberInput } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import { Fieldset } from '@shared/components/Fieldset';
import { Button } from '@shared/components/Button';
import { Toggle } from '@shared/components/Toggle';
import { RadioGroup } from '@shared/components/RadioGroup';
import { Checkbox } from '@shared/components/Checkbox';

const NETWORK_OPTIONS = [
  { value: '29tgj234', label: 'net-01 (10.0.0.0/24)' },
  { value: '38rhk345', label: 'net-02 (10.0.1.0/24)' },
  { value: '47sil456', label: 'net-03 (10.0.2.0/24)' },
];

const SUBNET_OPTIONS = [
  { value: '10.0.0.0/24', label: '10.0.0.0/24' },
  { value: '10.0.1.0/24', label: '10.0.1.0/24' },
];

const VIP_MODE_OPTIONS = [
  { value: 'auto', label: 'Auto-assign' },
  { value: 'manual', label: 'Manual' },
];

const CERT_OPTIONS = [
  { value: '29tgj234', label: 'sc-1' },
  { value: '38rhk345', label: 'sc-2' },
];

const CA_CERT_OPTIONS = [
  { value: '29tgj234', label: 'ca-1' },
  { value: '38rhk345', label: 'ca-2' },
];

const SNI_CERT_OPTIONS = [
  { value: 'sni-1', label: 'sni-cert-1' },
  { value: 'sni-2', label: 'sni-cert-2' },
];

const MEMBER_PORT_OPTIONS = [
  { value: 'port-001', label: 'port-web-01 — 10.63.0.46' },
  { value: 'port-002', label: 'port-ext-01 — 10.63.0.43' },
  { value: 'port-003', label: 'port-ext-02 — 10.63.0.31' },
];

export function ComputeCreateLoadBalancerPage() {
  const navigate = useNavigate();

  const [loadBalancerName, setLoadBalancerName] = useState('');
  const [description, setDescription] = useState('');
  const [provider, setProvider] = useState<'ovn' | 'amphora' | ''>('');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [subnet, setSubnet] = useState('');
  const [vipMode, setVipMode] = useState<'auto' | 'manual'>('auto');
  const [manualVip, setManualVip] = useState('');
  const [adminStateUp, setAdminStateUp] = useState(false);

  const [listenerName, setListenerName] = useState('listener-http-80');
  const [listenerDescription, setListenerDescription] = useState('');
  const [listenerProtocol, setListenerProtocol] = useState('');
  const [sslParsingMethod, setSslParsingMethod] = useState<'one-way' | 'two-way'>('one-way');
  const [selectedCertificate, setSelectedCertificate] = useState('');
  const [selectedCaCertificate, setSelectedCaCertificate] = useState('');
  const [sniEnabled, setSniEnabled] = useState(false);
  const [selectedSniCertificate, setSelectedSniCertificate] = useState('');
  const [protocolPort, setProtocolPort] = useState(80);
  const [connectionLimitType, setConnectionLimitType] = useState<'unlimited' | 'limited'>(
    'unlimited'
  );
  const [connectionLimitValue, setConnectionLimitValue] = useState<number | undefined>(undefined);
  const [listenerAdminState, setListenerAdminState] = useState(false);
  const [listenerAdvancedOpen, setListenerAdvancedOpen] = useState(false);
  const [customHeaders, setCustomHeaders] = useState('');
  const [clientDataTimeout, setClientDataTimeout] = useState(50000);
  const [memberConnectTimeout, setMemberConnectTimeout] = useState(5000);
  const [memberDataTimeout, setMemberDataTimeout] = useState(5000);
  const [tcpInspectTimeout, setTcpInspectTimeout] = useState(0);

  const [createPool, setCreatePool] = useState(true);
  const [poolName, setPoolName] = useState('pool-http');
  const [poolDescription, setPoolDescription] = useState('');
  const [poolAlgorithm, setPoolAlgorithm] = useState('ROUND_ROBIN');
  const [poolProtocol, setPoolProtocol] = useState('HTTP');
  const [poolAdminState, setPoolAdminState] = useState(false);
  const [poolAdvancedOpen, setPoolAdvancedOpen] = useState(true);
  const [sessionPersistence, setSessionPersistence] = useState<
    'none' | 'source_ip' | 'http_cookie' | 'app_cookie'
  >('none');
  const [cookieName, setCookieName] = useState('');

  const [memberPortId, setMemberPortId] = useState('__none__');
  const [externalMemberIp, setExternalMemberIp] = useState('');
  const [externalMemberPort, setExternalMemberPort] = useState<number | undefined>(undefined);
  const [externalMemberWeight, setExternalMemberWeight] = useState(1);

  const [createHealthMonitor, setCreateHealthMonitor] = useState(true);
  const [healthMonitorName, setHealthMonitorName] = useState('hm-pool-http');
  const [healthMonitorType, setHealthMonitorType] = useState('HTTP');
  const [healthMonitorInterval, setHealthMonitorInterval] = useState(5);
  const [healthMonitorTimeout, setHealthMonitorTimeout] = useState(3);
  const [healthMonitorMaxRetries, setHealthMonitorMaxRetries] = useState(3);
  const [healthMonitorAdminState, setHealthMonitorAdminState] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const listenerProtocolOptions = useMemo(() => {
    if (provider === 'ovn') {
      return [
        { value: 'TCP', label: 'TCP' },
        { value: 'UDP', label: 'UDP' },
      ];
    }
    return [
      { value: 'HTTP', label: 'HTTP' },
      { value: 'HTTPS', label: 'HTTPS' },
      { value: 'TCP', label: 'TCP' },
      { value: 'UDP', label: 'UDP' },
      { value: 'TERMINATED_HTTPS', label: 'TERMINATED_HTTPS' },
    ];
  }, [provider]);

  const poolProtocolOptions = useMemo(() => {
    if (provider === 'ovn') {
      if (listenerProtocol === 'TCP') return [{ value: 'TCP', label: 'TCP' }];
      if (listenerProtocol === 'UDP') return [{ value: 'UDP', label: 'UDP' }];
      return [
        { value: 'TCP', label: 'TCP' },
        { value: 'UDP', label: 'UDP' },
      ];
    }
    if (listenerProtocol === 'HTTP') return [{ value: 'HTTP', label: 'HTTP' }];
    if (listenerProtocol === 'HTTPS') {
      return [
        { value: 'HTTPS', label: 'HTTPS' },
        { value: 'TCP', label: 'TCP' },
      ];
    }
    if (listenerProtocol === 'TERMINATED_HTTPS') return [{ value: 'HTTP', label: 'HTTP' }];
    if (listenerProtocol === 'TCP') {
      return [
        { value: 'TCP', label: 'TCP' },
        { value: 'HTTP', label: 'HTTP' },
        { value: 'HTTPS', label: 'HTTPS' },
      ];
    }
    if (listenerProtocol === 'UDP') return [{ value: 'UDP', label: 'UDP' }];
    return [
      { value: 'HTTP', label: 'HTTP' },
      { value: 'HTTPS', label: 'HTTPS' },
      { value: 'TCP', label: 'TCP' },
      { value: 'UDP', label: 'UDP' },
    ];
  }, [provider, listenerProtocol]);

  const healthMonitorTypeOptions = useMemo(() => {
    if (provider === 'ovn') {
      if (listenerProtocol === 'TCP') return [{ value: 'TCP', label: 'TCP' }];
      if (listenerProtocol === 'UDP') {
        return [
          { value: 'TCP', label: 'TCP' },
          { value: 'UDP-CONNECT', label: 'UDP-CONNECT' },
        ];
      }
      return [{ value: 'TCP', label: 'TCP' }];
    }
    if (listenerProtocol === 'HTTP' || listenerProtocol === 'TERMINATED_HTTPS') {
      return [
        { value: 'HTTP', label: 'HTTP' },
        { value: 'HTTPS', label: 'HTTPS' },
        { value: 'PING', label: 'PING' },
        { value: 'TCP', label: 'TCP' },
        { value: 'TLS-HELLO', label: 'TLS-HELLO' },
      ];
    }
    if (listenerProtocol === 'HTTPS') {
      return [
        { value: 'HTTPS', label: 'HTTPS' },
        { value: 'HTTP', label: 'HTTP' },
        { value: 'PING', label: 'PING' },
        { value: 'TCP', label: 'TCP' },
        { value: 'TLS-HELLO', label: 'TLS-HELLO' },
      ];
    }
    if (listenerProtocol === 'TCP') {
      return [
        { value: 'TCP', label: 'TCP' },
        { value: 'HTTP', label: 'HTTP' },
        { value: 'HTTPS', label: 'HTTPS' },
        { value: 'PING', label: 'PING' },
        { value: 'TLS-HELLO', label: 'TLS-HELLO' },
      ];
    }
    if (listenerProtocol === 'UDP') {
      return [
        { value: 'UDP-CONNECT', label: 'UDP-CONNECT' },
        { value: 'HTTP', label: 'HTTP' },
        { value: 'TCP', label: 'TCP' },
      ];
    }
    return [{ value: 'HTTP', label: 'HTTP' }];
  }, [provider, listenerProtocol]);

  const poolAlgorithmHelper = useMemo(() => {
    switch (poolAlgorithm) {
      case 'ROUND_ROBIN':
        return 'Round Robin: Each new connection request is assigned to the next server in order, ensuring even distribution. Best for short-lived HTTP connections.';
      case 'LEAST_CONNECTIONS':
        return 'Least Connections: Sends traffic to the server with the fewest active connections. Suitable for long-lived sessions.';
      case 'SOURCE_IP':
        return "Source IP: Uses client's source IP to maintain consistent routing to the same backend.";
      case 'SOURCE_IP_PORT':
        return 'Source IP Port: Routes traffic based on both client IP and source port to maintain consistent session mapping.';
      default:
        return '';
    }
  }, [poolAlgorithm]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!loadBalancerName.trim()) e.lbName = 'Please enter a load balancer name.';
    if (!provider) e.provider = 'Please select a provider.';
    if (!selectedNetwork) e.network = 'Please select an owned network.';
    if (!listenerName.trim()) e.listenerName = 'Please enter a listener name.';
    if (!listenerProtocol) e.listenerProtocol = 'Please select a listener protocol.';
    if (listenerProtocol === 'HTTP' && !selectedCertificate)
      e.cert = 'Please select a server certificate.';
    if (listenerProtocol === 'HTTP' && sslParsingMethod === 'two-way' && !selectedCaCertificate) {
      e.ca = 'Please select a CA certificate.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    navigate('/compute/load-balancers');
  };

  return (
    <div className="flex flex-col gap-6">
      <Title title="Create load balancer" />

      <div className="flex flex-col gap-6 max-w-[720px]">
        <Fieldset legend="Basic information" variant="bordered">
          <div className="flex flex-col gap-5">
            <FormField label="Load balancer name" required error={errors.lbName}>
              <Input
                placeholder="Enter Load balancer name"
                value={loadBalancerName}
                onChange={(e) => {
                  setLoadBalancerName(e.target.value);
                  setErrors((o) => ({ ...o, lbName: '' }));
                }}
              />
            </FormField>

            <FormField
              label="Load balancer description"
              hint="You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255 characters."
            >
              <Input
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormField>

            <FormField
              label="Provider"
              required
              error={errors.provider}
              description="Choose the provider to use for the load balancer."
            >
              <RadioGroup
                name="lb-provider"
                direction="vertical"
                options={[
                  { value: 'ovn', label: 'OVN' },
                  { value: 'amphora', label: 'Amphora' },
                ]}
                selectedValue={provider}
                onChange={(v) => {
                  setProvider(v as 'ovn' | 'amphora');
                  setListenerProtocol('');
                  setErrors((o) => ({ ...o, provider: '' }));
                }}
              />
            </FormField>

            <FormField
              label="Owned network"
              required
              error={errors.network}
              description="Select the network to attach the load balancer to."
            >
              <Dropdown.Select
                placeholder="Search networks by attributes"
                value={selectedNetwork}
                onChange={(v) => {
                  setSelectedNetwork(String(v));
                  setErrors((o) => ({ ...o, network: '' }));
                }}
              >
                {NETWORK_OPTIONS.map((o) => (
                  <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                ))}
              </Dropdown.Select>
            </FormField>

            <FormField
              label="VIP address"
              required
              description="Select the subnet for the VIP. You can assign an IP automatically or manually enter one within the subnet range."
            >
              <div>
                <div className="flex flex-wrap items-end gap-3 rounded-md border border-border px-4 py-3">
                  <FormField label="Subnet">
                    <Dropdown.Select
                      placeholder="Select"
                      value={subnet}
                      onChange={(v) => setSubnet(String(v))}
                    >
                      {SUBNET_OPTIONS.map((o) => (
                        <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                      ))}
                    </Dropdown.Select>
                  </FormField>
                  <FormField label="VIP">
                    <Dropdown.Select
                      value={vipMode}
                      onChange={(v) => setVipMode(v as 'auto' | 'manual')}
                    >
                      {VIP_MODE_OPTIONS.map((o) => (
                        <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                      ))}
                    </Dropdown.Select>
                  </FormField>
                  {vipMode === 'manual' && (
                    <Input
                      placeholder="Enter VIP address"
                      value={manualVip}
                      onChange={(e) => setManualVip(e.target.value)}
                      className="max-w-[240px]"
                    />
                  )}
                  <span className="text-11 text-text-muted pb-2">10.62.0.31 - 10.62.0.77</span>
                </div>
              </div>
            </FormField>

            <FormField
              label="Load balancer admin state"
              description="Set the administrative state of the load balancer. 'UP' enables traffic handling, while 'DOWN' disables it."
            >
              <Toggle
                checked={adminStateUp}
                onChange={(e) => setAdminStateUp(e.target.checked)}
                checkedLabel="Up"
                uncheckedLabel="Down"
              />
            </FormField>
          </div>
        </Fieldset>

        <Fieldset legend="Listener" variant="bordered">
          <div className="flex flex-col gap-5">
            <FormField
              label="Listener name"
              required
              error={errors.listenerName}
              hint="You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters."
            >
              <Input
                placeholder="Enter listener name"
                value={listenerName}
                onChange={(e) => {
                  setListenerName(e.target.value);
                  setErrors((o) => ({ ...o, listenerName: '' }));
                }}
              />
            </FormField>

            <FormField
              label="Listener description"
              hint="You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255 characters."
            >
              <Input
                placeholder="Enter description"
                value={listenerDescription}
                onChange={(e) => setListenerDescription(e.target.value)}
              />
            </FormField>

            <FormField
              label="Listener protocol"
              required
              error={errors.listenerProtocol}
              description="Select the protocol used to handle client requests."
            >
              <Dropdown.Select
                placeholder="Select a protocol"
                value={listenerProtocol}
                onChange={(v) => {
                  const p = String(v);
                  setListenerProtocol(p);
                  setErrors((o) => ({ ...o, listenerProtocol: '' }));
                  if (p === 'HTTP') {
                    setProtocolPort(80);
                    setPoolProtocol('HTTP');
                    setHealthMonitorType('HTTP');
                  } else if (p === 'HTTPS') {
                    setProtocolPort(443);
                    setPoolProtocol('HTTPS');
                    setHealthMonitorType('HTTPS');
                  } else if (p === 'TERMINATED_HTTPS') {
                    setProtocolPort(443);
                    setPoolProtocol('HTTP');
                    setHealthMonitorType('HTTP');
                  } else if (p === 'TCP') {
                    setProtocolPort(5000);
                    setPoolProtocol('TCP');
                    setHealthMonitorType('TCP');
                  } else if (p === 'UDP') {
                    setProtocolPort(53);
                    setPoolProtocol('UDP');
                    setHealthMonitorType(provider === 'ovn' ? 'TCP' : 'UDP-CONNECT');
                  }
                }}
              >
                {listenerProtocolOptions.map((o) => (
                  <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                ))}
              </Dropdown.Select>
            </FormField>

            {listenerProtocol === 'HTTP' && (
              <FormField
                label="SSL Parsing Method"
                required
                description="Defines how SSL information is parsed from incoming HTTPS requests."
              >
                <RadioGroup
                  name="ssl-parsing"
                  direction="vertical"
                  options={[
                    { value: 'one-way', label: 'One-way authentication' },
                    { value: 'two-way', label: 'Two-way authentication' },
                  ]}
                  selectedValue={sslParsingMethod}
                  onChange={(v) => setSslParsingMethod(v as typeof sslParsingMethod)}
                />
              </FormField>
            )}

            {listenerProtocol === 'HTTP' && (
              <FormField
                label="Server certificates"
                required
                error={errors.cert}
                description="Select a server certificate for the listener to handle HTTPS traffic."
              >
                <Dropdown.Select
                  placeholder="Search certificates by attributes"
                  value={selectedCertificate}
                  onChange={(v) => {
                    setSelectedCertificate(String(v));
                    setErrors((o) => ({ ...o, cert: '' }));
                  }}
                >
                  {CERT_OPTIONS.map((o) => (
                    <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                  ))}
                </Dropdown.Select>
              </FormField>
            )}

            {listenerProtocol === 'HTTP' && sslParsingMethod === 'two-way' && (
              <FormField
                label="CA certificates"
                required
                error={errors.ca}
                description="Select a CA certificate to validate client certificates."
              >
                <Dropdown.Select
                  placeholder="Search certificates by attributes"
                  value={selectedCaCertificate}
                  onChange={(v) => {
                    setSelectedCaCertificate(String(v));
                    setErrors((o) => ({ ...o, ca: '' }));
                  }}
                >
                  {CA_CERT_OPTIONS.map((o) => (
                    <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                  ))}
                </Dropdown.Select>
              </FormField>
            )}

            {listenerProtocol === 'HTTP' && (
              <FormField
                label="SNI"
                description="Server Name Indication for multiple certificates."
              >
                <div>
                  <Checkbox checked={sniEnabled} onChange={setSniEnabled}>
                    Enable SNI
                  </Checkbox>
                  {sniEnabled && (
                    <div className="mt-2">
                      <Dropdown.Select
                        placeholder="Search SNI certificates"
                        value={selectedSniCertificate}
                        onChange={(v) => setSelectedSniCertificate(String(v))}
                      >
                        {SNI_CERT_OPTIONS.map((o) => (
                          <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                        ))}
                      </Dropdown.Select>
                    </div>
                  )}
                </div>
              </FormField>
            )}

            <FormField label="Protocol port" required>
              <NumberInput
                min={1}
                max={65535}
                value={protocolPort}
                onChange={setProtocolPort}
                size="md"
              />
            </FormField>

            <FormField label="Connection limit" required>
              <div>
                <RadioGroup
                  name="conn-limit"
                  direction="vertical"
                  options={[
                    { value: 'unlimited', label: 'Unlimited' },
                    { value: 'limited', label: 'Limited' },
                  ]}
                  selectedValue={connectionLimitType}
                  onChange={(v) => setConnectionLimitType(v as typeof connectionLimitType)}
                />
                {connectionLimitType === 'limited' && (
                  <NumberInput
                    className="mt-2"
                    min={1}
                    value={connectionLimitValue ?? 1}
                    onChange={setConnectionLimitValue}
                    size="md"
                  />
                )}
              </div>
            </FormField>

            <FormField
              label="Listener admin state"
              description="Set the administrative state of the listener. 'UP' enables traffic handling, while 'DOWN' disables it."
            >
              <Toggle
                checked={listenerAdminState}
                onChange={(e) => setListenerAdminState(e.target.checked)}
                checkedLabel="Up"
                uncheckedLabel="Down"
              />
            </FormField>

            <div className="rounded-md border border-border bg-surface-muted px-4 py-3">
              <button
                type="button"
                className="text-13 font-medium text-text bg-transparent border-none cursor-pointer p-0"
                onClick={() => setListenerAdvancedOpen((o) => !o)}
              >
                Advanced
              </button>
              {listenerAdvancedOpen && (
                <div className="flex flex-col gap-4 mt-3">
                  <FormField label="Custom headers">
                    <Input
                      value={customHeaders}
                      onChange={(e) => setCustomHeaders(e.target.value)}
                    />
                  </FormField>
                  <FormField label="Client data timeout (ms)">
                    <NumberInput
                      value={clientDataTimeout}
                      onChange={setClientDataTimeout}
                      size="md"
                    />
                  </FormField>
                  <FormField label="Member connect timeout (ms)">
                    <NumberInput
                      value={memberConnectTimeout}
                      onChange={setMemberConnectTimeout}
                      size="md"
                    />
                  </FormField>
                  <FormField label="Member data timeout (ms)">
                    <NumberInput
                      value={memberDataTimeout}
                      onChange={setMemberDataTimeout}
                      size="md"
                    />
                  </FormField>
                  <FormField label="TCP Inspect Timeout (ms)">
                    <NumberInput
                      value={tcpInspectTimeout}
                      onChange={setTcpInspectTimeout}
                      size="md"
                    />
                  </FormField>
                </div>
              )}
            </div>
          </div>
        </Fieldset>

        <Fieldset legend="Pool" variant="bordered">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <span className="text-13 font-medium text-text">Create Pool</span>
              <Toggle
                checked={createPool}
                onChange={(e) => setCreatePool(e.target.checked)}
                checkedLabel="Yes"
                uncheckedLabel="No"
              />
            </div>

            {createPool && (
              <>
                <FormField
                  label="Pool name"
                  required
                  hint="You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters."
                >
                  <Input
                    placeholder="Enter pool name"
                    value={poolName}
                    onChange={(e) => setPoolName(e.target.value)}
                  />
                </FormField>

                <FormField
                  label="Pool description"
                  hint="You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255 characters."
                >
                  <Input
                    placeholder="Enter description"
                    value={poolDescription}
                    onChange={(e) => setPoolDescription(e.target.value)}
                  />
                </FormField>

                <FormField
                  label="Pool algorithm"
                  required
                  description="Select how incoming requests are distributed across backend members. The chosen algorithm determines how traffic is routed to each server."
                  hint={poolAlgorithmHelper}
                >
                  <Dropdown.Select
                    value={poolAlgorithm}
                    onChange={(v) => setPoolAlgorithm(String(v))}
                  >
                    <Dropdown.Option value="ROUND_ROBIN" label="Round robin" />
                    <Dropdown.Option value="LEAST_CONNECTIONS" label="Least connections" />
                    <Dropdown.Option value="SOURCE_IP" label="Source IP" />
                    <Dropdown.Option value="SOURCE_IP_PORT" label="Source IP Port" />
                  </Dropdown.Select>
                </FormField>

                <FormField
                  label="Pool protocol"
                  required
                  description="Select the protocol used to communicate with backend members. It must match or be compatible with the listener's protocol."
                >
                  <Dropdown.Select
                    value={poolProtocol}
                    onChange={(v) => setPoolProtocol(String(v))}
                  >
                    {poolProtocolOptions.map((o) => (
                      <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                    ))}
                  </Dropdown.Select>
                </FormField>

                <FormField
                  label="Pool admin state"
                  description="Set the administrative state of the pool. 'UP' enables traffic handling, while 'DOWN' disables it."
                >
                  <Toggle
                    checked={poolAdminState}
                    onChange={(e) => setPoolAdminState(e.target.checked)}
                    checkedLabel="Up"
                    uncheckedLabel="Down"
                  />
                </FormField>

                <div className="rounded-md border border-border bg-surface-muted px-4 py-3">
                  <button
                    type="button"
                    className="text-13 font-medium text-text bg-transparent border-none cursor-pointer p-0"
                    onClick={() => setPoolAdvancedOpen((o) => !o)}
                  >
                    Advanced
                  </button>
                  {poolAdvancedOpen && (
                    <div className="mt-3">
                      <FormField
                        label="Session persistence"
                        description="Select the protocol used to communicate with backend members. It must match or be compatible with the listener's protocol."
                      >
                        <div>
                          <RadioGroup
                            name="session-persist"
                            direction="vertical"
                            options={[
                              { value: 'none', label: 'None' },
                              { value: 'source_ip', label: 'Source IP' },
                              ...(poolProtocol === 'HTTP'
                                ? [
                                    { value: 'http_cookie', label: 'HTTP Cookie' },
                                    { value: 'app_cookie', label: 'App cookie' },
                                  ]
                                : []),
                            ]}
                            selectedValue={sessionPersistence}
                            onChange={(v) => setSessionPersistence(v as typeof sessionPersistence)}
                          />
                          {sessionPersistence === 'app_cookie' && (
                            <div className="mt-2 flex flex-col gap-1">
                              <Input
                                placeholder="Enter cookie name"
                                value={cookieName}
                                onChange={(e) => setCookieName(e.target.value)}
                              />
                              <span className="text-11 text-text-muted">
                                You can use letters, numbers, and special
                                characters(+.-_!#$%&apos;*^|~).
                              </span>
                            </div>
                          )}
                        </div>
                      </FormField>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </Fieldset>

        <Fieldset legend="Member" variant="bordered">
          <div className="flex flex-col gap-5">
            <FormField
              label="Ports"
              description="Select one of the IP addresses associated with the port to add as a member."
            >
              <Dropdown.Select
                placeholder="Search ports by attributes"
                value={memberPortId}
                onChange={(v) => setMemberPortId(String(v))}
              >
                {[
                  <Dropdown.Option key="__none__" value="__none__" label="—" />,
                  ...MEMBER_PORT_OPTIONS.map((o) => (
                    <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                  )),
                ]}
              </Dropdown.Select>
            </FormField>

            <div className="flex flex-col gap-2">
              <span className="text-13 font-medium text-text">External member</span>
              <div className="flex flex-wrap gap-3">
                <FormField label="IP address">
                  <Input
                    placeholder="e.g. 10.0.0.5"
                    value={externalMemberIp}
                    onChange={(e) => setExternalMemberIp(e.target.value)}
                  />
                </FormField>
                <FormField label="Port">
                  <NumberInput
                    value={externalMemberPort}
                    onChange={setExternalMemberPort}
                    size="md"
                  />
                </FormField>
                <FormField label="Weight">
                  <NumberInput
                    min={1}
                    value={externalMemberWeight}
                    onChange={setExternalMemberWeight}
                    size="md"
                  />
                </FormField>
              </div>
            </div>
          </div>
        </Fieldset>

        <Fieldset legend="Health monitor" variant="bordered">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <span className="text-13 font-medium text-text">Create Health Monitor</span>
              <Toggle
                checked={createHealthMonitor}
                onChange={(e) => setCreateHealthMonitor(e.target.checked)}
                checkedLabel="Yes"
                uncheckedLabel="No"
              />
            </div>

            {createHealthMonitor && (
              <>
                <FormField
                  label="Health monitor name"
                  hint="You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters."
                >
                  <Input
                    placeholder="Enter health monitor name"
                    value={healthMonitorName}
                    onChange={(e) => setHealthMonitorName(e.target.value)}
                  />
                </FormField>

                <FormField
                  label="Health monitor type"
                  required
                  description="Select the health check method used to monitor backend members."
                >
                  <Dropdown.Select
                    placeholder="Select type"
                    value={healthMonitorType}
                    onChange={(v) => setHealthMonitorType(String(v))}
                  >
                    {healthMonitorTypeOptions.map((o) => (
                      <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                    ))}
                  </Dropdown.Select>
                </FormField>

                <FormField
                  label="Interval (sec)"
                  required
                  description="Specifies the interval in seconds between health checks."
                  hint="1-3,600 Seconds"
                >
                  <NumberInput
                    min={1}
                    max={3600}
                    value={healthMonitorInterval}
                    onChange={setHealthMonitorInterval}
                    suffix="Seconds"
                    size="md"
                  />
                </FormField>

                <FormField
                  label="Timeout (sec)"
                  required
                  description="Specifies the timeout in seconds for health check responses."
                  hint="1-3,599 Seconds"
                >
                  <NumberInput
                    min={1}
                    max={3599}
                    value={healthMonitorTimeout}
                    onChange={setHealthMonitorTimeout}
                    suffix="Seconds"
                    size="md"
                  />
                </FormField>

                <FormField
                  label="Max retries"
                  required
                  description="Specifies the number of retries before marking the health check as failed."
                  hint="Only numbers are allowed, and the value must be between 3–10."
                >
                  <NumberInput
                    min={3}
                    max={10}
                    value={healthMonitorMaxRetries}
                    onChange={setHealthMonitorMaxRetries}
                    size="md"
                  />
                </FormField>

                <FormField
                  label="Health monitor admin state"
                  description="Set the administrative state of the health monitor. 'UP' enables traffic handling, while 'DOWN' disables it."
                >
                  <Toggle
                    checked={healthMonitorAdminState}
                    onChange={(e) => setHealthMonitorAdminState(e.target.checked)}
                    checkedLabel="Up"
                    uncheckedLabel="Down"
                  />
                </FormField>
              </>
            )}
          </div>
        </Fieldset>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          appearance="outline"
          variant="secondary"
          size="md"
          onClick={() => navigate('/compute/load-balancers')}
        >
          Cancel
        </Button>
        <Button variant="primary" size="md" onClick={handleCreate}>
          Create
        </Button>
      </div>
    </div>
  );
}
