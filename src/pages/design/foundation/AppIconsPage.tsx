import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { VStack } from '@/design-system';

import AppIconAdminCenter from '@/assets/appIcon/admincenter.png';
import AppIconAgentOps from '@/assets/appIcon/agentops.png';
import AppIconAIPlatform from '@/assets/appIcon/aiplatform.png';
import AppIconCloudBuilder from '@/assets/appIcon/cloudbuilder.png';
import AppIconCompute from '@/assets/appIcon/compute.png';
import AppIconComputeAdmin from '@/assets/appIcon/computeadmin.png';
import AppIconContainer from '@/assets/appIcon/container.png';
import AppIconIAM from '@/assets/appIcon/iam.png';
import AppIconSettings from '@/assets/appIcon/settings.png';
import AppIconStorage from '@/assets/appIcon/storage.png';
import AppIconStorageAdmin from '@/assets/appIcon/storageadmin.png';

export function AppIconsPage() {
  return (
    <ComponentPageTemplate
      title="App icons"
      description="Application icons for THAKI Cloud services - Size 64x64"
      relatedLinks={[
        {
          label: 'Icons',
          path: '/design/foundation/icons',
          description: 'Tabler Icons & Custom Icons',
        },
      ]}
    >
      <VStack gap={8}>
        {/* 사용 정책 */}
        <VStack gap={3}>
          <Label>사용 정책</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  THAKI Cloud의 각 서비스(Compute, Compute Admin, Container, Storage, Storage Admin,
                  Cloud Builder, AI Platform, Agent ops, IAM, Settings, Admin center)를 대표하는
                  아이콘입니다.
                </li>
                <li>
                  <strong>크기</strong>: 기본 64×64px. 사이드바 등 작은 영역에서는 축소 사용 가능.
                </li>
                <li>서비스 간 시각적 일관성을 유지하기 위해 공통 스타일 가이드를 따릅니다.</li>
                <li>새로운 서비스 추가 시 기존 아이콘 세트와 동일한 스타일로 제작합니다.</li>
              </ul>
            </VStack>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Service icons</Label>
          <div className="flex flex-wrap gap-6">
            {[
              { src: AppIconCompute, name: 'Compute' },
              { src: AppIconComputeAdmin, name: 'Compute Admin' },
              { src: AppIconStorage, name: 'Storage' },
              { src: AppIconStorageAdmin, name: 'Storage Admin' },
              { src: AppIconContainer, name: 'Container' },
              { src: AppIconCloudBuilder, name: 'Cloud Builder' },
              { src: AppIconAIPlatform, name: 'AI Platform' },
              { src: AppIconAgentOps, name: 'Agent ops' },
              { src: AppIconIAM, name: 'IAM' },
              { src: AppIconSettings, name: 'Settings' },
              { src: AppIconAdminCenter, name: 'Admin center' },
            ].map(({ src, name }) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-default)] flex items-center justify-center overflow-hidden">
                  <img src={src} alt={name} className="w-16 h-16 object-contain" />
                </div>
                <span className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
