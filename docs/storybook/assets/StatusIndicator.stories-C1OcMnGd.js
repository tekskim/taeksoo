import{j as e}from"./iframe-C-CGJmyb.js";import{S as a}from"./StatusIndicator-D_yeeve2.js";import"./preload-helper-C1FmrZbK.js";import"./cn-CshvV4Tc.js";import"./createReactComponent-BvK7gRRe.js";import"./IconEdit-CjR0DQkp.js";import"./IconTool-BUNkwKeS.js";import"./IconCircleX-BODwg8qV.js";import"./IconAlertTriangle-CnUs8n7p.js";const we={title:"Components/StatusIndicator",component:a,parameters:{layout:"centered",docs:{description:{component:"리소스나 작업의 상태를 시각적으로 표시하는 컴포넌트입니다."}}},tags:["autodocs"],argTypes:{status:{control:"select",options:["active","error","building","deleting","suspended","shelved","shelved-offloaded","mounted","shutoff","paused","pending","draft","verify-resized","deactivated","in-use","maintenance","degraded","no-monitor","down"],description:"상태 유형"},layout:{control:"select",options:["icon-only","default","badge"],description:"레이아웃 유형"},size:{control:"select",options:["sm","md","lg"],description:"크기 (icon-only 레이아웃에만 적용)"},label:{control:"text",description:"커스텀 라벨 (기본값 덮어쓰기)"}}},t={args:{status:"active",layout:"default"}},s={args:{status:"error",layout:"default"}},r={args:{status:"building",layout:"default"}},i={args:{status:"pending",layout:"default"}},o={name:"Layout - Icon Only",args:{status:"active",layout:"icon-only",size:"md"}},n={name:"Layout - Default (Pill)",args:{status:"active",layout:"default"}},c={name:"Layout - Badge",args:{status:"active",layout:"badge"}},d={name:"All Sizes (Icon Only)",render:()=>e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-4)]",children:[e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{status:"active",layout:"icon-only",size:"sm"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-subtle)]",children:"sm"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{status:"active",layout:"icon-only",size:"md"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-subtle)]",children:"md"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-[var(--primitive-spacing-2)]",children:[e.jsx(a,{status:"active",layout:"icon-only",size:"lg"}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-subtle)]",children:"lg"})]})]})},l={name:"Category - Success (Green)",render:()=>e.jsx("div",{className:"flex flex-col gap-[var(--primitive-spacing-3)]",children:e.jsx(a,{status:"active",layout:"default"})})},u={name:"Category - Danger (Red)",render:()=>e.jsx("div",{className:"flex flex-col gap-[var(--primitive-spacing-3)]",children:e.jsx(a,{status:"error",layout:"default"})})},p={name:"Category - Info (Blue)",render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-3)]",children:[e.jsx(a,{status:"building",layout:"default"}),e.jsx(a,{status:"deleting",layout:"default"})]})},m={name:"Category - Warning (Orange)",render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-3)]",children:[e.jsx(a,{status:"verify-resized",layout:"default"}),e.jsx(a,{status:"degraded",layout:"default"}),e.jsx(a,{status:"no-monitor",layout:"default"})]})},v={name:"Category - Muted (Gray)",render:()=>e.jsxs("div",{className:"flex flex-wrap gap-[var(--primitive-spacing-3)]",children:[e.jsx(a,{status:"suspended",layout:"default"}),e.jsx(a,{status:"shelved",layout:"default"}),e.jsx(a,{status:"mounted",layout:"default"}),e.jsx(a,{status:"shutoff",layout:"default"}),e.jsx(a,{status:"paused",layout:"default"}),e.jsx(a,{status:"pending",layout:"default"}),e.jsx(a,{status:"draft",layout:"default"}),e.jsx(a,{status:"deactivated",layout:"default"}),e.jsx(a,{status:"in-use",layout:"default"}),e.jsx(a,{status:"maintenance",layout:"default"}),e.jsx(a,{status:"down",layout:"default"})]})},g={name:"All Statuses",render:()=>{const ye=["active","error","building","deleting","suspended","shelved","shelved-offloaded","mounted","shutoff","paused","pending","draft","verify-resized","deactivated","in-use","maintenance","degraded","no-monitor","down"];return e.jsx("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:e.jsx("div",{className:"grid grid-cols-3 gap-[var(--primitive-spacing-4)]",children:ye.map(b=>e.jsxs("div",{className:"flex items-center gap-[var(--primitive-spacing-3)]",children:[e.jsx(a,{status:b,layout:"icon-only",size:"md"}),e.jsx(a,{status:b,layout:"default"})]},b))})})}},x={name:"With Custom Label",args:{status:"active",layout:"default",label:"Running"}},y={name:"Use Case - Instance Table",render:()=>e.jsx("div",{className:"border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] overflow-hidden",children:e.jsxs("table",{className:"w-full text-body-md",children:[e.jsx("thead",{className:"bg-[var(--color-surface-subtle)]",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)] text-left",children:"Instance"}),e.jsx("th",{className:"px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)] text-left",children:"Status"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{className:"border-t",children:[e.jsx("td",{className:"px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]",children:"web-server-01"}),e.jsx("td",{className:"px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]",children:e.jsx(a,{status:"active",layout:"icon-only",size:"sm"})})]}),e.jsxs("tr",{className:"border-t",children:[e.jsx("td",{className:"px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]",children:"web-server-02"}),e.jsx("td",{className:"px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]",children:e.jsx(a,{status:"building",layout:"icon-only",size:"sm"})})]}),e.jsxs("tr",{className:"border-t",children:[e.jsx("td",{className:"px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]",children:"db-server-01"}),e.jsx("td",{className:"px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]",children:e.jsx(a,{status:"error",layout:"icon-only",size:"sm"})})]}),e.jsxs("tr",{className:"border-t",children:[e.jsx("td",{className:"px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]",children:"cache-server-01"}),e.jsx("td",{className:"px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]",children:e.jsx(a,{status:"shutoff",layout:"icon-only",size:"sm"})})]})]})]})})},f={name:"Use Case - Resource Card",render:()=>e.jsxs("div",{className:"border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-[var(--primitive-spacing-4)] w-64",children:[e.jsxs("div",{className:"flex items-center justify-between mb-[var(--primitive-spacing-3)]",children:[e.jsx("h3",{className:"text-label-lg text-[var(--color-text-default)]",children:"Production Server"}),e.jsx(a,{status:"active",layout:"badge"})]}),e.jsxs("div",{className:"text-body-md text-[var(--color-text-muted)]",children:[e.jsx("p",{children:"CPU: 45%"}),e.jsx("p",{children:"Memory: 2.4 GB / 8 GB"}),e.jsx("p",{children:"Uptime: 15 days"})]})]})};var S,h,j;t.parameters={...t.parameters,docs:{...(S=t.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    status: 'active',
    layout: 'default'
  }
}`,...(j=(h=t.parameters)==null?void 0:h.docs)==null?void 0:j.source}}};var N,I,z;s.parameters={...s.parameters,docs:{...(N=s.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    status: 'error',
    layout: 'default'
  }
}`,...(z=(I=s.parameters)==null?void 0:I.docs)==null?void 0:z.source}}};var C,w,L;r.parameters={...r.parameters,docs:{...(C=r.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    status: 'building',
    layout: 'default'
  }
}`,...(L=(w=r.parameters)==null?void 0:w.docs)==null?void 0:L.source}}};var B,A,O;i.parameters={...i.parameters,docs:{...(B=i.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    status: 'pending',
    layout: 'default'
  }
}`,...(O=(A=i.parameters)==null?void 0:A.docs)==null?void 0:O.source}}};var R,D,G;o.parameters={...o.parameters,docs:{...(R=o.parameters)==null?void 0:R.docs,source:{originalSource:`{
  name: 'Layout - Icon Only',
  args: {
    status: 'active',
    layout: 'icon-only',
    size: 'md'
  }
}`,...(G=(D=o.parameters)==null?void 0:D.docs)==null?void 0:G.source}}};var P,U,M;n.parameters={...n.parameters,docs:{...(P=n.parameters)==null?void 0:P.docs,source:{originalSource:`{
  name: 'Layout - Default (Pill)',
  args: {
    status: 'active',
    layout: 'default'
  }
}`,...(M=(U=n.parameters)==null?void 0:U.docs)==null?void 0:M.source}}};var T,W,E;c.parameters={...c.parameters,docs:{...(T=c.parameters)==null?void 0:T.docs,source:{originalSource:`{
  name: 'Layout - Badge',
  args: {
    status: 'active',
    layout: 'badge'
  }
}`,...(E=(W=c.parameters)==null?void 0:W.docs)==null?void 0:E.source}}};var _,k,q;d.parameters={...d.parameters,docs:{...(_=d.parameters)==null?void 0:_.docs,source:{originalSource:`{
  name: 'All Sizes (Icon Only)',
  render: () => <div className="flex items-center gap-[var(--primitive-spacing-4)]">
      <div className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
        <StatusIndicator status="active" layout="icon-only" size="sm" />
        <span className="text-body-sm text-[var(--color-text-subtle)]">sm</span>
      </div>
      <div className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
        <StatusIndicator status="active" layout="icon-only" size="md" />
        <span className="text-body-sm text-[var(--color-text-subtle)]">md</span>
      </div>
      <div className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
        <StatusIndicator status="active" layout="icon-only" size="lg" />
        <span className="text-body-sm text-[var(--color-text-subtle)]">lg</span>
      </div>
    </div>
}`,...(q=(k=d.parameters)==null?void 0:k.docs)==null?void 0:q.source}}};var F,H,J;l.parameters={...l.parameters,docs:{...(F=l.parameters)==null?void 0:F.docs,source:{originalSource:`{
  name: 'Category - Success (Green)',
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-3)]">
      <StatusIndicator status="active" layout="default" />
    </div>
}`,...(J=(H=l.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};var K,Q,V;u.parameters={...u.parameters,docs:{...(K=u.parameters)==null?void 0:K.docs,source:{originalSource:`{
  name: 'Category - Danger (Red)',
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-3)]">
      <StatusIndicator status="error" layout="default" />
    </div>
}`,...(V=(Q=u.parameters)==null?void 0:Q.docs)==null?void 0:V.source}}};var X,Y,Z;p.parameters={...p.parameters,docs:{...(X=p.parameters)==null?void 0:X.docs,source:{originalSource:`{
  name: 'Category - Info (Blue)',
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-3)]">
      <StatusIndicator status="building" layout="default" />
      <StatusIndicator status="deleting" layout="default" />
    </div>
}`,...(Z=(Y=p.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var $,ee,ae;m.parameters={...m.parameters,docs:{...($=m.parameters)==null?void 0:$.docs,source:{originalSource:`{
  name: 'Category - Warning (Orange)',
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-3)]">
      <StatusIndicator status="verify-resized" layout="default" />
      <StatusIndicator status="degraded" layout="default" />
      <StatusIndicator status="no-monitor" layout="default" />
    </div>
}`,...(ae=(ee=m.parameters)==null?void 0:ee.docs)==null?void 0:ae.source}}};var te,se,re;v.parameters={...v.parameters,docs:{...(te=v.parameters)==null?void 0:te.docs,source:{originalSource:`{
  name: 'Category - Muted (Gray)',
  render: () => <div className="flex flex-wrap gap-[var(--primitive-spacing-3)]">
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
}`,...(re=(se=v.parameters)==null?void 0:se.docs)==null?void 0:re.source}}};var ie,oe,ne;g.parameters={...g.parameters,docs:{...(ie=g.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  name: 'All Statuses',
  render: () => {
    const statuses: StatusType[] = ['active', 'error', 'building', 'deleting', 'suspended', 'shelved', 'shelved-offloaded', 'mounted', 'shutoff', 'paused', 'pending', 'draft', 'verify-resized', 'deactivated', 'in-use', 'maintenance', 'degraded', 'no-monitor', 'down'];
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        <div className="grid grid-cols-3 gap-[var(--primitive-spacing-4)]">
          {statuses.map(status => <div key={status} className="flex items-center gap-[var(--primitive-spacing-3)]">
              <StatusIndicator status={status} layout="icon-only" size="md" />
              <StatusIndicator status={status} layout="default" />
            </div>)}
        </div>
      </div>;
  }
}`,...(ne=(oe=g.parameters)==null?void 0:oe.docs)==null?void 0:ne.source}}};var ce,de,le;x.parameters={...x.parameters,docs:{...(ce=x.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  name: 'With Custom Label',
  args: {
    status: 'active',
    layout: 'default',
    label: 'Running'
  }
}`,...(le=(de=x.parameters)==null?void 0:de.docs)==null?void 0:le.source}}};var ue,pe,me;y.parameters={...y.parameters,docs:{...(ue=y.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  name: 'Use Case - Instance Table',
  render: () => <div className="border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] overflow-hidden">
      <table className="w-full text-body-md">
        <thead className="bg-[var(--color-surface-subtle)]">
          <tr>
            <th className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)] text-left">
              Instance
            </th>
            <th className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)] text-left">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
              web-server-01
            </td>
            <td className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
              <StatusIndicator status="active" layout="icon-only" size="sm" />
            </td>
          </tr>
          <tr className="border-t">
            <td className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
              web-server-02
            </td>
            <td className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
              <StatusIndicator status="building" layout="icon-only" size="sm" />
            </td>
          </tr>
          <tr className="border-t">
            <td className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
              db-server-01
            </td>
            <td className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
              <StatusIndicator status="error" layout="icon-only" size="sm" />
            </td>
          </tr>
          <tr className="border-t">
            <td className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
              cache-server-01
            </td>
            <td className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
              <StatusIndicator status="shutoff" layout="icon-only" size="sm" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
}`,...(me=(pe=y.parameters)==null?void 0:pe.docs)==null?void 0:me.source}}};var ve,ge,xe;f.parameters={...f.parameters,docs:{...(ve=f.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  name: 'Use Case - Resource Card',
  render: () => <div className="border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-[var(--primitive-spacing-4)] w-64">
      <div className="flex items-center justify-between mb-[var(--primitive-spacing-3)]">
        <h3 className="text-label-lg text-[var(--color-text-default)]">Production Server</h3>
        <StatusIndicator status="active" layout="badge" />
      </div>
      <div className="text-body-md text-[var(--color-text-muted)]">
        <p>CPU: 45%</p>
        <p>Memory: 2.4 GB / 8 GB</p>
        <p>Uptime: 15 days</p>
      </div>
    </div>
}`,...(xe=(ge=f.parameters)==null?void 0:ge.docs)==null?void 0:xe.source}}};const Le=["Active","Error","Building","Pending","IconOnly","DefaultLayout","BadgeLayout","AllSizes","SuccessStatuses","DangerStatuses","InfoStatuses","WarningStatuses","MutedStatuses","AllStatuses","CustomLabel","InstanceTable","ResourceCard"];export{t as Active,d as AllSizes,g as AllStatuses,c as BadgeLayout,r as Building,x as CustomLabel,u as DangerStatuses,n as DefaultLayout,s as Error,o as IconOnly,p as InfoStatuses,y as InstanceTable,v as MutedStatuses,i as Pending,f as ResourceCard,l as SuccessStatuses,m as WarningStatuses,Le as __namedExportsOrder,we as default};
