import{j as e,r as x}from"./iframe-ko1KmZFS.js";import{N as t}from"./NumberInput-s3iG6DeN.js";import{F as G}from"./FormField-DcMJW5cN.js";import"./preload-helper-C1FmrZbK.js";import"./cn-BMXv33oC.js";import"./IconChevronUp-D3wAWK98.js";import"./createReactComponent-B-brzlrB.js";import"./IconChevronDown-BvjhRmI4.js";const te={title:"Components/NumberInput",component:t,tags:["autodocs"],parameters:{docs:{description:{component:`
## NumberInput 컴포넌트

숫자 입력을 위한 폼 컴포넌트입니다. 증감 버튼(stepper)과 키보드 ArrowUp/Down 지원을 포함합니다.

### 사용 시기
- 숫자 값 입력 (수량, 포트 번호, CPU/메모리 설정 등)
- min/max 범위 제한이 필요한 경우
- step 단위 증감이 필요한 경우

### 너비 정책
- **xs**: 80px, **sm**: 160px, **md**: 240px, **lg**: 320px
- **half**: 50%, **full**: 100%
- 숫자를 전달하면 커스텀 픽셀 너비

### 접근성
- ArrowUp/Down 키보드 지원
- aria-invalid, aria-describedby 자동 연결
- stepper 버튼에 aria-label 설정

### 예시
\`\`\`tsx
import { NumberInput } from '@thaki/tds';

// 기본 사용
<NumberInput value={10} onChange={setValue} min={0} max={100} />

// FormField와 함께
<FormField label="CPU Cores" helperText="1-16 cores">
  <NumberInput value={4} onChange={setValue} min={1} max={16} width="sm" />
</FormField>
\`\`\`
        `}}},argTypes:{width:{control:"select",options:["xs","sm","md","lg","half","full"],description:"너비 변형",table:{type:{summary:'"xs" | "sm" | "md" | "lg" | "half" | "full" | number'}}},min:{control:"number",description:"최소값",table:{type:{summary:"number"}}},max:{control:"number",description:"최대값",table:{type:{summary:"number"}}},step:{control:"number",description:"증감 단위",table:{type:{summary:"number"},defaultValue:{summary:"1"}}},disabled:{control:"boolean",description:"비활성화 상태",table:{defaultValue:{summary:"false"}}},hideSteppers:{control:"boolean",description:"증감 버튼 숨김",table:{defaultValue:{summary:"false"}}},error:{control:"text",description:"에러 메시지 또는 에러 상태 (boolean)",table:{type:{summary:"string | boolean"}}}}},s={args:{defaultValue:10,width:"sm"}},l={render:function(){const[a,r]=x.useState(5);return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-2)]",children:[e.jsx(t,{value:a,onChange:r,width:"sm"}),e.jsxs("p",{className:"text-body-sm text-[var(--color-text-subtle)]",children:["현재 값: ",a]})]})}},i={render:function(){const[a,r]=x.useState(5);return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-2)]",children:[e.jsx(t,{value:a,onChange:r,min:0,max:10,width:"sm"}),e.jsxs("p",{className:"text-body-sm text-[var(--color-text-subtle)]",children:["범위: 0 ~ 10, 현재: ",a]})]})}},n={render:function(){const[a,r]=x.useState(0);return e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-2)]",children:[e.jsx(t,{value:a,onChange:r,step:5,min:0,max:100,width:"sm"}),e.jsxs("p",{className:"text-body-sm text-[var(--color-text-subtle)]",children:["Step: 5, 현재: ",a]})]})}},m={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-1)]",children:"xs (80px)"}),e.jsx(t,{defaultValue:1,width:"xs"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-1)]",children:"sm (160px)"}),e.jsx(t,{defaultValue:10,width:"sm"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-1)]",children:"md (240px)"}),e.jsx(t,{defaultValue:100,width:"md"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-1)]",children:"lg (320px)"}),e.jsx(t,{defaultValue:1e3,width:"lg"})]})]})},d={args:{defaultValue:42,width:"sm",hideSteppers:!0}},o={args:{defaultValue:-1,width:"sm",error:"Value must be greater than 0"}},p={render:()=>e.jsx(G,{label:"Port Number",helperText:"1024-65535 범위의 포트 번호",children:e.jsx(t,{defaultValue:8080,width:"sm"})})},u={args:{defaultValue:10,width:"sm",disabled:!0}},c={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-1)]",children:"Default"}),e.jsx(t,{defaultValue:10,width:"sm"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-1)]",children:"Disabled"}),e.jsx(t,{defaultValue:10,width:"sm",disabled:!0})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-1)]",children:"Error"}),e.jsx(t,{defaultValue:-1,width:"sm",error:"Invalid value"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-1)]",children:"Hide Steppers"}),e.jsx(t,{defaultValue:42,width:"sm",hideSteppers:!0})]})]})};var b,h,g;s.parameters={...s.parameters,docs:{...(b=s.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    defaultValue: 10,
    width: 'sm'
  }
}`,...(g=(h=s.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};var f,N,V;l.parameters={...l.parameters,docs:{...(f=l.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: function ControlledExample() {
    const [value, setValue] = useState(5);
    return <div className="flex flex-col gap-[var(--primitive-spacing-2)]">
        <NumberInput value={value} onChange={setValue} width="sm" />
        <p className="text-body-sm text-[var(--color-text-subtle)]">현재 값: {value}</p>
      </div>;
  }
}`,...(V=(N=l.parameters)==null?void 0:N.docs)==null?void 0:V.source}}};var j,w,S;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: function MinMaxExample() {
    const [value, setValue] = useState(5);
    return <div className="flex flex-col gap-[var(--primitive-spacing-2)]">
        <NumberInput value={value} onChange={setValue} min={0} max={10} width="sm" />
        <p className="text-body-sm text-[var(--color-text-subtle)]">범위: 0 ~ 10, 현재: {value}</p>
      </div>;
  }
}`,...(S=(w=i.parameters)==null?void 0:w.docs)==null?void 0:S.source}}};var y,I,C;n.parameters={...n.parameters,docs:{...(y=n.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: function StepExample() {
    const [value, setValue] = useState(0);
    return <div className="flex flex-col gap-[var(--primitive-spacing-2)]">
        <NumberInput value={value} onChange={setValue} step={5} min={0} max={100} width="sm" />
        <p className="text-body-sm text-[var(--color-text-subtle)]">Step: 5, 현재: {value}</p>
      </div>;
  }
}`,...(C=(I=n.parameters)==null?void 0:I.docs)==null?void 0:C.source}}};var E,F,D;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-1)]">
          xs (80px)
        </p>
        <NumberInput defaultValue={1} width="xs" />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-1)]">
          sm (160px)
        </p>
        <NumberInput defaultValue={10} width="sm" />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-1)]">
          md (240px)
        </p>
        <NumberInput defaultValue={100} width="md" />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-1)]">
          lg (320px)
        </p>
        <NumberInput defaultValue={1000} width="lg" />
      </div>
    </div>
}`,...(D=(F=m.parameters)==null?void 0:F.docs)==null?void 0:D.source}}};var W,M,A;d.parameters={...d.parameters,docs:{...(W=d.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    defaultValue: 42,
    width: 'sm',
    hideSteppers: true
  }
}`,...(A=(M=d.parameters)==null?void 0:M.docs)==null?void 0:A.source}}};var H,P,T;o.parameters={...o.parameters,docs:{...(H=o.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    defaultValue: -1,
    width: 'sm',
    error: 'Value must be greater than 0'
  }
}`,...(T=(P=o.parameters)==null?void 0:P.docs)==null?void 0:T.source}}};var U,L,_;p.parameters={...p.parameters,docs:{...(U=p.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => <FormField label="Port Number" helperText="1024-65535 범위의 포트 번호">
      <NumberInput defaultValue={8080} width="sm" />
    </FormField>
}`,...(_=(L=p.parameters)==null?void 0:L.docs)==null?void 0:_.source}}};var k,O,R;u.parameters={...u.parameters,docs:{...(k=u.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    defaultValue: 10,
    width: 'sm',
    disabled: true
  }
}`,...(R=(O=u.parameters)==null?void 0:O.docs)==null?void 0:R.source}}};var q,z,B;c.parameters={...c.parameters,docs:{...(q=c.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-1)]">
          Default
        </p>
        <NumberInput defaultValue={10} width="sm" />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-1)]">
          Disabled
        </p>
        <NumberInput defaultValue={10} width="sm" disabled />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-1)]">
          Error
        </p>
        <NumberInput defaultValue={-1} width="sm" error="Invalid value" />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-1)]">
          Hide Steppers
        </p>
        <NumberInput defaultValue={42} width="sm" hideSteppers />
      </div>
    </div>
}`,...(B=(z=c.parameters)==null?void 0:z.docs)==null?void 0:B.source}}};const ae=["Default","Controlled","WithMinMax","WithStep","WidthVariants","HideSteppers","WithError","WithLabel","Disabled","AllStates"];export{c as AllStates,l as Controlled,s as Default,u as Disabled,d as HideSteppers,m as WidthVariants,o as WithError,p as WithLabel,i as WithMinMax,n as WithStep,ae as __namedExportsOrder,te as default};
