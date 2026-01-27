import{r as n,j as e}from"./iframe-DKmDJy9M.js";import{I as ue}from"./IconX-D1qmt8Yz.js";import{I as he}from"./IconCalendar-BYL1U80q.js";import{D as ge}from"./DatePicker-C0oQ0Bou.js";import{c as pe}from"./createReactComponent-DB1W9lnY.js";import"./preload-helper-C1FmrZbK.js";import"./IconChevronLeft-rXH75vem.js";import"./IconChevronRight-Dymhorbf.js";/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const fe=[["path",{d:"M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4",key:"svg-0"}],["path",{d:"M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4",key:"svg-1"}]],ve=pe("outline","refresh","Refresh",fe),be=[{label:"30m",value:"30m"},{label:"1h",value:"1h"},{label:"6h",value:"6h"},{label:"12h",value:"12h"},{label:"24h",value:"24h"}],R=a=>{if(!a)return"";const r=a.getFullYear(),s=(a.getMonth()+1).toString().padStart(2,"0"),o=a.getDate().toString().padStart(2,"0");return`${r}.${s}.${o}`},m=({timeRangeOptions:a=be,timeRange:r,defaultTimeRange:s="30m",onTimeRangeChange:o,customPeriod:g,defaultCustomPeriod:K=null,onCustomPeriodChange:l,onRefresh:Q,showRefresh:Z=!0,maxDate:ee=new Date,minDate:te,className:ae=""})=>{const p=r!==void 0,f=g!==void 0,[oe,S]=n.useState(s),[ne,D]=n.useState(K),re=p?r:oe,i=f?g:ne,[v,c]=n.useState(!1),[d,b]=n.useState(null),[u,x]=n.useState(null),[M,h]=n.useState(!0),P=n.useRef(null);n.useEffect(()=>{const t=k=>{P.current&&!P.current.contains(k.target)&&c(!1)};return v&&document.addEventListener("mousedown",t),()=>document.removeEventListener("mousedown",t)},[v]);const se=t=>{p||S(t),f||D(null),o==null||o(t),l==null||l(null)},le=()=>{if(i)b(i.start),x(i.end);else{const t=new Date,k=new Date(t.getTime()-7*24*60*60*1e3);b(k),x(t)}h(!0),c(!0)},ie=()=>{if(d&&u){const t={start:d,end:u};f||D(t),p||S("custom"),l==null||l(t),o==null||o("custom"),c(!1)}},me=t=>{t.stopPropagation(),f||D(null),p||S(s),l==null||l(null),o==null||o(s)},ce=()=>{i&&(b(i.start),x(i.end)),h(!0),c(!0)},de=t=>{b(t.start),x(t.end),h(!t.start||!!t.end)},$=i!==null;return e.jsxs("div",{className:`monitoring-toolbar ${ae}`,children:[e.jsx("div",{className:"monitoring-toolbar-segments",children:a.map(t=>e.jsx("button",{type:"button",className:`monitoring-toolbar-segment ${re===t.value&&!$?"monitoring-toolbar-segment-active":""}`,onClick:()=>se(t.value),children:t.label},t.value))}),e.jsxs("div",{className:"monitoring-toolbar-period",ref:P,children:[$?e.jsxs("div",{className:"monitoring-toolbar-period-tag",children:[e.jsxs("span",{className:"monitoring-toolbar-period-tag-text",onClick:ce,children:[R(i.start),e.jsx("span",{className:"monitoring-toolbar-period-tag-divider",children:"—"}),R(i.end)]}),e.jsx("button",{type:"button",className:"monitoring-toolbar-period-tag-close",onClick:me,"aria-label":"Clear custom period",children:e.jsx(ue,{size:12,stroke:2})})]}):e.jsxs("button",{type:"button",className:`monitoring-toolbar-period-btn ${v?"monitoring-toolbar-period-btn-active":""}`,onClick:le,children:[e.jsx(he,{size:12,stroke:2}),e.jsx("span",{children:"Period"})]}),v&&e.jsxs("div",{className:"monitoring-toolbar-dropdown",children:[e.jsxs("div",{className:"monitoring-toolbar-dropdown-header",children:[e.jsxs("div",{className:`monitoring-toolbar-date-box ${M?"monitoring-toolbar-date-box-active":""}`,onClick:()=>h(!0),children:[e.jsx("span",{className:"monitoring-toolbar-date-label",children:"START"}),e.jsx("span",{className:"monitoring-toolbar-date-value",children:R(d)})]}),e.jsx("div",{className:"monitoring-toolbar-date-separator",children:"~"}),e.jsxs("div",{className:`monitoring-toolbar-date-box ${M?"":"monitoring-toolbar-date-box-active"}`,onClick:()=>h(!1),children:[e.jsx("span",{className:"monitoring-toolbar-date-label",children:"END"}),e.jsx("span",{className:"monitoring-toolbar-date-value",children:R(u)})]})]}),e.jsx(ge,{mode:"range",rangeValue:{start:d,end:u},onRangeChange:de,maxDate:ee,minDate:te}),e.jsxs("div",{className:"monitoring-toolbar-dropdown-actions",children:[e.jsx("button",{type:"button",className:"monitoring-toolbar-dropdown-cancel",onClick:()=>c(!1),children:"Cancel"}),e.jsx("button",{type:"button",className:"monitoring-toolbar-dropdown-apply",onClick:ie,disabled:!d||!u,children:"Apply"})]})]})]}),Z&&e.jsx("button",{type:"button",className:"monitoring-toolbar-refresh",onClick:Q,"aria-label":"Refresh",children:e.jsx(ve,{size:14,stroke:1.5})})]})};m.__docgenInfo={description:"",methods:[],displayName:"MonitoringToolbar",props:{timeRangeOptions:{required:!1,tsType:{name:"Array",elements:[{name:"TimeRangeOption"}],raw:"TimeRangeOption[]"},description:"Time range options to display",defaultValue:{value:`[
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
        `}}},argTypes:{showRefresh:{control:"boolean",description:"새로고침 버튼 표시",table:{defaultValue:{summary:"true"}}},defaultTimeRange:{control:"select",options:["30m","1h","3h","6h","12h","24h"],description:"기본 시간 범위",table:{defaultValue:{summary:"30m"}}}}},T={render:()=>e.jsx(m,{onTimeRangeChange:a=>console.log("Time range:",a),onRefresh:()=>console.log("Refresh")})},w={render:function(){const[r,s]=n.useState("1h");return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(m,{timeRange:r,onTimeRangeChange:s,onRefresh:()=>console.log("Refresh")}),e.jsxs("p",{className:"text-sm text-[var(--color-text-muted)]",children:["Selected: ",r]})]})}},j={render:()=>e.jsx(m,{showRefresh:!1,onTimeRangeChange:a=>console.log("Time range:",a)})},y={render:()=>e.jsx(m,{timeRangeOptions:[{label:"15m",value:"30m"},{label:"30m",value:"30m"},{label:"1h",value:"1h"},{label:"2h",value:"3h"},{label:"4h",value:"6h"}],onTimeRangeChange:a=>console.log("Time range:",a),onRefresh:()=>console.log("Refresh")})},C={render:function(){const[r,s]=n.useState("custom"),[o,g]=n.useState({start:new Date(Date.now()-7*24*60*60*1e3),end:new Date});return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(m,{timeRange:r,onTimeRangeChange:s,customPeriod:o,onCustomPeriodChange:g,onRefresh:()=>console.log("Refresh")}),e.jsx("p",{className:"text-sm text-[var(--color-text-muted)]",children:o?`Custom: ${o.start.toLocaleDateString()} - ${o.end.toLocaleDateString()}`:`Selected: ${r}`})]})}},N={render:()=>e.jsxs("div",{className:"bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsx("h2",{className:"text-lg font-semibold",children:"CPU Usage"}),e.jsx(m,{defaultTimeRange:"1h",onTimeRangeChange:a=>console.log("Time range:",a),onRefresh:()=>console.log("Refresh")})]}),e.jsx("div",{className:"h-[200px] bg-[var(--color-surface-subtle)] rounded flex items-center justify-center text-[var(--color-text-muted)]",children:"Chart Placeholder"})]})};var q,O,I;T.parameters={...T.parameters,docs:{...(q=T.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <MonitoringToolbar onTimeRangeChange={range => console.log('Time range:', range)} onRefresh={() => console.log('Refresh')} />
}`,...(I=(O=T.parameters)==null?void 0:O.docs)==null?void 0:I.source}}};var V,E,L;w.parameters={...w.parameters,docs:{...(V=w.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: function ControlledStory() {
    const [timeRange, setTimeRange] = useState<'30m' | '1h' | '3h' | '6h' | '12h' | '24h' | '1d' | '1w' | 'custom'>('1h');
    return <div className="flex flex-col gap-4">
        <MonitoringToolbar timeRange={timeRange} onTimeRangeChange={setTimeRange} onRefresh={() => console.log('Refresh')} />
        <p className="text-sm text-[var(--color-text-muted)]">
          Selected: {timeRange}
        </p>
      </div>;
  }
}`,...(L=(E=w.parameters)==null?void 0:E.docs)==null?void 0:L.source}}};var _,A,U;j.parameters={...j.parameters,docs:{...(_=j.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => <MonitoringToolbar showRefresh={false} onTimeRangeChange={range => console.log('Time range:', range)} />
}`,...(U=(A=j.parameters)==null?void 0:A.docs)==null?void 0:U.source}}};var W,z,F;y.parameters={...y.parameters,docs:{...(W=y.parameters)==null?void 0:W.docs,source:{originalSource:`{
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
}`,...(B=(Y=C.parameters)==null?void 0:Y.docs)==null?void 0:B.source}}};var G,H,J;N.parameters={...N.parameters,docs:{...(G=N.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">CPU Usage</h2>
        <MonitoringToolbar defaultTimeRange="1h" onTimeRangeChange={range => console.log('Time range:', range)} onRefresh={() => console.log('Refresh')} />
      </div>
      <div className="h-[200px] bg-[var(--color-surface-subtle)] rounded flex items-center justify-center text-[var(--color-text-muted)]">
        Chart Placeholder
      </div>
    </div>
}`,...(J=(H=N.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};const De=["Default","Controlled","WithoutRefresh","CustomOptions","WithCustomPeriod","InDashboardContext"];export{w as Controlled,y as CustomOptions,T as Default,N as InDashboardContext,C as WithCustomPeriod,j as WithoutRefresh,De as __namedExportsOrder,Se as default};
