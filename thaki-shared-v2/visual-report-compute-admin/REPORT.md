# Compute Admin Visual Regression Report

Generated: 2026-03-25T02:07:03.089Z
Pages compared: 61
Average diff: 1.26%
GOOD: 60 | WARN: 1 | REVIEW: 0

## Summary by Type

| Type    | Total | GOOD | WARN | REVIEW | Avg Diff |
| ------- | ----- | ---- | ---- | ------ | -------- |
| list    | 23    | 23   | 0    | 0      | 1.59%    |
| detail  | 28    | 28   | 0    | 0      | 0.66%    |
| create  | 6     | 6    | 0    | 0      | 1.38%    |
| special | 4     | 3    | 1    | 0      | 3.41%    |

## Page-by-Page Results

| Page                          | Route                                       | Type    | TDS Size | shared-v2 Size | Diff Pixels | Diff % | Status |
| ----------------------------- | ------------------------------------------- | ------- | -------- | -------------- | ----------- | ------ | ------ |
| ca-home                       | /compute-admin                              | special | 1440x900 | 1440x900       | 17,681      | 1.36%  | GOOD   |
| ca-instances-list             | /compute-admin/instances                    | list    | 1440x900 | 1440x900       | 30,332      | 2.34%  | GOOD   |
| ca-instance-templates-list    | /compute-admin/instance-templates           | list    | 1440x900 | 1440x900       | 10,481      | 0.81%  | GOOD   |
| ca-instance-snapshots-list    | /compute-admin/instance-snapshots           | list    | 1440x900 | 1440x900       | 25,421      | 1.96%  | GOOD   |
| ca-images-list                | /compute-admin/images                       | list    | 1440x900 | 1440x900       | 18,747      | 1.45%  | GOOD   |
| ca-flavors-list               | /compute-admin/flavors                      | list    | 1440x900 | 1440x900       | 12,579      | 0.97%  | GOOD   |
| ca-server-groups-list         | /compute-admin/server-groups                | list    | 1440x900 | 1440x900       | 19,242      | 1.48%  | GOOD   |
| ca-host-aggregates-list       | /compute-admin/host-aggregates              | list    | 1440x900 | 1440x900       | 12,895      | 0.99%  | GOOD   |
| ca-bare-metal-nodes-list      | /compute-admin/bare-metal-nodes             | list    | 1440x900 | 1440x900       | 16,119      | 1.24%  | GOOD   |
| ca-instance-detail            | /compute-admin/instances/vm-001             | detail  | 1440x900 | 1440x900       | 10,692      | 0.83%  | GOOD   |
| ca-instance-template-detail   | /compute-admin/instance-templates/tpl-001   | detail  | 1440x900 | 1440x900       | 20,198      | 1.56%  | GOOD   |
| ca-instance-snapshot-detail   | /compute-admin/instance-snapshots/isnap-001 | detail  | 1440x900 | 1440x900       | 7,248       | 0.56%  | GOOD   |
| ca-image-detail               | /compute-admin/images/img-001               | detail  | 1440x900 | 1440x900       | 7,883       | 0.61%  | GOOD   |
| ca-flavor-detail              | /compute-admin/flavors/flv-001              | detail  | 1440x900 | 1440x900       | 6,703       | 0.52%  | GOOD   |
| ca-server-group-detail        | /compute-admin/server-groups/sg-001         | detail  | 1440x900 | 1440x900       | 15,694      | 1.21%  | GOOD   |
| ca-bare-metal-detail          | /compute-admin/bare-metal-nodes/bm-001      | detail  | 1440x900 | 1440x900       | 8,753       | 0.68%  | GOOD   |
| ca-instance-create            | /compute-admin/instances/create             | create  | 1440x900 | 1440x900       | 22,670      | 1.75%  | GOOD   |
| ca-instance-template-create   | /compute-admin/instance-templates/create    | create  | 1440x900 | 1440x900       | 15,209      | 1.17%  | GOOD   |
| ca-image-create               | /compute-admin/images/create                | create  | 1440x900 | 1440x900       | 15,626      | 1.21%  | GOOD   |
| ca-flavor-create              | /compute-admin/flavors/create               | create  | 1440x900 | 1440x900       | 18,674      | 1.44%  | GOOD   |
| ca-volumes-list               | /compute-admin/volumes                      | list    | 1440x900 | 1440x900       | 28,502      | 2.2%   | GOOD   |
| ca-volume-snapshots-list      | /compute-admin/volume-snapshots             | list    | 1440x900 | 1440x900       | 21,230      | 1.64%  | GOOD   |
| ca-volume-backups-list        | /compute-admin/volume-backups               | list    | 1440x900 | 1440x900       | 21,099      | 1.63%  | GOOD   |
| ca-volume-types-list          | /compute-admin/volume-types                 | list    | 1440x900 | 1440x900       | 12,606      | 0.97%  | GOOD   |
| ca-volume-detail              | /compute-admin/volumes/vol-001              | detail  | 1440x900 | 1440x900       | 8,575       | 0.66%  | GOOD   |
| ca-volume-snapshot-detail     | /compute-admin/volume-snapshots/vsnap-001   | detail  | 1440x900 | 1440x900       | 7,166       | 0.55%  | GOOD   |
| ca-volume-backup-detail       | /compute-admin/volume-backups/vbak-001      | detail  | 1440x900 | 1440x900       | 7,225       | 0.56%  | GOOD   |
| ca-volume-type-detail         | /compute-admin/volume-types/vt-001          | detail  | 1440x900 | 1440x900       | 8,823       | 0.68%  | GOOD   |
| ca-qos-spec-detail            | /compute-admin/qos-specs/qs-001             | detail  | 1440x900 | 1440x900       | 7,089       | 0.55%  | GOOD   |
| ca-networks-list              | /compute-admin/networks                     | list    | 1440x900 | 1440x900       | 18,327      | 1.41%  | GOOD   |
| ca-routers-list               | /compute-admin/routers                      | list    | 1440x900 | 1440x900       | 23,098      | 1.78%  | GOOD   |
| ca-ports-list                 | /compute-admin/ports                        | list    | 1440x900 | 1440x900       | 27,069      | 2.09%  | GOOD   |
| ca-floating-ips-list          | /compute-admin/floating-ips                 | list    | 1440x900 | 1440x900       | 27,128      | 2.09%  | GOOD   |
| ca-security-groups-list       | /compute-admin/security-groups              | list    | 1440x900 | 1440x900       | 19,280      | 1.49%  | GOOD   |
| ca-load-balancers-list        | /compute-admin/load-balancers               | list    | 1440x900 | 1440x900       | 31,314      | 2.42%  | GOOD   |
| ca-firewalls-list             | /compute-admin/firewall                     | list    | 1440x900 | 1440x900       | 27,747      | 2.14%  | GOOD   |
| ca-certificates-list          | /compute-admin/certificates                 | list    | 1440x900 | 1440x900       | 19,553      | 1.51%  | GOOD   |
| ca-network-detail             | /compute-admin/networks/net-001             | detail  | 1440x900 | 1440x900       | 7,842       | 0.61%  | GOOD   |
| ca-subnet-detail              | /compute-admin/subnets/subnet-001           | detail  | 1440x900 | 1440x900       | 6,739       | 0.52%  | GOOD   |
| ca-router-detail              | /compute-admin/routers/rtr-001              | detail  | 1440x900 | 1440x900       | 7,129       | 0.55%  | GOOD   |
| ca-port-detail                | /compute-admin/ports/port-001               | detail  | 1440x900 | 1440x900       | 7,440       | 0.57%  | GOOD   |
| ca-floating-ip-detail         | /compute-admin/floating-ips/fip-001         | detail  | 1440x900 | 1440x900       | 6,543       | 0.5%   | GOOD   |
| ca-security-group-detail      | /compute-admin/security-groups/sg-001       | detail  | 1440x900 | 1440x900       | 9,272       | 0.72%  | GOOD   |
| ca-load-balancer-detail       | /compute-admin/load-balancers/lb-001        | detail  | 1440x900 | 1440x900       | 7,686       | 0.59%  | GOOD   |
| ca-listener-detail            | /compute-admin/listeners/lsnr-001           | detail  | 1440x900 | 1440x900       | 6,301       | 0.49%  | GOOD   |
| ca-pool-detail                | /compute-admin/pools/pool-001               | detail  | 1440x900 | 1440x900       | 6,655       | 0.51%  | GOOD   |
| ca-l7-policy-detail           | /compute-admin/l7-policies/l7p-001          | detail  | 1440x900 | 1440x900       | 7,507       | 0.58%  | GOOD   |
| ca-firewall-detail            | /compute-admin/firewalls/fw-001             | detail  | 1440x900 | 1440x900       | 7,247       | 0.56%  | GOOD   |
| ca-firewall-policy-detail     | /compute-admin/firewall-policies/fwp-001    | detail  | 1440x900 | 1440x900       | 9,889       | 0.76%  | GOOD   |
| ca-firewall-rule-detail       | /compute-admin/firewall-rules/fwr-001       | detail  | 1440x900 | 1440x900       | 5,612       | 0.43%  | GOOD   |
| ca-certificate-detail         | /compute-admin/certificates/cert-001        | detail  | 1440x900 | 1440x900       | 8,859       | 0.68%  | GOOD   |
| ca-network-create             | /compute-admin/networks/create              | create  | 1440x900 | 1440x900       | 16,482      | 1.27%  | GOOD   |
| ca-firewall-rule-create       | /compute-admin/firewall/create-rule         | create  | 1440x900 | 1440x900       | 18,580      | 1.43%  | GOOD   |
| ca-tenants-list               | /compute-admin/tenants                      | list    | 1440x900 | 1440x900       | 12,700      | 0.98%  | GOOD   |
| ca-metadata-definitions-list  | /compute-admin/metadata-definition          | list    | 1440x900 | 1440x900       | 16,828      | 1.3%   | GOOD   |
| ca-tenant-detail              | /compute-admin/tenants/tenant-001           | detail  | 1440x900 | 1440x900       | 12,810      | 0.99%  | GOOD   |
| ca-metadata-definition-detail | /compute-admin/metadata-definition/md-001   | detail  | 1440x900 | 1440x900       | 6,726       | 0.52%  | GOOD   |
| ca-monitor-overview           | /compute-admin/monitor-overview             | special | 1440x900 | 1440x900       | 39,379      | 3.04%  | GOOD   |
| ca-physical-nodes-list        | /compute-admin/physical-nodes               | list    | 1440x900 | 1440x900       | 20,308      | 1.57%  | GOOD   |
| ca-topology                   | /compute-admin/topology                     | special | 1440x900 | 1440x900       | 4,513       | 0.35%  | GOOD   |
| ca-console                    | /compute-admin/console/vm-001               | special | 1440x900 | 1440x900       | 115,340     | 8.9%   | WARN   |

## Status Criteria

- **GOOD**: < 5% pixel difference
- **WARN**: 5-10% pixel difference
- **REVIEW**: > 10% pixel difference (requires attention)

## Files

- TDS screenshots: `/Users/pobae/tds/tds/thaki-shared-v2/visual-report-compute-admin/tds`
- shared-v2 screenshots: `/Users/pobae/tds/tds/thaki-shared-v2/visual-report-compute-admin/shared-v2`
- Diff images: `/Users/pobae/tds/tds/thaki-shared-v2/visual-report-compute-admin/diff`
