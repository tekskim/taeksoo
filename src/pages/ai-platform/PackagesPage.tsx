import { useState } from 'react';
import {
  VStack,
  Button,
  Badge,
  Tabs,
  TabList,
  Tab,
  SearchInput,
  Pagination,
} from '@/design-system';
import { AIPlatformPageLayout } from '@/pages/AIPlatformPage';

interface PackageCardProps {
  title: string;
  badges: { label: string; icon?: 'thaki' | 'common' }[];
  onDeploy?: () => void;
}

function PackageCard({ title, badges, onDeploy }: PackageCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-[6px] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-heading-h5 text-[var(--color-text-default)]">{title}</p>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {badges.map((b) => (
            <Badge key={b.label} variant="info" size="sm" theme="white">
              {b.icon === 'thaki' && (
                <span className="mr-0.5 inline-block size-3 rounded-full bg-[var(--color-action-primary)]" />
              )}
              {b.icon === 'common' && (
                <span className="mr-0.5 inline-block size-3 rounded-full bg-[var(--color-text-muted)]" />
              )}
              {b.label}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end">
        <Button variant="primary" size="sm" onClick={onDeploy}>
          Deploy
        </Button>
      </div>
    </div>
  );
}

const THAKI_PACKAGES: PackageCardProps[] = [
  {
    title: 'Title',
    badges: [{ label: 'Thaki image', icon: 'thaki' }, { label: 'Label' }],
  },
  {
    title: 'Title',
    badges: [{ label: 'Common image', icon: 'common' }, { label: 'Label' }],
  },
];

const COMMON_PACKAGES: PackageCardProps[] = [
  {
    title: 'nginx:latest',
    badges: [{ label: 'Common image', icon: 'common' }],
  },
  {
    title: 'alpine:latest',
    badges: [{ label: 'Common image', icon: 'common' }],
  },
];

export function PackagesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const packages =
    activeTab === 'thaki'
      ? THAKI_PACKAGES
      : activeTab === 'common'
        ? COMMON_PACKAGES
        : [...THAKI_PACKAGES, ...COMMON_PACKAGES];

  const filtered = searchQuery
    ? packages.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : packages;

  return (
    <AIPlatformPageLayout title="Packages" breadcrumbItems={[{ label: 'Packages' }]}>
      <VStack gap={3}>
        <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
          <TabList>
            <Tab value="all">All</Tab>
            <Tab value="thaki">Thaki images</Tab>
            <Tab value="common">Common images</Tab>
          </TabList>
        </Tabs>

        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Find packages"
          size="sm"
          className="w-[280px]"
        />

        <Pagination
          currentPage={currentPage}
          totalPages={1}
          onPageChange={setCurrentPage}
          totalItems={filtered.length}
        />

        <div className="grid grid-cols-2 gap-4">
          {filtered.map((pkg, i) => (
            <PackageCard
              key={`${pkg.title}-${i}`}
              {...pkg}
              onDeploy={() => console.log('Deploy', pkg.title)}
            />
          ))}
        </div>
      </VStack>
    </AIPlatformPageLayout>
  );
}

export default PackagesPage;
