import{r as z,j as e}from"./iframe-CzLct1Ct.js";import{B as y}from"./Badge-PfS4B4C-.js";import{P as F}from"./Popover-CiVs5XO8.js";import"./preload-helper-C1FmrZbK.js";import"./cn-BMXv33oC.js";import"./index-CZa75-BM.js";const t=z.memo(function({items:r,maxVisible:u=2,maxBadgeWidth:i,size:n="sm",theme:h,type:g,popoverTitle:E,renderItem:v}){if(r.length===0)return null;const R=r.slice(0,u),f=r.length-u,M=(a,l,H)=>v?v(a,l):e.jsx(y,{size:n,theme:h,type:g,className:i?void 0:"shrink-0",style:i?{maxWidth:i}:void 0,title:i?a:void 0,children:i?e.jsx("span",{className:"block truncate",children:a}):a},l);return e.jsxs("div",{"data-figma-name":"[TDS] BadgeList",className:"flex flex-nowrap gap-1 items-center",children:[R.map((a,l)=>M(a,l)),f>0&&e.jsx(F,{trigger:"hover",position:"top",delay:100,hideDelay:100,content:e.jsxs("div",{className:"p-3 min-w-[120px] max-w-[320px]",children:[e.jsx("div",{className:"text-body-xs font-medium text-[var(--color-text-muted)] mb-2",children:E??`All items (${r.length})`}),e.jsx("div",{className:"flex flex-col gap-1",children:r.map((a,l)=>e.jsx(y,{size:n,theme:h,type:g,className:"w-fit max-w-full",children:e.jsx("span",{className:"break-all",children:a})},l))})]}),children:e.jsxs("span",{className:`inline-flex shrink-0 items-center justify-center px-1.5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] cursor-pointer hover:bg-[var(--color-surface-muted)] transition-colors ${n==="sm"?"h-5":n==="md"?"h-6":"h-7"}`,children:["+",f]})})]})});t.__docgenInfo={description:"",methods:[],displayName:"BadgeList",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:"Array of badge items to display"},maxVisible:{required:!1,tsType:{name:"number"},description:"Maximum number of badges to show before collapsing",defaultValue:{value:"2",computed:!1}},maxBadgeWidth:{required:!1,tsType:{name:"string"},description:"Max width per badge — enables truncation with ellipsis for long text (e.g. '120px')"},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"}]},description:"Badge size",defaultValue:{value:"'sm'",computed:!1}},theme:{required:!1,tsType:{name:"union",raw:"'blue' | 'red' | 'green' | 'yellow' | 'gray' | 'white'",elements:[{name:"literal",value:"'blue'"},{name:"literal",value:"'red'"},{name:"literal",value:"'green'"},{name:"literal",value:"'yellow'"},{name:"literal",value:"'gray'"},{name:"literal",value:"'white'"}]},description:"Badge theme"},type:{required:!1,tsType:{name:"union",raw:"'solid' | 'subtle'",elements:[{name:"literal",value:"'solid'"},{name:"literal",value:"'subtle'"}]},description:"Badge type"},popoverTitle:{required:!1,tsType:{name:"string"},description:"Popover title when showing all items (default: auto-generated from count)"},renderItem:{required:!1,tsType:{name:"signature",type:"function",raw:"(item: string, index: number) => ReactNode",signature:{arguments:[{type:{name:"string"},name:"item"},{type:{name:"number"},name:"index"}],return:{name:"ReactNode"}}},description:"Custom render for each badge item"}}};const Z={title:"Components/BadgeList",component:t,tags:["autodocs"],parameters:{docs:{description:{component:`
## BadgeList 컴포넌트

테이블 셀 등에서 배열 데이터를 뱃지로 렌더링할 때 사용합니다.
\`maxVisible\` 개수 초과 시 \`+N\` 트리거로 Popover에 전체 목록을 표시합니다.

### 사용 규칙
- 뱃지가 2개 이상 될 수 있는 컬럼은 반드시 \`BadgeList\` 사용
- \`flex-wrap\`으로 직접 나열하는 패턴 금지 (행 높이 일관성 깨짐)
- 기본 \`maxVisible\`은 2

### 예시
\`\`\`tsx
import { BadgeList } from '@thaki/tds';

<BadgeList items={['osd.1', 'osd.2', 'osd.3']} maxVisible={2} />
<BadgeList items={labels} maxVisible={2} maxBadgeWidth="72px" />
\`\`\`
        `}}},argTypes:{maxVisible:{control:{type:"number",min:1,max:10},description:"표시할 최대 뱃지 수",table:{defaultValue:{summary:"2"}}},maxBadgeWidth:{control:"text",description:"개별 뱃지 최대 너비 (truncation용)",table:{type:{summary:"string"}}},size:{control:"select",options:["sm","md","lg"],description:"뱃지 크기",table:{defaultValue:{summary:'"sm"'}}},theme:{control:"select",options:["white","blue","red","green","yellow","gray"],description:"뱃지 테마"},type:{control:"select",options:["solid","subtle"],description:"뱃지 타입"},popoverTitle:{control:"text",description:"Popover 헤더 제목"}}},s=["osd.1","osd.2","osd.3","osd.4"],o=["app=nginx","env=production","team=platform","version=v2.1.0","region=ap-northeast-2"],N=["kubernetes.io/metadata.name=kube-system","node.kubernetes.io/instance-type=m5.xlarge","topology.kubernetes.io/zone=ap-northeast-2a"],m={args:{items:s,maxVisible:2}},d={render:()=>e.jsx(t,{items:["osd.1","osd.2"],maxVisible:2})},x={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"maxVisible=2 (기본)"}),e.jsx(t,{items:s,maxVisible:2,popoverTitle:`All OSDs (${s.length})`})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"maxVisible=1"}),e.jsx(t,{items:s,maxVisible:1,popoverTitle:`All OSDs (${s.length})`})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"maxVisible=3"}),e.jsx(t,{items:s,maxVisible:3,popoverTitle:`All OSDs (${s.length})`})]})]})},c={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:'maxBadgeWidth="72px" — 중간 길이 라벨'}),e.jsx(t,{items:o,maxVisible:2,maxBadgeWidth:"72px",popoverTitle:`All Labels (${o.length})`})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:'maxBadgeWidth="140px", maxVisible=1 — 긴 어노테이션'}),e.jsx(t,{items:N,maxVisible:1,maxBadgeWidth:"140px",popoverTitle:`All Annotations (${N.length})`})]})]})},p={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:'theme="blue" type="subtle"'}),e.jsx(t,{items:o,maxVisible:2,theme:"blue",type:"subtle"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:'theme="green" type="subtle"'}),e.jsx(t,{items:s,maxVisible:2,theme:"green",type:"subtle"})]})]})},b={render:()=>e.jsx("div",{className:"border border-[var(--color-border-default)] rounded-[var(--radius-lg)]",children:e.jsxs("table",{className:"w-full text-body-md",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-[var(--color-border-default)]",children:[e.jsx("th",{className:"text-left text-label-sm text-[var(--color-text-subtle)] py-2 px-3 w-[140px]",children:"Name"}),e.jsx("th",{className:"text-left text-label-sm text-[var(--color-text-subtle)] py-2 px-3 w-[200px]",children:"Labels"}),e.jsx("th",{className:"text-left text-label-sm text-[var(--color-text-subtle)] py-2 px-3 w-[160px]",children:"OSDs"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{className:"border-b border-[var(--color-border-subtle)]",children:[e.jsx("td",{className:"py-2 px-3 text-[var(--color-text-default)]",children:"node-01"}),e.jsx("td",{className:"py-2 px-3",children:e.jsx(t,{items:o,maxVisible:2,maxBadgeWidth:"72px",popoverTitle:`All Labels (${o.length})`})}),e.jsx("td",{className:"py-2 px-3",children:e.jsx(t,{items:s,maxVisible:2,popoverTitle:`All OSDs (${s.length})`})})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"py-2 px-3 text-[var(--color-text-default)]",children:"node-02"}),e.jsx("td",{className:"py-2 px-3",children:e.jsx(t,{items:["app=redis"],maxVisible:2,maxBadgeWidth:"72px"})}),e.jsx("td",{className:"py-2 px-3",children:e.jsx(t,{items:["osd.5"],maxVisible:2})})]})]})]})})};var j,V,B;m.parameters={...m.parameters,docs:{...(j=m.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    items: shortItems,
    maxVisible: 2
  }
}`,...(B=(V=m.parameters)==null?void 0:V.docs)==null?void 0:B.source}}};var w,T,L;d.parameters={...d.parameters,docs:{...(w=d.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <BadgeList items={['osd.1', 'osd.2']} maxVisible={2} />
}`,...(L=(T=d.parameters)==null?void 0:T.docs)==null?void 0:L.source}}};var I,A,S;x.parameters={...x.parameters,docs:{...(I=x.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <div>
        <p className="text-label-sm text-[var(--color-text-subtle)] mb-2">maxVisible=2 (기본)</p>
        <BadgeList items={shortItems} maxVisible={2} popoverTitle={\`All OSDs (\${shortItems.length})\`} />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-subtle)] mb-2">maxVisible=1</p>
        <BadgeList items={shortItems} maxVisible={1} popoverTitle={\`All OSDs (\${shortItems.length})\`} />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-subtle)] mb-2">maxVisible=3</p>
        <BadgeList items={shortItems} maxVisible={3} popoverTitle={\`All OSDs (\${shortItems.length})\`} />
      </div>
    </div>
}`,...(S=(A=x.parameters)==null?void 0:A.docs)==null?void 0:S.source}}};var W,$,D;c.parameters={...c.parameters,docs:{...(W=c.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <div>
        <p className="text-label-sm text-[var(--color-text-subtle)] mb-2">
          maxBadgeWidth="72px" — 중간 길이 라벨
        </p>
        <BadgeList items={labelItems} maxVisible={2} maxBadgeWidth="72px" popoverTitle={\`All Labels (\${labelItems.length})\`} />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-subtle)] mb-2">
          maxBadgeWidth="140px", maxVisible=1 — 긴 어노테이션
        </p>
        <BadgeList items={longItems} maxVisible={1} maxBadgeWidth="140px" popoverTitle={\`All Annotations (\${longItems.length})\`} />
      </div>
    </div>
}`,...(D=($=c.parameters)==null?void 0:$.docs)==null?void 0:D.source}}};var O,k,q;p.parameters={...p.parameters,docs:{...(O=p.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <div>
        <p className="text-label-sm text-[var(--color-text-subtle)] mb-2">
          theme="blue" type="subtle"
        </p>
        <BadgeList items={labelItems} maxVisible={2} theme="blue" type="subtle" />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-subtle)] mb-2">
          theme="green" type="subtle"
        </p>
        <BadgeList items={shortItems} maxVisible={2} theme="green" type="subtle" />
      </div>
    </div>
}`,...(q=(k=p.parameters)==null?void 0:k.docs)==null?void 0:q.source}}};var C,P,_;b.parameters={...b.parameters,docs:{...(C=b.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)]">
      <table className="w-full text-body-md">
        <thead>
          <tr className="border-b border-[var(--color-border-default)]">
            <th className="text-left text-label-sm text-[var(--color-text-subtle)] py-2 px-3 w-[140px]">
              Name
            </th>
            <th className="text-left text-label-sm text-[var(--color-text-subtle)] py-2 px-3 w-[200px]">
              Labels
            </th>
            <th className="text-left text-label-sm text-[var(--color-text-subtle)] py-2 px-3 w-[160px]">
              OSDs
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-[var(--color-border-subtle)]">
            <td className="py-2 px-3 text-[var(--color-text-default)]">node-01</td>
            <td className="py-2 px-3">
              <BadgeList items={labelItems} maxVisible={2} maxBadgeWidth="72px" popoverTitle={\`All Labels (\${labelItems.length})\`} />
            </td>
            <td className="py-2 px-3">
              <BadgeList items={shortItems} maxVisible={2} popoverTitle={\`All OSDs (\${shortItems.length})\`} />
            </td>
          </tr>
          <tr>
            <td className="py-2 px-3 text-[var(--color-text-default)]">node-02</td>
            <td className="py-2 px-3">
              <BadgeList items={['app=redis']} maxVisible={2} maxBadgeWidth="72px" />
            </td>
            <td className="py-2 px-3">
              <BadgeList items={['osd.5']} maxVisible={2} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
}`,...(_=(P=b.parameters)==null?void 0:P.docs)==null?void 0:_.source}}};const ee=["Default","AllVisible","WithOverflow","WithTruncation","Themed","InTableContext"];export{d as AllVisible,m as Default,b as InTableContext,p as Themed,x as WithOverflow,c as WithTruncation,ee as __namedExportsOrder,Z as default};
