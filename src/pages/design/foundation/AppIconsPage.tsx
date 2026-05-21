import { VStack } from '@/design-system';
import { IconDownload } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import { PrevNextNav } from '../_shared/PrevNextNav';
import { pageLastUpdated } from '../_shared/navigationData';

// Signium (Foundation)
import AppIconAlerts from '@/assets/appIcon/alerts.png';
import AppIconAudit from '@/assets/appIcon/audit.png';
import AppIconIAM from '@/assets/appIcon/iam.png';
import AppIconKMS from '@/assets/appIcon/kms.png';
import AppIconLogs from '@/assets/appIcon/logs.png';
import AppIconSecurity from '@/assets/appIcon/security.png';
import AppIconSettings from '@/assets/appIcon/settings.png';
import AppIconChat from '@/assets/appIcon/chat.png';

// Aegis
import AppIconAegisContainer from '@/assets/appIcon/container.png';
import AppIconAegisCompute from '@/assets/appIcon/compute.png';
import AppIconAegisComputeAdmin from '@/assets/appIcon/computeadmin.png';
import AppIconAegisStorage from '@/assets/appIcon/storage.png';
import AppIconAegisStorageAdmin from '@/assets/appIcon/storageadmin.png';
import AppIconAegisBuilder from '@/assets/appIcon/cloudbuilder.png';

// Metis
import AppIconMetisContainer from '@/assets/appIcon/metis-container.png';
import AppIconMetisHub from '@/assets/appIcon/metis-hub.png';
import AppIconMetisHubAdmin from '@/assets/appIcon/metis-hub-admin.png';
import AppIconMetisMLStudio from '@/assets/appIcon/metis-ml-studio.png';
import AppIconMetisMLStudioAdmin from '@/assets/appIcon/metis-ml-studio-admin.png';
import AppIconMetisRun from '@/assets/appIcon/metis-run.png';
import AppIconMetisRunAdmin from '@/assets/appIcon/metis-run-admin.png';
import AppIconMetisServe from '@/assets/appIcon/metis-serve.png';
import AppIconMetisServeAdmin from '@/assets/appIcon/metis-serve-admin.png';
import AppIconMetisFabric from '@/assets/appIcon/metis-fabric.png';

// Praxis
import AppIconPraxisAgentStudio from '@/assets/appIcon/agentops.png';

interface AppIcon {
  src?: string;
  name: string;
  composite?: boolean;
}

interface AppIconSection {
  title: string;
  icons: AppIcon[];
}

const ICON_SECTIONS: AppIconSection[] = [
  {
    title: 'Signium (Foundation)',
    icons: [
      { src: AppIconAlerts, name: 'Alerts' },
      { src: AppIconAudit, name: 'Audit' },
      { src: AppIconIAM, name: 'IAM' },
      { src: AppIconKMS, name: 'KMS' },
      { src: AppIconLogs, name: 'Logs' },
      { src: AppIconSecurity, name: 'Security' },
      { src: AppIconSettings, name: 'Settings' },
      { name: 'Admin Center', composite: true },
      { src: AppIconChat, name: 'Thaki Cloud Assistant' },
    ],
  },
  {
    title: 'Aegis',
    icons: [
      { src: AppIconAegisContainer, name: 'Aegis Container' },
      { src: AppIconAegisCompute, name: 'Aegis Compute' },
      { src: AppIconAegisComputeAdmin, name: 'Aegis Compute' },
      { src: AppIconAegisStorage, name: 'Aegis Storage' },
      { src: AppIconAegisStorageAdmin, name: 'Aegis Storage' },
      { src: AppIconAegisBuilder, name: 'Aegis Builder' },
    ],
  },
  {
    title: 'Metis',
    icons: [
      { src: AppIconMetisContainer, name: 'Metis Container' },
      { src: AppIconMetisHub, name: 'Metis Hub' },
      { src: AppIconMetisHubAdmin, name: 'Metis Hub' },
      { src: AppIconMetisMLStudio, name: 'Metis ML Studio' },
      { src: AppIconMetisMLStudioAdmin, name: 'Metis ML Studio' },
      { src: AppIconMetisRun, name: 'Metis Run' },
      { src: AppIconMetisRunAdmin, name: 'Metis Run' },
      { src: AppIconMetisServe, name: 'Metis Serve' },
      { src: AppIconMetisServeAdmin, name: 'Metis Serve' },
      { src: AppIconMetisFabric, name: 'Metis Fabric' },
    ],
  },
  {
    title: 'Praxis',
    icons: [{ src: AppIconPraxisAgentStudio, name: 'Praxis Agent Studio' }],
  },
];

function IconCard({ src, name, composite }: AppIcon) {
  if (composite) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-default)] grid grid-cols-2 grid-rows-2 gap-0.5 p-1.5">
          <img
            src={AppIconAegisComputeAdmin}
            alt=""
            className="w-full h-full object-contain rounded"
          />
          <img
            src={AppIconAegisStorageAdmin}
            alt=""
            className="w-full h-full object-contain rounded"
          />
          <img src={AppIconMetisHubAdmin} alt="" className="w-full h-full object-contain rounded" />
          <img src={AppIconMetisFabric} alt="" className="w-full h-full object-contain rounded" />
        </div>
        <span className="text-body-sm text-[var(--color-text-muted)]">{name}</span>
      </div>
    );
  }

  const fileName = name.toLowerCase().replace(/\s+/g, '-') + '.png';

  return (
    <div className="flex flex-col items-center gap-2 group">
      <div className="relative w-16 h-16 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-default)] flex items-center justify-center overflow-hidden">
        <img src={src} alt={name} className="w-16 h-16 object-contain" />
        <a
          href={src}
          download={fileName}
          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-xl"
          title={`Download ${name}`}
        >
          <IconDownload size={20} className="text-white" />
        </a>
      </div>
      <span className="text-body-sm text-[var(--color-text-muted)]">{name}</span>
    </div>
  );
}

export function AppIconsPage() {
  const location = useLocation();
  const lastUpdated = pageLastUpdated[location.pathname];

  const formattedDate = lastUpdated
    ? (() => {
        const [y, m, d] = lastUpdated.split(' ')[0].split('-');
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];
        return `${months[parseInt(m) - 1]} ${d}, ${y}`;
      })()
    : null;

  return (
    <div>
      <VStack gap={0} align="stretch">
        {/* Header */}
        <div className="flex items-start justify-between gap-8 pt-2 pb-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-heading-h3 text-[var(--color-text-default)]">App icons</h2>
            <p className="text-body-lg text-[var(--color-text-muted)] max-w-[720px]">
              Application icons for THAKI Cloud services — Size 64×64
            </p>
          </div>
          {formattedDate && (
            <span className="text-body-sm text-[var(--color-text-subtle)] shrink-0">
              Updated {formattedDate}
            </span>
          )}
        </div>

        <div className="w-full h-px bg-[var(--color-border-default)]" />

        {/* Content */}
        <VStack gap={10} align="stretch" className="pt-8">
          {ICON_SECTIONS.map((section) => (
            <VStack key={section.title} gap={4} align="stretch">
              <h3 className="text-heading-h5 text-[var(--color-text-default)]">{section.title}</h3>
              <div className="flex flex-wrap gap-6">
                {section.icons.map((icon, index) => (
                  <IconCard key={`${icon.name}-${index}`} {...icon} />
                ))}
              </div>
            </VStack>
          ))}

          {/* Guidelines */}
          <VStack gap={4} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Usage guidelines</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-body-md text-[var(--color-text-muted)]">
              <li>
                THAKI Cloud의 서비스 아이콘은 4개 제품군으로 구성됩니다:
                <strong className="text-[var(--color-text-default)]"> Signium</strong> (Foundation),
                <strong className="text-[var(--color-text-default)]"> Aegis</strong>{' '}
                (Infrastructure),
                <strong className="text-[var(--color-text-default)]"> Metis</strong> (AI/ML
                Platform),
                <strong className="text-[var(--color-text-default)]"> Praxis</strong> (Agent).
              </li>
              <li>
                <strong className="text-[var(--color-text-default)]">크기</strong>: 기본 64×64px.
                사이드바 등 작은 영역에서는 축소 사용 가능.
              </li>
              <li>서비스 간 시각적 일관성을 유지하기 위해 공통 스타일 가이드를 따릅니다.</li>
              <li>새로운 서비스 추가 시 기존 아이콘 세트와 동일한 스타일로 제작합니다.</li>
            </ul>
          </VStack>

          {/* Related */}
          <VStack gap={3} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Related</h3>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link
                to="/design/foundation/icons"
                className="text-body-md text-[var(--color-text-default)] hover:text-[var(--color-action-primary)] transition-colors"
              >
                Icons
              </Link>
            </div>
          </VStack>
        </VStack>

        {/* Prev/Next Navigation */}
        <div className="pt-12">
          <PrevNextNav />
        </div>
      </VStack>
    </div>
  );
}
