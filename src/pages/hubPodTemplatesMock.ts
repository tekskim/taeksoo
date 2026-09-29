/**
 * 프라이빗 Hub의 Pod Template(mock) — Capsis Pod 만들기가 받아 쓰는 값.
 *
 * 화면 정의서: coreplan 03-private-cloud/04-capsis/01-capsis/02-screens/12-pod-create-v1.0.md
 * - 이미지는 회사가 Harbor에 넣은 주소를 digest로 고정한다(HUB-D-223). 호스트는 예시 값이다.
 * - 권장 자원 요구량은 최소 CPU 코어 · 최소 메모리(GB)다. 폼에는 requests에만 넣고 limits는 비워 둔다(CAPSIS-D-87).
 * - 템플릿에 없는 값은 채우지 않는다. 폼에 원래 기본값이 있는 칸은 그 값을 쓴다(화면 12 §2-2).
 * - Capsis용 템플릿에는 GPU가 없다(CAPSIS-D-88).
 * - 볼륨은 새 PVC의 용량과 마운트 경로가 된다. 컨테이너 디스크는 Capsis에서 쓰지 않는다(CAPSIS-D-89).
 * - Capsis용 템플릿 목록은 아직 정해지지 않았다. 아래 여섯 개는 화면을 보여 주기 위한 예시다.
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
  redis: {
    id: 'redis',
    name: 'Redis',
    publisher: 'thakicloud',
    image:
      'harbor.example.com/thaki-apps/redis@sha256:2b4d6f8a0c1e3a5c7e9b1d3f5a7c9e0b2d4f6a8c0e1b3d5f7a9c1e3b5d7f9a0c',
    command: '',
    args: '',
    ports: [{ name: 'redis', containerPort: '6379', protocol: 'TCP' }],
    envVars: [],
    resources: { cpuCores: 0.25, memoryGB: 0.25 },
    volume: { name: 'data', sizeGi: 5, mountPath: '/data' },
    runAsUser: '999',
    runAsNonRoot: true,
  },
  mysql: {
    id: 'mysql',
    name: 'MySQL',
    publisher: 'thakicloud',
    image:
      'harbor.example.com/thaki-apps/mysql@sha256:7c9e1b3d5f7a9c1e3b5d7f9a0c2e4a6c8e0b2d4f6a8c0e2b4d6f8a0c1e3a5c7e',
    command: '',
    args: '',
    ports: [{ name: 'mysql', containerPort: '3306', protocol: 'TCP' }],
    envVars: [{ name: 'MYSQL_DATABASE', value: 'app' }],
    resources: { cpuCores: 0.5, memoryGB: 1 },
    volume: { name: 'data', sizeGi: 10, mountPath: '/var/lib/mysql' },
    runAsUser: '999',
    runAsNonRoot: true,
  },
  mongodb: {
    id: 'mongodb',
    name: 'MongoDB',
    publisher: 'community',
    image:
      'harbor.example.com/community/mongo@sha256:0e2b4d6f8a0c1e3a5c7e9b1d3f5a7c9e0b2d4f6a8c0e1b3d5f7a9c1e3b5d7f9a',
    command: '',
    args: '',
    ports: [{ name: 'mongodb', containerPort: '27017', protocol: 'TCP' }],
    envVars: [],
    resources: { cpuCores: 0.5, memoryGB: 1 },
    volume: { name: 'data', sizeGi: 10, mountPath: '/data/db' },
    runAsUser: '999',
    runAsNonRoot: true,
  },
  rabbitmq: {
    id: 'rabbitmq',
    name: 'RabbitMQ',
    publisher: 'community',
    image:
      'harbor.example.com/community/rabbitmq@sha256:5a7c9e1b3d5f7a9c1e3b5d7f9a0c2e4a6c8e0b2d4f6a8c0e2b4d6f8a0c1e3a5c',
    command: '',
    args: '',
    ports: [{ name: 'amqp', containerPort: '5672', protocol: 'TCP' }],
    envVars: [],
    resources: { cpuCores: 0.5, memoryGB: 0.5 },
    runAsUser: '999',
    runAsNonRoot: true,
  },
};

/** 카드에 보이는 이미지 저장소 경로 — digest는 뺀다 */
export const imageRepository = (image: string) => image.split('@')[0];

/** 권장 자원 요구량 → 폼 값(CAPSIS-D-87). requests에만 넣고 limits는 비워 둔다 */
export const toFormResources = (r: HubPodTemplate['resources']) => {
  const cpuRequest = Math.round(r.cpuCores * 1000);
  const memoryRequest = Math.round(r.memoryGB * 1024);
  return {
    cpuRequest: String(cpuRequest),
    cpuLimit: '',
    memoryRequest: String(memoryRequest),
    memoryLimit: '',
  };
};
