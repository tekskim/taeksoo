import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@shared/components/Input';
import { NumberInput } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { ActionModal } from '@shared/components/ActionModal';
import { CreateLayout } from '@shared/components/CreateLayout';
import { FloatingCard } from '@shared/components/FloatingCard';
import { Stepper } from '@shared/components/Stepper';
import type { FloatingCardStatus } from '@shared/components/FloatingCard/FloatingCard.types';

const STEP_IDS = ['basic', 'resources', 'advanced'] as const;

export function ComputeAdminCreateFlavorPage() {
  const navigate = useNavigate();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [allComplete, setAllComplete] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [vcpus, setVcpus] = useState(2);
  const [ramGiB, setRamGiB] = useState(4);
  const [diskGiB, setDiskGiB] = useState(20);
  const [swapGiB, setSwapGiB] = useState(0);
  const [ephemeralGiB, setEphemeralGiB] = useState(0);
  const [rxFactor, setRxFactor] = useState(1.0);
  const [txFactor, setTxFactor] = useState(1.0);

  const [stepStatuses, setStepStatuses] = useState<Record<string, FloatingCardStatus>>({
    basic: 'processing',
    resources: 'default',
    advanced: 'default',
  });

  const nameError = submitted && !name.trim() ? 'Please enter a flavor name.' : null;

  const validateBasic = useCallback((): boolean => {
    setSubmitted(true);
    return !!name.trim();
  }, [name]);

  const validateResources = useCallback((): boolean => {
    setSubmitted(true);
    return vcpus >= 1 && ramGiB >= 1 && diskGiB >= 1;
  }, [vcpus, ramGiB, diskGiB]);

  const validateAdvanced = useCallback((): boolean => {
    setSubmitted(true);
    return swapGiB >= 0 && ephemeralGiB >= 0 && rxFactor > 0 && txFactor > 0;
  }, [swapGiB, ephemeralGiB, rxFactor, txFactor]);

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
      title="Create flavor"
      sidebar={
        <FloatingCard
          summaryTitle="Summary"
          sections={[
            {
              items: [
                { label: 'Basic information', status: stepStatuses.basic },
                { label: 'Resources', status: stepStatuses.resources },
                { label: 'Advanced', status: stepStatuses.advanced },
              ],
            },
          ]}
          onCancel={() => navigate('/compute-admin/flavors')}
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
            onComplete: validateBasic,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">
                      Name <span className="text-error">*</span>
                    </span>
                    <Input
                      placeholder="e.g. admin.custom.large"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setSubmitted(false);
                      }}
                      error={!!nameError}
                    />
                    {nameError && <span className="text-11 text-error">{nameError}</span>}
                  </div>
                </div>
                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">Description</span>
                    <Textarea
                      placeholder="Optional description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Name</span>
                  <span className="text-12 text-text">{name || '-'}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Description</span>
                  <span className="text-12 text-text">{description || '-'}</span>
                </div>
              </div>
            ),
          },
          {
            id: 'resources' as const,
            label: 'Resources',
            onComplete: validateResources,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">
                      vCPU <span className="text-error">*</span>
                    </span>
                    <NumberInput
                      value={vcpus}
                      onChange={setVcpus}
                      min={1}
                      max={512}
                      step={1}
                      size="sm"
                    />
                  </div>
                </div>
                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">
                      RAM (GiB) <span className="text-error">*</span>
                    </span>
                    <NumberInput
                      value={ramGiB}
                      onChange={setRamGiB}
                      min={1}
                      max={4096}
                      step={1}
                      size="sm"
                    />
                  </div>
                </div>
                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">
                      Root disk (GiB) <span className="text-error">*</span>
                    </span>
                    <NumberInput
                      value={diskGiB}
                      onChange={setDiskGiB}
                      min={1}
                      max={10240}
                      step={1}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">vCPU</span>
                  <span className="text-12 text-text">{vcpus}</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">RAM</span>
                  <span className="text-12 text-text">{ramGiB} GiB</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Root disk</span>
                  <span className="text-12 text-text">{diskGiB} GiB</span>
                </div>
              </div>
            ),
          },
          {
            id: 'advanced' as const,
            label: 'Advanced',
            onComplete: validateAdvanced,
            editUI: (
              <div className="flex flex-col gap-0">
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">Swap (GiB)</span>
                    <NumberInput
                      value={swapGiB}
                      onChange={setSwapGiB}
                      min={0}
                      max={512}
                      step={1}
                      size="sm"
                    />
                  </div>
                </div>
                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">Ephemeral disk (GiB)</span>
                    <NumberInput
                      value={ephemeralGiB}
                      onChange={setEphemeralGiB}
                      min={0}
                      max={2048}
                      step={1}
                      size="sm"
                    />
                  </div>
                </div>
                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">RX factor</span>
                    <NumberInput
                      value={rxFactor}
                      onChange={setRxFactor}
                      min={0.1}
                      max={10}
                      step={0.1}
                      size="sm"
                    />
                  </div>
                </div>
                <div className="w-full h-px bg-border-muted" />
                <div className="py-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-13 font-medium text-text">TX factor</span>
                    <NumberInput
                      value={txFactor}
                      onChange={setTxFactor}
                      min={0.1}
                      max={10}
                      step={0.1}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            ),
            doneUI: (
              <div className="flex flex-col gap-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Swap</span>
                  <span className="text-12 text-text">{swapGiB} GiB</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">Ephemeral</span>
                  <span className="text-12 text-text">{ephemeralGiB} GiB</span>
                </div>
                <div className="h-px w-full bg-border-muted" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-11 font-medium text-text-muted">RX / TX factor</span>
                  <span className="text-12 text-text">
                    {rxFactor} / {txFactor}
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
            navigate('/compute-admin/flavors');
          }}
          onCancel={() => setConfirmOpen(false)}
          actionConfig={{
            title: 'Create flavor',
            subtitle: 'This is UI-only. No actual flavor will be created.',
            actionButtonText: 'OK',
            actionButtonVariant: 'primary',
          }}
        />
      )}
    </CreateLayout>
  );
}
