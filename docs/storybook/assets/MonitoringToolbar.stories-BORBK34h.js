import{r as o,j as e}from"./iframe-DD6jyF7N.js";import{I as k}from"./IconCalendar-MSMrWjgX.js";import{D as ue}from"./DateRangePicker-CEFOfv8s.js";import{I as ce}from"./IconRefresh-cpyi7lGj.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-BZMrecJg.js";import"./DatePicker-Au-pYneR.js";import"./NumberInput-rdDMmQ7w.js";import"./cn-BMXv33oC.js";import"./IconChevronUp-Dt5qBDbK.js";import"./IconChevronDown-BtcBS3A-.js";import"./IconChevronLeft-DIbUa7_K.js";import"./IconChevronRight-BMUG6TI6.js";import"./IconClock-BeP9Ib01.js";import"./Select-VYrJo28S.js";import"./index-CW36Fogi.js";import"./overlayscrollbars-react-Bz5brGty.js";import"./IconX-t6wpnM2j.js";import"./IconCheck-DLNLhokL.js";const de=[{label:"30m",value:"30m"},{label:"1h",value:"1h"},{label:"6h",value:"6h"},{label:"12h",value:"12h"},{label:"24h",value:"24h"}],he=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],M=t=>{if(!t)return"";const n=he[t.getMonth()],i=t.getDate().toString().padStart(2,"0"),r=t.getFullYear();return`${n} ${i}, ${r}`},l=({timeRangeOptions:t=de,timeRange:n,defaultTimeRange:i="30m",onTimeRangeChange:r,customPeriod:d,defaultCustomPeriod:K=null,onCustomPeriodChange:m,onRefresh:Q,showRefresh:X=!0,maxDate:Z=new Date,minDate:ee,className:te=""})=>{const T=n!==void 0,w=d!==void 0,[ae,P]=o.useState(i),[re,j]=o.useState(K),ne=T?n:ae,s=w?d:re,[h,c]=o.useState(!1),[oe,y]=o.useState(null),[se,C]=o.useState(null),D=o.useRef(null);o.useEffect(()=>{const a=u=>{const p=u.target;if(D.current&&!D.current.contains(p)){const S=p instanceof Element?p:p.parentElement;if(S!=null&&S.closest('[role="listbox"]'))return;c(!1)}};return h&&document.addEventListener("mousedown",a),()=>document.removeEventListener("mousedown",a)},[h]);const le=a=>{T||P(a),w||j(null),r==null||r(a),m==null||m(null)},ie=()=>{if(s)y(s.start),C(s.end);else{const a=new Date,u=new Date(a.getTime()-7*24*60*60*1e3);y(u),C(a)}c(!0)},me=()=>{s&&(y(s.start),C(s.end)),c(!0)},N=s!==null;return e.jsxs("div",{"data-figma-name":"[TDS] MonitoringToolbar",className:`monitoring-toolbar ${te}`,children:[e.jsx("div",{className:"monitoring-toolbar-segments",children:t.map(a=>e.jsx("button",{type:"button",className:`monitoring-toolbar-segment ${ne===a.value&&!N?"monitoring-toolbar-segment-active":""}`,onClick:()=>le(a.value),children:a.label},a.value))}),e.jsxs("div",{className:"monitoring-toolbar-period",ref:D,children:[N?e.jsxs("button",{type:"button",className:"flex items-center gap-2 h-[var(--input-height-sm)] px-[var(--input-padding-x)] bg-[var(--color-surface-default)] border border-[var(--color-border-focus)] rounded-[var(--input-radius)] text-body-sm cursor-pointer transition-colors",onClick:me,children:[e.jsx(k,{size:14,stroke:1.5,className:"shrink-0 text-[var(--color-text-subtle)]"}),e.jsxs("span",{className:"text-[var(--color-text-default)] whitespace-nowrap font-medium",children:[M(s.start),e.jsx("span",{className:"mx-0.5 text-[var(--color-text-subtle)]",children:"—"}),M(s.end)]})]}):e.jsxs("button",{type:"button",className:`flex items-center gap-2 h-[var(--input-height-sm)] px-[var(--input-padding-x)] bg-[var(--color-surface-default)] border rounded-[var(--input-radius)] text-body-sm cursor-pointer transition-colors ${h?"border-[var(--color-border-focus)]":"border-[var(--color-border-strong)] hover:border-[var(--color-border-focus)]"}`,onClick:ie,children:[e.jsx(k,{size:14,stroke:1.5,className:"shrink-0 text-[var(--color-text-subtle)]"}),e.jsx("span",{className:"text-[var(--color-text-subtle)] font-medium",children:"Select period"})]}),h&&e.jsx("div",{className:"monitoring-toolbar-dropdown",children:e.jsx(ue,{value:{start:oe,end:se},onApply:a=>{const u={start:a.start,end:a.end};w||j(u),T||P("custom"),m==null||m(u),r==null||r("custom"),c(!1)},onCancel:()=>c(!1),minDate:ee,maxDate:Z,className:"!border-0 !shadow-none"})})]}),X&&e.jsx("button",{type:"button",className:"monitoring-toolbar-refresh",onClick:Q,"aria-label":"Refresh",children:e.jsx(ce,{size:12,stroke:1.5})})]})};l.__docgenInfo={description:"",methods:[],displayName:"MonitoringToolbar",props:{timeRangeOptions:{required:!1,tsType:{name:"Array",elements:[{name:"TimeRangeOption"}],raw:"TimeRangeOption[]"},description:"Time range options to display",defaultValue:{value:`[
  { label: '30m', value: '30m' },
  { label: '1h', value: '1h' },
  { label: '6h', value: '6h' },
  { label: '12h', value: '12h' },
  { label: '24h', value: '24h' },
]`,computed:!1}},timeRange:{required:!1,tsType:{name:"union",raw:`| '30m'
| '1h'
| '3h'
| '6h'
| '12h'
| '24h'
| '1d'
| '1w'
| '2w'
| 'custom'`,elements:[{name:"literal",value:"'30m'"},{name:"literal",value:"'1h'"},{name:"literal",value:"'3h'"},{name:"literal",value:"'6h'"},{name:"literal",value:"'12h'"},{name:"literal",value:"'24h'"},{name:"literal",value:"'1d'"},{name:"literal",value:"'1w'"},{name:"literal",value:"'2w'"},{name:"literal",value:"'custom'"}]},description:"Currently selected time range"},defaultTimeRange:{required:!1,tsType:{name:"union",raw:`| '30m'
| '1h'
| '3h'
| '6h'
| '12h'
| '24h'
| '1d'
| '1w'
| '2w'
| 'custom'`,elements:[{name:"literal",value:"'30m'"},{name:"literal",value:"'1h'"},{name:"literal",value:"'3h'"},{name:"literal",value:"'6h'"},{name:"literal",value:"'12h'"},{name:"literal",value:"'24h'"},{name:"literal",value:"'1d'"},{name:"literal",value:"'1w'"},{name:"literal",value:"'2w'"},{name:"literal",value:"'custom'"}]},description:"Default time range (if uncontrolled)",defaultValue:{value:"'30m'",computed:!1}},onTimeRangeChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: TimeRangeValue) => void",signature:{arguments:[{type:{name:"union",raw:`| '30m'
| '1h'
| '3h'
| '6h'
| '12h'
| '24h'
| '1d'
| '1w'
| '2w'
| 'custom'`,elements:[{name:"literal",value:"'30m'"},{name:"literal",value:"'1h'"},{name:"literal",value:"'3h'"},{name:"literal",value:"'6h'"},{name:"literal",value:"'12h'"},{name:"literal",value:"'24h'"},{name:"literal",value:"'1d'"},{name:"literal",value:"'1w'"},{name:"literal",value:"'2w'"},{name:"literal",value:"'custom'"}]},name:"value"}],return:{name:"void"}}},description:"Callback when time range changes"},customPeriod:{required:!1,tsType:{name:"union",raw:"CustomPeriod | null",elements:[{name:"CustomPeriod"},{name:"null"}]},description:"Custom period value (when timeRange is 'custom')"},defaultCustomPeriod:{required:!1,tsType:{name:"union",raw:"CustomPeriod | null",elements:[{name:"CustomPeriod"},{name:"null"}]},description:"Default custom period (if uncontrolled)",defaultValue:{value:"null",computed:!1}},onCustomPeriodChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(period: CustomPeriod | null) => void",signature:{arguments:[{type:{name:"union",raw:"CustomPeriod | null",elements:[{name:"CustomPeriod"},{name:"null"}]},name:"period"}],return:{name:"void"}}},description:"Callback when custom period changes"},onRefresh:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when refresh is clicked"},showRefresh:{required:!1,tsType:{name:"boolean"},description:"Show refresh button",defaultValue:{value:"true",computed:!1}},maxDate:{required:!1,tsType:{name:"Date"},description:"Maximum selectable date for custom period",defaultValue:{value:"new Date()",computed:!1}},minDate:{required:!1,tsType:{name:"Date"},description:"Minimum selectable date for custom period"},className:{required:!1,tsType:{name:"string"},description:"Custom class name",defaultValue:{value:"''",computed:!1}}}};const qe={title:"Components/MonitoringToolbar",component:l,tags:["autodocs"],parameters:{docs:{description:{component:`
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
        `}}},argTypes:{showRefresh:{control:"boolean",description:"새로고침 버튼 표시",table:{defaultValue:{summary:"true"}}},defaultTimeRange:{control:"select",options:["30m","1h","3h","6h","12h","24h"],description:"기본 시간 범위",table:{defaultValue:{summary:"30m"}}}}},g={render:()=>e.jsx(l,{onTimeRangeChange:t=>console.log("Time range:",t),onRefresh:()=>console.log("Refresh")})},f={render:function(){const[n,i]=o.useState("1h");return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx(l,{timeRange:n,onTimeRangeChange:i,onRefresh:()=>console.log("Refresh")}),e.jsxs("p",{className:"text-body-md text-[var(--color-text-muted)]",children:["Selected: ",n]})]})}},v={render:()=>e.jsx(l,{showRefresh:!1,onTimeRangeChange:t=>console.log("Time range:",t)})},b={render:()=>e.jsx(l,{timeRangeOptions:[{label:"15m",value:"30m"},{label:"30m",value:"30m"},{label:"1h",value:"1h"},{label:"2h",value:"3h"},{label:"4h",value:"6h"}],onTimeRangeChange:t=>console.log("Time range:",t),onRefresh:()=>console.log("Refresh")})},x={render:function(){const[n,i]=o.useState("custom"),[r,d]=o.useState({start:new Date(Date.now()-7*24*60*60*1e3),end:new Date});return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx(l,{timeRange:n,onTimeRangeChange:i,customPeriod:r,onCustomPeriodChange:d,onRefresh:()=>console.log("Refresh")}),e.jsx("p",{className:"text-body-md text-[var(--color-text-muted)]",children:r?`Custom: ${r.start.toLocaleDateString()} - ${r.end.toLocaleDateString()}`:`Selected: ${n}`})]})}},R={render:()=>e.jsxs("div",{className:"bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-[var(--primitive-spacing-4)]",children:[e.jsxs("div",{className:"flex items-center justify-between mb-[var(--primitive-spacing-4)]",children:[e.jsx("h2",{className:"text-heading-h4",children:"CPU Usage"}),e.jsx(l,{defaultTimeRange:"1h",onTimeRangeChange:t=>console.log("Time range:",t),onRefresh:()=>console.log("Refresh")})]}),e.jsx("div",{className:"h-[200px] bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)] flex items-center justify-center text-[var(--color-text-muted)]",children:"Chart Placeholder"})]})};var O,q,$;g.parameters={...g.parameters,docs:{...(O=g.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <MonitoringToolbar onTimeRangeChange={range => console.log('Time range:', range)} onRefresh={() => console.log('Refresh')} />
}`,...($=(q=g.parameters)==null?void 0:q.docs)==null?void 0:$.source}}};var E,I,V;f.parameters={...f.parameters,docs:{...(E=f.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: function ControlledStory() {
    const [timeRange, setTimeRange] = useState<'30m' | '1h' | '3h' | '6h' | '12h' | '24h' | '1d' | '1w' | 'custom'>('1h');
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        <MonitoringToolbar timeRange={timeRange} onTimeRangeChange={setTimeRange} onRefresh={() => console.log('Refresh')} />
        <p className="text-body-md text-[var(--color-text-muted)]">Selected: {timeRange}</p>
      </div>;
  }
}`,...(V=(I=f.parameters)==null?void 0:I.docs)==null?void 0:V.source}}};var A,L,U;v.parameters={...v.parameters,docs:{...(A=v.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => <MonitoringToolbar showRefresh={false} onTimeRangeChange={range => console.log('Time range:', range)} />
}`,...(U=(L=v.parameters)==null?void 0:L.docs)==null?void 0:U.source}}};var W,_,z;b.parameters={...b.parameters,docs:{...(W=b.parameters)==null?void 0:W.docs,source:{originalSource:`{
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
}`,...(z=(_=b.parameters)==null?void 0:_.docs)==null?void 0:z.source}}};var F,J,B;x.parameters={...x.parameters,docs:{...(F=x.parameters)==null?void 0:F.docs,source:{originalSource:`{
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
}`,...(B=(J=x.parameters)==null?void 0:J.docs)==null?void 0:B.source}}};var H,Y,G;R.parameters={...R.parameters,docs:{...(H=R.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-[var(--primitive-spacing-4)]">
      <div className="flex items-center justify-between mb-[var(--primitive-spacing-4)]">
        <h2 className="text-heading-h4">CPU Usage</h2>
        <MonitoringToolbar defaultTimeRange="1h" onTimeRangeChange={range => console.log('Time range:', range)} onRefresh={() => console.log('Refresh')} />
      </div>
      <div className="h-[200px] bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)] flex items-center justify-center text-[var(--color-text-muted)]">
        Chart Placeholder
      </div>
    </div>
}`,...(G=(Y=R.parameters)==null?void 0:Y.docs)==null?void 0:G.source}}};const $e=["Default","Controlled","WithoutRefresh","CustomOptions","WithCustomPeriod","InDashboardContext"];export{f as Controlled,b as CustomOptions,g as Default,R as InDashboardContext,x as WithCustomPeriod,v as WithoutRefresh,$e as __namedExportsOrder,qe as default};
