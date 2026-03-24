import { Link } from 'react-router-dom';

import ThakiLogoLight from '../assets/thakiLogo_light.svg';
import ComputeIcon from '../assets/appIcon/compute.png';
import IAMIcon from '../assets/appIcon/iam.png';
import CloudBuilderIcon from '../assets/appIcon/cloudbuilder.png';
import StorageIcon from '../assets/appIcon/storage.png';

interface AppCard {
  id: string;
  title: string;
  icon: string;
  href: string;
  gradient: string;
}

const appCards: AppCard[] = [
  {
    id: 'compute',
    title: 'Compute',
    icon: ComputeIcon,
    href: '/compute/instances',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    id: 'iam',
    title: 'IAM',
    icon: IAMIcon,
    href: '/iam/users',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'cloud-builder',
    title: 'Cloud Builder',
    icon: CloudBuilderIcon,
    href: '/cloudbuilder/discovery',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'storage',
    title: 'Storage',
    icon: StorageIcon,
    href: '/storage',
    gradient: 'from-violet-500 to-purple-500',
  },
];

function AppCardComponent({ card }: { card: AppCard }) {
  return (
    <Link
      to={card.href}
      className="group relative overflow-hidden w-full rounded-2xl bg-surface border border-border hover:border-border-strong hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out no-underline"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      />
      <div className="relative h-full pl-3 pr-4 py-4 flex items-center justify-between gap-4">
        <div className="w-[72px] h-[72px] shrink-0 transition-transform duration-300 origin-center group-hover:scale-110">
          <img src={card.icon} alt={card.title} className="w-[72px] h-[72px]" />
        </div>
        <h4 className="text-13 font-semibold text-text text-right">{card.title}</h4>
      </div>
    </Link>
  );
}

export function EntryPage() {
  return (
    <div className="fixed inset-0 overflow-auto bg-surface-subtle flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-surface border-b border-border">
        <div className="max-w-[960px] mx-auto px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={ThakiLogoLight} alt="THAKI Cloud" className="h-5" />
          </div>
          <a
            href={
              window.location.hostname === 'localhost'
                ? 'http://localhost:5173'
                : `${window.location.origin}/tds_ssot/`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 rounded-md text-12 font-medium border border-border text-text hover:bg-surface-subtle transition-colors no-underline"
          >
            Open TDS
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-[960px] mx-auto px-8 pt-12 pb-16">
          <h2 className="text-[28px] leading-[36px] font-semibold text-text mb-8">
            shared-v2 Preview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {appCards.map((card) => (
              <AppCardComponent key={card.id} card={card} />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface">
        <div className="max-w-[960px] mx-auto px-8 py-6">
          <p className="text-12 text-text-subtle text-center m-0">
            &copy; 2025 THAKI Cloud. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
