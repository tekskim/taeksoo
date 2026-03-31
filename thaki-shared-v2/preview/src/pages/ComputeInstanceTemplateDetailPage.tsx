import { useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Toggle } from '@shared/components/Toggle';
import { Dropdown } from '@shared/components/Dropdown';
import { ActionModal } from '@shared/components/ActionModal';
import { Title } from '@shared/components/Title';
import {
  IconCheck,
  IconCircle,
  IconEdit,
  IconMinus,
  IconProgress,
  IconTrash,
} from '@tabler/icons-react';
import { cn } from '@shared/services/utils/cn';

type AccessType = 'Personal' | 'Project' | 'Public';
type WizardSectionState = 'pre' | 'active' | 'done' | 'skipped' | 'writing';

interface InstanceTemplateDetail {
  id: string;
  name: string;
  description: string;
  image: string;
  imageId: string;
  flavor: string;
  flavorId: string;
  vcpu: number;
  ram: string;
  disk: string;
  systemDisk: string;
  dataDisk: string;
  network: string;
  networkId: string;
  subnet: string;
  subnetId: string;
  securityGroups: string[];
  floatingIp: string;
  port: string;
  keyPair: string;
  access: AccessType;
  favorite: boolean;
  createdAt: string;
  createdBy: string;
  availabilityZone: string;
  serverGroup: string;
  userData: string;
  tags: { key: string; value: string }[];
}

type SectionStep = 'template-info' | 'basic-info' | 'source' | 'flavor' | 'network' | 'advanced';

const SECTION_LABELS: Record<SectionStep, string> = {
  'template-info': 'Template Information',
  'basic-info': 'Basic information',
  source: 'Source',
  flavor: 'Flavor',
  network: 'Network',
  advanced: 'Advanced',
};

const SECTION_ORDER: SectionStep[] = [
  'template-info',
  'basic-info',
  'source',
  'flavor',
  'network',
  'advanced',
];

const mockTemplatesMap: Record<string, InstanceTemplateDetail> = {
  'tpl-001': {
    id: 'tpl-001',
    name: 'hj-small',
    description: '-',
    image: 'Ubuntu 22.04 LTS',
    imageId: 'img-ubuntu-2204',
    flavor: 'm1.medium',
    flavorId: 'flv-m1-medium',
    vcpu: 8,
    ram: '16GiB',
    disk: '10GiB',
    systemDisk: '30 GiB',
    dataDisk: '-',
    network: '-',
    networkId: '',
    subnet: '-',
    subnetId: '',
    securityGroups: [],
    floatingIp: '-',
    port: '-',
    keyPair: 'my-keypair',
    access: 'Personal',
    favorite: true,
    createdAt: 'Jul 25, 2025 10:32:16',
    createdBy: 'admin@thaki.cloud',
    availabilityZone: 'nova',
    serverGroup: '-',
    userData: '-',
    tags: [],
  },
  'tpl-002': {
    id: 'tpl-002',
    name: 'My-web-template',
    description: '-',
    image: 'ubuntu 22.04',
    imageId: 'img-ubuntu-2204',
    flavor: 'th.medium',
    flavorId: 'flv-th-medium',
    vcpu: 2,
    ram: '4GiB',
    disk: '40GiB',
    systemDisk: '30 GiB',
    dataDisk: '-',
    network: '-',
    networkId: '',
    subnet: '-',
    subnetId: '',
    securityGroups: [],
    floatingIp: '-',
    port: '-',
    keyPair: 'my-keypair',
    access: 'Project',
    favorite: false,
    createdAt: 'Jul 24, 2025 03:19:59',
    createdBy: 'admin@thaki.cloud',
    availabilityZone: 'nova',
    serverGroup: '-',
    userData: '-',
    tags: [],
  },
  'tpl-003': {
    id: 'tpl-003',
    name: 'db-template',
    description: 'Database server template',
    image: 'CentOS 8',
    imageId: 'img-centos-8',
    flavor: 'm1.xlarge',
    flavorId: 'flv-m1-xlarge',
    vcpu: 32,
    ram: '64GiB',
    disk: '200GiB',
    systemDisk: '200 GiB',
    dataDisk: '500 GiB',
    network: 'db-net',
    networkId: 'net-db-001',
    subnet: '10.0.1.0/24',
    subnetId: 'subnet-002',
    securityGroups: ['default', 'db-access'],
    floatingIp: '-',
    port: '-',
    keyPair: 'db-keypair',
    access: 'Personal',
    favorite: false,
    createdAt: 'Jul 23, 2025 20:06:42',
    createdBy: 'admin@thaki.cloud',
    availabilityZone: 'nova',
    serverGroup: 'db-group',
    userData: '',
    tags: [],
  },
};

const defaultTemplateDetail: InstanceTemplateDetail = {
  id: 'tpl-default',
  name: 'Unknown Template',
  description: '-',
  image: '-',
  imageId: '',
  flavor: '-',
  flavorId: '',
  vcpu: 0,
  ram: '-',
  disk: '-',
  systemDisk: '-',
  dataDisk: '-',
  network: '-',
  networkId: '',
  subnet: '-',
  subnetId: '',
  securityGroups: [],
  floatingIp: '-',
  port: '-',
  keyPair: '-',
  access: 'Personal',
  favorite: false,
  createdAt: '-',
  createdBy: '-',
  availabilityZone: '-',
  serverGroup: '-',
  userData: '',
  tags: [],
};

const availabilityZoneOptions = [
  { value: 'nova', label: 'nova' },
  { value: 'az-1', label: 'az-1' },
  { value: 'az-2', label: 'az-2' },
];

const imageOptions = [
  { value: 'Ubuntu 22.04 LTS', label: 'Ubuntu 22.04 LTS' },
  { value: 'Ubuntu 20.04 LTS', label: 'Ubuntu 20.04 LTS' },
  { value: 'CentOS 8', label: 'CentOS 8' },
  { value: 'Rocky Linux 9', label: 'Rocky Linux 9' },
];

const flavorOptions = [
  { value: 'm1.small', label: 'm1.small (1 vCPU / 2GiB / 20GiB)' },
  { value: 'm1.medium', label: 'm1.medium (2 vCPU / 4GiB / 40GiB)' },
  { value: 'm1.large', label: 'm1.large (4 vCPU / 8GiB / 80GiB)' },
  { value: 'm1.xlarge', label: 'm1.xlarge (8 vCPU / 16GiB / 160GiB)' },
];

function DoneSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <SectionCard>
      <SectionCard.Header
        title={title}
        actions={
          <Button variant="secondary" appearance="outline" size="sm" onClick={onEdit}>
            <IconEdit size={12} stroke={1.5} /> Edit
          </Button>
        }
      />
      <SectionCard.Content>{children}</SectionCard.Content>
    </SectionCard>
  );
}

function ActiveSection({
  title,
  onSave,
  onCancel,
  children,
}: {
  title: string;
  onSave: () => void;
  onCancel: () => void;
  children: ReactNode;
}) {
  return (
    <SectionCard isActive>
      <SectionCard.Header
        title={title}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" appearance="outline" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={onSave}>
              Done
            </Button>
          </div>
        }
      />
      <SectionCard.Content>{children}</SectionCard.Content>
    </SectionCard>
  );
}

function SectionStatusIcon({ status }: { status: WizardSectionState }) {
  if (status === 'done') {
    return (
      <div className="w-4 h-4 shrink-0 rounded-full bg-success flex items-center justify-center">
        <IconCheck size={10} stroke={2.5} className="text-white" />
      </div>
    );
  }
  if (status === 'active' || status === 'writing') {
    return (
      <div className="w-4 h-4 shrink-0 flex items-center justify-center">
        <IconProgress size={20} stroke={1.5} className="text-text-muted" />
      </div>
    );
  }
  if (status === 'skipped') {
    return (
      <div className="w-4 h-4 shrink-0 rounded-full bg-text-subtle flex items-center justify-center">
        <IconMinus size={10} stroke={2.5} className="text-white" />
      </div>
    );
  }
  return <div className="w-4 h-4 shrink-0 rounded-full border-2 border-border-strong" />;
}

function SummarySidebar({
  sectionStatus,
  onCancel,
  onSave,
  onDelete,
}: {
  sectionStatus: Record<SectionStep, WizardSectionState>;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
}) {
  const isAllDone = SECTION_ORDER.every((key) => sectionStatus[key] === 'done');

  return (
    <div className="w-[280px] shrink-0 sticky top-4 self-start">
      <div className="flex flex-col gap-3 p-4 bg-surface-subtle border border-border rounded-lg">
        <span className="text-16 font-semibold leading-6 text-text">Summary</span>
        <div className="flex flex-col">
          {SECTION_ORDER.map((key) => (
            <div key={key} className="flex items-center justify-between py-1.5 text-12 leading-18">
              <span className="text-text">{SECTION_LABELS[key]}</span>
              <div className="w-16 flex justify-end items-center">
                {sectionStatus[key] === 'writing' ? (
                  <span className="text-11 leading-4 text-text-subtle">Writing...</span>
                ) : (
                  <SectionStatusIcon status={sectionStatus[key]} />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" appearance="outline" onClick={onCancel} className="w-20">
            Cancel
          </Button>
          <Button variant="primary" onClick={onSave} className="flex-1" disabled={!isAllDone}>
            Save
          </Button>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <Button
          variant="secondary"
          appearance="outline"
          size="sm"
          onClick={onDelete}
          className="w-20 h-8"
        >
          <IconTrash size={12} stroke={1.5} /> Delete
        </Button>
      </div>
    </div>
  );
}

export function ComputeInstanceTemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const originalTemplate = id
    ? mockTemplatesMap[id] || defaultTemplateDetail
    : defaultTemplateDetail;

  const [formData, setFormData] = useState<InstanceTemplateDetail>(originalTemplate);
  const [editingSection, setEditingSection] = useState<SectionStep | null>(null);
  const [sectionStatus, setSectionStatus] = useState<Record<SectionStep, WizardSectionState>>(
    () => {
      const initial = {} as Record<SectionStep, WizardSectionState>;
      SECTION_ORDER.forEach((key) => {
        initial[key] = 'done';
      });
      return initial;
    }
  );

  const handleCancel = () => navigate('/compute/instance-templates');
  const handleSave = () => {
    navigate('/compute/instance-templates');
  };
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const handleEdit = (section: SectionStep) => {
    setEditingSection(section);
    setSectionStatus((prev) => ({ ...prev, [section]: 'active' }));
  };

  const handleSectionSave = (section: SectionStep) => {
    setEditingSection(null);
    setSectionStatus((prev) => ({ ...prev, [section]: 'done' }));
  };

  const handleSectionCancel = (section: SectionStep) => {
    setFormData((prev) => {
      const updated = { ...prev };
      if (section === 'template-info') {
        updated.name = originalTemplate.name;
        updated.description = originalTemplate.description;
        updated.favorite = originalTemplate.favorite;
      } else if (section === 'basic-info') {
        updated.availabilityZone = originalTemplate.availabilityZone;
      } else if (section === 'source') {
        updated.image = originalTemplate.image;
        updated.systemDisk = originalTemplate.systemDisk;
        updated.dataDisk = originalTemplate.dataDisk;
      } else if (section === 'flavor') {
        updated.flavor = originalTemplate.flavor;
      } else if (section === 'network') {
        updated.network = originalTemplate.network;
        updated.floatingIp = originalTemplate.floatingIp;
        updated.securityGroups = originalTemplate.securityGroups;
        updated.port = originalTemplate.port;
      } else if (section === 'advanced') {
        updated.tags = originalTemplate.tags;
        updated.userData = originalTemplate.userData;
      }
      return updated;
    });
    setEditingSection(null);
    setSectionStatus((prev) => ({ ...prev, [section]: 'done' }));
  };

  const updateFormData = <K extends keyof InstanceTemplateDetail>(
    key: K,
    value: InstanceTemplateDetail[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const fieldStack = 'flex flex-col gap-4 w-full';

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <div className="flex items-center h-8">
        <div className="flex items-center gap-1">
          <Title title="Edit template" />
          <span className="text-11 font-medium leading-4 text-text-muted">(ID: {formData.id})</span>
        </div>
      </div>

      <div className={cn('flex gap-6 items-start w-full')}>
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          {editingSection === 'template-info' ? (
            <ActiveSection
              title={SECTION_LABELS['template-info']}
              onSave={() => handleSectionSave('template-info')}
              onCancel={() => handleSectionCancel('template-info')}
            >
              <div className={fieldStack}>
                <FormField label="Template name">
                  <Input
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="w-full"
                  />
                </FormField>
                <FormField label="Favorite">
                  <Toggle
                    checked={formData.favorite}
                    onChange={(e) => updateFormData('favorite', e.target.checked)}
                  />
                </FormField>
                <FormField label="Description">
                  <Textarea
                    value={formData.description === '-' ? '' : formData.description}
                    onChange={(e) => updateFormData('description', e.target.value || '-')}
                    rows={3}
                    className="w-full"
                  />
                </FormField>
              </div>
            </ActiveSection>
          ) : (
            <DoneSection
              title={SECTION_LABELS['template-info']}
              onEdit={() => handleEdit('template-info')}
            >
              <SectionCard.DataRow label="Template name" value={formData.name} />
              <SectionCard.DataRow label="Favorite" value={formData.favorite ? 'Yes' : '-'} />
              <SectionCard.DataRow label="Description" value={formData.description} />
            </DoneSection>
          )}

          {editingSection === 'basic-info' ? (
            <ActiveSection
              title={SECTION_LABELS['basic-info']}
              onSave={() => handleSectionSave('basic-info')}
              onCancel={() => handleSectionCancel('basic-info')}
            >
              <FormField label="Availability zone">
                <Dropdown.Select
                  value={formData.availabilityZone}
                  onChange={(v) => updateFormData('availabilityZone', v)}
                  placeholder="Select AZ"
                  className="w-full"
                >
                  {availabilityZoneOptions.map((o) => (
                    <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                  ))}
                </Dropdown.Select>
              </FormField>
            </ActiveSection>
          ) : (
            <DoneSection
              title={SECTION_LABELS['basic-info']}
              onEdit={() => handleEdit('basic-info')}
            >
              <SectionCard.DataRow label="Availability zone" value={formData.availabilityZone} />
            </DoneSection>
          )}

          {editingSection === 'source' ? (
            <ActiveSection
              title={SECTION_LABELS.source}
              onSave={() => handleSectionSave('source')}
              onCancel={() => handleSectionCancel('source')}
            >
              <div className={fieldStack}>
                <FormField label="Image">
                  <Dropdown.Select
                    value={formData.image}
                    onChange={(v) => updateFormData('image', v)}
                    placeholder="Select image"
                    className="w-full"
                  >
                    {imageOptions.map((o) => (
                      <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                    ))}
                  </Dropdown.Select>
                </FormField>
                <FormField label="System disk">
                  <Input
                    value={formData.systemDisk}
                    onChange={(e) => updateFormData('systemDisk', e.target.value)}
                    className="w-full"
                  />
                </FormField>
                <FormField label="Data disk">
                  <Input
                    value={formData.dataDisk === '-' ? '' : formData.dataDisk}
                    onChange={(e) => updateFormData('dataDisk', e.target.value || '-')}
                    placeholder="Optional"
                    className="w-full"
                  />
                </FormField>
              </div>
            </ActiveSection>
          ) : (
            <DoneSection title={SECTION_LABELS.source} onEdit={() => handleEdit('source')}>
              <SectionCard.DataRow label="Image" value={formData.image} />
              <SectionCard.DataRow label="System disk" value={formData.systemDisk} />
              <SectionCard.DataRow label="Data disk" value={formData.dataDisk} />
            </DoneSection>
          )}

          {editingSection === 'flavor' ? (
            <ActiveSection
              title={SECTION_LABELS.flavor}
              onSave={() => handleSectionSave('flavor')}
              onCancel={() => handleSectionCancel('flavor')}
            >
              <FormField label="Flavor">
                <Dropdown.Select
                  value={formData.flavor}
                  onChange={(v) => updateFormData('flavor', v)}
                  placeholder="Select flavor"
                  className="w-full"
                >
                  {flavorOptions.map((o) => (
                    <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                  ))}
                </Dropdown.Select>
              </FormField>
            </ActiveSection>
          ) : (
            <DoneSection title={SECTION_LABELS.flavor} onEdit={() => handleEdit('flavor')}>
              <SectionCard.DataRow
                label="Flavor"
                value={`${formData.flavor} (${formData.vcpu} vCPU / ${formData.ram} / ${formData.disk})`}
              />
            </DoneSection>
          )}

          {editingSection === 'network' ? (
            <ActiveSection
              title={SECTION_LABELS.network}
              onSave={() => handleSectionSave('network')}
              onCancel={() => handleSectionCancel('network')}
            >
              <div className={fieldStack}>
                <FormField label="Network">
                  <Input
                    value={formData.network === '-' ? '' : formData.network}
                    onChange={(e) => updateFormData('network', e.target.value || '-')}
                    placeholder="Select network"
                    className="w-full"
                  />
                </FormField>
                <FormField label="Floating IP">
                  <Input
                    value={formData.floatingIp === '-' ? '' : formData.floatingIp}
                    onChange={(e) => updateFormData('floatingIp', e.target.value || '-')}
                    placeholder="Optional"
                    className="w-full"
                  />
                </FormField>
                <FormField label="Security groups">
                  <Input
                    value={formData.securityGroups.join(', ')}
                    onChange={(e) =>
                      updateFormData(
                        'securityGroups',
                        e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                      )
                    }
                    placeholder="Comma-separated"
                    className="w-full"
                  />
                </FormField>
                <FormField label="Port">
                  <Input
                    value={formData.port === '-' ? '' : formData.port}
                    onChange={(e) => updateFormData('port', e.target.value || '-')}
                    placeholder="Optional"
                    className="w-full"
                  />
                </FormField>
              </div>
            </ActiveSection>
          ) : (
            <DoneSection title={SECTION_LABELS.network} onEdit={() => handleEdit('network')}>
              <SectionCard.DataRow label="Network" value={formData.network} />
              <SectionCard.DataRow label="Floating IP" value={formData.floatingIp} />
              <SectionCard.DataRow
                label="Security group"
                value={
                  formData.securityGroups.length > 0 ? formData.securityGroups.join(', ') : '-'
                }
              />
              <SectionCard.DataRow label="Port" value={formData.port} />
            </DoneSection>
          )}

          {editingSection === 'advanced' ? (
            <ActiveSection
              title={SECTION_LABELS.advanced}
              onSave={() => handleSectionSave('advanced')}
              onCancel={() => handleSectionCancel('advanced')}
            >
              <div className={fieldStack}>
                <FormField label="Tags" hint="Enter tags as key:value pairs, separated by commas">
                  <Input
                    value={formData.tags.map((t) => `${t.key}:${t.value}`).join(', ')}
                    onChange={(e) => {
                      const tags = e.target.value
                        .split(',')
                        .map((s) => {
                          const [key, value] = s.trim().split(':');
                          return { key: key || '', value: value || '' };
                        })
                        .filter((t) => t.key);
                      updateFormData('tags', tags);
                    }}
                    placeholder="key:value, key:value"
                    className="w-full"
                  />
                </FormField>
                <FormField label="User data">
                  <Textarea
                    value={formData.userData === '-' ? '' : formData.userData}
                    onChange={(e) => updateFormData('userData', e.target.value || '-')}
                    rows={5}
                    placeholder="Enter cloud-init script or user data"
                    className="w-full"
                  />
                </FormField>
              </div>
            </ActiveSection>
          ) : (
            <DoneSection title={SECTION_LABELS.advanced} onEdit={() => handleEdit('advanced')}>
              <SectionCard.DataRow
                label="Tag"
                value={
                  formData.tags.length > 0
                    ? formData.tags.map((t) => `${t.key}: ${t.value}`).join(', ')
                    : '-'
                }
              />
              <SectionCard.DataRow label="User data" value={formData.userData || '-'} />
            </DoneSection>
          )}
        </div>

        <SummarySidebar
          sectionStatus={sectionStatus}
          onCancel={handleCancel}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </div>

      <ActionModal
        appeared={deleteModalOpen}
        actionConfig={{
          title: 'Delete template',
          subtitle: `Are you sure you want to delete "${formData.name}"? This action cannot be undone.`,
          actionButtonText: 'Delete',
          actionButtonVariant: 'error',
        }}
        onConfirm={() => {
          console.log('[Instance Template] Delete confirmed', formData.id);
          setDeleteModalOpen(false);
          navigate('/compute/instance-templates');
        }}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
