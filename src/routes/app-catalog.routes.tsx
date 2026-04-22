import { lazy } from 'react';
import { Route, Outlet } from 'react-router-dom';
import { AppCatalogModeProvider } from '@/contexts/AppCatalogModeContext';
import { TabProvider } from '@/contexts/TabContext';

function AppCatalogLayout() {
  return (
    <TabProvider>
      <AppCatalogModeProvider>
        <Outlet />
      </AppCatalogModeProvider>
    </TabProvider>
  );
}

const AppCatalogPage = lazy(async () => {
  const m = await import('@/pages/AppCatalogPage');
  return { default: m.AppCatalogPage };
});
const AppInstallPage = lazy(async () => {
  const m = await import('@/pages/AppInstallPage');
  return { default: m.AppInstallPage };
});
const InstalledAppsPage = lazy(() => import('@/pages/InstalledAppsPage'));
const InstalledAppDetailPage = lazy(() => import('@/pages/InstalledAppDetailPage'));
const InstalledAppEditPage = lazy(() => import('@/pages/InstalledAppEditPage'));
const InstalledOperatorsPage = lazy(() => import('@/pages/InstalledOperatorsPage'));
const InstalledOperatorDetailPage = lazy(() => import('@/pages/InstalledOperatorDetailPage'));

export const appCatalogRoutes = (
  <Route element={<AppCatalogLayout />}>
    <Route path="/container/appcatalog/catalog" element={<AppCatalogPage />} />
    <Route path="/container/appcatalog/catalog/:chartName/install" element={<AppInstallPage />} />
    <Route path="/container/appcatalog/installed-apps" element={<InstalledAppsPage />} />
    <Route
      path="/container/appcatalog/installed-apps/:appId"
      element={<InstalledAppDetailPage />}
    />
    <Route
      path="/container/appcatalog/installed-apps/:appId/edit"
      element={<InstalledAppEditPage />}
    />
    <Route path="/container/appcatalog/installed-operators" element={<InstalledOperatorsPage />} />
    <Route
      path="/container/appcatalog/installed-operators/:operatorId"
      element={<InstalledOperatorDetailPage />}
    />
    <Route path="/container/*" element={<AppCatalogPage />} />
  </Route>
);
