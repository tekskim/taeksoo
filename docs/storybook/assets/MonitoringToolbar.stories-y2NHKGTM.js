import{r as n,j as e}from"./iframe-B4qQhCO6.js";import{I as ue}from"./IconX-FNl1vDsy.js";import{I as he}from"./IconCalendar-B-l1ddO3.js";import{D as ge}from"./DatePicker-Badyto18.js";import{I as pe}from"./IconRefresh-DlVRkj9R.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-Bds5dDb0.js";import"./IconChevronLeft-Buw9741x.js";import"./IconChevronRight-C94sRJtJ.js";const fe=[{label:"30m",value:"30m"},{label:"1h",value:"1h"},{label:"6h",value:"6h"},{label:"12h",value:"12h"},{label:"24h",value:"24h"}],R=a=>{if(!a)return"";const r=a.getFullYear(),l=(a.getMonth()+1).toString().padStart(2,"0"),o=a.getDate().toString().padStart(2,"0");return`${r}.${l}.${o}`},m=({timeRangeOptions:a=fe,timeRange:r,defaultTimeRange:l="30m",onTimeRangeChange:o,customPeriod:g,defaultCustomPeriod:K=null,onCustomPeriodChange:s,onRefresh:Q,showRefresh:Z=!0,maxDate:ee=new Date,minDate:te,className:ae=""})=>{const p=r!==void 0,f=g!==void 0,[oe,N]=n.useState(l),[ne,D]=n.useState(K),re=p?r:oe,i=f?g:ne,[v,c]=n.useState(!1),[d,b]=n.useState(null),[u,x]=n.useState(null),[M,h]=n.useState(!0),P=n.useRef(null);n.useEffect(()=>{const t=k=>{P.current&&!P.current.contains(k.target)&&c(!1)};return v&&document.addEventListener("mousedown",t),()=>document.removeEventListener("mousedown",t)},[v]);const le=t=>{p||N(t),f||D(null),o==null||o(t),s==null||s(null)},se=()=>{if(i)b(i.start),x(i.end);else{const t=new Date,k=new Date(t.getTime()-7*24*60*60*1e3);b(k),x(t)}h(!0),c(!0)},ie=()=>{if(d&&u){const t={start:d,end:u};f||D(t),p||N("custom"),s==null||s(t),o==null||o("custom"),c(!1)}},me=t=>{t.stopPropagation(),f||D(null),p||N(l),s==null||s(null),o==null||o(l)},ce=()=>{i&&(b(i.start),x(i.end)),h(!0),c(!0)},de=t=>{b(t.start),x(t.end),h(!t.start||!!t.end)},$=i!==null;return e.jsxs("div",{className:`monitoring-toolbar ${ae}`,children:[e.jsx("div",{className:"monitoring-toolbar-segments",children:a.map(t=>e.jsx("button",{type:"button",className:`monitoring-toolbar-segment ${re===t.value&&!$?"monitoring-toolbar-segment-active":""}`,onClick:()=>le(t.value),children:t.label},t.value))}),e.jsxs("div",{className:"monitoring-toolbar-period",ref:P,children:[$?e.jsxs("div",{className:"monitoring-toolbar-period-tag",children:[e.jsxs("span",{className:"monitoring-toolbar-period-tag-text",onClick:ce,children:[R(i.start),e.jsx("span",{className:"monitoring-toolbar-period-tag-divider",children:"—"}),R(i.end)]}),e.jsx("button",{type:"button",className:"monitoring-toolbar-period-tag-close",onClick:me,"aria-label":"Clear custom period",children:e.jsx(ue,{size:12,stroke:2})})]}):e.jsxs("button",{type:"button",className:`monitoring-toolbar-period-btn ${v?"monitoring-toolbar-period-btn-active":""}`,onClick:se,children:[e.jsx(he,{size:12,stroke:2}),e.jsx("span",{children:"Period"})]}),v&&e.jsxs("div",{className:"monitoring-toolbar-dropdown",children:[e.jsxs("div",{className:"monitoring-toolbar-dropdown-header",children:[e.jsxs("div",{className:`monitoring-toolbar-date-box ${M?"monitoring-toolbar-date-box-active":""}`,onClick:()=>h(!0),children:[e.jsx("span",{className:"monitoring-toolbar-date-label",children:"START"}),e.jsx("span",{className:"monitoring-toolbar-date-value",children:R(d)})]}),e.jsx("div",{className:"monitoring-toolbar-date-separator",children:"~"}),e.jsxs("div",{className:`monitoring-toolbar-date-box ${M?"":"monitoring-toolbar-date-box-active"}`,onClick:()=>h(!1),children:[e.jsx("span",{className:"monitoring-toolbar-date-label",children:"END"}),e.jsx("span",{className:"monitoring-toolbar-date-value",children:R(u)})]})]}),e.jsx(ge,{mode:"range",rangeValue:{start:d,end:u},onRangeChange:de,maxDate:ee,minDate:te}),e.jsxs("div",{className:"monitoring-toolbar-dropdown-actions",children:[e.jsx("button",{type:"button",className:"monitoring-toolbar-dropdown-cancel",onClick:()=>c(!1),children:"Cancel"}),e.jsx("button",{type:"button",className:"monitoring-toolbar-dropdown-apply",onClick:ie,disabled:!d||!u,children:"Apply"})]})]})]}),Z&&e.jsx("button",{type:"button",className:"monitoring-toolbar-refresh",onClick:Q,"aria-label":"Refresh",children:e.jsx(pe,{size:14,stroke:1.5})})]})};m.__docgenInfo={description:"",methods:[],displayName:"MonitoringToolbar",props:{timeRangeOptions:{required:!1,tsType:{name:"Array",elements:[{name:"TimeRangeOption"}],raw:"TimeRangeOption[]"},description:"Time range options to display",defaultValue:{value:`[
  { label: '30m', value: '30m' },
  { label: '1h', value: '1h' },
  { label: '6h', value: '6h' },
  { label: '12h', value: '12h' },
  { label: '24h', value: '24h' },
]`,computed:!1}},timeRange:{required:!1,tsType:{name:"union",raw:"'30m' | '1h' | '3h' | '6h' | '12h' | '24h' | '1d' | '1w' | 'custom'",elements:[{name:"literal",value:"'30m'"},{name:"literal",value:"'1h'"},{name:"literal",value:"'3h'"},{name:"literal",value:"'6h'"},{name:"literal",value:"'12h'"},{name:"literal",value:"'24h'"},{name:"literal",value:"'1d'"},{name:"literal",value:"'1w'"},{name:"literal",value:"'custom'"}]},description:"Currently selected time range"},defaultTimeRange:{required:!1,tsType:{name:"union",raw:"'30m' | '1h' | '3h' | '6h' | '12h' | '24h' | '1d' | '1w' | 'custom'",elements:[{name:"literal",value:"'30m'"},{name:"literal",value:"'1h'"},{name:"literal",value:"'3h'"},{name:"literal",value:"'6h'"},{name:"literal",value:"'12h'"},{name:"literal",value:"'24h'"},{name:"literal",value:"'1d'"},{name:"literal",value:"'1w'"},{name:"literal",value:"'custom'"}]},description:"Default time range (if uncontrolled)",defaultValue:{value:"'30m'",computed:!1}},onTimeRangeChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: TimeRangeValue) => void",signature:{arguments:[{type:{name:"union",raw:"'30m' | '1h' | '3h' | '6h' | '12h' | '24h' | '1d' | '1w' | 'custom'",elements:[{name:"literal",value:"'30m'"},{name:"literal",value:"'1h'"},{name:"literal",value:"'3h'"},{name:"literal",value:"'6h'"},{name:"literal",value:"'12h'"},{name:"literal",value:"'24h'"},{name:"literal",value:"'1d'"},{name:"literal",value:"'1w'"},{name:"literal",value:"'custom'"}]},name:"value"}],return:{name:"void"}}},description:"Callback when time range changes"},customPeriod:{required:!1,tsType:{name:"union",raw:"CustomPeriod | null",elements:[{name:"CustomPeriod"},{name:"null"}]},description:"Custom period value (when timeRange is 'custom')"},defaultCustomPeriod:{required:!1,tsType:{name:"union",raw:"CustomPeriod | null",elements:[{name:"CustomPeriod"},{name:"null"}]},description:"Default custom period (if uncontrolled)",defaultValue:{value:"null",computed:!1}},onCustomPeriodChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(period: CustomPeriod | null) => void",signature:{arguments:[{type:{name:"union",raw:"CustomPeriod | null",elements:[{name:"CustomPeriod"},{name:"null"}]},name:"period"}],return:{name:"void"}}},description:"Callback when custom period changes"},onRefresh:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when refresh is clicked"},showRefresh:{required:!1,tsType:{name:"boolean"},description:"Show refresh button",defaultValue:{value:"true",computed:!1}},maxDate:{required:!1,tsType:{name:"Date"},description:"Maximum selectable date for custom period",defaultValue:{value:"new Date()",computed:!1}},minDate:{required:!1,tsType:{name:"Date"},description:"Minimum selectable date for custom period"},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};const Se={title:"Components/MonitoringToolbar",component:m,tags:["autodocs"],parameters:{docs:{description:{component:`
## MonitoringToolbar 컴포넌트

모니터링 대시보드에서 시간 범위를 선택하는 툴바입니다.

### 특징
- 사전 정의된 시간 범위 (30m, 1h, 6h, 12h, 24h)
- 커스텀 기간 선택 (DatePicker)
- 새로고침 버튼
- Controlled/Uncontrolled 모드 지원

### Props
- **timeRangeOptions**: 시간 범위 옵션 배열
- **timeRange**: 선택된 시간 범위 (controlled)
- **defaultTimeRange**: 기본 시간 범위 (uncontrolled)
- **customPeriod**: 커스텀 기간 (controlled)
- **onRefresh**: 새로고침 콜백

### 사용 시기
- 메트릭 대시보드
- 로그 뷰어
- 모니터링 차트

### 예시
\`\`\`tsx
<MonitoringToolbar
  timeRange="1h"
  onTimeRangeChange={(range) => setTimeRange(range)}
  onRefresh={() => fetchData()}
/>
\`\`\`
        `}}},argTypes:{showRefresh:{control:"boolean",description:"새로고침 버튼 표시",table:{defaultValue:{summary:"true"}}},defaultTimeRange:{control:"select",options:["30m","1h","3h","6h","12h","24h"],description:"기본 시간 범위",table:{defaultValue:{summary:"30m"}}}}},T={render:()=>e.jsx(m,{onTimeRangeChange:a=>console.log("Time range:",a),onRefresh:()=>console.log("Refresh")})},w={render:function(){const[r,l]=n.useState("1h");return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(m,{timeRange:r,onTimeRangeChange:l,onRefresh:()=>console.log("Refresh")}),e.jsxs("p",{className:"text-sm text-[var(--color-text-muted)]",children:["Selected: ",r]})]})}},j={render:()=>e.jsx(m,{showRefresh:!1,onTimeRangeChange:a=>console.log("Time range:",a)})},y={render:()=>e.jsx(m,{timeRangeOptions:[{label:"15m",value:"30m"},{label:"30m",value:"30m"},{label:"1h",value:"1h"},{label:"2h",value:"3h"},{label:"4h",value:"6h"}],onTimeRangeChange:a=>console.log("Time range:",a),onRefresh:()=>console.log("Refresh")})},C={render:function(){const[r,l]=n.useState("custom"),[o,g]=n.useState({start:new Date(Date.now()-7*24*60*60*1e3),end:new Date});return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(m,{timeRange:r,onTimeRangeChange:l,customPeriod:o,onCustomPeriodChange:g,onRefresh:()=>console.log("Refresh")}),e.jsx("p",{className:"text-sm text-[var(--color-text-muted)]",children:o?`Custom: ${o.start.toLocaleDateString()} - ${o.end.toLocaleDateString()}`:`Selected: ${r}`})]})}},S={render:()=>e.jsxs("div",{className:"bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsx("h2",{className:"text-lg font-semibold",children:"CPU Usage"}),e.jsx(m,{defaultTimeRange:"1h",onTimeRangeChange:a=>console.log("Time range:",a),onRefresh:()=>console.log("Refresh")})]}),e.jsx("div",{className:"h-[200px] bg-[var(--color-surface-subtle)] rounded flex items-center justify-center text-[var(--color-text-muted)]",children:"Chart Placeholder"})]})};var q,I,O;T.parameters={...T.parameters,docs:{...(q=T.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <MonitoringToolbar onTimeRangeChange={range => console.log('Time range:', range)} onRefresh={() => console.log('Refresh')} />
}`,...(O=(I=T.parameters)==null?void 0:I.docs)==null?void 0:O.source}}};var V,E,L;w.parameters={...w.parameters,docs:{...(V=w.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: function ControlledStory() {
    const [timeRange, setTimeRange] = useState<'30m' | '1h' | '3h' | '6h' | '12h' | '24h' | '1d' | '1w' | 'custom'>('1h');
    return <div className="flex flex-col gap-4">
        <MonitoringToolbar timeRange={timeRange} onTimeRangeChange={setTimeRange} onRefresh={() => console.log('Refresh')} />
        <p className="text-sm text-[var(--color-text-muted)]">Selected: {timeRange}</p>
      </div>;
  }
}`,...(L=(E=w.parameters)==null?void 0:E.docs)==null?void 0:L.source}}};var A,U,W;j.parameters={...j.parameters,docs:{...(A=j.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => <MonitoringToolbar showRefresh={false} onTimeRangeChange={range => console.log('Time range:', range)} />
}`,...(W=(U=j.parameters)==null?void 0:U.docs)==null?void 0:W.source}}};var _,z,F;y.parameters={...y.parameters,docs:{...(_=y.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => <MonitoringToolbar timeRangeOptions={[{
    label: '15m',
    value: '30m'
  }, {
    label: '30m',
    value: '30m'
  }, {
    label: '1h',
    value: '1h'
  }, {
    label: '2h',
    value: '3h'
  }, {
    label: '4h',
    value: '6h'
  }]} onTimeRangeChange={range => console.log('Time range:', range)} onRefresh={() => console.log('Refresh')} />
}`,...(F=(z=y.parameters)==null?void 0:z.docs)==null?void 0:F.source}}};var X,Y,B;C.parameters={...C.parameters,docs:{...(X=C.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: function CustomPeriodStory() {
    const [timeRange, setTimeRange] = useState<'30m' | '1h' | '3h' | '6h' | '12h' | '24h' | '1d' | '1w' | 'custom'>('custom');
    const [customPeriod, setCustomPeriod] = useState<{
      start: Date;
      end: Date;
    } | null>({
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      end: new Date()
    });
    return <div className="flex flex-col gap-4">
        <MonitoringToolbar timeRange={timeRange} onTimeRangeChange={setTimeRange} customPeriod={customPeriod} onCustomPeriodChange={setCustomPeriod} onRefresh={() => console.log('Refresh')} />
        <p className="text-sm text-[var(--color-text-muted)]">
          {customPeriod ? \`Custom: \${customPeriod.start.toLocaleDateString()} - \${customPeriod.end.toLocaleDateString()}\` : \`Selected: \${timeRange}\`}
        </p>
      </div>;
  }
}`,...(B=(Y=C.parameters)==null?void 0:Y.docs)==null?void 0:B.source}}};var G,H,J;S.parameters={...S.parameters,docs:{...(G=S.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">CPU Usage</h2>
        <MonitoringToolbar defaultTimeRange="1h" onTimeRangeChange={range => console.log('Time range:', range)} onRefresh={() => console.log('Refresh')} />
      </div>
      <div className="h-[200px] bg-[var(--color-surface-subtle)] rounded flex items-center justify-center text-[var(--color-text-muted)]">
        Chart Placeholder
      </div>
    </div>
}`,...(J=(H=S.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};const Ne=["Default","Controlled","WithoutRefresh","CustomOptions","WithCustomPeriod","InDashboardContext"];export{w as Controlled,y as CustomOptions,T as Default,S as InDashboardContext,C as WithCustomPeriod,j as WithoutRefresh,Ne as __namedExportsOrder,Se as default};
