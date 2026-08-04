/* ----------------------------------------
   Kubernetes VolumeSnapshot 목데이터.

   주의 — Compute(OpenStack)의 볼륨 스냅샷과 이름만 같고 다른 리소스다.
   이쪽은 K8s PVC에서 파생된 `snapshot.storage.k8s.io/v1` 리소스다.

   스냅샷은 스토리지 드라이버(CSI)가 지원해야만 동작한다. 온프렘 스토리지 계열은
   Ceph로 확인됐고(규약 [ACONT-67] — StorageClass provisioner `ceph` 고정),
   ceph-csi는 RBD·CephFS 모두 스냅샷을 지원한다. 그래서 snapshotClass를 ceph 계열로 둔다.
   실제 활성화 여부(스냅샷 CRD·컨트롤러 설치, snapshotter 사이드카, VolumeSnapshotClass
   정의)는 인프라 확인 대상이다.
   ---------------------------------------- */

export interface ContainerVolumeSnapshotRow {
  id: string;
  name: string;
  status: string;
  namespace: string;
  sourcePvc: string;
  restoreSize: string;
  snapshotClass: string;
  readyToUse: boolean;
  createdAt: string;
}

export const containerVolumeSnapshotsData: ContainerVolumeSnapshotRow[] = [
  {
    id: '1',
    name: 'postgres-daily-20260730',
    status: 'Ready',
    namespace: 'database',
    sourcePvc: 'postgres-data',
    restoreSize: '100Gi',
    snapshotClass: 'ceph-rbd-snapclass',
    readyToUse: true,
    createdAt: 'Jul 30, 2026 03:00:12',
  },
  {
    id: '2',
    name: 'postgres-daily-20260729',
    status: 'Ready',
    namespace: 'database',
    sourcePvc: 'postgres-data',
    restoreSize: '100Gi',
    snapshotClass: 'ceph-rbd-snapclass',
    readyToUse: true,
    createdAt: 'Jul 29, 2026 03:00:08',
  },
  {
    id: '3',
    name: 'metis-checkpoint-epoch-40',
    status: 'Ready',
    namespace: 'metis-training',
    sourcePvc: 'training-checkpoints',
    restoreSize: '2Ti',
    snapshotClass: 'cephfs-snapclass',
    readyToUse: true,
    createdAt: 'Jul 29, 2026 21:44:37',
  },
  {
    id: '4',
    name: 'metis-checkpoint-epoch-35',
    status: 'Ready',
    namespace: 'metis-training',
    sourcePvc: 'training-checkpoints',
    restoreSize: '2Ti',
    snapshotClass: 'cephfs-snapclass',
    readyToUse: true,
    createdAt: 'Jul 28, 2026 17:12:55',
  },
  {
    id: '5',
    name: 'gitea-preupgrade',
    status: 'Pending',
    namespace: 'devtools',
    sourcePvc: 'gitea-repos',
    restoreSize: '50Gi',
    snapshotClass: 'ceph-rbd-snapclass',
    readyToUse: false,
    createdAt: 'Jul 30, 2026 09:41:03',
  },
  {
    id: '6',
    name: 'valkey-manual-0730',
    status: 'Ready',
    namespace: 'devtools',
    sourcePvc: 'valkey-data',
    restoreSize: '10Gi',
    snapshotClass: 'ceph-rbd-snapclass',
    readyToUse: true,
    createdAt: 'Jul 30, 2026 08:20:19',
  },
  {
    id: '7',
    name: 'maxis-registry-weekly',
    status: 'Failed',
    namespace: 'maxis',
    sourcePvc: 'model-registry',
    restoreSize: '500Gi',
    snapshotClass: 'cephfs-snapclass',
    readyToUse: false,
    createdAt: 'Jul 27, 2026 02:00:44',
  },
];

export function findSnapshotById(id: string | undefined): ContainerVolumeSnapshotRow | undefined {
  if (!id) return undefined;
  return containerVolumeSnapshotsData.find((s) => s.id === id);
}

export function findSnapshotByName(
  name: string | null | undefined
): ContainerVolumeSnapshotRow | undefined {
  if (!name) return undefined;
  return containerVolumeSnapshotsData.find((s) => s.name === name);
}

/** 복원할 수 있는 스냅샷만. 아직 준비되지 않았거나 실패한 것은 고를 수 없다. */
export function restorableSnapshots(): ContainerVolumeSnapshotRow[] {
  return containerVolumeSnapshotsData.filter((s) => s.readyToUse);
}

/**
 * `restoreSize`를 GiB 숫자로 바꾼다. 새 PVC는 스냅샷보다 작게 만들 수 없어서
 * 입력란의 최솟값으로 쓴다. (`2Ti` → 2048)
 */
export function restoreSizeInGi(snapshot: ContainerVolumeSnapshotRow): number {
  const match = snapshot.restoreSize.match(/^(\d+(?:\.\d+)?)(Ti|Gi|Mi)$/);
  if (!match) return 1;
  const amount = Number(match[1]);
  if (match[2] === 'Ti') return Math.ceil(amount * 1024);
  if (match[2] === 'Mi') return Math.max(1, Math.ceil(amount / 1024));
  return Math.ceil(amount);
}
