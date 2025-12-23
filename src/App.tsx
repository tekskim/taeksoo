import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InstanceListPage } from '@/pages/InstanceListPage';
import { DesignSystemPage } from '@/pages/DesignSystemPage';
import { TopologyD3Page } from '@/pages/TopologyD3Page';
import { GradientShowcasePage } from '@/pages/GradientShowcasePage';
import ColorPalettePage from '@/pages/ColorPalettePage';
import MetallicPalettePage from '@/pages/MetallicPalettePage';
import { DarkModeProvider } from '@/hooks/useDarkMode';

function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter basename="/topology">
        <Routes>
          <Route path="/" element={<InstanceListPage />} />
          <Route path="/topology" element={<TopologyD3Page />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
          <Route path="/gradients" element={<GradientShowcasePage />} />
          <Route path="/color-palette" element={<ColorPalettePage />} />
          <Route path="/metallic-palette" element={<MetallicPalettePage />} />
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
