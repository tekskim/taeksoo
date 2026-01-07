import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';

import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { VStack, Select, SearchInput, Button, TabBar, TopBar, TopBarAction, Breadcrumb } from '@/design-system';
import { IconX, IconCopy, IconExternalLink, IconRefresh, IconSearch, IconBell } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Theme Configuration
   ---------------------------------------- */
const COLORS = {
  externalNetwork: { active: '#3b82f6', inactive: '#93c5fd', error: '#ef4444' },  // Blue
  router: { active: '#6366f1', inactive: '#a5b4fc', error: '#ef4444' },           // Indigo
  subnet: { active: '#14b8a6', inactive: '#5eead4', error: '#ef4444' },           // Teal
  loadBalancer: { active: '#eab308', inactive: '#fde047', error: '#ef4444' },     // Yellow
  status: { active: '#22c55e', inactive: '#94a3b8', error: '#ef4444' },
  vpcPanel: { active: '#f0fdfa', inactive: '#f1f5f9', error: '#fee2e2', split: '#eef2ff' },  // Teal-50 / Indigo-50
  vpcBorder: { active: '#5eead4', inactive: '#cbd5e1', error: '#fca5a5', split: '#a5b4fc' }, // Teal-300 / Indigo-300
};

// Edge colors based on source node type
const EDGE_COLORS = {
  externalNetwork: { active: '#3b82f6', inactive: '#93c5fd', error: '#ef4444' },  // Blue
  router: { active: '#6366f1', inactive: '#a5b4fc', error: '#ef4444' },           // Indigo
  subnet: { active: '#14b8a6', inactive: '#5eead4', error: '#ef4444' },           // Teal
  loadBalancer: { active: '#eab308', inactive: '#fde047', error: '#ef4444' },     // Yellow
};

type NodeType = 'externalNetwork' | 'router' | 'subnet' | 'loadBalancer';

const NODE_SIZES: Record<NodeType, { node: number; icon: number }> = {
  externalNetwork: { node: 64, icon: 32 },
  router: { node: 56, icon: 28 },
  subnet: { node: 48, icon: 24 },
  loadBalancer: { node: 40, icon: 20 },
};

const INDICATOR_SIZE = 12;

// SVG Icon paths (from Tabler Icons)
// Custom SVG icons (16x16 viewBox)
const ICONS = {
  // Network.svg - 외부 네트워크 (글로브 아이콘)
  externalNetwork: 'M4 6C4 7.06087 4.42143 8.07828 5.17157 8.82843C5.92172 9.57857 6.93913 10 8 10M4 6C4 4.93913 4.42143 3.92172 5.17157 3.17157C5.92172 2.42143 6.93913 2 8 2M4 6H12M8 10C9.06087 10 10.0783 9.57857 10.8284 8.82843C11.5786 8.07828 12 7.06087 12 6M8 10C8.88867 9.778 9.33333 8.44467 9.33333 6C9.33333 3.55533 8.88867 2.222 8 2M8 10C7.11133 9.778 6.66667 8.44467 6.66667 6C6.66667 3.55533 7.11133 2.222 8 2M8 10V12M12 6C12 4.93913 11.5786 3.92172 10.8284 3.17157C10.0783 2.42143 9.06087 2 8 2M2 13.3333H6.66667M6.66667 13.3333C6.66667 13.687 6.80714 14.0261 7.05719 14.2761C7.30724 14.5262 7.64638 14.6667 8 14.6667C8.35362 14.6667 8.69276 14.5262 8.94281 14.2761C9.19286 14.0261 9.33333 13.687 9.33333 13.3333M6.66667 13.3333C6.66667 12.9797 6.80714 12.6406 7.05719 12.3905C7.30724 12.1405 7.64638 12 8 12M9.33333 13.3333H14M9.33333 13.3333C9.33333 12.9797 9.19286 12.6406 8.94281 12.3905C8.69276 12.1405 8.35362 12 8 12',
  // Router.svg - 라우터 (화살표 방향 아이콘)
  router: 'M7.99907 15.152V10.4951M7.99907 15.152L5.73633 12.8892M7.99907 15.152L10.2618 12.8892M3.24372 10.2625L5.50646 7.9998M5.50646 7.9998L3.24372 5.73706M5.50646 7.9998H0.849609M12.7569 5.73706L10.4941 7.9998M10.4941 7.9998L12.7569 10.2625M10.4941 7.9998H15.151M10.2618 3.11089L7.99907 0.848145M7.99907 0.848145L5.73633 3.11089M7.99907 0.848145V5.505',
  // Subnet.svg - 서브넷 (점과 화살표 아이콘)
  subnet: 'M8 8H8.00667M10.666 8H10.6727M11.334 4.66675L14.6673 8.00008L11.334 11.3334M4.66732 4.66675L1.33398 8.00008L4.66732 11.3334M5.33398 8H5.34065',
  // loadBalancer.svg - 로드밸런서
  loadBalancer: 'M8.00033 10.6667C7.46989 10.6667 6.96118 10.456 6.58611 10.0809C6.21104 9.70581 6.00033 9.1971 6.00033 8.66667C6.00033 8.13623 6.21104 7.62753 6.58611 7.25245C6.96118 6.87738 7.46989 6.66667 8.00033 6.66667M8.00033 10.6667C8.53076 10.6667 9.03947 10.456 9.41454 10.0809C9.78961 9.70581 10.0003 9.1971 10.0003 8.66667C10.0003 8.13623 9.78961 7.62753 9.41454 7.25245C9.03947 6.87738 8.53076 6.66667 8.00033 6.66667M8.00033 10.6667V12.6667M8.00033 6.66667V2M8.00033 12.6667C8.17714 12.6667 8.34671 12.7369 8.47173 12.8619C8.59675 12.987 8.66699 13.1565 8.66699 13.3333C8.66699 13.5101 8.59675 13.6797 8.47173 13.8047C8.34671 13.9298 8.17714 14 8.00033 14C7.82351 14 7.65395 13.9298 7.52892 13.8047C7.4039 13.6797 7.33366 13.5101 7.33366 13.3333C7.33366 13.1565 7.4039 12.987 7.52892 12.8619C7.65395 12.7369 7.82351 12.6667 8.00033 12.6667ZM8.00033 2L6.00033 4M8.00033 2L10.0003 4M9.92969 8.15129L14.003 6.66862M14.003 6.66862L11.4396 5.47331M14.003 6.66862L12.8076 9.23197M6.06758 8.14262L2.01758 6.66862M2.01758 6.66862L4.58091 5.47331M2.01758 6.66862L3.21291 9.23197',
};

/* ----------------------------------------
   Data Types
   ---------------------------------------- */
interface ExternalNetwork {
  id: string;
  name: string;
  status?: 'active' | 'inactive' | 'error';
  description?: string;
}

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

interface NetworkGroup {
  extNet: ExternalNetwork;
  routers: Router[];
}

/* ----------------------------------------
   Enterprise Sample Data
   시나리오: 글로벌 이커머스 기업
   네이밍 컨벤션: [env]-[region]-[type]-[purpose]-[az/seq]
   
   Regions:
   - apne2: Asia Pacific Northeast 2 (Seoul)
   - usw2: US West 2 (Oregon)
   ---------------------------------------- */

// External Networks - 외부 네트워크 (ISP/Cloud Provider 연결)
const externalNetworks: ExternalNetwork[] = [
  { id: 'extnet-apne2-pub-001', name: 'extnet-apne2-public', status: 'active', description: 'Seoul Region Public Internet' },
  { id: 'extnet-usw2-pub-001', name: 'extnet-usw2-public', status: 'active', description: 'Oregon Region Public Internet' },
  { id: 'extnet-dc-priv-001', name: 'extnet-dc-private', status: 'active', description: 'Datacenter Direct Connect' },
];

// Routers - 라우터 (환경별, 용도별)
const routers: Router[] = [
  // Korea Region (apne2)
  { id: 'rtr-prod-apne2-edge-001', name: 'prod-apne2-edge', status: 'active', externalNetworkId: 'extnet-apne2-pub-001' },
  { id: 'rtr-nprd-apne2-edge-001', name: 'nprd-apne2-edge', status: 'active', externalNetworkId: 'extnet-apne2-pub-001' },
  { id: 'rtr-mgmt-apne2-int-001', name: 'mgmt-apne2-int', status: 'active', externalNetworkId: 'extnet-dc-priv-001' },
  // US Region (usw2)
  { id: 'rtr-prod-usw2-edge-001', name: 'prod-usw2-edge', status: 'active', externalNetworkId: 'extnet-usw2-pub-001' },
  { id: 'rtr-dr-usw2-edge-001', name: 'dr-usw2-edge', status: 'inactive', externalNetworkId: 'extnet-usw2-pub-001' },
  // Shared Infrastructure
  { id: 'rtr-shrd-dc-int-001', name: 'shrd-dc-int', status: 'active', externalNetworkId: 'extnet-dc-priv-001' },
];

// Network Groups - 외부 네트워크와 라우터 그룹핑
const networkGroups: NetworkGroup[] = [
  { 
    extNet: externalNetworks[0], // Seoul Public
    routers: routers.filter(r => r.externalNetworkId === 'extnet-apne2-pub-001')
  },
  { 
    extNet: externalNetworks[1], // Oregon Public
    routers: routers.filter(r => r.externalNetworkId === 'extnet-usw2-pub-001')
  },
  { 
    extNet: externalNetworks[2], // DC Private
    routers: routers.filter(r => r.externalNetworkId === 'extnet-dc-priv-001')
  },
];

const standaloneExternalNetworks: ExternalNetwork[] = [];

const standaloneRouters: Router[] = [];

// VPCs/Networks - 네트워크 (환경별, 목적별)
const networks: Network[] = [
  // Production - Korea (apne2)
  { id: 'vpc-prod-apne2-web-001', name: 'prod-apne2-web', status: 'active' },
  { id: 'vpc-prod-apne2-app-001', name: 'prod-apne2-app', status: 'active' },
  { id: 'vpc-prod-apne2-data-001', name: 'prod-apne2-data', status: 'active' },
  // Production - US (usw2)
  { id: 'vpc-prod-usw2-web-001', name: 'prod-usw2-web', status: 'active' },
  { id: 'vpc-prod-usw2-app-001', name: 'prod-usw2-app', status: 'active' },
  // Non-Production
  { id: 'vpc-stg-apne2-001', name: 'stg-apne2', status: 'active' },
  { id: 'vpc-dev-apne2-001', name: 'dev-apne2', status: 'active' },
  { id: 'vpc-qa-apne2-001', name: 'qa-apne2', status: 'active' },
  // Infrastructure
  { id: 'vpc-shrd-dc-001', name: 'shrd-dc', status: 'active' },
  { id: 'vpc-mgmt-apne2-001', name: 'mgmt-apne2', status: 'active' },
  { id: 'vpc-dmz-apne2-001', name: 'dmz-apne2', status: 'active' },
];

// Subnets - 서브넷 (AZ별, 티어별)
const subnets: Subnet[] = [
  // ============================================
  // Production Korea - Web Tier (prod-apne2-vpc-web-001)
  // ============================================
  { id: 'snet-prod-apne2-web-pub-2a', name: 'web-pub-2a', cidr: '10.10.1.0/24', status: 'active', networkId: 'vpc-prod-apne2-web-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-web-pub-2b', name: 'web-pub-2b', cidr: '10.10.2.0/24', status: 'active', networkId: 'vpc-prod-apne2-web-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-web-pub-2c', name: 'web-pub-2c', cidr: '10.10.3.0/24', status: 'active', networkId: 'vpc-prod-apne2-web-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-web-priv-2a', name: 'web-priv-2a', cidr: '10.10.11.0/24', status: 'active', networkId: 'vpc-prod-apne2-web-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-web-priv-2b', name: 'web-priv-2b', cidr: '10.10.12.0/24', status: 'active', networkId: 'vpc-prod-apne2-web-001', routerId: 'rtr-prod-apne2-edge-001' },
  
  // ============================================
  // Production Korea - App Tier (prod-apne2-vpc-app-001)
  // ============================================
  { id: 'snet-prod-apne2-apigw-2a', name: 'apigw-2a', cidr: '10.20.1.0/24', status: 'active', networkId: 'vpc-prod-apne2-app-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-apigw-2b', name: 'apigw-2b', cidr: '10.20.2.0/24', status: 'active', networkId: 'vpc-prod-apne2-app-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-user-001', name: 'user-svc', cidr: '10.20.10.0/24', status: 'active', networkId: 'vpc-prod-apne2-app-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-order-001', name: 'order-svc', cidr: '10.20.11.0/24', status: 'active', networkId: 'vpc-prod-apne2-app-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-product-001', name: 'product-svc', cidr: '10.20.12.0/24', status: 'active', networkId: 'vpc-prod-apne2-app-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-payment-001', name: 'payment-svc', cidr: '10.20.13.0/24', status: 'active', networkId: 'vpc-prod-apne2-app-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-notify-001', name: 'notify-svc', cidr: '10.20.14.0/24', status: 'error', networkId: 'vpc-prod-apne2-app-001', routerId: 'rtr-prod-apne2-edge-001' },
  
  // ============================================
  // Production Korea - Data Tier (prod-apne2-vpc-data-001)
  // ============================================
  { id: 'snet-prod-apne2-db-pri-001', name: 'db-primary', cidr: '10.30.1.0/24', status: 'active', networkId: 'vpc-prod-apne2-data-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-db-rep-2a', name: 'db-replica-2a', cidr: '10.30.2.0/24', status: 'active', networkId: 'vpc-prod-apne2-data-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-redis-2a', name: 'redis-2a', cidr: '10.30.10.0/24', status: 'active', networkId: 'vpc-prod-apne2-data-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-prod-apne2-kafka-001', name: 'kafka', cidr: '10.30.20.0/24', status: 'active', networkId: 'vpc-prod-apne2-data-001', routerId: 'rtr-prod-apne2-edge-001' },
  
  // ============================================
  // Production US - Web & App (prod-usw2-vpc-*)
  // ============================================
  { id: 'snet-prod-usw2-web-pub-2a', name: 'web-pub-2a', cidr: '10.110.1.0/24', status: 'active', networkId: 'vpc-prod-usw2-web-001', routerId: 'rtr-prod-usw2-edge-001' },
  { id: 'snet-prod-usw2-web-pub-2b', name: 'web-pub-2b', cidr: '10.110.2.0/24', status: 'active', networkId: 'vpc-prod-usw2-web-001', routerId: 'rtr-prod-usw2-edge-001' },
  { id: 'snet-prod-usw2-web-priv-001', name: 'web-priv', cidr: '10.110.10.0/24', status: 'active', networkId: 'vpc-prod-usw2-web-001', routerId: 'rtr-prod-usw2-edge-001' },
  { id: 'snet-prod-usw2-apigw-001', name: 'apigw', cidr: '10.120.1.0/24', status: 'active', networkId: 'vpc-prod-usw2-app-001', routerId: 'rtr-prod-usw2-edge-001' },
  { id: 'snet-prod-usw2-app-001', name: 'app', cidr: '10.120.10.0/24', status: 'active', networkId: 'vpc-prod-usw2-app-001', routerId: 'rtr-prod-usw2-edge-001' },
  { id: 'snet-dr-usw2-app-001', name: 'dr-app', cidr: '10.120.100.0/24', status: 'inactive', networkId: 'vpc-prod-usw2-app-001', routerId: 'rtr-dr-usw2-edge-001' },
  
  // ============================================
  // Staging (stg-apne2-vpc-001)
  // ============================================
  { id: 'snet-stg-apne2-web-001', name: 'stg-web', cidr: '10.200.1.0/24', status: 'active', networkId: 'vpc-stg-apne2-001', routerId: 'rtr-nprd-apne2-edge-001' },
  { id: 'snet-stg-apne2-app-001', name: 'stg-app', cidr: '10.200.10.0/24', status: 'active', networkId: 'vpc-stg-apne2-001', routerId: 'rtr-nprd-apne2-edge-001' },
  { id: 'snet-stg-apne2-data-001', name: 'stg-data', cidr: '10.200.20.0/24', status: 'active', networkId: 'vpc-stg-apne2-001', routerId: 'rtr-nprd-apne2-edge-001' },
  
  // ============================================
  // Development (dev-apne2-vpc-001)
  // ============================================
  { id: 'snet-dev-apne2-web-001', name: 'dev-web', cidr: '10.201.1.0/24', status: 'active', networkId: 'vpc-dev-apne2-001', routerId: 'rtr-nprd-apne2-edge-001' },
  { id: 'snet-dev-apne2-app-001', name: 'dev-app', cidr: '10.201.10.0/24', status: 'active', networkId: 'vpc-dev-apne2-001', routerId: 'rtr-nprd-apne2-edge-001' },
  { id: 'snet-dev-apne2-sandbox-001', name: 'dev-sandbox', cidr: '10.201.100.0/24', status: 'active', networkId: 'vpc-dev-apne2-001' },
  
  // ============================================
  // QA (qa-apne2-vpc-001)
  // ============================================
  { id: 'snet-qa-apne2-auto-001', name: 'qa-auto', cidr: '10.202.1.0/24', status: 'active', networkId: 'vpc-qa-apne2-001', routerId: 'rtr-nprd-apne2-edge-001' },
  { id: 'snet-qa-apne2-perf-001', name: 'qa-perf', cidr: '10.202.10.0/24', status: 'active', networkId: 'vpc-qa-apne2-001', routerId: 'rtr-nprd-apne2-edge-001' },
  { id: 'snet-qa-apne2-sec-001', name: 'qa-sec', cidr: '10.202.20.0/24', status: 'error', networkId: 'vpc-qa-apne2-001', routerId: 'rtr-nprd-apne2-edge-001' },
  
  // ============================================
  // Shared Services (shrd-dc-vpc-001)
  // ============================================
  { id: 'snet-shrd-dc-dns-001', name: 'dns', cidr: '10.250.1.0/24', status: 'active', networkId: 'vpc-shrd-dc-001', routerId: 'rtr-shrd-dc-int-001' },
  { id: 'snet-shrd-dc-ldap-001', name: 'ldap', cidr: '10.250.2.0/24', status: 'active', networkId: 'vpc-shrd-dc-001', routerId: 'rtr-shrd-dc-int-001' },
  { id: 'snet-shrd-dc-harbor-001', name: 'harbor', cidr: '10.250.10.0/24', status: 'active', networkId: 'vpc-shrd-dc-001', routerId: 'rtr-shrd-dc-int-001' },
  
  // ============================================
  // Management (mgmt-apne2-vpc-001)
  // ============================================
  { id: 'snet-mgmt-apne2-bastion-001', name: 'bastion', cidr: '10.251.1.0/24', status: 'active', networkId: 'vpc-mgmt-apne2-001', routerId: 'rtr-mgmt-apne2-int-001' },
  { id: 'snet-mgmt-apne2-mon-001', name: 'monitoring', cidr: '10.251.10.0/24', status: 'active', networkId: 'vpc-mgmt-apne2-001', routerId: 'rtr-mgmt-apne2-int-001' },
  { id: 'snet-mgmt-apne2-cicd-001', name: 'cicd', cidr: '10.251.20.0/24', status: 'active', networkId: 'vpc-mgmt-apne2-001', routerId: 'rtr-mgmt-apne2-int-001' },
  
  // ============================================
  // DMZ (dmz-apne2-vpc-001)
  // ============================================
  { id: 'snet-dmz-apne2-partner-001', name: 'partner-api', cidr: '10.252.1.0/24', status: 'active', networkId: 'vpc-dmz-apne2-001', routerId: 'rtr-prod-apne2-edge-001' },
  { id: 'snet-dmz-apne2-b2b-001', name: 'b2b-api', cidr: '10.252.2.0/24', status: 'active', networkId: 'vpc-dmz-apne2-001', routerId: 'rtr-prod-apne2-edge-001' },
];

// Load Balancers - 네이밍: [env]-[region]-[type]-[purpose]-[seq]
const loadBalancers: LoadBalancer[] = [
  // ============================================
  // Production Korea - Web Tier
  // ============================================
  { id: 'alb-prod-apne2-web-ext-001', name: 'alb-web-ext-001', status: 'active', subnetId: 'snet-prod-apne2-web-pub-2a', vip: '10.10.1.100' },
  { id: 'alb-prod-apne2-web-ext-002', name: 'alb-web-ext-002', status: 'active', subnetId: 'snet-prod-apne2-web-pub-2b', vip: '10.10.2.100' },
  { id: 'alb-prod-apne2-waf-001', name: 'alb-waf-001', status: 'active', subnetId: 'snet-prod-apne2-web-pub-2c', vip: '10.10.3.100' },
  { id: 'ilb-prod-apne2-web-int-001', name: 'ilb-web-int', status: 'active', subnetId: 'snet-prod-apne2-web-priv-2a', vip: '10.10.11.100' },
  
  // ============================================
  // Production Korea - App Tier
  // ============================================
  { id: 'alb-prod-apne2-apigw-001', name: 'alb-apigw-001', status: 'active', subnetId: 'snet-prod-apne2-apigw-2a', vip: '10.20.1.100' },
  { id: 'alb-prod-apne2-apigw-002', name: 'alb-apigw-002', status: 'active', subnetId: 'snet-prod-apne2-apigw-2b', vip: '10.20.2.100' },
  { id: 'nlb-prod-apne2-user-001', name: 'nlb-user', status: 'active', subnetId: 'snet-prod-apne2-user-001', vip: '10.20.10.100' },
  { id: 'nlb-prod-apne2-order-001', name: 'nlb-order', status: 'active', subnetId: 'snet-prod-apne2-order-001', vip: '10.20.11.100' },
  { id: 'nlb-prod-apne2-product-001', name: 'nlb-product', status: 'active', subnetId: 'snet-prod-apne2-product-001', vip: '10.20.12.100' },
  { id: 'nlb-prod-apne2-payment-001', name: 'nlb-payment', status: 'active', subnetId: 'snet-prod-apne2-payment-001', vip: '10.20.13.100' },
  { id: 'nlb-prod-apne2-notify-001', name: 'nlb-notify', status: 'error', subnetId: 'snet-prod-apne2-notify-001', vip: '10.20.14.100' },
  
  // ============================================
  // Production Korea - Data Tier
  // ============================================
  { id: 'nlb-prod-apne2-db-pri-001', name: 'nlb-db-pri', status: 'active', subnetId: 'snet-prod-apne2-db-pri-001', vip: '10.30.1.100' },
  { id: 'nlb-prod-apne2-redis-001', name: 'nlb-redis', status: 'active', subnetId: 'snet-prod-apne2-redis-2a', vip: '10.30.10.100' },
  { id: 'nlb-prod-apne2-kafka-001', name: 'nlb-kafka', status: 'active', subnetId: 'snet-prod-apne2-kafka-001', vip: '10.30.20.100' },
  
  // ============================================
  // Production US
  // ============================================
  { id: 'alb-prod-usw2-web-ext-001', name: 'alb-web-ext-001', status: 'active', subnetId: 'snet-prod-usw2-web-pub-2a', vip: '10.110.1.100' },
  { id: 'alb-prod-usw2-web-ext-002', name: 'alb-web-ext-002', status: 'active', subnetId: 'snet-prod-usw2-web-pub-2b', vip: '10.110.2.100' },
  { id: 'alb-prod-usw2-apigw-001', name: 'alb-apigw', status: 'active', subnetId: 'snet-prod-usw2-apigw-001', vip: '10.120.1.100' },
  { id: 'nlb-prod-usw2-app-001', name: 'nlb-app', status: 'active', subnetId: 'snet-prod-usw2-app-001', vip: '10.120.10.100' },
  
  // ============================================
  // Staging
  // ============================================
  { id: 'alb-stg-apne2-web-001', name: 'alb-stg-web', status: 'active', subnetId: 'snet-stg-apne2-web-001', vip: '10.200.1.100' },
  { id: 'nlb-stg-apne2-app-001', name: 'nlb-stg-app', status: 'active', subnetId: 'snet-stg-apne2-app-001', vip: '10.200.10.100' },
  
  // ============================================
  // Development
  // ============================================
  { id: 'alb-dev-apne2-all-001', name: 'alb-dev-all', status: 'active', subnetId: 'snet-dev-apne2-web-001', vip: '10.201.1.100' },
  
  // ============================================
  // QA
  // ============================================
  { id: 'alb-qa-apne2-test-001', name: 'alb-qa-test', status: 'active', subnetId: 'snet-qa-apne2-auto-001', vip: '10.202.1.100' },
  { id: 'nlb-qa-apne2-perf-001', name: 'nlb-qa-perf', status: 'active', subnetId: 'snet-qa-apne2-perf-001', vip: '10.202.10.100' },
  
  // ============================================
  // Shared Services
  // ============================================
  { id: 'nlb-shrd-dc-dns-001', name: 'nlb-dns', status: 'active', subnetId: 'snet-shrd-dc-dns-001', vip: '10.250.1.100' },
  { id: 'nlb-shrd-dc-ldap-001', name: 'nlb-ldap', status: 'active', subnetId: 'snet-shrd-dc-ldap-001', vip: '10.250.2.100' },
  { id: 'alb-shrd-dc-harbor-001', name: 'alb-harbor', status: 'active', subnetId: 'snet-shrd-dc-harbor-001', vip: '10.250.10.100' },
  
  // ============================================
  // Management
  // ============================================
  { id: 'alb-mgmt-apne2-prom-001', name: 'alb-prometheus', status: 'active', subnetId: 'snet-mgmt-apne2-mon-001', vip: '10.251.10.100' },
  { id: 'alb-mgmt-apne2-grafana-001', name: 'alb-grafana', status: 'active', subnetId: 'snet-mgmt-apne2-mon-001', vip: '10.251.10.101' },
  { id: 'alb-mgmt-apne2-jenkins-001', name: 'alb-jenkins', status: 'active', subnetId: 'snet-mgmt-apne2-cicd-001', vip: '10.251.20.100' },
  
  // ============================================
  // DMZ
  // ============================================
  { id: 'alb-dmz-apne2-partner-001', name: 'alb-partner', status: 'active', subnetId: 'snet-dmz-apne2-partner-001', vip: '10.252.1.100' },
  { id: 'alb-dmz-apne2-b2b-001', name: 'alb-b2b', status: 'active', subnetId: 'snet-dmz-apne2-b2b-001', vip: '10.252.2.100' },
];

/* ----------------------------------------
   Popover Component
   ---------------------------------------- */
interface VpcSubnetGroup {
  routerName: string | null; // null means unrouted
  subnets: { name: string; cidr: string; status: string }[];
}

// Item types for detailed lists
interface RouterItem {
  name: string;
  status: 'active' | 'inactive' | 'error';
  externalGateway?: string;
}

interface InstanceItem {
  name: string;
  status: 'active' | 'inactive' | 'error';
  ip?: string;
}

interface LoadBalancerItem {
  name: string;
  status: 'active' | 'inactive' | 'error';
  vip?: string;
}

interface SubnetItem {
  name: string;
  status: 'active' | 'inactive' | 'error';
  cidr?: string;
}

interface PopoverProps {
  data: {
    type: string;
    name: string;
    status: string;
    details: Record<string, string>;
    // Extended fields for specific types
    id?: string;
    adminState?: string;
    // External Network
    routerCount?: number;
    routerList?: RouterItem[]; // Detailed router list
    // VPC
    shared?: boolean;
    mtu?: number;
    vpcSubnetGroups?: VpcSubnetGroup[]; // Subnets grouped by router for VPC popover
    // Router
    snat?: boolean;
    externalGateway?: string;
    subnetCount?: number;
    subnetList?: SubnetItem[]; // Detailed subnet list
    // Subnet
    gatewayIp?: string;
    cidr?: string;
    instanceCount?: number;
    instanceList?: InstanceItem[]; // Detailed instance list
    loadBalancerCount?: number;
    loadBalancerList?: LoadBalancerItem[]; // Detailed LB list
    // Load Balancer
    vip?: string;
    floatingIp?: string;
    listenerCount?: number;
    healthMonitor?: { 
      healthy: number; 
      degraded: number; 
      error: number;
      pools?: { name: string; status: 'healthy' | 'degraded' | 'error' }[];
    };
    listenerList?: { name: string; protocol: string; port: number; status: 'active' | 'inactive' | 'error' }[];
  } | null;
  position: { x: number; y: number };
  onClose: () => void;
}

// Helper component for copyable text
function CopyableText({ value }: { value: string }) {
  const handleCopy = () => navigator.clipboard.writeText(value);
  return (
    <span className="inline-flex items-center gap-1">
      <span className="font-mono text-xs">{value}</span>
      <button onClick={handleCopy} className="text-slate-400 hover:text-slate-600">
        <IconCopy size={12} />
      </button>
    </span>
  );
}

// Helper component for link text
function LinkText({ value, href }: { value: string; href?: string }) {
  return (
    <Link to={href || '#'} className="text-blue-500 hover:underline inline-flex items-center gap-0.5">
      {value}
      <IconExternalLink size={12} />
    </Link>
  );
}

// Helper component for view detail link
function ViewDetailLink({ count }: { count: number }) {
  return (
    <span>
      <span className="font-medium">{count}</span>
      <Link
          to="#" className="text-blue-500 hover:underline ml-2 text-xs">View detail</Link>
    </span>
  );
}

// Health Monitor Section Component
function HealthMonitorSection({ healthMonitor }: { 
  healthMonitor: { 
    healthy: number; 
    degraded: number; 
    error: number;
    pools?: { name: string; status: 'healthy' | 'degraded' | 'error' }[];
  } 
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Sort pools by status: error first, then degraded, then healthy
  const sortedPools = healthMonitor.pools ? [...healthMonitor.pools].sort((a, b) => {
    const order = { error: 0, degraded: 1, healthy: 2 };
    return order[a.status] - order[b.status];
  }) : [];

  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      {/* Header */}
      <button 
        className="flex items-start gap-2 w-full text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-slate-400 mt-0.5">
          {isExpanded ? '▼' : '▶'}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-500 font-medium">Health Monitor :</span>
            <span className="text-green-500 font-medium text-sm">{healthMonitor.healthy} Healthy</span>
            <span className="text-amber-500 font-medium text-sm">{healthMonitor.degraded} Degraded</span>
            <span className="text-red-500 font-medium text-sm">{healthMonitor.error} Error</span>
          </div>
        </div>
      </button>
      
      {/* Pool List */}
      {isExpanded && sortedPools.length > 0 && (
        <div className="mt-2 pt-2 border-t border-dashed border-slate-200">
          <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
            {sortedPools.map((pool, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className={`font-medium ${
                  pool.status === 'error' ? 'text-red-500' :
                  pool.status === 'degraded' ? 'text-amber-500' :
                  'text-green-500'
                }`}>
                  {pool.status === 'error' ? 'Error' : 
                   pool.status === 'degraded' ? 'Degraded' : 'Healthy'}
                </span>
                <Link
          to="#" className="text-blue-500 hover:underline inline-flex items-center gap-1 font-medium">
                  {pool.name}
                  <IconExternalLink size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Listeners Section Component
function ListenersSection({ listeners }: { 
  listeners: { name: string; protocol: string; port: number; status: 'active' | 'inactive' | 'error' }[];
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      {/* Header */}
      <button 
        className="flex items-start gap-2 w-full text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-slate-400 mt-0.5">
          {isExpanded ? '▼' : '▶'}
        </span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Listeners ({listeners.length})</span>
            <Link
          to="#" className="text-blue-500 hover:underline text-xs" onClick={(e) => e.stopPropagation()}>View detail</Link>
          </div>
        </div>
      </button>
      
      {/* Listener List */}
      {isExpanded && (
        <div className="mt-2 pt-2 border-t border-dashed border-slate-200">
          <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
            {listeners.map((listener, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    listener.status === 'active' ? 'bg-green-500' :
                    listener.status === 'error' ? 'bg-red-500' : 'bg-slate-400'
                  }`} />
                  <span className="text-slate-600">{listener.protocol}:{listener.port}</span>
                </div>
                <Link
          to="#" className="text-blue-500 hover:underline inline-flex items-center gap-1 font-medium">
                  {listener.name}
                  <IconExternalLink size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Routers Section Component (for External Network)
function RoutersSection({ routers }: { 
  routers: RouterItem[];
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      {/* Header */}
      <button 
        className="flex items-start gap-2 w-full text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-slate-400 mt-0.5">
          {isExpanded ? '▼' : '▶'}
        </span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Routers ({routers.length})</span>
            <Link
          to="#" className="text-blue-500 hover:underline text-xs" onClick={(e) => e.stopPropagation()}>View detail</Link>
          </div>
        </div>
      </button>
      
      {/* Router List */}
      {isExpanded && (
        <div className="mt-2 pt-2 border-t border-dashed border-slate-200">
          <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
            {routers.map((router, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    router.status === 'active' ? 'bg-green-500' :
                    router.status === 'error' ? 'bg-red-500' : 'bg-slate-400'
                  }`} />
                  <span className="text-slate-600">{router.externalGateway || 'internal'}</span>
                </div>
                <Link
          to="#" className="text-blue-500 hover:underline inline-flex items-center gap-1 font-medium">
                  {router.name}
                  <IconExternalLink size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Subnets Section Component (for Router)
function SubnetsSection({ subnets }: { 
  subnets: SubnetItem[];
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      {/* Header */}
      <button 
        className="flex items-start gap-2 w-full text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-slate-400 mt-0.5">
          {isExpanded ? '▼' : '▶'}
        </span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Subnets ({subnets.length})</span>
            <Link
          to="#" className="text-blue-500 hover:underline text-xs" onClick={(e) => e.stopPropagation()}>View detail</Link>
          </div>
        </div>
      </button>
      
      {/* Subnet List */}
      {isExpanded && (
        <div className="mt-2 pt-2 border-t border-dashed border-slate-200">
          <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
            {subnets.map((subnet, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    subnet.status === 'active' ? 'bg-green-500' :
                    subnet.status === 'error' ? 'bg-red-500' : 'bg-slate-400'
                  }`} />
                  <span className="font-mono text-slate-400 text-xs">{subnet.cidr || '-'}</span>
                </div>
                <Link
          to="#" className="text-blue-500 hover:underline inline-flex items-center gap-1 font-medium">
                  {subnet.name}
                  <IconExternalLink size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Popover({ data, position, onClose }: PopoverProps) {
  const [pos, setPos] = useState(position);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const popoverRef = useRef<HTMLDivElement>(null);

  // Update position when prop changes
  useEffect(() => {
    setPos(position);
  }, [position.x, position.y]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, a')) return; // Don't drag when clicking buttons/links
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setPos({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!data) return null;

  const statusText = data.status === 'active' ? 'Available' : data.status === 'inactive' ? 'Inactive' : 'Error';

  return (
    <div
      ref={popoverRef}
      className={`fixed z-50 bg-white border border-slate-200 rounded-xl shadow-xl min-w-[240px] max-w-[280px] ${isDragging ? 'cursor-grabbing' : ''}`}
      style={{ left: pos.x, top: pos.y }}
    >
      {/* Header - Draggable */}
      <div 
        className={`flex items-center justify-between px-4 pt-3 pb-2 ${!isDragging ? 'cursor-grab' : 'cursor-grabbing'}`}
        onMouseDown={handleMouseDown}
      >
        <span className="font-semibold text-base text-slate-900">{data.name}</span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <IconX size={18} />
        </button>
      </div>
      
      {/* Content */}
      <div className="px-4 pb-4 text-sm text-slate-700 space-y-1.5">
        {/* Status */}
        <div className="flex justify-between">
          <span className="text-slate-500">Status:</span>
          <span className="font-medium">{statusText}</span>
        </div>
        
        {/* Name */}
        <div className="flex justify-between">
          <span className="text-slate-500">Name:</span>
          <LinkText value={data.name} />
        </div>
        
        {/* ID */}
        {data.id && (
          <div className="flex justify-between">
            <span className="text-slate-500">ID:</span>
            <CopyableText value={data.id} />
          </div>
        )}
        
        {/* Admin State */}
        {data.adminState && (
          <div className="flex justify-between">
            <span className="text-slate-500">Admin State:</span>
            <span className="font-medium">{data.adminState}</span>
          </div>
        )}
        
        {/* VPC specific */}
        {data.type === 'vpc' && (
          <>
            {data.shared !== undefined && (
              <div className="flex justify-between">
                <span className="text-slate-500">Shared:</span>
                <span className="font-medium">{data.shared ? 'On' : 'Off'}</span>
              </div>
            )}
            {data.mtu && (
              <div className="flex justify-between">
                <span className="text-slate-500">MTU:</span>
                <span className="font-medium">{data.mtu}</span>
              </div>
            )}
            
            {/* VPC Subnets grouped by router */}
            {data.vpcSubnetGroups && data.vpcSubnetGroups.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="text-slate-500 mb-2 font-medium">
                  Subnets ({data.vpcSubnetGroups.reduce((acc, g) => acc + g.subnets.length, 0)} total)
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {data.vpcSubnetGroups.map((group, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex items-center gap-1 text-slate-600 mb-1">
                        {group.routerName ? (
                          <>
                            <span className="text-indigo-500">📍</span>
                            <span className="font-medium">{group.routerName}</span>
                          </>
                        ) : (
                          <>
                            <span className="text-amber-500">⚠️</span>
                            <span className="font-medium text-amber-600">Unrouted</span>
                          </>
                        )}
                      </div>
                      <div className="pl-4 space-y-0.5">
                        {group.subnets.map((subnet, sIdx) => (
                          <div key={sIdx} className="flex items-center justify-between text-slate-600">
                            <span>{subnet.name}</span>
                            <span className="font-mono text-slate-400">{subnet.cidr}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Router specific */}
        {data.type === 'router' && (
          <>
            {data.snat !== undefined && (
              <div className="flex justify-between">
                <span className="text-slate-500">SNAT:</span>
                <span className="font-medium">{data.snat ? 'On' : 'Off'}</span>
              </div>
            )}
            {data.externalGateway && (
              <div className="flex justify-between">
                <span className="text-slate-500">External Gateway:</span>
                <LinkText value={data.externalGateway} />
              </div>
            )}
          </>
        )}
        
        {/* Subnet specific */}
        {data.type === 'subnet' && (
          <>
            {data.gatewayIp && (
              <div className="flex justify-between">
                <span className="text-slate-500">Gateway IP:</span>
                <CopyableText value={data.gatewayIp} />
              </div>
            )}
            {data.cidr && (
              <div className="flex justify-between">
                <span className="text-slate-500">CIDR:</span>
                <CopyableText value={data.cidr} />
              </div>
            )}
            
            {/* Routers Section */}
            {data.routerList && data.routerList.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 font-medium">Routers ({data.routerList.length})</span>
                  <Link
          to="#" className="text-blue-500 hover:underline text-xs">View detail</Link>
                </div>
                <div className="space-y-1.5 text-xs max-h-24 overflow-y-auto">
                  {data.routerList.map((router, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          router.status === 'active' ? 'bg-green-500' : 
                          router.status === 'error' ? 'bg-red-500' : 'bg-slate-400'
                        }`} />
                        <span>{router.name}</span>
                      </div>
                      {router.externalGateway && (
                        <span className="text-slate-400 text-[10px]">{router.externalGateway}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Instances Section */}
            {data.instanceList && data.instanceList.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 font-medium">Instances ({data.instanceList.length})</span>
                  <Link
          to="#" className="text-blue-500 hover:underline text-xs">View detail</Link>
                </div>
                <div className="space-y-1.5 text-xs max-h-24 overflow-y-auto">
                  {data.instanceList.map((instance, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          instance.status === 'active' ? 'bg-green-500' : 
                          instance.status === 'error' ? 'bg-red-500' : 'bg-slate-400'
                        }`} />
                        <span>{instance.name}</span>
                      </div>
                      {instance.ip && (
                        <span className="font-mono text-slate-400">{instance.ip}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Load Balancers Section */}
            {data.loadBalancerList && data.loadBalancerList.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 font-medium">Load Balancers ({data.loadBalancerList.length})</span>
                  <Link
          to="#" className="text-blue-500 hover:underline text-xs">View detail</Link>
                </div>
                <div className="space-y-1.5 text-xs max-h-24 overflow-y-auto">
                  {data.loadBalancerList.map((lb, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          lb.status === 'active' ? 'bg-green-500' : 
                          lb.status === 'error' ? 'bg-red-500' : 'bg-slate-400'
                        }`} />
                        <span>{lb.name}</span>
                      </div>
                      {lb.vip && (
                        <span className="font-mono text-slate-400">{lb.vip}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Load Balancer specific */}
        {data.type === 'loadBalancer' && (
          <>
            {data.vip && (
              <div className="flex justify-between">
                <span className="text-slate-500">VIP:</span>
                <CopyableText value={data.vip} />
              </div>
            )}
            {data.floatingIp && (
              <div className="flex justify-between">
                <span className="text-slate-500">Floating IP:</span>
                <CopyableText value={data.floatingIp} />
              </div>
            )}
          </>
        )}
        
        {/* Counts with View detail links (for non-subnet types or when no detailed list) */}
        {data.routerCount !== undefined && data.routerCount > 0 && !data.routerList && (
          <div className="flex justify-between">
            <span className="text-slate-500">Routers:</span>
            <ViewDetailLink count={data.routerCount} />
          </div>
        )}
        {data.subnetCount !== undefined && data.subnetCount > 0 && !data.subnetList && (
          <div className="flex justify-between">
            <span className="text-slate-500">Subnets:</span>
            <ViewDetailLink count={data.subnetCount} />
          </div>
        )}
        
        {/* Routers Section (External Network) */}
        {data.routerList && data.routerList.length > 0 && data.type === 'externalNetwork' && (
          <RoutersSection routers={data.routerList} />
        )}
        
        {/* Subnets Section (Router) */}
        {data.subnetList && data.subnetList.length > 0 && data.type === 'router' && (
          <SubnetsSection subnets={data.subnetList} />
        )}
        {data.instanceCount !== undefined && data.instanceCount > 0 && !data.instanceList && (
          <div className="flex justify-between">
            <span className="text-slate-500">Instances:</span>
            <ViewDetailLink count={data.instanceCount} />
          </div>
        )}
        {data.loadBalancerCount !== undefined && data.loadBalancerCount > 0 && !data.loadBalancerList && (
          <div className="flex justify-between">
            <span className="text-slate-500">Load Balancer:</span>
            <ViewDetailLink count={data.loadBalancerCount} />
          </div>
        )}
        {data.listenerCount !== undefined && data.listenerCount > 0 && !data.listenerList && (
          <div className="flex justify-between">
            <span className="text-slate-500">Listeners:</span>
            <ViewDetailLink count={data.listenerCount} />
          </div>
        )}
        
        {/* Listeners Section (Load Balancer) */}
        {data.listenerList && data.listenerList.length > 0 && (
          <ListenersSection listeners={data.listenerList} />
        )}
        
        {/* Health Monitor (Load Balancer) */}
        {data.healthMonitor && (
          <HealthMonitorSection healthMonitor={data.healthMonitor} />
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Tooltip Component
   ---------------------------------------- */
interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  content: { name: string; type: string; status: string; extra?: string };
}

/* ----------------------------------------
   Main Component
   ---------------------------------------- */
export function TopologyD3Page() {
  const svgRef = useRef<SVGSVGElement>(null);
  const minimapRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [popover, setPopover] = useState<{
    data: PopoverProps['data'];
    position: { x: number; y: number };
  } | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, content: { name: '', type: '', status: '' } });
  const [zoomLevel, setZoomLevel] = useState(1);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRouter, setFilterRouter] = useState<string>('all');
  const [filterVpc, setFilterVpc] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const closePopover = useCallback(() => setPopover(null), []);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    let filteredSubnets = [...subnets];
    let filteredLbs = [...loadBalancers];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredSubnets = filteredSubnets.filter(s => 
        s.name.toLowerCase().includes(term) || 
        s.cidr.includes(term) ||
        networks.find(n => n.id === s.networkId)?.name.toLowerCase().includes(term)
      );
      filteredLbs = filteredLbs.filter(lb =>
        lb.name.toLowerCase().includes(term) ||
        lb.vip.includes(term)
      );
    }

    // Router filter
    if (filterRouter !== 'all') {
      filteredSubnets = filteredSubnets.filter(s => s.routerId === filterRouter);
      const subnetIds = new Set(filteredSubnets.map(s => s.id));
      filteredLbs = filteredLbs.filter(lb => subnetIds.has(lb.subnetId));
    }

    // VPC filter
    if (filterVpc !== 'all') {
      filteredSubnets = filteredSubnets.filter(s => s.networkId === filterVpc);
      const subnetIds = new Set(filteredSubnets.map(s => s.id));
      filteredLbs = filteredLbs.filter(lb => subnetIds.has(lb.subnetId));
    }

    // Status filter
    if (filterStatus !== 'all') {
      filteredSubnets = filteredSubnets.filter(s => s.status === filterStatus);
      filteredLbs = filteredLbs.filter(lb => lb.status === filterStatus);
    }

    // Get related routers and external networks
    const routerIds = new Set(filteredSubnets.map(s => s.routerId).filter(Boolean));
    const filteredRouters = routers.filter(r => routerIds.has(r.id));
    const extNetIds = new Set(filteredRouters.map(r => r.externalNetworkId).filter(Boolean));
    const filteredExtNets = externalNetworks.filter(e => extNetIds.has(e.id));
    const filteredVpcIds = new Set(filteredSubnets.map(s => s.networkId));
    const filteredVpcs = networks.filter(n => filteredVpcIds.has(n.id));

    // Build filtered network groups
    const filteredNetworkGroups = filteredExtNets.map(extNet => ({
      extNet,
      routers: filteredRouters.filter(r => r.externalNetworkId === extNet.id)
    })).filter(g => g.routers.length > 0);

    return {
      networkGroups: filteredNetworkGroups,
      subnets: filteredSubnets,
      loadBalancers: filteredLbs,
      networks: filteredVpcs,
      routers: filteredRouters,
    };
  }, [searchTerm, filterRouter, filterVpc, filterStatus]);

  // Stats
  const stats = useMemo(() => ({
    totalSubnets: subnets.length,
    filteredSubnets: filteredData.subnets.length,
    activeSubnets: filteredData.subnets.filter(s => s.status === 'active').length,
    errorSubnets: filteredData.subnets.filter(s => s.status === 'error').length,
    totalLbs: loadBalancers.length,
    filteredLbs: filteredData.loadBalancers.length,
  }), [filteredData]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setFilterRouter('all');
    setFilterVpc('all');
    setFilterStatus('all');
  }, []);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create main group for zooming/panning
    const g = svg.append('g');

    // updateMinimap will be defined later, declare here for hoisting
    let updateMinimap: (transform: d3.ZoomTransform) => void = () => {};

    // Semantic zoom level thresholds
    const ZOOM_THRESHOLDS = {
      FULL_DETAIL: 1.0,    // >= 1.0: 전체 상세 (아이콘, 이름, 상태, CIDR)
      MEDIUM_DETAIL: 0.6,  // >= 0.6: 아이콘 + 이름만
      // < 0.6: 아이콘만 (축약 모드)
    };

    // Update visual elements based on zoom level
    const updateSemanticZoom = (scale: number) => {
      // Labels (이름)
      g.selectAll('.node-label')
        .transition()
        .duration(150)
        .style('opacity', scale >= ZOOM_THRESHOLDS.MEDIUM_DETAIL ? 1 : 0);

      // Sublabels (CIDR, VIP)
      g.selectAll('.node-sublabel')
        .transition()
        .duration(150)
        .style('opacity', scale >= ZOOM_THRESHOLDS.FULL_DETAIL ? 1 : 0);

      // Status indicators
      g.selectAll('.node-status')
        .transition()
        .duration(150)
        .style('opacity', scale >= ZOOM_THRESHOLDS.MEDIUM_DETAIL ? 1 : 0);

      // VPC labels
      g.selectAll('.vpc-label')
        .transition()
        .duration(150)
        .style('opacity', scale >= ZOOM_THRESHOLDS.MEDIUM_DETAIL ? 1 : 0);

      // VPC sublabels (subnet count, status)
      g.selectAll('.vpc-sublabel')
        .transition()
        .duration(150)
        .style('opacity', scale >= ZOOM_THRESHOLDS.FULL_DETAIL ? 1 : 0);
    };

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        updateMinimap(event.transform);
        updateSemanticZoom(event.transform.k);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);

    // Layout constants - increased gaps
    const startX = 80;
    const startY = 80;
    const layerGap = 160;
    const nodeGap = 240;  // Increased for better VPC spacing
    const lbGap = 120;    // Increased for LB spacing
    const vpcPadding = 0; // VPC panel padding (내부 좌우 패딩)
    const vpcGap = 40;     // Gap between VPC groups

    // Use filtered data
    const currentNetworkGroups = filteredData.networkGroups;
    const currentSubnets = filteredData.subnets;
    const currentLoadBalancers = filteredData.loadBalancers;

    // Calculate positions
    interface NodePosition {
      id: string;
      x: number;
      y: number;
      type: string;
      data: any;
    }

    interface EdgeData {
      source: { x: number; y: number };
      target: { x: number; y: number };
      sourceType: string;
      status: string;
      animated?: boolean;
    }

    const nodes: NodePosition[] = [];
    const edges: EdgeData[] = [];
    const vpcGroups: { x: number; y: number; width: number; height: number; name: string; networkId: string; status: string; isSplit?: boolean; splitIndex?: number; splitTotal?: number }[] = [];
    
    // Track which VPCs have already had their unrouted subnets added (to avoid duplicates)
    const vpcUnroutedAdded: Set<string> = new Set();
    // Deferred router-to-subnet edges (to be drawn after all routers are positioned)
    const deferredRouterEdges: { subnetId: string; routerId: string; subnetPos: { x: number; y: number } }[] = [];

    // Group subnets by router
    const subnetsByRouter: Record<string, Subnet[]> = {};
    currentSubnets.forEach(subnet => {
      if (subnet.routerId) {
        if (!subnetsByRouter[subnet.routerId]) subnetsByRouter[subnet.routerId] = [];
        subnetsByRouter[subnet.routerId].push(subnet);
      }
    });

    // Check which VPCs are split across multiple routers
    const vpcRouterMap: Record<string, Set<string>> = {};
    currentSubnets.forEach(subnet => {
      if (subnet.routerId && subnet.networkId) {
        if (!vpcRouterMap[subnet.networkId]) vpcRouterMap[subnet.networkId] = new Set();
        vpcRouterMap[subnet.networkId].add(subnet.routerId);
      }
    });
    const splitVpcs = new Set(
      Object.entries(vpcRouterMap)
        .filter(([, routers]) => routers.size > 1)
        .map(([networkId]) => networkId)
    );
    
    // For split VPCs, determine the primary router (first router in order)
    const splitVpcPrimaryRouter: Record<string, string> = {};
    const allRouterIds = [...currentNetworkGroups.flatMap(g => g.routers.map(r => r.id))];
    splitVpcs.forEach(vpcId => {
      const connectedRouters = vpcRouterMap[vpcId];
      if (connectedRouters) {
        // Find the first router in layout order
        for (const routerId of allRouterIds) {
          if (connectedRouters.has(routerId)) {
            splitVpcPrimaryRouter[vpcId] = routerId;
            break;
          }
        }
      }
    });

    // Group LBs by subnet
    const lbsBySubnet: Record<string, LoadBalancer[]> = {};
    currentLoadBalancers.forEach(lb => {
      if (!lbsBySubnet[lb.subnetId]) lbsBySubnet[lb.subnetId] = [];
      lbsBySubnet[lb.subnetId].push(lb);
    });

    // Calculate subnet width based on LBs
    const getSubnetWidth = (subnetId: string): number => {
      const lbs = lbsBySubnet[subnetId] || [];
      return Math.max(nodeGap, lbs.length * lbGap);
    };

    // Calculate router width based on subnets (including unconnected subnets from same VPCs)
    // For split VPCs, only the primary router includes all subnets
    const getRouterWidth = (routerId: string): number => {
      const routerSubnets = subnetsByRouter[routerId] || [];
      if (routerSubnets.length === 0) return nodeGap;
      
      // Group by VPC
      const vpcIds = new Set(routerSubnets.map(s => s.networkId));
      
      // For split VPCs where this router is the primary, add ALL subnets from that VPC
      splitVpcs.forEach(vpcId => {
        if (splitVpcPrimaryRouter[vpcId] === routerId) {
          vpcIds.add(vpcId);
        }
      });
      
      // For split VPCs where this router is NOT the primary, remove that VPC (it will be rendered elsewhere)
      splitVpcs.forEach(vpcId => {
        if (splitVpcPrimaryRouter[vpcId] !== routerId && vpcIds.has(vpcId)) {
          vpcIds.delete(vpcId);
        }
      });
      
      const vpcCount = vpcIds.size;
      if (vpcCount === 0) return nodeGap;
      
      // Count all subnets including unconnected ones in same VPCs
      let totalWidth = 0;
      vpcIds.forEach(vpcId => {
        // For split VPCs, include ALL subnets regardless of which router they connect to
        const isSplitVpc = splitVpcs.has(vpcId);
        let allInVpc: Subnet[];
        
        if (isSplitVpc) {
          // All subnets from the split VPC
          allInVpc = subnets.filter(s => s.networkId === vpcId);
        } else {
          // Only subnets connected to this router + unconnected
          const connectedInVpc = routerSubnets.filter(s => s.networkId === vpcId);
          const unconnectedInVpc = subnets.filter(s => s.networkId === vpcId && !s.routerId);
          allInVpc = [...connectedInVpc, ...unconnectedInVpc];
        }
        
        allInVpc.forEach(s => {
          totalWidth += getSubnetWidth(s.id);
        });
      });
      
      return totalWidth + vpcPadding * 2 + (vpcCount > 1 ? vpcGap * (vpcCount - 1) : 0);
    };

    let currentX = startX;

    // Process network groups (External Network -> Routers)
    currentNetworkGroups.forEach((group) => {
      const groupStartX = currentX;
      let groupWidth = 0;

      // Calculate group width
      group.routers.forEach(router => {
        groupWidth += getRouterWidth(router.id);
      });
      groupWidth = Math.max(groupWidth, nodeGap);

      // External Network
      const extNetX = groupStartX + groupWidth / 2;
      const extNetY = startY;
      const extNetStatus = group.extNet.status || 'active';
      nodes.push({
        id: group.extNet.id,
        x: extNetX,
        y: extNetY,
        type: 'externalNetwork',
        data: { ...group.extNet, status: extNetStatus },
      });

      // Routers
      let routerX = groupStartX;
      group.routers.forEach(router => {
        const routerWidth = getRouterWidth(router.id);
        const rx = routerX + routerWidth / 2;
        const ry = startY + layerGap;

        nodes.push({
          id: router.id,
          x: rx,
          y: ry,
          type: 'router',
          data: router,
        });

        // Edge: External Network -> Router (use router status for edge color)
        edges.push({
          source: { x: extNetX, y: extNetY + NODE_SIZES.externalNetwork.node / 2 },
          target: { x: rx, y: ry - NODE_SIZES.router.node / 2 },
          sourceType: 'externalNetwork',
          status: router.status,  // Use router status to reflect error state
          animated: router.status === 'active',
        });

        // Subnets for this router
        const routerSubnets = subnetsByRouter[router.id] || [];
        let subnetX = routerX;

        // Group subnets by VPC
        // For split VPCs: only render when this router is the primary router, and include ALL subnets
        const subnetsByVpc: Record<string, { allSubnets: Subnet[] }> = {};
        
        routerSubnets.forEach(subnet => {
          const isSplitVpc = splitVpcs.has(subnet.networkId);
          const isPrimaryRouter = splitVpcPrimaryRouter[subnet.networkId] === router.id;
          
          // Skip split VPC subnets if this is not the primary router
          if (isSplitVpc && !isPrimaryRouter) return;
          
          if (!subnetsByVpc[subnet.networkId]) subnetsByVpc[subnet.networkId] = { allSubnets: [] };
          
          if (isSplitVpc && isPrimaryRouter) {
            // For primary router of split VPC: add ALL subnets from this VPC (only once)
            if (subnetsByVpc[subnet.networkId].allSubnets.length === 0) {
              subnetsByVpc[subnet.networkId].allSubnets = subnets.filter(s => s.networkId === subnet.networkId);
            }
          } else {
            // Normal case: just add this subnet
            subnetsByVpc[subnet.networkId].allSubnets.push(subnet);
          }
        });
        
        // Add split VPCs where this router is the primary (but may not have direct subnets)
        splitVpcs.forEach(vpcId => {
          if (splitVpcPrimaryRouter[vpcId] === router.id && !subnetsByVpc[vpcId]) {
            subnetsByVpc[vpcId] = { allSubnets: subnets.filter(s => s.networkId === vpcId) };
          }
        });
        
        // Add unconnected subnets from non-split VPCs
        Object.keys(subnetsByVpc).forEach(vpcId => {
          if (!splitVpcs.has(vpcId) && !vpcUnroutedAdded.has(vpcId)) {
            const unconnectedInVpc = subnets.filter(s => s.networkId === vpcId && !s.routerId);
            subnetsByVpc[vpcId].allSubnets.push(...unconnectedInVpc);
            if (unconnectedInVpc.length > 0) {
              vpcUnroutedAdded.add(vpcId);
            }
          }
        });

        const vpcEntries = Object.entries(subnetsByVpc);
        vpcEntries.forEach(([vpcId, { allSubnets: allVpcSubnets }], vpcIdx) => {
          const vpc = networks.find(n => n.id === vpcId);
          const vpcStartX = subnetX;
          let vpcWidth = 0;

          // Store subnet positions for edge drawing
          const subnetPositions: Record<string, { x: number, y: number }> = {};

          allVpcSubnets.forEach((subnet) => {
            const subnetWidth = getSubnetWidth(subnet.id);
            const sx = subnetX + subnetWidth / 2;
            const sy = startY + layerGap * 2;

            nodes.push({
              id: subnet.id,
              x: sx,
              y: sy,
              type: 'subnet',
              data: subnet,
            });
            
            subnetPositions[subnet.id] = { x: sx, y: sy };

            // Load Balancers for this subnet
            const subnetLbs = lbsBySubnet[subnet.id] || [];
            const lbStartX = sx - (subnetLbs.length - 1) * lbGap / 2;

            subnetLbs.forEach((lb, lbIdx) => {
              const lx = lbStartX + lbIdx * lbGap;
              const ly = startY + layerGap * 3;

              nodes.push({
                id: lb.id,
                x: lx,
                y: ly,
                type: 'loadBalancer',
                data: lb,
              });

              // Edge: Subnet -> LB (use subnet color)
              edges.push({
                source: { x: sx, y: sy + NODE_SIZES.subnet.node / 2 },
                target: { x: lx, y: ly - NODE_SIZES.loadBalancer.node / 2 },
                sourceType: 'subnet',
                status: subnet.status,
              });
            });

            subnetX += subnetWidth;
            vpcWidth += subnetWidth;
          });
          
          // Defer router-to-subnet edges (will be drawn after all routers are positioned)
          allVpcSubnets.forEach(subnet => {
            if (subnet.routerId) {
              const subnetPos = subnetPositions[subnet.id];
              if (subnetPos) {
                deferredRouterEdges.push({
                  subnetId: subnet.id,
                  routerId: subnet.routerId,
                  subnetPos,
                });
              }
            }
          });

          // VPC Group Panel - 통합된 VPC 그룹 (split VPC도 하나로 표시)
          if (vpc && allVpcSubnets.length > 0) {
            const connectedRouterCount = vpcRouterMap[vpc.id]?.size || 0;
            const isMultiRouter = connectedRouterCount > 1;
            
            vpcGroups.push({
              x: vpcStartX,
              y: startY + layerGap * 2 - 60,
              width: vpcWidth,
              height: 130,
              name: vpc.name,
              networkId: vpc.id,
              status: vpc.status,
              isSplit: false, // 더 이상 split으로 표시하지 않음
              splitIndex: undefined,
              splitTotal: isMultiRouter ? connectedRouterCount : undefined, // 연결된 라우터 수
            });
          }

          // Add gap between VPC groups (except for the last one)
          if (vpcIdx < vpcEntries.length - 1) {
            subnetX += vpcGap;
          }
        });

        routerX = subnetX + vpcGap; // Add gap between routers
      });

      currentX = Math.max(currentX + groupWidth + nodeGap / 2, routerX + nodeGap / 2);
    });

    // Standalone routers
    if (standaloneRouters.length > 0) {
      let standaloneX = currentX;
      standaloneRouters.forEach((router) => {
        const routerWidth = Math.max(nodeGap, getRouterWidth(router.id));
        const rx = standaloneX + routerWidth / 2;
        const ry = startY + layerGap;

        nodes.push({
          id: router.id,
          x: rx,
          y: ry,
          type: 'router',
          data: router,
        });

        // Subnets for standalone router
        const routerSubnets = subnetsByRouter[router.id] || [];
        
        // Group by VPC
        const subnetsByVpc: Record<string, Subnet[]> = {};
        routerSubnets.forEach(subnet => {
          if (!subnetsByVpc[subnet.networkId]) subnetsByVpc[subnet.networkId] = [];
          subnetsByVpc[subnet.networkId].push(subnet);
        });

        // Calculate total width for centering
        let totalSubnetWidth = 0;
        routerSubnets.forEach(subnet => {
          totalSubnetWidth += getSubnetWidth(subnet.id);
        });
        
        // Add VPC gaps
        const vpcCount = Object.keys(subnetsByVpc).length;
        totalSubnetWidth += (vpcCount > 1 ? vpcGap * (vpcCount - 1) : 0);
        
        let subnetX = rx - totalSubnetWidth / 2;
        
        const vpcEntries2 = Object.entries(subnetsByVpc);
        vpcEntries2.forEach(([vpcId, vpcSubnets], vpcIdx) => {
          const vpc = networks.find(n => n.id === vpcId);
          const vpcStartX = subnetX;
          let vpcWidth = 0;

          vpcSubnets.forEach((subnet) => {
            const subnetWidth = getSubnetWidth(subnet.id);
            const sx = subnetX + subnetWidth / 2;
            const sy = startY + layerGap * 2;

            nodes.push({
              id: subnet.id,
              x: sx,
              y: sy,
              type: 'subnet',
              data: subnet,
            });

            edges.push({
              source: { x: rx, y: ry + NODE_SIZES.router.node / 2 },
              target: { x: sx, y: sy - NODE_SIZES.subnet.node / 2 },
              sourceType: 'router',
              status: router.status,
            });

            // LBs
            const subnetLbs = lbsBySubnet[subnet.id] || [];
            subnetLbs.forEach((lb, lbIdx) => {
              const lx = sx + (lbIdx - (subnetLbs.length - 1) / 2) * lbGap;
              const ly = startY + layerGap * 3;

              nodes.push({
                id: lb.id,
                x: lx,
                y: ly,
                type: 'loadBalancer',
                data: lb,
              });

              edges.push({
                source: { x: sx, y: sy + NODE_SIZES.subnet.node / 2 },
                target: { x: lx, y: ly - NODE_SIZES.loadBalancer.node / 2 },
                sourceType: 'subnet',
                status: subnet.status,
              });
            });

            subnetX += subnetWidth;
            vpcWidth += subnetWidth;
          });

          // VPC Group Panel for standalone router
          if (vpc && vpcSubnets.length > 0) {
            const connectedRouterCount = vpcRouterMap[vpc.id]?.size || 0;
            const isMultiRouter = connectedRouterCount > 1;
            
            vpcGroups.push({
              x: vpcStartX,
              y: startY + layerGap * 2 - 60,
              width: vpcWidth,
              height: 130,
              name: vpc.name,
              networkId: vpc.id,
              status: vpc.status,
              isSplit: false,
              splitIndex: undefined,
              splitTotal: isMultiRouter ? connectedRouterCount : undefined,
            });
          }
          
          // Add gap between VPCs
          if (vpcIdx < vpcEntries2.length - 1) {
            subnetX += vpcGap;
          }
        });
        
        // Update standaloneX for next router
        standaloneX += routerWidth + vpcGap;
      });

      currentX = standaloneX;
    }

    // Standalone external networks
    if (standaloneExternalNetworks.length > 0) {
      g.append('line')
        .attr('x1', currentX - nodeGap / 4)
        .attr('y1', startY - 20)
        .attr('x2', currentX - nodeGap / 4)
        .attr('y2', startY + layerGap * 3 + 80)
        .attr('stroke', '#e2e8f0')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,4');

      standaloneExternalNetworks.forEach((extNet, idx) => {
        nodes.push({
          id: extNet.id,
          x: currentX + idx * nodeGap,
          y: startY,
          type: 'externalNetwork',
          data: extNet,
        });
      });
    }

    // Draw deferred router-to-subnet edges (now all routers are positioned)
    deferredRouterEdges.forEach(({ routerId, subnetPos }) => {
      const routerNode = nodes.find(n => n.id === routerId);
      if (routerNode) {
        const routerData = [...networkGroups.flatMap(g => g.routers), ...standaloneRouters].find(r => r.id === routerId);
        edges.push({
          source: { x: routerNode.x, y: routerNode.y + NODE_SIZES.router.node / 2 },
          target: { x: subnetPos.x, y: subnetPos.y - NODE_SIZES.subnet.node / 2 },
          sourceType: 'router',
          status: routerData?.status || 'active',
        });
      }
    });

    // Draw VPC group panels with hover and click events
    vpcGroups.forEach(vpc => {
      const borderColor = vpc.isSplit ? COLORS.vpcBorder.split : COLORS.vpcBorder[vpc.status as keyof typeof COLORS.vpcBorder] || COLORS.vpcBorder.active;
      const bgColor = vpc.isSplit ? COLORS.vpcPanel.split : COLORS.vpcPanel[vpc.status as keyof typeof COLORS.vpcPanel] || COLORS.vpcPanel.active;

      const vpcGroup = g.append('g')
        .attr('cursor', 'pointer')
        .on('mouseenter', function(event) {
          d3.select(this).select('rect')
            .transition()
            .duration(150)
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', 'none');  // 실선으로 변경
          
          setTooltip({
            visible: true,
            x: event.clientX + 12,
            y: event.clientY + 12,
            content: {
              name: vpc.name,
            type: 'VPC',
            status: vpc.status,
            extra: vpc.splitTotal && vpc.splitTotal > 1 ? `Connected to ${vpc.splitTotal} routers` : undefined,
            },
          });
        })
        .on('mousemove', function(event) {
          setTooltip(prev => ({ ...prev, x: event.clientX + 12, y: event.clientY + 12 }));
        })
        .on('mouseleave', function() {
          d3.select(this).select('rect')
            .transition()
            .duration(150)
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '6,4');  // 다시 점선으로
          setTooltip(prev => ({ ...prev, visible: false }));
        })
        .on('click', (event) => {
          event.stopPropagation();
          
          // Get all subnets for this VPC
          const vpcSubnets = subnets.filter(s => s.networkId === vpc.networkId);
          
          // Group subnets by router
          const subnetsByRouterId: Record<string, typeof vpcSubnets> = {};
          const unroutedSubnets: typeof vpcSubnets = [];
          
          vpcSubnets.forEach(subnet => {
            if (subnet.routerId) {
              if (!subnetsByRouterId[subnet.routerId]) subnetsByRouterId[subnet.routerId] = [];
              subnetsByRouterId[subnet.routerId].push(subnet);
            } else {
              unroutedSubnets.push(subnet);
            }
          });
          
          // Build subnet groups with router names
          const vpcSubnetGroups: VpcSubnetGroup[] = [];
          
          // Get all routers (from networkGroups and standaloneRouters)
          const allRouters = [
            ...networkGroups.flatMap(g => g.routers),
            ...standaloneRouters,
          ];
          
          Object.entries(subnetsByRouterId).forEach(([routerId, routerSubnets]) => {
            const router = allRouters.find(r => r.id === routerId);
            vpcSubnetGroups.push({
              routerName: router?.name || routerId,
              subnets: routerSubnets.map(s => ({ name: s.name, cidr: s.cidr, status: s.status })),
            });
          });
          
          // Add unrouted subnets
          if (unroutedSubnets.length > 0) {
            vpcSubnetGroups.push({
              routerName: null,
              subnets: unroutedSubnets.map(s => ({ name: s.name, cidr: s.cidr, status: s.status })),
            });
          }
          
          setPopover({
            data: {
              type: 'vpc',
              name: vpc.name,
              status: vpc.status,
              details: {},
              id: vpc.networkId,
              adminState: 'Up',
              shared: false,
              mtu: 1500,
              vpcSubnetGroups,
            },
            position: { x: event.clientX + 10, y: event.clientY + 10 },
          });
        });

      vpcGroup.append('rect')
        .attr('x', vpc.x - vpcPadding)
        .attr('y', vpc.y)
        .attr('width', vpc.width + vpcPadding * 2)
        .attr('height', vpc.height)
        .attr('rx', 12)
        .attr('fill', bgColor)
        .attr('stroke', borderColor)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '6,4');

      // VPC 라벨
      vpcGroup.append('text')
        .attr('class', 'vpc-label')
        .attr('x', vpc.x - vpcPadding + 12)
        .attr('y', vpc.y + 18)
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .attr('fill', '#374151')
        .text(vpc.name);

      // Multi-Router 뱃지 (2개 이상의 라우터에 연결된 경우)
      if (vpc.splitTotal && vpc.splitTotal > 1) {
        const badgeText = `${vpc.splitTotal} Routers`;
        const badgeWidth = 56;
        const badgeHeight = 18;
        const badgeX = vpc.x + vpc.width - badgeWidth - 8;
        const badgeY = vpc.y + 6;
        
        // 뱃지 배경 (Blue)
        vpcGroup.append('rect')
          .attr('class', 'vpc-sublabel')
          .attr('x', badgeX)
          .attr('y', badgeY)
          .attr('width', badgeWidth)
          .attr('height', badgeHeight)
          .attr('rx', 4)
          .attr('fill', '#3b82f6');
        
        // 뱃지 텍스트
        vpcGroup.append('text')
          .attr('class', 'vpc-sublabel')
          .attr('x', badgeX + badgeWidth / 2)
          .attr('y', badgeY + badgeHeight / 2 + 4)
          .attr('font-size', '10px')
          .attr('font-weight', '600')
          .attr('fill', 'white')
          .attr('text-anchor', 'middle')
          .text(badgeText);
      }
    });

    // Draw edges with step style and source type colors
    const drawStepEdge = (edge: EdgeData) => {
      const { source, target, sourceType, status, animated } = edge;
      const colorSet = EDGE_COLORS[sourceType as keyof typeof EDGE_COLORS] || EDGE_COLORS.router;
      const color = colorSet[status as keyof typeof colorSet] || colorSet.active;
      
      // Calculate middle Y for horizontal line
      const midY = source.y + (target.y - source.y) / 2;
      
      const path = d3.path();
      path.moveTo(source.x, source.y);
      path.lineTo(source.x, midY);
      path.lineTo(target.x, midY);
      path.lineTo(target.x, target.y);

      const edgePath = g.append('path')
        .attr('d', path.toString())
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 1);

      if (animated) {
        edgePath.attr('stroke-dasharray', '5,5');
        
        // Animation - consistent speed (pixels per second)
        const totalLength = (edgePath.node() as SVGPathElement)?.getTotalLength() || 0;
        const pixelsPerSecond = 50; // Consistent animation speed
        const duration = (totalLength / pixelsPerSecond) * 1000;
        
        edgePath
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(duration)
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0)
          .on('end', function repeat() {
            d3.select(this)
              .attr('stroke-dashoffset', totalLength)
              .transition()
              .duration(duration)
              .ease(d3.easeLinear)
              .attr('stroke-dashoffset', 0)
              .on('end', repeat);
          });
      }

      // Arrow marker
      g.append('polygon')
        .attr('points', '-4,-4 4,0 -4,4')
        .attr('fill', color)
        .attr('transform', `translate(${target.x}, ${target.y}) rotate(90)`);
    };

    edges.forEach(drawStepEdge);

    // Draw nodes
    const drawNode = (node: NodePosition) => {
      const { x, y, type, data } = node;
      const size = NODE_SIZES[type as NodeType];
      const colorSet = COLORS[type as keyof typeof COLORS];
      const color = colorSet[data.status as keyof typeof colorSet] || colorSet.active;
      const statusColor = COLORS.status[data.status as keyof typeof COLORS.status] || COLORS.status.active;

      const nodeGroup = g.append('g')
        .attr('transform', `translate(${x}, ${y})`)
        .attr('cursor', 'pointer')
        .on('mouseenter', function(event) {
          d3.select(this).select('circle').transition().duration(150).attr('r', size.node / 2 * 1.08);
          
          const typeLabels: Record<string, string> = {
            externalNetwork: 'External Network',
            router: 'Router',
            subnet: 'Subnet',
            loadBalancer: 'Load Balancer',
          };
          
          setTooltip({
            visible: true,
            x: event.clientX + 12,
            y: event.clientY + 12,
            content: {
              name: data.name,
              type: typeLabels[type] || type,
              status: data.status,
              extra: data.cidr || data.vip || undefined,
            },
          });
        })
        .on('mousemove', function(event) {
          setTooltip(prev => ({ ...prev, x: event.clientX + 12, y: event.clientY + 12 }));
        })
        .on('mouseleave', function() {
          d3.select(this).select('circle').transition().duration(150).attr('r', size.node / 2);
          setTooltip(prev => ({ ...prev, visible: false }));
        })
        .on('click', (event) => {
          event.stopPropagation();
          
          // Generate random ID for demo
          const generateId = () => Math.random().toString(36).substring(2, 9);
          
          let popoverData: PopoverProps['data'] = {
            type,
            name: data.name,
            status: data.status,
            details: {},
            id: generateId(),
            adminState: 'Up',
          };
          
          if (type === 'externalNetwork') {
            // Find routers connected to this external network
            const connectedRouters = routers.filter(r => r.externalNetworkId === data.id);
            
            popoverData = {
              ...popoverData,
              routerList: connectedRouters.map(r => ({
                name: r.name,
                status: r.status,
                externalGateway: 'public',
              })),
            };
          } else if (type === 'router') {
            const connectedSubnets = subnets.filter(s => s.routerId === data.id);
            
            popoverData = {
              ...popoverData,
              snat: true,
              externalGateway: 'public-network',
              subnetList: connectedSubnets.map(s => ({
                name: s.name,
                status: s.status,
                cidr: s.cidr,
              })),
            };
          } else if (type === 'subnet') {
            const connectedLbs = loadBalancers.filter(lb => lb.subnetId === data.id);
            
            // Find connected router
            const connectedRouter = data.routerId 
              ? [...networkGroups.flatMap(g => g.routers), ...standaloneRouters].find(r => r.id === data.routerId)
              : null;
            
            // Generate sample instances based on subnet
            const sampleInstances: InstanceItem[] = [
              { name: `${data.name}-web-01`, status: 'active', ip: data.cidr?.replace('.0/24', '.10') },
              { name: `${data.name}-web-02`, status: 'active', ip: data.cidr?.replace('.0/24', '.11') },
              { name: `${data.name}-api-01`, status: 'active', ip: data.cidr?.replace('.0/24', '.20') },
              { name: `${data.name}-worker-01`, status: 'inactive', ip: data.cidr?.replace('.0/24', '.30') },
              { name: `${data.name}-db-01`, status: 'error', ip: data.cidr?.replace('.0/24', '.50') },
            ];
            
            popoverData = {
              ...popoverData,
              gatewayIp: data.cidr?.replace('/24', '.1') || '10.0.0.1',
              cidr: data.cidr || '10.0.0.0/24',
              // Router list
              routerList: connectedRouter ? [{
                name: connectedRouter.name,
                status: connectedRouter.status,
                externalGateway: 'public-network',
              }] : [],
              // Instance list
              instanceList: sampleInstances,
              // Load Balancer list
              loadBalancerList: connectedLbs.map(lb => ({
                name: lb.name,
                status: lb.status,
                vip: lb.vip,
              })),
            };
          } else if (type === 'loadBalancer') {
            popoverData = {
              ...popoverData,
              vip: data.vip || '10.0.0.100',
              floatingIp: '10.0.0.100',
              listenerList: [
                { name: 'http-listener', protocol: 'HTTP', port: 80, status: 'active' },
                { name: 'https-listener', protocol: 'HTTPS', port: 443, status: 'active' },
                { name: 'api-listener', protocol: 'HTTP', port: 8080, status: 'active' },
                { name: 'grpc-listener', protocol: 'TCP', port: 9090, status: 'inactive' },
                { name: 'metrics-listener', protocol: 'HTTP', port: 9100, status: 'error' },
              ],
              healthMonitor: {
                healthy: 3,
                degraded: 2,
                error: 2,
                pools: [
                  { name: 'pool1', status: 'error' },
                  { name: 'pool2', status: 'error' },
                  { name: 'pool3', status: 'degraded' },
                  { name: 'pool4', status: 'degraded' },
                  { name: 'pool5', status: 'healthy' },
                  { name: 'pool6', status: 'healthy' },
                  { name: 'pool7', status: 'healthy' },
                ],
              },
            };
          }

          setPopover({
            data: popoverData,
            position: { x: event.clientX + 10, y: event.clientY + 10 },
          });
        });

      // Node circle
      nodeGroup.append('circle')
        .attr('r', size.node / 2)
        .attr('fill', color)
        .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))');

      // SVG Icon
      const iconPath = ICONS[type as keyof typeof ICONS];
      if (iconPath) {
        nodeGroup.append('path')
          .attr('d', iconPath)
          .attr('fill', 'none')
          .attr('stroke', 'white')
          .attr('stroke-width', 1.5)
          .attr('stroke-linecap', 'round')
          .attr('stroke-linejoin', 'round')
          .attr('transform', `translate(${-size.icon / 2}, ${-size.icon / 2}) scale(${size.icon / 16})`);
      }

      // Status indicator
      nodeGroup.append('circle')
        .attr('class', 'node-status')
        .attr('cx', size.node / 2 - 6)
        .attr('cy', size.node / 2 - 6)
        .attr('r', INDICATOR_SIZE / 2)
        .attr('fill', statusColor)
        .attr('stroke', 'white')
        .attr('stroke-width', 2);

      // Label
      nodeGroup.append('text')
        .attr('class', 'node-label')
        .attr('y', size.node / 2 + 16)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', '500')
        .attr('fill', '#1f2937')
        .text(data.name);

      // Sublabel (CIDR or VIP)
      if (data.cidr || data.vip) {
        nodeGroup.append('text')
          .attr('class', 'node-sublabel')
          .attr('y', size.node / 2 + 28)
          .attr('text-anchor', 'middle')
          .attr('font-size', '9px')
          .attr('font-family', 'ui-monospace, monospace')
          .attr('fill', '#6b7280')
          .text(data.cidr || data.vip);
      }
    };

    nodes.forEach(drawNode);

    // Initial view fit
    const bounds = g.node()?.getBBox();
    if (bounds) {
      // Ensure minimum bounds for small datasets
      const minWidth = 400;
      const minHeight = 300;
      const effectiveWidth = Math.max(bounds.width + 100, minWidth);
      const effectiveHeight = Math.max(bounds.height + 100, minHeight);
      
      // Limit scale to prevent over-zoom on small datasets (max 0.8)
      const scale = Math.min(width / effectiveWidth, height / effectiveHeight, 0.8);
      const translateX = (width - effectiveWidth * scale) / 2 - bounds.x * scale + 50;
      const translateY = (height - effectiveHeight * scale) / 2 - bounds.y * scale + 50;

      svg.call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(scale));
      
      // Apply semantic zoom for initial scale
      updateSemanticZoom(scale);
      setZoomLevel(scale);
    }

    // Click outside to close popover
    svg.on('click', () => {
      setPopover(null);
    });

    // Setup minimap
    const setupMinimap = () => {
      if (!minimapRef.current || !bounds) return;

      const minimapWidth = 200;
      const minimapHeight = 130;
      const minimapScale = Math.min(minimapWidth / (bounds.width + 100), minimapHeight / (bounds.height + 100));

      const minimapSvg = d3.select(minimapRef.current)
        .attr('width', minimapWidth)
        .attr('height', minimapHeight);

      minimapSvg.selectAll('*').remove();

      // Background
      minimapSvg.append('rect')
        .attr('width', minimapWidth)
        .attr('height', minimapHeight)
        .attr('fill', '#f8fafc')
        .attr('stroke', '#e2e8f0')
        .attr('stroke-width', 1)
        .attr('rx', 4);

      // Minimap content group
      const minimapG = minimapSvg.append('g')
        .attr('transform', `translate(${(minimapWidth - bounds.width * minimapScale) / 2 - bounds.x * minimapScale}, ${(minimapHeight - bounds.height * minimapScale) / 2 - bounds.y * minimapScale}) scale(${minimapScale})`);

      // Draw VPC groups in minimap
      vpcGroups.forEach(vpc => {
        const bgColor = vpc.isSplit ? COLORS.vpcPanel.split : COLORS.vpcPanel[vpc.status as keyof typeof COLORS.vpcPanel] || COLORS.vpcPanel.active;
        minimapG.append('rect')
          .attr('x', vpc.x)
          .attr('y', vpc.y)
          .attr('width', vpc.width)
          .attr('height', vpc.height)
          .attr('rx', 8)
          .attr('fill', bgColor)
          .attr('opacity', 0.8);
      });

      // Draw simplified nodes with larger size
      const nodeSizes: Record<string, number> = {
        externalNetwork: 28,
        router: 24,
        subnet: 20,
        loadBalancer: 16,
      };
      
      nodes.forEach(node => {
        const colorSet = COLORS[node.type as keyof typeof COLORS];
        const color = colorSet[node.data.status as keyof typeof colorSet] || colorSet.active;
        const size = nodeSizes[node.type] || 16;
        minimapG.append('circle')
          .attr('cx', node.x)
          .attr('cy', node.y)
          .attr('r', size)
          .attr('fill', color);
      });

      // Viewport rectangle
      minimapSvg.append('rect')
        .attr('class', 'minimap-viewport')
        .attr('fill', 'rgba(59, 130, 246, 0.1)')
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 1)
        .attr('rx', 2);
    };

    updateMinimap = (transform: d3.ZoomTransform) => {
      if (!minimapRef.current || !bounds) return;

      const minimapWidth = 200;
      const minimapHeight = 130;
      const minimapScale = Math.min(minimapWidth / (bounds.width + 100), minimapHeight / (bounds.height + 100));

      const viewportX = (-transform.x / transform.k) * minimapScale + (minimapWidth - bounds.width * minimapScale) / 2 - bounds.x * minimapScale;
      const viewportY = (-transform.y / transform.k) * minimapScale + (minimapHeight - bounds.height * minimapScale) / 2 - bounds.y * minimapScale;
      const viewportW = (width / transform.k) * minimapScale;
      const viewportH = (height / transform.k) * minimapScale;

      d3.select(minimapRef.current).select('.minimap-viewport')
        .attr('x', viewportX)
        .attr('y', viewportY)
        .attr('width', viewportW)
        .attr('height', viewportH);
    };

    setupMinimap();

  }, [filteredData]);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />

      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[200px]' : 'left-0'
        }`}
      >
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          {/* Tab Bar */}
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            showAddButton={true}
            showWindowControls={true}
          />

          {/* Top Bar */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Proj-1', href: '/project' },
                  { label: 'Topology' },
                ]}
              />
            }
            actions={
              <TopBarAction
                icon={<IconBell size={16} stroke={1.5} />}
                aria-label="Notifications"
                badge={true}
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          {/* Main Content */}
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)] flex flex-col">
          <VStack gap={3} className="flex-1 min-h-0">
            {/* Page Header */}
            <div className="flex justify-between items-center h-8 w-full">
              <h1 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)]">
                Topology
              </h1>
            </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap bg-white rounded-lg border border-slate-200 p-3">
            {/* Search */}
            <div className="w-[240px]">
              <SearchInput
                placeholder="Search subnets, VPCs, CIDRs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm('')}
                size="sm"
              />
            </div>

            {/* Router filter */}
            <Select
              value={filterRouter}
              onChange={setFilterRouter}
              placeholder={`All Routers (${routers.length})`}
              options={[
                { value: 'all', label: `All Routers (${routers.length})` },
                ...routers.map(r => ({ value: r.id, label: r.name }))
              ]}
              className="w-[160px]"
            />

            {/* VPC filter */}
            <Select
              value={filterVpc}
              onChange={setFilterVpc}
              placeholder={`All VPCs (${networks.length})`}
              options={[
                { value: 'all', label: `All VPCs (${networks.length})` },
                ...networks.map(n => ({ value: n.id, label: n.name }))
              ]}
              className="w-[160px]"
            />

            {/* Status filter */}
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder="All Status"
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'error', label: 'Error' },
              ]}
              className="w-[120px]"
            />

            {/* Reset button */}
            {(searchTerm || filterRouter !== 'all' || filterVpc !== 'all' || filterStatus !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                leftIcon={<IconRefresh size={14} />}
              >
                Reset
              </Button>
            )}
          </div>

          {/* Empty state when no results */}
          {filteredData.subnets.length === 0 ? (
            <div className="flex-1 flex items-center justify-center bg-white border border-slate-200 rounded-lg">
              <div className="text-center py-12">
                <IconSearch size={48} className="mx-auto mb-3 text-slate-300" />
                <p className="text-slate-500">No resources match your filters</p>
                <button
                  onClick={resetFilters}
                  className="mt-2 text-teal-600 hover:underline text-sm"
                >
                  Clear filters
                </button>
              </div>
            </div>
          ) : (
          <div 
            ref={containerRef}
            className="flex-1 bg-white border border-[var(--color-border-default)] rounded-lg overflow-hidden relative"
            style={{ minHeight: '500px' }}
          >
            <svg ref={svgRef} className="w-full h-full" />
            
            {/* Stats & Zoom Controls */}
            <div className="absolute top-4 left-4 flex items-center gap-3 bg-white/90 px-3 py-2 rounded-lg border border-slate-200">
              <span className="text-[length:var(--font-size-12)] text-[var(--color-text-subtle)]">
                {stats.filteredSubnets === stats.totalSubnets 
                  ? `${stats.totalSubnets} subnets` 
                  : `${stats.filteredSubnets} of ${stats.totalSubnets} subnets`
                } across {filteredData.networks.length} VPCs • 
                <span className="text-green-600">{stats.activeSubnets} active</span>
                {stats.errorSubnets > 0 && <span className="text-red-600"> • {stats.errorSubnets} error</span>}
              </span>
              <div className="h-4 w-px bg-[var(--color-border-default)]" />
              <div className="flex items-center gap-2 px-2 py-1 bg-[var(--color-surface-muted)] rounded-md">
                <span className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)]">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <span className={`text-[length:var(--font-size-12)] px-1.5 py-0.5 rounded ${
                  zoomLevel >= 1.0 
                    ? 'bg-green-100 text-green-700' 
                    : zoomLevel >= 0.6 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]'
                }`}>
                  {zoomLevel >= 1.0 ? 'Full' : zoomLevel >= 0.6 ? 'Medium' : 'Compact'}
                </span>
              </div>
            </div>
            
            {/* Minimap */}
            <div className="absolute bottom-4 right-4 shadow-md rounded-md overflow-hidden">
              <svg ref={minimapRef} />
            </div>
            
            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex items-center gap-6 bg-white/90 px-4 py-2 rounded-lg border border-slate-200">
              <span className="text-sm font-medium text-slate-600">Legend:</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.externalNetwork.active }} />
                <span className="text-xs text-slate-600">External Network</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.router.active }} />
                <span className="text-xs text-slate-600">Router</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.subnet.active }} />
                <span className="text-xs text-slate-600">Subnet</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.loadBalancer.active }} />
                <span className="text-xs text-slate-600">Load Balancer</span>
              </div>
            </div>
          </div>
          )}
          </VStack>
        </div>
        </div>
      </main>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 bg-slate-800 text-white px-3 py-2 rounded-lg text-xs shadow-lg pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="font-semibold">{tooltip.content.name}</div>
          <div className="text-slate-300">{tooltip.content.type}</div>
          <div className="flex items-center gap-1 mt-1">
            <span className={`w-1.5 h-1.5 rounded-full ${
              tooltip.content.status === 'active' ? 'bg-green-400' : 
              tooltip.content.status === 'inactive' ? 'bg-slate-400' : 'bg-red-400'
            }`} />
            <span className="text-slate-300">
              {tooltip.content.status === 'active' ? '활성' : tooltip.content.status === 'inactive' ? '비활성' : '오류'}
            </span>
          </div>
          {tooltip.content.extra && (
            <div className="text-slate-400 mt-1 font-mono">{tooltip.content.extra}</div>
          )}
        </div>
      )}

      {/* Popover */}
      {popover && (
        <Popover
          data={popover.data}
          position={popover.position}
          onClose={closePopover}
        />
      )}
    </div>
  );
}
