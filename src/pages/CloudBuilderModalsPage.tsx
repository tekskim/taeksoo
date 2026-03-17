import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, VStack, PageShell, TopBar } from '@/design-system';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { FigmaCaptureWrapper } from '@/components/FigmaCaptureWrapper';

function ModalPreview({
  title,
  description,
  children,
  ...rest
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-xl)] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 flex flex-col gap-4 w-[344px]"
      {...rest}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-heading-h5 text-[var(--color-text-default)]">{title}</h2>
        {description && (
          <p className="text-body-md text-[var(--color-text-subtle)]">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function CategorySection({
  title,
  children,
  defaultOpen = true,
  ...rest
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <VStack gap={4} {...rest}>
      <button
        className="flex items-center gap-2 px-1 cursor-pointer bg-transparent border-none outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <IconChevronDown size={14} className="text-[var(--color-text-muted)]" />
        ) : (
          <IconChevronRight size={14} className="text-[var(--color-text-muted)]" />
        )}
        <span className="text-heading-h6 text-[var(--color-text-default)]">{title}</span>
      </button>
      {isOpen && <div className="flex flex-wrap items-start gap-4">{children}</div>}
    </VStack>
  );
}

export function CloudBuilderModalsPage() {
  const navigate = useNavigate();
  const sidebarWidth = 0;

  const [isFigmaCapture] = useState(
    () => new URLSearchParams(window.location.search).get('figma') === 'true'
  );

  const shellTopBar = (
    <TopBar
      showSidebarToggle={false}
      showNavigation={true}
      onBack={() => navigate(-1)}
      onForward={() => navigate(1)}
    />
  );

  const content = (
    <VStack gap={6}>
      <h1
        className="text-heading-h3 text-[var(--color-text-default)]"
        data-figma-name="[TDS] Title"
        aria-label="[TDS] Title"
      >
        Cloud Builder Modals
      </h1>

      <CategorySection title="Service Status">
        <ModalPreview
          title="Enable compute service"
          description="Change this service status to Enabled?"
          data-figma-name="[TDS] ActionModal-EnableComputeService"
          aria-label="[TDS] ActionModal-EnableComputeService"
        >
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              data-figma-name="[TDS] Button-Cancel"
              aria-label="[TDS] Button-Cancel"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              data-figma-name="[TDS] Button-Enable"
              aria-label="[TDS] Button-Enable"
            >
              Enable
            </Button>
          </div>
        </ModalPreview>

        <ModalPreview
          title="Disable compute service"
          description="Change this service status to Disabled?"
          data-figma-name="[TDS] ActionModal-DisableComputeService-Empty"
          aria-label="[TDS] ActionModal-DisableComputeService-Empty"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <span className="text-label-lg text-[var(--color-text-default)]">
                Reason <span className="text-[var(--color-state-danger)]">*</span>
              </span>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 text-body-md text-[var(--color-text-default)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-sm)] resize-none outline-none focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)]"
                placeholder="Enter a reason for disabling"
              />
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              data-figma-name="[TDS] Button-Cancel"
              aria-label="[TDS] Button-Cancel"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              disabled
              data-figma-name="[TDS] Button-Disable"
              aria-label="[TDS] Button-Disable"
            >
              Disable
            </Button>
          </div>
        </ModalPreview>

        <ModalPreview
          title="Disable compute service"
          description="Change this service status to Disabled?"
          data-figma-name="[TDS] ActionModal-DisableComputeService-Filled"
          aria-label="[TDS] ActionModal-DisableComputeService-Filled"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <span className="text-label-lg text-[var(--color-text-default)]">
                Reason <span className="text-[var(--color-state-danger)]">*</span>
              </span>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 text-body-md text-[var(--color-text-default)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-sm)] resize-none outline-none focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)]"
                defaultValue="Scheduled maintenance window — disabling to perform firmware upgrade on hypervisor node."
              />
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              data-figma-name="[TDS] Button-Cancel"
              aria-label="[TDS] Button-Cancel"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              data-figma-name="[TDS] Button-Disable"
              aria-label="[TDS] Button-Disable"
            >
              Disable
            </Button>
          </div>
        </ModalPreview>
      </CategorySection>

      <CategorySection title="Network Agent">
        <ModalPreview
          title="Enable network agent"
          description="Change this agent status to Enabled?"
          data-figma-name="[TDS] ActionModal-EnableNetworkAgent"
          aria-label="[TDS] ActionModal-EnableNetworkAgent"
        >
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              data-figma-name="[TDS] Button-Cancel"
              aria-label="[TDS] Button-Cancel"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              data-figma-name="[TDS] Button-Enable"
              aria-label="[TDS] Button-Enable"
            >
              Enable
            </Button>
          </div>
        </ModalPreview>

        <ModalPreview
          title="Disable network agent"
          description="Change this agent status to Disabled?"
          data-figma-name="[TDS] ActionModal-DisableNetworkAgent-Empty"
          aria-label="[TDS] ActionModal-DisableNetworkAgent-Empty"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <span className="text-label-lg text-[var(--color-text-default)]">
                Reason <span className="text-[var(--color-state-danger)]">*</span>
              </span>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 text-body-md text-[var(--color-text-default)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-sm)] resize-none outline-none focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)]"
                placeholder="Enter a reason for disabling"
              />
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              data-figma-name="[TDS] Button-Cancel"
              aria-label="[TDS] Button-Cancel"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              disabled
              data-figma-name="[TDS] Button-Disable"
              aria-label="[TDS] Button-Disable"
            >
              Disable
            </Button>
          </div>
        </ModalPreview>

        <ModalPreview
          title="Disable network agent"
          description="Change this agent status to Disabled?"
          data-figma-name="[TDS] ActionModal-DisableNetworkAgent-Filled"
          aria-label="[TDS] ActionModal-DisableNetworkAgent-Filled"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <span className="text-label-lg text-[var(--color-text-default)]">
                Reason <span className="text-[var(--color-state-danger)]">*</span>
              </span>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 text-body-md text-[var(--color-text-default)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-sm)] resize-none outline-none focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)]"
                defaultValue="Agent decommissioning — migrating workloads to new network agent."
              />
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              data-figma-name="[TDS] Button-Cancel"
              aria-label="[TDS] Button-Cancel"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              data-figma-name="[TDS] Button-Disable"
              aria-label="[TDS] Button-Disable"
            >
              Disable
            </Button>
          </div>
        </ModalPreview>
      </CategorySection>

      <CategorySection title="Block Storage Service">
        <ModalPreview
          title="Enable block storage service"
          description="Change this service status to Enabled?"
          data-figma-name="[TDS] ActionModal-EnableBlockStorage"
          aria-label="[TDS] ActionModal-EnableBlockStorage"
        >
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              data-figma-name="[TDS] Button-Cancel"
              aria-label="[TDS] Button-Cancel"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              data-figma-name="[TDS] Button-Enable"
              aria-label="[TDS] Button-Enable"
            >
              Enable
            </Button>
          </div>
        </ModalPreview>

        <ModalPreview
          title="Disable block storage service"
          description="Change this service status to Disabled?"
          data-figma-name="[TDS] ActionModal-DisableBlockStorage-Empty"
          aria-label="[TDS] ActionModal-DisableBlockStorage-Empty"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <span className="text-label-lg text-[var(--color-text-default)]">
                Reason <span className="text-[var(--color-state-danger)]">*</span>
              </span>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 text-body-md text-[var(--color-text-default)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-sm)] resize-none outline-none focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)]"
                placeholder="Enter a reason for disabling"
              />
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              data-figma-name="[TDS] Button-Cancel"
              aria-label="[TDS] Button-Cancel"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              disabled
              data-figma-name="[TDS] Button-Disable"
              aria-label="[TDS] Button-Disable"
            >
              Disable
            </Button>
          </div>
        </ModalPreview>

        <ModalPreview
          title="Disable block storage service"
          description="Change this service status to Disabled?"
          data-figma-name="[TDS] ActionModal-DisableBlockStorage-Filled"
          aria-label="[TDS] ActionModal-DisableBlockStorage-Filled"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <span className="text-label-lg text-[var(--color-text-default)]">
                Reason <span className="text-[var(--color-state-danger)]">*</span>
              </span>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 text-body-md text-[var(--color-text-default)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-sm)] resize-none outline-none focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)]"
                defaultValue="Storage backend replacement — migrating to new Ceph cluster."
              />
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              data-figma-name="[TDS] Button-Cancel"
              aria-label="[TDS] Button-Cancel"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              data-figma-name="[TDS] Button-Disable"
              aria-label="[TDS] Button-Disable"
            >
              Disable
            </Button>
          </div>
        </ModalPreview>
      </CategorySection>
    </VStack>
  );

  if (isFigmaCapture) {
    return (
      <FigmaCaptureWrapper topBar={shellTopBar} contentClassName="pt-4 px-8 pb-20">
        {content}
      </FigmaCaptureWrapper>
    );
  }

  return (
    <PageShell
      sidebar={<div />}
      sidebarWidth={sidebarWidth}
      topBar={shellTopBar}
      contentClassName="pt-4 px-8 pb-20"
    >
      {content}
    </PageShell>
  );
}

export default CloudBuilderModalsPage;
