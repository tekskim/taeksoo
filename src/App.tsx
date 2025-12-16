import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InstanceListPage } from '@/pages/InstanceListPage';
import { DesignSystemPage } from '@/pages/DesignSystemPage';
import { TopologyD3Page } from '@/pages/TopologyD3Page';
import { GradientShowcasePage } from '@/pages/GradientShowcasePage';

function App() {
  return (
    <BrowserRouter basename="/topology">
      <Routes>
        <Route path="/" element={<InstanceListPage />} />
        <Route path="/topology" element={<TopologyD3Page />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
        <Route path="/gradients" element={<GradientShowcasePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
