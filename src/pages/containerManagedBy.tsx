import { Badge, fixedColumns, type TableColumn } from '@/design-system';

/* ----------------------------------------
   Managed-by column (Container Platform mode only, CorePlan D-26)

   Shows which product created and manages a resource: Maxis (training + dev
   environments) or Metis (serving). Resources without a managing product show
   no badge. The merged app hosts every resource; product-level actions live in
   the managing product.
   ---------------------------------------- */

// Hub — Hub Pod Template으로 만든 Pod. Pod의 managed by hub 라벨에서 받아 온다(CAPSIS-D-92)
export type WorkloadManagedBy = 'Maxis' | 'Metis' | 'Hub';

const MANAGED_BY_THEME: Record<WorkloadManagedBy, 'green' | 'yellow' | 'blue'> = {
  Maxis: 'green',
  Metis: 'yellow',
  Hub: 'blue',
};

export function managedByColumn<T extends { managedBy?: WorkloadManagedBy }>(): TableColumn<T> {
  return {
    key: 'managedBy',
    label: 'Managed by',
    width: fixedColumns.statusLabel,
    sortable: false,
    render: (value: WorkloadManagedBy | undefined) =>
      value ? (
        <Badge theme={MANAGED_BY_THEME[value]} type="solid" size="sm">
          {value}
        </Badge>
      ) : (
        <span className="text-body-sm text-[var(--color-text-subtle)]">—</span>
      ),
  } as TableColumn<T>;
}
