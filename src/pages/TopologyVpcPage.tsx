import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';

import { Sidebar } from '@/components/Sidebar';
import { TabBar } from '@/components/TabBar';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import { VStack } from '@/design-system';
import { IconX, IconCopy, IconExternalLink } from '@tabler/icons-react';

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

const EDGE_COLORS = {
  externalNetwork: { active: '#3b82f6', inactive: '#93c5fd', error: '#ef4444' },
  router: { active: '#6366f1', inactive: '#a5b4fc', error: '#ef4444' },
  subnet: { active: '#14b8a6', inactive: '#5eead4', error: '#ef4444' },
  loadBalancer: { active: '#eab308', inactive: '#fde047', error: '#ef4444' },
};

const SIZES = {
  externalNetwork: { node: 64, icon: 32 },
  router: { node: 56, icon: 28 },
  subnet: { node: 48, icon: 24 },
  loadBalancer: { node: 40, icon: 20 },
  indicator: 12,
};

const ICONS = {
  externalNetwork: 'M4 6C4 7.06087 4.42143 8.07828 5.17157 8.82843C5.92172 9.57857 6.93913 10 8 10M4 6C4 4.93913 4.42143 3.92172 5.17157 3.17157C5.92172 2.42143 6.93913 2 8 2M4 6H12M8 10C9.06087 10 10.0783 9.57857 10.8284 8.82843C11.5786 8.07828 12 7.06087 12 6M8 10C8.88867 9.778 9.33333 8.44467 9.33333 6C9.33333 3.55533 8.88867 2.222 8 2M8 10C7.11133 9.778 6.66667 8.44467 6.66667 6C6.66667 3.55533 7.11133 2.222 8 2M8 10V12M12 6C12 4.93913 11.5786 3.92172 10.8284 3.17157C10.0783 2.42143 9.06087 2 8 2M2 13.3333H6.66667M6.66667 13.3333C6.66667 13.687 6.80714 14.0261 7.05719 14.2761C7.30724 14.5262 7.64638 14.6667 8 14.6667C8.35362 14.6667 8.69276 14.5262 8.94281 14.2761C9.19286 14.0261 9.33333 13.687 9.33333 13.3333M6.66667 13.3333C6.66667 12.9797 6.80714 12.6406 7.05719 12.3905C7.30724 12.1405 7.64638 12 8 12M9.33333 13.3333H14M9.33333 13.3333C9.33333 12.9797 9.19286 12.6406 8.94281 12.3905C8.69276 12.1405 8.35362 12 8 12',
  router: 'M7.99907 15.152V10.4951M7.99907 15.152L5.73633 12.8892M7.99907 15.152L10.2618 12.8892M3.24372 10.2625L5.50646 7.9998M5.50646 7.9998L3.24372 5.73706M5.50646 7.9998H0.849609M12.7569 5.73706L10.4941 7.9998M10.4941 7.9998L12.7569 10.2625M10.4941 7.9998H15.151M10.2618 3.11089L7.99907 0.848145M7.99907 0.848145L5.73633 3.11089M7.99907 0.848145V5.505',
  subnet: 'M8 8H8.00667M10.666 8H10.6727M11.334 4.66675L14.6673 8.00008L11.334 11.3334M4.66732 4.66675L1.33398 8.00008L4.66732 11.3334M5.33398 8H5.34065',
  loadBalancer: 'M8.00033 10.6667C7.46989 10.6667 6.96118 10.456 6.58611 10.0809C6.21104 9.70581 6.00033 9.1971 6.00033 8.66667C6.00033 8.13623 6.21104 7.62753 6.58611 7.25245C6.96118 6.87738 7.46989 6.66667 8.00033 6.66667M8.00033 10.6667C8.53076 10.6667 9.03947 10.456 9.41454 10.0809C9.78961 9.70581 10.0003 9.1971 10.0003 8.66667C10.0003 8.13623 9.78961 7.62753 9.41454 7.25245C9.03947 6.87738 8.53076 6.66667 8.00033 6.66667M8.00033 10.6667V12.6667M8.00033 6.66667V2M8.00033 12.6667C8.17714 12.6667 8.34671 12.7369 8.47173 12.8619C8.59675 12.987 8.66699 13.1565 8.66699 13.3333C8.66699 13.5101 8.59675 13.6797 8.47173 13.8047C8.34671 13.9298 8.17714 14 8.00033 14C7.82351 14 7.65395 13.9298 7.52892 13.8047C7.4039 13.6797 7.33366 13.5101 7.33366 13.3333C7.33366 13.1565 7.4039 12.987 7.52892 12.8619C7.65395 12.7369 7.82351 12.6667 8.00033 12.6667ZM8.00033 2L6.00033 4M8.00033 2L10.0003 4M9.92969 8.15129L14.003 6.66862M14.003 6.66862L11.4396 5.47331M14.003 6.66862L12.8076 9.23197M6.06758 8.14262L2.01758 6.66862M2.01758 6.66862L4.58091 5.47331M2.01758 6.66862L3.21291 9.23197',
};

/* ----------------------------------------
   Data Types & Definitions
   ---------------------------------------- */
interface ExternalNetwork {
  id: string;
  name: string;
  status?: 'active' | 'inactive' | 'error';
}

interface Router {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
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

// Sample Data
const networkGroups: NetworkGroup[] = [
  { 
    extNet: { id: 'ext-net-1', name: 'public-network-kr', status: 'active' },
    routers: [
      { id: 'router-1', name: 'prod-router', status: 'active' },
      { id: 'router-2', name: 'staging-router', status: 'active' },
    ]
  },
];

const standaloneRouters: Router[] = [];

const networks: Network[] = [
  { id: 'net-1', name: 'production-vpc', status: 'active' },
  { id: 'net-2', name: 'staging-vpc', status: 'active' },
  { id: 'net-shared', name: 'shared-vpc', status: 'active' },
];

const subnets: Subnet[] = [
  // production-vpc - router-1에 연결
  { id: 'sub-1-1', name: 'web-subnet', cidr: '10.0.1.0/24', status: 'active', networkId: 'net-1', routerId: 'router-1' },
  { id: 'sub-1-2', name: 'app-subnet', cidr: '10.0.2.0/24', status: 'active', networkId: 'net-1', routerId: 'router-1' },
  { id: 'sub-1-3', name: 'db-subnet', cidr: '10.0.3.0/24', status: 'active', networkId: 'net-1', routerId: 'router-1' },
  // production-vpc - unrouted
  { id: 'sub-1-4', name: 'isolated-1', cidr: '10.0.4.0/24', status: 'inactive', networkId: 'net-1' },
  // staging-vpc - router-2에 연결
  { id: 'sub-2-1', name: 'staging-web', cidr: '10.1.1.0/24', status: 'active', networkId: 'net-2', routerId: 'router-2' },
  // shared-vpc - 여러 라우터에 분산
  { id: 'sub-shared-1', name: 'shared-api', cidr: '10.100.1.0/24', status: 'active', networkId: 'net-shared', routerId: 'router-1' },
  { id: 'sub-shared-2', name: 'shared-cache', cidr: '10.100.2.0/24', status: 'active', networkId: 'net-shared', routerId: 'router-2' },
  { id: 'sub-shared-3', name: 'shared-isolated', cidr: '10.100.3.0/24', status: 'inactive', networkId: 'net-shared' },
];

const loadBalancers: LoadBalancer[] = [
  { id: 'lb-1', name: 'web-lb', status: 'active', subnetId: 'sub-1-1', vip: '10.0.1.100' },
  { id: 'lb-2', name: 'api-lb', status: 'active', subnetId: 'sub-1-1', vip: '10.0.1.101' },
  { id: 'lb-3', name: 'staging-lb', status: 'active', subnetId: 'sub-2-1', vip: '10.1.1.100' },
];

/* ----------------------------------------
   Popover Component
   ---------------------------------------- */
interface PopoverData {
  type: string;
  name: string;
  status: string;
  id?: string;
  details?: Record<string, string | number>;
}

interface PopoverProps {
  data: PopoverData | null;
  position: { x: number; y: number };
  onClose: () => void;
}

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

function Popover({ data, position, onClose }: PopoverProps) {
  const [pos, setPos] = useState(position);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setPos(position);
  }, [position.x, position.y]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, a')) return;
    setIsDragging(true);
    setDragOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setPos({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

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
      className={`fixed z-50 bg-white border border-slate-200 rounded-xl shadow-xl min-w-[220px] max-w-[280px] ${isDragging ? 'cursor-grabbing' : ''}`}
      style={{ left: pos.x, top: pos.y }}
    >
      <div 
        className={`flex items-center justify-between px-4 pt-3 pb-2 ${!isDragging ? 'cursor-grab' : 'cursor-grabbing'}`}
        onMouseDown={handleMouseDown}
      >
        <span className="font-semibold text-base text-slate-900">{data.name}</span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <IconX size={18} />
        </button>
      </div>
      
      <div className="px-4 pb-4 text-sm text-slate-700 space-y-1.5">
        <div className="flex justify-between">
          <span className="text-slate-500">Status:</span>
          <span className="font-medium">{statusText}</span>
        </div>
        {data.id && (
          <div className="flex justify-between">
            <span className="text-slate-500">ID:</span>
            <CopyableText value={data.id} />
          </div>
        )}
        {data.details && Object.entries(data.details).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-slate-500">{key}:</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Tooltip State
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
export function TopologyVpcPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const minimapRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [popover, setPopover] = useState<{ data: PopoverData | null; position: { x: number; y: number } } | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, content: { name: '', type: '', status: '' } });

  const closePopover = useCallback(() => setPopover(null), []);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g');

    let updateMinimap: (transform: d3.ZoomTransform) => void = () => {};

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        updateMinimap(event.transform);
      });

    svg.call(zoom);

    // Layout constants
    const startX = 100;
    const startY = 80;
    const routerLayerY = startY;
    const vpcLayerY = startY + 180;
    const routerGap = 200;
    const subnetGap = 140;
    const vpcPadding = 30;
    const vpcGap = 60;

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

    interface VpcGroupData {
      x: number;
      y: number;
      width: number;
      height: number;
      name: string;
      networkId: string;
      status: string;
      connectedRouters: string[];
    }

    const nodes: NodePosition[] = [];
    const edges: EdgeData[] = [];
    const vpcGroupsData: VpcGroupData[] = [];

    // Get all routers
    const allRouters = [
      ...networkGroups.flatMap(g => g.routers),
      ...standaloneRouters,
    ];

    // Place routers in a row
    const routerPositions: Record<string, { x: number; y: number }> = {};
    let routerX = startX;

    // External network
    const extNet = networkGroups[0]?.extNet;
    if (extNet) {
      const extNetX = startX + (allRouters.length - 1) * routerGap / 2;
      nodes.push({
        id: extNet.id,
        x: extNetX,
        y: startY - 100,
        type: 'externalNetwork',
        data: extNet,
      });
    }

    allRouters.forEach((router, idx) => {
      const rx = routerX + idx * routerGap;
      const ry = routerLayerY;
      
      routerPositions[router.id] = { x: rx, y: ry };
      
      nodes.push({
        id: router.id,
        x: rx,
        y: ry,
        type: 'router',
        data: router,
      });

      // Edge from external network to router
      if (extNet) {
        const extNetX = startX + (allRouters.length - 1) * routerGap / 2;
        edges.push({
          source: { x: extNetX, y: startY - 100 + SIZES.externalNetwork.node / 2 },
          target: { x: rx, y: ry - SIZES.router.node / 2 },
          sourceType: 'externalNetwork',
          status: router.status,
          animated: router.status === 'active',
        });
      }
    });

    // Group subnets by VPC
    const subnetsByVpc: Record<string, Subnet[]> = {};
    subnets.forEach(subnet => {
      if (!subnetsByVpc[subnet.networkId]) subnetsByVpc[subnet.networkId] = [];
      subnetsByVpc[subnet.networkId].push(subnet);
    });

    // LBs by subnet
    const lbsBySubnet: Record<string, LoadBalancer[]> = {};
    loadBalancers.forEach(lb => {
      if (!lbsBySubnet[lb.subnetId]) lbsBySubnet[lb.subnetId] = [];
      lbsBySubnet[lb.subnetId].push(lb);
    });

    // Place VPCs
    let vpcX = startX - vpcPadding;

    networks.forEach(vpc => {
      const vpcSubnets = subnetsByVpc[vpc.id] || [];
      if (vpcSubnets.length === 0) return;

      const vpcStartX = vpcX;
      const vpcWidth = vpcSubnets.length * subnetGap + vpcPadding * 2;
      
      // Find connected routers
      const connectedRouterIds = new Set<string>();
      vpcSubnets.forEach(s => {
        if (s.routerId) connectedRouterIds.add(s.routerId);
      });

      vpcGroupsData.push({
        x: vpcStartX,
        y: vpcLayerY - 40,
        width: vpcWidth,
        height: 180,
        name: vpc.name,
        networkId: vpc.id,
        status: vpc.status,
        connectedRouters: Array.from(connectedRouterIds),
      });

      // Place subnets inside VPC
      vpcSubnets.forEach((subnet, sIdx) => {
        const sx = vpcStartX + vpcPadding + sIdx * subnetGap + subnetGap / 2;
        const sy = vpcLayerY + 30;

        nodes.push({
          id: subnet.id,
          x: sx,
          y: sy,
          type: 'subnet',
          data: subnet,
        });

        // Edge from router to subnet (if connected)
        if (subnet.routerId && routerPositions[subnet.routerId]) {
          const router = allRouters.find(r => r.id === subnet.routerId);
          const rPos = routerPositions[subnet.routerId];
          edges.push({
            source: { x: rPos.x, y: rPos.y + SIZES.router.node / 2 },
            target: { x: sx, y: sy - SIZES.subnet.node / 2 },
            sourceType: 'router',
            status: router?.status || 'active',
          });
        }

        // Load Balancers
        const subnetLbs = lbsBySubnet[subnet.id] || [];
        subnetLbs.forEach((lb, lbIdx) => {
          const lx = sx + (lbIdx - (subnetLbs.length - 1) / 2) * 80;
          const ly = sy + 90;

          nodes.push({
            id: lb.id,
            x: lx,
            y: ly,
            type: 'loadBalancer',
            data: lb,
          });

          edges.push({
            source: { x: sx, y: sy + SIZES.subnet.node / 2 },
            target: { x: lx, y: ly - SIZES.loadBalancer.node / 2 },
            sourceType: 'subnet',
            status: subnet.status,
          });
        });
      });

      vpcX += vpcWidth + vpcGap;
    });

    // Draw VPC panels first (background)
    vpcGroupsData.forEach(vpc => {
      const borderColor = COLORS.vpcBorder[vpc.status as keyof typeof COLORS.vpcBorder] || COLORS.vpcBorder.active;
      const bgColor = COLORS.vpcPanel[vpc.status as keyof typeof COLORS.vpcPanel] || COLORS.vpcPanel.active;

      const vpcGroup = g.append('g')
        .attr('cursor', 'pointer')
        .on('mouseenter', function(event) {
          d3.select(this).select('rect')
            .transition()
            .duration(150)
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', 'none');
          
          setTooltip({
            visible: true,
            x: event.clientX + 12,
            y: event.clientY + 12,
            content: {
              name: vpc.name,
              type: 'VPC',
              status: vpc.status,
              extra: vpc.connectedRouters.length > 1 
                ? `Connected to ${vpc.connectedRouters.length} routers` 
                : undefined,
            },
          });
        })
        .on('mousemove', (event) => {
          setTooltip(prev => ({ ...prev, x: event.clientX + 12, y: event.clientY + 12 }));
        })
        .on('mouseleave', function() {
          d3.select(this).select('rect')
            .transition()
            .duration(150)
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '6,4');
          setTooltip(prev => ({ ...prev, visible: false }));
        })
        .on('click', (event) => {
          event.stopPropagation();
          const vpcSubnets = subnetsByVpc[vpc.networkId] || [];
          setPopover({
            data: {
              type: 'vpc',
              name: vpc.name,
              status: vpc.status,
              id: vpc.networkId,
              details: {
                'Subnets': vpcSubnets.length,
                'Connected Routers': vpc.connectedRouters.length,
              },
            },
            position: { x: event.clientX + 10, y: event.clientY + 10 },
          });
        });

      vpcGroup.append('rect')
        .attr('x', vpc.x)
        .attr('y', vpc.y)
        .attr('width', vpc.width)
        .attr('height', vpc.height)
        .attr('rx', 12)
        .attr('fill', bgColor)
        .attr('stroke', borderColor)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '6,4');

      // VPC label
      vpcGroup.append('text')
        .attr('x', vpc.x + 16)
        .attr('y', vpc.y + 22)
        .attr('font-size', '12px')
        .attr('font-weight', '600')
        .attr('fill', '#374151')
        .text(vpc.name);

      // Connected routers badge
      if (vpc.connectedRouters.length > 1) {
        const badgeX = vpc.x + vpc.width - 90;
        const badgeY = vpc.y + 8;
        
        vpcGroup.append('rect')
          .attr('x', badgeX)
          .attr('y', badgeY)
          .attr('width', 80)
          .attr('height', 20)
          .attr('rx', 4)
          .attr('fill', '#6366f1');
        
        vpcGroup.append('text')
          .attr('x', badgeX + 40)
          .attr('y', badgeY + 14)
          .attr('font-size', '10px')
          .attr('font-weight', '600')
          .attr('fill', 'white')
          .attr('text-anchor', 'middle')
          .text(`${vpc.connectedRouters.length} Routers`);
      }
    });

    // Draw edges
    const drawEdge = (edge: EdgeData) => {
      const { source, target, sourceType, status, animated } = edge;
      const colorSet = EDGE_COLORS[sourceType as keyof typeof EDGE_COLORS] || EDGE_COLORS.router;
      const color = colorSet[status as keyof typeof colorSet] || colorSet.active;

      const path = d3.path();
      path.moveTo(source.x, source.y);
      
      // For router to subnet edges, use curved lines
      if (sourceType === 'router') {
        const midY = source.y + (target.y - source.y) * 0.3;
        path.quadraticCurveTo(source.x, midY, (source.x + target.x) / 2, (source.y + target.y) / 2);
        path.quadraticCurveTo(target.x, target.y - 30, target.x, target.y);
      } else {
        // Step edge for others
        const midY = source.y + (target.y - source.y) / 2;
        path.lineTo(source.x, midY);
        path.lineTo(target.x, midY);
        path.lineTo(target.x, target.y);
      }

      const edgePath = g.append('path')
        .attr('d', path.toString())
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 1);

      if (animated) {
        edgePath.attr('stroke-dasharray', '5,5');
        const totalLength = (edgePath.node() as SVGPathElement)?.getTotalLength() || 0;
        const duration = (totalLength / 50) * 1000;
        
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

      // Arrow
      g.append('polygon')
        .attr('points', '-4,-4 4,0 -4,4')
        .attr('fill', color)
        .attr('transform', `translate(${target.x}, ${target.y}) rotate(90)`);
    };

    edges.forEach(drawEdge);

    // Draw nodes
    const drawNode = (node: NodePosition) => {
      const { x, y, type, data } = node;
      const size = SIZES[type as keyof typeof SIZES];
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
        .on('mousemove', (event) => {
          setTooltip(prev => ({ ...prev, x: event.clientX + 12, y: event.clientY + 12 }));
        })
        .on('mouseleave', function() {
          d3.select(this).select('circle').transition().duration(150).attr('r', size.node / 2);
          setTooltip(prev => ({ ...prev, visible: false }));
        })
        .on('click', (event) => {
          event.stopPropagation();
          setPopover({
            data: {
              type,
              name: data.name,
              status: data.status,
              id: data.id,
              details: data.cidr ? { CIDR: data.cidr } : data.vip ? { VIP: data.vip } : undefined,
            },
            position: { x: event.clientX + 10, y: event.clientY + 10 },
          });
        });

      nodeGroup.append('circle')
        .attr('r', size.node / 2)
        .attr('fill', color)
        .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))');

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

      nodeGroup.append('circle')
        .attr('cx', size.node / 2 - 6)
        .attr('cy', size.node / 2 - 6)
        .attr('r', SIZES.indicator / 2)
        .attr('fill', statusColor)
        .attr('stroke', 'white')
        .attr('stroke-width', 2);

      nodeGroup.append('text')
        .attr('y', size.node / 2 + 16)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', '500')
        .attr('fill', '#1f2937')
        .text(data.name);

      if (data.cidr || data.vip) {
        nodeGroup.append('text')
          .attr('y', size.node / 2 + 28)
          .attr('text-anchor', 'middle')
          .attr('font-size', '9px')
          .attr('font-family', 'ui-monospace, monospace')
          .attr('fill', '#6b7280')
          .text(data.cidr || data.vip);
      }
    };

    nodes.forEach(drawNode);

    // Initial view
    const bounds = g.node()?.getBBox();
    if (bounds) {
      const fullWidth = bounds.width + 100;
      const fullHeight = bounds.height + 100;
      const scale = Math.min(width / fullWidth, height / fullHeight, 1);
      const translateX = (width - fullWidth * scale) / 2 - bounds.x * scale + 50;
      const translateY = (height - fullHeight * scale) / 2 - bounds.y * scale + 50;

      svg.call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(scale));
    }

    svg.on('click', () => setPopover(null));

    // Minimap
    const setupMinimap = () => {
      if (!minimapRef.current || !bounds) return;

      const minimapWidth = 180;
      const minimapHeight = 100;
      const minimapScale = Math.min(minimapWidth / (bounds.width + 100), minimapHeight / (bounds.height + 100));

      const minimapSvg = d3.select(minimapRef.current)
        .attr('width', minimapWidth)
        .attr('height', minimapHeight);

      minimapSvg.selectAll('*').remove();

      minimapSvg.append('rect')
        .attr('width', minimapWidth)
        .attr('height', minimapHeight)
        .attr('fill', '#f8fafc')
        .attr('stroke', '#e2e8f0')
        .attr('stroke-width', 1)
        .attr('rx', 4);

      const minimapG = minimapSvg.append('g')
        .attr('transform', `translate(${(minimapWidth - bounds.width * minimapScale) / 2 - bounds.x * minimapScale}, ${(minimapHeight - bounds.height * minimapScale) / 2 - bounds.y * minimapScale}) scale(${minimapScale})`);

      vpcGroupsData.forEach(vpc => {
        minimapG.append('rect')
          .attr('x', vpc.x)
          .attr('y', vpc.y)
          .attr('width', vpc.width)
          .attr('height', vpc.height)
          .attr('rx', 6)
          .attr('fill', COLORS.vpcPanel.active)
          .attr('opacity', 0.8);
      });

      nodes.forEach(node => {
        const colorSet = COLORS[node.type as keyof typeof COLORS];
        const color = colorSet[node.data.status as keyof typeof colorSet] || colorSet.active;
        minimapG.append('circle')
          .attr('cx', node.x)
          .attr('cy', node.y)
          .attr('r', 12)
          .attr('fill', color);
      });

      minimapSvg.append('rect')
        .attr('class', 'minimap-viewport')
        .attr('fill', 'rgba(59, 130, 246, 0.1)')
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 1)
        .attr('rx', 2);
    };

    updateMinimap = (transform: d3.ZoomTransform) => {
      if (!minimapRef.current || !bounds) return;

      const minimapWidth = 180;
      const minimapHeight = 100;
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

  }, []);

  return (
    <div className="flex h-screen bg-[var(--color-surface-default)]">
      <Sidebar />

      <VStack className="flex-1 overflow-hidden ml-[200px]">
        <TabBar
          tabs={[
            { id: 'topology-vpc', label: 'VPC-Centric View', active: true },
          ]}
        />
        <BreadcrumbNavigation 
          items={[
            { label: 'Proj-1', href: '/' },
            { label: 'Network Topology (VPC View)', href: '/topology-vpc' },
          ]}
        />

        <VStack className="flex-1 overflow-auto p-4 gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[length:var(--font-size-24)] font-semibold text-[var(--color-text-default)]">
                Network Topology
              </h1>
              <p className="text-sm text-[var(--color-text-subtle)] mt-1">
                VPC 중심 뷰 - 같은 VPC의 서브넷을 한눈에 확인
              </p>
            </div>
            <span className="text-sm text-[var(--color-text-subtle)]">
              Scroll to zoom • Click for details
            </span>
          </div>

          <div 
            ref={containerRef}
            className="flex-1 bg-white border border-[var(--color-border-default)] rounded-lg overflow-hidden relative"
            style={{ minHeight: '500px' }}
          >
            <svg ref={svgRef} className="w-full h-full" />
            
            <div className="absolute bottom-4 right-4 shadow-md rounded-md overflow-hidden">
              <svg ref={minimapRef} />
            </div>
            
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
        </VStack>
      </VStack>

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


