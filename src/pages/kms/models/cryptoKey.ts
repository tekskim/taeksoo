export type CryptoKeyAlgorithm = 'AES-256' | 'RSA-2048' | 'RSA-4096';

export type EncryptionKeyState = 'active' | 'deactivated' | 'archived' | 'destroyed';

export type CryptoKeyPurpose = 'Encrypt / Decrypt' | 'Sign / Verify';

export type CryptoKeySortField = 'createdAt' | 'nextRotationAt';

export type CryptoKeySortOrder = 'asc' | 'desc';

export interface CryptoKeySummary {
  name: string;
  slug: string;
  algorithm: CryptoKeyAlgorithm;
  purpose: CryptoKeyPurpose;
  currentVersion: number;
  status: EncryptionKeyState;
  createdAt: string | null;
  nextRotationAt: string | null;
}

export interface CryptoKeyTag {
  key: string;
  value: string;
}

export interface CryptoKeyRotationHistoryItem {
  version: number;
  rotatedAt: string;
  status: EncryptionKeyState;
}

export interface CryptoKeyDetail extends CryptoKeySummary {
  description: string;
  tags: CryptoKeyTag[];
  keyring: string;
  createdBy: string;
  updatedAt: string | null;
  lastUsedAt: string | null;
  autoRotationEnabled: boolean;
  rotationPeriodDays: number;
  rotationHistory: CryptoKeyRotationHistoryItem[];
}

export interface CryptoKeyListParams {
  search?: string;
  algorithms?: CryptoKeyAlgorithm[];
  purposes?: CryptoKeyPurpose[];
  statuses?: EncryptionKeyState[];
  sortBy?: CryptoKeySortField;
  sortOrder?: CryptoKeySortOrder;
  page: number;
  pageSize: number;
}

export interface CryptoKeyListResult {
  items: CryptoKeySummary[];
  total: number;
  page: number;
  pageSize: number;
}
