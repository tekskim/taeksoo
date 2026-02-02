import { lazy } from 'react';
import { Route } from 'react-router-dom';

// Lazy load all design system pages for code splitting
// DesignSystemPage and GradientShowcasePage use named exports
const DesignSystemPage = lazy(() =>
  import('@/pages/DesignSystemPage')
    .then((m) => ({ default: m.DesignSystemPage }))
    .catch((err) => {
      console.error('Failed to load DesignSystemPage:', err);
      throw err;
    })
);
const DrawersPage = lazy(() => import('@/pages/DrawersPage'));
const ModalsPage = lazy(() => import('@/pages/ModalsPage'));
const GradientShowcasePage = lazy(() =>
  import('@/pages/GradientShowcasePage').then((m) => ({ default: m.GradientShowcasePage }))
);
const ColorPalettePage = lazy(() => import('@/pages/ColorPalettePage'));
const MetallicPalettePage = lazy(() => import('@/pages/MetallicPalettePage'));
const ProductionComparisonPage = lazy(() => import('@/pages/ProductionComparisonPage'));

export const designRoutes = (
  <>
    {/* Design System Routes */}
    <Route path="/design" element={<DesignSystemPage />} />
    <Route path="/design-system" element={<DesignSystemPage />} />
    <Route path="/design/components" element={<DesignSystemPage />} />
    <Route path="/design/drawers" element={<DrawersPage />} />
    <Route path="/design/modals" element={<ModalsPage />} />
    <Route path="/design/gradients" element={<GradientShowcasePage />} />
    <Route path="/design/colors" element={<ColorPalettePage />} />
    <Route path="/design/metallic" element={<MetallicPalettePage />} />
    <Route path="/design/comparison" element={<ProductionComparisonPage />} />
  </>
);
