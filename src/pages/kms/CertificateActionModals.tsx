import { useState } from 'react';
import { VStack, HStack, Button, Modal, FormField, Select, Textarea } from '@/design-system';
import { CRL_REASON_CODES } from './models/certificate';

/* ─────────────────────────────────────────────────────────────────
   Certificate action confirm modals — Renew / Revoke
   상세 페이지와 리스트 페이지(Action 컨텍스트 메뉴)에서 공통 사용
   ───────────────────────────────────────────────────────────────── */

const REASON_DESCRIPTION_MAX_LENGTH = 500;

const CRL_REASON_OPTIONS = CRL_REASON_CODES.map((r) => ({
  value: r.code,
  label: `${r.code} (${r.value})`,
}));

export function RevokeCertificateConfirmModal({
  isOpen,
  commonName,
  onCancel,
  onConfirm,
}: {
  isOpen: boolean;
  commonName: string;
  onCancel: () => void;
  onConfirm: (reasonCode: string, reason: string) => void;
}) {
  const [reasonCode, setReasonCode] = useState('');
  const [reason, setReason] = useState('');

  const confirmDisabled = reasonCode === '' || reason.trim().length === 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Confirm certificate revocation"
      description="The certificate will be marked as Revoked after revocation. Continue?"
      className="w-[420px]"
    >
      <VStack gap={4} className="w-full">
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
          <span className="text-label-sm text-[var(--color-text-subtle)]">Common Name</span>
          <span className="text-body-md text-[var(--color-text-default)]">{commonName || '-'}</span>
        </div>

        <FormField label="Reason code (CRL)" required>
          <Select
            options={CRL_REASON_OPTIONS}
            value={reasonCode}
            onChange={setReasonCode}
            placeholder="Select a CRL reason code"
            fullWidth
          />
        </FormField>

        <FormField label="Reason" required>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={REASON_DESCRIPTION_MAX_LENGTH}
            placeholder="Enter reason for change"
            rows={4}
            fullWidth
          />
        </FormField>

        <HStack gap={2} className="w-full">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={confirmDisabled}
            onClick={() => onConfirm(reasonCode, reason.trim())}
            className="flex-1"
          >
            Revoke
          </Button>
        </HStack>
      </VStack>
    </Modal>
  );
}

export function RenewCertificateConfirmModal({
  isOpen,
  commonName,
  onCancel,
  onConfirm,
}: {
  isOpen: boolean;
  commonName: string;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState('');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Confirm certificate renewal"
      description="Renew this certificate?"
      className="w-[420px]"
    >
      <VStack gap={4} className="w-full">
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
          <span className="text-label-sm text-[var(--color-text-subtle)]">Common Name</span>
          <span className="text-body-md text-[var(--color-text-default)]">{commonName || '-'}</span>
        </div>

        <FormField label="Reason" required>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={REASON_DESCRIPTION_MAX_LENGTH}
            placeholder="Enter reason for change"
            rows={4}
            fullWidth
          />
        </FormField>

        <HStack gap={2} className="w-full">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={reason.trim().length === 0}
            onClick={() => onConfirm(reason.trim())}
            className="flex-1"
          >
            Renew
          </Button>
        </HStack>
      </VStack>
    </Modal>
  );
}
