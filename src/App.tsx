import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TabProvider } from '@/contexts/TabContext';
import { DarkModeProvider } from '@/hooks/useDarkMode';

// Pages
import { InstanceListPage } from '@/pages/InstanceListPage';
import { DesignSystemPage } from '@/pages/DesignSystemPage';
import { DrawersPage } from '@/pages/DrawersPage';
import { HomePage } from '@/pages/HomePage';
import { InstanceTemplatesPage } from '@/pages/InstanceTemplatesPage';
import { InstanceSnapshotsPage } from '@/pages/InstanceSnapshotsPage';
import { ImagesPage } from '@/pages/ImagesPage';
import { FlavorsPage } from '@/pages/FlavorsPage';
import { KeyPairsPage } from '@/pages/KeyPairsPage';
import { ServerGroupsPage } from '@/pages/ServerGroupsPage';
import { VolumesPage } from '@/pages/VolumesPage';
import { VolumeSnapshotsPage } from '@/pages/VolumeSnapshotsPage';
import { VolumeBackupsPage } from '@/pages/VolumeBackupsPage';
import { NetworksPage } from '@/pages/NetworksPage';
import { RoutersPage } from '@/pages/RoutersPage';
import { PortsPage } from '@/pages/PortsPage';
import { FloatingIPsPage } from '@/pages/FloatingIPsPage';
import { SecurityGroupsPage } from '@/pages/SecurityGroupsPage';
import { LoadBalancersPage } from '@/pages/LoadBalancersPage';
import { CertificatesPage } from '@/pages/CertificatesPage';
import { TopologyD3Page } from '@/pages/TopologyD3Page';
import { ConsolePage } from '@/pages/ConsolePage';
import { AgentPage } from '@/pages/AgentPage';
import { CreateAgentPage } from '@/pages/CreateAgentPage';
import { ChatPage } from '@/pages/ChatPage';
import { StoragePage } from '@/pages/StoragePage';
import { MCPToolsPage } from '@/pages/MCPToolsPage';

const defaultTabs = [
  { id: 'home', label: 'Home', path: '/', closable: true },
];

function AppRoutes() {
  return (
    <TabProvider defaultTabs={defaultTabs}>
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        
        {/* Design System */}
        <Route path="/design-system" element={<DesignSystemPage />} />
        <Route path="/drawers" element={<DrawersPage />} />
        
        {/* Agent */}
        <Route path="/agent" element={<AgentPage />} />
        <Route path="/agent/create" element={<CreateAgentPage />} />
        <Route path="/chat" element={<ChatPage />} />
        
        {/* Storage */}
        <Route path="/storage" element={<StoragePage />} />
        
        {/* MCP Tools */}
        <Route path="/mcp-tools" element={<MCPToolsPage />} />
        
        {/* Compute */}
        <Route path="/instances" element={<InstanceListPage />} />
        <Route path="/instance-templates" element={<InstanceTemplatesPage />} />
        <Route path="/instance-snapshots" element={<InstanceSnapshotsPage />} />
        <Route path="/images" element={<ImagesPage />} />
        <Route path="/flavors" element={<FlavorsPage />} />
        <Route path="/key-pairs" element={<KeyPairsPage />} />
        <Route path="/server-groups" element={<ServerGroupsPage />} />
        
        {/* Storage */}
        <Route path="/volumes" element={<VolumesPage />} />
        <Route path="/volume-snapshots" element={<VolumeSnapshotsPage />} />
        <Route path="/volume-backups" element={<VolumeBackupsPage />} />
        
        {/* Network */}
        <Route path="/networks" element={<NetworksPage />} />
        <Route path="/routers" element={<RoutersPage />} />
        <Route path="/ports" element={<PortsPage />} />
        <Route path="/floating-ips" element={<FloatingIPsPage />} />
        <Route path="/security-groups" element={<SecurityGroupsPage />} />
        <Route path="/load-balancers" element={<LoadBalancersPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/topology" element={<TopologyD3Page />} />
        
        {/* Console */}
        <Route path="/console/:instanceId" element={<ConsolePage />} />
      </Routes>
    </TabProvider>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppRoutes />
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
