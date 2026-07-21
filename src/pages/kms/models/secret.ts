export type SecretSortField = 'updatedAt';

export type SecretSortOrder = 'asc' | 'desc';

export type SecretState = 'active' | 'expired' | 'deactivated' | 'deleted' | 'destroyed';

export interface SecretVersion {
  version: number;
  status: SecretState;
  createdAt: string;
  expiresAt: string | null;
}

export interface SecretSummary {
  name: string;
  slug: string;
  currentVersion: number;
  status: SecretState;
  updatedAt: string | null;
}

export interface SecretListParams {
  name?: string;
  status?: SecretState;
  sortBy?: SecretSortField;
  sortOrder?: SecretSortOrder;
  page: number;
  pageSize: number;
}

export interface SecretListResult {
  items: SecretSummary[];
  total: number;
  page: number;
  pageSize: number;
}
