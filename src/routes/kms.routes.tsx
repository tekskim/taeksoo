import { lazy } from 'react';
import { Route } from 'react-router-dom';

const KmsPage = lazy(() => import('@/pages/kms/KmsPage'));

export const kmsRoutes = (
  <>
    <Route path="/kms" element={<KmsPage />} />
    <Route path="/kms/*" element={<KmsPage />} />
  </>
);
