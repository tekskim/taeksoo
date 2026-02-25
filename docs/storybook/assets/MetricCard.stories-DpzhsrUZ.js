import{j as e}from"./iframe-CsZHcOUf.js";import{M as t}from"./MetricCard-BsYrJ1-y.js";import"./preload-helper-C1FmrZbK.js";const j={title:"Data Display/MetricCard",component:t,parameters:{layout:"padded",docs:{description:{component:`
메트릭 값을 카드 형태로 표시하는 컴포넌트. 상세 페이지의 주요 지표나 대시보드의 요약 정보에 사용합니다.

**사용 위치:**
- Detail 페이지의 메트릭 요약
- 대시보드의 통계 카드
- 모니터링 화면의 지표 표시
        `}}},tags:["autodocs"]},r={args:{title:"Pod restarts",value:3,tooltip:"Number of times containers in this pod have been restarted."}},a={args:{title:"Total instances",value:42}},o={render:()=>e.jsxs(t.Group,{children:[e.jsx(t,{title:"Pod restarts",value:3,tooltip:"Total number of container restarts."}),e.jsx(t,{title:"CPU usage",value:"45%",tooltip:"Current CPU utilization."}),e.jsx(t,{title:"Memory usage",value:"1.2 GB",tooltip:"Current memory utilization."}),e.jsx(t,{title:"Network I/O",value:"120 MB/s",tooltip:"Current network throughput."})]})},s={render:()=>e.jsx("div",{className:"w-[240px]",children:e.jsx(t,{title:"Replicas",value:"3 / 3",tooltip:"Current available replicas / desired replicas."})})};var i,n,l;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    title: 'Pod restarts',
    value: 3,
    tooltip: 'Number of times containers in this pod have been restarted.'
  }
}`,...(l=(n=r.parameters)==null?void 0:n.docs)==null?void 0:l.source}}};var u,c,p;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    title: 'Total instances',
    value: 42
  }
}`,...(p=(c=a.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};var d,m,v;o.parameters={...o.parameters,docs:{...(d=o.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => <MetricCard.Group>
      <MetricCard title="Pod restarts" value={3} tooltip="Total number of container restarts." />
      <MetricCard title="CPU usage" value="45%" tooltip="Current CPU utilization." />
      <MetricCard title="Memory usage" value="1.2 GB" tooltip="Current memory utilization." />
      <MetricCard title="Network I/O" value="120 MB/s" tooltip="Current network throughput." />
    </MetricCard.Group>
}`,...(v=(m=o.parameters)==null?void 0:m.docs)==null?void 0:v.source}}};var C,g,x;s.parameters={...s.parameters,docs:{...(C=s.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => <div className="w-[240px]">
      <MetricCard title="Replicas" value="3 / 3" tooltip="Current available replicas / desired replicas." />
    </div>
}`,...(x=(g=s.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};const b=["Default","WithoutTooltip","Group","FixedWidth"];export{r as Default,s as FixedWidth,o as Group,a as WithoutTooltip,b as __namedExportsOrder,j as default};
