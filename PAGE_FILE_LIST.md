# 페이지 파일 목록 (tekskim 브랜치)

## 기본 경로
모든 페이지 파일은 `thaki-cloud/src/pages/` 디렉토리에 있습니다.

---

## 1. Entry & Desktop

| 라우트 | 파일 경로 | 설명 |
|--------|-----------|------|
| `/` | `thaki-cloud/src/pages/EntryPage.tsx` | 진입 페이지 (카드 그리드 레이아웃) |
| `/desktop` | `thaki-cloud/src/pages/DesktopPage.tsx` | Desktop UI 페이지 |

---

## 2. Agent Routes

| 라우트 | 파일 경로 | 설명 |
|--------|-----------|------|
| `/agent` | `thaki-cloud/src/pages/HomePage.tsx` | Agent 홈 페이지 |
| `/agent/list` | `thaki-cloud/src/pages/AgentPage.tsx` | Agent 목록 페이지 |
| `/agent/create` | `thaki-cloud/src/pages/CreateAgentPage.tsx` | Agent 생성 페이지 |
| `/chat` | `thaki-cloud/src/pages/ChatPage.tsx` | 채팅 페이지 |
| `/mcp-tools` | `thaki-cloud/src/pages/MCPToolsPage.tsx` | MCP 도구 페이지 |

---

## 3. Compute Routes

### Instances
| 라우트 | 파일 경로 | 설명 |
|--------|-----------|------|
| `/compute` | `thaki-cloud/src/pages/InstanceListPage.tsx` | 인스턴스 목록 |
| `/compute/instances` | `thaki-cloud/src/pages/InstanceListPage.tsx` | 인스턴스 목록 |
| `/compute/instances/create` | `thaki-cloud/src/pages/CreateInstancePage.tsx` | 인스턴스 생성 |
| `/compute/instances/:id` | `thaki-cloud/src/pages/InstanceDetailPage.tsx` | 인스턴스 상세 |

### Instance Templates
| 라우트 | 파일 경로 | 설명 |
|--------|-----------|------|
| `/compute/instance-templates` | `thaki-cloud/src/pages/InstanceTemplatesPage.tsx` | 인스턴스 템플릿 목록 |
| `/compute/instance-templates/:id` | `thaki-cloud/src/pages/InstanceTemplateDetailPage.tsx` | 인스턴스 템플릿 상세 |

### Instance Snapshots
| 라우트 | 파일 경로 | 설명 |
|--------|-----------|------|
| `/compute/instance-snapshots` | `thaki-cloud/src/pages/InstanceSnapshotsPage.tsx` | 인스턴스 스냅샷 목록 |
| `/compute/instance-snapshots/:id` | `thaki-cloud/src/pages/InstanceSnapshotDetailPage.tsx` | 인스턴스 스냅샷 상세 |

### Images
| 라우트 | 파일 경로 | 설명 |
|--------|-----------|------|
| `/compute/images` | `thaki-cloud/src/pages/ImagesPage.tsx` | 이미지 목록 |
| `/compute/images/:id` | `thaki-cloud/src/pages/ImageDetailPage.tsx` | 이미지 상세 |

### Flavors
| 라우트 | 파일 경로 | 설명 |
|--------|-----------|------|
| `/compute/flavors` | `thaki-cloud/src/pages/FlavorsPage.tsx` | Flavor 목록 |
| `/compute/flavors/:id` | `thaki-cloud/src/pages/FlavorDetailPage.tsx` | Flavor 상세 |

### Key Pairs
| 라우트 | 파일 경로 | 설명 |
|--------|-----------|------|
| `/compute/key-pairs` | `thaki-cloud/src/pages/KeyPairsPage.tsx` | 키 페어 목록 |
| `/compute/key-pairs/:id` | `thaki-cloud/src/pages/KeyPairDetailPage.tsx` | 키 페어 상세 |

### Server Groups
| 라우트 | 파일 경로 | 설명 |
|--------|-----------|------|
| `/compute/server-groups` | `thaki-cloud/src/pages/ServerGroupsPage.tsx` | 서버 그룹 목록 |
| `/compute/server-groups/:id` | `thaki-cloud/src/pages/ServerGroupDetailPage.tsx` | 서버 그룹 상세 |

### Volumes
| 라우트 | 파일 경로 | 설명 |
|--------|-----------|------|
| `/compute/volumes` | `thaki-cloud/src/pages/VolumesPage.tsx` | 볼륨 목록 |
| `/compute/volumes/:id` | `thaki-cloud/src/pages/VolumeDetailPage.tsx` | 볼륨 상세 |

### Volume Snapshots
| 라우트 | 파일 경로 | 설명 |
|--------|-----------|------|
| `/compute/volume-snapshots` | `thaki-cloud/src/pages/VolumeSnapshotsPage.tsx` | 볼륨 스냅샷 목록 |
| `/compute/volume-snapshots/:id` | `thaki-cloud/src/pages/VolumeSnapshotDetailPage.tsx` | 볼륨 스냅샷 상세 |

### Volume Backups
| 라우트 | 파일 경로 | 설명 |
|--------|-----------|------|
| `/compute/volume-backups` | `thaki-cloud/src/pages/VolumeBackupsPage.tsx` | 볼륨 백업 목록 |
| `/compute/volume-backups/:id` | `thaki-cloud/src/pages/VolumeBackupDetailPage.tsx` | 볼륨 백업 상세 |

### Networks
| 라우트 | 파일 경로 | 설명 |
|--------|-----------|------|
| `/compute/networks` | `thaki-cloud/src/pages/NetworksPage.tsx` | 네트워크 목록 |
| `/compute/networks/:id` | `thaki-cloud/src/pages/NetworkDetailPage.tsx` | 네트워크 상세 |
| `/compute/subnets/:id` | `thaki-cloud/src/pages/SubnetDetailPage.tsx` | 서브넷 상세 |

### Routers
| 라우트 | 파일 경로 | 설명 |
|--------|-----------|------|
| `/compute/routers` | `thaki-cloud/src/pages/RoutersPage.tsx` | 라우터 목록 |
| `/compute/routers/:id` | `thaki-cloud/src/pages/RouterDetailPage.tsx` | 라우터 상세 |

### Ports
| 라우트 | 파일 경로 | 설명 |
|--------|-----------|------|
| `/compute/ports` | `thaki-cloud/src/pages/PortsPage.tsx` | 포트 목록 |
| `/compute/ports/:id` | `thaki-cloud/src/pages/PortDetailPage.tsx` | 포트 상세 |

### Floating IPs
| 라우트 | 파일 경로 | 설명 |
|--------|-----------|------|
| `/compute/floating-ips` | `thaki-cloud/src/pages/FloatingIPsPage.tsx` | Floating IP 목록 |
| `/compute/floating-ips/:id` | `thaki-cloud/src/pages/FloatingIPDetailPage.tsx` | Floating IP 상세 |

### Security Groups
| 라우트 | 파일 경로 | 설명 |
|--------|-----------|------|
| `/compute/security-groups` | `thaki-cloud/src/pages/SecurityGroupsPage.tsx` | 보안 그룹 목록 |
| `/compute/security-groups/:id` | `thaki-cloud/src/pages/SecurityGroupDetailPage.tsx` | 보안 그룹 상세 |

### Load Balancers
| 라우트 | 파일 경로 | 설명 |
|--------|-----------|------|
| `/compute/load-balancers` | `thaki-cloud/src/pages/LoadBalancersPage.tsx` | 로드 밸런서 목록 |
| `/compute/load-balancers/:id` | `thaki-cloud/src/pages/LoadBalancerDetailPage.tsx` | 로드 밸런서 상세 |
| `/compute/listeners/:id` | `thaki-cloud/src/pages/ListenerDetailPage.tsx` | 리스너 상세 |
| `/compute/pools/:id` | `thaki-cloud/src/pages/PoolDetailPage.tsx` | 풀 상세 |
| `/compute/l7-policies/:id` | `thaki-cloud/src/pages/L7PolicyDetailPage.tsx` | L7 정책 상세 |

### Certificates
| 라우트 | 파일 경로 | 설명 |
|--------|-----------|------|
| `/compute/certificates` | `thaki-cloud/src/pages/CertificatesPage.tsx` | 인증서 목록 |
| `/compute/certificates/:id` | `thaki-cloud/src/pages/CertificateDetailPage.tsx` | 인증서 상세 |

### Topology & Console
| 라우트 | 파일 경로 | 설명 |
|--------|-----------|------|
| `/compute/topology` | `thaki-cloud/src/pages/TopologyD3Page.tsx` | 네트워크 토폴로지 |
| `/compute/console/:instanceId` | `thaki-cloud/src/pages/ConsolePage.tsx` | 인스턴스 콘솔 |

---

## 4. Storage Routes

| 라우트 | 파일 경로 | 설명 |
|--------|-----------|------|
| `/storage` | `thaki-cloud/src/pages/StorageHomePage.tsx` | Storage 홈 |
| `/storage/pools` | `thaki-cloud/src/pages/PoolsPage.tsx` | Storage 풀 목록 |
| `/storage/pools/:id` | `thaki-cloud/src/pages/StoragePoolDetailPage.tsx` | Storage 풀 상세 |
| `/storage/hosts` | `thaki-cloud/src/pages/HostsPage.tsx` | 호스트 목록 |
| `/storage/hosts/:id` | `thaki-cloud/src/pages/HostDetailPage.tsx` | 호스트 상세 |
| `/storage/osds` | `thaki-cloud/src/pages/OSDsPage.tsx` | OSD 목록 |
| `/storage/osds/:id` | `thaki-cloud/src/pages/OSDDetailPage.tsx` | OSD 상세 |

---

## 5. Design System Routes

| 라우트 | 파일 경로 | 설명 |
|--------|-----------|------|
| `/design` | `thaki-cloud/src/pages/DesignSystemPage.tsx` | 디자인 시스템 메인 |
| `/design-system` | `thaki-cloud/src/pages/DesignSystemPage.tsx` | 디자인 시스템 메인 |
| `/design/components` | `thaki-cloud/src/pages/DesignSystemPage.tsx` | 디자인 시스템 메인 |
| `/design/drawers` | `thaki-cloud/src/pages/DrawersPage.tsx` | Drawer 컴포넌트 |
| `/design/modals` | `thaki-cloud/src/pages/ModalsPage.tsx` | Modal 컴포넌트 |
| `/design/gradients` | `thaki-cloud/src/pages/GradientShowcasePage.tsx` | 그라디언트 쇼케이스 |
| `/design/colors` | `thaki-cloud/src/pages/ColorPalettePage.tsx` | 컬러 팔레트 |
| `/design/metallic` | `thaki-cloud/src/pages/MetallicPalettePage.tsx` | 메탈릭 팔레트 |

---

## 6. 기타 페이지

| 라우트 | 파일 경로 | 설명 |
|--------|-----------|------|
| `/storage` (Agent) | `thaki-cloud/src/pages/StoragePage.tsx` | Storage 페이지 (Agent 관련) |

---

## 7. Settings & Chatbot

| 컴포넌트 | 파일 경로 | 설명 |
|----------|-----------|------|
| Settings | `thaki-cloud/src/pages/SettingsPage.tsx` | 설정 페이지 (Desktop에서 모달로 열림) |
| Chatbot | `thaki-cloud/src/components/ChatbotPanel.tsx` | 챗봇 패널 (Desktop에서 슬라이드 패널로 열림) |

---

## 총 페이지 수
- **총 60개 페이지 파일**이 `thaki-cloud/src/pages/` 디렉토리에 있습니다.

