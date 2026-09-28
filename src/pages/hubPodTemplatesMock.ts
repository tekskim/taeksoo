/**
 * 프라이빗 Hub에서 Pod Template을 골라 Install하면 Capsis Create Pod로 넘어오는 값(mock).
 *
 * - HUB-D-229 ③ · CAPSIS-D-85: Hub에서 시작한 경우에만 템플릿 값이 채워진다.
 *   Capsis Create Pod 안에는 템플릿을 고르는 UI가 없다(D-85 후반부 개정 방향).
 * - 채우는 값은 [HUB-20]의 여섯 — 이미지 주소 · 포트 · 볼륨 · 환경 변수 · 자원 요구량 · 실행 사용자.
 * - 이미지는 회사가 Harbor에 넣은 주소를 digest로 고정한다(HUB-D-223). 호스트는 아직 정해지지 않아 예시 값이다.
 *
 * 진입 주소: /container/pods/create?hubTemplate=<id>
 */

export interface HubPodTemplatePort {
  name: string;
  containerPort: string;
  protocol: 'TCP' | 'UDP';
}

export interface HubPodTemplate {
  id: string;
  name: string;
  publisher: 'thakicloud' | 'community';
  image: string;
  command: string;
  args: string;
  ports: HubPodTemplatePort[];
  envVars: { name: string; value: string }[];
  volumeMounts: { name: string; mountPath: string }[];
  resources: { cpuRequest: string; cpuLimit: string; memoryRequest: string; memoryLimit: string };
  runAsUser: string;
  runAsNonRoot: boolean;
}

export const HUB_POD_TEMPLATES: Record<string, HubPodTemplate> = {
  postgresql: {
    id: 'postgresql',
    name: 'PostgreSQL',
    publisher: 'thakicloud',
    image:
      'harbor.example.com/thaki-apps/postgres@sha256:4f2c9e1b7a3d5c8e0f6a2b4d9c1e7f3a5b8d0c2e4f6a1b3c5d7e9f0a2b4c6d8e',
    command: '',
    args: '',
    ports: [{ name: 'postgres', containerPort: '5432', protocol: 'TCP' }],
    envVars: [
      { name: 'POSTGRES_DB', value: 'app' },
      { name: 'PGDATA', value: '/var/lib/postgresql/data/pgdata' },
    ],
    volumeMounts: [{ name: 'data', mountPath: '/var/lib/postgresql/data' }],
    resources: { cpuRequest: '500', cpuLimit: '1000', memoryRequest: '512', memoryLimit: '1024' },
    runAsUser: '999',
    runAsNonRoot: true,
  },
  nginx: {
    id: 'nginx',
    name: 'nginx',
    publisher: 'thakicloud',
    image:
      'harbor.example.com/thaki-apps/nginx@sha256:9a1b3c5d7e9f0a2b4c6d8e0f1a3b5c7d9e1f2a4b6c8d0e2f4a6b8c0d2e4f6a8b',
    command: '',
    args: '',
    ports: [{ name: 'http', containerPort: '8080', protocol: 'TCP' }],
    envVars: [],
    volumeMounts: [],
    resources: { cpuRequest: '100', cpuLimit: '500', memoryRequest: '128', memoryLimit: '256' },
    runAsUser: '101',
    runAsNonRoot: true,
  },
};
