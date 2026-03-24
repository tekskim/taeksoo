import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title } from '@shared/components/Title';
import { FormField } from '@shared/components/FormField';
import { Input, NumberInput } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import { Fieldset } from '@shared/components/Fieldset';
import { Button } from '@shared/components/Button';
import { Toggle } from '@shared/components/Toggle';
import { Tabs, Tab } from '@shared/components/Tabs';

const DISK_FORMAT_OPTIONS = [
  { value: 'raw', label: 'RAW' },
  { value: 'qcow2', label: 'QCOW2' },
  { value: 'iso', label: 'ISO' },
];

const OS_OPTIONS = [
  { value: 'rocky', label: 'Rocky' },
  { value: 'ubuntu', label: 'Ubuntu' },
  { value: 'windows', label: 'Windows' },
  { value: 'other', label: 'Others' },
];

const CPU_POLICY_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'dedicated', label: 'Dedicated' },
  { value: 'shared', label: 'Shared' },
];

const CPU_THREAD_POLICY_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'prefer', label: 'Prefer' },
  { value: 'isolate', label: 'Isolate' },
  { value: 'require', label: 'Require' },
];

export function ComputeCreateImagePage() {
  const navigate = useNavigate();

  const [imageName, setImageName] = useState('');
  const [description, setDescription] = useState('');
  const [isProtected, setIsProtected] = useState(false);

  const [uploadTab, setUploadTab] = useState<'file' | 'url'>('file');
  const [sourceUrl, setSourceUrl] = useState('');

  const [diskFormat, setDiskFormat] = useState('');
  const [os, setOs] = useState('');
  const [osVersion, setOsVersion] = useState('');
  const [osAdmin, setOsAdmin] = useState('');
  const [minDisk, setMinDisk] = useState<number | undefined>(undefined);
  const [minRam, setMinRam] = useState<number | undefined>(undefined);
  const [specAdvancedOpen, setSpecAdvancedOpen] = useState(true);

  const [qemuGuestAgent, setQemuGuestAgent] = useState(true);
  const [cpuPolicy, setCpuPolicy] = useState('none');
  const [cpuThreadPolicy, setCpuThreadPolicy] = useState('none');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!imageName.trim()) e.imageName = 'Please enter an image name.';
    if (uploadTab === 'url' && !sourceUrl.trim()) e.sourceUrl = 'Please enter a file URL.';
    if (!diskFormat) e.diskFormat = 'Please select a disk format.';
    if (!os) e.os = 'Please select an OS.';
    if (!osVersion.trim()) e.osVersion = 'Please enter an OS version.';
    if (!osAdmin.trim()) e.osAdmin = 'Please enter an OS admin.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    navigate('/compute/images');
  };

  return (
    <div className="flex flex-col gap-6">
      <Title title="Create image" />

      <div className="flex flex-col gap-6 max-w-[720px]">
        <Fieldset legend="Basic information" variant="bordered">
          <div className="flex flex-col gap-5">
            <FormField
              label="Image name"
              required
              error={errors.imageName}
              hint="You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters."
            >
              <Input
                placeholder="Enter image name"
                value={imageName}
                onChange={(e) => {
                  setImageName(e.target.value);
                  setErrors((o) => ({ ...o, imageName: '' }));
                }}
              />
            </FormField>

            <FormField
              label="Description"
              hint="You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255 characters."
            >
              <Input
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormField>

            <FormField
              label="Protected"
              description="Protected images cannot be deleted, preventing accidental removal."
            >
              <Toggle
                checked={isProtected}
                onChange={(e) => setIsProtected(e.target.checked)}
                checkedLabel="Yes"
                uncheckedLabel="No"
              />
            </FormField>
          </div>
        </Fieldset>

        <Fieldset legend="Source" variant="bordered">
          <div className="flex flex-col gap-5">
            <FormField
              label="Upload type"
              required
              description="Registers an image by uploading a file or entering a file URL."
            >
              <Tabs
                activeTabId={uploadTab}
                onChange={(id) => setUploadTab(id as typeof uploadTab)}
                variant="line"
                size="sm"
              >
                <Tab id="file" label="Upload file">
                  <div className="pt-3 flex flex-col gap-2">
                    <Button variant="secondary" size="sm" type="button">
                      Choose File
                    </Button>
                    <span className="text-11 text-text-muted">
                      Only RAW, QCOW2, and ISO file formats are allowed.
                    </span>
                  </div>
                </Tab>
                <Tab id="url" label="File URL">
                  <div className="pt-3">
                    <FormField
                      label="File URL"
                      required
                      error={errors.sourceUrl}
                      hint="The URL must start with http:// or https://."
                    >
                      <Input
                        placeholder="e.g. https://example.com/image.qcow2"
                        value={sourceUrl}
                        onChange={(e) => {
                          setSourceUrl(e.target.value);
                          setErrors((o) => ({ ...o, sourceUrl: '' }));
                        }}
                      />
                    </FormField>
                  </div>
                </Tab>
              </Tabs>
            </FormField>
          </div>
        </Fieldset>

        <Fieldset legend="Specification" variant="bordered">
          <div className="flex flex-col gap-5">
            <FormField
              label="Disk format"
              required
              error={errors.diskFormat}
              description="Select the disk format for the image. It must match the actual type of the uploaded file."
            >
              <Dropdown.Select
                placeholder="Select disk format"
                value={diskFormat}
                onChange={(v) => {
                  setDiskFormat(String(v));
                  setErrors((o) => ({ ...o, diskFormat: '' }));
                }}
              >
                {DISK_FORMAT_OPTIONS.map((o) => (
                  <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                ))}
              </Dropdown.Select>
            </FormField>

            <FormField
              label="OS"
              required
              error={errors.os}
              description="Select the operating system type for the image."
            >
              <Dropdown.Select
                placeholder="Select OS"
                value={os}
                onChange={(v) => {
                  setOs(String(v));
                  setErrors((o) => ({ ...o, os: '' }));
                }}
              >
                {OS_OPTIONS.map((o) => (
                  <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                ))}
              </Dropdown.Select>
            </FormField>

            <FormField
              label="OS version"
              required
              error={errors.osVersion}
              description="This metadata helps categorize image."
            >
              <Input
                placeholder="e.g. 22.04, 8, 2019"
                value={osVersion}
                onChange={(e) => {
                  setOsVersion(e.target.value);
                  setErrors((o) => ({ ...o, osVersion: '' }));
                }}
              />
            </FormField>

            <FormField
              label="OS admin"
              required
              error={errors.osAdmin}
              description="Enter the default administrator account used when launching instances from this image."
            >
              <Input
                placeholder="e.g. ubuntu(ubuntu), administrator(windows)"
                value={osAdmin}
                onChange={(e) => {
                  setOsAdmin(e.target.value);
                  setErrors((o) => ({ ...o, osAdmin: '' }));
                }}
              />
            </FormField>

            <div className="rounded-md border border-border bg-surface-muted px-4 py-3">
              <button
                type="button"
                className="text-13 font-medium text-text bg-transparent border-none cursor-pointer p-0"
                onClick={() => setSpecAdvancedOpen((o) => !o)}
              >
                Advanced
              </button>
              {specAdvancedOpen && (
                <div className="flex flex-col gap-4 mt-3">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">Min system disk</span>
                    <p className="text-12 text-text-muted m-0">
                      Defines the minimum disk size required to boot an instance from this image.
                    </p>
                    <div className="flex items-center gap-2">
                      <NumberInput
                        min={0}
                        max={500}
                        value={minDisk ?? 0}
                        onChange={setMinDisk}
                        size="md"
                      />
                      <span className="text-12 text-text">GiB</span>
                    </div>
                    <span className="text-11 text-text-muted">0-500 GiB</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">Min RAM</span>
                    <p className="text-12 text-text-muted m-0">
                      Defines the minimum amount of RAM required to boot an instance from this
                      image.
                    </p>
                    <div className="flex items-center gap-2">
                      <NumberInput
                        min={0}
                        max={500}
                        value={minRam ?? 0}
                        onChange={setMinRam}
                        size="md"
                      />
                      <span className="text-12 text-text">GiB</span>
                    </div>
                    <span className="text-11 text-text-muted">0-500 GiB</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Fieldset>

        <Fieldset legend="Advanced" variant="bordered">
          <div className="flex flex-col gap-5">
            <FormField
              label="QEMU guest agent"
              description="Enables communication and status retrieval between the hypervisor and the instance."
            >
              <Toggle
                checked={qemuGuestAgent}
                onChange={(e) => setQemuGuestAgent(e.target.checked)}
                checkedLabel="On"
                uncheckedLabel="Off"
              />
            </FormField>

            <FormField
              label="CPU policy"
              description="Policy that defines how vCPUs are allocated."
            >
              <Dropdown.Select value={cpuPolicy} onChange={(v) => setCpuPolicy(String(v))}>
                {CPU_POLICY_OPTIONS.map((o) => (
                  <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                ))}
              </Dropdown.Select>
            </FormField>

            <FormField
              label="CPU thread policy"
              description="Policy defining how hyperthreads are used for vCPU placement."
            >
              <Dropdown.Select
                value={cpuThreadPolicy}
                onChange={(v) => setCpuThreadPolicy(String(v))}
              >
                {CPU_THREAD_POLICY_OPTIONS.map((o) => (
                  <Dropdown.Option key={o.value} value={o.value} label={o.label} />
                ))}
              </Dropdown.Select>
            </FormField>
          </div>
        </Fieldset>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          appearance="outline"
          variant="secondary"
          size="md"
          onClick={() => navigate('/compute/images')}
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
