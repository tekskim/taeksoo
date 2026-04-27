import{j as e,r as L}from"./iframe-BGa_n0Au.js";import{a as o,R as a}from"./Radio-Drez4Zx8.js";import"./preload-helper-C1FmrZbK.js";import"./cn-BMXv33oC.js";const I={title:"Components/Radio",component:o,tags:["autodocs"],parameters:{docs:{description:{component:`
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
        `}}},argTypes:{label:{control:"text",description:"그룹 라벨",table:{type:{summary:"string"}}},description:{control:"text",description:"그룹 설명",table:{type:{summary:"string"}}},value:{control:"text",description:"선택된 값 (controlled)",table:{type:{summary:"string"}}},defaultValue:{control:"text",description:"초기 선택 값 (uncontrolled)",table:{type:{summary:"string"}}},direction:{control:"select",options:["vertical","horizontal"],description:"레이아웃 방향",table:{type:{summary:'"vertical" | "horizontal"'},defaultValue:{summary:'"vertical"'}}},disabled:{control:"boolean",description:"전체 그룹 비활성화",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},required:{control:"boolean",description:"필수 필드 표시",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},error:{control:"boolean",description:"에러 상태",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},errorMessage:{control:"text",description:"에러 메시지",table:{type:{summary:"string"}}}}},r={render:()=>e.jsxs(o,{defaultValue:"option1",children:[e.jsx(a,{value:"option1",label:"Option 1"}),e.jsx(a,{value:"option2",label:"Option 2"}),e.jsx(a,{value:"option3",label:"Option 3"})]})},n={render:()=>e.jsxs(o,{label:"Notification preferences",description:"Choose how you want to receive notifications",defaultValue:"email",children:[e.jsx(a,{value:"email",label:"Email",description:"Receive notifications via email"}),e.jsx(a,{value:"sms",label:"SMS",description:"Receive notifications via text message"}),e.jsx(a,{value:"push",label:"Push",description:"Receive push notifications on your device"})]})},s={render:()=>e.jsxs(o,{direction:"horizontal",defaultValue:"small",children:[e.jsx(a,{value:"small",label:"Small"}),e.jsx(a,{value:"medium",label:"Medium"}),e.jsx(a,{value:"large",label:"Large"})]})},d={render:function(){const[l,t]=L.useState("option2");return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsxs(o,{value:l,onChange:t,children:[e.jsx(a,{value:"option1",label:"Option 1"}),e.jsx(a,{value:"option2",label:"Option 2"}),e.jsx(a,{value:"option3",label:"Option 3"})]}),e.jsxs("p",{className:"text-body-md text-[var(--color-text-muted)]",children:["Selected: ",e.jsx("strong",{children:l})]})]})}},p={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-6)]",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]",children:"All disabled"}),e.jsxs(o,{disabled:!0,defaultValue:"option1",children:[e.jsx(a,{value:"option1",label:"Option 1"}),e.jsx(a,{value:"option2",label:"Option 2"})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]",children:"Individual disabled"}),e.jsxs(o,{defaultValue:"option1",children:[e.jsx(a,{value:"option1",label:"Option 1"}),e.jsx(a,{value:"option2",label:"Option 2 (disabled)",disabled:!0}),e.jsx(a,{value:"option3",label:"Option 3"})]})]})]})},c={render:()=>e.jsxs(o,{label:"Select a plan",error:!0,errorMessage:"Please select a plan to continue",defaultValue:"",children:[e.jsx(a,{value:"basic",label:"Basic"}),e.jsx(a,{value:"pro",label:"Pro"}),e.jsx(a,{value:"enterprise",label:"Enterprise"})]})},u={render:function(){const[l,t]=L.useState("pro"),$=[{value:"basic",label:"Basic",description:"For individuals and small projects",price:"$9/month"},{value:"pro",label:"Professional",description:"For growing teams and businesses",price:"$29/month"},{value:"enterprise",label:"Enterprise",description:"For large organizations with custom needs",price:"Custom pricing"}];return e.jsx("div",{className:"w-[400px]",children:e.jsx(o,{label:"Choose your plan",value:l,onChange:t,children:$.map(i=>e.jsxs("div",{className:`p-[var(--primitive-spacing-4)] border rounded-[var(--primitive-radius-lg)] cursor-pointer transition-colors ${l===i.value?"border-[var(--color-action-primary)] bg-[var(--color-surface-subtle)]":"border-[var(--color-border-default)]"}`,onClick:()=>t(i.value),children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsx(a,{value:i.value,children:e.jsx("span",{className:"text-label-lg",children:i.label})}),e.jsx("span",{className:"text-label-md text-[var(--color-action-primary)]",children:i.price})]}),e.jsx("p",{className:"ml-[var(--primitive-spacing-6)] mt-[var(--primitive-spacing-1)] text-body-md text-[var(--color-text-muted)]",children:i.description})]},i.value))})})}},v={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-6)]",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]",children:"Default"}),e.jsxs(o,{defaultValue:"option1",children:[e.jsx(a,{value:"option1",label:"Option 1"}),e.jsx(a,{value:"option2",label:"Option 2"})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]",children:"With descriptions"}),e.jsxs(o,{defaultValue:"option1",children:[e.jsx(a,{value:"option1",label:"Option 1",description:"Description for option 1"}),e.jsx(a,{value:"option2",label:"Option 2",description:"Description for option 2"})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]",children:"Horizontal"}),e.jsxs(o,{direction:"horizontal",defaultValue:"option1",children:[e.jsx(a,{value:"option1",label:"Left"}),e.jsx(a,{value:"option2",label:"Center"}),e.jsx(a,{value:"option3",label:"Right"})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]",children:"Disabled"}),e.jsxs(o,{disabled:!0,defaultValue:"option1",children:[e.jsx(a,{value:"option1",label:"Disabled checked"}),e.jsx(a,{value:"option2",label:"Disabled unchecked"})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-md text-[var(--color-text-default)] mb-[var(--primitive-spacing-2)]",children:"Error"}),e.jsxs(o,{error:!0,errorMessage:"This field is required",defaultValue:"",children:[e.jsx(a,{value:"option1",label:"Option 1"}),e.jsx(a,{value:"option2",label:"Option 2"})]})]})]})};var m,b,x;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <RadioGroup defaultValue="option1">
      <Radio value="option1" label="Option 1" />
      <Radio value="option2" label="Option 2" />
      <Radio value="option3" label="Option 3" />
    </RadioGroup>
}`,...(x=(b=r.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};var f,R,h;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <RadioGroup label="Notification preferences" description="Choose how you want to receive notifications" defaultValue="email">
      <Radio value="email" label="Email" description="Receive notifications via email" />
      <Radio value="sms" label="SMS" description="Receive notifications via text message" />
      <Radio value="push" label="Push" description="Receive push notifications on your device" />
    </RadioGroup>
}`,...(h=(R=n.parameters)==null?void 0:R.docs)==null?void 0:h.source}}};var g,j,y;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <RadioGroup direction="horizontal" defaultValue="small">
      <Radio value="small" label="Small" />
      <Radio value="medium" label="Medium" />
      <Radio value="large" label="Large" />
    </RadioGroup>
}`,...(y=(j=s.parameters)==null?void 0:j.docs)==null?void 0:y.source}}};var N,G,O;d.parameters={...d.parameters,docs:{...(N=d.parameters)==null?void 0:N.docs,source:{originalSource:`{
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
}`,...(O=(G=d.parameters)==null?void 0:G.docs)==null?void 0:O.source}}};var V,S,C;p.parameters={...p.parameters,docs:{...(V=p.parameters)==null?void 0:V.docs,source:{originalSource:`{
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
}`,...(C=(S=p.parameters)==null?void 0:S.docs)==null?void 0:C.source}}};var D,P,E;c.parameters={...c.parameters,docs:{...(D=c.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => <RadioGroup label="Select a plan" error errorMessage="Please select a plan to continue" defaultValue="">
      <Radio value="basic" label="Basic" />
      <Radio value="pro" label="Pro" />
      <Radio value="enterprise" label="Enterprise" />
    </RadioGroup>
}`,...(E=(P=c.parameters)==null?void 0:P.docs)==null?void 0:E.source}}};var w,z,k;u.parameters={...u.parameters,docs:{...(w=u.parameters)==null?void 0:w.docs,source:{originalSource:`{
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
}`,...(k=(z=u.parameters)==null?void 0:z.docs)==null?void 0:k.source}}};var M,A,F;v.parameters={...v.parameters,docs:{...(M=v.parameters)==null?void 0:M.docs,source:{originalSource:`{
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
}`,...(F=(A=v.parameters)==null?void 0:A.docs)==null?void 0:F.source}}};const _=["Default","WithLabelAndDescription","Horizontal","Controlled","Disabled","WithError","PlanSelection","AllStates"];export{v as AllStates,d as Controlled,r as Default,p as Disabled,s as Horizontal,u as PlanSelection,c as WithError,n as WithLabelAndDescription,_ as __namedExportsOrder,I as default};
