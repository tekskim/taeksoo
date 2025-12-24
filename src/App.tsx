import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InstanceListPage } from '@/pages/InstanceListPage';
import { InstanceTemplatesPage } from '@/pages/InstanceTemplatesPage';
import { InstanceSnapshotsPage } from '@/pages/InstanceSnapshotsPage';
import { ImagesPage } from '@/pages/ImagesPage';
import { FlavorsPage } from '@/pages/FlavorsPage';
import { KeyPairsPage } from '@/pages/KeyPairsPage';
import { ServerGroupsPage } from '@/pages/ServerGroupsPage';
import { VolumesPage } from '@/pages/VolumesPage';
import { VolumeSnapshotsPage } from '@/pages/VolumeSnapshotsPage';
import { VolumeBackupsPage } from '@/pages/VolumeBackupsPage';
import { DesignSystemPage } from '@/pages/DesignSystemPage';
import { TopologyD3Page } from '@/pages/TopologyD3Page';
import { GradientShowcasePage } from '@/pages/GradientShowcasePage';
import ColorPalettePage from '@/pages/ColorPalettePage';
import MetallicPalettePage from '@/pages/MetallicPalettePage';
import { DarkModeProvider } from '@/hooks/useDarkMode';
import { TabProvider, type TabItem } from '@/contexts/TabContext';

// Default tabs configuration
const defaultTabs: TabItem[] = [
  { id: 'instances', label: 'Instances List', path: '/instances', closable: true },
];

function AppRoutes() {
  return (
    <TabProvider defaultTabs={defaultTabs}>
      <Routes>
        <Route path="/" element={<InstanceListPage />} />
        <Route path="/instances" element={<InstanceListPage />} />
        <Route path="/instances/:id" element={<InstanceListPage />} />
        <Route path="/instance-templates" element={<InstanceTemplatesPage />} />
        <Route path="/instance-snapshots" element={<InstanceSnapshotsPage />} />
        <Route path="/images" element={<ImagesPage />} />
        <Route path="/flavors" element={<FlavorsPage />} />
        <Route path="/key-pairs" element={<KeyPairsPage />} />
        <Route path="/server-groups" element={<ServerGroupsPage />} />
        <Route path="/volumes" element={<VolumesPage />} />
        <Route path="/volume-snapshots" element={<VolumeSnapshotsPage />} />
        <Route path="/volume-backups" element={<VolumeBackupsPage />} />
        <Route path="/topology" element={<TopologyD3Page />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
        <Route path="/gradients" element={<GradientShowcasePage />} />
        <Route path="/color-palette" element={<ColorPalettePage />} />
        <Route path="/metallic-palette" element={<MetallicPalettePage />} />
      </Routes>
    </TabProvider>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
