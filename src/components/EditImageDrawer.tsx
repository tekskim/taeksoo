import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  Input,
  Textarea,
  Select,
  Toggle,
  NumberInput,
  FormField,
  Disclosure,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface ImageInfo {
  id: string;
  name: string;
  description?: string;
  os?: string;
  osVersion?: string;
  osAdmin?: string;
  isProtected?: boolean;
  minDisk?: number;
  minRam?: number;
  qemuGuestAgent?: boolean;
  cpuPolicy?: string;
  cpuThreadPolicy?: string;
}

export interface EditImageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  image: ImageInfo | null;
  onSubmit?: (name: string, description: string) => void;
}

const OS_OPTIONS = [
  { value: 'ubuntu', label: 'Ubuntu' },
  { value: 'centos', label: 'CentOS' },
  { value: 'debian', label: 'Debian' },
  { value: 'windows', label: 'Windows' },
  { value: 'rocky', label: 'Rocky' },
  { value: 'rhel', label: 'RHEL' },
  { value: 'other', label: 'Other' },
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

/* ----------------------------------------
   EditImageDrawer Component
   ---------------------------------------- */

export function EditImageDrawer({ isOpen, onClose, image, onSubmit }: EditImageDrawerProps) {
  const [imageName, setImageName] = useState('');
  const [description, setDescription] = useState('');
  const [os, setOs] = useState('ubuntu');
  const [osVersion, setOsVersion] = useState('');
  const [osAdmin, setOsAdmin] = useState('');
  const [isProtected, setIsProtected] = useState(false);
  const [minDisk, setMinDisk] = useState(0);
  const [minRam, setMinRam] = useState(0);
  const [qemuGuestAgent, setQemuGuestAgent] = useState(true);
  const [cpuPolicy, setCpuPolicy] = useState('none');
  const [cpuThreadPolicy, setCpuThreadPolicy] = useState('none');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (isOpen && image) {
      setImageName(image.name);
      setDescription(image.description ?? '');
      setOs(image.os ?? 'ubuntu');
      setOsVersion(image.osVersion ?? '');
      setOsAdmin(image.osAdmin ?? '');
      setIsProtected(image.isProtected ?? false);
      setMinDisk(image.minDisk ?? 0);
      setMinRam(image.minRam ?? 0);
      setQemuGuestAgent(image.qemuGuestAgent ?? true);
      setCpuPolicy(image.cpuPolicy ?? 'none');
      setCpuThreadPolicy(image.cpuThreadPolicy ?? 'none');
      setAdvancedOpen(false);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen, image]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!imageName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(imageName, description);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHasAttemptedSubmit(false);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit image"
      width={360}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={handleClose} className="flex-1 h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 h-8"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Image Name Input */}
        <FormField required error={hasAttemptedSubmit && !imageName.trim()}>
          <FormField.Label>Image name</FormField.Label>
          <FormField.Control>
            <Input
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              placeholder="Enter image name"
              fullWidth
              error={hasAttemptedSubmit && !imageName.trim()}
            />
          </FormField.Control>
          <FormField.ErrorMessage>Image name is required</FormField.ErrorMessage>
          <FormField.HelperText>
            You can use letters, numbers, and special characters (+=,.@-_), and the length must be
            between 2-128 characters.
          </FormField.HelperText>
        </FormField>

        {/* Description */}
        <FormField>
          <FormField.Label>Description</FormField.Label>
          <FormField.Control>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              fullWidth
              rows={3}
            />
          </FormField.Control>
          <FormField.HelperText>
            You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255
            characters.
          </FormField.HelperText>
        </FormField>

        {/* OS */}
        <FormField
          label="OS"
          description="Select the operating system type for the image."
          required
        >
          <Select options={OS_OPTIONS} value={os} onChange={setOs} fullWidth />
        </FormField>

        {/* OS version */}
        <FormField label="OS version" description="This metadata helps categorize image." required>
          <Input
            value={osVersion}
            onChange={(e) => setOsVersion(e.target.value)}
            placeholder="Enter OS version"
            fullWidth
          />
        </FormField>

        {/* OS admin */}
        <FormField
          label="OS admin"
          description="Enter the default administrator account used when launching instances from this image."
          required
        >
          <Input
            value={osAdmin}
            onChange={(e) => setOsAdmin(e.target.value)}
            placeholder="Enter OS admin"
            fullWidth
          />
        </FormField>

        {/* Protected */}
        <FormField
          label="Protected"
          description="Protected images cannot be deleted, preventing accidental removal."
          spacing="loose"
        >
          <Toggle
            checked={isProtected}
            onChange={setIsProtected}
            label={isProtected ? 'Yes' : 'No'}
          />
        </FormField>

        {/* Advanced */}
        <Disclosure open={advancedOpen} onChange={setAdvancedOpen}>
          <Disclosure.Trigger>Advanced</Disclosure.Trigger>
          <Disclosure.Panel>
            <VStack gap={6} className="pt-4">
              {/* Min system disk */}
              <FormField
                label="Min system disk"
                description="Defines the minimum disk size required to boot an instance from this image."
                helperText="0-500 GiB"
              >
                <HStack gap={2} align="center">
                  <NumberInput
                    value={minDisk}
                    onChange={setMinDisk}
                    min={0}
                    max={500}
                    step={1}
                    width="xs"
                    suffix="GiB"
                  />
                </HStack>
              </FormField>

              {/* Min RAM */}
              <FormField
                label="Min RAM"
                description="Defines the minimum amount of RAM required to boot an instance from this image."
                helperText="0-500 GiB"
              >
                <HStack gap={2} align="center">
                  <NumberInput
                    value={minRam}
                    onChange={setMinRam}
                    min={0}
                    max={500}
                    step={1}
                    width="xs"
                    suffix="GiB"
                  />
                </HStack>
              </FormField>

              {/* QEMU guest agent */}
              <FormField
                label="QEMU guest agent"
                description="Enables communication and status retrieval between the hypervisor and the instance."
                spacing="loose"
              >
                <Toggle
                  checked={qemuGuestAgent}
                  onChange={setQemuGuestAgent}
                  label={qemuGuestAgent ? 'On' : 'Off'}
                />
              </FormField>

              {/* CPU policy */}
              <FormField
                label="CPU policy"
                description="Policy that defines how vCPUs are allocated."
              >
                <Select
                  options={CPU_POLICY_OPTIONS}
                  value={cpuPolicy}
                  onChange={setCpuPolicy}
                  fullWidth
                />
              </FormField>

              {/* CPU thread policy */}
              <FormField
                label="CPU thread policy"
                description="Policy defining how hyperthreads are used for vCPU placement."
              >
                <Select
                  options={CPU_THREAD_POLICY_OPTIONS}
                  value={cpuThreadPolicy}
                  onChange={setCpuThreadPolicy}
                  fullWidth
                />
              </FormField>
            </VStack>
          </Disclosure.Panel>
        </Disclosure>
      </VStack>
    </Drawer>
  );
}

export default EditImageDrawer;
