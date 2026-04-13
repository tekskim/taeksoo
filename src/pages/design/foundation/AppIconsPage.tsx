import { VStack } from '@/design-system';
import { IconDownload } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import { PrevNextNav } from '../_shared/PrevNextNav';
import { pageLastUpdated } from '../_shared/navigationData';

import AppIconAgentOps from '@/assets/appIcon/agentops.png';
import AppIconAIPlatform from '@/assets/appIcon/aiplatform.png';
import AppIconAIPlatformAdmin from '@/assets/appIcon/aiplatformadmin.png';
import AppIconCloudBuilder from '@/assets/appIcon/cloudbuilder.png';
import AppIconCompute from '@/assets/appIcon/compute.png';
import AppIconComputeAdmin from '@/assets/appIcon/computeadmin.png';
import AppIconContainer from '@/assets/appIcon/container.png';
import AppIconIAM from '@/assets/appIcon/iam.png';
import AppIconSettings from '@/assets/appIcon/settings.png';
import AppIconStorage from '@/assets/appIcon/storage.png';
import AppIconStorageAdmin from '@/assets/appIcon/storageadmin.png';
import AppIconChat from '@/assets/appIcon/chat.png';

const APP_ICONS: { src?: string; name: string; composite?: boolean }[] = [
  { src: AppIconCompute, name: 'Compute' },
  { src: AppIconComputeAdmin, name: 'Compute Admin' },
  { src: AppIconStorage, name: 'Storage' },
  { src: AppIconStorageAdmin, name: 'Storage Admin' },
  { src: AppIconContainer, name: 'Container' },
  { src: AppIconCloudBuilder, name: 'Cloud Builder' },
  { src: AppIconAIPlatform, name: 'AI Platform' },
  { src: AppIconAIPlatformAdmin, name: 'AI Platform Admin' },
  { src: AppIconAgentOps, name: 'Agent ops' },
  { src: AppIconIAM, name: 'IAM' },
  { src: AppIconSettings, name: 'Settings' },
  { name: 'Admin center', composite: true },
  { src: AppIconChat, name: 'Chat' },
];

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
          {/* Icons Grid */}
          <VStack gap={4} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Service icons</h3>
            <div className="flex flex-wrap gap-6">
              {APP_ICONS.map(({ src, name, composite }) => {
                if (composite) {
                  return (
                    <div key={name} className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] grid grid-cols-2 grid-rows-2 gap-0.5 p-1.5">
                        <img
                          src={AppIconStorageAdmin}
                          alt=""
                          className="w-full h-full object-contain rounded"
                        />
                        <img
                          src={AppIconComputeAdmin}
                          alt=""
                          className="w-full h-full object-contain rounded"
                        />
                        <img
                          src={AppIconAIPlatformAdmin}
                          alt=""
                          className="w-full h-full object-contain rounded"
                        />
                        <img
                          src={AppIconCloudBuilder}
                          alt=""
                          className="w-full h-full object-contain rounded"
                        />
                      </div>
                      <span className="text-body-sm text-[var(--color-text-muted)]">{name}</span>
                    </div>
                  );
                }
                const fileName = name.toLowerCase().replace(/\s+/g, '-') + '.png';
                return (
                  <div key={name} className="flex flex-col items-center gap-2 group">
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
              })}
            </div>
          </VStack>

          {/* Guidelines */}
          <VStack gap={4} align="stretch">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Usage guidelines</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-body-md text-[var(--color-text-muted)]">
              <li>
                THAKI Cloud의 각 서비스(Compute, Compute Admin, Container, Storage, Storage Admin,
                Cloud Builder, AI Platform, AI Platform Admin, Agent ops, IAM, Settings, Admin
                center, Chat)를 대표하는 아이콘입니다.
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
