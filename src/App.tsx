import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TabProvider } from '@/contexts/TabContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { DarkModeProvider } from '@/hooks/useDarkMode';

// Pages
import { InstanceListPage } from '@/pages/InstanceListPage';
import { InstanceDetailPage } from '@/pages/InstanceDetailPage';
import { DesignSystemPage } from '@/pages/DesignSystemPage';
import { DrawersPage } from '@/pages/DrawersPage';
import { ModalsPage } from '@/pages/ModalsPage';
import { HomePage } from '@/pages/HomePage';
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
import NetworkDetailPage from '@/pages/NetworkDetailPage';
import { RoutersPage } from '@/pages/RoutersPage';
import RouterDetailPage from '@/pages/RouterDetailPage';
import { PortsPage } from '@/pages/PortsPage';
import PortDetailPage from '@/pages/PortDetailPage';
import { FloatingIPsPage } from '@/pages/FloatingIPsPage';
import FloatingIPDetailPage from '@/pages/FloatingIPDetailPage';
import { SecurityGroupsPage } from '@/pages/SecurityGroupsPage';
import SecurityGroupDetailPage from '@/pages/SecurityGroupDetailPage';
import { LoadBalancersPage } from '@/pages/LoadBalancersPage';
import LoadBalancerDetailPage from '@/pages/LoadBalancerDetailPage';
import { CertificatesPage } from '@/pages/CertificatesPage';
import CertificateDetailPage from '@/pages/CertificateDetailPage';
import SubnetDetailPage from '@/pages/SubnetDetailPage';
import ListenerDetailPage from '@/pages/ListenerDetailPage';
import PoolDetailPage from '@/pages/PoolDetailPage';
import L7PolicyDetailPage from '@/pages/L7PolicyDetailPage';
import { TopologyD3Page } from '@/pages/TopologyD3Page';
import { ConsolePage } from '@/pages/ConsolePage';
import { GradientShowcasePage } from '@/pages/GradientShowcasePage';
import ColorPalettePage from '@/pages/ColorPalettePage';
import MetallicPalettePage from '@/pages/MetallicPalettePage';

const defaultTabs = [
  { id: 'home', label: 'Home', path: '/', closable: true },
];

function AppRoutes() {
  return (
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
        <Route path="/networks/:id" element={<NetworkDetailPage />} />
        <Route path="/subnets/:id" element={<SubnetDetailPage />} />
        <Route path="/routers" element={<RoutersPage />} />
        <Route path="/routers/:id" element={<RouterDetailPage />} />
        <Route path="/ports" element={<PortsPage />} />
        <Route path="/ports/:id" element={<PortDetailPage />} />
        <Route path="/floating-ips" element={<FloatingIPsPage />} />
        <Route path="/floating-ips/:id" element={<FloatingIPDetailPage />} />
        <Route path="/security-groups" element={<SecurityGroupsPage />} />
        <Route path="/security-groups/:id" element={<SecurityGroupDetailPage />} />
        <Route path="/load-balancers" element={<LoadBalancersPage />} />
        <Route path="/load-balancers/:id" element={<LoadBalancerDetailPage />} />
        <Route path="/listeners/:id" element={<ListenerDetailPage />} />
        <Route path="/pools/:id" element={<PoolDetailPage />} />
        <Route path="/l7-policies/:id" element={<L7PolicyDetailPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/certificates/:id" element={<CertificateDetailPage />} />
        <Route path="/topology" element={<TopologyD3Page />} />
        <Route path="/console/:instanceId" element={<ConsolePage />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
        <Route path="/drawers" element={<DrawersPage />} />
        <Route path="/modals" element={<ModalsPage />} />
        <Route path="/gradients" element={<GradientShowcasePage />} />
        <Route path="/color-palette" element={<ColorPalettePage />} />
        <Route path="/metallic-palette" element={<MetallicPalettePage />} />
      </Routes>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <SidebarProvider>
          <TabProvider defaultTabs={defaultTabs}>
            <AppRoutes />
          </TabProvider>
        </SidebarProvider>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
