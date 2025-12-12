import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InstanceListPage } from '@/pages/InstanceListPage';
import { DesignSystemPage } from '@/pages/DesignSystemPage';
import { TopologyPage } from '@/pages/TopologyPage';
import { TopologyD3Page } from '@/pages/TopologyD3Page';
import { TopologyVpcPage } from '@/pages/TopologyVpcPage';
import { TopologyScalePage } from '@/pages/TopologyScalePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InstanceListPage />} />
        <Route path="/topology" element={<TopologyPage />} />
        <Route path="/topology-d3" element={<TopologyD3Page />} />
        <Route path="/topology-vpc" element={<TopologyVpcPage />} />
        <Route path="/topology-scale" element={<TopologyScalePage />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
