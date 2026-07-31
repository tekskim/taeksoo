/* ----------------------------------------
   컨테이너 이미지 목데이터 — 레지스트리에서 오는 데이터.

   ⚠ 다른 목데이터와 출처가 다르다. 컨테이너 이미지는 쿠버네티스 API 객체가 아니라서
   클러스터에 물어봐서 목록을 얻을 수 없다. 이 데이터는 **레지스트리**의 조회 API
   (OCI Distribution 표준 + Harbor 자체 API)에서 오는 것으로 가정한다.

   Container Images 목록 화면과 Deployment 생성 폼의 이미지 선택기가 같은 데이터를 읽는다.
   ---------------------------------------- */

export type VulnSeverity = 'Critical' | 'High' | 'Medium' | 'None';

export interface ContainerImageRow {
  id: string;
  repository: string;
  project: string;
  tag: string;
  digest: string;
  size: string;
  severity: VulnSeverity;
  vulnCount: number;
  signed: boolean;
  pushedAt: string;
}

export interface RegistryOption {
  host: string;
  label: string;
  /** 사설 레지스트리는 pull secret 없이는 이미지를 받아오지 못한다. */
  isPrivate: boolean;
  /** 사설 레지스트리에서 쓸 pull secret 이름. 없으면 배포가 ImagePullBackOff로 실패한다. */
  pullSecret?: string;
}

export const REGISTRIES: RegistryOption[] = [
  {
    host: 'harbor.thakicloud.co.kr',
    label: 'harbor.thakicloud.co.kr',
    isPrivate: true,
    pullSecret: 'harbor-thakicloud',
  },
  {
    host: 'docker.io',
    label: 'docker.io (public)',
    isPrivate: false,
  },
];

export const DEFAULT_REGISTRY_HOST = REGISTRIES[0].host;

export function getRegistry(host: string): RegistryOption {
  return REGISTRIES.find((r) => r.host === host) ?? REGISTRIES[0];
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

export const containerImagesData: ContainerImageRow[] = [
  {
    id: '1',
    repository: 'api-gateway',
    project: 'tenant-a',
    tag: 'v1.4.2',
    digest: 'sha256:a3f91c07',
    size: '184 MB',
    severity: 'None',
    vulnCount: 0,
    signed: true,
    pushedAt: 'Jul 29, 2026 16:22:41',
  },
  {
    id: '2',
    repository: 'api-gateway',
    project: 'tenant-a',
    tag: 'v1.4.1',
    digest: 'sha256:7b20de55',
    size: '184 MB',
    severity: 'Medium',
    vulnCount: 3,
    signed: true,
    pushedAt: 'Jul 22, 2026 11:07:15',
  },
  {
    id: '3',
    repository: 'web-frontend',
    project: 'tenant-a',
    tag: 'latest',
    digest: 'sha256:c81f4a90',
    size: '96 MB',
    severity: 'High',
    vulnCount: 7,
    signed: false,
    pushedAt: 'Jul 30, 2026 09:12:03',
  },
  {
    id: '4',
    repository: 'batch-worker',
    project: 'tenant-b',
    tag: 'v0.9.0',
    digest: 'sha256:1de6b3f7',
    size: '312 MB',
    severity: 'Critical',
    vulnCount: 2,
    signed: false,
    pushedAt: 'Jul 18, 2026 14:48:59',
  },
  {
    id: '5',
    repository: 'metis-serving',
    project: 'metis',
    tag: '2026.07-cu124',
    digest: 'sha256:9a4c07be',
    size: '6.2 GB',
    severity: 'Medium',
    vulnCount: 11,
    signed: true,
    pushedAt: 'Jul 25, 2026 03:31:27',
  },
  {
    id: '6',
    repository: 'maxis-trainer',
    project: 'maxis',
    tag: '2026.07',
    digest: 'sha256:04ee1b28',
    size: '8.7 GB',
    severity: 'None',
    vulnCount: 0,
    signed: true,
    pushedAt: 'Jul 24, 2026 20:55:44',
  },
  {
    id: '7',
    repository: 'valkey',
    project: 'library',
    tag: '8.0',
    digest: 'sha256:bb3907fd',
    size: '42 MB',
    severity: 'None',
    vulnCount: 0,
    signed: true,
    pushedAt: 'Jul 02, 2026 08:00:11',
  },
  {
    id: '8',
    repository: 'postgresql',
    project: 'library',
    tag: '17.2',
    digest: 'sha256:5f2a6ce1',
    size: '148 MB',
    severity: 'Medium',
    vulnCount: 5,
    signed: true,
    pushedAt: 'Jun 28, 2026 13:19:36',
  },
];

export const severityTheme: Record<VulnSeverity, 'red' | 'yellow' | 'blue' | 'green'> = {
  Critical: 'red',
  High: 'yellow',
  Medium: 'blue',
  None: 'green',
};

/** 태그로 가리키는 주소. 같은 태그라도 내용물이 바뀔 수 있다. */
export function imageReferenceByTag(row: ContainerImageRow, registryHost: string): string {
  return `${registryHost}/${row.project}/${row.repository}:${row.tag}`;
}

/** 다이제스트로 고정한 주소. 내용물이 절대 바뀌지 않는다. */
export function imageReferenceByDigest(row: ContainerImageRow, registryHost: string): string {
  return `${registryHost}/${row.project}/${row.repository}@${row.digest}`;
}

/* ----------------------------------------
   취약점 상세 — 레지스트리의 스캔 결과.

   레지스트리가 이미지를 뜯어 설치된 패키지 목록을 뽑고, 알려진 취약점 DB와
   대조한 결과다. 쿠버네티스가 아는 정보가 아니다.
   ---------------------------------------- */

export interface VulnFinding {
  cve: string;
  severity: Exclude<VulnSeverity, 'None'>;
  packageName: string;
  installed: string;
  /** 고쳐진 버전. 없으면 아직 패치가 없다는 뜻이다. */
  fixedIn?: string;
}

const FINDING_POOL: VulnFinding[] = [
  {
    cve: 'CVE-2026-21874',
    severity: 'Critical',
    packageName: 'openssl',
    installed: '3.0.11',
    fixedIn: '3.0.14',
  },
  {
    cve: 'CVE-2026-20455',
    severity: 'Critical',
    packageName: 'glibc',
    installed: '2.36-9',
    fixedIn: '2.36-12',
  },
  {
    cve: 'CVE-2026-19003',
    severity: 'High',
    packageName: 'libxml2',
    installed: '2.9.14',
    fixedIn: '2.9.14-r1',
  },
  {
    cve: 'CVE-2026-18820',
    severity: 'High',
    packageName: 'curl',
    installed: '8.4.0',
    fixedIn: '8.6.0',
  },
  {
    cve: 'CVE-2026-18337',
    severity: 'High',
    packageName: 'zlib',
    installed: '1.2.13',
    fixedIn: '1.3.1',
  },
  { cve: 'CVE-2026-17765', severity: 'Medium', packageName: 'busybox', installed: '1.36.1' },
  {
    cve: 'CVE-2026-17012',
    severity: 'Medium',
    packageName: 'pcre2',
    installed: '10.42',
    fixedIn: '10.43',
  },
  {
    cve: 'CVE-2026-16588',
    severity: 'Medium',
    packageName: 'sqlite',
    installed: '3.40.1',
    fixedIn: '3.45.0',
  },
  {
    cve: 'CVE-2026-16104',
    severity: 'Medium',
    packageName: 'expat',
    installed: '2.5.0',
    fixedIn: '2.6.0',
  },
  { cve: 'CVE-2026-15772', severity: 'Medium', packageName: 'ncurses', installed: '6.4' },
  {
    cve: 'CVE-2026-15330',
    severity: 'High',
    packageName: 'gnutls',
    installed: '3.7.9',
    fixedIn: '3.8.3',
  },
  {
    cve: 'CVE-2026-14988',
    severity: 'Medium',
    packageName: 'tar',
    installed: '1.34',
    fixedIn: '1.35',
  },
];

/**
 * 이미지의 취약점 목록. `vulnCount`만큼, 가장 심각한 것부터 돌려준다.
 * 목업이므로 고정된 풀에서 잘라 쓴다 — 같은 이미지는 항상 같은 결과가 나온다.
 */
export function getFindings(image: ContainerImageRow): VulnFinding[] {
  if (image.vulnCount === 0) return [];
  const order: Record<Exclude<VulnSeverity, 'None'>, number> = {
    Critical: 0,
    High: 1,
    Medium: 2,
  };
  const sorted = [...FINDING_POOL].sort((a, b) => order[a.severity] - order[b.severity]);
  const start = image.severity === 'Critical' ? 0 : image.severity === 'High' ? 2 : 5;
  return sorted.slice(start, start + image.vulnCount);
}

/** id로 이미지 하나 찾기. */
export function findImageById(id: string | undefined): ContainerImageRow | undefined {
  if (!id) return undefined;
  return containerImagesData.find((img) => img.id === id);
}

/** 같은 리포지토리의 다른 태그들. */
export function findSiblingTags(image: ContainerImageRow): ContainerImageRow[] {
  return containerImagesData.filter(
    (img) => img.repository === image.repository && img.project === image.project
  );
}

/**
 * 이미지 주소에서 필요한 pull secret을 찾는다.
 * 목록 화면에서 폼으로 주소만 넘어온 경우에도 인증 정보를 같이 채우기 위한 것이다.
 * 공용 레지스트리이거나 아는 레지스트리가 아니면 undefined.
 */
export function pullSecretForReference(reference: string): string | undefined {
  const match = REGISTRIES.find((r) => reference.startsWith(`${r.host}/`));
  return match?.isPrivate ? match.pullSecret : undefined;
}
