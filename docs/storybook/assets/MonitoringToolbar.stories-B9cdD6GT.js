import{r,j as e}from"./iframe-DkQu90e3.js";import{I as ue}from"./IconX-BaIg4cV2.js";import{I as he}from"./IconCalendar-92kGPUn5.js";import{D as pe}from"./DatePicker-BLpkb0Fe.js";import{I as ge}from"./IconRefresh-C-H5hDSs.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-Bn1mjhIb.js";import"./IconChevronLeft-C8ca2G7w.js";import"./IconChevronRight-CI0CgaLS.js";const fe=[{label:"30m",value:"30m"},{label:"1h",value:"1h"},{label:"6h",value:"6h"},{label:"12h",value:"12h"},{label:"24h",value:"24h"}],ve=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],R=t=>{if(!t)return"";const n=ve[t.getMonth()],s=t.getDate().toString().padStart(2,"0"),o=t.getFullYear();return`${n} ${s}, ${o}`},m=({timeRangeOptions:t=fe,timeRange:n,defaultTimeRange:s="30m",onTimeRangeChange:o,customPeriod:p,defaultCustomPeriod:K=null,onCustomPeriodChange:l,onRefresh:Q,showRefresh:Z=!0,maxDate:ee=new Date,minDate:ae,className:te=""})=>{const g=n!==void 0,f=p!==void 0,[oe,D]=r.useState(s),[re,S]=r.useState(K),ne=g?n:oe,i=f?p:re,[v,c]=r.useState(!1),[d,b]=r.useState(null),[u,x]=r.useState(null),[M,h]=r.useState(!0),P=r.useRef(null);r.useEffect(()=>{const a=k=>{P.current&&!P.current.contains(k.target)&&c(!1)};return v&&document.addEventListener("mousedown",a),()=>document.removeEventListener("mousedown",a)},[v]);const se=a=>{g||D(a),f||S(null),o==null||o(a),l==null||l(null)},le=()=>{if(i)b(i.start),x(i.end);else{const a=new Date,k=new Date(a.getTime()-7*24*60*60*1e3);b(k),x(a)}h(!0),c(!0)},ie=()=>{if(d&&u){const a={start:d,end:u};f||S(a),g||D("custom"),l==null||l(a),o==null||o("custom"),c(!1)}},me=a=>{a.stopPropagation(),f||S(null),g||D(s),l==null||l(null),o==null||o(s)},ce=()=>{i&&(b(i.start),x(i.end)),h(!0),c(!0)},de=a=>{b(a.start),x(a.end),h(!a.start||!!a.end)},$=i!==null;return e.jsxs("div",{"data-figma-name":"MonitoringToolbar",className:`monitoring-toolbar ${te}`,children:[e.jsx("div",{className:"monitoring-toolbar-segments",children:t.map(a=>e.jsx("button",{type:"button",className:`monitoring-toolbar-segment ${ne===a.value&&!$?"monitoring-toolbar-segment-active":""}`,onClick:()=>se(a.value),children:a.label},a.value))}),e.jsxs("div",{className:"monitoring-toolbar-period",ref:P,children:[$?e.jsxs("div",{className:"monitoring-toolbar-period-tag",children:[e.jsxs("span",{className:"monitoring-toolbar-period-tag-text",onClick:ce,children:[R(i.start),e.jsx("span",{className:"monitoring-toolbar-period-tag-divider",children:"—"}),R(i.end)]}),e.jsx("button",{type:"button",className:"monitoring-toolbar-period-tag-close",onClick:me,"aria-label":"Clear custom period",children:e.jsx(ue,{size:12,stroke:2})})]}):e.jsxs("button",{type:"button",className:`monitoring-toolbar-period-btn ${v?"monitoring-toolbar-period-btn-active":""}`,onClick:le,children:[e.jsx(he,{size:12,stroke:2}),e.jsx("span",{children:"Period"})]}),v&&e.jsxs("div",{className:"monitoring-toolbar-dropdown",children:[e.jsxs("div",{className:"monitoring-toolbar-dropdown-header",children:[e.jsxs("div",{className:`monitoring-toolbar-date-box ${M?"monitoring-toolbar-date-box-active":""}`,onClick:()=>h(!0),children:[e.jsx("span",{className:"monitoring-toolbar-date-label",children:"START"}),e.jsx("span",{className:"monitoring-toolbar-date-value",children:R(d)})]}),e.jsx("div",{className:"monitoring-toolbar-date-separator",children:"~"}),e.jsxs("div",{className:`monitoring-toolbar-date-box ${M?"":"monitoring-toolbar-date-box-active"}`,onClick:()=>h(!1),children:[e.jsx("span",{className:"monitoring-toolbar-date-label",children:"END"}),e.jsx("span",{className:"monitoring-toolbar-date-value",children:R(u)})]})]}),e.jsx(pe,{mode:"range",rangeValue:{start:d,end:u},onRangeChange:de,maxDate:ee,minDate:ae}),e.jsxs("div",{className:"monitoring-toolbar-dropdown-actions",children:[e.jsx("button",{type:"button",className:"monitoring-toolbar-dropdown-cancel",onClick:()=>c(!1),children:"Cancel"}),e.jsx("button",{type:"button",className:"monitoring-toolbar-dropdown-apply",onClick:ie,disabled:!d||!u,children:"Apply"})]})]})]}),Z&&e.jsx("button",{type:"button",className:"monitoring-toolbar-refresh",onClick:Q,"aria-label":"Refresh",children:e.jsx(ge,{size:12,stroke:1.5})})]})};m.__docgenInfo={description:"",methods:[],displayName:"MonitoringToolbar",props:{timeRangeOptions:{required:!1,tsType:{name:"Array",elements:[{name:"TimeRangeOption"}],raw:"TimeRangeOption[]"},description:"Time range options to display",defaultValue:{value:`[
  { label: '30m', value: '30m' },
  { label: '1h', value: '1h' },
  { label: '6h', value: '6h' },
  { label: '12h', value: '12h' },
  { label: '24h', value: '24h' },
]`,computed:!1}},timeRange:{required:!1,tsType:{name:"union",raw:"'30m' | '1h' | '3h' | '6h' | '12h' | '24h' | '1d' | '1w' | 'custom'",elements:[{name:"literal",value:"'30m'"},{name:"literal",value:"'1h'"},{name:"literal",value:"'3h'"},{name:"literal",value:"'6h'"},{name:"literal",value:"'12h'"},{name:"literal",value:"'24h'"},{name:"literal",value:"'1d'"},{name:"literal",value:"'1w'"},{name:"literal",value:"'custom'"}]},description:"Currently selected time range"},defaultTimeRange:{required:!1,tsType:{name:"union",raw:"'30m' | '1h' | '3h' | '6h' | '12h' | '24h' | '1d' | '1w' | 'custom'",elements:[{name:"literal",value:"'30m'"},{name:"literal",value:"'1h'"},{name:"literal",value:"'3h'"},{name:"literal",value:"'6h'"},{name:"literal",value:"'12h'"},{name:"literal",value:"'24h'"},{name:"literal",value:"'1d'"},{name:"literal",value:"'1w'"},{name:"literal",value:"'custom'"}]},description:"Default time range (if uncontrolled)",defaultValue:{value:"'30m'",computed:!1}},onTimeRangeChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: TimeRangeValue) => void",signature:{arguments:[{type:{name:"union",raw:"'30m' | '1h' | '3h' | '6h' | '12h' | '24h' | '1d' | '1w' | 'custom'",elements:[{name:"literal",value:"'30m'"},{name:"literal",value:"'1h'"},{name:"literal",value:"'3h'"},{name:"literal",value:"'6h'"},{name:"literal",value:"'12h'"},{name:"literal",value:"'24h'"},{name:"literal",value:"'1d'"},{name:"literal",value:"'1w'"},{name:"literal",value:"'custom'"}]},name:"value"}],return:{name:"void"}}},description:"Callback when time range changes"},customPeriod:{required:!1,tsType:{name:"union",raw:"CustomPeriod | null",elements:[{name:"CustomPeriod"},{name:"null"}]},description:"Custom period value (when timeRange is 'custom')"},defaultCustomPeriod:{required:!1,tsType:{name:"union",raw:"CustomPeriod | null",elements:[{name:"CustomPeriod"},{name:"null"}]},description:"Default custom period (if uncontrolled)",defaultValue:{value:"null",computed:!1}},onCustomPeriodChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(period: CustomPeriod | null) => void",signature:{arguments:[{type:{name:"union",raw:"CustomPeriod | null",elements:[{name:"CustomPeriod"},{name:"null"}]},name:"period"}],return:{name:"void"}}},description:"Callback when custom period changes"},onRefresh:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when refresh is clicked"},showRefresh:{required:!1,tsType:{name:"boolean"},description:"Show refresh button",defaultValue:{value:"true",computed:!1}},maxDate:{required:!1,tsType:{name:"Date"},description:"Maximum selectable date for custom period",defaultValue:{value:"new Date()",computed:!1}},minDate:{required:!1,tsType:{name:"Date"},description:"Minimum selectable date for custom period"},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};const De={title:"Components/MonitoringToolbar",component:m,tags:["autodocs"],parameters:{docs:{description:{component:`
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
        `}}},argTypes:{showRefresh:{control:"boolean",description:"새로고침 버튼 표시",table:{defaultValue:{summary:"true"}}},defaultTimeRange:{control:"select",options:["30m","1h","3h","6h","12h","24h"],description:"기본 시간 범위",table:{defaultValue:{summary:"30m"}}}}},T={render:()=>e.jsx(m,{onTimeRangeChange:t=>console.log("Time range:",t),onRefresh:()=>console.log("Refresh")})},w={render:function(){const[n,s]=r.useState("1h");return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx(m,{timeRange:n,onTimeRangeChange:s,onRefresh:()=>console.log("Refresh")}),e.jsxs("p",{className:"text-body-md text-[var(--color-text-muted)]",children:["Selected: ",n]})]})}},y={render:()=>e.jsx(m,{showRefresh:!1,onTimeRangeChange:t=>console.log("Time range:",t)})},j={render:()=>e.jsx(m,{timeRangeOptions:[{label:"15m",value:"30m"},{label:"30m",value:"30m"},{label:"1h",value:"1h"},{label:"2h",value:"3h"},{label:"4h",value:"6h"}],onTimeRangeChange:t=>console.log("Time range:",t),onRefresh:()=>console.log("Refresh")})},N={render:function(){const[n,s]=r.useState("custom"),[o,p]=r.useState({start:new Date(Date.now()-7*24*60*60*1e3),end:new Date});return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx(m,{timeRange:n,onTimeRangeChange:s,customPeriod:o,onCustomPeriodChange:p,onRefresh:()=>console.log("Refresh")}),e.jsx("p",{className:"text-body-md text-[var(--color-text-muted)]",children:o?`Custom: ${o.start.toLocaleDateString()} - ${o.end.toLocaleDateString()}`:`Selected: ${n}`})]})}},C={render:()=>e.jsxs("div",{className:"bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-[var(--primitive-spacing-4)]",children:[e.jsxs("div",{className:"flex items-center justify-between mb-[var(--primitive-spacing-4)]",children:[e.jsx("h2",{className:"text-heading-h4",children:"CPU Usage"}),e.jsx(m,{defaultTimeRange:"1h",onTimeRangeChange:t=>console.log("Time range:",t),onRefresh:()=>console.log("Refresh")})]}),e.jsx("div",{className:"h-[200px] bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)] flex items-center justify-center text-[var(--color-text-muted)]",children:"Chart Placeholder"})]})};var O,q,I;T.parameters={...T.parameters,docs:{...(O=T.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <MonitoringToolbar onTimeRangeChange={range => console.log('Time range:', range)} onRefresh={() => console.log('Refresh')} />
}`,...(I=(q=T.parameters)==null?void 0:q.docs)==null?void 0:I.source}}};var V,E,A;w.parameters={...w.parameters,docs:{...(V=w.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: function ControlledStory() {
    const [timeRange, setTimeRange] = useState<'30m' | '1h' | '3h' | '6h' | '12h' | '24h' | '1d' | '1w' | 'custom'>('1h');
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        <MonitoringToolbar timeRange={timeRange} onTimeRangeChange={setTimeRange} onRefresh={() => console.log('Refresh')} />
        <p className="text-body-md text-[var(--color-text-muted)]">Selected: {timeRange}</p>
      </div>;
  }
}`,...(A=(E=w.parameters)==null?void 0:E.docs)==null?void 0:A.source}}};var L,U,W;y.parameters={...y.parameters,docs:{...(L=y.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => <MonitoringToolbar showRefresh={false} onTimeRangeChange={range => console.log('Time range:', range)} />
}`,...(W=(U=y.parameters)==null?void 0:U.docs)==null?void 0:W.source}}};var _,z,F;j.parameters={...j.parameters,docs:{...(_=j.parameters)==null?void 0:_.docs,source:{originalSource:`{
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
}`,...(F=(z=j.parameters)==null?void 0:z.docs)==null?void 0:F.source}}};var J,B,H;N.parameters={...N.parameters,docs:{...(J=N.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: function CustomPeriodStory() {
    const [timeRange, setTimeRange] = useState<'30m' | '1h' | '3h' | '6h' | '12h' | '24h' | '1d' | '1w' | 'custom'>('custom');
    const [customPeriod, setCustomPeriod] = useState<{
      start: Date;
      end: Date;
    } | null>({
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      end: new Date()
    });
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        <MonitoringToolbar timeRange={timeRange} onTimeRangeChange={setTimeRange} customPeriod={customPeriod} onCustomPeriodChange={setCustomPeriod} onRefresh={() => console.log('Refresh')} />
        <p className="text-body-md text-[var(--color-text-muted)]">
          {customPeriod ? \`Custom: \${customPeriod.start.toLocaleDateString()} - \${customPeriod.end.toLocaleDateString()}\` : \`Selected: \${timeRange}\`}
        </p>
      </div>;
  }
}`,...(H=(B=N.parameters)==null?void 0:B.docs)==null?void 0:H.source}}};var X,Y,G;C.parameters={...C.parameters,docs:{...(X=C.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: () => <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-[var(--primitive-spacing-4)]">
      <div className="flex items-center justify-between mb-[var(--primitive-spacing-4)]">
        <h2 className="text-heading-h4">CPU Usage</h2>
        <MonitoringToolbar defaultTimeRange="1h" onTimeRangeChange={range => console.log('Time range:', range)} onRefresh={() => console.log('Refresh')} />
      </div>
      <div className="h-[200px] bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)] flex items-center justify-center text-[var(--color-text-muted)]">
        Chart Placeholder
      </div>
    </div>
}`,...(G=(Y=C.parameters)==null?void 0:Y.docs)==null?void 0:G.source}}};const Se=["Default","Controlled","WithoutRefresh","CustomOptions","WithCustomPeriod","InDashboardContext"];export{w as Controlled,j as CustomOptions,T as Default,C as InDashboardContext,N as WithCustomPeriod,y as WithoutRefresh,Se as __namedExportsOrder,De as default};
