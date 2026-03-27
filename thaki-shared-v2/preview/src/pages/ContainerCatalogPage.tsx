import { useState } from 'react';
import { Button } from '@shared/components/Button';
import { Badge } from '@shared/components/Badge';

type AppCategory = 'All' | 'Database' | 'Data Processing' | 'Networking' | 'Vector DB';

interface CatalogApp {
  id: string;
  name: string;
  version: string;
  description: string;
  category: AppCategory;
  iconBg: string;
  iconText: string;
  installed: boolean;
}

const catalogApps: CatalogApp[] = [
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    version: 'v16.2',
    description:
      'PostgreSQL is a powerful open-source object-relational database system with a strong reputation for reliability, feature robustness, and performance.',
    category: 'Database',
    iconBg: '#336791',
    iconText: 'P',
    installed: true,
  },
  {
    id: 'valkey',
    name: 'Valkey',
    version: 'v8.1',
    description:
      'Valkey is an open source, high performance key/value database that supports a variety of workloads such as caching, message queues, and can act as a primary database.',
    category: 'Database',
    iconBg: '#7B4EFA',
    iconText: 'V',
    installed: false,
  },
  {
    id: 'kafka',
    name: 'Kafka',
    version: '',
    description:
      'Apache Kafka is an open-source distributed event streaming platform used for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications.',
    category: 'Data Processing',
    iconBg: '#231F20',
    iconText: 'K',
    installed: false,
  },
  {
    id: 'nginx',
    name: 'Nginx',
    version: 'v4.11.0',
    description:
      'NGINX Ingress Controller for Kubernetes – routes external HTTP/HTTPS traffic into cluster services using Ingress resources. Multiple instances are allowed per namespace.',
    category: 'Networking',
    iconBg: '#009639',
    iconText: 'N',
    installed: true,
  },
  {
    id: 'milvus',
    name: 'Milvus',
    version: 'v4.2.7',
    description:
      'Milvus is an open-source vector database built to power embedding similarity search and AI applications. It supports trillion-scale vector similarity search and is used for AI/ML workflows.',
    category: 'Vector DB',
    iconBg: '#00A1EA',
    iconText: 'M',
    installed: false,
  },
];

const categories: AppCategory[] = ['All', 'Database', 'Data Processing', 'Networking', 'Vector DB'];

export function ContainerCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<AppCategory>('All');

  const filteredApps = catalogApps.filter((app) => {
    const matchesSearch =
      !searchQuery ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || app.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-sans text-20 font-semibold leading-28 text-text m-0">Catalog</h1>

      <div className="flex flex-col gap-4">
        <div className="relative w-[240px]">
          <input
            type="text"
            placeholder="Search by app name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-2.5 pr-8 py-1.5 text-12 leading-4 bg-surface border border-border rounded-md text-text placeholder:text-text-muted outline-none focus:border-primary"
          />
          <svg
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-12 border-none cursor-pointer transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-surface-muted text-text hover:bg-surface-hover'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            className="flex flex-col gap-3 p-4 bg-surface border border-border rounded-base8"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-base8 flex items-center justify-center shrink-0 text-white font-semibold text-16"
                style={{ backgroundColor: app.iconBg }}
              >
                {app.iconText}
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="font-sans text-14 font-semibold leading-5 text-text">
                  {app.name}
                </span>
                {app.version && (
                  <span className="font-sans text-11 leading-4 text-text-muted">{app.version}</span>
                )}
              </div>
            </div>

            <p className="font-sans text-12 leading-[18px] text-text-muted m-0 line-clamp-3 flex-1">
              {app.description}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <Badge theme={app.category === 'Data Processing' ? 'orange' : 'blue'} size="sm">
                {app.category}
              </Badge>
              <Button variant={app.installed ? 'primary' : 'outline'} size="sm">
                {app.installed ? 'Installed' : 'Install'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
