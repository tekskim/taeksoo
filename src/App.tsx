import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { InstanceListPage } from '@/pages/InstanceListPage';
import { InstanceDetailPage } from '@/pages/InstanceDetailPage';
import { InstanceTemplatesPage } from '@/pages/InstanceTemplatesPage';
import { InstanceTemplateDetailPage } from '@/pages/InstanceTemplateDetailPage';
import { InstanceSnapshotsPage } from '@/pages/InstanceSnapshotsPage';
import { InstanceSnapshotDetailPage } from '@/pages/InstanceSnapshotDetailPage';
import { ImagesPage } from '@/pages/ImagesPage';
import { ImageDetailPage } from '@/pages/ImageDetailPage';
import { FlavorsPage } from '@/pages/FlavorsPage';
import { FlavorDetailPage } from '@/pages/FlavorDetailPage';
import { KeyPairsPage } from '@/pages/KeyPairsPage';
import { KeyPairDetailPage } from '@/pages/KeyPairDetailPage';
import { ServerGroupsPage } from '@/pages/ServerGroupsPage';
import { ServerGroupDetailPage } from '@/pages/ServerGroupDetailPage';
import { VolumesPage } from '@/pages/VolumesPage';
import { VolumeDetailPage } from '@/pages/VolumeDetailPage';
import { VolumeSnapshotsPage } from '@/pages/VolumeSnapshotsPage';
import { VolumeSnapshotDetailPage } from '@/pages/VolumeSnapshotDetailPage';
import { VolumeBackupsPage } from '@/pages/VolumeBackupsPage';
import { VolumeBackupDetailPage } from '@/pages/VolumeBackupDetailPage';
import { NetworksPage } from '@/pages/NetworksPage';
import { RoutersPage } from '@/pages/RoutersPage';
import { PortsPage } from '@/pages/PortsPage';
import { FloatingIPsPage } from '@/pages/FloatingIPsPage';
import { SecurityGroupsPage } from '@/pages/SecurityGroupsPage';
import { LoadBalancersPage } from '@/pages/LoadBalancersPage';
import { CertificatesPage } from '@/pages/CertificatesPage';
import { DesignSystemPage } from '@/pages/DesignSystemPage';
import { DrawersPage } from '@/pages/DrawersPage';
import { TopologyD3Page } from '@/pages/TopologyD3Page';
import { GradientShowcasePage } from '@/pages/GradientShowcasePage';
import ColorPalettePage from '@/pages/ColorPalettePage';
import MetallicPalettePage from '@/pages/MetallicPalettePage';
import { DarkModeProvider } from '@/hooks/useDarkMode';
import { TabProvider, type TabItem } from '@/contexts/TabContext';

// Default tabs configuration
const defaultTabs: TabItem[] = [
  { id: 'home', label: 'Home', path: '/', closable: true },
];

function AppRoutes() {
  return (
    <TabProvider defaultTabs={defaultTabs}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/instances" element={<InstanceListPage />} />
        <Route path="/instances/:id" element={<InstanceDetailPage />} />
        <Route path="/instance-templates" element={<InstanceTemplatesPage />} />
        <Route path="/instance-templates/:id" element={<InstanceTemplateDetailPage />} />
        <Route path="/instance-snapshots" element={<InstanceSnapshotsPage />} />
        <Route path="/instance-snapshots/:id" element={<InstanceSnapshotDetailPage />} />
        <Route path="/images" element={<ImagesPage />} />
        <Route path="/images/:id" element={<ImageDetailPage />} />
        <Route path="/flavors" element={<FlavorsPage />} />
        <Route path="/flavors/:id" element={<FlavorDetailPage />} />
        <Route path="/key-pairs" element={<KeyPairsPage />} />
        <Route path="/key-pairs/:id" element={<KeyPairDetailPage />} />
        <Route path="/server-groups" element={<ServerGroupsPage />} />
        <Route path="/server-groups/:id" element={<ServerGroupDetailPage />} />
        <Route path="/volumes" element={<VolumesPage />} />
        <Route path="/volumes/:id" element={<VolumeDetailPage />} />
        <Route path="/volume-snapshots" element={<VolumeSnapshotsPage />} />
        <Route path="/volume-snapshots/:id" element={<VolumeSnapshotDetailPage />} />
        <Route path="/volume-backups" element={<VolumeBackupsPage />} />
        <Route path="/volume-backups/:id" element={<VolumeBackupDetailPage />} />
        <Route path="/networks" element={<NetworksPage />} />
        <Route path="/routers" element={<RoutersPage />} />
        <Route path="/ports" element={<PortsPage />} />
        <Route path="/floating-ips" element={<FloatingIPsPage />} />
        <Route path="/security-groups" element={<SecurityGroupsPage />} />
        <Route path="/load-balancers" element={<LoadBalancersPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/topology" element={<TopologyD3Page />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
        <Route path="/drawers" element={<DrawersPage />} />
        <Route path="/gradients" element={<GradientShowcasePage />} />
        <Route path="/color-palette" element={<ColorPalettePage />} />
        <Route path="/metallic-palette" element={<MetallicPalettePage />} />
      </Routes>
    </TabProvider>
  );
}

function App() {
  // Vite의 base 설정을 자동으로 가져옴 (개발: '/', 프로덕션: '/tds_ssot/')
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';
  
  return (
    <DarkModeProvider>
      <BrowserRouter basename={basename}>
        <AppRoutes />
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
