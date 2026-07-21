import { TabBar } from '@/design-system';

/* ----------------------------------------
   Container Platform tab bar

   Every desktop app renders a TDS TabBar as its top strip — it is the window's
   drag / double-click-to-maximize surface and lines up with the frame's
   window-control overlay. Container Platform uses a single fixed tab (no tab
   management in this mockup) so the window behaves like every other app.
   ---------------------------------------- */

export function ContainerPlatformTabBar() {
  return (
    <TabBar
      tabs={[{ id: 'container-platform', label: 'Container Platform', closable: false }]}
      activeTab="container-platform"
      onTabChange={() => {}}
      showAddButton={false}
    />
  );
}

export default ContainerPlatformTabBar;
