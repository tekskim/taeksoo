import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type NodeProps,
  Handle,
  Position,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Sidebar } from '@/components/Sidebar';
import { TabBar } from '@/components/TabBar';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import { VStack, Tooltip } from '@/design-system';
import {
  IconWorld,
  IconNetwork,
  IconLayoutGrid,
  IconScale,
  IconRouter,
  IconExternalLink,
  IconX,
} from '@tabler/icons-react';

/* ----------------------------------------
   Topology Theme Configuration (한 곳에서 관리)
   ---------------------------------------- */

// 컬러 설정 (인디케이터 색상 red/green 제외)
const TOPOLOGY_COLORS = {
  externalNetwork: {
    bg: 'bg-slate-500',
    bgInactive: 'bg-slate-400',
    hex: '#64748b',
  },
  router: {
    bg: 'bg-orange-500',
    bgInactive: 'bg-orange-300',
    hex: '#f97316',
  },
  subnet: {
    bg: 'bg-blue-500',
    bgInactive: 'bg-blue-300',
    hex: '#3b82f6',
    textAccent: 'text-blue-600',
  },
  loadBalancer: {
    bg: 'bg-violet-500',
    bgInactive: 'bg-violet-300',
    hex: '#8b5cf6',
  },
  error: {
    bg: 'bg-red-500',
    hex: '#ef4444',
  },
  inactive: {
    hex: '#cbd5e1',
  },
} as const;

// 노드 크기 설정
const TOPOLOGY_SIZES = {
  externalNetwork: { node: 'w-16 h-16', icon: 32, indicator: 'w-4 h-4' },
  router: { node: 'w-14 h-14', icon: 28, indicator: 'w-4 h-4' },
  subnet: { node: 'w-12 h-12', icon: 24, indicator: 'w-3.5 h-3.5' },
  loadBalancer: { node: 'w-10 h-10', icon: 20, indicator: 'w-3.5 h-3.5' },
} as const;

// 스타일 설정
const TOPOLOGY_STYLES = {
  node: {
    shape: 'rounded-full',           // rounded-full | rounded-2xl | rounded-xl | rounded-lg
    shadow: 'var(--shadow-md)',      // var(--shadow-sm) | var(--shadow-md) | var(--shadow-lg)
    hoverScale: 'hover:scale-105',
    transition: 'transition-transform',
  },
  indicator: {
    position: 'absolute -bottom-1 -right-1',
    border: 'border-2 border-white',
    shape: 'rounded-full',
  },
  font: {
    label: 'text-[length:var(--font-size-11)]',
    sublabel: 'text-[length:var(--font-size-10)]',
  },
  legend: {
    dot: 'w-3 h-3 rounded-full',
  },
} as const;

// 상태에 따른 배경색 헬퍼
const getNodeBgColor = (type: keyof typeof TOPOLOGY_COLORS, status: string) => {
  if (status === 'error') return TOPOLOGY_COLORS.error.bg;
  if (status === 'inactive') return TOPOLOGY_COLORS[type]?.bgInactive || TOPOLOGY_COLORS[type]?.bg;
  return TOPOLOGY_COLORS[type]?.bg;
};

// 상태에 따른 엣지 색상 헬퍼
const getEdgeColor = (type: keyof typeof TOPOLOGY_COLORS, status: string) => {
  if (status === 'error') return TOPOLOGY_COLORS.error.hex;
  if (status === 'inactive') return TOPOLOGY_COLORS.inactive.hex;
  return TOPOLOGY_COLORS[type]?.hex;
};

/* ----------------------------------------
   Custom Node Components
   ---------------------------------------- */

// External Network Node - 인터넷/외부 연결
function ExternalNetworkNode({ data }: NodeProps) {
  const status = (data.status as string) || 'active';
  const bgColor = getNodeBgColor('externalNetwork', status);
  const statusColor = status === 'active' ? 'bg-green-500' : status === 'inactive' ? 'bg-slate-400' : 'bg-red-500';
  const statusText = status === 'active' ? '활성' : status === 'inactive' ? '비활성' : '오류';
  
  const tooltipContent = (
    <div className="text-left">
      <div className="font-semibold">{data.label}</div>
      <div className="text-[length:var(--font-size-10)] opacity-80">External Network</div>
      <div className="text-[length:var(--font-size-10)] mt-1">상태: {statusText}</div>
    </div>
  );
  
  return (
    <Tooltip content={tooltipContent} position="top" delay={300}>
      <div className="flex flex-col items-center w-[100px] cursor-pointer">
        <div 
          className={`${TOPOLOGY_SIZES.externalNetwork.node} ${bgColor} ${TOPOLOGY_STYLES.node.shape} flex items-center justify-center text-white relative ${TOPOLOGY_STYLES.node.hoverScale} ${TOPOLOGY_STYLES.node.transition}`} 
          style={{ boxShadow: TOPOLOGY_STYLES.node.shadow }}
        >
          <IconWorld size={TOPOLOGY_SIZES.externalNetwork.icon} strokeWidth={1.5} />
          <div className={`${TOPOLOGY_STYLES.indicator.position} ${TOPOLOGY_SIZES.externalNetwork.indicator} ${TOPOLOGY_STYLES.indicator.shape} ${TOPOLOGY_STYLES.indicator.border} ${statusColor}`} />
        </div>
        <div className={`mt-2 ${TOPOLOGY_STYLES.font.label} font-medium text-[var(--color-text-default)] text-center truncate w-full`}>{data.label}</div>
        <Handle type="source" position={Position.Bottom} className="!opacity-0" />
      </div>
    </Tooltip>
  );
}

// Router Node - 네트워크 라우팅
function RouterNode({ data }: NodeProps) {
  const status = (data.status as string) || 'active';
  const bgColor = getNodeBgColor('router', status);
  const statusColor = data.status === 'active' ? 'bg-green-500' : data.status === 'inactive' ? 'bg-slate-400' : 'bg-red-500';
  const statusText = data.status === 'active' ? '활성' : data.status === 'inactive' ? '비활성' : '오류';
  
  const tooltipContent = (
    <div className="text-left">
      <div className="font-semibold">{data.label}</div>
      <div className="text-[length:var(--font-size-10)] opacity-80">Router</div>
      <div className="text-[length:var(--font-size-10)] mt-1">상태: {statusText}</div>
      {data.gateway && <div className="text-[length:var(--font-size-10)]">게이트웨이: {data.gateway}</div>}
    </div>
  );
  
  return (
    <Tooltip content={tooltipContent} position="top" delay={300}>
      <div className="flex flex-col items-center w-[100px] cursor-pointer">
        <Handle type="target" position={Position.Top} className="!opacity-0" />
        <div 
          className={`${TOPOLOGY_SIZES.router.node} ${bgColor} ${TOPOLOGY_STYLES.node.shape} flex items-center justify-center text-white relative ${TOPOLOGY_STYLES.node.hoverScale} ${TOPOLOGY_STYLES.node.transition}`} 
          style={{ boxShadow: TOPOLOGY_STYLES.node.shadow }}
        >
          <IconRouter size={TOPOLOGY_SIZES.router.icon} strokeWidth={1.5} />
          <div className={`${TOPOLOGY_STYLES.indicator.position} ${TOPOLOGY_SIZES.router.indicator} ${TOPOLOGY_STYLES.indicator.shape} ${TOPOLOGY_STYLES.indicator.border} ${statusColor}`} />
        </div>
        <div className={`mt-2 ${TOPOLOGY_STYLES.font.label} font-medium text-[var(--color-text-default)] text-center truncate w-full`}>{data.label}</div>
        <Handle type="source" position={Position.Bottom} className="!opacity-0" />
      </div>
    </Tooltip>
  );
}

// Network (VPC) Node - 클라우드 네트워크
// Individual Subnet Node - 네트워크 세그먼트
function SubnetNode({ data }: NodeProps) {
  const status = (data.status as string) || 'active';
  const bgColor = getNodeBgColor('subnet', status);
  const statusColor = data.status === 'active' ? 'bg-green-500' : data.status === 'inactive' ? 'bg-slate-400' : 'bg-red-500';
  const statusText = data.status === 'active' ? '활성' : data.status === 'inactive' ? '비활성' : '오류';
  
  const tooltipContent = (
    <div className="text-left">
      <div className="font-semibold">{data.label}</div>
      <div className="text-[length:var(--font-size-10)] opacity-80">Subnet</div>
      <div className="text-[length:var(--font-size-10)] mt-1">CIDR: {data.cidr}</div>
      {data.networkName && <div className="text-[length:var(--font-size-10)]">VPC: {data.networkName}</div>}
      <div className="text-[length:var(--font-size-10)]">상태: {statusText}</div>
    </div>
  );
  
  return (
    <Tooltip content={tooltipContent} position="top" delay={300}>
      <div className="flex flex-col items-center w-[120px] cursor-pointer">
        <Handle type="target" position={Position.Top} className="!opacity-0" />
        <div 
          className={`${TOPOLOGY_SIZES.subnet.node} ${bgColor} ${TOPOLOGY_STYLES.node.shape} flex items-center justify-center text-white relative ${TOPOLOGY_STYLES.node.hoverScale} ${TOPOLOGY_STYLES.node.transition}`} 
          style={{ boxShadow: TOPOLOGY_STYLES.node.shadow }}
        >
          <IconLayoutGrid size={TOPOLOGY_SIZES.subnet.icon} strokeWidth={1.5} />
          <div className={`${TOPOLOGY_STYLES.indicator.position} ${TOPOLOGY_SIZES.subnet.indicator} ${TOPOLOGY_STYLES.indicator.shape} ${TOPOLOGY_STYLES.indicator.border} ${statusColor}`} />
        </div>
        <div className="mt-1.5 text-center w-full">
          <div className={`${TOPOLOGY_STYLES.font.sublabel} font-medium text-[var(--color-text-default)] truncate`}>{data.label}</div>
          <div className={`${TOPOLOGY_STYLES.font.sublabel} text-[var(--color-text-subtle)] font-mono truncate`}>{data.cidr}</div>
        </div>
        <Handle type="source" position={Position.Bottom} className="!opacity-0" />
      </div>
    </Tooltip>
  );
}

// Subnet Group Node (레거시 - 필요시 사용)
function SubnetGroupNode({ data }: NodeProps) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 min-w-[180px]">
      <Handle type="target" position={Position.Top} className="!opacity-0" />
      <div className="text-[length:var(--font-size-10)] font-medium text-slate-500 mb-2 uppercase tracking-wide">Subnets</div>
      <div className="flex flex-col gap-2">
        {data.subnets?.map((subnet: any) => (
          <div key={subnet.id} className="flex items-center gap-2">
            <div className={`w-7 h-7 ${getNodeBgColor('subnet', subnet.status)} rounded-full flex items-center justify-center text-white`}>
              <IconLayoutGrid size={14} strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-[length:var(--font-size-10)] font-medium text-slate-700">{subnet.name}</div>
              <div className="text-[length:var(--font-size-10)] text-slate-500 font-mono">{subnet.cidr}</div>
            </div>
          </div>
        ))}
      </div>
      <Handle type="source" position={Position.Bottom} className="!opacity-0" />
    </div>
  );
}

// VPC Group Panel Node - VPC별 서브넷 그룹핑 배경 패널
function VpcGroupNode({ data }: NodeProps) {
  const status = (data.status as string) || 'active';
  const isPartial = data.isPartial as boolean;
  
  // 분할된 VPC는 다른 스타일 적용
  const borderColor = status === 'active' 
    ? (isPartial ? 'border-blue-300' : 'border-emerald-300')
    : status === 'inactive' ? 'border-slate-300' : 'border-red-300';
  const bgColor = status === 'active' 
    ? (isPartial ? 'bg-blue-50/50' : 'bg-emerald-50/50')
    : status === 'inactive' ? 'bg-slate-50/50' : 'bg-red-50/50';
  const textColor = status === 'active' 
    ? (isPartial ? 'text-blue-700' : 'text-emerald-700')
    : status === 'inactive' ? 'text-slate-500' : 'text-red-700';
  
  const vpcName = (data.vpcName as string) || data.label;
  
  const tooltipContent = (
    <div className="text-left">
      <div className="font-semibold">{vpcName}</div>
      <div className="text-[10px] opacity-80">Network (VPC)</div>
      {isPartial && (
        <div className="text-[10px] text-blue-600 mt-1">
          이 VPC는 {data.totalParts}개 라우터에 분산됨 ({data.partIndex}/{data.totalParts})
        </div>
      )}
      <div className="text-[10px] mt-1">이 그룹의 서브넷: {data.subnetCount}개</div>
    </div>
  );
  
  return (
    <Tooltip content={tooltipContent} position="top" delay={300}>
      <div 
        className={`${bgColor} ${borderColor} border-2 border-dashed rounded-xl cursor-pointer hover:border-solid transition-all`}
        style={{ 
          width: data.width || 200, 
          height: data.height || 120,
          padding: '10px 12px',
        }}
      >
        <div className={`text-[10px] font-semibold ${textColor} flex items-center gap-1 whitespace-nowrap`}>
          <IconNetwork size={12} className="flex-shrink-0" />
          <span className="truncate">{data.label}</span>
          {isPartial && (
            <span className="flex-shrink-0 ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-[8px]">
              Split
            </span>
          )}
        </div>
      </div>
    </Tooltip>
  );
}

// Load Balancer Node - 트래픽 분산
function LoadBalancerNode({ data }: NodeProps) {
  const status = (data.status as string) || 'active';
  const bgColor = getNodeBgColor('loadBalancer', status);
  const statusColor = status === 'active' ? 'bg-green-500' : status === 'inactive' ? 'bg-slate-400' : 'bg-red-500';
  const statusText = status === 'active' ? '활성' : status === 'inactive' ? '비활성' : '오류';
  
  const tooltipContent = (
    <div className="text-left">
      <div className="font-semibold">{data.label}</div>
      <div className="text-[length:var(--font-size-10)] opacity-80">Load Balancer</div>
      <div className="text-[length:var(--font-size-10)] mt-1">VIP: {data.vip}</div>
      <div className="text-[length:var(--font-size-10)]">상태: {statusText}</div>
    </div>
  );
  
  return (
    <Tooltip content={tooltipContent} position="top" delay={300}>
      <div className="flex flex-col items-center w-[80px] cursor-pointer">
        <Handle type="target" position={Position.Top} className="!opacity-0" />
        <div 
          className={`${TOPOLOGY_SIZES.loadBalancer.node} ${bgColor} ${TOPOLOGY_STYLES.node.shape} flex items-center justify-center text-white relative ${TOPOLOGY_STYLES.node.hoverScale} ${TOPOLOGY_STYLES.node.transition}`} 
          style={{ boxShadow: TOPOLOGY_STYLES.node.shadow }}
        >
          <IconScale size={TOPOLOGY_SIZES.loadBalancer.icon} strokeWidth={1.5} />
          <div className={`${TOPOLOGY_STYLES.indicator.position} ${TOPOLOGY_SIZES.loadBalancer.indicator} ${TOPOLOGY_STYLES.indicator.shape} ${TOPOLOGY_STYLES.indicator.border} ${statusColor}`} />
        </div>
        <div className="mt-1.5 text-center w-full">
          <div className={`${TOPOLOGY_STYLES.font.sublabel} font-medium text-[var(--color-text-default)] truncate`}>{data.label}</div>
          <div className={`${TOPOLOGY_STYLES.font.sublabel} text-[var(--color-text-subtle)] font-mono truncate`}>{data.vip}</div>
        </div>
      </div>
    </Tooltip>
  );
}

// Divider Node (그룹 구분선)
function DividerNode({ data }: NodeProps) {
  return (
    <div 
      className="flex flex-col items-center"
      style={{ height: data.height || 400 }}
    >
      <div className="w-px h-full bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
    </div>
  );
}

// Node types registration (junction 제거 - smoothstep으로 직접 연결)
const nodeTypes = {
  externalNetwork: ExternalNetworkNode,
  router: RouterNode,
  subnet: SubnetNode,
  subnetGroup: SubnetGroupNode,
  vpcGroup: VpcGroupNode,
  loadBalancer: LoadBalancerNode,
  divider: DividerNode,
};

/* ----------------------------------------
   Generate Nodes and Edges
   ---------------------------------------- */

function generateTopology() {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Layout constants
  const startX = 50;
  const groupGap = 100;       // 외부 네트워크 그룹 간 간격
  const minRouterWidth = 150; // 최소 라우터 너비 (서브넷 없을 때)
  const lbSpacing = 100;      // LB 간 간격
  const minSubnetWidth = 180; // 최소 서브넷 너비 (LB 없거나 1개일 때) - VPC 그룹 중첩 방지
  
  const layerY = {
    external: 0,
    router: 180,             // 외부 네트워크와 충분한 간격 (T자 연결)
    subnet: 360,
    loadBalancer: 530,
  };

  // ========== 데이터 정의 ==========
  
  // External Networks with their routers
  const networkGroups = [
    { 
      extNet: { id: 'ext-net-1', name: 'public-network-kr' },
      routers: [
        { id: 'router-1', name: 'prod-router', status: 'active' },
        { id: 'router-2', name: 'staging-router', status: 'active' },
      ]
    },
    { 
      extNet: { id: 'ext-net-2', name: 'public-network-us' },
      routers: [
        { id: 'router-3', name: 'dev-router', status: 'active' },
        { id: 'router-4', name: 'qa-router', status: 'inactive' },
        { id: 'router-error', name: 'error-router', status: 'error' },
      ]
    },
    { 
      extNet: { id: 'ext-net-3', name: 'public-network-eu' },
      routers: [
        { id: 'router-5', name: 'dmz-router', status: 'active' },
      ]
    },
  ];

  const standaloneExternalNetworks = [
    { id: 'ext-net-orphan', name: 'unused-external', status: 'inactive' },
    { id: 'ext-net-error', name: 'error-external', status: 'error' },
  ];

  const standaloneRouters = [
    { id: 'router-orphan-1', name: 'orphan-router', status: 'inactive' },
    { id: 'router-internal', name: 'internal-router', status: 'active' },
    { id: 'router-error-standalone', name: 'failed-router', status: 'error' },
  ];

  const networks = [
    { id: 'net-1', name: 'production-vpc', status: 'active' },
    { id: 'net-2', name: 'staging-vpc', status: 'active' },
    { id: 'net-3', name: 'dev-vpc', status: 'active' },
    { id: 'net-4', name: 'qa-vpc', status: 'inactive' },
    { id: 'net-5', name: 'dmz-vpc', status: 'active' },
    { id: 'net-internal', name: 'internal-only-vpc', status: 'active' },
  ];

  const subnets = [
    { id: 'sub-1-1', name: 'web-subnet', cidr: '10.0.1.0/24', status: 'active', networkId: 'net-1', routerId: 'router-1' },
    { id: 'sub-1-2', name: 'app-subnet', cidr: '10.0.2.0/24', status: 'active', networkId: 'net-1', routerId: 'router-1' },
    { id: 'sub-1-3', name: 'db-subnet', cidr: '10.0.3.0/24', status: 'active', networkId: 'net-1', routerId: 'router-1' },
    { id: 'sub-shared-1', name: 'shared-services', cidr: '10.100.1.0/24', status: 'active', networkId: 'net-internal', routerId: 'router-1' },
    { id: 'sub-2-1', name: 'staging-web', cidr: '10.1.1.0/24', status: 'active', networkId: 'net-2', routerId: 'router-2' },
    { id: 'sub-2-2', name: 'staging-db', cidr: '10.1.2.0/24', status: 'active', networkId: 'net-2', routerId: 'router-2' },
    { id: 'sub-3-1', name: 'dev-subnet', cidr: '10.2.1.0/24', status: 'active', networkId: 'net-3', routerId: 'router-3' },
    { id: 'sub-4-1', name: 'qa-web', cidr: '10.3.1.0/24', status: 'inactive', networkId: 'net-4', routerId: 'router-4' },
    { id: 'sub-4-2', name: 'qa-api', cidr: '10.3.2.0/24', status: 'inactive', networkId: 'net-4', routerId: 'router-4' },
    { id: 'sub-5-1', name: 'public-subnet', cidr: '172.16.1.0/24', status: 'active', networkId: 'net-5', routerId: 'router-5' },
    { id: 'sub-5-2', name: 'bastion-subnet', cidr: '172.16.2.0/24', status: 'active', networkId: 'net-5', routerId: 'router-5' },
    { id: 'sub-int-1', name: 'backend-subnet', cidr: '192.168.1.0/24', status: 'active', networkId: 'net-internal', routerId: 'router-internal' },
    { id: 'sub-int-2', name: 'database-subnet', cidr: '192.168.2.0/24', status: 'active', networkId: 'net-internal', routerId: 'router-internal' },
  ];

  const isolatedNetworks = [
    { id: 'net-isolated-1', name: 'isolated-vpc', status: 'active' },
    { id: 'net-orphan', name: 'orphan-network', status: 'inactive' },
    { id: 'net-error', name: 'error-network', status: 'error' },
  ];

  const isolatedSubnets = [
    { id: 'sub-iso-1', name: 'isolated-subnet', cidr: '10.99.1.0/24', status: 'active', networkId: 'net-isolated-1', routerId: null },
    { id: 'sub-orphan-1', name: 'unused-subnet', cidr: '10.100.1.0/24', status: 'inactive', networkId: 'net-orphan', routerId: null },
    { id: 'sub-error-1', name: 'failed-subnet', cidr: '10.200.1.0/24', status: 'error', networkId: 'net-error', routerId: null },
  ];

  const loadBalancers = [
    { id: 'lb-1', name: 'web-frontend-lb', status: 'active', subnetId: 'sub-1-1', vip: '10.0.1.100' },
    { id: 'lb-2', name: 'api-gateway-lb', status: 'active', subnetId: 'sub-1-1', vip: '10.0.1.101' },
    { id: 'lb-3', name: 'admin-portal-lb', status: 'active', subnetId: 'sub-1-1', vip: '10.0.1.102' },
    { id: 'lb-4', name: 'internal-api-lb', status: 'active', subnetId: 'sub-1-2', vip: '10.0.2.100' },
    { id: 'lb-5', name: 'grpc-lb', status: 'active', subnetId: 'sub-1-2', vip: '10.0.2.101' },
    { id: 'lb-6', name: 'staging-lb', status: 'active', subnetId: 'sub-2-1', vip: '10.1.1.100' },
    { id: 'lb-7', name: 'public-lb', status: 'active', subnetId: 'sub-5-1', vip: '172.16.1.100' },
    { id: 'lb-8', name: 'backup-lb', status: 'error', subnetId: 'sub-5-1', vip: '172.16.1.101' },
  ];

  // ========== 계층적 너비 계산 ==========
  
  // 1. LB → 서브넷별 그룹화
  const lbsBySubnet: Record<string, typeof loadBalancers> = {};
  loadBalancers.forEach((lb) => {
    if (!lbsBySubnet[lb.subnetId]) lbsBySubnet[lb.subnetId] = [];
    lbsBySubnet[lb.subnetId].push(lb);
  });

  // 2. 서브넷 → 라우터별 그룹화
  const subnetsByRouter: Record<string, typeof subnets> = {};
  subnets.forEach((subnet) => {
    if (subnet.routerId) {
      if (!subnetsByRouter[subnet.routerId]) subnetsByRouter[subnet.routerId] = [];
      subnetsByRouter[subnet.routerId].push(subnet);
    }
  });

  // 3. 서브넷 너비 계산 함수 (LB 개수 기반)
  const getSubnetWidth = (subnetId: string): number => {
    const lbCount = lbsBySubnet[subnetId]?.length || 0;
    if (lbCount <= 1) return minSubnetWidth;
    return (lbCount - 1) * lbSpacing + 80;
  };

  // 4. 라우터 너비 계산 함수 (서브넷들의 총 너비)
  const getRouterWidth = (routerId: string): number => {
    const routerSubnets = subnetsByRouter[routerId] || [];
    if (routerSubnets.length === 0) return minRouterWidth;
    return routerSubnets.reduce((sum, s) => sum + getSubnetWidth(s.id), 0);
  };

  // ========== 위치 저장소 ==========
  const routerPositions: Record<string, { x: number; centerX: number }> = {};
  const subnetPositions: Record<string, number> = {};

  // ========== 노드 생성 (계층적 위치 계산) ==========
  let currentX = startX;

  // 외부 네트워크 그룹별 처리
  networkGroups.forEach((group) => {
    // 이 그룹 라우터들의 너비 계산
    const routerWidths = group.routers.map(r => getRouterWidth(r.id));
    const totalGroupWidth = routerWidths.reduce((sum, w) => sum + w, 0);

    // 먼저 라우터들의 중심 위치 계산
    const routerCenters: number[] = [];
    let tempX = currentX;
    routerWidths.forEach((width) => {
      routerCenters.push(tempX + width / 2);
      tempX += width;
    });

    // 외부 네트워크 위치 = 첫 번째 라우터 중심과 마지막 라우터 중심의 평균
    const firstRouterCenter = routerCenters[0];
    const lastRouterCenter = routerCenters[routerCenters.length - 1];
    const extNetCenterX = (firstRouterCenter + lastRouterCenter) / 2;
    
    nodes.push({
      id: group.extNet.id,
      type: 'externalNetwork',
      position: { x: extNetCenterX - 50, y: layerY.external },
      data: { label: group.extNet.name },
    });

    // 라우터들 위치 계산 및 노드 생성
    let routerCurrentX = currentX;
    group.routers.forEach((router, idx) => {
      const routerWidth = routerWidths[idx];
      const routerCenterX = routerCenters[idx];
      
      routerPositions[router.id] = { x: routerCurrentX, centerX: routerCenterX };

      nodes.push({
        id: router.id,
        type: 'router',
        position: { x: routerCenterX - 50, y: layerY.router },
        data: { label: router.name, status: router.status },
      });

      // Edge: External Network → Router
      edges.push({
        id: `${group.extNet.id}-${router.id}`,
        source: group.extNet.id,
        target: router.id,
        type: 'smoothstep',
        pathOptions: { borderRadius: 0, offset: 40 },
        animated: router.status === 'active',
        style: { stroke: getEdgeColor('router', router.status), strokeWidth: 1 },
        markerEnd: { type: MarkerType.ArrowClosed, color: getEdgeColor('router', router.status) },
      });

      routerCurrentX += routerWidth;
    });

    currentX += totalGroupWidth;
    
    // 그룹 사이에 디바이더 추가 (마지막 그룹이 아닌 경우)
    const groupIndex = networkGroups.indexOf(group);
    if (groupIndex < networkGroups.length - 1) {
      nodes.push({
        id: `divider-${groupIndex}`,
        type: 'divider',
        position: { x: currentX + groupGap / 2 - 1, y: layerY.external - 20 },
        data: { height: layerY.loadBalancer - layerY.external + 120 },
        selectable: false,
        draggable: false,
      });
    }
    
    currentX += groupGap;
  });

  // Standalone 라우터들과 독립 외부 네트워크 사이에도 디바이더 추가
  const hasStandaloneRouters = standaloneRouters.length > 0;
  const hasStandaloneExtNets = standaloneExternalNetworks.length > 0;
  
  if (networkGroups.length > 0 && (hasStandaloneRouters || hasStandaloneExtNets)) {
    nodes.push({
      id: 'divider-standalone',
      type: 'divider',
      position: { x: currentX - groupGap / 2, y: layerY.external - 20 },
      data: { height: layerY.loadBalancer - layerY.external + 120 },
      selectable: false,
      draggable: false,
    });
  }

  // Standalone 라우터들 (외부 네트워크에 연결되지 않은 라우터)
  if (standaloneRouters.length > 0) {
    standaloneRouters.forEach((router) => {
      const routerWidth = getRouterWidth(router.id);
      const routerCenterX = currentX + routerWidth / 2;
      
      routerPositions[router.id] = { x: currentX, centerX: routerCenterX };

      nodes.push({
        id: router.id,
        type: 'router',
        position: { x: routerCenterX - 50, y: layerY.router },
        data: { label: router.name, status: router.status },
      });

      currentX += routerWidth;
    });
    
    // Standalone 라우터 그룹 뒤에 디바이더 추가
    if (standaloneExternalNetworks.length > 0 || isolatedSubnets.length > 0) {
      nodes.push({
        id: 'divider-after-standalone-routers',
        type: 'divider',
        position: { x: currentX + groupGap / 2 - 1, y: layerY.external - 20 },
        data: { height: layerY.loadBalancer - layerY.external + 120 },
        selectable: false,
        draggable: false,
      });
    }
    currentX += groupGap;
  }

  // Standalone 외부 네트워크들 (라우터에 연결되지 않은 외부 네트워크)
  if (standaloneExternalNetworks.length > 0) {
    standaloneExternalNetworks.forEach((extNet) => {
      nodes.push({
        id: extNet.id,
        type: 'externalNetwork',
        position: { x: currentX, y: layerY.external },
        data: { label: extNet.name, status: extNet.status },
      });
      currentX += minRouterWidth;
    });
    
    // Standalone 외부 네트워크 그룹 뒤에 디바이더 추가
    if (isolatedSubnets.length > 0) {
      nodes.push({
        id: 'divider-after-standalone-extnets',
        type: 'divider',
        position: { x: currentX + groupGap / 2 - 1, y: layerY.external - 20 },
        data: { height: layerY.loadBalancer - layerY.external + 120 },
        selectable: false,
        draggable: false,
      });
    }
    currentX += groupGap;
  }

  // ========== 서브넷 노드 생성 ==========
  // 라우터+VPC별 서브넷 위치 추적을 위한 맵 (라우터별로 VPC 그룹 분리)
  const routerVpcBounds: Record<string, { 
    routerId: string;
    vpcId: string;
    minX: number; 
    maxX: number; 
    subnets: typeof subnets;
  }> = {};

  // VPC가 몇 개의 라우터에 걸쳐 있는지 추적
  const vpcRouterCount: Record<string, Set<string>> = {};

  // 먼저 VPC별 라우터 수를 계산
  Object.entries(subnetsByRouter).forEach(([routerId, routerSubnets]) => {
    routerSubnets.forEach((subnet) => {
      const vpcId = subnet.networkId;
      if (!vpcRouterCount[vpcId]) {
        vpcRouterCount[vpcId] = new Set();
      }
      vpcRouterCount[vpcId].add(routerId);
    });
  });

  // 라우터별 VPC 인덱스 추적
  const vpcRouterIndex: Record<string, number> = {};

  Object.entries(subnetsByRouter).forEach(([routerId, routerSubnets]) => {
    const routerPos = routerPositions[routerId];
    if (!routerPos) return;

    const widths = routerSubnets.map(s => getSubnetWidth(s.id));
    const totalWidth = widths.reduce((sum, w) => sum + w, 0);
    
    let subnetCurrentX = routerPos.centerX - totalWidth / 2;

    routerSubnets.forEach((subnet, idx) => {
      const width = widths[idx];
      const subnetCenterX = subnetCurrentX + width / 2;
      subnetPositions[subnet.id] = subnetCenterX;

      const subnetX = subnetCenterX - 60;

      // 라우터+VPC별 서브넷 위치 추적
      const vpcId = subnet.networkId;
      const groupKey = `${routerId}-${vpcId}`;
      
      if (!routerVpcBounds[groupKey]) {
        // 이 VPC가 이 라우터에 처음 등장
        if (!vpcRouterIndex[vpcId]) {
          vpcRouterIndex[vpcId] = 1;
        } else {
          vpcRouterIndex[vpcId]++;
        }
        
        routerVpcBounds[groupKey] = { 
          routerId,
          vpcId,
          minX: subnetX, 
          maxX: subnetX + 120, 
          subnets: [] 
        };
      } else {
        routerVpcBounds[groupKey].minX = Math.min(routerVpcBounds[groupKey].minX, subnetX);
        routerVpcBounds[groupKey].maxX = Math.max(routerVpcBounds[groupKey].maxX, subnetX + 120);
      }
      routerVpcBounds[groupKey].subnets.push(subnet);

      nodes.push({
        id: subnet.id,
        type: 'subnet',
        position: { x: subnetX, y: layerY.subnet },
        data: { 
          label: subnet.name, 
          cidr: subnet.cidr, 
          status: subnet.status, 
          networkName: networks.find(n => n.id === subnet.networkId)?.name 
        },
      });

      // Edge: Router → Subnet
      edges.push({
        id: `${routerId}-${subnet.id}`,
        source: routerId,
        target: subnet.id,
        type: 'smoothstep',
        pathOptions: { borderRadius: 0, offset: 25 },
        style: { stroke: getEdgeColor('subnet', subnet.status), strokeWidth: 1 },
        markerEnd: { type: MarkerType.ArrowClosed, color: getEdgeColor('subnet', subnet.status) },
      });

      subnetCurrentX += width;
    });
  });

  // ========== VPC 그룹 패널 노드 생성 (라우터별로 분리) ==========
  // 각 VPC별로 현재까지 생성된 그룹 수 추적
  const vpcGroupCounter: Record<string, number> = {};

  Object.entries(routerVpcBounds).forEach(([groupKey, bounds]) => {
    const vpc = networks.find(n => n.id === bounds.vpcId);
    if (!vpc || bounds.subnets.length < 1) return;

    // 이 VPC가 몇 개의 라우터에 걸쳐 있는지
    const totalRouters = vpcRouterCount[bounds.vpcId]?.size || 1;
    
    // 현재 이 VPC의 몇 번째 그룹인지
    if (!vpcGroupCounter[bounds.vpcId]) {
      vpcGroupCounter[bounds.vpcId] = 1;
    } else {
      vpcGroupCounter[bounds.vpcId]++;
    }
    const currentIndex = vpcGroupCounter[bounds.vpcId];

    const padding = 12;
    const labelHeight = 28;  // 타이틀 영역 높이 증가
    const panelWidth = bounds.maxX - bounds.minX + padding * 2;
    const panelHeight = 110 + labelHeight;  // 하단 CIDR이 잘리지 않도록 높이 증가

    // 라벨 생성: 여러 라우터에 걸쳐 있으면 (1/2), (2/2) 표시
    const label = totalRouters > 1 
      ? `${vpc.name} (${currentIndex}/${totalRouters})`
      : vpc.name;

    nodes.push({
      id: `vpc-group-${groupKey}`,
      type: 'vpcGroup',
      position: { 
        x: bounds.minX - padding, 
        y: layerY.subnet - labelHeight - 8  // 타이틀이 가려지지 않도록 더 위로
      },
      data: { 
        label,
        status: vpc.status,
        width: panelWidth,
        height: panelHeight,
        subnetCount: bounds.subnets.length,
        subnets: bounds.subnets,
        vpcName: vpc.name,
        isPartial: totalRouters > 1,
        partIndex: currentIndex,
        totalParts: totalRouters,
      },
      zIndex: -1,
      selectable: true,
      draggable: false,
    });
  });

  // ========== 로드밸런서 노드 생성 ==========
  Object.entries(lbsBySubnet).forEach(([subnetId, lbs]) => {
    const subnetCenterX = subnetPositions[subnetId];
    if (subnetCenterX === undefined) return;

    const lbCount = lbs.length;
    const totalLbWidth = (lbCount - 1) * lbSpacing;
    let lbCurrentX = subnetCenterX - totalLbWidth / 2;

    lbs.forEach((lb) => {
      nodes.push({
        id: lb.id,
        type: 'loadBalancer',
        position: { x: lbCurrentX - 40, y: layerY.loadBalancer },
        data: { label: lb.name, status: lb.status, vip: lb.vip },
      });

      // Edge: Subnet → LB
      edges.push({
        id: `${subnetId}-${lb.id}`,
        source: subnetId,
        target: lb.id,
        type: 'smoothstep',
        pathOptions: { borderRadius: 0, offset: 20 },
        style: { stroke: getEdgeColor('loadBalancer', lb.status), strokeWidth: 1 },
        markerEnd: { type: MarkerType.ArrowClosed, color: getEdgeColor('loadBalancer', lb.status) },
      });

      lbCurrentX += lbSpacing;
    });
  });

  // ========== 독립 서브넷 (라우터 없음) ==========
  let isolatedX = currentX + groupGap;
  isolatedSubnets.forEach((subnet) => {
    const centerX = isolatedX + 60;
    subnetPositions[subnet.id] = centerX;

    nodes.push({
      id: subnet.id,
      type: 'subnet',
      position: { x: isolatedX, y: layerY.subnet },
      data: { 
        label: subnet.name, 
        cidr: subnet.cidr, 
        status: subnet.status, 
        networkName: isolatedNetworks.find(n => n.id === subnet.networkId)?.name 
      },
    });

    isolatedX += minSubnetWidth;
  });

  // Create Load Balancer nodes (smoothstep으로 직접 연결, junction 없음)
  Object.entries(lbsBySubnet).forEach(([subnetId, lbs]) => {
    const subnetCenterX = subnetPositions[subnetId];
    if (subnetCenterX === undefined) return;

    const lbCount = lbs.length;
    const totalWidth = (lbCount - 1) * lbSpacing;

    lbs.forEach((lb, idx) => {
      const lbCenterX = lbCount === 1 
        ? subnetCenterX 
        : subnetCenterX - totalWidth / 2 + (idx * lbSpacing);

      nodes.push({
        id: lb.id,
        type: 'loadBalancer',
        position: { x: lbCenterX - 40, y: layerY.loadBalancer },
        data: { label: lb.name, status: lb.status, vip: lb.vip },
      });

      // Subnet → LB (smoothstep으로 직접 연결)
      edges.push({
        id: `${subnetId}-${lb.id}`,
        source: subnetId,
        target: lb.id,
        type: 'smoothstep',
        pathOptions: { borderRadius: 0, offset: 20 },
        style: { stroke: TOPOLOGY_COLORS.loadBalancer.hex, strokeWidth: 1 },
        markerEnd: { type: MarkerType.ArrowClosed, color: TOPOLOGY_COLORS.loadBalancer.hex },
      });
    });
  });

  return { nodes, edges };
}

/* ----------------------------------------
   Topology Page Component
   ---------------------------------------- */

// Node detail info (노드별 상세 정보)
interface NodeDetailInfo {
  id: string;
  type: string;
  label: string;
  status: string;
  details: Record<string, string | string[]>;
}

// Popover Component
function NodePopover({ 
  info, 
  position, 
  onClose 
}: { 
  info: NodeDetailInfo; 
  position: { x: number; y: number }; 
  onClose: () => void;
}) {
  const typeLabels: Record<string, string> = {
    externalNetwork: 'External Network',
    router: 'Router',
    subnet: 'Subnet',
    loadBalancer: 'Load Balancer',
  };

  const typeColors: Record<string, string> = {
    externalNetwork: TOPOLOGY_COLORS.externalNetwork.bg,
    router: TOPOLOGY_COLORS.router.bg,
    subnet: TOPOLOGY_COLORS.subnet.bg,
    loadBalancer: TOPOLOGY_COLORS.loadBalancer.bg,
  };

  const statusColors: Record<string, string> = {
    active: 'bg-green-500',
    inactive: 'bg-slate-400',
    error: 'bg-red-500',
  };

  const statusLabels: Record<string, string> = {
    active: '활성',
    inactive: '비활성',
    error: '오류',
  };

  return (
    <div 
      className="fixed z-50 bg-white rounded-xl shadow-2xl border border-slate-200 w-[320px] overflow-hidden"
      style={{ left: position.x, top: position.y }}
    >
      {/* Header */}
      <div className={`${typeColors[info.type] || 'bg-slate-500'} px-4 py-3 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[length:var(--font-size-10)] opacity-80 uppercase tracking-wide">
              {typeLabels[info.type] || info.type}
            </div>
            <div className="font-semibold text-sm mt-0.5">{info.label}</div>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <IconX size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Status */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-2.5 h-2.5 rounded-full ${statusColors[info.status]}`} />
          <span className="text-sm font-medium text-slate-700">
            {statusLabels[info.status] || info.status}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-3">
          {Object.entries(info.details).map(([key, value]) => (
            <div key={key}>
              <div className="text-[length:var(--font-size-10)] text-slate-500 uppercase tracking-wide mb-1">{key}</div>
              {Array.isArray(value) ? (
                <div className="flex flex-wrap gap-1">
                  {value.map((v, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                      {v}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-800 font-mono">{value}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
          <IconExternalLink size={12} />
          상세 보기
        </button>
      </div>
    </div>
  );
}

export function TopologyPage() {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => generateTopology(), []);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Popover state
  const [selectedNode, setSelectedNode] = useState<NodeDetailInfo | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Node click handler
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    const rect = (_event.target as HTMLElement).getBoundingClientRect();
    
    // Position popover to the right of the node
    let x = rect.right + 16;
    let y = rect.top;
    
    // Keep within viewport
    if (x + 320 > window.innerWidth) {
      x = rect.left - 320 - 16;
    }
    if (y + 300 > window.innerHeight) {
      y = window.innerHeight - 300 - 16;
    }
    
    setPopoverPosition({ x, y });

    // Build detail info based on node type
    const details: Record<string, string | string[]> = {};
    
    if (node.type === 'externalNetwork') {
      details['네트워크 타입'] = 'Public';
      details['연결된 라우터'] = ['prod-router', 'staging-router']; // Example data
    } else if (node.type === 'router') {
      details['게이트웨이 IP'] = node.data.gateway || '10.0.0.1';
      details['연결된 서브넷'] = ['web-subnet', 'app-subnet', 'db-subnet']; // Example
    } else if (node.type === 'subnet') {
      details['CIDR'] = node.data.cidr || '10.0.1.0/24';
      details['VPC'] = node.data.networkName || '-';
      details['가용 IP'] = '251 / 256';
      details['DHCP'] = '활성화';
    } else if (node.type === 'loadBalancer') {
      details['VIP'] = node.data.vip || '10.0.1.100';
      details['프로토콜'] = 'HTTP';
      details['포트'] = '80, 443';
      details['헬스체크'] = '/health';
    }

    setSelectedNode({
      id: node.id,
      type: node.type || 'unknown',
      label: node.data.label as string,
      status: (node.data.status as string) || 'active',
      details,
    });
  }, []);

  const closePopover = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      <Sidebar />

      <main className="ml-[200px] min-h-screen flex flex-col">
        <TabBar
          tabs={[
            { id: 'topology', label: 'Network Topology', active: true },
          ]}
        />

        <BreadcrumbNavigation
          items={[
            { label: 'Proj-1', href: '/project' },
            { label: 'Network Topology', active: true },
          ]}
        />

        <div className="flex-1 p-6">
          <VStack gap={4} className="h-full">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)]">
                Network Topology
              </h1>
              <div className="flex items-center gap-4 text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                <span>Drag to move • Scroll to zoom • Click for details</span>
              </div>
            </div>

            {/* React Flow Canvas */}
            <div className="bg-white rounded-xl border border-[var(--color-border-default)] overflow-hidden" style={{ height: '600px' }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                defaultEdgeOptions={{
                  type: 'step',
                }}
                proOptions={{ hideAttribution: true }}
                // 읽기 전용 설정
                nodesConnectable={false}
                nodesDraggable={false}
                elementsSelectable={true}
                panOnDrag={true}
                zoomOnScroll={true}
              >
                <Background color="#e2e8f0" gap={20} size={1} />
                <Controls className="!bg-white !border-slate-200 !shadow-lg" />
                <MiniMap 
                  nodeColor={(node) => {
                    switch (node.type) {
                      case 'externalNetwork': return TOPOLOGY_COLORS.externalNetwork.hex;
                      case 'router': return TOPOLOGY_COLORS.router.hex;
                      case 'subnet': return TOPOLOGY_COLORS.subnet.hex;
                      case 'subnetGroup': return TOPOLOGY_COLORS.subnet.hex;
                      case 'loadBalancer': return TOPOLOGY_COLORS.loadBalancer.hex;
                      default: return '#64748b';
                    }
                  }}
                  className="!bg-white !border-slate-200"
                />
              </ReactFlow>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6">
              <span className="text-[length:var(--font-size-11)] font-medium text-[var(--color-text-subtle)]">Legend:</span>
              <LegendItem color={TOPOLOGY_COLORS.externalNetwork.bg} label="External Network" />
              <LegendItem color={TOPOLOGY_COLORS.router.bg} label="Router" />
              <LegendItem color={TOPOLOGY_COLORS.subnet.bg} label="Subnet" />
              <LegendItem color={TOPOLOGY_COLORS.loadBalancer.bg} label="Load Balancer" />
            </div>
          </VStack>
        </div>
      </main>

      {/* Node Detail Popover */}
      {selectedNode && (
        <NodePopover 
          info={selectedNode} 
          position={popoverPosition} 
          onClose={closePopover} 
        />
      )}
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`${TOPOLOGY_STYLES.legend.dot} ${color}`} />
      <span className={`${TOPOLOGY_STYLES.font.label} text-[var(--color-text-muted)]`}>{label}</span>
    </div>
  );
}

export default TopologyPage;
