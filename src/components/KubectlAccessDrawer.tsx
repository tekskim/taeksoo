import { useState, useEffect } from 'react';
import {
  Drawer,
  HStack,
  VStack,
  Button,
  Select,
  FormField,
  InfoBox,
  InlineMessage,
  ConfirmModal,
} from '@/design-system';
import { IconCopy, IconCheck } from '@tabler/icons-react';

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                   */
/* ------------------------------------------------------------------ */

type DrawerMode = 'view' | 'generating' | 'regenerating';

interface TokenRecord {
  id: string;
  createdAt: string;
  expiresAt: string;
}

interface KubectlAccessDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  clusterName?: string;
}

const TTL_OPTIONS = [
  { value: '1h', label: '1 hour' },
  { value: '6h', label: '6 hours' },
  { value: '24h', label: '24 hours (recommended)' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
];

const TTL_HOURS: Record<string, number> = {
  '1h': 1,
  '6h': 6,
  '24h': 24,
  '7d': 168,
  '30d': 720,
};

const MOCK_TOKEN_VALUE =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjFLandXZm9KT2NtWnBzNXVRb3lnd3J5' +
  'UHBQbkNJOVlXWm9NRndVc2cifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2' +
  'VhY2NvdW50IiwibmFtZXNwYWNlIjoidGhha2ktdG9rZW5zIn0.mock';

const INITIAL_TOKEN: TokenRecord = {
  id: 'tok-g7h8i9',
  createdAt: '2026-03-20 09:00',
  expiresAt: '2026-04-19 09:00',
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatISODate(d: Date): string {
  return d.toISOString().slice(0, 16).replace('T', ' ');
}

/** "2026-03-20 09:00"  →  "Mar 20, 2026" */
function formatDisplayDate(dateStr: string | undefined): string {
  if (!dateStr) return '—';
  const [datePart] = dateStr.split(' ');
  if (!datePart) return dateStr;
  const [year, month, day] = datePart.split('-').map(Number);
  const names = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${names[month - 1]} ${day}, ${year}`;
}

function makeNewRecord(ttl: string): TokenRecord {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setHours(expiresAt.getHours() + (TTL_HOURS[ttl] ?? 24));
  return {
    id: `tok-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: formatISODate(now),
    expiresAt: formatISODate(expiresAt),
  };
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                      */
/* ------------------------------------------------------------------ */

/** Token value shown once immediately after generation */
function TokenValueOnce({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return (
    <VStack gap={2}>
      <InlineMessage variant="warning">
        Make sure to copy your token now as you will not be able to see it again.
      </InlineMessage>
      <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
        <code className="flex-1 text-body-sm text-[var(--color-text-default)] font-mono truncate select-all">
          {MOCK_TOKEN_VALUE}
        </code>
        <button
          onClick={onCopy}
          className="shrink-0 p-1 hover:bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)] transition-colors"
          aria-label="Copy token"
        >
          {copied ? (
            <IconCheck size={14} className="text-[var(--color-state-success)]" />
          ) : (
            <IconCopy size={14} className="text-[var(--color-text-muted)]" />
          )}
        </button>
      </div>
    </VStack>
  );
}

/** Inline form for generating or regenerating a token */
function TokenForm({
  mode,
  ttl,
  onTtlChange,
  onSubmit,
  onCancel,
}: {
  mode: 'generating' | 'regenerating';
  ttl: string;
  onTtlChange: (v: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const isRegen = mode === 'regenerating';
  return (
    <VStack
      gap={4}
      className="pt-1 pb-3 px-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)]"
    >
      <InlineMessage variant={isRegen ? 'warning' : 'info'}>
        {isRegen
          ? 'Make sure to copy your token now as you will not be able to see it again.'
          : 'Generating a new token grants kubectl access to this cluster for the selected period.'}
      </InlineMessage>

      <FormField
        label="Expiration"
        helperText="Expired tokens cannot be renewed — generate a new token instead."
      >
        <Select options={TTL_OPTIONS} value={ttl} onChange={onTtlChange} fullWidth />
      </FormField>

      <HStack gap={2}>
        <Button variant="secondary" size="sm" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button variant="primary" size="sm" onClick={onSubmit} className="flex-1">
          {isRegen ? 'Regenerate token' : 'Generate token'}
        </Button>
      </HStack>
    </VStack>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                      */
/* ------------------------------------------------------------------ */

export function KubectlAccessDrawer({
  isOpen,
  onClose,
  clusterName = 'default-cluster',
}: KubectlAccessDrawerProps) {
  const [token, setToken] = useState<TokenRecord | null>(INITIAL_TOKEN);
  const [mode, setMode] = useState<DrawerMode>('view');
  const [justGenerated, setJustGenerated] = useState(false);
  const [ttl, setTtl] = useState('30d');
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode('view');
      setJustGenerated(false);
      setCopied(false);
    }
  }, [isOpen]);

  /* ── Actions ── */

  const handleGenerate = () => {
    setToken(makeNewRecord(ttl));
    setMode('view');
    setJustGenerated(true);
  };

  const handleRegenerate = () => {
    setToken(makeNewRecord(ttl));
    setMode('view');
    setJustGenerated(true);
  };

  const handleDeleteConfirmed = () => {
    setToken(null);
    setShowDeleteConfirm(false);
    setJustGenerated(false);
    setMode('view');
  };

  const handleCopyToken = async () => {
    await navigator.clipboard.writeText(MOCK_TOKEN_VALUE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Render ── */

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title="Access Token"
        description="Manage your personal access token for this cluster."
        width={420}
        closeOnBackdropClick={true}
        footer={
          <Button variant="secondary" onClick={onClose} className="w-full">
            Close
          </Button>
        }
      >
        <VStack gap={6}>
          {/* ── Cluster info — always visible at top ─────────────── */}
          <InfoBox label="Cluster" value={clusterName} />

          {/* ── Token exists ─────────────────────────────────────── */}
          {token ? (
            <>
              {/* Token dates — GitHub style */}
              <VStack gap={1.5}>
                <span className="text-body-md text-[var(--color-text-muted)]">
                  Created on {formatDisplayDate(token.createdAt)}.
                </span>
                <span className="text-body-md text-[var(--color-text-muted)]">
                  Expires on {formatDisplayDate(token.expiresAt)}.
                </span>
              </VStack>

              {/* Token value — shown once after generation */}
              {justGenerated && <TokenValueOnce copied={copied} onCopy={handleCopyToken} />}

              {/* Action buttons or inline form */}
              {mode === 'view' && (
                <HStack gap={2}>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setMode('regenerating');
                      setJustGenerated(false);
                    }}
                  >
                    Regenerate token
                  </Button>
                </HStack>
              )}

              {mode === 'regenerating' && (
                <TokenForm
                  mode="regenerating"
                  ttl={ttl}
                  onTtlChange={setTtl}
                  onSubmit={handleRegenerate}
                  onCancel={() => setMode('view')}
                />
              )}
            </>
          ) : (
            /* ── No active token ───────────────────────────────── */
            <>
              {mode === 'view' && (
                <>
                  <InlineMessage variant="warning">
                    No active token. Generate a new token to access this cluster via kubectl.
                  </InlineMessage>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => setMode('generating')}
                  >
                    Generate new token
                  </Button>
                </>
              )}

              {mode === 'generating' && (
                <TokenForm
                  mode="generating"
                  ttl={ttl}
                  onTtlChange={setTtl}
                  onSubmit={handleGenerate}
                  onCancel={() => setMode('view')}
                />
              )}
            </>
          )}
        </VStack>
      </Drawer>

      {/* ── Delete confirmation modal ──────────────────────────────── */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirmed}
        title="Delete token"
        description="Any kubectl sessions or scripts using this token will lose access immediately."
        infoLabel="Cluster"
        infoValue={clusterName}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </>
  );
}

export default KubectlAccessDrawer;
