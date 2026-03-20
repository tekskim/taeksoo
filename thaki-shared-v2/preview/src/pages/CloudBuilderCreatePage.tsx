import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Dropdown } from '@shared/components/Dropdown';
import { default as DetailPageHeader } from '@shared/components/DetailPageHeader/DetailPageHeader';
import { default as DetailCard } from '@shared/components/DetailCard/DetailCard';
import { ActionModal } from '@shared/components/ActionModal';
import { Title } from '@shared/components/Title';
import {
  CLOUD_BUILDER_SLUGS,
  getCloudBuilderListConfig,
  type CloudBuilderSlug,
} from '../data/consoleListConfig';

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between h-8">
        <Title title={pageTitle} />
        <Button
          appearance="ghost"
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/cloudbuilder/${slug}`)}
        >
          Back
        </Button>
      </div>

      {isDiscovery && (
        <div className="text-12 leading-18 text-text-muted">
          Input values are not persisted. Only UI/field composition is reflected.
        </div>
      )}

      {isDiscovery ? (
        <>
          <div className="bg-surface border border-border rounded-base8">
            <div className="px-6 py-5">
              <div className="text-14 font-semibold text-text">Endpoint</div>
              <div className="mt-1 text-12 text-text-muted">
                Enter an endpoint and click Fetch to populate Serial/MAC/IP/Location. (demo)
              </div>
              <div className="mt-4 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-9">
                  <Input
                    placeholder="e.g. http://discovery-agent.local:8080"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                  />
                </div>
                <div className="col-span-3">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => {
                      setDiscoverySerial('SN2001');
                      setDiscoveryMacPrimary('00:1A:2B:3C:4D:5E');
                      setDiscoveryLocation('R1-U18');
                      setDiscoveryMgmtIp('10.0.0.12');
                    }}
                  >
                    Fetch
                  </Button>
                </div>
              </div>
            </div>

            <div className="h-px bg-border-subtle" />

            <div className="px-6 py-5">
              <div className="text-14 font-semibold text-text">Basic</div>
              <div className="mt-4 grid grid-cols-12 gap-y-5 gap-x-6">
                <div className="col-span-4">
                  <div className="text-12 font-medium text-text">
                    Serial <span className="text-error">*</span>
                  </div>
                  <div className="mt-1 text-11 text-text-muted">
                    Identifier serial for on-site hardware
                  </div>
                </div>
                <div className="col-span-8">
                  <Input
                    value={discoverySerial}
                    onChange={(e) => setDiscoverySerial(e.target.value)}
                  />
                </div>

                <div className="col-span-4">
                  <div className="text-12 font-medium text-text">
                    MAC (Primary) <span className="text-error">*</span>
                  </div>
                  <div className="mt-1 text-11 text-text-muted">
                    Primary MAC (asset identification key)
                  </div>
                </div>
                <div className="col-span-8">
                  <Input
                    value={discoveryMacPrimary}
                    onChange={(e) => setDiscoveryMacPrimary(e.target.value)}
                  />
                </div>

                <div className="col-span-4">
                  <div className="text-12 font-medium text-text">
                    Location <span className="text-error">*</span>
                  </div>
                  <div className="mt-1 text-11 text-text-muted">Rack/Unit physical location</div>
                </div>
                <div className="col-span-8">
                  <Input
                    value={discoveryLocation}
                    onChange={(e) => setDiscoveryLocation(e.target.value)}
                  />
                </div>

                <div className="col-span-4">
                  <div className="text-12 font-medium text-text">Mgmt IP (Optional)</div>
                  <div className="mt-1 text-11 text-text-muted">Management IP (if available)</div>
                </div>
                <div className="col-span-8">
                  <Input
                    value={discoveryMgmtIp}
                    onChange={(e) => setDiscoveryMgmtIp(e.target.value)}
                  />
                </div>

                <div className="col-span-4">
                  <div className="text-12 font-medium text-text">Notes</div>
                  <div className="mt-1 text-11 text-text-muted">Memo (optional)</div>
                </div>
                <div className="col-span-8">
                  <Textarea
                    placeholder='e.g. "Source: LLDP discovery"'
                    value={discoveryMemo}
                    onChange={(e) => setDiscoveryMemo(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <Button
                  appearance="outline"
                  variant="secondary"
                  size="md"
                  onClick={() => navigate(`/cloudbuilder/${slug}`)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="md" onClick={() => setConfirmOpen(true)}>
                  Create
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : isServerLike ? (
        <>
          <DetailCard
            title="Basic information"
            fields={[
              {
                label: 'Serial number',
                value: '',
                type: 'component',
                component: (
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
                ),
              },
              {
                label: 'MAC (Primary)',
                value: '',
                type: 'component',
                component: (
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
                ),
              },
              {
                label: 'NIC (primary name)',
                value: '',
                type: 'component',
                component: (
                  <div className="flex flex-col gap-1">
                    <Input
                      placeholder="e.g. eno1"
                      value={nicPrimaryName}
                      onChange={(e) => setNicPrimaryName(e.target.value)}
                      error={submitted && !!serverFormErrors.nicPrimaryName}
                    />
                    {submitted && serverFormErrors.nicPrimaryName && (
                      <span className="text-11 text-error">{serverFormErrors.nicPrimaryName}</span>
                    )}
                  </div>
                ),
              },
              {
                label: 'Location',
                value: '',
                type: 'component',
                component: (
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
                ),
              },
              {
                label: 'Provider network',
                value: '',
                type: 'component',
                component: (
                  <div className="flex flex-col gap-1">
                    <Input
                      placeholder="e.g. VLAN 120 / 10.0.20.12"
                      value={providerNetwork}
                      onChange={(e) => setProviderNetwork(e.target.value)}
                      error={submitted && !!serverFormErrors.providerNetwork}
                    />
                    {submitted && serverFormErrors.providerNetwork && (
                      <span className="text-11 text-error">{serverFormErrors.providerNetwork}</span>
                    )}
                  </div>
                ),
              },
              {
                label: 'Role',
                value: '',
                type: 'component',
                component: (
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
                ),
              },
              {
                label: 'Domain',
                value: '',
                type: 'component',
                component: (
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
                ),
              },
            ]}
          />

          <div className="flex items-center justify-end gap-2">
            <Button
              appearance="outline"
              variant="secondary"
              size="md"
              onClick={() => navigate(`/cloudbuilder/${slug}`)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setSubmitted(true);
                if (!canSubmitServerForm) return;
                setConfirmOpen(true);
              }}
            >
              Create
            </Button>
          </div>
        </>
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
    </div>
  );
}

export default CloudBuilderCreatePage;
