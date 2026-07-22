/* ----------------------------------------
   Active cluster (Container Platform mode only, CorePlan D-27/D-28)

   The merged app keeps the existing icon-sidebar cluster switching. In CP mode
   the icons represent one General cluster (created via CP) and one Metis/Maxis
   dedicated cluster (registered). Workload pages read the active cluster to
   decide which mock data to show and whether creation is available —
   dedicated clusters are view + operate only (no create, edit via YAML).

   Module-level state survives route changes the same way the sidebar's
   savedScrollPosition does; switching clusters always navigates, so pages
   re-read it on mount.
   ---------------------------------------- */

export interface CpCluster {
  id: string;
  name: string;
  /** true = registered, Metis/Maxis dedicated (D-27) */
  dedicated: boolean;
  iconText?: string;
}

export const CP_CLUSTERS: CpCluster[] = [
  {
    id: 'cp-general-01',
    name: 'production-kubernetes-high-availability-cluster',
    dedicated: false,
  },
  { id: 'cp-metis-train-a100', name: 'metis-train-a100', dedicated: true, iconText: 'AI' },
];

let activeCpClusterId: string = CP_CLUSTERS[0].id;

export function getActiveCpCluster(): CpCluster {
  return CP_CLUSTERS.find((c) => c.id === activeCpClusterId) ?? CP_CLUSTERS[0];
}

export function setActiveCpClusterId(id: string): void {
  activeCpClusterId = id;
}
