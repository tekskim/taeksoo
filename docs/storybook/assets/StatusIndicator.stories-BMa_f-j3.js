import{j as e}from"./iframe-B4qQhCO6.js";import{S as a}from"./StatusIndicator-BUC_wwEA.js";import"./preload-helper-C1FmrZbK.js";import"./bundle-mjs-BZSatpsL.js";import"./createReactComponent-Bds5dDb0.js";import"./IconEdit-DTriKS-t.js";import"./IconTool-WwUgVS44.js";import"./IconCircleX-DBNXelDr.js";import"./IconAlertTriangle-DnJGkjE4.js";const we={title:"Components/StatusIndicator",component:a,parameters:{layout:"centered",docs:{description:{component:"리소스나 작업의 상태를 시각적으로 표시하는 컴포넌트입니다."}}},tags:["autodocs"],argTypes:{status:{control:"select",options:["active","error","building","deleting","suspended","shelved","shelved-offloaded","mounted","shutoff","paused","pending","draft","verify-resized","deactivated","in-use","maintenance","degraded","no-monitor","down"],description:"상태 유형"},layout:{control:"select",options:["icon-only","default","badge"],description:"레이아웃 유형"},size:{control:"select",options:["sm","md","lg"],description:"크기 (icon-only 레이아웃에만 적용)"},label:{control:"text",description:"커스텀 라벨 (기본값 덮어쓰기)"}}},s={args:{status:"active",layout:"default"}},t={args:{status:"error",layout:"default"}},r={args:{status:"building",layout:"default"}},o={args:{status:"pending",layout:"default"}},d={name:"Layout - Icon Only",args:{status:"active",layout:"icon-only",size:"md"}},l={name:"Layout - Default (Pill)",args:{status:"active",layout:"default"}},n={name:"Layout - Badge",args:{status:"active",layout:"badge"}},c={name:"All Sizes (Icon Only)",render:()=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(a,{status:"active",layout:"icon-only",size:"sm"}),e.jsx("span",{className:"text-xs text-gray-500",children:"sm"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(a,{status:"active",layout:"icon-only",size:"md"}),e.jsx("span",{className:"text-xs text-gray-500",children:"md"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(a,{status:"active",layout:"icon-only",size:"lg"}),e.jsx("span",{className:"text-xs text-gray-500",children:"lg"})]})]})},u={name:"Category - Success (Green)",render:()=>e.jsx("div",{className:"flex flex-col gap-3",children:e.jsx(a,{status:"active",layout:"default"})})},i={name:"Category - Danger (Red)",render:()=>e.jsx("div",{className:"flex flex-col gap-3",children:e.jsx(a,{status:"error",layout:"default"})})},m={name:"Category - Info (Blue)",render:()=>e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(a,{status:"building",layout:"default"}),e.jsx(a,{status:"deleting",layout:"default"})]})},p={name:"Category - Warning (Orange)",render:()=>e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(a,{status:"verify-resized",layout:"default"}),e.jsx(a,{status:"degraded",layout:"default"}),e.jsx(a,{status:"no-monitor",layout:"default"})]})},y={name:"Category - Muted (Gray)",render:()=>e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsx(a,{status:"suspended",layout:"default"}),e.jsx(a,{status:"shelved",layout:"default"}),e.jsx(a,{status:"mounted",layout:"default"}),e.jsx(a,{status:"shutoff",layout:"default"}),e.jsx(a,{status:"paused",layout:"default"}),e.jsx(a,{status:"pending",layout:"default"}),e.jsx(a,{status:"draft",layout:"default"}),e.jsx(a,{status:"deactivated",layout:"default"}),e.jsx(a,{status:"in-use",layout:"default"}),e.jsx(a,{status:"maintenance",layout:"default"}),e.jsx(a,{status:"down",layout:"default"})]})},x={name:"All Statuses",render:()=>{const fe=["active","error","building","deleting","suspended","shelved","shelved-offloaded","mounted","shutoff","paused","pending","draft","verify-resized","deactivated","in-use","maintenance","degraded","no-monitor","down"];return e.jsx("div",{className:"flex flex-col gap-4",children:e.jsx("div",{className:"grid grid-cols-3 gap-4",children:fe.map(S=>e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(a,{status:S,layout:"icon-only",size:"md"}),e.jsx(a,{status:S,layout:"default"})]},S))})})}},g={name:"With Custom Label",args:{status:"active",layout:"default",label:"Running"}},f={name:"Use Case - Instance Table",render:()=>e.jsx("div",{className:"border border-gray-200 rounded-lg overflow-hidden",children:e.jsxs("table",{className:"w-full text-sm",children:[e.jsx("thead",{className:"bg-gray-50",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-4 py-2 text-left",children:"Instance"}),e.jsx("th",{className:"px-4 py-2 text-left",children:"Status"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{className:"border-t",children:[e.jsx("td",{className:"px-4 py-2",children:"web-server-01"}),e.jsx("td",{className:"px-4 py-2",children:e.jsx(a,{status:"active",layout:"icon-only",size:"sm"})})]}),e.jsxs("tr",{className:"border-t",children:[e.jsx("td",{className:"px-4 py-2",children:"web-server-02"}),e.jsx("td",{className:"px-4 py-2",children:e.jsx(a,{status:"building",layout:"icon-only",size:"sm"})})]}),e.jsxs("tr",{className:"border-t",children:[e.jsx("td",{className:"px-4 py-2",children:"db-server-01"}),e.jsx("td",{className:"px-4 py-2",children:e.jsx(a,{status:"error",layout:"icon-only",size:"sm"})})]}),e.jsxs("tr",{className:"border-t",children:[e.jsx("td",{className:"px-4 py-2",children:"cache-server-01"}),e.jsx("td",{className:"px-4 py-2",children:e.jsx(a,{status:"shutoff",layout:"icon-only",size:"sm"})})]})]})]})})},v={name:"Use Case - Resource Card",render:()=>e.jsxs("div",{className:"border border-gray-200 rounded-lg p-4 w-64",children:[e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsx("h3",{className:"font-medium",children:"Production Server"}),e.jsx(a,{status:"active",layout:"badge"})]}),e.jsxs("div",{className:"text-sm text-gray-600",children:[e.jsx("p",{children:"CPU: 45%"}),e.jsx("p",{children:"Memory: 2.4 GB / 8 GB"}),e.jsx("p",{children:"Uptime: 15 days"})]})]})};var h,j,N;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    status: 'active',
    layout: 'default'
  }
}`,...(N=(j=s.parameters)==null?void 0:j.docs)==null?void 0:N.source}}};var b,I,z;t.parameters={...t.parameters,docs:{...(b=t.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    status: 'error',
    layout: 'default'
  }
}`,...(z=(I=t.parameters)==null?void 0:I.docs)==null?void 0:z.source}}};var C,w,L;r.parameters={...r.parameters,docs:{...(C=r.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    status: 'building',
    layout: 'default'
  }
}`,...(L=(w=r.parameters)==null?void 0:w.docs)==null?void 0:L.source}}};var B,A,O;o.parameters={...o.parameters,docs:{...(B=o.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    status: 'pending',
    layout: 'default'
  }
}`,...(O=(A=o.parameters)==null?void 0:A.docs)==null?void 0:O.source}}};var R,D,G;d.parameters={...d.parameters,docs:{...(R=d.parameters)==null?void 0:R.docs,source:{originalSource:`{
  name: 'Layout - Icon Only',
  args: {
    status: 'active',
    layout: 'icon-only',
    size: 'md'
  }
}`,...(G=(D=d.parameters)==null?void 0:D.docs)==null?void 0:G.source}}};var P,U,M;l.parameters={...l.parameters,docs:{...(P=l.parameters)==null?void 0:P.docs,source:{originalSource:`{
  name: 'Layout - Default (Pill)',
  args: {
    status: 'active',
    layout: 'default'
  }
}`,...(M=(U=l.parameters)==null?void 0:U.docs)==null?void 0:M.source}}};var T,W,E;n.parameters={...n.parameters,docs:{...(T=n.parameters)==null?void 0:T.docs,source:{originalSource:`{
  name: 'Layout - Badge',
  args: {
    status: 'active',
    layout: 'badge'
  }
}`,...(E=(W=n.parameters)==null?void 0:W.docs)==null?void 0:E.source}}};var _,k,q;c.parameters={...c.parameters,docs:{...(_=c.parameters)==null?void 0:_.docs,source:{originalSource:`{
  name: 'All Sizes (Icon Only)',
  render: () => <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <StatusIndicator status="active" layout="icon-only" size="sm" />
        <span className="text-xs text-gray-500">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <StatusIndicator status="active" layout="icon-only" size="md" />
        <span className="text-xs text-gray-500">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <StatusIndicator status="active" layout="icon-only" size="lg" />
        <span className="text-xs text-gray-500">lg</span>
      </div>
    </div>
}`,...(q=(k=c.parameters)==null?void 0:k.docs)==null?void 0:q.source}}};var F,H,J;u.parameters={...u.parameters,docs:{...(F=u.parameters)==null?void 0:F.docs,source:{originalSource:`{
  name: 'Category - Success (Green)',
  render: () => <div className="flex flex-col gap-3">
      <StatusIndicator status="active" layout="default" />
    </div>
}`,...(J=(H=u.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};var K,Q,V;i.parameters={...i.parameters,docs:{...(K=i.parameters)==null?void 0:K.docs,source:{originalSource:`{
  name: 'Category - Danger (Red)',
  render: () => <div className="flex flex-col gap-3">
      <StatusIndicator status="error" layout="default" />
    </div>
}`,...(V=(Q=i.parameters)==null?void 0:Q.docs)==null?void 0:V.source}}};var X,Y,Z;m.parameters={...m.parameters,docs:{...(X=m.parameters)==null?void 0:X.docs,source:{originalSource:`{
  name: 'Category - Info (Blue)',
  render: () => <div className="flex flex-col gap-3">
      <StatusIndicator status="building" layout="default" />
      <StatusIndicator status="deleting" layout="default" />
    </div>
}`,...(Z=(Y=m.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var $,ee,ae;p.parameters={...p.parameters,docs:{...($=p.parameters)==null?void 0:$.docs,source:{originalSource:`{
  name: 'Category - Warning (Orange)',
  render: () => <div className="flex flex-col gap-3">
      <StatusIndicator status="verify-resized" layout="default" />
      <StatusIndicator status="degraded" layout="default" />
      <StatusIndicator status="no-monitor" layout="default" />
    </div>
}`,...(ae=(ee=p.parameters)==null?void 0:ee.docs)==null?void 0:ae.source}}};var se,te,re;y.parameters={...y.parameters,docs:{...(se=y.parameters)==null?void 0:se.docs,source:{originalSource:`{
  name: 'Category - Muted (Gray)',
  render: () => <div className="flex flex-wrap gap-3">
      <StatusIndicator status="suspended" layout="default" />
      <StatusIndicator status="shelved" layout="default" />
      <StatusIndicator status="mounted" layout="default" />
      <StatusIndicator status="shutoff" layout="default" />
      <StatusIndicator status="paused" layout="default" />
      <StatusIndicator status="pending" layout="default" />
      <StatusIndicator status="draft" layout="default" />
      <StatusIndicator status="deactivated" layout="default" />
      <StatusIndicator status="in-use" layout="default" />
      <StatusIndicator status="maintenance" layout="default" />
      <StatusIndicator status="down" layout="default" />
    </div>
}`,...(re=(te=y.parameters)==null?void 0:te.docs)==null?void 0:re.source}}};var oe,de,le;x.parameters={...x.parameters,docs:{...(oe=x.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  name: 'All Statuses',
  render: () => {
    const statuses: StatusType[] = ['active', 'error', 'building', 'deleting', 'suspended', 'shelved', 'shelved-offloaded', 'mounted', 'shutoff', 'paused', 'pending', 'draft', 'verify-resized', 'deactivated', 'in-use', 'maintenance', 'degraded', 'no-monitor', 'down'];
    return <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-4">
          {statuses.map(status => <div key={status} className="flex items-center gap-3">
              <StatusIndicator status={status} layout="icon-only" size="md" />
              <StatusIndicator status={status} layout="default" />
            </div>)}
        </div>
      </div>;
  }
}`,...(le=(de=x.parameters)==null?void 0:de.docs)==null?void 0:le.source}}};var ne,ce,ue;g.parameters={...g.parameters,docs:{...(ne=g.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  name: 'With Custom Label',
  args: {
    status: 'active',
    layout: 'default',
    label: 'Running'
  }
}`,...(ue=(ce=g.parameters)==null?void 0:ce.docs)==null?void 0:ue.source}}};var ie,me,pe;f.parameters={...f.parameters,docs:{...(ie=f.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  name: 'Use Case - Instance Table',
  render: () => <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Instance</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="px-4 py-2">web-server-01</td>
            <td className="px-4 py-2">
              <StatusIndicator status="active" layout="icon-only" size="sm" />
            </td>
          </tr>
          <tr className="border-t">
            <td className="px-4 py-2">web-server-02</td>
            <td className="px-4 py-2">
              <StatusIndicator status="building" layout="icon-only" size="sm" />
            </td>
          </tr>
          <tr className="border-t">
            <td className="px-4 py-2">db-server-01</td>
            <td className="px-4 py-2">
              <StatusIndicator status="error" layout="icon-only" size="sm" />
            </td>
          </tr>
          <tr className="border-t">
            <td className="px-4 py-2">cache-server-01</td>
            <td className="px-4 py-2">
              <StatusIndicator status="shutoff" layout="icon-only" size="sm" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
}`,...(pe=(me=f.parameters)==null?void 0:me.docs)==null?void 0:pe.source}}};var ye,xe,ge;v.parameters={...v.parameters,docs:{...(ye=v.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  name: 'Use Case - Resource Card',
  render: () => <div className="border border-gray-200 rounded-lg p-4 w-64">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Production Server</h3>
        <StatusIndicator status="active" layout="badge" />
      </div>
      <div className="text-sm text-gray-600">
        <p>CPU: 45%</p>
        <p>Memory: 2.4 GB / 8 GB</p>
        <p>Uptime: 15 days</p>
      </div>
    </div>
}`,...(ge=(xe=v.parameters)==null?void 0:xe.docs)==null?void 0:ge.source}}};const Le=["Active","Error","Building","Pending","IconOnly","DefaultLayout","BadgeLayout","AllSizes","SuccessStatuses","DangerStatuses","InfoStatuses","WarningStatuses","MutedStatuses","AllStatuses","CustomLabel","InstanceTable","ResourceCard"];export{s as Active,c as AllSizes,x as AllStatuses,n as BadgeLayout,r as Building,g as CustomLabel,i as DangerStatuses,l as DefaultLayout,t as Error,d as IconOnly,m as InfoStatuses,f as InstanceTable,y as MutedStatuses,o as Pending,v as ResourceCard,u as SuccessStatuses,p as WarningStatuses,Le as __namedExportsOrder,we as default};
