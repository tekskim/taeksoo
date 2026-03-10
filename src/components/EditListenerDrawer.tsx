import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  Input,
  Textarea,
  NumberInput,
  Toggle,
  Checkbox,
  FormField,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { RadioGroup, Radio } from '@/design-system/components/Radio';
import { IconChevronDown, IconChevronRight, IconCirclePlus, IconX } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type ConnectionLimitType = 'unlimited' | 'limited';

export interface ListenerInfo {
  id: string;
  name: string;
  description?: string;
  protocol: string; // Read-only
  port: number; // Read-only
  connectionLimit: number; // -1 means unlimited
  xForwardedFor?: boolean;
  xForwardedPort?: boolean;
  clientDataTimeout?: number;
  memberConnectTimeout?: number;
  memberDataTimeout?: number;
  tcpInspectTimeout?: number;
  allowedCidrs?: string[];
  adminStateUp: boolean;
}

export interface EditListenerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  listener: ListenerInfo;
  onSubmit?: (data: {
    name: string;
    description: string;
    connectionLimit: number;
    xForwardedFor: boolean;
    xForwardedPort: boolean;
    clientDataTimeout: number;
    memberConnectTimeout: number;
    memberDataTimeout: number;
    tcpInspectTimeout: number;
    allowedCidrs: string[];
    adminStateUp: boolean;
  }) => void;
}

/* ----------------------------------------
   EditListenerDrawer Component
   ---------------------------------------- */

export function EditListenerDrawer({
  isOpen,
  onClose,
  listener,
  onSubmit,
}: EditListenerDrawerProps) {
  const [listenerName, setListenerName] = useState(listener.name);
  const [description, setDescription] = useState(listener.description || '');
  const [connectionLimitType, setConnectionLimitType] = useState<ConnectionLimitType>(
    listener.connectionLimit === -1 ? 'unlimited' : 'limited'
  );
  const [connectionLimitValue, setConnectionLimitValue] = useState(
    listener.connectionLimit === -1 ? 1000 : listener.connectionLimit
  );
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(false);

  // Advanced options
  const [xForwardedFor, setXForwardedFor] = useState(listener.xForwardedFor ?? false);
  const [xForwardedPort, setXForwardedPort] = useState(listener.xForwardedPort ?? false);
  const [clientDataTimeout, setClientDataTimeout] = useState(listener.clientDataTimeout ?? 50000);
  const [memberConnectTimeout, setMemberConnectTimeout] = useState(
    listener.memberConnectTimeout ?? 50000
  );
  const [memberDataTimeout, setMemberDataTimeout] = useState(listener.memberDataTimeout ?? 50000);
  const [tcpInspectTimeout, setTcpInspectTimeout] = useState(listener.tcpInspectTimeout ?? 0);
  const [allowedCidrs, setAllowedCidrs] = useState<string[]>(listener.allowedCidrs ?? []);
  const [adminStateUp, setAdminStateUp] = useState(listener.adminStateUp);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setListenerName(listener.name);
      setDescription(listener.description || '');
      setConnectionLimitType(listener.connectionLimit === -1 ? 'unlimited' : 'limited');
      setConnectionLimitValue(listener.connectionLimit === -1 ? 1000 : listener.connectionLimit);
      setIsAdvancedExpanded(false);
      setXForwardedFor(listener.xForwardedFor ?? false);
      setXForwardedPort(listener.xForwardedPort ?? false);
      setClientDataTimeout(listener.clientDataTimeout ?? 50000);
      setMemberConnectTimeout(listener.memberConnectTimeout ?? 50000);
      setMemberDataTimeout(listener.memberDataTimeout ?? 50000);
      setTcpInspectTimeout(listener.tcpInspectTimeout ?? 0);
      setAllowedCidrs(listener.allowedCidrs ?? []);
      setAdminStateUp(listener.adminStateUp);
      setHasAttemptedSubmit(false);
      setNameError(null);
    }
  }, [isOpen, listener]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!listenerName.trim()) {
      setNameError('Listener name is required');
      return;
    }
    if (listenerName.trim().length > 128) {
      setNameError('Listener name must be 128 characters or fewer');
      return;
    }
    setNameError(null);

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        name: listenerName,
        description,
        connectionLimit: connectionLimitType === 'unlimited' ? -1 : connectionLimitValue,
        xForwardedFor,
        xForwardedPort,
        clientDataTimeout,
        memberConnectTimeout,
        memberDataTimeout,
        tcpInspectTimeout,
        allowedCidrs,
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

  const handleAddCidr = () => {
    setAllowedCidrs([...allowedCidrs, '']);
  };

  const handleUpdateCidr = (index: number, value: string) => {
    const updated = [...allowedCidrs];
    updated[index] = value;
    setAllowedCidrs(updated);
  };

  const handleRemoveCidr = (index: number) => {
    setAllowedCidrs(allowedCidrs.filter((_, i) => i !== index));
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit listener"
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
        {/* Listener Name */}
        <FormField required error={hasAttemptedSubmit && !!nameError}>
          <FormField.Label>Listener name</FormField.Label>
          <FormField.Control>
            <Input
              value={listenerName}
              onChange={(e) => {
                setListenerName(e.target.value);
                if (nameError) setNameError(null);
              }}
              placeholder="e.g. listener-http-80"
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

        {/* Description */}
        <FormField>
          <FormField.Label>Description</FormField.Label>
          <FormField.Control>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. NIC for frontend instance"
              fullWidth
            />
          </FormField.Control>
          <FormField.HelperText>
            You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255
            characters.
          </FormField.HelperText>
        </FormField>

        {/* Protocol (Read-only) */}
        <FormField>
          <FormField.Label>Protocol</FormField.Label>
          <FormField.Control>
            <Input value={listener.protocol} readOnly fullWidth />
          </FormField.Control>
        </FormField>

        {/* Port (Read-only) */}
        <FormField>
          <FormField.Label>Port</FormField.Label>
          <FormField.Control>
            <Input value={String(listener.port)} readOnly fullWidth />
          </FormField.Control>
        </FormField>

        {/* Connection limit */}
        <FormField required>
          <FormField.Label>Connection limit</FormField.Label>
          <FormField.Control>
            <VStack gap={3} className="w-full">
              <RadioGroup
                value={connectionLimitType}
                onChange={(value) => setConnectionLimitType(value as ConnectionLimitType)}
              >
                <Radio value="unlimited">Unlimited</Radio>
                <Radio value="limited">Limited</Radio>
              </RadioGroup>

              {connectionLimitType === 'limited' && (
                <NumberInput
                  value={connectionLimitValue}
                  onChange={(value) => setConnectionLimitValue(value ?? 0)}
                  min={0}
                  placeholder="Enter connection limit"
                  width="sm"
                />
              )}
            </VStack>
          </FormField.Control>
        </FormField>

        {/* Listener Admin State */}
        <FormField
          label="Admin state"
          description="Set the administrative state of the listener. 'UP' enables traffic handling, while 'DOWN' disables it."
          spacing="loose"
        >
          <HStack gap={2} className="items-center">
            <Toggle checked={adminStateUp} onChange={(e) => setAdminStateUp(e.target.checked)} />
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              {adminStateUp ? 'Up' : 'Down'}
            </span>
          </HStack>
        </FormField>

        {/* Advanced Section (Collapsible) */}
        <VStack gap={2} className="w-full">
          <button
            type="button"
            onClick={() => setIsAdvancedExpanded(!isAdvancedExpanded)}
            className="flex items-center gap-1.5 text-label-lg text-[var(--color-text-default)] leading-5"
          >
            {isAdvancedExpanded ? (
              <IconChevronDown size={16} stroke={1} />
            ) : (
              <IconChevronRight size={16} stroke={1} />
            )}
            Advanced
          </button>

          {isAdvancedExpanded && (
            <VStack gap={6} className="w-full pt-4">
              {/* Custom Headers */}
              <FormField>
                <FormField.Label>Custom Headers</FormField.Label>
                <FormField.Description>
                  Defines custom header values to be forwarded to backend servers.
                </FormField.Description>
                <FormField.Control>
                  <VStack gap={3}>
                    <Checkbox
                      checked={xForwardedFor}
                      onChange={(e) => setXForwardedFor(e.target.checked)}
                      label="X-Forwarded-For"
                    />
                    <Checkbox
                      checked={xForwardedPort}
                      onChange={(e) => setXForwardedPort(e.target.checked)}
                      label="X-Forwarded-Port"
                    />
                  </VStack>
                </FormField.Control>
              </FormField>

              {/* Client Data Timeout */}
              <FormField>
                <FormField.Label>Client data timeout (ms)</FormField.Label>
                <FormField.Description>
                  Maximum time to wait for client request data.
                </FormField.Description>
                <FormField.Control>
                  <NumberInput
                    value={clientDataTimeout}
                    onChange={(value) => setClientDataTimeout(value ?? 0)}
                    min={0}
                    width="sm"
                  />
                </FormField.Control>
              </FormField>

              {/* Member Connect Timeout */}
              <FormField>
                <FormField.Label>Member connect timeout (ms)</FormField.Label>
                <FormField.Description>
                  Maximum time to wait when establishing a connection to a backend member.
                </FormField.Description>
                <FormField.Control>
                  <NumberInput
                    value={memberConnectTimeout}
                    onChange={(value) => setMemberConnectTimeout(value ?? 0)}
                    min={0}
                    width="sm"
                  />
                </FormField.Control>
              </FormField>

              {/* Member Data Timeout */}
              <FormField>
                <FormField.Label>Member data timeout (ms)</FormField.Label>
                <FormField.Description>
                  Maximum time to wait for response data from a backend member.
                </FormField.Description>
                <FormField.Control>
                  <NumberInput
                    value={memberDataTimeout}
                    onChange={(value) => setMemberDataTimeout(value ?? 0)}
                    min={0}
                    width="sm"
                  />
                </FormField.Control>
              </FormField>

              {/* TCP Inspect Timeout */}
              <FormField>
                <FormField.Label>TCP inspect timeout (ms)</FormField.Label>
                <FormField.Description>
                  Timeout for TCP packet inspection or handshake. 0 disables this feature.
                </FormField.Description>
                <FormField.Control>
                  <NumberInput
                    value={tcpInspectTimeout}
                    onChange={(value) => setTcpInspectTimeout(value ?? 0)}
                    min={0}
                    width="sm"
                  />
                </FormField.Control>
              </FormField>

              {/* Allowed CIDRs */}
              <FormField>
                <FormField.Label>Allowed CIDRs</FormField.Label>
                <FormField.Description>
                  Defines the client IP ranges allowed to access the listener.
                </FormField.Description>
                <FormField.Control>
                  <VStack gap={2} className="w-full">
                    {/* CIDR List */}
                    {allowedCidrs.map((cidr, index) => (
                      <HStack
                        key={index}
                        gap={3}
                        align="center"
                        className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-2"
                      >
                        <HStack gap={1.5} align="center" className="flex-1 min-w-0">
                          <span className="text-label-lg text-[var(--color-text-default)] shrink-0">
                            CIDR
                          </span>
                          <Input
                            value={cidr}
                            onChange={(e) => handleUpdateCidr(index, e.target.value)}
                            placeholder="e.g. 10.62.0.32/24"
                            fullWidth
                          />
                        </HStack>
                        <button
                          type="button"
                          onClick={() => handleRemoveCidr(index)}
                          className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                        >
                          <IconX size={14} className="text-[var(--color-text-muted)]" />
                        </button>
                      </HStack>
                    ))}
                    <div className="w-fit">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleAddCidr}
                        leftIcon={<IconCirclePlus size={12} />}
                      >
                        Add CIDR
                      </Button>
                    </div>
                  </VStack>
                </FormField.Control>
              </FormField>
            </VStack>
          )}
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default EditListenerDrawer;
