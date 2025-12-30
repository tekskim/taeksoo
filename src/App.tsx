import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InstanceListPage } from '@/pages/InstanceListPage';
import { DesignSystemPage } from '@/pages/DesignSystemPage';
import { TabProvider } from '@/contexts/TabContext';
import { DarkModeProvider } from '@/hooks/useDarkMode';

const defaultTabs = [
  { id: 'home', label: 'Home', path: '/', closable: true },
];

function AppRoutes() {
  return (
    <TabProvider defaultTabs={defaultTabs}>
      <Routes>
        <Route path="/" element={<InstanceListPage />} />
        <Route path="/instances" element={<InstanceListPage />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
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
