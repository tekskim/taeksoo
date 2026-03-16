import{r as s,j as a}from"./iframe-iHQO5Mqm.js";import{P as n}from"./Pagination-CjNkkT32.js";import"./preload-helper-C1FmrZbK.js";import"./IconChevronLeft-D-wv1f6G.js";import"./createReactComponent-CEVQAvfZ.js";import"./IconChevronRight-Ctj-S6VH.js";import"./IconSettings-D0BAVBr7.js";const ae={title:"Components/Pagination",component:n,tags:["autodocs"],parameters:{docs:{description:{component:`
## Pagination 컴포넌트

테이블이나 목록의 페이지 네비게이션을 제공하는 컴포넌트입니다.

### 기능
- 현재 페이지 표시
- 이전/다음 페이지 이동
- 페이지 번호 직접 선택
- 총 항목 수 표시
- 선택된 항목 수 표시
- 설정 버튼 (페이지당 항목 수 변경 등)

### 페이지 범위 표시
- siblingCount: 현재 페이지 양옆에 표시할 페이지 수
- 페이지가 많으면 "..." (ellipsis) 표시

### 예시
\`\`\`tsx
import { Pagination } from '@thaki/tds';

// 기본 사용
<Pagination
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => setPage(page)}
/>

// 총 항목 수 표시
<Pagination
  currentPage={page}
  totalPages={Math.ceil(items.length / 10)}
  totalItems={items.length}
  onPageChange={setPage}
/>

// 선택 항목 수 & 설정 버튼
<Pagination
  currentPage={page}
  totalPages={10}
  totalItems={100}
  selectedCount={5}
  showSettings
  onSettingsClick={() => openSettings()}
  onPageChange={setPage}
/>
\`\`\`
        `}}},argTypes:{currentPage:{control:"number",description:"현재 페이지 (1부터 시작)",table:{type:{summary:"number"}}},totalPages:{control:"number",description:"전체 페이지 수",table:{type:{summary:"number"}}},totalItems:{control:"number",description:"전체 항목 수 (표시용)",table:{type:{summary:"number"}}},selectedCount:{control:"number",description:"선택된 항목 수",table:{type:{summary:"number"},defaultValue:{summary:"0"}}},siblingCount:{control:"number",description:"현재 페이지 양옆에 표시할 페이지 수",table:{type:{summary:"number"},defaultValue:{summary:"1"}}},disabled:{control:"boolean",description:"전체 비활성화",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},showSettings:{control:"boolean",description:"설정 버튼 표시",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}}},o={render:function(){const[e,t]=s.useState(1);return a.jsx(n,{currentPage:e,totalPages:10,onPageChange:t})}},g={render:function(){const[e,t]=s.useState(1);return a.jsx(n,{currentPage:e,totalPages:10,totalItems:100,onPageChange:t})}},c={render:function(){const[e,t]=s.useState(1);return a.jsx(n,{currentPage:e,totalPages:10,totalItems:100,selectedCount:5,onPageChange:t})}},i={render:function(){const[e,t]=s.useState(1);return a.jsx(n,{currentPage:e,totalPages:10,totalItems:100,showSettings:!0,onSettingsClick:()=>alert("Settings clicked!"),onPageChange:t})}},u={render:function(){const[e,t]=s.useState(25);return a.jsx(n,{currentPage:e,totalPages:100,totalItems:1e3,onPageChange:t})}},l={render:function(){const[e,t]=s.useState(1);return a.jsx(n,{currentPage:e,totalPages:3,totalItems:30,onPageChange:t})}},P={render:function(){const[e,t]=s.useState(1);return a.jsx(n,{currentPage:e,totalPages:10,onPageChange:t})}},m={render:function(){const[e,t]=s.useState(10);return a.jsx(n,{currentPage:e,totalPages:10,onPageChange:t})}},p={render:()=>a.jsx(n,{currentPage:5,totalPages:10,disabled:!0,onPageChange:()=>{}})},d={render:function(){const[e,t]=s.useState(5),[K,S]=s.useState(3);return a.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[a.jsx(n,{currentPage:e,totalPages:20,totalItems:200,selectedCount:K,showSettings:!0,onSettingsClick:()=>alert("Open settings"),onPageChange:t}),a.jsxs("div",{className:"flex gap-[var(--primitive-spacing-4)] text-body-md",children:[a.jsx("button",{className:"text-[var(--color-action-primary)]",onClick:()=>S(Q=>Q+1),children:"Select more"}),a.jsx("button",{className:"text-[var(--color-action-primary)]",onClick:()=>S(0),children:"Clear selection"})]})]})}};var h,C,f;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: function DefaultPagination() {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
  }
}`,...(f=(C=o.parameters)==null?void 0:C.docs)==null?void 0:f.source}}};var b,x,y;g.parameters={...g.parameters,docs:{...(b=g.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: function WithTotalItems() {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} totalItems={100} onPageChange={setPage} />;
  }
}`,...(y=(x=g.parameters)==null?void 0:x.docs)==null?void 0:y.source}}};var I,v,j;c.parameters={...c.parameters,docs:{...(I=c.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: function WithSelection() {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} totalItems={100} selectedCount={5} onPageChange={setPage} />;
  }
}`,...(j=(v=c.parameters)==null?void 0:v.docs)==null?void 0:j.source}}};var k,F,W;i.parameters={...i.parameters,docs:{...(k=i.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: function WithSettings() {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} totalItems={100} showSettings onSettingsClick={() => alert('Settings clicked!')} onPageChange={setPage} />;
  }
}`,...(W=(F=i.parameters)==null?void 0:F.docs)==null?void 0:W.source}}};var w,N,E;u.parameters={...u.parameters,docs:{...(w=u.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: function ManyPages() {
    const [page, setPage] = useState(25);
    return <Pagination currentPage={page} totalPages={100} totalItems={1000} onPageChange={setPage} />;
  }
}`,...(E=(N=u.parameters)==null?void 0:N.docs)==null?void 0:E.source}}};var D,M,T;l.parameters={...l.parameters,docs:{...(D=l.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: function FewPages() {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={3} totalItems={30} onPageChange={setPage} />;
  }
}`,...(T=(M=l.parameters)==null?void 0:M.docs)==null?void 0:T.source}}};var L,V,O;P.parameters={...P.parameters,docs:{...(L=P.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: function FirstPage() {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
  }
}`,...(O=(V=P.parameters)==null?void 0:V.docs)==null?void 0:O.source}}};var _,R,q;m.parameters={...m.parameters,docs:{...(_=m.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: function LastPage() {
    const [page, setPage] = useState(10);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
  }
}`,...(q=(R=m.parameters)==null?void 0:R.docs)==null?void 0:q.source}}};var z,A,B;p.parameters={...p.parameters,docs:{...(z=p.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => <Pagination currentPage={5} totalPages={10} disabled onPageChange={() => {}} />
}`,...(B=(A=p.parameters)==null?void 0:A.docs)==null?void 0:B.source}}};var G,H,J;d.parameters={...d.parameters,docs:{...(G=d.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: function FullExample() {
    const [page, setPage] = useState(5);
    const [selectedCount, setSelectedCount] = useState(3);
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        <Pagination currentPage={page} totalPages={20} totalItems={200} selectedCount={selectedCount} showSettings onSettingsClick={() => alert('Open settings')} onPageChange={setPage} />
        <div className="flex gap-[var(--primitive-spacing-4)] text-body-md">
          <button className="text-[var(--color-action-primary)]" onClick={() => setSelectedCount(s => s + 1)}>
            Select more
          </button>
          <button className="text-[var(--color-action-primary)]" onClick={() => setSelectedCount(0)}>
            Clear selection
          </button>
        </div>
      </div>;
  }
}`,...(J=(H=d.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};const ne=["Default","WithTotalItems","WithSelection","WithSettings","ManyPages","FewPages","FirstPage","LastPage","Disabled","FullExample"];export{o as Default,p as Disabled,l as FewPages,P as FirstPage,d as FullExample,m as LastPage,u as ManyPages,c as WithSelection,i as WithSettings,g as WithTotalItems,ne as __namedExportsOrder,ae as default};
