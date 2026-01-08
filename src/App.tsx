import { BrowserRouter } from 'react-router-dom';
import { TabProvider } from '@/contexts/TabContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { DarkModeProvider } from '@/hooks/useDarkMode';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { AppRoutes } from '@/routes';

const defaultTabs = [
  { id: 'home', label: 'Home', path: '/compute', closable: true },
];

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
