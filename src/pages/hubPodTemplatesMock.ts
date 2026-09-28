/**
 * 프라이빗 Hub의 Pod Template(mock) — Capsis Pod 만들기가 받아 쓰는 값.
 *
 * 화면 정의서: coreplan 03-private-cloud/04-capsis/01-capsis/02-screens/12-pod-create-v1.0.md
 * - 이미지는 회사가 Harbor에 넣은 주소를 digest로 고정한다(HUB-D-223). 호스트는 예시 값이다.
 * - 권장 자원 요구량은 최소 CPU 코어 · 최소 메모리(GB)다. 폼에는 requests에 넣고 limits는 2배로 채운다(CAPSIS-D-87).
 * - Capsis용 템플릿에는 GPU가 없다(CAPSIS-D-88).
 * - 볼륨은 새 PVC의 용량과 마운트 경로가 된다. 컨테이너 디스크는 Capsis에서 쓰지 않는다(CAPSIS-D-89).
 *
 * 진입 주소
 * - Hub에서 Install: /container/pods/create?hubTemplate=<id>
 * - 템플릿을 찾을 수 없음(Case A): ?hubTemplate=<없는 id>
 * - 목록 불러오기 실패(Case B): ?hubList=error · 빈 목록: ?hubList=empty
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
  /** 권장 자원 요구량 — 최소 CPU 코어 · 최소 메모리(GB) */
  resources: { cpuCores: number; memoryGB: number };
  /** 볼륨 디스크 — 크기(GiB)와 마운트 경로. 없으면 볼륨을 만들지 않는다 */
  volume?: { name: string; sizeGi: number; mountPath: string };
  /** 컨테이너 디스크(GiB) — Capsis에서는 쓰지 않는다(CAPSIS-D-89) */
  containerDiskGi?: number;
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
    resources: { cpuCores: 0.5, memoryGB: 0.5 },
    volume: { name: 'data', sizeGi: 10, mountPath: '/var/lib/postgresql/data' },
    containerDiskGi: 5,
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
    resources: { cpuCores: 0.1, memoryGB: 0.125 },
    containerDiskGi: 5,
    runAsUser: '101',
    runAsNonRoot: true,
  },
};

/** 권장 자원 요구량 → 폼 값(CAPSIS-D-87). limits는 requests의 2배, CPU 128,000m · 메모리 512GiB를 넘지 않는다 */
export const toFormResources = (r: HubPodTemplate['resources']) => {
  const cpuRequest = Math.round(r.cpuCores * 1000);
  const memoryRequest = Math.round(r.memoryGB * 1024);
  return {
    cpuRequest: String(cpuRequest),
    cpuLimit: String(Math.min(cpuRequest * 2, 128000)),
    memoryRequest: String(memoryRequest),
    memoryLimit: String(Math.min(memoryRequest * 2, 512 * 1024)),
  };
};
