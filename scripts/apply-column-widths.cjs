#!/usr/bin/env node

/**
 * columnWidths 프리셋 일괄 적용 스크립트
 */

const fs = require('fs');
const path = require('path');

// 재귀적으로 tsx 파일 찾기
function findTsxFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findTsxFiles(fullPath));
    } else if (item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// key -> preset 매핑
const keyToPreset = {
  select: 'select', checkbox: 'checkbox', actions: 'actions', action: 'action',
  locked: 'locked', favorite: 'favorite', status: 'status', ready: 'ready',
  adminState: 'adminState', adminStateUp: 'adminStateUp', health: 'health',
  condition: 'condition', az: 'az', gpu: 'gpu', phase: 'phase',
  ip: 'ip', fixedIp: 'fixedIp', floatingIp: 'floatingIp', ipAddress: 'ipAddress',
  macAddress: 'macAddress', subnetCidr: 'subnetCidr', port: 'port', protocol: 'protocol',
  networkBandwidth: 'networkBandwidth', direction: 'direction', portRange: 'portRange',
  remoteIpPrefix: 'remoteIpPrefix', etherType: 'etherType', weight: 'weight',
  network: 'network', ownedNetwork: 'ownedNetwork', attachedTo: 'attachedTo',
  associatedTo: 'associatedTo', cpu: 'cpu', vcpu: 'vcpu', vCPU: 'vCPU',
  ram: 'ram', memory: 'memory', disk: 'disk', size: 'size', pods: 'pods',
  ephemeralDisk: 'ephemeralDisk', minDisk: 'minDisk', minRam: 'minRam', minRAM: 'minRAM',
  storageClass: 'storageClass', accessModes: 'accessModes', capacity: 'capacity',
  reclaimPolicy: 'reclaimPolicy', volumeMode: 'volumeMode', desired: 'desired',
  current: 'current', available: 'available', upToDate: 'upToDate',
  completions: 'completions', parallelism: 'parallelism', schedule: 'schedule',
  lastSchedule: 'lastSchedule', suspend: 'suspend', age: 'age',
  containerImage: 'containerImage', image: 'image', flavor: 'flavor',
  createdAt: 'createdAt', updatedAt: 'updatedAt', lastSeen: 'lastSeen',
  firstSeen: 'firstSeen', timestamp: 'timestamp', duration: 'duration',
  expiresAt: 'expiresAt', lastSignIn: 'lastSignIn', startTime: 'startTime',
  count: 'count', restarts: 'restarts', replicas: 'replicas', userCount: 'userCount',
  memberCount: 'memberCount', members: 'members', minAvailable: 'minAvailable',
  maxUnavailable: 'maxUnavailable', disruptionsAllowed: 'disruptionsAllowed',
  currentHealthy: 'currentHealthy', desiredHealthy: 'desiredHealthy',
  expectedPods: 'expectedPods', id: 'id', type: 'type', version: 'version',
  access: 'access', visibility: 'visibility', namespace: 'namespace',
  category: 'category', provisioner: 'provisioner', provisioningStatus: 'provisioningStatus',
  operatingStatus: 'operatingStatus', listeners: 'listeners', listener: 'listener',
  pools: 'pools', algorithm: 'algorithm', name: 'name', host: 'host',
  fingerprint: 'fingerprint', kubernetesVersion: 'kubernetesVersion',
  labels: 'labels', annotations: 'annotations', selector: 'selector',
  podSelector: 'podSelector', namespaceSelector: 'namespaceSelector',
  associatedResources: 'associatedResources', sourceInstance: 'sourceInstance',
  // 이벤트 관련
  reason: 'reason', object: 'object', subobject: 'subobject', message: 'message',
  // Key-Value 테이블
  key: 'key', value: 'value',
  // Container 세부
  initContainer: 'initContainer', pathType: 'pathType', path: 'path', target: 'target',
  // Storage
  default: 'default', source: 'source', volumeAttributesClass: 'volumeAttributesClass',
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // columnWidths import가 없으면 스킵
  if (!content.includes('columnWidths')) {
    return { modified: false, changes: 0 };
  }
  
  let changes = 0;
  const originalContent = content;
  
  // 각 key에 대해 패턴 교체
  for (const [key, preset] of Object.entries(keyToPreset)) {
    // key: 'xxx' 뒤에 width: 'YYpx'가 오는 패턴 (멀티라인)
    const regex = new RegExp(
      `(key:\\s*['"]${key}['"][^}]*?)width:\\s*['"]\\d+px['"]`,
      'gs'
    );
    
    content = content.replace(regex, (match, prefix) => {
      if (match.includes('columnWidths.')) return match;
      changes++;
      return `${prefix}width: columnWidths.${preset}`;
    });
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return { modified: true, changes };
  }
  
  return { modified: false, changes: 0 };
}

// 메인
const pagesDir = path.join(__dirname, '..', 'src', 'pages');
const files = findTsxFiles(pagesDir);

console.log(`Processing ${files.length} files...\n`);

let totalModified = 0;
let totalChanges = 0;

for (const file of files) {
  const result = processFile(file);
  if (result.modified) {
    totalModified++;
    totalChanges += result.changes;
    const relativePath = path.relative(pagesDir, file);
    console.log(`✓ ${relativePath}: ${result.changes} changes`);
  }
}

console.log(`\n========================================`);
console.log(`Total: ${totalModified} files modified, ${totalChanges} changes`);
