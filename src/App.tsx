import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InstanceListPage } from '@/pages/InstanceListPage';
import { DesignSystemPage } from '@/pages/DesignSystemPage';
import { TopologyPage } from '@/pages/TopologyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InstanceListPage />} />
        <Route path="/topology" element={<TopologyPage />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
