import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';

const KmsOverviewPage = lazy(() => import('@/pages/kms/KmsOverviewPage'));
const CryptoKeyListPage = lazy(() => import('@/pages/kms/CryptoKeyListPage'));
const CryptoKeyDetailPage = lazy(() => import('@/pages/kms/CryptoKeyDetailPage'));
const SecretListPage = lazy(() => import('@/pages/kms/SecretListPage'));
const SecretDetailPage = lazy(() => import('@/pages/kms/SecretDetailPage'));
const CertificateListPage = lazy(() => import('@/pages/kms/CertificateListPage'));
const CertificateDetailPage = lazy(() => import('@/pages/kms/CertificateDetailPage'));

export const kmsRoutes = (
  <>
    <Route path="/kms/overview" element={<KmsOverviewPage />} />
    <Route path="/kms/keys" element={<CryptoKeyListPage />} />
    <Route path="/kms/keys/:keyNameSlug" element={<CryptoKeyDetailPage />} />
    <Route path="/kms/secrets" element={<SecretListPage />} />
    <Route path="/kms/secrets/:secretNameSlug" element={<SecretDetailPage />} />
    <Route path="/kms/certificates" element={<CertificateListPage />} />
    <Route path="/kms/certificates/:certificateId" element={<CertificateDetailPage />} />
    <Route path="/kms" element={<Navigate to="/kms/overview" replace />} />
    <Route path="/kms/*" element={<Navigate to="/kms/overview" replace />} />
  </>
);
