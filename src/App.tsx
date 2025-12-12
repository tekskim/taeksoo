import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InstanceListPage } from '@/pages/InstanceListPage';
import { DesignSystemPage } from '@/pages/DesignSystemPage';
import { TopologyD3Page } from '@/pages/TopologyD3Page';

function App() {
  return (
    <BrowserRouter basename="/tds">
      <Routes>
        <Route path="/" element={<InstanceListPage />} />
        <Route path="/topology" element={<TopologyD3Page />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
