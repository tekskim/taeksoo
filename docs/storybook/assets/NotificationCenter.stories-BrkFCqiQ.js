import{r as M,j as e}from"./iframe-WEp3SeCx.js";import{c as Y}from"./createReactComponent-d6NA989C.js";import{T as J,a as K,b as j}from"./Tabs-DXP_G_Lt.js";import{C as Q}from"./Chip-BYQI6qEA.js";import{I as X}from"./IconChevronUp-WievWXhl.js";import{I as Z}from"./IconChevronDown-CUuYxi-e.js";import{I as R}from"./IconCircleCheck-BCZXgjvu.js";import{I as b}from"./IconAlertCircle-CAjhK0Ed.js";import"./preload-helper-C1FmrZbK.js";import"./bundle-mjs-BZSatpsL.js";import"./IconX-DREmTxHT.js";/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=[["path",{d:"M9 11l3 3l8 -8",key:"svg-0"}],["path",{d:"M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9",key:"svg-1"}]],ae=Y("outline","checkbox","Checkbox",ee),o=({notifications:a,onMarkAsRead:r,onMarkAllAsRead:n,onNotificationClick:l,selectedId:c,onClose:i,className:d=""})=>{const[s,u]=M.useState("all"),p=a.filter(t=>s==="all"?!0:s==="unread"?!t.isRead:s==="error"?t.type==="error":!0),m=a.filter(t=>!t.isRead).length,A=a.filter(t=>t.type==="error").length;return e.jsxs("div",{className:`
        w-[360px]
        bg-[var(--color-surface-default)]
        rounded-lg
        border border-[var(--color-border-default)]
        shadow-lg
        overflow-hidden
        ${d}
      `,children:[e.jsxs("div",{className:"relative pt-3 pb-0",children:[e.jsxs("button",{type:"button",onClick:n,className:`
            absolute right-4 top-1/2 -translate-y-1/2 z-20
            flex items-center justify-center
            size-7
            rounded-md
            text-[var(--color-text-muted)]
            hover:bg-[var(--color-surface-subtle)]
            hover:text-[var(--color-text-default)]
            transition-colors
            group
          `,"aria-label":"Mark all as read",children:[e.jsx(ae,{size:16,stroke:1.5}),e.jsx("span",{className:`
            absolute top-full right-0 mt-1
            px-2 py-1
            bg-[var(--color-text-default)]
            text-[var(--color-surface-default)]
            text-body-sm
            rounded
            whitespace-nowrap
            opacity-0
            group-hover:opacity-100
            transition-opacity
            pointer-events-none
            z-10
          `,children:"Mark all as read"})]}),e.jsx(J,{value:s,onChange:u,variant:"underline",size:"sm",className:"w-full",children:e.jsxs(K,{className:"w-full px-4",children:[e.jsx(j,{value:"all",children:"All"}),e.jsxs(j,{value:"unread",children:["Unread",m>0&&e.jsxs("span",{className:"ml-1 text-[var(--color-text-muted)]",children:["(",m,")"]})]}),e.jsxs(j,{value:"error",children:["Error",A>0&&e.jsxs("span",{className:"ml-1 text-[var(--color-text-muted)]",children:["(",A,")"]})]})]})})]}),e.jsx("div",{className:"max-h-[400px] overflow-y-auto p-2 drawer-scroll",children:p.length===0?e.jsx("div",{className:"flex items-center justify-center h-[100px] text-[var(--color-text-muted)] text-body-md",children:"No notifications"}):e.jsx("div",{className:"flex flex-col gap-2",children:p.map(t=>e.jsx(re,{notification:t,isSelected:t.id===c,onMarkAsRead:r,onClick:l},t.id))})})]})},re=({notification:a,isSelected:r,onMarkAsRead:n,onClick:l})=>{var u,p;const[c,i]=M.useState(!1),d=m=>{switch(m){case"success":return e.jsx(R,{size:20,stroke:1.5,className:"text-[var(--color-state-success)]"});case"error":return e.jsx(b,{size:20,stroke:1.5,className:"text-[var(--color-state-danger)]"});case"warning":return e.jsx(b,{size:20,stroke:1.5,className:"text-[var(--color-state-warning)]"});case"info":default:return e.jsx(R,{size:20,stroke:1.5,className:"text-[var(--color-state-info)]"})}},s=a.detail&&(a.detail.code||a.detail.message);return e.jsxs("div",{className:`
        relative
        rounded-lg
        border
        transition-all
        border-[var(--color-border-default)] hover:border-[var(--color-border-strong)]
        ${a.isRead?"bg-[var(--color-surface-default)]":"bg-[var(--color-surface-subtle)]"}
      `,children:[e.jsxs("div",{onClick:()=>{a.isRead||n==null||n(a.id),l==null||l(a)},className:"flex gap-3 p-3 cursor-pointer",children:[e.jsx("div",{className:"shrink-0 pt-0.5",children:d(a.type)}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("p",{className:"text-body-md text-[var(--color-text-default)] mb-2 pr-6",children:a.message}),a.project&&e.jsx(Q,{value:a.project,variant:"default"})]}),e.jsxs("div",{className:"shrink-0 flex flex-col items-end gap-1",children:[e.jsx("div",{className:"size-6 flex items-center justify-center",children:!a.isRead&&e.jsx("div",{className:"size-2 rounded-full bg-[var(--color-action-primary)]"})}),e.jsx("span",{className:"text-body-md text-[var(--color-text-muted)]",children:a.time})]})]}),s&&e.jsxs(e.Fragment,{children:[e.jsxs("button",{type:"button",onClick:m=>{m.stopPropagation(),i(!c)},className:`
              flex items-center justify-end gap-1
              w-full px-3 py-2
              text-label-md
              text-[var(--color-text-muted)]
              hover:text-[var(--color-text-default)]
              border-t border-[var(--color-border-subtle)]
              transition-colors
            `,children:[e.jsx("span",{children:"View detail"}),c?e.jsx(X,{size:14,stroke:1.5}):e.jsx(Z,{size:14,stroke:1.5})]}),c&&e.jsx("div",{className:"px-3 pb-3",children:e.jsxs("div",{className:"p-3 bg-[var(--color-surface-subtle)] rounded-md",children:[((u=a.detail)==null?void 0:u.code)&&e.jsxs("p",{className:"text-label-md text-[var(--color-text-default)] mb-1",children:["code: ",a.detail.code]}),((p=a.detail)==null?void 0:p.message)&&e.jsx("p",{className:"text-body-md text-[var(--color-text-muted)]",children:a.detail.message})]})})]})]})};o.__docgenInfo={description:"",methods:[],displayName:"NotificationCenter",props:{notifications:{required:!0,tsType:{name:"Array",elements:[{name:"NotificationItem"}],raw:"NotificationItem[]"},description:"List of notifications"},onMarkAsRead:{required:!1,tsType:{name:"signature",type:"function",raw:"(id: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"void"}}},description:"Callback when notification is marked as read"},onMarkAllAsRead:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when all notifications are marked as read"},onNotificationClick:{required:!1,tsType:{name:"signature",type:"function",raw:"(notification: NotificationItem) => void",signature:{arguments:[{type:{name:"NotificationItem"},name:"notification"}],return:{name:"void"}}},description:"Callback when notification is clicked"},selectedId:{required:!1,tsType:{name:"string"},description:"Currently selected notification id"},onClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when panel is closed"},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};const ge={title:"Components/NotificationCenter",component:o,tags:["autodocs"],parameters:{docs:{description:{component:`
## NotificationCenter 컴포넌트

알림 목록을 표시하는 알림 센터 패널입니다.

### 특징
- 탭 필터링 (All, Unread, Error)
- 읽음/안읽음 상태 관리
- 알림 상세 정보 확장
- 프로젝트 태그 표시

### NotificationItem 구조
\`\`\`ts
interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  time: string;
  project?: string;
  isRead?: boolean;
  detail?: {
    code?: string | number;
    message?: string;
  };
}
\`\`\`

### 사용 시기
- 헤더 알림 드롭다운
- 알림 패널
- 시스템 이벤트 로그

### 예시
\`\`\`tsx
<NotificationCenter
  notifications={notifications}
  onMarkAsRead={(id) => markAsRead(id)}
  onMarkAllAsRead={() => markAllAsRead()}
/>
\`\`\`
        `}}}},N=[{id:"1",type:"success",message:'Instance "web-server-01" has been successfully created.',time:"2 min ago",project:"Production",isRead:!1},{id:"2",type:"error",message:"Failed to connect to database server.",time:"15 min ago",project:"Backend",isRead:!1,detail:{code:"ECONNREFUSED",message:"Connection refused at 10.0.1.50:5432. Please check if the database server is running."}},{id:"3",type:"warning",message:"Storage usage exceeded 80% threshold.",time:"1 hour ago",project:"Storage",isRead:!0},{id:"4",type:"info",message:"Scheduled maintenance will occur at 2:00 AM UTC.",time:"3 hours ago",isRead:!0},{id:"5",type:"success",message:"Backup completed successfully.",time:"5 hours ago",project:"Database",isRead:!0}],g={render:()=>e.jsx(o,{notifications:N,onMarkAsRead:a=>console.log("Mark as read:",a),onMarkAllAsRead:()=>console.log("Mark all as read"),onNotificationClick:a=>console.log("Clicked:",a)})},f={render:function(){const[r,n]=M.useState(N),l=i=>{n(d=>d.map(s=>s.id===i?{...s,isRead:!0}:s))},c=()=>{n(i=>i.map(d=>({...d,isRead:!0})))};return e.jsx(o,{notifications:r,onMarkAsRead:l,onMarkAllAsRead:c,onNotificationClick:i=>console.log("Clicked:",i)})}},x={render:()=>e.jsx(o,{notifications:[],onMarkAsRead:a=>console.log("Mark as read:",a),onMarkAllAsRead:()=>console.log("Mark all as read")})},k={render:()=>e.jsx(o,{notifications:N.map(a=>({...a,isRead:!0})),onMarkAsRead:a=>console.log("Mark as read:",a),onMarkAllAsRead:()=>console.log("Mark all as read")})},h={render:()=>e.jsx(o,{notifications:[{id:"1",type:"error",message:"Database connection failed",time:"5 min ago",project:"Backend",isRead:!1,detail:{code:500,message:"Internal server error occurred while connecting to the database."}},{id:"2",type:"error",message:"API rate limit exceeded",time:"10 min ago",project:"API Gateway",isRead:!1,detail:{code:429,message:"Too many requests. Please try again later."}},{id:"3",type:"error",message:"SSL certificate expired",time:"1 hour ago",project:"Security",isRead:!0}],onMarkAsRead:a=>console.log("Mark as read:",a),onMarkAllAsRead:()=>console.log("Mark all as read")})},v={render:()=>e.jsx(o,{notifications:[{id:"1",type:"error",message:'Deployment failed for service "api-gateway"',time:"2 min ago",project:"Production",isRead:!1,detail:{code:"DEPLOY_FAILED",message:"Container failed health check after 3 attempts. Last error: Connection timeout to upstream service."}},{id:"2",type:"warning",message:"High memory usage detected",time:"15 min ago",project:"Monitoring",isRead:!1,detail:{code:"MEM_HIGH",message:"Memory usage at 92%. Consider scaling up or optimizing memory-intensive processes."}}],onMarkAsRead:a=>console.log("Mark as read:",a),onMarkAllAsRead:()=>console.log("Mark all as read")})},y={render:()=>e.jsx(o,{notifications:Array.from({length:20},(a,r)=>({id:String(r+1),type:["success","error","warning","info"][r%4],message:`Notification message ${r+1}`,time:`${r+1} min ago`,project:`Project ${r%3+1}`,isRead:r>5})),onMarkAsRead:a=>console.log("Mark as read:",a),onMarkAllAsRead:()=>console.log("Mark all as read")})};var C,w,I;g.parameters={...g.parameters,docs:{...(C=g.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => <NotificationCenter notifications={sampleNotifications} onMarkAsRead={id => console.log('Mark as read:', id)} onMarkAllAsRead={() => console.log('Mark all as read')} onNotificationClick={n => console.log('Clicked:', n)} />
}`,...(I=(w=g.parameters)==null?void 0:w.docs)==null?void 0:I.source}}};var S,E,D;f.parameters={...f.parameters,docs:{...(S=f.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: function InteractiveStory() {
    const [notifications, setNotifications] = useState<NotificationItem[]>(sampleNotifications);
    const handleMarkAsRead = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? {
        ...n,
        isRead: true
      } : n));
    };
    const handleMarkAllAsRead = () => {
      setNotifications(prev => prev.map(n => ({
        ...n,
        isRead: true
      })));
    };
    return <NotificationCenter notifications={notifications} onMarkAsRead={handleMarkAsRead} onMarkAllAsRead={handleMarkAllAsRead} onNotificationClick={n => console.log('Clicked:', n)} />;
  }
}`,...(D=(E=f.parameters)==null?void 0:E.docs)==null?void 0:D.source}}};var T,z,P;x.parameters={...x.parameters,docs:{...(T=x.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => <NotificationCenter notifications={[]} onMarkAsRead={id => console.log('Mark as read:', id)} onMarkAllAsRead={() => console.log('Mark all as read')} />
}`,...(P=(z=x.parameters)==null?void 0:z.docs)==null?void 0:P.source}}};var _,L,q;k.parameters={...k.parameters,docs:{...(_=k.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => <NotificationCenter notifications={sampleNotifications.map(n => ({
    ...n,
    isRead: true
  }))} onMarkAsRead={id => console.log('Mark as read:', id)} onMarkAllAsRead={() => console.log('Mark all as read')} />
}`,...(q=(L=k.parameters)==null?void 0:L.docs)==null?void 0:q.source}}};var $,H,O;h.parameters={...h.parameters,docs:{...($=h.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <NotificationCenter notifications={[{
    id: '1',
    type: 'error',
    message: 'Database connection failed',
    time: '5 min ago',
    project: 'Backend',
    isRead: false,
    detail: {
      code: 500,
      message: 'Internal server error occurred while connecting to the database.'
    }
  }, {
    id: '2',
    type: 'error',
    message: 'API rate limit exceeded',
    time: '10 min ago',
    project: 'API Gateway',
    isRead: false,
    detail: {
      code: 429,
      message: 'Too many requests. Please try again later.'
    }
  }, {
    id: '3',
    type: 'error',
    message: 'SSL certificate expired',
    time: '1 hour ago',
    project: 'Security',
    isRead: true
  }]} onMarkAsRead={id => console.log('Mark as read:', id)} onMarkAllAsRead={() => console.log('Mark all as read')} />
}`,...(O=(H=h.parameters)==null?void 0:H.docs)==null?void 0:O.source}}};var F,U,B;v.parameters={...v.parameters,docs:{...(F=v.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <NotificationCenter notifications={[{
    id: '1',
    type: 'error',
    message: 'Deployment failed for service "api-gateway"',
    time: '2 min ago',
    project: 'Production',
    isRead: false,
    detail: {
      code: 'DEPLOY_FAILED',
      message: 'Container failed health check after 3 attempts. Last error: Connection timeout to upstream service.'
    }
  }, {
    id: '2',
    type: 'warning',
    message: 'High memory usage detected',
    time: '15 min ago',
    project: 'Monitoring',
    isRead: false,
    detail: {
      code: 'MEM_HIGH',
      message: 'Memory usage at 92%. Consider scaling up or optimizing memory-intensive processes.'
    }
  }]} onMarkAsRead={id => console.log('Mark as read:', id)} onMarkAllAsRead={() => console.log('Mark all as read')} />
}`,...(B=(U=v.parameters)==null?void 0:U.docs)==null?void 0:B.source}}};var G,V,W;y.parameters={...y.parameters,docs:{...(G=y.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => <NotificationCenter notifications={Array.from({
    length: 20
  }, (_, i) => ({
    id: String(i + 1),
    type: (['success', 'error', 'warning', 'info'] as const)[i % 4],
    message: \`Notification message \${i + 1}\`,
    time: \`\${i + 1} min ago\`,
    project: \`Project \${i % 3 + 1}\`,
    isRead: i > 5
  }))} onMarkAsRead={id => console.log('Mark as read:', id)} onMarkAllAsRead={() => console.log('Mark all as read')} />
}`,...(W=(V=y.parameters)==null?void 0:V.docs)==null?void 0:W.source}}};const fe=["Default","Interactive","EmptyState","AllRead","OnlyErrors","WithDetails","ManyNotifications"];export{k as AllRead,g as Default,x as EmptyState,f as Interactive,y as ManyNotifications,h as OnlyErrors,v as WithDetails,fe as __namedExportsOrder,ge as default};
