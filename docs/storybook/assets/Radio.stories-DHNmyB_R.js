import{r as n,j as e}from"./iframe-DkQu90e3.js";import{t as b}from"./cn-8AORBNJN.js";import"./preload-helper-C1FmrZbK.js";const re=n.createContext(null),pe=()=>n.useContext(re);function i({label:s,description:l,children:t,options:d,name:r,value:h,defaultValue:q,onChange:x,disabled:p=!1,error:R=!1,errorMessage:v,direction:D="vertical",className:f=""}){const c=n.useId(),o=r??c,j=s?`${c}-label`:void 0,u=l?`${c}-description`:void 0,g=v?`${c}-error`:void 0,[T,te]=n.useState(q),z=h!==void 0,ne=z?h:T,se=m=>{const P=m.target.value;z||te(P),x==null||x(P)},de=()=>d&&d.length>0?d.map(m=>e.jsx(a,{value:m.value,label:m.label,description:m.description,disabled:m.disabled},m.value)):t;return e.jsx(re.Provider,{value:{name:o,value:ne,disabled:p,onChange:se},children:e.jsxs("fieldset",{className:b("flex flex-col gap-0",f),"aria-labelledby":j,"aria-describedby":[u,g].filter(Boolean).join(" ")||void 0,"aria-invalid":R||void 0,disabled:p,children:[s&&e.jsx("legend",{id:j,className:`text-label-lg text-[var(--color-text-default)] ${l?"mb-[var(--primitive-spacing-1)]":"mb-[var(--primitive-spacing-3)]"}`,children:s}),l&&e.jsx("p",{id:u,className:"text-body-md text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-3)]",children:l}),e.jsx("div",{role:"radiogroup",className:b("flex",D==="vertical"?"flex-col gap-[var(--radio-group-item-gap)]":"flex-row flex-wrap gap-[var(--radio-group-item-gap-horizontal)]"),children:de()}),R&&v&&e.jsx("p",{id:g,role:"alert",className:"text-body-sm text-[var(--color-state-danger)] mt-[var(--primitive-spacing-2)]",children:v})]})})}i.__docgenInfo={description:"",methods:[],displayName:"RadioGroup",props:{label:{required:!1,tsType:{name:"ReactNode"},description:"Group label"},description:{required:!1,tsType:{name:"ReactNode"},description:"Description for the group"},children:{required:!1,tsType:{name:"ReactNode"},description:"Children (Radio components) - use this OR options"},options:{required:!1,tsType:{name:"Array",elements:[{name:"RadioOption"}],raw:"RadioOption[]"},description:"Options array (thaki-ui compatible) - use this OR children"},name:{required:!1,tsType:{name:"string"},description:"Form field name"},value:{required:!1,tsType:{name:"string"},description:"Controlled value"},defaultValue:{required:!1,tsType:{name:"string"},description:"Default value (uncontrolled)"},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:"Change handler"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disable all radios in group",defaultValue:{value:"false",computed:!1}},error:{required:!1,tsType:{name:"boolean"},description:"Error state",defaultValue:{value:"false",computed:!1}},errorMessage:{required:!1,tsType:{name:"string"},description:"Error message"},direction:{required:!1,tsType:{name:"union",raw:"'vertical' | 'horizontal'",elements:[{name:"literal",value:"'vertical'"},{name:"literal",value:"'horizontal'"}]},description:"Layout direction",defaultValue:{value:"'vertical'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Additional CSS classes",defaultValue:{value:"''",computed:!1}}}};const a=n.forwardRef(({label:s,description:l,value:t,disabled:d,className:r="",id:h,children:q,multiline:x,...p},R)=>{const v=s??q,D=n.useId(),f=h??D,c=l?`${f}-description`:void 0,o=pe(),j=p.name??(o==null?void 0:o.name),u=d??(o==null?void 0:o.disabled)??!1,g=o?o.value===t:p.checked,T=(o==null?void 0:o.onChange)??p.onChange;return e.jsxs("div",{className:b("flex flex-col gap-[var(--radio-description-gap)]",r),"data-figma-name":"Radio",children:[e.jsxs("label",{htmlFor:f,className:b("inline-flex items-start gap-[var(--radio-gap)] cursor-pointer",u&&"cursor-not-allowed"),children:[e.jsx("input",{ref:R,type:"radio",id:f,name:j,value:t,checked:g,disabled:u,onChange:T,"aria-describedby":c,className:"sr-only peer",...p}),e.jsx("span",{className:b("shrink-0",x&&"mt-[2px]","w-[var(--radio-size)] h-[var(--radio-size)]","rounded-full","transition-all duration-[var(--duration-fast)]",u?"bg-[var(--radio-disabled-bg)]":g?"border-[length:var(--radio-checked-border-width)] border-[var(--radio-checked-border)] bg-[var(--radio-bg)]":"border-[length:var(--radio-border-width)] border-[var(--radio-border)] bg-[var(--radio-bg)]")}),v&&e.jsx("span",{className:b("text-[length:var(--radio-label-size)] leading-[var(--radio-label-line-height)] font-normal",u?"text-[var(--radio-label-disabled)]":"text-[var(--radio-label-color)]"),children:v})]}),l&&e.jsx("p",{id:c,className:"text-[length:var(--radio-description-size)] leading-[var(--radio-description-line-height)] text-[var(--radio-description-color)] ml-[calc(var(--radio-size)+var(--radio-gap))]",children:l})]})});a.displayName="Radio";a.__docgenInfo={description:"",methods:[],displayName:"Radio",props:{label:{required:!1,tsType:{name:"ReactNode"},description:"Radio label"},description:{required:!1,tsType:{name:"ReactNode"},description:"Description text"},value:{required:!0,tsType:{name:"string"},description:"Radio value"},children:{required:!1,tsType:{name:"ReactNode"},description:"Children (alternative to label)"},multiline:{required:!1,tsType:{name:"boolean"},description:"Apply 2px top offset to radio circle for multiline label alignment"},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["Omit"]};const ve={title:"Components/Radio",component:i,tags:["autodocs"],parameters:{docs:{description:{component:`
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
        `}}},argTypes:{label:{control:"text",description:"그룹 라벨",table:{type:{summary:"string"}}},description:{control:"text",description:"그룹 설명",table:{type:{summary:"string"}}},value:{control:"text",description:"선택된 값 (controlled)",table:{type:{summary:"string"}}},defaultValue:{control:"text",description:"초기 선택 값 (uncontrolled)",table:{type:{summary:"string"}}},direction:{control:"select",options:["vertical","horizontal"],description:"레이아웃 방향",table:{type:{summary:'"vertical" | "horizontal"'},defaultValue:{summary:'"vertical"'}}},disabled:{control:"boolean",description:"전체 그룹 비활성화",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},required:{control:"boolean",description:"필수 필드 표시",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},error:{control:"boolean",description:"에러 상태",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},errorMessage:{control:"text",description:"에러 메시지",table:{type:{summary:"string"}}}}},y={render:()=>e.jsxs(i,{defaultValue:"option1",children:[e.jsx(a,{value:"option1",label:"Option 1"}),e.jsx(a,{value:"option2",label:"Option 2"}),e.jsx(a,{value:"option3",label:"Option 3"})]})},N={render:()=>e.jsxs(i,{label:"Notification preferences",description:"Choose how you want to receive notifications",defaultValue:"email",children:[e.jsx(a,{value:"email",label:"Email",description:"Receive notifications via email"}),e.jsx(a,{value:"sms",label:"SMS",description:"Receive notifications via text message"}),e.jsx(a,{value:"push",label:"Push",description:"Receive push notifications on your device"})]})},O={render:()=>e.jsxs(i,{direction:"horizontal",defaultValue:"small",children:[e.jsx(a,{value:"small",label:"Small"}),e.jsx(a,{value:"medium",label:"Medium"}),e.jsx(a,{value:"large",label:"Large"})]})},V={render:function(){const[l,t]=n.useState("option2");return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsxs(i,{value:l,onChange:t,children:[e.jsx(a,{value:"option1",label:"Option 1"}),e.jsx(a,{value:"option2",label:"Option 2"}),e.jsx(a,{value:"option3",label:"Option 3"})]}),e.jsxs("p",{className:"text-body-md text-[var(--color-text-muted)]",children:["Selected: ",e.jsx("strong",{children:l})]})]})}},G={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-6)]",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]",children:"All disabled"}),e.jsxs(i,{disabled:!0,defaultValue:"option1",children:[e.jsx(a,{value:"option1",label:"Option 1"}),e.jsx(a,{value:"option2",label:"Option 2"})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]",children:"Individual disabled"}),e.jsxs(i,{defaultValue:"option1",children:[e.jsx(a,{value:"option1",label:"Option 1"}),e.jsx(a,{value:"option2",label:"Option 2 (disabled)",disabled:!0}),e.jsx(a,{value:"option3",label:"Option 3"})]})]})]})},S={render:()=>e.jsxs(i,{label:"Select a plan",error:!0,errorMessage:"Please select a plan to continue",defaultValue:"",children:[e.jsx(a,{value:"basic",label:"Basic"}),e.jsx(a,{value:"pro",label:"Pro"}),e.jsx(a,{value:"enterprise",label:"Enterprise"})]})},C={render:function(){const[l,t]=n.useState("pro"),d=[{value:"basic",label:"Basic",description:"For individuals and small projects",price:"$9/month"},{value:"pro",label:"Professional",description:"For growing teams and businesses",price:"$29/month"},{value:"enterprise",label:"Enterprise",description:"For large organizations with custom needs",price:"Custom pricing"}];return e.jsx("div",{className:"w-[400px]",children:e.jsx(i,{label:"Choose your plan",value:l,onChange:t,children:d.map(r=>e.jsxs("div",{className:`p-[var(--primitive-spacing-4)] border rounded-[var(--primitive-radius-lg)] cursor-pointer transition-colors ${l===r.value?"border-[var(--color-action-primary)] bg-[var(--color-surface-subtle)]":"border-[var(--color-border-default)]"}`,onClick:()=>t(r.value),children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsx(a,{value:r.value,children:e.jsx("span",{className:"text-label-lg",children:r.label})}),e.jsx("span",{className:"text-label-md text-[var(--color-action-primary)]",children:r.price})]}),e.jsx("p",{className:"ml-[var(--primitive-spacing-6)] mt-[var(--primitive-spacing-1)] text-body-md text-[var(--color-text-muted)]",children:r.description})]},r.value))})})}},w={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-6)]",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]",children:"Default"}),e.jsxs(i,{defaultValue:"option1",children:[e.jsx(a,{value:"option1",label:"Option 1"}),e.jsx(a,{value:"option2",label:"Option 2"})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]",children:"With descriptions"}),e.jsxs(i,{defaultValue:"option1",children:[e.jsx(a,{value:"option1",label:"Option 1",description:"Description for option 1"}),e.jsx(a,{value:"option2",label:"Option 2",description:"Description for option 2"})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]",children:"Horizontal"}),e.jsxs(i,{direction:"horizontal",defaultValue:"option1",children:[e.jsx(a,{value:"option1",label:"Left"}),e.jsx(a,{value:"option2",label:"Center"}),e.jsx(a,{value:"option3",label:"Right"})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]",children:"Disabled"}),e.jsxs(i,{disabled:!0,defaultValue:"option1",children:[e.jsx(a,{value:"option1",label:"Disabled checked"}),e.jsx(a,{value:"option2",label:"Disabled unchecked"})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]",children:"Error"}),e.jsxs(i,{error:!0,errorMessage:"This field is required",defaultValue:"",children:[e.jsx(a,{value:"option1",label:"Option 1"}),e.jsx(a,{value:"option2",label:"Option 2"})]})]})]})};var k,E,I;y.parameters={...y.parameters,docs:{...(k=y.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <RadioGroup defaultValue="option1">
      <Radio value="option1" label="Option 1" />
      <Radio value="option2" label="Option 2" />
      <Radio value="option3" label="Option 3" />
    </RadioGroup>
}`,...(I=(E=y.parameters)==null?void 0:E.docs)==null?void 0:I.source}}};var $,A,M;N.parameters={...N.parameters,docs:{...($=N.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <RadioGroup label="Notification preferences" description="Choose how you want to receive notifications" defaultValue="email">
      <Radio value="email" label="Email" description="Receive notifications via email" />
      <Radio value="sms" label="SMS" description="Receive notifications via text message" />
      <Radio value="push" label="Push" description="Receive push notifications on your device" />
    </RadioGroup>
}`,...(M=(A=N.parameters)==null?void 0:A.docs)==null?void 0:M.source}}};var F,L,B;O.parameters={...O.parameters,docs:{...(F=O.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <RadioGroup direction="horizontal" defaultValue="small">
      <Radio value="small" label="Small" />
      <Radio value="medium" label="Medium" />
      <Radio value="large" label="Large" />
    </RadioGroup>
}`,...(B=(L=O.parameters)==null?void 0:L.docs)==null?void 0:B.source}}};var W,_,H;V.parameters={...V.parameters,docs:{...(W=V.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: function ControlledRadio() {
    const [value, setValue] = useState('option2');
    return <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        <RadioGroup value={value} onChange={setValue}>
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
          <Radio value="option3" label="Option 3" />
        </RadioGroup>
        <p className="text-body-md text-[var(--color-text-muted)]">
          Selected: <strong>{value}</strong>
        </p>
      </div>;
  }
}`,...(H=(_=V.parameters)==null?void 0:_.docs)==null?void 0:H.source}}};var J,K,Q;G.parameters={...G.parameters,docs:{...(J=G.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-6)]">
      <div>
        <p className="text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          All disabled
        </p>
        <RadioGroup disabled defaultValue="option1">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      </div>
      <div>
        <p className="text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          Individual disabled
        </p>
        <RadioGroup defaultValue="option1">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2 (disabled)" disabled />
          <Radio value="option3" label="Option 3" />
        </RadioGroup>
      </div>
    </div>
}`,...(Q=(K=G.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};var U,X,Y;S.parameters={...S.parameters,docs:{...(U=S.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => <RadioGroup label="Select a plan" error errorMessage="Please select a plan to continue" defaultValue="">
      <Radio value="basic" label="Basic" />
      <Radio value="pro" label="Pro" />
      <Radio value="enterprise" label="Enterprise" />
    </RadioGroup>
}`,...(Y=(X=S.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,ee,ae;C.parameters={...C.parameters,docs:{...(Z=C.parameters)==null?void 0:Z.docs,source:{originalSource:`{
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
          {plans.map(p => <div key={p.value} className={\`p-[var(--primitive-spacing-4)] border rounded-[var(--primitive-radius-lg)] cursor-pointer transition-colors \${plan === p.value ? 'border-[var(--color-action-primary)] bg-[var(--color-surface-subtle)]' : 'border-[var(--color-border-default)]'}\`} onClick={() => setPlan(p.value)}>
              <div className="flex items-start justify-between">
                <Radio value={p.value}>
                  <span className="text-label-lg">{p.label}</span>
                </Radio>
                <span className="text-label-md text-[var(--color-action-primary)]">{p.price}</span>
              </div>
              <p className="ml-[var(--primitive-spacing-6)] mt-[var(--primitive-spacing-1)] text-body-md text-[var(--color-text-muted)]">
                {p.description}
              </p>
            </div>)}
        </RadioGroup>
      </div>;
  }
}`,...(ae=(ee=C.parameters)==null?void 0:ee.docs)==null?void 0:ae.source}}};var ie,le,oe;w.parameters={...w.parameters,docs:{...(ie=w.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-6)]">
      <div>
        <p className="text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          Default
        </p>
        <RadioGroup defaultValue="option1">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      </div>

      <div>
        <p className="text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          With descriptions
        </p>
        <RadioGroup defaultValue="option1">
          <Radio value="option1" label="Option 1" description="Description for option 1" />
          <Radio value="option2" label="Option 2" description="Description for option 2" />
        </RadioGroup>
      </div>

      <div>
        <p className="text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          Horizontal
        </p>
        <RadioGroup direction="horizontal" defaultValue="option1">
          <Radio value="option1" label="Left" />
          <Radio value="option2" label="Center" />
          <Radio value="option3" label="Right" />
        </RadioGroup>
      </div>

      <div>
        <p className="text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          Disabled
        </p>
        <RadioGroup disabled defaultValue="option1">
          <Radio value="option1" label="Disabled checked" />
          <Radio value="option2" label="Disabled unchecked" />
        </RadioGroup>
      </div>

      <div>
        <p className="text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]">
          Error
        </p>
        <RadioGroup error errorMessage="This field is required" defaultValue="">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      </div>
    </div>
}`,...(oe=(le=w.parameters)==null?void 0:le.docs)==null?void 0:oe.source}}};const be=["Default","WithLabelAndDescription","Horizontal","Controlled","Disabled","WithError","PlanSelection","AllStates"];export{w as AllStates,V as Controlled,y as Default,G as Disabled,O as Horizontal,C as PlanSelection,S as WithError,N as WithLabelAndDescription,be as __namedExportsOrder,ve as default};
