import { useMemo, useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Dropdown } from '@shared/components/Dropdown';
import { ActionModal } from '@shared/components/ActionModal';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import { Stepper } from '@shared/components/Stepper';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';
import {
  CLOUD_BUILDER_SLUGS,
  getCloudBuilderListConfig,
  type CloudBuilderSlug,
} from '../data/consoleListConfig';

const DISCOVERY_STEP_IDS = ['endpoint', 'basic'] as const;
const SERVER_STEP_IDS = ['basic'] as const;

function isCloudBuilderSlug(v: string | undefined): v is CloudBuilderSlug {
  return !!v && (CLOUD_BUILDER_SLUGS as readonly string[]).includes(v);
}

export function CloudBuilderCreatePage() {
  const navigate = useNavigate();
  const params = useParams();
  const slug: CloudBuilderSlug = isCloudBuilderSlug(params.slug) ? params.slug : 'discovery';
  const config = useMemo(() => getCloudBuilderListConfig(slug), [slug]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [allComplete, setAllComplete] = useState(false);

  const isDiscovery = slug === 'discovery';
  const [endpoint, setEndpoint] = useState('');
  const [discoverySerial, setDiscoverySerial] = useState('SN2001');
  const [discoveryMacPrimary, setDiscoveryMacPrimary] = useState('00:1A:2B:3C:4D:5E');
  const [discoveryLocation, setDiscoveryLocation] = useState('R1-U18');
  const [discoveryMgmtIp, setDiscoveryMgmtIp] = useState('10.0.0.12');
  const [discoveryMemo, setDiscoveryMemo] = useState('');

  const isServerLike = slug === 'servers' || slug === 'severs0.7';
  const [serial, setSerial] = useState('');
  const [macPrimary, setMacPrimary] = useState('');
  const [location, setLocation] = useState('');
  const [nicPrimaryName, setNicPrimaryName] = useState('');
  const [role, setRole] = useState('');
  const [providerNetwork, setProviderNetwork] = useState('');
  const [domain, setDomain] = useState('');

  const [stepStatuses, setStepStatuses] = useState<Record<string, FloatingCardStatus>>(() => {
    if (slug === 'discovery') return { endpoint: 'processing', basic: 'default' };
    if (slug === 'servers' || slug === 'severs0.7') return { basic: 'processing' };
    return {} as Record<string, FloatingCardStatus>;
  });

  useEffect(() => {
    setAllComplete(false);
    if (slug === 'discovery') {
      setStepStatuses({ endpoint: 'processing', basic: 'default' });
    } else if (slug === 'servers' || slug === 'severs0.7') {
      setStepStatuses({ basic: 'processing' });
    } else {
      setStepStatuses({});
    }
  }, [slug]);

  const pageTitle = isDiscovery ? 'Register discovery' : `Create ${config.title}`;

  const isValidMac = (v: string) => /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/.test(v.trim());

  const isValidProviderNetwork = (v: string) => {
    const m = /^VLAN\s+(\d{1,4})\s*\/\s*(\d{1,3}(?:\.\d{1,3}){3})(?:\/(\d{1,2}))?$/.exec(v.trim());
    if (!m) return false;
    const vlan = Number(m[1]);
    if (!isFinite(vlan) || vlan < 1 || vlan > 4094) return false;
    return true;
  };

  const serverFormErrors = useMemo(() => {
    if (!isServerLike) return {};
    const errs: Record<string, string> = {};
    if (!serial.trim()) errs.serial = 'Serial Number is required.';
    if (!macPrimary.trim()) errs.macPrimary = 'MAC (Primary) is required.';
    else if (!isValidMac(macPrimary))
      errs.macPrimary = 'Invalid MAC format. e.g. 00:1A:2B:3C:4D:5E';
    if (!nicPrimaryName.trim()) errs.nicPrimaryName = 'NIC (Primary Name) is required.';
    if (!location.trim()) errs.location = 'Location is required.';
    if (!providerNetwork.trim()) errs.providerNetwork = 'Provider Network is required.';
    else if (!isValidProviderNetwork(providerNetwork))
      errs.providerNetwork = 'Invalid format. e.g. VLAN 120 / 10.0.20.12';
    if (!role) errs.role = 'Please select a role.';
    if (!domain) errs.domain = 'Please select a domain.';
    return errs;
  }, [domain, isServerLike, location, macPrimary, nicPrimaryName, providerNetwork, role, serial]);

  const canSubmitServerForm = isServerLike && Object.values(serverFormErrors).every((v) => !v);

  const roleOptions = [
    { value: 'controller', label: 'controller' },
    ...Array.from({ length: 24 }, (_, idx) => ({
      value: `compute${idx + 1}`,
      label: `compute${idx + 1}`,
    })),
    { value: 'master1', label: 'master1' },
    { value: 'master2', label: 'master2' },
    { value: 'master3', label: 'master3' },
    ...Array.from({ length: 24 }, (_, idx) => ({
      value: `worker${idx + 1}`,
      label: `worker${idx + 1}`,
    })),
    { value: 'ceph-mon', label: 'ceph-mon' },
    { value: 'ceph-mgr', label: 'ceph-mgr' },
    { value: 'ceph-mds', label: 'ceph-mds' },
    { value: 'ceph-osd', label: 'ceph-osd' },
  ];

  const domainOptions = [
    { value: 'thaki-prod', label: 'thaki-prod' },
    { value: 'thaki-stage', label: 'thaki-stage' },
    { value: 'thaki-dev', label: 'thaki-dev' },
    { value: 'thaki-lab', label: 'thaki-lab' },
  ];

  const fetchDiscoveryData = useCallback(() => {
    setDiscoverySerial('SN2001');
    setDiscoveryMacPrimary('00:1A:2B:3C:4D:5E');
    setDiscoveryLocation('R1-U18');
    setDiscoveryMgmtIp('10.0.0.12');
  }, []);

  const validateDiscoveryEndpoint = useCallback((): boolean => true, []);

  const validateDiscoveryBasic = useCallback((): boolean => {
    return !!(discoverySerial.trim() && discoveryMacPrimary.trim());
  }, [discoverySerial, discoveryMacPrimary]);

  const validateServerBasic = useCallback((): boolean => {
    setSubmitted(true);
    return canSubmitServerForm;
  }, [canSubmitServerForm]);

  const handleStepChange = useCallback(
    ({ current }: { prev: string | number; current: string | number }) => {
      const ids = isDiscovery ? DISCOVERY_STEP_IDS : isServerLike ? SERVER_STEP_IDS : [];
      if (!ids.length) return;
      setStepStatuses((prev) => {
        const next = { ...prev };
        for (const id of ids) {
          if (id === current) {
            next[id] = 'processing';
          } else if (prev[id] === 'processing') {
            next[id] = 'writing';
          }
        }
        return next;
      });
    },
    [isDiscovery, isServerLike]
  );

  const handleAllComplete = useCallback(() => {
    setAllComplete(true);
    setStepStatuses((prev) => {
      const next = { ...prev };
      if (isDiscovery) {
        for (const id of DISCOVERY_STEP_IDS) next[id] = 'success';
      } else if (isServerLike) {
        for (const id of SERVER_STEP_IDS) next[id] = 'success';
      }
      return next;
    });
  }, [isDiscovery, isServerLike]);

  const handleSubmit = () => {
    if (isDiscovery) {
      setConfirmOpen(true);
    } else if (isServerLike) {
      setSubmitted(true);
      if (!canSubmitServerForm) return;
      setConfirmOpen(true);
    }
  };

  const floatingSections = isDiscovery
    ? [
        {
          items: [
            { label: 'Endpoint', status: stepStatuses.endpoint },
            { label: 'Basic', status: stepStatuses.basic },
          ],
        },
      ]
    : isServerLike
      ? [
          {
            items: [{ label: 'Basic information', status: stepStatuses.basic }],
          },
        ]
      : [{ items: [{ label: 'Configuration' }] }];

  return (
    <CreateLayout
      title={pageTitle}
      sidebar={
        <FloatingCard
          summaryTitle="Summary"
          sections={floatingSections}
          onCancel={() => navigate(`/cloudbuilder/${slug}`)}
          onAction={isDiscovery || isServerLike ? handleSubmit : undefined}
          actionEnabled={allComplete}
          cancelLabel="Cancel"
          actionLabel="Create"
        />
      }
    >
      {isDiscovery ? (
        <Stepper
          stepIds={DISCOVERY_STEP_IDS}
          defaultOpenedId="endpoint"
          onAllStepsCompleted={handleAllComplete}
          onStepChange={handleStepChange}
        >
          {[
            {
              id: 'endpoint' as const,
              label: 'Endpoint',
              onComplete: validateDiscoveryEndpoint,
              editUI: (
                <div className="flex flex-col gap-3">
                  <span className="text-12 text-text-muted">
                    Enter an endpoint and click Fetch to populate Serial/MAC/IP/Location. (demo)
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        placeholder="e.g. http://discovery-agent.local:8080"
                        value={endpoint}
                        onChange={(e) => setEndpoint(e.target.value)}
                      />
                    </div>
                    <Button variant="primary" size="md" onClick={fetchDiscoveryData}>
                      Fetch
                    </Button>
                  </div>
                </div>
              ),
              doneUI: (
                <div className="flex flex-col gap-3 py-3">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-11 font-medium text-text-muted">Endpoint</span>
                    <span className="text-12 text-text">{endpoint.trim() || '-'}</span>
                  </div>
                </div>
              ),
            },
            {
              id: 'basic' as const,
              label: 'Basic',
              onComplete: validateDiscoveryBasic,
              editUI: (
                <div className="flex flex-col gap-0">
                  <div className="py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-12 font-medium text-text">
                          Serial <span className="text-error">*</span>
                        </span>
                        <span className="text-11 text-text-muted">
                          Identifier serial for on-site hardware
                        </span>
                      </div>
                      <Input
                        value={discoverySerial}
                        onChange={(e) => setDiscoverySerial(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="w-full h-px bg-border-muted" />

                  <div className="py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-12 font-medium text-text">
                          MAC (Primary) <span className="text-error">*</span>
                        </span>
                        <span className="text-11 text-text-muted">
                          Primary MAC (asset identification key)
                        </span>
                      </div>
                      <Input
                        value={discoveryMacPrimary}
                        onChange={(e) => setDiscoveryMacPrimary(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="w-full h-px bg-border-muted" />

                  <div className="py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-12 font-medium text-text">
                          Location <span className="text-error">*</span>
                        </span>
                        <span className="text-11 text-text-muted">Rack/Unit physical location</span>
                      </div>
                      <Input
                        value={discoveryLocation}
                        onChange={(e) => setDiscoveryLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="w-full h-px bg-border-muted" />

                  <div className="py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-12 font-medium text-text">Mgmt IP (Optional)</span>
                        <span className="text-11 text-text-muted">
                          Management IP (if available)
                        </span>
                      </div>
                      <Input
                        value={discoveryMgmtIp}
                        onChange={(e) => setDiscoveryMgmtIp(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="w-full h-px bg-border-muted" />

                  <div className="py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-12 font-medium text-text">Notes</span>
                        <span className="text-11 text-text-muted">Memo (optional)</span>
                      </div>
                      <Textarea
                        placeholder='e.g. "Source: LLDP discovery"'
                        value={discoveryMemo}
                        onChange={(e) => setDiscoveryMemo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ),
              doneUI: (
                <div className="flex flex-col gap-3 py-3">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-11 font-medium text-text-muted">Serial</span>
                    <span className="text-12 text-text">{discoverySerial}</span>
                  </div>
                  <div className="h-px w-full bg-border-muted" />
                  <div className="flex flex-col gap-1.5">
                    <span className="text-11 font-medium text-text-muted">MAC (Primary)</span>
                    <span className="text-12 text-text">{discoveryMacPrimary}</span>
                  </div>
                  <div className="h-px w-full bg-border-muted" />
                  <div className="flex flex-col gap-1.5">
                    <span className="text-11 font-medium text-text-muted">Location</span>
                    <span className="text-12 text-text">{discoveryLocation}</span>
                  </div>
                  <div className="h-px w-full bg-border-muted" />
                  <div className="flex flex-col gap-1.5">
                    <span className="text-11 font-medium text-text-muted">Mgmt IP</span>
                    <span className="text-12 text-text">{discoveryMgmtIp.trim() || '-'}</span>
                  </div>
                </div>
              ),
            },
          ]}
        </Stepper>
      ) : isServerLike ? (
        <Stepper
          stepIds={SERVER_STEP_IDS}
          defaultOpenedId="basic"
          onAllStepsCompleted={handleAllComplete}
          onStepChange={handleStepChange}
        >
          {[
            {
              id: 'basic' as const,
              label: 'Basic information',
              onComplete: validateServerBasic,
              editUI: (
                <div className="flex flex-col gap-0">
                  <div className="py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-12 font-medium text-text">
                          Serial number <span className="text-error">*</span>
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Input
                          placeholder="e.g. SN1234"
                          value={serial}
                          onChange={(e) => setSerial(e.target.value)}
                          error={submitted && !!serverFormErrors.serial}
                        />
                        {submitted && serverFormErrors.serial && (
                          <span className="text-11 text-error">{serverFormErrors.serial}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-px bg-border-muted" />

                  <div className="py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-12 font-medium text-text">
                          MAC (Primary) <span className="text-error">*</span>
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Input
                          placeholder="e.g. 00:1A:2B:3C:4D:5E"
                          value={macPrimary}
                          onChange={(e) => setMacPrimary(e.target.value)}
                          error={submitted && !!serverFormErrors.macPrimary}
                        />
                        {submitted && serverFormErrors.macPrimary && (
                          <span className="text-11 text-error">{serverFormErrors.macPrimary}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-px bg-border-muted" />

                  <div className="py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-12 font-medium text-text">
                          NIC (primary name) <span className="text-error">*</span>
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Input
                          placeholder="e.g. eno1"
                          value={nicPrimaryName}
                          onChange={(e) => setNicPrimaryName(e.target.value)}
                          error={submitted && !!serverFormErrors.nicPrimaryName}
                        />
                        {submitted && serverFormErrors.nicPrimaryName && (
                          <span className="text-11 text-error">
                            {serverFormErrors.nicPrimaryName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-px bg-border-muted" />

                  <div className="py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-12 font-medium text-text">
                          Location <span className="text-error">*</span>
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Input
                          placeholder="e.g. R1-U18"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          error={submitted && !!serverFormErrors.location}
                        />
                        {submitted && serverFormErrors.location && (
                          <span className="text-11 text-error">{serverFormErrors.location}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-px bg-border-muted" />

                  <div className="py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-12 font-medium text-text">
                          Provider network <span className="text-error">*</span>
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Input
                          placeholder="e.g. VLAN 120 / 10.0.20.12"
                          value={providerNetwork}
                          onChange={(e) => setProviderNetwork(e.target.value)}
                          error={submitted && !!serverFormErrors.providerNetwork}
                        />
                        {submitted && serverFormErrors.providerNetwork && (
                          <span className="text-11 text-error">
                            {serverFormErrors.providerNetwork}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-px bg-border-muted" />

                  <div className="py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-12 font-medium text-text">
                          Role <span className="text-error">*</span>
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Dropdown.Select
                          placeholder="Select role"
                          value={role}
                          onChange={(v) => setRole(String(v))}
                        >
                          {roleOptions.map((o) => (
                            <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                          ))}
                        </Dropdown.Select>
                        {submitted && serverFormErrors.role && (
                          <span className="text-11 text-error">{serverFormErrors.role}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-px bg-border-muted" />

                  <div className="py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-12 font-medium text-text">
                          Domain <span className="text-error">*</span>
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Dropdown.Select
                          placeholder="Select domain"
                          value={domain}
                          onChange={(v) => setDomain(String(v))}
                        >
                          {domainOptions.map((o) => (
                            <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                          ))}
                        </Dropdown.Select>
                        {submitted && serverFormErrors.domain && (
                          <span className="text-11 text-error">{serverFormErrors.domain}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ),
              doneUI: (
                <div className="flex flex-col gap-3 py-3">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-11 font-medium text-text-muted">Serial number</span>
                    <span className="text-12 text-text">{serial || '-'}</span>
                  </div>
                  <div className="h-px w-full bg-border-muted" />
                  <div className="flex flex-col gap-1.5">
                    <span className="text-11 font-medium text-text-muted">MAC (Primary)</span>
                    <span className="text-12 text-text">{macPrimary || '-'}</span>
                  </div>
                  <div className="h-px w-full bg-border-muted" />
                  <div className="flex flex-col gap-1.5">
                    <span className="text-11 font-medium text-text-muted">NIC (primary name)</span>
                    <span className="text-12 text-text">{nicPrimaryName || '-'}</span>
                  </div>
                  <div className="h-px w-full bg-border-muted" />
                  <div className="flex flex-col gap-1.5">
                    <span className="text-11 font-medium text-text-muted">Location</span>
                    <span className="text-12 text-text">{location || '-'}</span>
                  </div>
                  <div className="h-px w-full bg-border-muted" />
                  <div className="flex flex-col gap-1.5">
                    <span className="text-11 font-medium text-text-muted">Provider network</span>
                    <span className="text-12 text-text">{providerNetwork || '-'}</span>
                  </div>
                  <div className="h-px w-full bg-border-muted" />
                  <div className="flex flex-col gap-1.5">
                    <span className="text-11 font-medium text-text-muted">Role</span>
                    <span className="text-12 text-text">
                      {role ? (roleOptions.find((o) => o.value === role)?.label ?? role) : '-'}
                    </span>
                  </div>
                  <div className="h-px w-full bg-border-muted" />
                  <div className="flex flex-col gap-1.5">
                    <span className="text-11 font-medium text-text-muted">Domain</span>
                    <span className="text-12 text-text">
                      {domain
                        ? (domainOptions.find((o) => o.value === domain)?.label ?? domain)
                        : '-'}
                    </span>
                  </div>
                </div>
              ),
            },
          ]}
        </Stepper>
      ) : (
        <div className="text-text-muted">Create form for this resource is not configured yet.</div>
      )}

      {confirmOpen && (
        <ActionModal
          appeared={confirmOpen}
          onConfirm={() => {
            setConfirmOpen(false);
            navigate(`/cloudbuilder/${slug}`);
          }}
          onCancel={() => setConfirmOpen(false)}
          actionConfig={{
            title: `Create ${config.title}`,
            subtitle: 'This is UI-only. No actual resource will be created.',
            actionButtonText: 'OK',
            actionButtonVariant: 'primary',
          }}
        />
      )}
    </CreateLayout>
  );
}

export default CloudBuilderCreatePage;
