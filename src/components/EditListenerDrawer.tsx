import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Toggle, Checkbox, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { RadioGroup, Radio } from '@/design-system/components/Radio';
import { IconChevronDown, IconChevronRight, IconPlus, IconX } from '@tabler/icons-react';

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
  const [newCidr, setNewCidr] = useState('');
  const [adminStateUp, setAdminStateUp] = useState(listener.adminStateUp);

  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setNewCidr('');
      setAdminStateUp(listener.adminStateUp);
    }
  }, [isOpen, listener]);

  const handleSubmit = async () => {
    if (!listenerName.trim()) return;

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
    onClose();
  };

  const handleAddCidr = () => {
    if (newCidr.trim() && !allowedCidrs.includes(newCidr.trim())) {
      setAllowedCidrs([...allowedCidrs, newCidr.trim()]);
      setNewCidr('');
    }
  };

  const handleRemoveCidr = (cidr: string) => {
    setAllowedCidrs(allowedCidrs.filter((c) => c !== cidr));
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
          <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
            Edit Listener
          </h2>
        </VStack>

        {/* Listener Name */}
        <FormField required>
          <FormField.Label>Listener Name</FormField.Label>
          <FormField.Control>
            <Input
              value={listenerName}
              onChange={(e) => setListenerName(e.target.value)}
              placeholder="e.g. listener-http-80"
              fullWidth
            />
          </FormField.Control>
          <FormField.HelperText>
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </FormField.HelperText>
        </FormField>

        {/* Description */}
        <FormField>
          <FormField.Label>
            Description{' '}
            <span className="text-body-md text-[var(--color-text-subtle)]">(optional)</span>
          </FormField.Label>
          <FormField.Control>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. NIC for frontend instance"
              fullWidth
            />
          </FormField.Control>
        </FormField>

        {/* Protocol (Read-only) */}
        <FormField>
          <FormField.Label>Protocol</FormField.Label>
          <FormField.Control>
            <Input value={listener.protocol} readOnly disabled fullWidth />
          </FormField.Control>
        </FormField>

        {/* Port (Read-only) */}
        <FormField>
          <FormField.Label>Port</FormField.Label>
          <FormField.Control>
            <Input value={String(listener.port)} readOnly disabled fullWidth />
          </FormField.Control>
        </FormField>

        {/* Connection Limit */}
        <VStack gap={3} className="w-full">
          <label className="text-label-lg text-[var(--color-text-default)] leading-5">
            Connection Limit
          </label>
          <RadioGroup
            value={connectionLimitType}
            onChange={(value) => setConnectionLimitType(value as ConnectionLimitType)}
          >
            <Radio value="unlimited">Unlimited</Radio>
            <Radio value="limited">Limited</Radio>
          </RadioGroup>

          {connectionLimitType === 'limited' && (
            <Input
              type="number"
              value={String(connectionLimitValue)}
              onChange={(e) => setConnectionLimitValue(parseInt(e.target.value) || 0)}
              placeholder="Enter connection limit"
              fullWidth
            />
          )}
        </VStack>

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
            <span className="text-body-md text-[var(--color-text-subtle)] font-normal">
              (Optional)
            </span>
          </button>

          {isAdvancedExpanded && (
            <VStack gap={6} className="w-full pt-4">
              {/* Custom Headers */}
              <VStack gap={3} className="w-full">
                <label className="text-label-lg text-[var(--color-text-default)] leading-5">
                  Custom Headers
                </label>
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
              </VStack>

              {/* Client Data Timeout */}
              <FormField>
                <FormField.Label>Client Data Timeout (ms)</FormField.Label>
                <FormField.Description>
                  Maximum time to wait for client request data.
                </FormField.Description>
                <FormField.Control>
                  <Input
                    type="number"
                    value={String(clientDataTimeout)}
                    onChange={(e) => setClientDataTimeout(parseInt(e.target.value) || 0)}
                    fullWidth
                  />
                </FormField.Control>
              </FormField>

              {/* Member Connect Timeout */}
              <FormField>
                <FormField.Label>Member Connect Timeout (ms)</FormField.Label>
                <FormField.Description>
                  Maximum time to wait when establishing a connection to a backend member.
                </FormField.Description>
                <FormField.Control>
                  <Input
                    type="number"
                    value={String(memberConnectTimeout)}
                    onChange={(e) => setMemberConnectTimeout(parseInt(e.target.value) || 0)}
                    fullWidth
                  />
                </FormField.Control>
              </FormField>

              {/* Member Data Timeout */}
              <FormField>
                <FormField.Label>Member Data Timeout (ms)</FormField.Label>
                <FormField.Description>
                  Maximum time to wait for response data from a backend member.
                </FormField.Description>
                <FormField.Control>
                  <Input
                    type="number"
                    value={String(memberDataTimeout)}
                    onChange={(e) => setMemberDataTimeout(parseInt(e.target.value) || 0)}
                    fullWidth
                  />
                </FormField.Control>
              </FormField>

              {/* TCP Inspect Timeout */}
              <FormField>
                <FormField.Label>TCP Inspect Timeout (ms)</FormField.Label>
                <FormField.Description>
                  Timeout for TCP packet inspection or handshake. 0 disables this feature.
                </FormField.Description>
                <FormField.Control>
                  <Input
                    type="number"
                    value={String(tcpInspectTimeout)}
                    onChange={(e) => setTcpInspectTimeout(parseInt(e.target.value) || 0)}
                    fullWidth
                  />
                </FormField.Control>
              </FormField>

              {/* Allowed CIDRs */}
              <VStack gap={2} className="w-full">
                <label className="text-label-lg text-[var(--color-text-default)] leading-5">
                  Allowed CIDRs
                </label>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAddCidr}
                  className="self-start"
                >
                  <IconPlus size={16} />
                  Add CIDR
                </Button>

                {/* CIDR Input Row */}
                {allowedCidrs.length === 0 && (
                  <HStack
                    gap={3}
                    className="w-full items-center bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md px-4 py-2"
                  >
                    <span className="text-label-lg text-[var(--color-text-default)]">Key</span>
                    <Input
                      value={newCidr}
                      onChange={(e) => setNewCidr(e.target.value)}
                      placeholder="e.g. 10.62.0.32/24"
                      fullWidth
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddCidr();
                        }
                      }}
                    />
                  </HStack>
                )}

                {/* CIDR List */}
                {allowedCidrs.map((cidr, index) => (
                  <HStack
                    key={index}
                    gap={3}
                    className="w-full items-center bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md px-4 py-2"
                  >
                    <span className="text-label-lg text-[var(--color-text-default)]">Key</span>
                    <div className="flex-1 px-2.5 py-2 bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-md text-body-md text-[var(--color-text-default)]">
                      {cidr}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCidr(cidr)}
                      className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                    >
                      <IconX size={16} className="text-[var(--color-text-default)]" />
                    </button>
                  </HStack>
                ))}

                {allowedCidrs.length > 0 && (
                  <HStack
                    gap={3}
                    className="w-full items-center bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md px-4 py-2"
                  >
                    <span className="text-label-lg text-[var(--color-text-default)]">Key</span>
                    <Input
                      value={newCidr}
                      onChange={(e) => setNewCidr(e.target.value)}
                      placeholder="e.g. 10.62.0.32/24"
                      fullWidth
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddCidr();
                        }
                      }}
                    />
                  </HStack>
                )}
              </VStack>

              {/* Listener Admin State */}
              <FormField>
                <FormField.Label>Listener Admin State</FormField.Label>
                <FormField.Control>
                  <HStack gap={2} className="items-center">
                    <Toggle
                      checked={adminStateUp}
                      onChange={(e) => setAdminStateUp(e.target.checked)}
                    />
                    <span className="text-body-md text-[var(--color-text-default)] leading-4">
                      {adminStateUp ? 'Up' : 'Down'}
                    </span>
                  </HStack>
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
