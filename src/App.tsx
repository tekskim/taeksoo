import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TabProvider } from '@/contexts/TabContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { DarkModeProvider } from '@/hooks/useDarkMode';
import { ProjectProvider } from '@/contexts/ProjectContext';

// Entry Page
import { EntryPage } from '@/pages/EntryPage';

// Pages - Compute
import { InstanceListPage } from '@/pages/InstanceListPage';
import { InstanceDetailPage } from '@/pages/InstanceDetailPage';
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
import { CreateInstancePage } from '@/pages/CreateInstancePage';

// Pages - Agent
import { AgentPage } from '@/pages/AgentPage';
import { CreateAgentPage } from '@/pages/CreateAgentPage';
import { ChatPage } from '@/pages/ChatPage';
import { StoragePage } from '@/pages/StoragePage';
import { MCPToolsPage } from '@/pages/MCPToolsPage';

// Pages - Design System
import { DesignSystemPage } from '@/pages/DesignSystemPage';
import { DrawersPage } from '@/pages/DrawersPage';
import { ModalsPage } from '@/pages/ModalsPage';
import { GradientShowcasePage } from '@/pages/GradientShowcasePage';
import ColorPalettePage from '@/pages/ColorPalettePage';
import MetallicPalettePage from '@/pages/MetallicPalettePage';

const defaultTabs = [
  { id: 'home', label: 'Home', path: '/compute', closable: true },
];

function AppRoutes() {
  return (
      <Routes>
        {/* Entry Page */}
        <Route path="/" element={<EntryPage />} />

        {/* Agent Routes */}
        <Route path="/agent" element={<HomePage />} />
        <Route path="/agent/list" element={<AgentPage />} />
        <Route path="/agent/create" element={<CreateAgentPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/storage" element={<StoragePage />} />
        <Route path="/mcp-tools" element={<MCPToolsPage />} />

        {/* Compute Routes */}
        <Route path="/compute" element={<InstanceListPage />} />
        <Route path="/compute/instances" element={<InstanceListPage />} />
        <Route path="/compute/instances/create" element={<CreateInstancePage />} />
        <Route path="/compute/instances/:id" element={<InstanceDetailPage />} />
        <Route path="/compute/instance-templates" element={<InstanceTemplatesPage />} />
        <Route path="/compute/instance-templates/:id" element={<InstanceTemplateDetailPage />} />
        <Route path="/compute/instance-snapshots" element={<InstanceSnapshotsPage />} />
        <Route path="/compute/instance-snapshots/:id" element={<InstanceSnapshotDetailPage />} />
        <Route path="/compute/images" element={<ImagesPage />} />
        <Route path="/compute/images/:id" element={<ImageDetailPage />} />
        <Route path="/compute/flavors" element={<FlavorsPage />} />
        <Route path="/compute/flavors/:id" element={<FlavorDetailPage />} />
        <Route path="/compute/key-pairs" element={<KeyPairsPage />} />
        <Route path="/compute/key-pairs/:id" element={<KeyPairDetailPage />} />
        <Route path="/compute/server-groups" element={<ServerGroupsPage />} />
        <Route path="/compute/server-groups/:id" element={<ServerGroupDetailPage />} />
        <Route path="/compute/volumes" element={<VolumesPage />} />
        <Route path="/compute/volumes/:id" element={<VolumeDetailPage />} />
        <Route path="/compute/volume-snapshots" element={<VolumeSnapshotsPage />} />
        <Route path="/compute/volume-snapshots/:id" element={<VolumeSnapshotDetailPage />} />
        <Route path="/compute/volume-backups" element={<VolumeBackupsPage />} />
        <Route path="/compute/volume-backups/:id" element={<VolumeBackupDetailPage />} />
        <Route path="/compute/networks" element={<NetworksPage />} />
        <Route path="/compute/networks/:id" element={<NetworkDetailPage />} />
        <Route path="/compute/subnets/:id" element={<SubnetDetailPage />} />
        <Route path="/compute/routers" element={<RoutersPage />} />
        <Route path="/compute/routers/:id" element={<RouterDetailPage />} />
        <Route path="/compute/ports" element={<PortsPage />} />
        <Route path="/compute/ports/:id" element={<PortDetailPage />} />
        <Route path="/compute/floating-ips" element={<FloatingIPsPage />} />
        <Route path="/compute/floating-ips/:id" element={<FloatingIPDetailPage />} />
        <Route path="/compute/security-groups" element={<SecurityGroupsPage />} />
        <Route path="/compute/security-groups/:id" element={<SecurityGroupDetailPage />} />
        <Route path="/compute/load-balancers" element={<LoadBalancersPage />} />
        <Route path="/compute/load-balancers/:id" element={<LoadBalancerDetailPage />} />
        <Route path="/compute/listeners/:id" element={<ListenerDetailPage />} />
        <Route path="/compute/pools/:id" element={<PoolDetailPage />} />
        <Route path="/compute/l7-policies/:id" element={<L7PolicyDetailPage />} />
        <Route path="/compute/certificates" element={<CertificatesPage />} />
        <Route path="/compute/certificates/:id" element={<CertificateDetailPage />} />
        <Route path="/compute/topology" element={<TopologyD3Page />} />
        <Route path="/compute/console/:instanceId" element={<ConsolePage />} />

        {/* Design System Routes */}
        <Route path="/design" element={<DesignSystemPage />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
        <Route path="/design/components" element={<DesignSystemPage />} />
        <Route path="/design/drawers" element={<DrawersPage />} />
        <Route path="/design/modals" element={<ModalsPage />} />
        <Route path="/design/gradients" element={<GradientShowcasePage />} />
        <Route path="/design/colors" element={<ColorPalettePage />} />
        <Route path="/design/metallic" element={<MetallicPalettePage />} />
      </Routes>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ProjectProvider>
          <SidebarProvider>
            <TabProvider defaultTabs={defaultTabs}>
              <AppRoutes />
            </TabProvider>
          </SidebarProvider>
        </ProjectProvider>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
