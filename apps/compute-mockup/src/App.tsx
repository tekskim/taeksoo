import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MockSidebar } from './components/MockSidebar';
import { InstancesPage } from './pages/InstancesPage';
import { InstanceDetailPage } from './pages/InstanceDetailPage';
import { NetworksPage } from './pages/NetworksPage';
import { VolumesPage } from './pages/VolumesPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-[var(--color-surface-subtle)] overflow-hidden">
        <MockSidebar />
        <main className="flex-1 overflow-auto pt-4 px-8 pb-8">
          <Routes>
            <Route path="/" element={<InstancesPage />} />
            <Route path="/instances/:id" element={<InstanceDetailPage />} />
            <Route path="/networks" element={<NetworksPage />} />
            <Route path="/volumes" element={<VolumesPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
