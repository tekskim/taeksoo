import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';

import { Sidebar } from '@/components/Sidebar';
import { TabBar } from '@/components/TabBar';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import { VStack, HStack, Button } from '@/design-system';
import { IconX, IconCopy, IconChevronDown, IconChevronRight, IconSearch, IconFilter } from '@tabler/icons-react';

/* ----------------------------------------
   Theme Configuration
   ---------------------------------------- */
const COLORS = {
  externalNetwork: { active: '#3b82f6', inactive: '#93c5fd', error: '#ef4444' },
  router: { active: '#6366f1', inactive: '#a5b4fc', error: '#ef4444' },
  subnet: { active: '#14b8a6', inactive: '#5eead4', error: '#ef4444' },
  loadBalancer: { active: '#eab308', inactive: '#fde047', error: '#ef4444' },
  status: { active: '#22c55e', inactive: '#94a3b8', error: '#ef4444' },
  vpcPanel: { active: '#f0fdfa', inactive: '#f1f5f9', error: '#fee2e2' },
  vpcBorder: { active: '#5eead4', inactive: '#cbd5e1', error: '#fca5a5' },
};

const SIZES = {
  externalNetwork: { node: 56, icon: 28 },
  router: { node: 48, icon: 24 },
  subnet: { node: 40, icon: 20 },
  loadBalancer: { node: 36, icon: 18 },
  indicator: 10,
};

const ICONS = {
  externalNetwork: 'M4 6C4 7.06087 4.42143 8.07828 5.17157 8.82843C5.92172 9.57857 6.93913 10 8 10M4 6C4 4.93913 4.42143 3.92172 5.17157 3.17157C5.92172 2.42143 6.93913 2 8 2M4 6H12M8 10C9.06087 10 10.0783 9.57857 10.8284 8.82843C11.5786 8.07828 12 7.06087 12 6M8 10C8.88867 9.778 9.33333 8.44467 9.33333 6C9.33333 3.55533 8.88867 2.222 8 2M8 10C7.11133 9.778 6.66667 8.44467 6.66667 6C6.66667 3.55533 7.11133 2.222 8 2M8 10V12M12 6C12 4.93913 11.5786 3.92172 10.8284 3.17157C10.0783 2.42143 9.06087 2 8 2M2 13.3333H6.66667M6.66667 13.3333C6.66667 13.687 6.80714 14.0261 7.05719 14.2761C7.30724 14.5262 7.64638 14.6667 8 14.6667C8.35362 14.6667 8.69276 14.5262 8.94281 14.2761C9.19286 14.0261 9.33333 13.687 9.33333 13.3333M6.66667 13.3333C6.66667 12.9797 6.80714 12.6406 7.05719 12.3905C7.30724 12.1405 7.64638 12 8 12M9.33333 13.3333H14M9.33333 13.3333C9.33333 12.9797 9.19286 12.6406 8.94281 12.3905C8.69276 12.1405 8.35362 12 8 12',
  router: 'M7.99907 15.152V10.4951M7.99907 15.152L5.73633 12.8892M7.99907 15.152L10.2618 12.8892M3.24372 10.2625L5.50646 7.9998M5.50646 7.9998L3.24372 5.73706M5.50646 7.9998H0.849609M12.7569 5.73706L10.4941 7.9998M10.4941 7.9998L12.7569 10.2625M10.4941 7.9998H15.151M10.2618 3.11089L7.99907 0.848145M7.99907 0.848145L5.73633 3.11089M7.99907 0.848145V5.505',
  subnet: 'M8 8H8.00667M10.666 8H10.6727M11.334 4.66675L14.6673 8.00008L11.334 11.3334M4.66732 4.66675L1.33398 8.00008L4.66732 11.3334M5.33398 8H5.34065',
  loadBalancer: 'M8.00033 10.6667C7.46989 10.6667 6.96118 10.456 6.58611 10.0809C6.21104 9.70581 6.00033 9.1971 6.00033 8.66667C6.00033 8.13623 6.21104 7.62753 6.58611 7.25245C6.96118 6.87738 7.46989 6.66667 8.00033 6.66667M8.00033 10.6667C8.53076 10.6667 9.03947 10.456 9.41454 10.0809C9.78961 9.70581 10.0003 9.1971 10.0003 8.66667C10.0003 8.13623 9.78961 7.62753 9.41454 7.25245C9.03947 6.87738 8.53076 6.66667 8.00033 6.66667M8.00033 10.6667V12.6667M8.00033 6.66667V2M8.00033 12.6667C8.17714 12.6667 8.34671 12.7369 8.47173 12.8619C8.59675 12.987 8.66699 13.1565 8.66699 13.3333C8.66699 13.5101 8.59675 13.6797 8.47173 13.8047C8.34671 13.9298 8.17714 14 8.00033 14C7.82351 14 7.65395 13.9298 7.52892 13.8047C7.4039 13.6797 7.33366 13.5101 7.33366 13.3333C7.33366 13.1565 7.4039 12.987 7.52892 12.8619C7.65395 12.7369 7.82351 12.6667 8.00033 12.6667ZM8.00033 2L6.00033 4M8.00033 2L10.0003 4M9.92969 8.15129L14.003 6.66862M14.003 6.66862L11.4396 5.47331M14.003 6.66862L12.8076 9.23197M6.06758 8.14262L2.01758 6.66862M2.01758 6.66862L4.58091 5.47331M2.01758 6.66862L3.21291 9.23197',
};

/* ----------------------------------------
   Data Types
   ---------------------------------------- */
interface Router {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  externalNetworkId?: string;
}

interface Network {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
}

interface Subnet {
  id: string;
  name: string;
  cidr: string;
  status: 'active' | 'inactive' | 'error';
  networkId: string;
  routerId?: string;
}

interface LoadBalancer {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  subnetId: string;
  vip: string;
}

/* ----------------------------------------
   Enterprise Sample Data
   시나리오: 글로벌 이커머스 기업
   네이밍 컨벤션: [env]-[region]-[type]-[purpose]-[az/seq]
   
   Regions:
   - apne2: Asia Pacific Northeast 2 (Seoul)
   - usw2: US West 2 (Oregon)
   - euw1: EU West 1 (Ireland)
   ---------------------------------------- */

// External Networks - 외부 네트워크 (ISP/Cloud Provider 연결)
interface ExternalNetwork {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  description: string;
}

const externalNetworks: ExternalNetwork[] = [
  { id: 'extnet-apne2-pub-001', name: 'extnet-apne2-public-001', status: 'active', description: 'Seoul Region Public Internet' },
  { id: 'extnet-usw2-pub-001', name: 'extnet-usw2-public-001', status: 'active', description: 'Oregon Region Public Internet' },
  { id: 'extnet-dc-priv-001', name: 'extnet-dc-private-001', status: 'active', description: 'Datacenter Direct Connect' },
];

// Routers - 라우터 (환경별, 용도별)
const routers: Router[] = [
  // Korea Region (apne2)
  { id: 'rtr-prod-apne2-edge-001', name: 'prod-apne2-rtr-edge-001', status: 'active', externalNetworkId: 'extnet-apne2-pub-001' },
  { id: 'rtr-nprd-apne2-edge-001', name: 'nprd-apne2-rtr-edge-001', status: 'active', externalNetworkId: 'extnet-apne2-pub-001' },
  { id: 'rtr-mgmt-apne2-int-001', name: 'mgmt-apne2-rtr-int-001', status: 'active', externalNetworkId: 'extnet-dc-priv-001' },
  // US Region (usw2)
  { id: 'rtr-prod-usw2-edge-001', name: 'prod-usw2-rtr-edge-001', status: 'active', externalNetworkId: 'extnet-usw2-pub-001' },
  { id: 'rtr-dr-usw2-edge-001', name: 'dr-usw2-rtr-edge-001', status: 'inactive', externalNetworkId: 'extnet-usw2-pub-001' },
  // Shared Infrastructure
  { id: 'rtr-shrd-dc-int-001', name: 'shrd-dc-rtr-int-001', status: 'active', externalNetworkId: 'extnet-dc-priv-001' },
];

// VPCs/Networks - 네트워크 (환경별, 목적별)
const networks: Network[] = [
  // Production - Korea (apne2)
  { id: 'vpc-prod-apne2-web-001', name: 'prod-apne2-vpc-web-001', status: 'active' },
  { id: 'vpc-prod-apne2-app-001', name: 'prod-apne2-vpc-app-001', status: 'active' },
  { id: 'vpc-prod-apne2-data-001', name: 'prod-apne2-vpc-data-001', status: 'active' },
  // Production - US (usw2)
  { id: 'vpc-prod-usw2-web-001', name: 'prod-usw2-vpc-web-001', status: 'active' },
  { id: 'vpc-prod-usw2-app-001', name: 'prod-usw2-vpc-app-001', status: 'active' },
  // Non-Production
  { id: 'vpc-stg-apne2-001', name: 'stg-apne2-vpc-001', status: 'active' },
  { id: 'vpc-dev-apne2-001', name: 'dev-apne2-vpc-001', status: 'active' },
  { id: 'vpc-qa-apne2-001', name: 'qa-apne2-vpc-001', status: 'active' },
  // Infrastructure
  { id: 'vpc-shrd-dc-001', name: 'shrd-dc-vpc-001', status: 'active' },
  { id: 'vpc-mgmt-apne2-001', name: 'mgmt-apne2-vpc-001', status: 'active' },
  { id: 'vpc-dmz-apne2-001', name: 'dmz-apne2-vpc-001', status: 'active' },
];

// Subnets - 서브넷 (AZ별, 티어별)
// 네이밍: [env]-[region]-snet-[purpose]-[az]
const subnets: Subnet[] = [
  // ============================================
  // Production Korea - Web Tier (prod-apne2-vpc-web-001)
  // ============================================
  { id: 'snet-prod-apne2-web-pub-2a', name: 'prod-apne2-snet-web-pub-2a', cidr: '10.10.1.0/24', status: 'active', networkId: 'vpc-prod-apne2-web-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-web-pub-2b', name: 'prod-apne2-snet-web-pub-2b', cidr: '10.10.2.0/24', status: 'active', networkId: 'vpc-prod-apne2-web-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-web-pub-2c', name: 'prod-apne2-snet-web-pub-2c', cidr: '10.10.3.0/24', status: 'active', networkId: 'vpc-prod-apne2-web-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-web-priv-2a', name: 'prod-apne2-snet-web-priv-2a', cidr: '10.10.11.0/24', status: 'active', networkId: 'vpc-prod-apne2-web-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-web-priv-2b', name: 'prod-apne2-snet-web-priv-2b', cidr: '10.10.12.0/24', status: 'active', networkId: 'vpc-prod-apne2-web-001', routerId: 'rtr-prod-apne2-edge-001' },
  
  // ============================================
  // Production Korea - App Tier (prod-apne2-vpc-app-001)
  // ============================================
  { id: 'snet-prod-apne2-apigw-2a', name: 'prod-apne2-snet-apigw-2a', cidr: '10.20.1.0/24', status: 'active', networkId: 'vpc-prod-apne2-app-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-apigw-2b', name: 'prod-apne2-snet-apigw-2b', cidr: '10.20.2.0/24', status: 'active', networkId: 'vpc-prod-apne2-app-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-user-001', name: 'prod-apne2-snet-user-001', cidr: '10.20.10.0/24', status: 'active', networkId: 'vpc-prod-apne2-app-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-order-001', name: 'prod-apne2-snet-order-001', cidr: '10.20.11.0/24', status: 'active', networkId: 'vpc-prod-apne2-app-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-product-001', name: 'prod-apne2-snet-product-001', cidr: '10.20.12.0/24', status: 'active', networkId: 'vpc-prod-apne2-app-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-payment-001', name: 'prod-apne2-snet-payment-001', cidr: '10.20.13.0/24', status: 'active', networkId: 'vpc-prod-apne2-app-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-notify-001', name: 'prod-apne2-snet-notify-001', cidr: '10.20.14.0/24', status: 'error', networkId: 'vpc-prod-apne2-app-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-search-001', name: 'prod-apne2-snet-search-001', cidr: '10.20.15.0/24', status: 'active', networkId: 'vpc-prod-apne2-app-001', routerId: 'rtr-prod-apne2-edge-001' },
  
  // ============================================
  // Production Korea - Data Tier (prod-apne2-vpc-data-001)
  // ============================================
  { id: 'snet-prod-apne2-db-pri-001', name: 'prod-apne2-snet-db-pri-001', cidr: '10.30.1.0/24', status: 'active', networkId: 'vpc-prod-apne2-data-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-db-rep-2a', name: 'prod-apne2-snet-db-rep-2a', cidr: '10.30.2.0/24', status: 'active', networkId: 'vpc-prod-apne2-data-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-db-rep-2b', name: 'prod-apne2-snet-db-rep-2b', cidr: '10.30.3.0/24', status: 'active', networkId: 'vpc-prod-apne2-data-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-redis-2a', name: 'prod-apne2-snet-redis-2a', cidr: '10.30.10.0/24', status: 'active', networkId: 'vpc-prod-apne2-data-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-redis-2b', name: 'prod-apne2-snet-redis-2b', cidr: '10.30.11.0/24', status: 'active', networkId: 'vpc-prod-apne2-data-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-kafka-001', name: 'prod-apne2-snet-kafka-001', cidr: '10.30.20.0/24', status: 'active', networkId: 'vpc-prod-apne2-data-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-es-001', name: 'prod-apne2-snet-es-001', cidr: '10.30.30.0/24', status: 'active', networkId: 'vpc-prod-apne2-data-001', routerId: 'rtr-prod-apne2-edge-001' },
  
  // ============================================
  // Production US - Web & App (prod-usw2-vpc-*)
  // ============================================
  { id: 'snet-prod-usw2-web-pub-2a', name: 'prod-usw2-snet-web-pub-2a', cidr: '10.110.1.0/24', status: 'active', networkId: 'vpc-prod-usw2-web-001', routerId: 'rtr-prod-usw2-edge-001' },
  { id: 'snet-prod-usw2-web-pub-2b', name: 'prod-usw2-snet-web-pub-2b', cidr: '10.110.2.0/24', status: 'active', networkId: 'vpc-prod-usw2-web-001', routerId: 'rtr-prod-usw2-edge-001' },
  { id: 'snet-prod-usw2-web-priv-001', name: 'prod-usw2-snet-web-priv-001', cidr: '10.110.10.0/24', status: 'active', networkId: 'vpc-prod-usw2-web-001', routerId: 'rtr-prod-usw2-edge-001' },
  { id: 'snet-prod-usw2-apigw-001', name: 'prod-usw2-snet-apigw-001', cidr: '10.120.1.0/24', status: 'active', networkId: 'vpc-prod-usw2-app-001', routerId: 'rtr-prod-usw2-edge-001' },
  { id: 'snet-prod-usw2-app-001', name: 'prod-usw2-snet-app-001', cidr: '10.120.10.0/24', status: 'active', networkId: 'vpc-prod-usw2-app-001', routerId: 'rtr-prod-usw2-edge-001' },
  { id: 'snet-dr-usw2-app-001', name: 'dr-usw2-snet-app-001', cidr: '10.120.100.0/24', status: 'inactive', networkId: 'vpc-prod-usw2-app-001', routerId: 'rtr-dr-usw2-edge-001' },
  
  // ============================================
  // Staging (stg-apne2-vpc-001)
  // ============================================
  { id: 'snet-stg-apne2-web-001', name: 'stg-apne2-snet-web-001', cidr: '10.200.1.0/24', status: 'active', networkId: 'vpc-stg-apne2-001', routerId: 'rtr-nprd-apne2-edge-001' },
  { id: 'snet-stg-apne2-app-001', name: 'stg-apne2-snet-app-001', cidr: '10.200.10.0/24', status: 'active', networkId: 'vpc-stg-apne2-001', routerId: 'rtr-nprd-apne2-edge-001' },
  { id: 'snet-stg-apne2-data-001', name: 'stg-apne2-snet-data-001', cidr: '10.200.20.0/24', status: 'active', networkId: 'vpc-stg-apne2-001', routerId: 'rtr-nprd-apne2-edge-001' },
  { id: 'snet-stg-apne2-test-001', name: 'stg-apne2-snet-test-001', cidr: '10.200.100.0/24', status: 'active', networkId: 'vpc-stg-apne2-001', routerId: 'rtr-nprd-apne2-edge-001' },
  
  // ============================================
  // Development (dev-apne2-vpc-001)
  // ============================================
  { id: 'snet-dev-apne2-web-001', name: 'dev-apne2-snet-web-001', cidr: '10.201.1.0/24', status: 'active', networkId: 'vpc-dev-apne2-001', routerId: 'rtr-nprd-apne2-edge-001' },
  { id: 'snet-dev-apne2-app-001', name: 'dev-apne2-snet-app-001', cidr: '10.201.10.0/24', status: 'active', networkId: 'vpc-dev-apne2-001', routerId: 'rtr-nprd-apne2-edge-001' },
  { id: 'snet-dev-apne2-data-001', name: 'dev-apne2-snet-data-001', cidr: '10.201.20.0/24', status: 'active', networkId: 'vpc-dev-apne2-001', routerId: 'rtr-nprd-apne2-edge-001' },
  { id: 'snet-dev-apne2-sandbox-001', name: 'dev-apne2-snet-sandbox-001', cidr: '10.201.100.0/24', status: 'active', networkId: 'vpc-dev-apne2-001' },
  
  // ============================================
  // QA (qa-apne2-vpc-001)
  // ============================================
  { id: 'snet-qa-apne2-auto-001', name: 'qa-apne2-snet-auto-001', cidr: '10.202.1.0/24', status: 'active', networkId: 'vpc-qa-apne2-001', routerId: 'rtr-nprd-apne2-edge-001' },
  { id: 'snet-qa-apne2-perf-001', name: 'qa-apne2-snet-perf-001', cidr: '10.202.10.0/24', status: 'active', networkId: 'vpc-qa-apne2-001', routerId: 'rtr-nprd-apne2-edge-001' },
  { id: 'snet-qa-apne2-sec-001', name: 'qa-apne2-snet-sec-001', cidr: '10.202.20.0/24', status: 'error', networkId: 'vpc-qa-apne2-001', routerId: 'rtr-nprd-apne2-edge-001' },
  
  // ============================================
  // Shared Services (shrd-dc-vpc-001)
  // ============================================
  { id: 'snet-shrd-dc-dns-001', name: 'shrd-dc-snet-dns-001', cidr: '10.250.1.0/24', status: 'active', networkId: 'vpc-shrd-dc-001', routerId: 'rtr-shrd-dc-int-001' },
  { id: 'snet-shrd-dc-ldap-001', name: 'shrd-dc-snet-ldap-001', cidr: '10.250.2.0/24', status: 'active', networkId: 'vpc-shrd-dc-001', routerId: 'rtr-shrd-dc-int-001' },
  { id: 'snet-shrd-dc-ntp-001', name: 'shrd-dc-snet-ntp-001', cidr: '10.250.3.0/24', status: 'active', networkId: 'vpc-shrd-dc-001', routerId: 'rtr-shrd-dc-int-001' },
  { id: 'snet-shrd-dc-harbor-001', name: 'shrd-dc-snet-harbor-001', cidr: '10.250.10.0/24', status: 'active', networkId: 'vpc-shrd-dc-001', routerId: 'rtr-shrd-dc-int-001' },
  { id: 'snet-shrd-dc-nexus-001', name: 'shrd-dc-snet-nexus-001', cidr: '10.250.11.0/24', status: 'active', networkId: 'vpc-shrd-dc-001', routerId: 'rtr-shrd-dc-int-001' },
  
  // ============================================
  // Management (mgmt-apne2-vpc-001)
  // ============================================
  { id: 'snet-mgmt-apne2-bastion-001', name: 'mgmt-apne2-snet-bastion-001', cidr: '10.251.1.0/24', status: 'active', networkId: 'vpc-mgmt-apne2-001', routerId: 'rtr-mgmt-apne2-int-001' },
  { id: 'snet-mgmt-apne2-mon-001', name: 'mgmt-apne2-snet-mon-001', cidr: '10.251.10.0/24', status: 'active', networkId: 'vpc-mgmt-apne2-001', routerId: 'rtr-mgmt-apne2-int-001' },
  { id: 'snet-mgmt-apne2-log-001', name: 'mgmt-apne2-snet-log-001', cidr: '10.251.11.0/24', status: 'active', networkId: 'vpc-mgmt-apne2-001', routerId: 'rtr-mgmt-apne2-int-001' },
  { id: 'snet-mgmt-apne2-cicd-001', name: 'mgmt-apne2-snet-cicd-001', cidr: '10.251.20.0/24', status: 'active', networkId: 'vpc-mgmt-apne2-001', routerId: 'rtr-mgmt-apne2-int-001' },
  { id: 'snet-mgmt-apne2-backup-001', name: 'mgmt-apne2-snet-backup-001', cidr: '10.251.30.0/24', status: 'active', networkId: 'vpc-mgmt-apne2-001' },
  
  // ============================================
  // DMZ (dmz-apne2-vpc-001)
  // ============================================
  { id: 'snet-dmz-apne2-partner-001', name: 'dmz-apne2-snet-partner-001', cidr: '10.252.1.0/24', status: 'active', networkId: 'vpc-dmz-apne2-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-dmz-apne2-b2b-001', name: 'dmz-apne2-snet-b2b-001', cidr: '10.252.2.0/24', status: 'active', networkId: 'vpc-dmz-apne2-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-dmz-apne2-webhook-001', name: 'dmz-apne2-snet-webhook-001', cidr: '10.252.10.0/24', status: 'active', networkId: 'vpc-dmz-apne2-001', routerId: 'rtr-prod-apne2-edge-001' },
];

// Load Balancers - 네이밍: [env]-[region]-[type]-[purpose]-[seq]
// type: alb (Application LB), nlb (Network LB), ilb (Internal LB)
const loadBalancers: LoadBalancer[] = [
  // ============================================
  // Production Korea - Web Tier
  // ============================================
  { id: 'alb-prod-apne2-web-ext-001', name: 'prod-apne2-alb-web-ext-001', status: 'active', subnetId: 'snet-prod-apne2-web-pub-2a', vip: '10.10.1.100' },
  { id: 'alb-prod-apne2-web-ext-002', name: 'prod-apne2-alb-web-ext-002', status: 'active', subnetId: 'snet-prod-apne2-web-pub-2b', vip: '10.10.2.100' },
  { id: 'alb-prod-apne2-waf-001', name: 'prod-apne2-alb-waf-001', status: 'active', subnetId: 'snet-prod-apne2-web-pub-2c', vip: '10.10.3.100' },
  { id: 'ilb-prod-apne2-web-int-001', name: 'prod-apne2-ilb-web-int-001', status: 'active', subnetId: 'snet-prod-apne2-web-priv-2a', vip: '10.10.11.100' },
  
  // ============================================
  // Production Korea - App Tier
  // ============================================
  { id: 'alb-prod-apne2-apigw-001', name: 'prod-apne2-alb-apigw-001', status: 'active', subnetId: 'snet-prod-apne2-apigw-2a', vip: '10.20.1.100' },
  { id: 'alb-prod-apne2-apigw-002', name: 'prod-apne2-alb-apigw-002', status: 'active', subnetId: 'snet-prod-apne2-apigw-2b', vip: '10.20.2.100' },
  { id: 'nlb-prod-apne2-user-001', name: 'prod-apne2-nlb-user-001', status: 'active', subnetId: 'snet-prod-apne2-user-001', vip: '10.20.10.100' },
  { id: 'nlb-prod-apne2-order-001', name: 'prod-apne2-nlb-order-001', status: 'active', subnetId: 'snet-prod-apne2-order-001', vip: '10.20.11.100' },
  { id: 'ilb-prod-apne2-order-int-001', name: 'prod-apne2-ilb-order-int-001', status: 'active', subnetId: 'snet-prod-apne2-order-001', vip: '10.20.11.101' },
  { id: 'nlb-prod-apne2-product-001', name: 'prod-apne2-nlb-product-001', status: 'active', subnetId: 'snet-prod-apne2-product-001', vip: '10.20.12.100' },
  { id: 'nlb-prod-apne2-payment-001', name: 'prod-apne2-nlb-payment-001', status: 'active', subnetId: 'snet-prod-apne2-payment-001', vip: '10.20.13.100' },
  { id: 'ilb-prod-apne2-payment-int-001', name: 'prod-apne2-ilb-payment-int-001', status: 'active', subnetId: 'snet-prod-apne2-payment-001', vip: '10.20.13.101' },
  { id: 'nlb-prod-apne2-notify-001', name: 'prod-apne2-nlb-notify-001', status: 'error', subnetId: 'snet-prod-apne2-notify-001', vip: '10.20.14.100' },
  { id: 'nlb-prod-apne2-search-001', name: 'prod-apne2-nlb-search-001', status: 'active', subnetId: 'snet-prod-apne2-search-001', vip: '10.20.15.100' },
  
  // ============================================
  // Production Korea - Data Tier
  // ============================================
  { id: 'nlb-prod-apne2-db-pri-001', name: 'prod-apne2-nlb-db-pri-001', status: 'active', subnetId: 'snet-prod-apne2-db-pri-001', vip: '10.30.1.100' },
  { id: 'nlb-prod-apne2-db-ro-001', name: 'prod-apne2-nlb-db-ro-001', status: 'active', subnetId: 'snet-prod-apne2-db-rep-2a', vip: '10.30.2.100' },
  { id: 'nlb-prod-apne2-redis-001', name: 'prod-apne2-nlb-redis-001', status: 'active', subnetId: 'snet-prod-apne2-redis-2a', vip: '10.30.10.100' },
  { id: 'nlb-prod-apne2-kafka-001', name: 'prod-apne2-nlb-kafka-001', status: 'active', subnetId: 'snet-prod-apne2-kafka-001', vip: '10.30.20.100' },
  { id: 'nlb-prod-apne2-es-001', name: 'prod-apne2-nlb-es-001', status: 'active', subnetId: 'snet-prod-apne2-es-001', vip: '10.30.30.100' },
  
  // ============================================
  // Production US
  // ============================================
  { id: 'alb-prod-usw2-web-ext-001', name: 'prod-usw2-alb-web-ext-001', status: 'active', subnetId: 'snet-prod-usw2-web-pub-2a', vip: '10.110.1.100' },
  { id: 'alb-prod-usw2-web-ext-002', name: 'prod-usw2-alb-web-ext-002', status: 'active', subnetId: 'snet-prod-usw2-web-pub-2b', vip: '10.110.2.100' },
  { id: 'alb-prod-usw2-apigw-001', name: 'prod-usw2-alb-apigw-001', status: 'active', subnetId: 'snet-prod-usw2-apigw-001', vip: '10.120.1.100' },
  { id: 'nlb-prod-usw2-app-001', name: 'prod-usw2-nlb-app-001', status: 'active', subnetId: 'snet-prod-usw2-app-001', vip: '10.120.10.100' },
  
  // ============================================
  // Staging
  // ============================================
  { id: 'alb-stg-apne2-web-001', name: 'stg-apne2-alb-web-001', status: 'active', subnetId: 'snet-stg-apne2-web-001', vip: '10.200.1.100' },
  { id: 'nlb-stg-apne2-app-001', name: 'stg-apne2-nlb-app-001', status: 'active', subnetId: 'snet-stg-apne2-app-001', vip: '10.200.10.100' },
  { id: 'nlb-stg-apne2-data-001', name: 'stg-apne2-nlb-data-001', status: 'active', subnetId: 'snet-stg-apne2-data-001', vip: '10.200.20.100' },
  
  // ============================================
  // Development
  // ============================================
  { id: 'alb-dev-apne2-all-001', name: 'dev-apne2-alb-all-001', status: 'active', subnetId: 'snet-dev-apne2-web-001', vip: '10.201.1.100' },
  { id: 'nlb-dev-apne2-api-001', name: 'dev-apne2-nlb-api-001', status: 'active', subnetId: 'snet-dev-apne2-app-001', vip: '10.201.10.100' },
  
  // ============================================
  // QA
  // ============================================
  { id: 'alb-qa-apne2-test-001', name: 'qa-apne2-alb-test-001', status: 'active', subnetId: 'snet-qa-apne2-auto-001', vip: '10.202.1.100' },
  { id: 'nlb-qa-apne2-perf-001', name: 'qa-apne2-nlb-perf-001', status: 'active', subnetId: 'snet-qa-apne2-perf-001', vip: '10.202.10.100' },
  
  // ============================================
  // Shared Services
  // ============================================
  { id: 'nlb-shrd-dc-dns-001', name: 'shrd-dc-nlb-dns-001', status: 'active', subnetId: 'snet-shrd-dc-dns-001', vip: '10.250.1.100' },
  { id: 'nlb-shrd-dc-ldap-001', name: 'shrd-dc-nlb-ldap-001', status: 'active', subnetId: 'snet-shrd-dc-ldap-001', vip: '10.250.2.100' },
  { id: 'alb-shrd-dc-harbor-001', name: 'shrd-dc-alb-harbor-001', status: 'active', subnetId: 'snet-shrd-dc-harbor-001', vip: '10.250.10.100' },
  { id: 'alb-shrd-dc-nexus-001', name: 'shrd-dc-alb-nexus-001', status: 'active', subnetId: 'snet-shrd-dc-nexus-001', vip: '10.250.11.100' },
  
  // ============================================
  // Management
  // ============================================
  { id: 'alb-mgmt-apne2-prom-001', name: 'mgmt-apne2-alb-prom-001', status: 'active', subnetId: 'snet-mgmt-apne2-mon-001', vip: '10.251.10.100' },
  { id: 'alb-mgmt-apne2-grafana-001', name: 'mgmt-apne2-alb-grafana-001', status: 'active', subnetId: 'snet-mgmt-apne2-mon-001', vip: '10.251.10.101' },
  { id: 'alb-mgmt-apne2-elk-001', name: 'mgmt-apne2-alb-elk-001', status: 'active', subnetId: 'snet-mgmt-apne2-log-001', vip: '10.251.11.100' },
  { id: 'alb-mgmt-apne2-jenkins-001', name: 'mgmt-apne2-alb-jenkins-001', status: 'active', subnetId: 'snet-mgmt-apne2-cicd-001', vip: '10.251.20.100' },
  { id: 'alb-mgmt-apne2-argocd-001', name: 'mgmt-apne2-alb-argocd-001', status: 'active', subnetId: 'snet-mgmt-apne2-cicd-001', vip: '10.251.20.101' },
  
  // ============================================
  // DMZ
  // ============================================
  { id: 'alb-dmz-apne2-partner-001', name: 'dmz-apne2-alb-partner-001', status: 'active', subnetId: 'snet-dmz-apne2-partner-001', vip: '10.252.1.100' },
  { id: 'alb-dmz-apne2-b2b-001', name: 'dmz-apne2-alb-b2b-001', status: 'active', subnetId: 'snet-dmz-apne2-b2b-001', vip: '10.252.2.100' },
  { id: 'nlb-dmz-apne2-webhook-001', name: 'dmz-apne2-nlb-webhook-001', status: 'active', subnetId: 'snet-dmz-apne2-webhook-001', vip: '10.252.10.100' },
];

/* ----------------------------------------
   Helper Components
   ---------------------------------------- */
function StatusBadge({ count, status }: { count: number; status: 'active' | 'inactive' | 'error' }) {
  if (count === 0) return null;
  const colors = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-slate-100 text-slate-600',
    error: 'bg-red-100 text-red-700',
  };
  const icons = { active: '●', inactive: '○', error: '✕' };
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${colors[status]}`}>
      {icons[status]} {count}
    </span>
  );
}

/* ----------------------------------------
   VPC Card Component
   ---------------------------------------- */
interface VpcCardProps {
  vpc: Network;
  vpcSubnets: Subnet[];
  vpcLoadBalancers: LoadBalancer[];
  expanded: boolean;
  onToggle: () => void;
  highlightedRouter: string | null;
  onSubnetHover: (subnet: Subnet | null) => void;
  onSubnetClick: (subnet: Subnet) => void;
}

function VpcCard({ vpc, vpcSubnets, vpcLoadBalancers, expanded, onToggle, highlightedRouter, onSubnetHover, onSubnetClick }: VpcCardProps) {
  const statusCounts = useMemo(() => {
    return {
      active: vpcSubnets.filter(s => s.status === 'active').length,
      inactive: vpcSubnets.filter(s => s.status === 'inactive').length,
      error: vpcSubnets.filter(s => s.status === 'error').length,
    };
  }, [vpcSubnets]);

  const connectedRouters = useMemo(() => {
    const routerIds = new Set(vpcSubnets.filter(s => s.routerId).map(s => s.routerId!));
    return routers.filter(r => routerIds.has(r.id));
  }, [vpcSubnets]);

  const unroutedCount = vpcSubnets.filter(s => !s.routerId).length;

  // Group LBs by subnet
  const lbsBySubnet = useMemo(() => {
    const map: Record<string, LoadBalancer[]> = {};
    vpcLoadBalancers.forEach(lb => {
      if (!map[lb.subnetId]) map[lb.subnetId] = [];
      map[lb.subnetId].push(lb);
    });
    return map;
  }, [vpcLoadBalancers]);

  const borderColor = vpc.status === 'error' ? COLORS.vpcBorder.error 
    : vpc.status === 'inactive' ? COLORS.vpcBorder.inactive 
    : COLORS.vpcBorder.active;

  return (
    <div 
      className="border rounded-xl overflow-hidden transition-all duration-200"
      style={{ borderColor }}
    >
      {/* Header - Always visible */}
      <div 
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={onToggle}
        style={{ backgroundColor: expanded ? COLORS.vpcPanel.active : 'white' }}
      >
        <div className="flex items-center gap-3">
          {expanded ? (
            <IconChevronDown size={18} className="text-slate-500" />
          ) : (
            <IconChevronRight size={18} className="text-slate-500" />
          )}
          <div>
            <div className="font-semibold text-slate-800">{vpc.name}</div>
            <div className="text-xs text-slate-500">
              {vpcSubnets.length} subnets • {connectedRouters.length} routers
              {vpcLoadBalancers.length > 0 && ` • ${vpcLoadBalancers.length} LBs`}
              {unroutedCount > 0 && ` • ${unroutedCount} unrouted`}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <StatusBadge count={statusCounts.active} status="active" />
          <StatusBadge count={statusCounts.inactive} status="inactive" />
          <StatusBadge count={statusCounts.error} status="error" />
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 bg-gradient-to-b from-teal-50/50 to-white">
          {/* Connected routers */}
          {connectedRouters.length > 0 && (
            <div className="mb-3 pt-2">
              <div className="text-xs text-slate-500 mb-2">Connected Routers:</div>
              <div className="flex flex-wrap gap-2">
                {connectedRouters.map(router => (
                  <span 
                    key={router.id}
                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                      highlightedRouter === router.id 
                        ? 'bg-indigo-500 text-white' 
                        : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: COLORS.status[router.status] }}
                    />
                    {router.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Subnets grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            {vpcSubnets.map(subnet => {
              const isHighlighted = !highlightedRouter || subnet.routerId === highlightedRouter;
              const router = routers.find(r => r.id === subnet.routerId);
              const subnetLbs = lbsBySubnet[subnet.id] || [];
              
              return (
                <div
                  key={subnet.id}
                  className={`relative p-2 rounded-lg border cursor-pointer transition-all duration-150 ${
                    isHighlighted 
                      ? 'bg-white border-teal-300 shadow-sm' 
                      : 'bg-slate-50 border-slate-200 opacity-40'
                  }`}
                  onMouseEnter={() => onSubnetHover(subnet)}
                  onMouseLeave={() => onSubnetHover(null)}
                  onClick={() => onSubnetClick(subnet)}
                >
                  {/* Status indicator */}
                  <div 
                    className="absolute top-2 right-2 w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS.status[subnet.status] }}
                  />
                  
                  {/* Subnet info */}
                  <div className="text-xs font-medium text-slate-700 truncate pr-4">
                    {subnet.name}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                    {subnet.cidr}
                  </div>
                  
                  {/* Router badge */}
                  {router ? (
                    <div className="mt-1.5 text-[10px] text-indigo-600 truncate">
                      → {router.name}
                    </div>
                  ) : (
                    <div className="mt-1.5 text-[10px] text-amber-600">
                      ⚠ Unrouted
                    </div>
                  )}
                  
                  {/* Load Balancers */}
                  {subnetLbs.length > 0 && (
                    <div className="mt-1.5 pt-1.5 border-t border-slate-100">
                      <div className="flex items-center gap-1 flex-wrap">
                        {subnetLbs.map(lb => (
                          <span 
                            key={lb.id}
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium"
                            style={{ 
                              backgroundColor: COLORS.loadBalancer[lb.status] + '20',
                              color: lb.status === 'error' ? '#dc2626' : '#a16207'
                            }}
                            title={`${lb.name} (${lb.vip})`}
                          >
                            <span 
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: COLORS.status[lb.status] }}
                            />
                            {lb.name.length > 10 ? lb.name.substring(0, 10) + '...' : lb.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------
   Router Section Component
   ---------------------------------------- */
interface RouterSectionProps {
  highlightedRouter: string | null;
  onRouterHover: (routerId: string | null) => void;
}

function RouterSection({ highlightedRouter, onRouterHover }: RouterSectionProps) {
  // Group routers by external network
  const routersByExtNet = useMemo(() => {
    const map: Record<string, Router[]> = {};
    routers.forEach(router => {
      const extNetId = router.externalNetworkId || 'none';
      if (!map[extNetId]) map[extNetId] = [];
      map[extNetId].push(router);
    });
    return map;
  }, []);

  return (
    <div className="py-4 px-6 bg-slate-50 rounded-xl border border-slate-200">
      <div className="text-xs text-slate-500 mb-3 font-medium">Network Topology Overview</div>
      
      <div className="flex flex-wrap gap-6 justify-center">
        {externalNetworks.map(extNet => {
          const connectedRouters = routersByExtNet[extNet.id] || [];
          
          return (
            <div key={extNet.id} className="flex items-center gap-3">
              {/* External Network */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-11 h-11 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: COLORS.externalNetwork[extNet.status] }}
                  title={extNet.description}
                >
                  <svg width="22" height="22" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={ICONS.externalNetwork} />
                  </svg>
                </div>
                <span className="text-[10px] text-slate-600 mt-1 max-w-[70px] truncate text-center" title={extNet.name}>
                  {extNet.name.replace('-internet', '').replace('-datacenter', '')}
                </span>
              </div>

              {/* Arrow */}
              {connectedRouters.length > 0 && (
                <div className="text-slate-300 text-lg">→</div>
              )}

              {/* Connected Routers */}
              <div className="flex items-center gap-2">
                {connectedRouters.map(router => {
                  const isHighlighted = !highlightedRouter || highlightedRouter === router.id;
                  const connectedSubnets = subnets.filter(s => s.routerId === router.id);
                  
                  return (
                    <div
                      key={router.id}
                      className={`flex flex-col items-center cursor-pointer transition-all duration-150 ${
                        isHighlighted ? 'opacity-100' : 'opacity-30'
                      }`}
                      onMouseEnter={() => onRouterHover(router.id)}
                      onMouseLeave={() => onRouterHover(null)}
                    >
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center relative transition-transform ${
                          highlightedRouter === router.id ? 'scale-110 ring-2 ring-indigo-300' : ''
                        }`}
                        style={{ backgroundColor: COLORS.router[router.status] }}
                      >
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d={ICONS.router} />
                        </svg>
                        <div 
                          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                          style={{ backgroundColor: COLORS.status[router.status] }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-600 mt-1 max-w-[70px] truncate text-center">
                        {router.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {connectedSubnets.length} subnets
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main Component
   ---------------------------------------- */
export function TopologyScalePage() {
  const [expandedVpcs, setExpandedVpcs] = useState<Set<string>>(new Set());
  const [highlightedRouter, setHighlightedRouter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRouter, setFilterRouter] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedSubnet, setSelectedSubnet] = useState<Subnet | null>(null);

  // Group subnets by VPC
  const subnetsByVpc = useMemo(() => {
    const map: Record<string, Subnet[]> = {};
    subnets.forEach(subnet => {
      if (!map[subnet.networkId]) map[subnet.networkId] = [];
      map[subnet.networkId].push(subnet);
    });
    return map;
  }, []);

  // Group LBs by VPC (via subnet)
  const lbsByVpc = useMemo(() => {
    const map: Record<string, LoadBalancer[]> = {};
    loadBalancers.forEach(lb => {
      const subnet = subnets.find(s => s.id === lb.subnetId);
      if (subnet) {
        if (!map[subnet.networkId]) map[subnet.networkId] = [];
        map[subnet.networkId].push(lb);
      }
    });
    return map;
  }, []);

  // Filter networks
  const filteredNetworks = useMemo(() => {
    return networks.filter(vpc => {
      const vpcSubnets = subnetsByVpc[vpc.id] || [];
      
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesVpc = vpc.name.toLowerCase().includes(term);
        const matchesSubnet = vpcSubnets.some(s => 
          s.name.toLowerCase().includes(term) || s.cidr.includes(term)
        );
        if (!matchesVpc && !matchesSubnet) return false;
      }
      
      // Router filter
      if (filterRouter !== 'all') {
        const hasRouter = vpcSubnets.some(s => s.routerId === filterRouter);
        if (!hasRouter) return false;
      }
      
      // Status filter
      if (filterStatus !== 'all') {
        const hasStatus = vpcSubnets.some(s => s.status === filterStatus);
        if (!hasStatus) return false;
      }
      
      return true;
    });
  }, [searchTerm, filterRouter, filterStatus, subnetsByVpc]);

  const toggleVpc = useCallback((vpcId: string) => {
    setExpandedVpcs(prev => {
      const next = new Set(prev);
      if (next.has(vpcId)) {
        next.delete(vpcId);
      } else {
        next.add(vpcId);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedVpcs(new Set(networks.map(n => n.id)));
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedVpcs(new Set());
  }, []);

  // Stats
  const totalSubnets = subnets.length;
  const activeSubnets = subnets.filter(s => s.status === 'active').length;
  const errorSubnets = subnets.filter(s => s.status === 'error').length;

  return (
    <div className="flex h-screen bg-[var(--color-surface-default)]">
      <Sidebar />

      <VStack className="flex-1 overflow-hidden ml-[200px]">
        <TabBar
          tabs={[
            { id: 'topology-scale', label: 'Scalable View', active: true },
          ]}
        />
        <BreadcrumbNavigation 
          items={[
            { label: 'Proj-1', href: '/' },
            { label: 'Network Topology (Scalable)', href: '/topology-scale' },
          ]}
        />

        <VStack className="flex-1 overflow-auto p-4 gap-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[length:var(--font-size-24)] font-semibold text-[var(--color-text-default)]">
                Network Topology
              </h1>
              <p className="text-sm text-[var(--color-text-subtle)] mt-1">
                {totalSubnets} subnets across {networks.length} VPCs • 
                <span className="text-green-600 ml-1">{activeSubnets} active</span>
                {errorSubnets > 0 && <span className="text-red-600 ml-1">• {errorSubnets} error</span>}
              </p>
            </div>
          </div>

          {/* Router Section */}
          <RouterSection 
            highlightedRouter={highlightedRouter}
            onRouterHover={setHighlightedRouter}
          />

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-[300px]">
              <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search VPCs or subnets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Router filter */}
            <select
              value={filterRouter}
              onChange={(e) => setFilterRouter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Routers</option>
              {routers.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
              <option value="none">Unrouted Only</option>
            </select>

            {/* Status filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="error">Error</option>
            </select>

            {/* Expand/Collapse */}
            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={expandAll}
                className="px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* VPC Cards */}
          <div className="space-y-3">
            {filteredNetworks.map(vpc => (
              <VpcCard
                key={vpc.id}
                vpc={vpc}
                vpcSubnets={subnetsByVpc[vpc.id] || []}
                vpcLoadBalancers={lbsByVpc[vpc.id] || []}
                expanded={expandedVpcs.has(vpc.id)}
                onToggle={() => toggleVpc(vpc.id)}
                highlightedRouter={highlightedRouter}
                onSubnetHover={() => {}}
                onSubnetClick={setSelectedSubnet}
              />
            ))}
          </div>

          {/* Empty state */}
          {filteredNetworks.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <IconFilter size={48} className="mx-auto mb-3 opacity-30" />
              <p>No VPCs match your filters</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterRouter('all');
                  setFilterStatus('all');
                }}
                className="mt-2 text-teal-600 hover:underline text-sm"
              >
                Clear filters
              </button>
            </div>
          )}
        </VStack>
      </VStack>

      {/* Subnet Detail Sidebar */}
      {selectedSubnet && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-slate-200 shadow-xl z-50 overflow-auto">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">{selectedSubnet.name}</h3>
            <button 
              onClick={() => setSelectedSubnet(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              <IconX size={20} />
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Status */}
            <div className="flex items-center gap-2">
              <span 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: COLORS.status[selectedSubnet.status] }}
              />
              <span className="text-sm font-medium capitalize">{selectedSubnet.status}</span>
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">CIDR</span>
                <span className="font-mono">{selectedSubnet.cidr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ID</span>
                <span className="font-mono text-xs">{selectedSubnet.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">VPC</span>
                <span>{networks.find(n => n.id === selectedSubnet.networkId)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Router</span>
                <span>
                  {selectedSubnet.routerId 
                    ? routers.find(r => r.id === selectedSubnet.routerId)?.name 
                    : <span className="text-amber-600">Unrouted</span>
                  }
                </span>
              </div>
            </div>

            {/* Load Balancers */}
            {(() => {
              const subnetLbs = loadBalancers.filter(lb => lb.subnetId === selectedSubnet.id);
              if (subnetLbs.length === 0) return null;
              
              return (
                <div className="pt-3 border-t border-slate-100">
                  <div className="text-slate-500 text-sm mb-2">Load Balancers ({subnetLbs.length})</div>
                  <div className="space-y-2">
                    {subnetLbs.map(lb => (
                      <div key={lb.id} className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded">
                        <span>{lb.name}</span>
                        <span className="font-mono text-xs text-slate-500">{lb.vip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

