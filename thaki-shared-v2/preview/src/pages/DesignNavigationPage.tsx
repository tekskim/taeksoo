import { useState } from 'react';
import { Breadcrumb } from '@shared/components/Breadcrumb';
import { Button } from '@shared/components/Button';
import TabBar from '@shared/components/TabBar/TabBar';
import type { TabItem } from '@shared/components/TabBar/types';
import { TabSelector } from '@shared/components/TabSelector';
import { Tab, Tabs } from '@shared/components/Tabs';
import ToolBar from '@shared/components/ToolBar/ToolBar';

const INITIAL_TAB_BAR_ITEMS: TabItem[] = [
  { id: 'tab-1', title: 'Overview' },
  { id: 'tab-2', title: 'Settings' },
  { id: 'tab-3', title: 'Logs' },
];

export function DesignNavigationPage() {
  const [lineTabId, setLineTabId] = useState('details');
  const [buttonTabId, setButtonTabId] = useState('all');
  const [barTabs, setBarTabs] = useState<TabItem[]>(INITIAL_TAB_BAR_ITEMS);
  const [activeBarTab, setActiveBarTab] = useState('tab-1');
  const [segmentTab, setSegmentTab] = useState('day');

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-[22px] leading-[32px] font-semibold text-text m-0">Navigation</h1>
        <p className="text-13 leading-20 text-text-muted m-0">
          Tabs, tab bar, breadcrumbs, and toolbar from{' '}
          <code className="text-12">@shared/components</code>.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">Tabs (line)</h2>
          <p className="text-13 leading-20 text-text-muted m-0">
            variant=&quot;line&quot; — activeTabId + onChange
          </p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface">
          <Tabs
            variant="line"
            size="sm"
            activeTabId={lineTabId}
            onChange={setLineTabId}
            destroyOnHidden={false}
          >
            <Tab id="details" label="Details">
              <p className="text-13 leading-20 text-text m-0 pt-4">
                Details panel — controlled tab id: <strong>{lineTabId}</strong>
              </p>
            </Tab>
            <Tab id="relations" label="Relations">
              <p className="text-13 leading-20 text-text m-0 pt-4">Relations panel content.</p>
            </Tab>
            <Tab id="audit" label="Audit">
              <p className="text-13 leading-20 text-text m-0 pt-4">Audit log panel content.</p>
            </Tab>
          </Tabs>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">Tabs (button)</h2>
          <p className="text-13 leading-20 text-text-muted m-0">variant=&quot;button&quot;</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface">
          <Tabs
            variant="button"
            size="md"
            activeTabId={buttonTabId}
            onChange={setButtonTabId}
            destroyOnHidden={false}
          >
            <Tab id="all" label="All">
              <p className="text-13 leading-20 text-text m-0 pt-4">All items view.</p>
            </Tab>
            <Tab id="active" label="Active">
              <p className="text-13 leading-20 text-text m-0 pt-4">Active-only view.</p>
            </Tab>
            <Tab id="archived" label="Archived">
              <p className="text-13 leading-20 text-text m-0 pt-4">Archived items view.</p>
            </Tab>
          </Tabs>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">TabBar</h2>
          <p className="text-13 leading-20 text-text-muted m-0">
            Browser-style tab strip with add / close
          </p>
        </div>
        <div className="p-0 rounded-xl border border-border bg-surface overflow-hidden">
          <TabBar
            tabs={barTabs}
            activeTab={activeBarTab}
            onTabClick={setActiveBarTab}
            onTabClose={(id) => {
              setBarTabs((prev) => {
                if (prev.length <= 1) return prev;
                const next = prev.filter((t) => t.id !== id);
                setActiveBarTab((cur) => (cur === id ? next[0]!.id : cur));
                return next;
              });
            }}
            onAddTab={() => {
              const newId = `tab-${Date.now()}`;
              setBarTabs((prev) => [...prev, { id: newId, title: `New ${prev.length + 1}` }]);
              setActiveBarTab(newId);
            }}
          />
          <div className="px-6 py-4 text-13 leading-20 text-text-muted">
            Active: <span className="text-text font-medium">{activeBarTab}</span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">TabSelector</h2>
          <p className="text-13 leading-20 text-text-muted m-0">
            Segment-style control (pill variant)
          </p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface">
          <TabSelector
            variant="pill"
            value={segmentTab}
            onChange={setSegmentTab}
            ariaLabel="Time range"
            options={[
              { id: 'day', label: 'Day' },
              { id: 'week', label: 'Week' },
              { id: 'month', label: 'Month' },
            ]}
          />
          <p className="text-13 leading-20 text-text-muted m-0 mt-4">
            Selected: <span className="text-text font-medium">{segmentTab}</span>
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">Breadcrumb</h2>
          <p className="text-13 leading-20 text-text-muted m-0">
            Multi-segment trail; last item is current page
          </p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface">
          <Breadcrumb
            items={[
              { label: 'Compute', onClick: () => {} },
              { label: 'Instances', onClick: () => {} },
              { label: 'instance-demo-01' },
            ]}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">ToolBar</h2>
          <p className="text-13 leading-20 text-text-muted m-0">
            Breadcrumb + navigation controls + sidebar toggle
          </p>
        </div>
        <div className="p-0 rounded-xl border border-border bg-surface overflow-hidden">
          <ToolBar
            isSidebarOpen={false}
            onToggleSidebar={() => {}}
            breadcrumbItems={[
              { label: 'Project', onClick: () => {} },
              { label: 'Resources', onClick: () => {} },
              { label: 'Detail' },
            ]}
            navigation={{
              canGoBack: true,
              canGoForward: true,
              onGoBack: () => {},
              onGoForward: () => {},
            }}
            langButton={
              <Button variant="ghost" size="sm" type="button">
                EN
              </Button>
            }
            rightActions={
              <Button variant="secondary" appearance="outline" size="sm" type="button">
                Help
              </Button>
            }
            fullWidth
          />
          <p className="text-12 leading-18 text-text-muted px-4 py-3 m-0 border-t border-border-subtle">
            Sidebar is closed so the menu toggle appears next to navigation controls.
          </p>
        </div>
      </section>
    </div>
  );
}

export default DesignNavigationPage;
