import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { computeRoutes } from './compute.routes';
import { storageRoutes } from './storage.routes';
import { agentRoutes } from './agent.routes';
import { designRoutes } from './design.routes';

// Entry and Desktop pages - loaded eagerly as they're entry points
const EntryPage = lazy(() => import('@/pages/EntryPage'));
const DesktopPage = lazy(() => import('@/pages/DesktopPage'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-[var(--color-text-muted)]">Loading...</div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Entry Page */}
        <Route path="/" element={<EntryPage />} />

        {/* Desktop Route */}
        <Route path="/desktop" element={<DesktopPage />} />

        {/* Domain-specific routes */}
        {agentRoutes}
        {computeRoutes}
        {storageRoutes}
        {designRoutes}
      </Routes>
    </Suspense>
  );
};

