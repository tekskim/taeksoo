import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  DatePicker,
  Drawer,
  FormField,
  HStack,
  InfoBox,
  Pagination,
  RadioGroup,
  SearchInput,
  Select,
  StatusIndicator,
  Table,
  Textarea,
  VStack,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { IconCalendar, IconExternalLink } from '@tabler/icons-react';
import { InlineCopyId } from '@/components/InlineCopyId';

const mockUsers = [
  { id: 'user-1', username: 'admin_user', status: 'active' as const, userId: 'ID:USR-001' },
  { id: 'user-2', username: 'dev_user', status: 'active' as const, userId: 'ID:USR-002' },
  { id: 'user-3', username: 'viewer_user', status: 'active' as const, userId: 'ID:USR-003' },
  { id: 'user-4', username: 'test_user', status: 'active' as const, userId: 'ID:USR-004' },
  { id: 'user-5', username: 'ops_user', status: 'active' as const, userId: 'ID:USR-005' },
];

const durationOptions = [
  { value: '15m', label: '15 minutes' },
  { value: '30m', label: '30 minutes' },
  { value: '45m', label: '45 minutes' },
  { value: '1h', label: '1 hour (Default)' },
  { value: '1h30m', label: '1 hour 30 minutes' },
  { value: '2h', label: '2 hours' },
  { value: '3h', label: '3 hours' },
  { value: '4h', label: '4 hours' },
  { value: '6h', label: '6 hours' },
  { value: '8h', label: '8 hours' },
  { value: '10h', label: '10 hours' },
  { value: '12h', label: '12 hours' },
];

interface MockUser {
  id: string;
  username: string;
  status: 'active';
  userId: string;
}

function getPrincipalColumns(type: 'user' | 'service-account'): TableColumn<MockUser>[] {
  return [
    {
      key: 'status',
      label: 'Status',
      width: '60px',
      align: 'center',
      render: (_val, row) => <StatusIndicator status={row.status} layout="icon-only" />,
    },
    {
      key: 'username',
      label: type === 'user' ? 'Username' : 'Name',
      flex: 1,
      sortable: true,
      render: (_val, row) => (
        <VStack gap={0.5} align="start" className="min-w-0">
          <button
            type="button"
            className="inline-flex items-center gap-1 min-w-0 text-label-md text-[var(--color-action-primary)] hover:underline bg-transparent border-0 p-0 cursor-pointer text-left"
          >
            <span className="truncate">{row.username}</span>
            <IconExternalLink size={12} className="shrink-0" aria-hidden />
          </button>
          <span className="inline-flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)] truncate w-full">
            {row.userId}
            <InlineCopyId value={row.userId} />
          </span>
        </VStack>
      ),
    },
  ];
}

const PRINCIPAL_PAGE_SIZE = 3;

function formatDateTag(d: Date) {
  const month = d.toLocaleString('en-US', { month: 'short' });
  const day = d.getDate().toString().padStart(2, '0');
  const year = d.getFullYear();
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  return `${month} ${day}, ${year}  ${hh}:${mm}`;
}

function ScheduleDateButton({
  value,
  onChange,
}: {
  value: Date | null;
  onChange: (d: Date | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pendingDate, setPendingDate] = useState<Date | null>(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setPendingDate(value);
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        const el = target instanceof Element ? target : target.parentElement;
        if (el?.closest('[role="listbox"]')) return;
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        className={`flex items-center gap-2 w-full h-[var(--input-height-md)] px-[var(--input-padding-x)] bg-[var(--color-surface-default)] border rounded-[var(--input-radius)] text-body-md cursor-pointer transition-colors ${value ? 'border-[var(--color-border-focus)]' : open ? 'border-[var(--color-border-focus)]' : 'border-[var(--color-border-strong)] hover:border-[var(--color-border-focus)]'}`}
        onClick={() => setOpen((p) => !p)}
      >
        <IconCalendar size={14} stroke={1.5} className="shrink-0 text-[var(--color-text-subtle)]" />
        <span
          className={value ? 'text-[var(--color-text-default)]' : 'text-[var(--color-text-subtle)]'}
        >
          {value ? formatDateTag(value) : 'Select date and time'}
        </span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 z-50">
          <DatePicker
            value={pendingDate}
            onChange={setPendingDate}
            showTime
            timeFormat="12h"
            showActions
            onApply={(d) => {
              onChange(d);
              setOpen(false);
            }}
            onCancel={() => {
              setPendingDate(value);
              setOpen(false);
            }}
            minDate={new Date()}
          />
        </div>
      )}
    </div>
  );
}

export interface GrantAccessDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  /** Role display name shown in the header InfoBox */
  roleName: string;
  onGrant?: (payload: {
    roleName: string;
    principalType: 'user' | 'service-account';
    principalId: string;
    startTimeType: 'immediately' | 'scheduled';
    grantDuration: string;
    reason: string;
  }) => void;
}

export function GrantAccessDrawer({ isOpen, onClose, roleName, onGrant }: GrantAccessDrawerProps) {
  const [principalType, setPrincipalType] = useState<'user' | 'service-account'>('user');
  const principalColumns = useMemo(() => getPrincipalColumns(principalType), [principalType]);
  const [selectedPrincipal, setSelectedPrincipal] = useState<string>('');
  const [startTimeType, setStartTimeType] = useState<'immediately' | 'scheduled'>('immediately');
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [grantDuration, setGrantDuration] = useState('1h');
  const [reason, setReason] = useState('');
  const [principalSearchQuery, setPrincipalSearchQuery] = useState('');
  const [principalCurrentPage, setPrincipalCurrentPage] = useState(1);

  useEffect(() => {
    if (!isOpen) return;
    setPrincipalType('user');
    setSelectedPrincipal('');
    setStartTimeType('immediately');
    setScheduledDate(null);
    setGrantDuration('1h');
    setReason('');
    setPrincipalSearchQuery('');
    setPrincipalCurrentPage(1);
  }, [isOpen]);

  useEffect(() => {
    setPrincipalCurrentPage(1);
  }, [principalSearchQuery]);

  const filteredUsers = useMemo(() => {
    const q = principalSearchQuery.trim().toLowerCase();
    if (!q) return mockUsers;
    return mockUsers.filter((u) => u.username.toLowerCase().includes(q));
  }, [principalSearchQuery]);

  const principalTotalPages = Math.max(1, Math.ceil(filteredUsers.length / PRINCIPAL_PAGE_SIZE));
  const paginatedUsers = useMemo(() => {
    const safePage = Math.min(principalCurrentPage, principalTotalPages);
    const start = (safePage - 1) * PRINCIPAL_PAGE_SIZE;
    return filteredUsers.slice(start, start + PRINCIPAL_PAGE_SIZE);
  }, [filteredUsers, principalCurrentPage, principalTotalPages]);

  const handleGrant = () => {
    if (!selectedPrincipal || !reason.trim()) return;
    const payload = {
      roleName,
      principalType,
      principalId: selectedPrincipal,
      startTimeType,
      grantDuration,
      reason: reason.trim(),
    };
    onGrant?.(payload);
    console.log('Grant access', payload);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Grant access"
      width={420}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleGrant} className="flex-1">
            Grant
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="w-full min-w-0">
        <InfoBox label="Role" value={roleName || '—'} />

        <FormField spacing="loose" required>
          <FormField.Label>Principal</FormField.Label>
          <FormField.Control>
            <VStack gap={3} className="w-full min-w-0">
              <RadioGroup
                value={principalType}
                onChange={(v) => setPrincipalType(v as 'user' | 'service-account')}
                direction="vertical"
                options={[
                  { value: 'user', label: 'User' },
                  { value: 'service-account', label: 'Service account' },
                ]}
              />
              <SearchInput
                placeholder={
                  principalType === 'user'
                    ? 'Search user by attributes'
                    : 'Search service account by attributes'
                }
                value={principalSearchQuery}
                onChange={(e) => setPrincipalSearchQuery(e.target.value)}
                className="w-[280px]"
              />
              <Pagination
                currentPage={Math.min(principalCurrentPage, principalTotalPages)}
                totalPages={principalTotalPages}
                onPageChange={setPrincipalCurrentPage}
                totalItems={filteredUsers.length}
              />
              <Table<MockUser>
                columns={principalColumns}
                data={paginatedUsers}
                rowKey="id"
                selectable
                selectionType="radio"
                selectedKeys={selectedPrincipal ? [selectedPrincipal] : []}
                onSelectionChange={(keys) => setSelectedPrincipal(keys[0] ?? '')}
              />
            </VStack>
          </FormField.Control>
        </FormField>

        <FormField spacing="loose" required>
          <FormField.Label>Start time</FormField.Label>
          <FormField.Description>
            Choose when this grant becomes active. Times use your organization timezone.
          </FormField.Description>
          <FormField.Control>
            <VStack gap={3} className="w-full">
              <RadioGroup
                value={startTimeType}
                onChange={(v) => setStartTimeType(v as 'immediately' | 'scheduled')}
                direction="vertical"
                options={[
                  { value: 'immediately', label: 'Start immediately' },
                  { value: 'scheduled', label: 'Schedule for later' },
                ]}
              />
              {startTimeType === 'scheduled' && (
                <ScheduleDateButton value={scheduledDate} onChange={setScheduledDate} />
              )}
            </VStack>
          </FormField.Control>
        </FormField>

        <FormField spacing="loose" required>
          <FormField.Label>Grant duration</FormField.Label>
          <FormField.Control>
            <Select
              options={durationOptions}
              value={grantDuration}
              onChange={setGrantDuration}
              fullWidth
            />
          </FormField.Control>
        </FormField>

        <FormField spacing="loose" required>
          <FormField.Label>Reason</FormField.Label>
          <FormField.Control>
            <Textarea
              placeholder="Enter a reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              fullWidth
            />
          </FormField.Control>
        </FormField>
      </VStack>
    </Drawer>
  );
}
