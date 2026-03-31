# Compute Admin Content & Design Check Report

Generated: 2026-03-25T02:12:18.268Z
Pages tested: 61
PASS: 58 | FAIL: 3

## Summary by Type

| Type    | Total | PASS | FAIL |
| ------- | ----- | ---- | ---- |
| list    | 23    | 23   | 0    |
| detail  | 28    | 28   | 0    |
| create  | 6     | 3    | 3    |
| special | 4     | 4    | 0    |

## Page-by-Page Results

### ca-home (`/compute-admin`) [special] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Content: present

### ca-instances-list (`/compute-admin/instances`) [list] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Table: present
- Pagination: present
- Search: present

### ca-instance-templates-list (`/compute-admin/instance-templates`) [list] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Table: present
- Pagination: present
- Search: present

### ca-instance-snapshots-list (`/compute-admin/instance-snapshots`) [list] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Table: present
- Pagination: present
- Search: present

### ca-images-list (`/compute-admin/images`) [list] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Table: present
- Pagination: present
- Search: present

### ca-flavors-list (`/compute-admin/flavors`) [list] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Table: present
- Pagination: present
- Search: present

### ca-server-groups-list (`/compute-admin/server-groups`) [list] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Table: present
- Pagination: present
- Search: present

### ca-host-aggregates-list (`/compute-admin/host-aggregates`) [list] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Table: present
- Pagination: present
- Search: present

### ca-bare-metal-nodes-list (`/compute-admin/bare-metal-nodes`) [list] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Table: present
- Pagination: present
- Search: present

### ca-instance-detail (`/compute-admin/instances/vm-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-instance-template-detail (`/compute-admin/instance-templates/tpl-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-instance-snapshot-detail (`/compute-admin/instance-snapshots/isnap-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-image-detail (`/compute-admin/images/img-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-flavor-detail (`/compute-admin/flavors/flv-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-server-group-detail (`/compute-admin/server-groups/sg-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-bare-metal-detail (`/compute-admin/bare-metal-nodes/bm-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-instance-create (`/compute-admin/instances/create`) [create] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Form inputs: present
- Buttons: present

### ca-instance-template-create (`/compute-admin/instance-templates/create`) [create] - **FAIL**

**Errors:**

- Navigation error: Page check timeout (30s)

### ca-image-create (`/compute-admin/images/create`) [create] - **FAIL**

**Errors:**

- Navigation error: Page check timeout (30s)

### ca-flavor-create (`/compute-admin/flavors/create`) [create] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Form inputs: present
- Buttons: present

### ca-volumes-list (`/compute-admin/volumes`) [list] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Table: present
- Pagination: present
- Search: present

### ca-volume-snapshots-list (`/compute-admin/volume-snapshots`) [list] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Table: present
- Pagination: present
- Search: present

### ca-volume-backups-list (`/compute-admin/volume-backups`) [list] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Table: present
- Pagination: present
- Search: present

### ca-volume-types-list (`/compute-admin/volume-types`) [list] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Table: present
- Pagination: present
- Search: present

### ca-volume-detail (`/compute-admin/volumes/vol-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-volume-snapshot-detail (`/compute-admin/volume-snapshots/vsnap-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-volume-backup-detail (`/compute-admin/volume-backups/vbak-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-volume-type-detail (`/compute-admin/volume-types/vt-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-qos-spec-detail (`/compute-admin/qos-specs/qs-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-networks-list (`/compute-admin/networks`) [list] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Table: present
- Pagination: present
- Search: present

### ca-routers-list (`/compute-admin/routers`) [list] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Table: present
- Pagination: present
- Search: present

### ca-ports-list (`/compute-admin/ports`) [list] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Table: present
- Pagination: present
- Search: present

### ca-floating-ips-list (`/compute-admin/floating-ips`) [list] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Table: present
- Pagination: present
- Search: present

### ca-security-groups-list (`/compute-admin/security-groups`) [list] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Table: present
- Pagination: present
- Search: present

### ca-load-balancers-list (`/compute-admin/load-balancers`) [list] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Table: present
- Pagination: present
- Search: present

### ca-firewalls-list (`/compute-admin/firewall`) [list] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Table: present
- Pagination: present
- Search: present

### ca-certificates-list (`/compute-admin/certificates`) [list] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Table: present
- Pagination: present
- Search: present

### ca-network-detail (`/compute-admin/networks/net-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-subnet-detail (`/compute-admin/subnets/subnet-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-router-detail (`/compute-admin/routers/rtr-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-port-detail (`/compute-admin/ports/port-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-floating-ip-detail (`/compute-admin/floating-ips/fip-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-security-group-detail (`/compute-admin/security-groups/sg-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-load-balancer-detail (`/compute-admin/load-balancers/lb-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-listener-detail (`/compute-admin/listeners/lsnr-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-pool-detail (`/compute-admin/pools/pool-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-l7-policy-detail (`/compute-admin/l7-policies/l7p-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-firewall-detail (`/compute-admin/firewalls/fw-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-firewall-policy-detail (`/compute-admin/firewall-policies/fwp-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-firewall-rule-detail (`/compute-admin/firewall-rules/fwr-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-certificate-detail (`/compute-admin/certificates/cert-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-network-create (`/compute-admin/networks/create`) [create] - **FAIL**

**Errors:**

- Navigation error: Page check timeout (30s)

### ca-firewall-rule-create (`/compute-admin/firewall/create-rule`) [create] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Form inputs: present
- Buttons: present

### ca-tenants-list (`/compute-admin/tenants`) [list] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Table: present
- Pagination: present
- Search: present

### ca-metadata-definitions-list (`/compute-admin/metadata-definition`) [list] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Table: present
- Pagination: present
- Search: present

### ca-tenant-detail (`/compute-admin/tenants/tenant-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-metadata-definition-detail (`/compute-admin/metadata-definition/md-001`) [detail] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Detail header: present
- Tabs: present

### ca-monitor-overview (`/compute-admin/monitor-overview`) [special] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Content: present

### ca-physical-nodes-list (`/compute-admin/physical-nodes`) [list] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Title: present
- Table: present
- Pagination: present
- Search: present

### ca-topology (`/compute-admin/topology`) [special] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Content: present

### ca-console (`/compute-admin/console/vm-001`) [special] - **PASS**

**Component checks:**

- Sidebar: present
- TabBar: present
- Breadcrumb: present
- Content: present

## Screenshots

All screenshots saved to: `/Users/pobae/tds/tds/thaki-shared-v2/visual-report-compute-admin/screenshots`
