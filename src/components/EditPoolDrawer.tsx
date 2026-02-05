import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Select, Toggle, Textarea, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type AlgorithmType = 'ROUND_ROBIN' | 'LEAST_CONNECTIONS' | 'SOURCE_IP';
type SessionPersistenceType = 'NONE' | 'SOURCE_IP' | 'HTTP_COOKIE' | 'APP_COOKIE';

export interface PoolInfo {
  id: string;
  name: string;
  description?: string;
  algorithm: AlgorithmType;
  protocol: string;
  sessionPersistenceType?: SessionPersistenceType;
  sessionPersistenceCookieName?: string;
  tlsEnabled?: boolean;
  tlsCiphers?: string;
  adminStateUp?: boolean;
}

export interface EditPoolDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pool: PoolInfo;
  onSubmit?: (data: {
    name: string;
    description: string;
    algorithm: AlgorithmType;
    sessionPersistenceType: SessionPersistenceType;
    sessionPersistenceCookieName?: string;
    tlsEnabled: boolean;
    tlsCiphers?: string;
    adminStateUp: boolean;
  }) => void;
}

/* ----------------------------------------
   Constants
   ---------------------------------------- */

const algorithmOptions = [
  { value: 'ROUND_ROBIN', label: 'Round Robin' },
  { value: 'LEAST_CONNECTIONS', label: 'Least Connections' },
  { value: 'SOURCE_IP', label: 'Source IP' },
];

const algorithmDescriptions: Record<AlgorithmType, string> = {
  ROUND_ROBIN:
    'Round Robin : Each new connection request is assigned to the next server in order, ensuring even distribution. Best for short-lived HTTP connections.',
  LEAST_CONNECTIONS:
    'Least Connections : Routes requests to the server with the fewest active connections. Ideal for long-lived connections.',
  SOURCE_IP:
    'Source IP : Routes requests from the same client IP to the same backend server. Good for stateful applications.',
};

const sessionPersistenceOptions = [
  { value: 'NONE', label: 'None' },
  { value: 'SOURCE_IP', label: 'Source IP' },
  { value: 'HTTP_COOKIE', label: 'HTTP Cookie' },
  { value: 'APP_COOKIE', label: 'App Cookie' },
];

/* ----------------------------------------
   EditPoolDrawer Component
   ---------------------------------------- */

export function EditPoolDrawer({ isOpen, onClose, pool, onSubmit }: EditPoolDrawerProps) {
  const [name, setName] = useState(pool.name);
  const [description, setDescription] = useState(pool.description || '');
  const [algorithm, setAlgorithm] = useState<AlgorithmType>(pool.algorithm);
  const [sessionPersistenceType, setSessionPersistenceType] = useState<SessionPersistenceType>(
    pool.sessionPersistenceType || 'NONE'
  );
  const [cookieName, setCookieName] = useState(pool.sessionPersistenceCookieName || '');
  const [tlsEnabled, setTlsEnabled] = useState(pool.tlsEnabled ?? false);
  const [tlsCiphers, setTlsCiphers] = useState(pool.tlsCiphers || '');
  const [adminStateUp, setAdminStateUp] = useState(pool.adminStateUp ?? true);
  const [isSessionPersistenceExpanded, setIsSessionPersistenceExpanded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when drawer opens or pool changes
  useEffect(() => {
    if (isOpen) {
      setName(pool.name);
      setDescription(pool.description || '');
      setAlgorithm(pool.algorithm);
      setSessionPersistenceType(pool.sessionPersistenceType || 'NONE');
      setCookieName(pool.sessionPersistenceCookieName || '');
      setTlsEnabled(pool.tlsEnabled ?? false);
      setTlsCiphers(pool.tlsCiphers || '');
      setAdminStateUp(pool.adminStateUp ?? true);
      setIsSessionPersistenceExpanded(true);
    }
  }, [isOpen, pool]);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        name,
        description,
        algorithm,
        sessionPersistenceType,
        sessionPersistenceCookieName:
          sessionPersistenceType === 'APP_COOKIE' ? cookieName : undefined,
        tlsEnabled,
        tlsCiphers: tlsEnabled ? tlsCiphers : undefined,
        adminStateUp,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={376}
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
      <VStack gap={6} className="pb-6">
        {/* Header */}
        <VStack gap={2}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">Edit Pool</h2>
        </VStack>

        {/* Pool Name Input */}
        <FormField required>
          <FormField.Label>Pool name</FormField.Label>
          <FormField.Control>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. pool-http"
              fullWidth
            />
          </FormField.Control>
          <FormField.HelperText>
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </FormField.HelperText>
        </FormField>

        {/* Description Input */}
        <FormField>
          <FormField.Label>
            Description{' '}
            <span className="text-body-md text-[var(--color-text-subtle)]">(optional)</span>
          </FormField.Label>
          <FormField.Control>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. For distributing traffic to backend web servers"
              fullWidth
            />
          </FormField.Control>
        </FormField>

        {/* Algorithm Select */}
        <FormField>
          <FormField.Label>Algorithm</FormField.Label>
          <FormField.Control>
            <Select
              value={algorithm}
              onChange={(value) => setAlgorithm(value as AlgorithmType)}
              options={algorithmOptions}
              fullWidth
            />
          </FormField.Control>
          <FormField.HelperText>{algorithmDescriptions[algorithm]}</FormField.HelperText>
        </FormField>

        {/* Protocol (Read-only) */}
        <FormField>
          <FormField.Label>Protocol</FormField.Label>
          <FormField.Control>
            <div className="w-full px-[10px] py-2 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-md">
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                {pool.protocol}
              </span>
            </div>
          </FormField.Control>
        </FormField>

        {/* Session Persistence (Collapsible) */}
        <VStack gap={2} className="w-full">
          <button
            type="button"
            onClick={() => setIsSessionPersistenceExpanded(!isSessionPersistenceExpanded)}
            className="flex items-center gap-1.5 text-label-lg text-[var(--color-text-default)] leading-5"
          >
            {isSessionPersistenceExpanded ? (
              <IconChevronDown size={16} stroke={1} />
            ) : (
              <IconChevronRight size={16} stroke={1} />
            )}
            Lable
          </button>

          {isSessionPersistenceExpanded && (
            <VStack gap={2} className="w-full">
              <Select
                value={sessionPersistenceType}
                onChange={(value) => setSessionPersistenceType(value as SessionPersistenceType)}
                options={sessionPersistenceOptions}
                fullWidth
              />

              {sessionPersistenceType === 'APP_COOKIE' && (
                <FormField>
                  <FormField.Label>Cookie Name</FormField.Label>
                  <FormField.Control>
                    <Input
                      value={cookieName}
                      onChange={(e) => setCookieName(e.target.value)}
                      placeholder="Input Cookie Name"
                      fullWidth
                    />
                  </FormField.Control>
                  <FormField.HelperText>
                    Allowed: 1–64 characters; letters, numbers, "-", "_", "."; No spaces
                  </FormField.HelperText>
                </FormField>
              )}
            </VStack>
          )}
        </VStack>

        {/* Backend TLS */}
        <FormField>
          <FormField.Label>Backend TLS</FormField.Label>
          <FormField.Control>
            <HStack gap={2} className="items-center">
              <Toggle checked={tlsEnabled} onChange={(e) => setTlsEnabled(e.target.checked)} />
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                {tlsEnabled ? 'On' : 'Off'}
              </span>
            </HStack>
          </FormField.Control>
          {tlsEnabled && (
            <>
              <FormField.Control>
                <Textarea
                  value={tlsCiphers}
                  onChange={(e) => setTlsCiphers(e.target.value)}
                  placeholder="Input Custom Cipher String (Leave blank to use safe defaults)"
                  rows={3}
                  fullWidth
                />
              </FormField.Control>
              <FormField.HelperText>
                Use a colon-separated list of cipher names (e.g., CIPHER1:CIPHER2). Spaces and
                special characters are not allowed.
              </FormField.HelperText>
            </>
          )}
        </FormField>

        {/* Admin State */}
        <FormField>
          <FormField.Label>Admin State</FormField.Label>
          <FormField.Control>
            <HStack gap={2} className="items-center">
              <Toggle checked={adminStateUp} onChange={(e) => setAdminStateUp(e.target.checked)} />
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                {adminStateUp ? 'Up' : 'Down'}
              </span>
            </HStack>
          </FormField.Control>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default EditPoolDrawer;
