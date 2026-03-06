import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  Input,
  Textarea,
  Select,
  Toggle,
  FormField,
  Radio,
  RadioGroup,
} from '@/design-system';
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
  { value: 'ROUND_ROBIN', label: 'Round robin' },
  { value: 'LEAST_CONNECTIONS', label: 'Least connections' },
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
  { value: 'HTTP_COOKIE', label: 'HTTP cookie' },
  { value: 'APP_COOKIE', label: 'App cookie' },
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
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

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
      setHasAttemptedSubmit(false);
      setNameError(null);
    }
  }, [isOpen, pool]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!name.trim()) {
      setNameError('Pool name is required');
      return;
    }
    if (name.trim().length > 128) {
      setNameError('Pool name must be 128 characters or fewer');
      return;
    }
    setNameError(null);

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
    setHasAttemptedSubmit(false);
    setNameError(null);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit pool"
      width={360}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="pb-6">
        {/* Pool Name Input */}
        <FormField required error={hasAttemptedSubmit && !!nameError}>
          <FormField.Label>Pool name</FormField.Label>
          <FormField.Control>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(null);
              }}
              placeholder="e.g. pool-http"
              fullWidth
              error={hasAttemptedSubmit && !!nameError}
            />
          </FormField.Control>
          <FormField.ErrorMessage>{nameError}</FormField.ErrorMessage>
          <FormField.HelperText>
            You can use letters, numbers, and special characters (+=,.@-_), and the length must be
            between 2-128 characters.
          </FormField.HelperText>
        </FormField>

        {/* Description Input */}
        <FormField>
          <FormField.Label>Pool description</FormField.Label>
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

        {/* Algorithm Select */}
        <FormField required>
          <FormField.Label>Algorithm</FormField.Label>
          <FormField.Description>
            Select how incoming requests are distributed across backend members. The chosen
            algorithm determines how traffic is routed to each server.
          </FormField.Description>
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
            <Input value={pool.protocol} disabled fullWidth />
          </FormField.Control>
        </FormField>

        {/* Admin State */}
        <FormField
          label="Admin state"
          description="Set the administrative state of the pool. 'UP' enables traffic handling, while 'DOWN' disables it."
          spacing="loose"
        >
          <HStack gap={2} className="items-center">
            <Toggle checked={adminStateUp} onChange={(e) => setAdminStateUp(e.target.checked)} />
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              {adminStateUp ? 'Up' : 'Down'}
            </span>
          </HStack>
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
            Advanced
          </button>

          {isSessionPersistenceExpanded && (
            <VStack gap={2} className="w-full">
              <VStack gap={1}>
                <span className="text-label-lg text-[var(--color-text-default)]">
                  Session persistence
                </span>
                <span className="text-body-md text-[var(--color-text-subtle)]">
                  Select the protocol used to communicate with backend members. It must match or be
                  compatible with the listener's protocol.
                </span>
              </VStack>
              <RadioGroup
                value={sessionPersistenceType}
                onChange={(value) => setSessionPersistenceType(value as SessionPersistenceType)}
              >
                <VStack gap={2}>
                  <Radio value="NONE" label="None" />
                  <Radio value="SOURCE_IP" label="Source IP" />
                  <Radio value="HTTP_COOKIE" label="HTTP cookie" />
                  <Radio value="APP_COOKIE" label="App cookie" />
                </VStack>
              </RadioGroup>

              {sessionPersistenceType === 'APP_COOKIE' && (
                <FormField>
                  <FormField.Control>
                    <Input
                      value={cookieName}
                      onChange={(e) => setCookieName(e.target.value)}
                      placeholder="Enter cookie name"
                      fullWidth
                    />
                  </FormField.Control>
                  <FormField.HelperText>
                    You can use letters, numbers, and special characters (+.-_!#$%&amp;'*^|~).
                  </FormField.HelperText>
                </FormField>
              )}
            </VStack>
          )}
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default EditPoolDrawer;
