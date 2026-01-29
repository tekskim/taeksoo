import { useState, useMemo } from 'react';
import { Drawer, VStack, SearchInput } from '@/design-system';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface ResourceItem {
  id: string;
  name: string;
  count: number;
}

interface ResourceCategory {
  id: string;
  name: string;
  items: ResourceItem[];
  expanded?: boolean;
}

export interface ResourceTypeSearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (categoryId: string, resourceId: string, resourceName: string) => void;
  categories?: ResourceCategory[];
  selectedResourceId?: string;
}

/* ----------------------------------------
   Default Data
   ---------------------------------------- */

const defaultCategories: ResourceCategory[] = [
  {
    id: 'cluster-management',
    name: 'Cluster Management',
    expanded: true,
    items: [{ id: 'clusters', name: 'Clusters', count: 1 }],
  },
  {
    id: 'cluster',
    name: 'Cluster',
    expanded: true,
    items: [
      { id: 'namespaces', name: 'Namespaces', count: 28 },
      { id: 'nodes', name: 'Nodes', count: 12 },
      { id: 'events', name: 'Events', count: 3 },
    ],
  },
  {
    id: 'workloads',
    name: 'Workloads',
    expanded: true,
    items: [
      { id: 'deployments', name: 'Deployments', count: 42 },
      { id: 'statefulsets', name: 'StatefulSets', count: 8 },
      { id: 'daemonsets', name: 'DaemonSets', count: 15 },
      { id: 'jobs', name: 'Jobs', count: 23 },
      { id: 'cronjobs', name: 'CronJobs', count: 7 },
      { id: 'pods', name: 'Pods', count: 156 },
    ],
  },
  {
    id: 'service-discovery',
    name: 'Service Discovery',
    expanded: true,
    items: [
      { id: 'services', name: 'Services', count: 38 },
      { id: 'ingresses', name: 'Ingresses', count: 19 },
      { id: 'hpa', name: 'HorizontalPodAutoscalers', count: 4 },
    ],
  },
  {
    id: 'storage',
    name: 'Storage',
    expanded: true,
    items: [
      { id: 'pv', name: 'PersistentVolumes', count: 24 },
      { id: 'pvc', name: 'PersistentVolumeClaims', count: 31 },
      { id: 'storageclasses', name: 'StorageClasses', count: 6 },
      { id: 'configmaps', name: 'ConfigMaps', count: 67 },
      { id: 'secrets', name: 'Secrets', count: 89 },
    ],
  },
  {
    id: 'policy',
    name: 'Policy',
    expanded: true,
    items: [
      { id: 'limitranges', name: 'LimitRanges', count: 5 },
      { id: 'resourcequotas', name: 'ResourceQuotas', count: 9 },
      { id: 'networkpolicies', name: 'NetworkPolicies', count: 14 },
      { id: 'pdb', name: 'PodDisruptionBudgets', count: 3 },
    ],
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ResourceTypeSearchDrawer({
  isOpen,
  onClose,
  onSelect,
  categories = defaultCategories,
  selectedResourceId = 'namespaces',
}: ResourceTypeSearchDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    categories.forEach((cat) => {
      initial[cat.id] = cat.expanded ?? true;
    });
    return initial;
  });
  const [selectedId, setSelectedId] = useState(selectedResourceId);

  // Filter categories and items based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return categories;
    }

    const query = searchQuery.toLowerCase();
    return categories
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.name.toLowerCase().includes(query) || category.name.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [categories, searchQuery]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleSelect = (categoryId: string, resourceId: string, resourceName: string) => {
    setSelectedId(resourceId);
    onSelect?.(categoryId, resourceId, resourceName);
  };

  // Find which category contains the selected item to highlight it
  const selectedCategoryId = useMemo(() => {
    for (const category of categories) {
      if (category.items.some((item) => item.id === selectedId)) {
        return category.id;
      }
    }
    return null;
  }, [categories, selectedId]);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Resource Type Search" width={400}>
      <VStack gap={4}>
        {/* Search Input */}
        <SearchInput
          placeholder="Search resource type by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          fullWidth
        />

        {/* Resource List */}
        <div className="overflow-auto border border-[var(--color-border-default)] rounded-[4px] max-h-[calc(100vh-200px)] drawer-scroll">
          {filteredCategories.map((category, categoryIndex) => {
            const isExpanded = expandedCategories[category.id] ?? true;
            const isCategoryHighlighted = category.id === selectedCategoryId;
            const isLastCategory = categoryIndex === filteredCategories.length - 1;

            return (
              <div
                key={category.id}
                className={`${!isLastCategory ? 'border-b border-[var(--color-border-default)]' : ''} ${
                  isCategoryHighlighted ? 'bg-[var(--color-state-info-subtle)]' : ''
                }`}
              >
                {/* Category Header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className="flex items-center gap-2 w-full h-[34px] px-3 hover:bg-[var(--color-surface-subtle)] transition-colors"
                >
                  {isExpanded ? (
                    <IconChevronDown
                      size={14}
                      className="text-[var(--color-text-subtle)] shrink-0"
                    />
                  ) : (
                    <IconChevronRight
                      size={14}
                      className="text-[var(--color-text-subtle)] shrink-0"
                    />
                  )}
                  <span className="text-body-md text-[var(--color-text-default)]">
                    {category.name}
                  </span>
                </button>

                {/* Category Items */}
                {isExpanded && (
                  <div className="flex flex-col">
                    {category.items.map((item) => {
                      const isSelected = item.id === selectedId;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelect(category.id, item.id, item.name)}
                          className={`flex items-center justify-between w-full h-[30px] pl-9 pr-3 transition-colors ${
                            isSelected
                              ? 'bg-[var(--color-action-primary)] text-white'
                              : 'hover:bg-[var(--color-surface-subtle)]'
                          }`}
                        >
                          <span className="text-body-md truncate">{item.name}</span>
                          <span
                            className={`text-body-md shrink-0 ml-2 ${
                              isSelected ? 'text-white' : 'text-[var(--color-text-subtle)]'
                            }`}
                          >
                            {item.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty State */}
          {filteredCategories.length === 0 && (
            <div className="flex items-center justify-center h-[100px] text-body-md text-[var(--color-text-subtle)]">
              No resource types found
            </div>
          )}
        </div>
      </VStack>
    </Drawer>
  );
}

export default ResourceTypeSearchDrawer;
