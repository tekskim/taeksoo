import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@shared/components/Input';
import { NumberInput } from '@shared/components/Input';
import { Toggle } from '@shared/components/Toggle';
import { Dropdown } from '@shared/components/Dropdown';
import { ActionModal } from '@shared/components/ActionModal';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import { Stepper } from '@shared/components/Stepper';
import { Disclosure } from '@shared/components/Disclosure';
import { Button } from '@shared/components/Button';
import { IconUpload } from '@tabler/icons-react';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';

const STEP_IDS = ['basic', 'source', 'specification', 'advanced'] as const;

export function ComputeCreateImagePage() {
  const navigate = useNavigate();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [allComplete, setAllComplete] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Basic info
  const [imageName, setImageName] = useState('');
  const [description, setDescription] = useState('');
  const [isProtected, setIsProtected] = useState(false);

  // Source
  const [sourceType, setSourceType] = useState<'file' | 'url'>('file');
  const [sourceUrl, setSourceUrl] = useState('');

  // Specification
  const [diskFormat, setDiskFormat] = useState('');
  const [os, setOs] = useState('');
  const [osVersion, setOsVersion] = useState('');
  const [osAdmin, setOsAdmin] = useState('');
  const [minDisk, setMinDisk] = useState<number>(0);
  const [minRam, setMinRam] = useState<number>(0);
  const [specAdvancedOpen, setSpecAdvancedOpen] = useState(false);

  // Advanced
  const [qemuGuestAgent, setQemuGuestAgent] = useState(true);
  const [cpuPolicy, setCpuPolicy] = useState('none');
  const [cpuThreadPolicy, setCpuThreadPolicy] = useState('none');

  // Validation
  const imageNameError = submitted && !imageName.trim() ? 'Please enter an image name.' : null;
  const sourceUrlError =
    submitted && sourceType === 'url' && !sourceUrl.trim() ? 'Please enter a file URL.' : null;
  const diskFormatError = submitted && !diskFormat ? 'Please select a disk format.' : null;
  const osError = submitted && !os ? 'Please select an OS.' : null;
  const osVersionError = submitted && !osVersion.trim() ? 'Please enter an OS version.' : null;
  const osAdminError = submitted && !osAdmin.trim() ? 'Please enter an OS admin.' : null;

  // Stepper -> FloatingCard sync
  const [stepStatuses, setStepStatuses] = useState<Record<string, FloatingCardStatus>>({
    basic: 'processing',
    source: 'default',
    specification: 'default',
    advanced: 'default',
  });

  const validateBasicInfo = useCallback((): boolean => {
    setSubmitted(true);
    return !!imageName.trim();
  }, [imageName]);

  const validateSource = useCallback((): boolean => {
    setSubmitted(true);
    if (sourceType === 'url' && !sourceUrl.trim()) return false;
    return true;
  }, [sourceType, sourceUrl]);

  const validateSpecification = useCallback((): boolean => {
    setSubmitted(true);
    return !!diskFormat && !!os && !!osVersion.trim() && !!osAdmin.trim();
  }, [diskFormat, os, osVersion, osAdmin]);

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

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <CreateLayout
      title="Create image"
      sidebar={
        <FloatingCard
          summaryTitle="Summary"
          sections={[
            {
              items: [
                { label: 'Basic information', status: stepStatuses.basic },
                { label: 'Source', status: stepStatuses.source },
                { label: 'Specification', status: stepStatuses.specification },
                { label: 'Advanced', status: stepStatuses.advanced },
              ],
            },
          ]}
          onCancel={() => navigate('/compute/images')}
          onAction={() => setConfirmOpen(true)}
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
                {/* Image name */}
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">
                      Image name <span className="text-error">*</span>
                    </span>
                    <Input
                      placeholder="Enter image name"
                      value={imageName}
                      onChange={(e) => {
                        setImageName(e.target.value);
                        setSubmitted(false);
                      }}
                      error={!!imageNameError}
                    />
                    {imageNameError && <span className="text-11 text-error">{imageNameError}</span>}
                    <span className="text-11 text-text-subtle">
                      You can use letters, numbers, and special characters (+=,.@-_), and the length
                      must be between 2-128 characters.
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
                      You can use letters, numbers, and special characters (+=,.@-_()[]), and
                      maximum 255 characters.
                    </span>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                {/* Protected */}
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">Protected</span>
                      <span className="text-12 text-text-muted">
                        Protected images cannot be deleted, preventing accidental removal.
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Toggle
                        checked={isProtected}
                        onChange={(e) => setIsProtected(e.target.checked)}
                      />
                      <span className="text-12 text-text">{isProtected ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Image name</span>
                  <span className="text-12 text-text">{imageName || '-'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Description</span>
                  <span className="text-12 text-text">{description || '-'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Protected</span>
                  <span className="text-12 text-text">{isProtected ? 'Yes' : 'No'}</span>
                </div>
              </div>
            ),
          },
          {
            id: 'source' as const,
            label: 'Source',
            onComplete: validateSource,
            editUI: (
              <div className="flex flex-col gap-0">
                {/* Upload type */}
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Upload type <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        Registers an image by uploading a file or entering a file URL.
                      </span>
                    </div>

                    <div className="flex gap-0 border-b border-border-muted">
                      <button
                        type="button"
                        className={`px-3 py-1.5 text-12 font-medium border-b-2 bg-transparent cursor-pointer ${
                          sourceType === 'file'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-text-muted hover:text-text'
                        }`}
                        onClick={() => setSourceType('file')}
                      >
                        Upload file
                      </button>
                      <button
                        type="button"
                        className={`px-3 py-1.5 text-12 font-medium border-b-2 bg-transparent cursor-pointer ${
                          sourceType === 'url'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-text-muted hover:text-text'
                        }`}
                        onClick={() => setSourceType('url')}
                      >
                        File URL
                      </button>
                    </div>

                    {sourceType === 'file' && (
                      <div className="flex flex-col gap-2">
                        <Button variant="secondary" appearance="outline" size="sm">
                          <IconUpload size={12} />
                          Choose File
                        </Button>
                        <span className="text-11 text-text-subtle">
                          Only RAW, QCOW2, and ISO file formats are allowed.
                        </span>
                      </div>
                    )}

                    {sourceType === 'url' && (
                      <div className="flex flex-col gap-2">
                        <span className="text-13 font-medium text-text">
                          File URL <span className="text-error">*</span>
                        </span>
                        <Input
                          placeholder="e.g. https://example.com/image.qcow2"
                          value={sourceUrl}
                          onChange={(e) => {
                            setSourceUrl(e.target.value);
                            setSubmitted(false);
                          }}
                          error={!!sourceUrlError}
                        />
                        {sourceUrlError && (
                          <span className="text-11 text-error">{sourceUrlError}</span>
                        )}
                        <span className="text-11 text-text-subtle">
                          The URL must start with http:// or https://.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Upload type</span>
                  <span className="text-12 text-text">
                    {sourceType === 'file' ? 'Upload File' : 'File URL'}
                  </span>
                </div>
                {sourceType === 'url' && (
                  <>
                    <div className="h-px w-full bg-border-muted" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-11 font-medium text-text-muted">URL</span>
                      <span className="text-12 text-text">{sourceUrl || '-'}</span>
                    </div>
                  </>
                )}
              </div>
            ),
          },
          {
            id: 'specification' as const,
            label: 'Specification',
            onComplete: validateSpecification,
            editUI: (
              <div className="flex flex-col gap-0">
                {/* Disk format */}
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        Disk format <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        Select the disk format for the image. It must match the actual type of the
                        uploaded file.
                      </span>
                    </div>
                    <Dropdown.Select
                      value={diskFormat}
                      onChange={(v) => {
                        setDiskFormat(String(v));
                        setSubmitted(false);
                      }}
                      placeholder="Select disk format"
                    >
                      <Dropdown.Option value="raw" label="RAW" />
                      <Dropdown.Option value="qcow2" label="QCOW2" />
                      <Dropdown.Option value="iso" label="ISO" />
                    </Dropdown.Select>
                    {diskFormatError && (
                      <span className="text-11 text-error">{diskFormatError}</span>
                    )}
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                {/* OS */}
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        OS <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        Select the operating system type for the image.
                      </span>
                    </div>
                    <Dropdown.Select
                      value={os}
                      onChange={(v) => {
                        setOs(String(v));
                        setSubmitted(false);
                      }}
                      placeholder="Select OS"
                    >
                      <Dropdown.Option value="rocky" label="Rocky" />
                      <Dropdown.Option value="ubuntu" label="Ubuntu" />
                      <Dropdown.Option value="windows" label="Windows" />
                      <Dropdown.Option value="other" label="Others" />
                    </Dropdown.Select>
                    {osError && <span className="text-11 text-error">{osError}</span>}
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                {/* OS version */}
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        OS version <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        This metadata helps categorize image.
                      </span>
                    </div>
                    <Input
                      placeholder="e.g. 22.04, 8, 2019"
                      value={osVersion}
                      onChange={(e) => {
                        setOsVersion(e.target.value);
                        setSubmitted(false);
                      }}
                      error={!!osVersionError}
                    />
                    {osVersionError && <span className="text-11 text-error">{osVersionError}</span>}
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                {/* OS admin */}
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">
                        OS admin <span className="text-error">*</span>
                      </span>
                      <span className="text-12 text-text-muted">
                        Enter the default administrator account used when launching instances from
                        this image.
                      </span>
                    </div>
                    <Input
                      placeholder="e.g. ubuntu(ubuntu), administrator(windows)"
                      value={osAdmin}
                      onChange={(e) => {
                        setOsAdmin(e.target.value);
                        setSubmitted(false);
                      }}
                      error={!!osAdminError}
                    />
                    {osAdminError && <span className="text-11 text-error">{osAdminError}</span>}
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                {/* Specification Advanced */}
                <div className="py-6">
                  <Disclosure
                    label="Advanced"
                    expanded={specAdvancedOpen}
                    onExpandChange={setSpecAdvancedOpen}
                  >
                    <div className="flex flex-col gap-6 pt-4">
                      {/* Min system disk */}
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-13 font-medium text-text">Min system disk</span>
                          <span className="text-12 text-text-muted">
                            Defines the minimum disk size required to boot an instance from this
                            image.
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <NumberInput
                            value={minDisk}
                            onChange={(v) => setMinDisk(v)}
                            min={0}
                            max={500}
                            size="sm"
                            suffix="GiB"
                          />
                        </div>
                        <span className="text-11 text-text-subtle">0-500 GiB</span>
                      </div>

                      {/* Min RAM */}
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-13 font-medium text-text">Min RAM</span>
                          <span className="text-12 text-text-muted">
                            Defines the minimum amount of RAM required to boot an instance from this
                            image.
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <NumberInput
                            value={minRam}
                            onChange={(v) => setMinRam(v)}
                            min={0}
                            max={500}
                            size="sm"
                            suffix="GiB"
                          />
                        </div>
                        <span className="text-11 text-text-subtle">0-500 GiB</span>
                      </div>
                    </div>
                  </Disclosure>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Disk format</span>
                  <span className="text-12 text-text">
                    {diskFormat ? diskFormat.toUpperCase() : '-'}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">OS</span>
                  <span className="text-12 text-text">{os || '-'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">OS Version</span>
                  <span className="text-12 text-text">{osVersion || '-'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">OS Admin</span>
                  <span className="text-12 text-text">{osAdmin || '-'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Min system Disk</span>
                  <span className="text-12 text-text">
                    {minDisk !== undefined ? `${minDisk} GiB` : '-'}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Min RAM</span>
                  <span className="text-12 text-text">
                    {minRam !== undefined ? `${minRam} GiB` : '-'}
                  </span>
                </div>
              </div>
            ),
          },
          {
            id: 'advanced' as const,
            label: 'Advanced',
            skippable: true,
            editUI: (
              <div className="flex flex-col gap-0">
                {/* QEMU Guest Agent */}
                <div className="py-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">QEMU guest agent</span>
                      <span className="text-12 text-text-muted">
                        Enables communication and status retrieval between the hypervisor and the
                        instance.
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Toggle
                        checked={qemuGuestAgent}
                        onChange={(e) => setQemuGuestAgent(e.target.checked)}
                      />
                      <span className="text-12 text-text">{qemuGuestAgent ? 'On' : 'Off'}</span>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                {/* CPU policy */}
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">CPU policy</span>
                      <span className="text-12 text-text-muted">
                        Policy that defines how vCPUs are allocated.
                      </span>
                    </div>
                    <Dropdown.Select value={cpuPolicy} onChange={(v) => setCpuPolicy(String(v))}>
                      <Dropdown.Option value="none" label="None" />
                      <Dropdown.Option value="dedicated" label="Dedicated" />
                      <Dropdown.Option value="shared" label="Shared" />
                    </Dropdown.Select>
                  </div>
                </div>

                <div className="w-full h-px bg-border-muted" />

                {/* CPU thread policy */}
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-13 font-medium text-text">CPU thread policy</span>
                      <span className="text-12 text-text-muted">
                        Policy defining how hyperthreads are used for vCPU placement.
                      </span>
                    </div>
                    <Dropdown.Select
                      value={cpuThreadPolicy}
                      onChange={(v) => setCpuThreadPolicy(String(v))}
                    >
                      <Dropdown.Option value="none" label="None" />
                      <Dropdown.Option value="prefer" label="Prefer" />
                      <Dropdown.Option value="isolate" label="Isolate" />
                      <Dropdown.Option value="require" label="Require" />
                    </Dropdown.Select>
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">QEMU Guest Agent</span>
                  <span className="text-12 text-text">{qemuGuestAgent ? 'On' : 'Off'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">CPU Policy</span>
                  <span className="text-12 text-text">
                    {cpuPolicy === 'none' ? 'None' : capitalize(cpuPolicy)}
                  </span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">CPU Thread Policy</span>
                  <span className="text-12 text-text">
                    {cpuThreadPolicy === 'none' ? 'None' : capitalize(cpuThreadPolicy)}
                  </span>
                </div>
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
            navigate('/compute/images');
          }}
          onCancel={() => setConfirmOpen(false)}
          actionConfig={{
            title: 'Create image',
            subtitle: 'This is UI-only. No actual image will be created.',
            actionButtonText: 'OK',
            actionButtonVariant: 'primary',
          }}
        />
      )}
    </CreateLayout>
  );
}
