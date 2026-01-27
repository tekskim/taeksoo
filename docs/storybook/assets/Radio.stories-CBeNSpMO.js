import{r as s,j as e}from"./iframe-D96dQDLz.js";import{t as m}from"./bundle-mjs-BZSatpsL.js";import"./preload-helper-C1FmrZbK.js";const ie=s.createContext(null),ne=()=>s.useContext(ie);function o({label:n,description:i,children:t,name:v,value:r,defaultValue:C,onChange:b,disabled:d=!1,error:h=!1,errorMessage:u,direction:w="vertical",className:x=""}){const c=s.useId(),l=v??c,g=n?`${c}-label`:void 0,p=i?`${c}-description`:void 0,f=u?`${c}-error`:void 0,[z,le]=s.useState(C),D=r!==void 0,re=D?r:z,te=se=>{const q=se.target.value;D||le(q),b==null||b(q)};return e.jsx(ie.Provider,{value:{name:l,value:re,disabled:d,onChange:te},children:e.jsxs("fieldset",{className:m("flex flex-col gap-[var(--radio-group-gap)]",x),"aria-labelledby":g,"aria-describedby":[p,f].filter(Boolean).join(" ")||void 0,"aria-invalid":h||void 0,disabled:d,children:[n&&e.jsx("legend",{id:g,className:"text-[length:var(--radio-group-label-size)] leading-[var(--radio-group-label-line-height)] font-medium text-[var(--color-text-default)] mb-[var(--radio-group-label-gap)]",children:n}),i&&e.jsx("p",{id:p,className:"text-[length:var(--radio-description-size)] leading-[var(--radio-description-line-height)] text-[var(--radio-description-color)] -mt-2",children:i}),e.jsx("div",{role:"radiogroup",className:m("flex",w==="vertical"?"flex-col gap-[var(--radio-group-item-gap)]":"flex-row flex-wrap gap-[var(--radio-group-item-gap-horizontal)]"),children:t}),h&&u&&e.jsx("p",{id:f,role:"alert",className:"text-[length:var(--radio-error-size)] leading-[var(--radio-error-line-height)] text-[var(--radio-error-text)]",children:u})]})})}o.__docgenInfo={description:"",methods:[],displayName:"RadioGroup",props:{label:{required:!1,tsType:{name:"ReactNode"},description:"Group label"},description:{required:!1,tsType:{name:"ReactNode"},description:"Description for the group"},children:{required:!0,tsType:{name:"ReactNode"},description:"Children (Radio components)"},name:{required:!1,tsType:{name:"string"},description:"Form field name"},value:{required:!1,tsType:{name:"string"},description:"Controlled value"},defaultValue:{required:!1,tsType:{name:"string"},description:"Default value (uncontrolled)"},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:"Change handler"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disable all radios in group",defaultValue:{value:"false",computed:!1}},error:{required:!1,tsType:{name:"boolean"},description:"Error state",defaultValue:{value:"false",computed:!1}},errorMessage:{required:!1,tsType:{name:"string"},description:"Error message"},direction:{required:!1,tsType:{name:"union",raw:"'vertical' | 'horizontal'",elements:[{name:"literal",value:"'vertical'"},{name:"literal",value:"'horizontal'"}]},description:"Layout direction",defaultValue:{value:"'vertical'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Additional CSS classes",defaultValue:{value:"''",computed:!1}}}};const a=s.forwardRef(({label:n,description:i,value:t,disabled:v,className:r="",id:C,children:b,...d},h)=>{const u=n??b,w=s.useId(),x=C??w,c=i?`${x}-description`:void 0,l=ne(),g=d.name??(l==null?void 0:l.name),p=v??(l==null?void 0:l.disabled)??!1,f=l?l.value===t:d.checked,z=(l==null?void 0:l.onChange)??d.onChange;return e.jsxs("div",{className:m("flex flex-col gap-[var(--radio-description-gap)]",r),children:[e.jsxs("label",{htmlFor:x,className:m("inline-flex items-center gap-[var(--radio-gap)] cursor-pointer",p&&"cursor-not-allowed"),children:[e.jsx("input",{ref:h,type:"radio",id:x,name:g,value:t,checked:f,disabled:p,onChange:z,"aria-describedby":c,className:"sr-only peer",...d}),e.jsx("span",{className:m("shrink-0","w-[var(--radio-size)] h-[var(--radio-size)]","rounded-full","transition-all duration-[var(--duration-fast)]",p?"bg-[var(--radio-disabled-bg)]":f?"border-[length:var(--radio-checked-border-width)] border-[var(--radio-checked-border)] bg-[var(--radio-bg)]":"border-[length:var(--radio-border-width)] border-[var(--radio-border)] bg-[var(--radio-bg)]")}),u&&e.jsx("span",{className:m("text-[length:var(--radio-label-size)] leading-[var(--radio-label-line-height)] font-normal",p?"text-[var(--radio-label-disabled)]":"text-[var(--radio-label-color)]"),children:u})]}),i&&e.jsx("p",{id:c,className:"text-[length:var(--radio-description-size)] leading-[var(--radio-description-line-height)] text-[var(--radio-description-color)] ml-[calc(var(--radio-size)+var(--radio-gap))]",children:i})]})});a.displayName="Radio";a.__docgenInfo={description:"",methods:[],displayName:"Radio",props:{label:{required:!1,tsType:{name:"ReactNode"},description:"Radio label"},description:{required:!1,tsType:{name:"ReactNode"},description:"Description text"},value:{required:!0,tsType:{name:"string"},description:"Radio value"},children:{required:!1,tsType:{name:"ReactNode"},description:"Children (alternative to label)"},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["Omit"]};const ue={title:"Components/Radio",component:o,tags:["autodocs"],parameters:{docs:{description:{component:`
## Radio 컴포넌트

여러 옵션 중 하나만 선택할 수 있는 라디오 버튼입니다.

### 구성
- **Radio**: 개별 라디오 버튼
- **RadioGroup**: 라디오 버튼 그룹 (name 자동 관리)

### 사용 시기
- 상호 배타적인 옵션 선택 (하나만 선택 가능)
- 플랜 선택, 크기 선택, 정렬 방식 등

### Radio vs Checkbox vs Select
| | Radio | Checkbox | Select |
|---|---|---|---|
| **선택 개수** | 1개 | 0~N개 | 1개 |
| **옵션 표시** | 항상 보임 | 항상 보임 | 드롭다운 |
| **추천 옵션 수** | 2~5개 | 제한 없음 | 5개 이상 |

### 접근성
- 같은 name으로 그룹화
- 화살표 키로 옵션 이동
- 스크린리더 그룹/선택 상태 전달

### 예시
\`\`\`tsx
import { Radio, RadioGroup } from '@thaki/tds';

// 기본 사용
<RadioGroup defaultValue="option1">
  <Radio value="option1" label="옵션 1" />
  <Radio value="option2" label="옵션 2" />
</RadioGroup>

// Controlled
<RadioGroup value={plan} onChange={setPlan}>
  <Radio value="basic" label="Basic" />
  <Radio value="pro" label="Pro" />
</RadioGroup>

// 설명 포함
<RadioGroup label="알림 방식" description="선호하는 알림 방식을 선택하세요">
  <Radio value="email" label="이메일" description="이메일로 알림을 받습니다" />
  <Radio value="push" label="푸시 알림" description="앱 푸시 알림을 받습니다" />
</RadioGroup>
\`\`\`
        `}}},argTypes:{label:{control:"text",description:"그룹 라벨",table:{type:{summary:"string"}}},description:{control:"text",description:"그룹 설명",table:{type:{summary:"string"}}},value:{control:"text",description:"선택된 값 (controlled)",table:{type:{summary:"string"}}},defaultValue:{control:"text",description:"초기 선택 값 (uncontrolled)",table:{type:{summary:"string"}}},direction:{control:"select",options:["vertical","horizontal"],description:"레이아웃 방향",table:{type:{summary:'"vertical" | "horizontal"'},defaultValue:{summary:'"vertical"'}}},disabled:{control:"boolean",description:"전체 그룹 비활성화",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},required:{control:"boolean",description:"필수 필드 표시",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},error:{control:"boolean",description:"에러 상태",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},errorMessage:{control:"text",description:"에러 메시지",table:{type:{summary:"string"}}}}},R={render:()=>e.jsxs(o,{defaultValue:"option1",children:[e.jsx(a,{value:"option1",label:"Option 1"}),e.jsx(a,{value:"option2",label:"Option 2"}),e.jsx(a,{value:"option3",label:"Option 3"})]})},j={render:()=>e.jsxs(o,{label:"Notification preferences",description:"Choose how you want to receive notifications",defaultValue:"email",children:[e.jsx(a,{value:"email",label:"Email",description:"Receive notifications via email"}),e.jsx(a,{value:"sms",label:"SMS",description:"Receive notifications via text message"}),e.jsx(a,{value:"push",label:"Push",description:"Receive push notifications on your device"})]})},y={render:()=>e.jsxs(o,{direction:"horizontal",defaultValue:"small",children:[e.jsx(a,{value:"small",label:"Small"}),e.jsx(a,{value:"medium",label:"Medium"}),e.jsx(a,{value:"large",label:"Large"})]})},N={render:function(){const[i,t]=s.useState("option2");return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs(o,{value:i,onChange:t,children:[e.jsx(a,{value:"option1",label:"Option 1"}),e.jsx(a,{value:"option2",label:"Option 2"}),e.jsx(a,{value:"option3",label:"Option 3"})]}),e.jsxs("p",{className:"text-sm text-[var(--color-text-muted)]",children:["Selected: ",e.jsx("strong",{children:i})]})]})}},V={render:()=>e.jsxs("div",{className:"flex flex-col gap-6",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-medium mb-2",children:"All disabled"}),e.jsxs(o,{disabled:!0,defaultValue:"option1",children:[e.jsx(a,{value:"option1",label:"Option 1"}),e.jsx(a,{value:"option2",label:"Option 2"})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-medium mb-2",children:"Individual disabled"}),e.jsxs(o,{defaultValue:"option1",children:[e.jsx(a,{value:"option1",label:"Option 1"}),e.jsx(a,{value:"option2",label:"Option 2 (disabled)",disabled:!0}),e.jsx(a,{value:"option3",label:"Option 3"})]})]})]})},G={render:()=>e.jsxs(o,{label:"Select a plan",error:!0,errorMessage:"Please select a plan to continue",defaultValue:"",children:[e.jsx(a,{value:"basic",label:"Basic"}),e.jsx(a,{value:"pro",label:"Pro"}),e.jsx(a,{value:"enterprise",label:"Enterprise"})]})},O={render:function(){const[i,t]=s.useState("pro"),v=[{value:"basic",label:"Basic",description:"For individuals and small projects",price:"$9/month"},{value:"pro",label:"Professional",description:"For growing teams and businesses",price:"$29/month"},{value:"enterprise",label:"Enterprise",description:"For large organizations with custom needs",price:"Custom pricing"}];return e.jsx("div",{className:"w-[400px]",children:e.jsx(o,{label:"Choose your plan",value:i,onChange:t,children:v.map(r=>e.jsxs("div",{className:`p-4 border rounded-lg cursor-pointer transition-colors ${i===r.value?"border-[var(--color-action-primary)] bg-[var(--color-surface-subtle)]":"border-[var(--color-border-default)]"}`,onClick:()=>t(r.value),children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsx(a,{value:r.value,children:e.jsx("span",{className:"font-medium",children:r.label})}),e.jsx("span",{className:"text-sm font-medium text-[var(--color-action-primary)]",children:r.price})]}),e.jsx("p",{className:"ml-6 mt-1 text-sm text-[var(--color-text-muted)]",children:r.description})]},r.value))})})}},S={render:()=>e.jsxs("div",{className:"flex flex-col gap-6",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-medium mb-2",children:"Default"}),e.jsxs(o,{defaultValue:"option1",children:[e.jsx(a,{value:"option1",label:"Option 1"}),e.jsx(a,{value:"option2",label:"Option 2"})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-medium mb-2",children:"With descriptions"}),e.jsxs(o,{defaultValue:"option1",children:[e.jsx(a,{value:"option1",label:"Option 1",description:"Description for option 1"}),e.jsx(a,{value:"option2",label:"Option 2",description:"Description for option 2"})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-medium mb-2",children:"Horizontal"}),e.jsxs(o,{direction:"horizontal",defaultValue:"option1",children:[e.jsx(a,{value:"option1",label:"Left"}),e.jsx(a,{value:"option2",label:"Center"}),e.jsx(a,{value:"option3",label:"Right"})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-medium mb-2",children:"Disabled"}),e.jsxs(o,{disabled:!0,defaultValue:"option1",children:[e.jsx(a,{value:"option1",label:"Disabled checked"}),e.jsx(a,{value:"option2",label:"Disabled unchecked"})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-medium mb-2",children:"Error"}),e.jsxs(o,{error:!0,errorMessage:"This field is required",defaultValue:"",children:[e.jsx(a,{value:"option1",label:"Option 1"}),e.jsx(a,{value:"option2",label:"Option 2"})]})]})]})};var P,T,E;R.parameters={...R.parameters,docs:{...(P=R.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <RadioGroup defaultValue="option1">
      <Radio value="option1" label="Option 1" />
      <Radio value="option2" label="Option 2" />
      <Radio value="option3" label="Option 3" />
    </RadioGroup>
}`,...(E=(T=R.parameters)==null?void 0:T.docs)==null?void 0:E.source}}};var k,I,$;j.parameters={...j.parameters,docs:{...(k=j.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <RadioGroup label="Notification preferences" description="Choose how you want to receive notifications" defaultValue="email">
      <Radio value="email" label="Email" description="Receive notifications via email" />
      <Radio value="sms" label="SMS" description="Receive notifications via text message" />
      <Radio value="push" label="Push" description="Receive push notifications on your device" />
    </RadioGroup>
}`,...($=(I=j.parameters)==null?void 0:I.docs)==null?void 0:$.source}}};var M,F,L;y.parameters={...y.parameters,docs:{...(M=y.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <RadioGroup direction="horizontal" defaultValue="small">
      <Radio value="small" label="Small" />
      <Radio value="medium" label="Medium" />
      <Radio value="large" label="Large" />
    </RadioGroup>
}`,...(L=(F=y.parameters)==null?void 0:F.docs)==null?void 0:L.source}}};var A,B,W;N.parameters={...N.parameters,docs:{...(A=N.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: function ControlledRadio() {
    const [value, setValue] = useState('option2');
    return <div className="flex flex-col gap-4">
        <RadioGroup value={value} onChange={setValue}>
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
          <Radio value="option3" label="Option 3" />
        </RadioGroup>
        <p className="text-sm text-[var(--color-text-muted)]">
          Selected: <strong>{value}</strong>
        </p>
      </div>;
  }
}`,...(W=(B=N.parameters)==null?void 0:B.docs)==null?void 0:W.source}}};var _,H,J;V.parameters={...V.parameters,docs:{...(_=V.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium mb-2">All disabled</p>
        <RadioGroup disabled defaultValue="option1">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Individual disabled</p>
        <RadioGroup defaultValue="option1">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2 (disabled)" disabled />
          <Radio value="option3" label="Option 3" />
        </RadioGroup>
      </div>
    </div>
}`,...(J=(H=V.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};var K,Q,U;G.parameters={...G.parameters,docs:{...(K=G.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => <RadioGroup label="Select a plan" error errorMessage="Please select a plan to continue" defaultValue="">
      <Radio value="basic" label="Basic" />
      <Radio value="pro" label="Pro" />
      <Radio value="enterprise" label="Enterprise" />
    </RadioGroup>
}`,...(U=(Q=G.parameters)==null?void 0:Q.docs)==null?void 0:U.source}}};var X,Y,Z;O.parameters={...O.parameters,docs:{...(X=O.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: function PlanSelectionExample() {
    const [plan, setPlan] = useState('pro');
    const plans = [{
      value: 'basic',
      label: 'Basic',
      description: 'For individuals and small projects',
      price: '$9/month'
    }, {
      value: 'pro',
      label: 'Professional',
      description: 'For growing teams and businesses',
      price: '$29/month'
    }, {
      value: 'enterprise',
      label: 'Enterprise',
      description: 'For large organizations with custom needs',
      price: 'Custom pricing'
    }];
    return <div className="w-[400px]">
        <RadioGroup label="Choose your plan" value={plan} onChange={setPlan}>
          {plans.map(p => <div key={p.value} className={\`p-4 border rounded-lg cursor-pointer transition-colors \${plan === p.value ? 'border-[var(--color-action-primary)] bg-[var(--color-surface-subtle)]' : 'border-[var(--color-border-default)]'}\`} onClick={() => setPlan(p.value)}>
              <div className="flex items-start justify-between">
                <Radio value={p.value}>
                  <span className="font-medium">{p.label}</span>
                </Radio>
                <span className="text-sm font-medium text-[var(--color-action-primary)]">
                  {p.price}
                </span>
              </div>
              <p className="ml-6 mt-1 text-sm text-[var(--color-text-muted)]">{p.description}</p>
            </div>)}
        </RadioGroup>
      </div>;
  }
}`,...(Z=(Y=O.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var ee,ae,oe;S.parameters={...S.parameters,docs:{...(ee=S.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium mb-2">Default</p>
        <RadioGroup defaultValue="option1">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">With descriptions</p>
        <RadioGroup defaultValue="option1">
          <Radio value="option1" label="Option 1" description="Description for option 1" />
          <Radio value="option2" label="Option 2" description="Description for option 2" />
        </RadioGroup>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Horizontal</p>
        <RadioGroup direction="horizontal" defaultValue="option1">
          <Radio value="option1" label="Left" />
          <Radio value="option2" label="Center" />
          <Radio value="option3" label="Right" />
        </RadioGroup>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Disabled</p>
        <RadioGroup disabled defaultValue="option1">
          <Radio value="option1" label="Disabled checked" />
          <Radio value="option2" label="Disabled unchecked" />
        </RadioGroup>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Error</p>
        <RadioGroup error errorMessage="This field is required" defaultValue="">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      </div>
    </div>
}`,...(oe=(ae=S.parameters)==null?void 0:ae.docs)==null?void 0:oe.source}}};const me=["Default","WithLabelAndDescription","Horizontal","Controlled","Disabled","WithError","PlanSelection","AllStates"];export{S as AllStates,N as Controlled,R as Default,V as Disabled,y as Horizontal,O as PlanSelection,G as WithError,j as WithLabelAndDescription,me as __namedExportsOrder,ue as default};
