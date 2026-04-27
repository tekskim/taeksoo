import{r as Q,j as e}from"./iframe-BGa_n0Au.js";import{B as j}from"./Badge-B1AvLAuI.js";import{P as U}from"./Popover-DGO5pjYT.js";import"./preload-helper-C1FmrZbK.js";import"./cn-BMXv33oC.js";import"./index-TWFM_iTt.js";const t=Q.memo(function({items:l,maxVisible:g=2,maxBadgeWidth:i,size:m="sm",theme:v,type:f,popoverTitle:H,renderItem:y,overflowAlign:G="inline",popoverMaxWidth:n}){if(l.length===0)return null;const z=l.slice(0,g),h=l.length-g,F=136,J=12,K=6.6,N=l.some(s=>s.length*K+J>F),M=(s,r,Y)=>y?y(s,r):e.jsx(j,{size:m,theme:v,type:f,className:i?void 0:"shrink-0",style:i?{maxWidth:i}:void 0,title:i?s:void 0,children:i?e.jsx("span",{className:"block truncate",children:s}):s},r);return e.jsxs("div",{"data-figma-name":"[TDS] BadgeList",className:`flex flex-nowrap gap-1 items-center${G==="right"&&h>0?" w-full justify-between":""}`,children:[z.map((s,r)=>M(s,r)),h>0&&e.jsx(U,{trigger:"hover",position:"top",delay:100,hideDelay:100,content:e.jsxs("div",{className:`p-3 ${n?"":"max-w-[320px]"} ${N||n?"":"min-w-[160px]"}`,style:n?{maxWidth:n}:void 0,children:[e.jsx("div",{className:"text-body-xs font-medium text-[var(--color-text-muted)] mb-2 whitespace-nowrap",children:H??`All items (${l.length})`}),e.jsx("div",{className:`flex gap-1 items-start ${N||n?"flex-col":"flex-wrap min-w-[136px]"}`,children:l.map((s,r)=>e.jsx(j,{size:m,theme:v,type:f,className:"shrink-0 whitespace-nowrap",children:s},r))})]}),children:e.jsxs("span",{className:`inline-flex shrink-0 items-center justify-center px-1.5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] cursor-pointer hover:bg-[var(--color-surface-muted)] transition-colors ${m==="sm"?"h-5":m==="md"?"h-6":"h-7"}`,children:["+",h]})})]})});t.__docgenInfo={description:"",methods:[],displayName:"BadgeList",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:"Array of badge items to display"},maxVisible:{required:!1,tsType:{name:"number"},description:"Maximum number of badges to show before collapsing",defaultValue:{value:"2",computed:!1}},maxBadgeWidth:{required:!1,tsType:{name:"string"},description:"Max width per badge — enables truncation with ellipsis for long text (e.g. '120px')"},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"}]},description:"Badge size",defaultValue:{value:"'sm'",computed:!1}},theme:{required:!1,tsType:{name:"union",raw:"'blue' | 'red' | 'green' | 'yellow' | 'gray' | 'white'",elements:[{name:"literal",value:"'blue'"},{name:"literal",value:"'red'"},{name:"literal",value:"'green'"},{name:"literal",value:"'yellow'"},{name:"literal",value:"'gray'"},{name:"literal",value:"'white'"}]},description:"Badge theme"},type:{required:!1,tsType:{name:"literal",value:"'subtle'"},description:"Badge type"},popoverTitle:{required:!1,tsType:{name:"string"},description:"Popover title when showing all items (default: auto-generated from count)"},renderItem:{required:!1,tsType:{name:"signature",type:"function",raw:"(item: string, index: number) => ReactNode",signature:{arguments:[{type:{name:"string"},name:"item"},{type:{name:"number"},name:"index"}],return:{name:"ReactNode"}}},description:"Custom render for each badge item"},overflowAlign:{required:!1,tsType:{name:"union",raw:"'inline' | 'right'",elements:[{name:"literal",value:"'inline'"},{name:"literal",value:"'right'"}]},description:"Align the +N overflow trigger to the right, pushing it away from the badges",defaultValue:{value:"'inline'",computed:!1}},popoverMaxWidth:{required:!1,tsType:{name:"string"},description:"Max width of the popover content (e.g. '160px'). Overrides the default 320px."}}};const re={title:"Components/BadgeList",component:t,tags:["autodocs"],parameters:{docs:{description:{component:`
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
        `}}},argTypes:{maxVisible:{control:{type:"number",min:1,max:10},description:"표시할 최대 뱃지 수",table:{defaultValue:{summary:"2"}}},maxBadgeWidth:{control:"text",description:"개별 뱃지 최대 너비 (truncation용)",table:{type:{summary:"string"}}},size:{control:"select",options:["sm","md","lg"],description:"뱃지 크기",table:{defaultValue:{summary:'"sm"'}}},theme:{control:"select",options:["white","blue","red","green","yellow","gray"],description:"뱃지 테마"},type:{table:{disable:!0},description:"뱃지 타입 (deprecated)"},popoverTitle:{control:"text",description:"Popover 헤더 제목"}}},a=["osd.1","osd.2","osd.3","osd.4"],o=["app=nginx","env=production","team=platform","version=v2.1.0","region=ap-northeast-2"],V=["kubernetes.io/metadata.name=kube-system","node.kubernetes.io/instance-type=m5.xlarge","topology.kubernetes.io/zone=ap-northeast-2a"],d={args:{items:a,maxVisible:2}},x={render:()=>e.jsx(t,{items:["osd.1","osd.2"],maxVisible:2})},c={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"maxVisible=2 (기본)"}),e.jsx(t,{items:a,maxVisible:2,popoverTitle:`All OSDs (${a.length})`})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"maxVisible=1"}),e.jsx(t,{items:a,maxVisible:1,popoverTitle:`All OSDs (${a.length})`})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"maxVisible=3"}),e.jsx(t,{items:a,maxVisible:3,popoverTitle:`All OSDs (${a.length})`})]})]})},p={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:'maxBadgeWidth="72px" — 중간 길이 라벨'}),e.jsx(t,{items:o,maxVisible:2,maxBadgeWidth:"72px",popoverTitle:`All Labels (${o.length})`})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:'maxBadgeWidth="140px", maxVisible=1 — 긴 어노테이션'}),e.jsx(t,{items:V,maxVisible:1,maxBadgeWidth:"140px",popoverTitle:`All Annotations (${V.length})`})]})]})},b={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:'theme="blue" type="subtle"'}),e.jsx(t,{items:o,maxVisible:2,theme:"blue",type:"subtle"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:'theme="green" type="subtle"'}),e.jsx(t,{items:a,maxVisible:2,theme:"green",type:"subtle"})]})]})},u={render:()=>e.jsx("div",{className:"border border-[var(--color-border-default)] rounded-[var(--radius-lg)]",children:e.jsxs("table",{className:"w-full text-body-md",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-[var(--color-border-default)]",children:[e.jsx("th",{className:"text-left text-label-sm text-[var(--color-text-subtle)] py-2 px-3 w-[140px]",children:"Name"}),e.jsx("th",{className:"text-left text-label-sm text-[var(--color-text-subtle)] py-2 px-3 w-[200px]",children:"Labels"}),e.jsx("th",{className:"text-left text-label-sm text-[var(--color-text-subtle)] py-2 px-3 w-[160px]",children:"OSDs"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{className:"border-b border-[var(--color-border-subtle)]",children:[e.jsx("td",{className:"py-2 px-3 text-[var(--color-text-default)]",children:"node-01"}),e.jsx("td",{className:"py-2 px-3",children:e.jsx(t,{items:o,maxVisible:2,maxBadgeWidth:"72px",popoverTitle:`All Labels (${o.length})`})}),e.jsx("td",{className:"py-2 px-3",children:e.jsx(t,{items:a,maxVisible:2,popoverTitle:`All OSDs (${a.length})`})})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"py-2 px-3 text-[var(--color-text-default)]",children:"node-02"}),e.jsx("td",{className:"py-2 px-3",children:e.jsx(t,{items:["app=redis"],maxVisible:2,maxBadgeWidth:"72px"})}),e.jsx("td",{className:"py-2 px-3",children:e.jsx(t,{items:["osd.5"],maxVisible:2})})]})]})]})})};var w,B,T;d.parameters={...d.parameters,docs:{...(w=d.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    items: shortItems,
    maxVisible: 2
  }
}`,...(T=(B=d.parameters)==null?void 0:B.docs)==null?void 0:T.source}}};var L,I,A;x.parameters={...x.parameters,docs:{...(L=x.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => <BadgeList items={['osd.1', 'osd.2']} maxVisible={2} />
}`,...(A=(I=x.parameters)==null?void 0:I.docs)==null?void 0:A.source}}};var $,D,O;c.parameters={...c.parameters,docs:{...($=c.parameters)==null?void 0:$.docs,source:{originalSource:`{
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
}`,...(O=(D=c.parameters)==null?void 0:D.docs)==null?void 0:O.source}}};var S,W,q;p.parameters={...p.parameters,docs:{...(S=p.parameters)==null?void 0:S.docs,source:{originalSource:`{
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
}`,...(q=(W=p.parameters)==null?void 0:W.docs)==null?void 0:q.source}}};var k,_,P;b.parameters={...b.parameters,docs:{...(k=b.parameters)==null?void 0:k.docs,source:{originalSource:`{
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
}`,...(P=(_=b.parameters)==null?void 0:_.docs)==null?void 0:P.source}}};var C,E,R;u.parameters={...u.parameters,docs:{...(C=u.parameters)==null?void 0:C.docs,source:{originalSource:`{
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
}`,...(R=(E=u.parameters)==null?void 0:E.docs)==null?void 0:R.source}}};const ie=["Default","AllVisible","WithOverflow","WithTruncation","Themed","InTableContext"];export{x as AllVisible,d as Default,u as InTableContext,b as Themed,c as WithOverflow,p as WithTruncation,ie as __namedExportsOrder,re as default};
