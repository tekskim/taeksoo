export type CertificateStatus = 'active' | 'expiring' | 'expired' | 'revoked';
export type CertificateOptionalAction = 'revoke' | 'renew';

export const CRL_REASON_CODES = [
  { code: 'keyCompromise', value: 1 },
  { code: 'cACompromise', value: 2 },
  { code: 'affiliationChanged', value: 3 },
  { code: 'superseded', value: 4 },
  { code: 'cessationOfOperation', value: 5 },
  { code: 'certificateHold', value: 6 },
  { code: 'privilegeWithdrawn', value: 9 },
  { code: 'unspecified', value: 0 },
] as const;

export type CrlReasonCode = (typeof CRL_REASON_CODES)[number]['code'];

export type CertificateDetail = {
  id: string;
  commonName: string;
  san: string[];
  status: CertificateStatus;
  issuedAt: string;
  expiresAt: string;
  daysRemaining: number;
  issuerCa: string;
  serialNumber: string;
  signatureAlgorithm: string;
  publicKeyAlgorithm: string;
  optionalActions?: CertificateOptionalAction[];
};

export const DUMMY_CERTIFICATES: CertificateDetail[] = [
  {
    id: 'cert-auth-svc',
    commonName: 'auth-service.kms.svc',
    san: ['auth-service.kms.svc', 'auth-service.kms.svc.cluster.local'],
    status: 'active',
    issuedAt: '2026-01-10T09:00:00+09:00',
    expiresAt: '2027-01-10T08:59:59+09:00',
    daysRemaining: 257,
    issuerCa: 'Thaki Workload CA',
    serialNumber: '4A:7C:91:22:10:AF:01',
    signatureAlgorithm: 'SHA256withECDSA',
    publicKeyAlgorithm: 'ECDSA-P256',
    optionalActions: ['revoke', 'renew'],
  },
  {
    id: 'cert-frontend',
    commonName: 'frontend-gateway.kms.svc',
    san: ['frontend-gateway.kms.svc', 'frontend-gateway.kms.svc.cluster.local'],
    status: 'expired',
    issuedAt: '2024-02-01T09:00:00+09:00',
    expiresAt: '2026-02-01T08:59:59+09:00',
    daysRemaining: -86,
    issuerCa: 'Thaki Workload CA',
    serialNumber: '75:11:EC:48:31:09:AB',
    signatureAlgorithm: 'SHA256withECDSA',
    publicKeyAlgorithm: 'ECDSA-P256',
    optionalActions: [],
  },
  {
    id: 'cert-payment',
    commonName: 'payment-api.kms.svc',
    san: ['payment-api.kms.svc', 'pay.kms.svc.cluster.local', 'billing.kms.svc.cluster.local'],
    status: 'revoked',
    issuedAt: '2025-09-01T09:00:00+09:00',
    expiresAt: '2026-09-01T08:59:59+09:00',
    daysRemaining: 126,
    issuerCa: 'Thaki Workload CA',
    serialNumber: '02:BE:98:11:75:DA:30',
    signatureAlgorithm: 'SHA256withECDSA',
    publicKeyAlgorithm: 'ECDSA-P256',
    optionalActions: [],
  },
  {
    id: 'cert-scheduler',
    commonName: 'scheduler.kms.svc',
    san: ['scheduler.kms.svc', 'scheduler.kms.svc.cluster.local'],
    status: 'expiring',
    issuedAt: '2025-05-20T09:00:00+09:00',
    expiresAt: '2026-05-18T08:59:59+09:00',
    daysRemaining: 20,
    issuerCa: 'Thaki Workload CA',
    serialNumber: '62:20:C4:99:7F:12:44',
    signatureAlgorithm: 'SHA256withECDSA',
    publicKeyAlgorithm: 'ECDSA-P256',
    optionalActions: ['renew'],
  },
  {
    id: 'cert-controller',
    commonName: 'controller-manager.kms.svc',
    san: ['controller-manager.kms.svc'],
    status: 'active',
    issuedAt: '2025-12-15T09:00:00+09:00',
    expiresAt: '2026-12-15T08:59:59+09:00',
    daysRemaining: 231,
    issuerCa: 'Thaki Workload CA',
    serialNumber: '91:30:2D:AE:08:CC:70',
    signatureAlgorithm: 'SHA256withECDSA',
    publicKeyAlgorithm: 'ECDSA-P256',
    optionalActions: ['revoke', 'renew'],
  },
  {
    id: 'cert-etcd',
    commonName: 'etcd-peer.kms.svc',
    san: ['etcd-peer.kms.svc', 'etcd-peer.kms.svc.cluster.local'],
    status: 'expiring',
    issuedAt: '2025-05-01T09:00:00+09:00',
    expiresAt: '2026-05-10T08:59:59+09:00',
    daysRemaining: 12,
    issuerCa: 'Thaki Workload CA',
    serialNumber: '10:7C:AF:64:29:35:DD',
    signatureAlgorithm: 'SHA256withECDSA',
    publicKeyAlgorithm: 'ECDSA-P256',
    optionalActions: ['renew'],
  },
  {
    id: 'cert-api-gateway',
    commonName: 'api-gateway.kms.svc',
    san: ['api-gateway.kms.svc', 'api-gateway.kms.svc.cluster.local'],
    status: 'active',
    issuedAt: '2026-03-01T09:00:00+09:00',
    expiresAt: '2027-03-01T08:59:59+09:00',
    daysRemaining: 312,
    issuerCa: 'Thaki Workload CA',
    serialNumber: 'A1:4F:C8:11:22:33:44',
    signatureAlgorithm: 'SHA256withECDSA',
    publicKeyAlgorithm: 'ECDSA-P256',
    optionalActions: ['revoke', 'renew'],
  },
];

export const getCertificateById = (
  certificateId: string | undefined
): CertificateDetail | undefined => {
  if (!certificateId) return undefined;
  return DUMMY_CERTIFICATES.find(
    (certificate) => certificate.id === decodeURIComponent(certificateId)
  );
};

/* 인증서 상태/옵션 기반 액션 가용성 — 상세·리스트 페이지에서 공통 사용 */
export const canRevokeCertificate = (certificate: CertificateDetail): boolean =>
  certificate.status === 'active' || certificate.status === 'expiring';

export const hasCertificateOptionalAction = (
  certificate: CertificateDetail,
  action: CertificateOptionalAction
): boolean => certificate.optionalActions?.includes(action) ?? false;
