import { useState } from 'react';
import {
  Tooltip,
  Drawer,
  VStack,
  HStack,
  Button,
  InfoBox,
  Modal,
  InlineMessage,
  FormField,
  Select,
} from '@/design-system';
import {
  IconPencilCog,
  IconKey,
  IconTerminal2,
  IconFile,
  IconCopy,
  IconSearch,
} from '@tabler/icons-react';

interface ContainerTopBarActionsProps {
  onTerminalClick?: () => void;
  isTerminalActive?: boolean;
}

const btnClass = 'p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors';
const iconClass = 'text-[var(--color-text-muted)]';

export function ContainerTopBarActions({
  onTerminalClick,
  isTerminalActive,
}: ContainerTopBarActionsProps) {
  const [isTokenDrawerOpen, setIsTokenDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showRegenerate, setShowRegenerate] = useState(false);
  const [expiration, setExpiration] = useState('24h');

  return (
    <>
      <Tooltip content="Cluster appearance" position="bottom">
        <button
          className={btnClass}
          onClick={() => window.dispatchEvent(new CustomEvent('open-cluster-appearance'))}
          aria-label="Cluster appearance"
        >
          <IconPencilCog size={16} className={iconClass} stroke={1.5} />
        </button>
      </Tooltip>
      <Tooltip content="Access token" position="bottom">
        <button
          className={btnClass}
          onClick={() => setIsTokenDrawerOpen(true)}
          aria-label="Access token"
        >
          <IconKey size={16} className={iconClass} stroke={1.5} />
        </button>
      </Tooltip>
      <Tooltip content="Kubectl shell" position="bottom">
        <button className={btnClass} onClick={onTerminalClick} aria-label="Kubectl shell">
          <IconTerminal2
            size={16}
            className={isTerminalActive ? 'text-[var(--color-action-primary)]' : iconClass}
            stroke={1.5}
          />
        </button>
      </Tooltip>
      <Tooltip content="Download KubeConfig" position="bottom">
        <button className={btnClass} aria-label="Download KubeConfig">
          <IconFile size={16} className={iconClass} stroke={1.5} />
        </button>
      </Tooltip>
      <Tooltip content="Copy Kubeconfig to clipboard" position="bottom">
        <button className={btnClass} aria-label="Copy Kubeconfig to clipboard">
          <IconCopy size={16} className={iconClass} stroke={1.5} />
        </button>
      </Tooltip>
      <Tooltip content="ResourceType search" position="bottom">
        <button className={btnClass} aria-label="ResourceType search">
          <IconSearch size={16} className={iconClass} stroke={1.5} />
        </button>
      </Tooltip>

      <Drawer
        isOpen={isTokenDrawerOpen}
        onClose={() => {
          setIsTokenDrawerOpen(false);
          setShowRegenerate(false);
        }}
        title="Access Token"
        description="Manage your personal access token for this cluster."
        width={320}
        footer={
          <Button
            variant="secondary"
            onClick={() => {
              setIsTokenDrawerOpen(false);
              setShowRegenerate(false);
            }}
            className="w-full"
          >
            Close
          </Button>
        }
      >
        <VStack gap={6}>
          <InfoBox label="Cluster" value="Cluster1" />

          <Button
            variant="primary"
            className="w-full"
            onClick={() => setShowRegenerate(!showRegenerate)}
          >
            Regenerate token
          </Button>

          {showRegenerate && (
            <VStack
              gap={4}
              className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4"
            >
              <InlineMessage variant="warning">
                Make sure to copy your token now as you will not be able to see it again.
              </InlineMessage>

              <FormField
                label="Expiration"
                helperText="Expired tokens cannot be renewed – generate a new token instead."
              >
                <Select
                  options={[
                    { value: '1h', label: '1 hour' },
                    { value: '6h', label: '6 hours' },
                    { value: '24h', label: '24 hours (recommended)' },
                    { value: '7d', label: '7 days' },
                    { value: '30d', label: '30 days' },
                  ]}
                  value={expiration}
                  onChange={(val) => setExpiration(val)}
                  fullWidth
                />
              </FormField>

              <HStack gap={2} className="w-full">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowRegenerate(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1">
                  Regenerate token
                </Button>
              </HStack>
            </VStack>
          )}

          <VStack
            gap={4}
            className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4"
          >
            <span className="text-heading-h6 text-[var(--color-text-default)]">cluster1-token</span>
            <InfoBox.Group>
              <InfoBox label="Created on" value="Mar 31, 2026" />
              <InfoBox label="Expires on" value="Apr 30, 2026" />
            </InfoBox.Group>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete
            </Button>
          </VStack>
        </VStack>
      </Drawer>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete token"
        description=""
        size="sm"
      >
        <InfoBox label="Cluster" value="Cluster1" />
        <InlineMessage variant="error">
          This action cannot be undone. You will need to regenerate a new token to access the
          cluster.
        </InlineMessage>
        <div className="flex gap-2 w-full">
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setIsDeleteModalOpen(false);
              setIsTokenDrawerOpen(false);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
