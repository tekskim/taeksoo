import{j as e,r as ge}from"./iframe-DkQu90e3.js";import{I as r}from"./Input-D09Kgrqi.js";import{F as a}from"./FormField-2j2WXave.js";import{c as ye}from"./createReactComponent-Bn1mjhIb.js";import{I as y}from"./IconLock-DWhgbY-p.js";import{I as ve,a as fe}from"./IconEye-Cb0OcaU3.js";import{I as xe}from"./IconSearch-DLKM0IkM.js";import"./preload-helper-C1FmrZbK.js";import"./cn-8AORBNJN.js";/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ee=[["path",{d:"M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10",key:"svg-0"}],["path",{d:"M3 7l9 6l9 -6",key:"svg-1"}]],Fe=ye("outline","mail","Mail",Ee),De={title:"Components/Input",component:r,tags:["autodocs"],parameters:{docs:{description:{component:`
## Input 컴포넌트

텍스트 입력을 위한 기본 폼 컴포넌트입니다.

### 사용 시기
- 단일 줄 텍스트 입력 (이름, 이메일, 비밀번호 등)
- 검색 필드
- 폼 내 데이터 입력

### 너비 정책
- **기본**: 고정 너비 (컴포넌트 기본값)
- **fullWidth**: 부모 컨테이너에 맞춤

### 접근성
- \`label\` prop으로 라벨 자동 연결 (aria-labelledby)
- 에러 메시지 스크린리더 전달 (aria-invalid, aria-describedby)
- \`required\` 표시 자동 처리

### 예시
\`\`\`tsx
import { Input, FormField } from '@thaki/tds';

// 기본 사용 (FormField와 함께)
<FormField label="이름">
  <Input placeholder="홍길동" fullWidth />
</FormField>

// 에러 상태
<FormField label="이메일" errorMessage="유효하지 않은 이메일입니다" error>
  <Input fullWidth />
</FormField>

// 아이콘 포함
<Input 
  leftElement={<IconMail />} 
  placeholder="이메일 입력" 
/>
\`\`\`
        `}}},argTypes:{size:{control:"select",options:["xs","sm","md","lg"],description:"입력 필드 크기 (xs: 24px, sm: 32px, md: 40px, lg: 48px)",table:{type:{summary:'"xs" | "sm" | "md" | "lg"'},defaultValue:{summary:'"md"'}}},variant:{control:"select",options:["default","search","code"],description:"입력 필드 스타일 변형",table:{type:{summary:'"default" | "search" | "code"'},defaultValue:{summary:'"default"'}}},label:{control:"text",description:"@deprecated FormField의 label prop을 사용하세요.",table:{type:{summary:"string"}}},helperText:{control:"text",description:"@deprecated FormField의 helperText prop을 사용하세요.",table:{type:{summary:"string"}}},error:{control:"text",description:"에러 상태 (빨간색 테두리). 에러 메시지는 FormField의 errorMessage를 사용하세요.",table:{type:{summary:"string | boolean"}}},disabled:{control:"boolean",description:"비활성화 상태",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},readOnly:{control:"boolean",description:"읽기 전용 상태",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},fullWidth:{control:"boolean",description:"부모 컨테이너 너비에 맞춤",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},required:{control:"boolean",description:"필수 필드 표시 (*)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},leftElement:{description:"입력 필드 왼쪽에 표시할 요소 (아이콘 등)",table:{type:{summary:"ReactNode"}}},rightElement:{description:"입력 필드 오른쪽에 표시할 요소 (아이콘, 버튼 등)",table:{type:{summary:"ReactNode"}}}},args:{placeholder:"Enter text..."}},l={args:{placeholder:"Enter your name"}},t={render:()=>e.jsx(a,{label:"Username",children:e.jsx(r,{placeholder:"Enter username",fullWidth:!0})})},s={render:()=>e.jsx(a,{label:"Email",required:!0,children:e.jsx(r,{placeholder:"Enter email",fullWidth:!0})})},o={render:()=>e.jsx(a,{label:"Password",helperText:"Must be at least 8 characters long",children:e.jsx(r,{type:"password",placeholder:"Enter password",fullWidth:!0})})},d={render:()=>e.jsx(a,{label:"Email",errorMessage:"Please enter a valid email address",error:!0,children:e.jsx(r,{placeholder:"Enter email",defaultValue:"invalid-email",fullWidth:!0})})},n={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx(r,{size:"sm",placeholder:"Small input"}),e.jsx(r,{size:"md",placeholder:"Medium input (default)"})]})},i={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx(r,{variant:"default",placeholder:"Default variant"}),e.jsx(r,{variant:"search",placeholder:"Search variant",leftElement:e.jsx(xe,{size:12})}),e.jsx(r,{variant:"code",placeholder:"Code variant"})]})},c={args:{leftElement:e.jsx(Fe,{size:12}),placeholder:"Enter email"}},p={args:{rightElement:e.jsx(xe,{size:12}),placeholder:"Search..."}},u={args:{leftElement:e.jsx(y,{size:12}),rightElement:e.jsx(fe,{size:12}),type:"password",placeholder:"Enter password"}},m={render:function(){const[g,be]=ge.useState(!1);return e.jsx(a,{label:"Password",children:e.jsx(r,{type:g?"text":"password",placeholder:"Enter password",leftElement:e.jsx(y,{size:12}),rightElement:e.jsx("button",{type:"button",onClick:()=>be(!g),className:"hover:text-[var(--color-text-default)]",children:g?e.jsx(ve,{size:12}):e.jsx(fe,{size:12})}),fullWidth:!0})})}},h={render:()=>e.jsx(a,{label:"Disabled Input",children:e.jsx(r,{placeholder:"Cannot type here",disabled:!0,fullWidth:!0})})},f={render:()=>e.jsx(a,{label:"Read Only",children:e.jsx(r,{defaultValue:"This value is read-only",readOnly:!0,fullWidth:!0})})},x={render:()=>e.jsx("div",{style:{width:"400px"},children:e.jsx(a,{label:"Full Width Input",children:e.jsx(r,{placeholder:"This input takes full width",fullWidth:!0})})})},F={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] w-[320px]",children:[e.jsx(a,{label:"Full Name",required:!0,children:e.jsx(r,{placeholder:"John Doe",fullWidth:!0})}),e.jsx(a,{label:"Email",required:!0,children:e.jsx(r,{type:"email",placeholder:"john@example.com",leftElement:e.jsx(Fe,{size:12}),fullWidth:!0})}),e.jsx(a,{label:"Password",helperText:"Must be at least 8 characters",required:!0,children:e.jsx(r,{type:"password",placeholder:"Enter password",leftElement:e.jsx(y,{size:12}),fullWidth:!0})})]})},b={render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)] w-[320px]",children:[e.jsx(a,{label:"Default",children:e.jsx(r,{placeholder:"Default state",fullWidth:!0})}),e.jsx(a,{label:"With Value",children:e.jsx(r,{defaultValue:"Some value",fullWidth:!0})}),e.jsx(a,{label:"Disabled",children:e.jsx(r,{placeholder:"Disabled",disabled:!0,fullWidth:!0})}),e.jsx(a,{label:"Read Only",children:e.jsx(r,{defaultValue:"Read only value",readOnly:!0,fullWidth:!0})}),e.jsx(a,{label:"Error",errorMessage:"This field has an error",error:!0,children:e.jsx(r,{defaultValue:"Invalid",fullWidth:!0})})]})};var v,E,I;l.parameters={...l.parameters,docs:{...(v=l.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter your name'
  }
}`,...(I=(E=l.parameters)==null?void 0:E.docs)==null?void 0:I.source}}};var j,W,w;t.parameters={...t.parameters,docs:{...(j=t.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <FormField label="Username">
      <Input placeholder="Enter username" fullWidth />
    </FormField>
}`,...(w=(W=t.parameters)==null?void 0:W.docs)==null?void 0:w.source}}};var S,z,P;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => <FormField label="Email" required>
      <Input placeholder="Enter email" fullWidth />
    </FormField>
}`,...(P=(z=s.parameters)==null?void 0:z.docs)==null?void 0:P.source}}};var V,M,T;o.parameters={...o.parameters,docs:{...(V=o.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: () => <FormField label="Password" helperText="Must be at least 8 characters long">
      <Input type="password" placeholder="Enter password" fullWidth />
    </FormField>
}`,...(T=(M=o.parameters)==null?void 0:M.docs)==null?void 0:T.source}}};var D,R,N;d.parameters={...d.parameters,docs:{...(D=d.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => <FormField label="Email" errorMessage="Please enter a valid email address" error>
      <Input placeholder="Enter email" defaultValue="invalid-email" fullWidth />
    </FormField>
}`,...(N=(R=d.parameters)==null?void 0:R.docs)==null?void 0:N.source}}};var O,q,k;n.parameters={...n.parameters,docs:{...(O=n.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <Input size="sm" placeholder="Small input" />
      <Input size="md" placeholder="Medium input (default)" />
    </div>
}`,...(k=(q=n.parameters)==null?void 0:q.docs)==null?void 0:k.source}}};var C,L,_;i.parameters={...i.parameters,docs:{...(C=i.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <Input variant="default" placeholder="Default variant" />
      <Input variant="search" placeholder="Search variant" leftElement={<IconSearch size={12} />} />
      <Input variant="code" placeholder="Code variant" />
    </div>
}`,...(_=(L=i.parameters)==null?void 0:L.docs)==null?void 0:_.source}}};var A,B,H;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    leftElement: <IconMail size={12} />,
    placeholder: 'Enter email'
  }
}`,...(H=(B=c.parameters)==null?void 0:B.docs)==null?void 0:H.source}}};var J,U,G;p.parameters={...p.parameters,docs:{...(J=p.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    rightElement: <IconSearch size={12} />,
    placeholder: 'Search...'
  }
}`,...(G=(U=p.parameters)==null?void 0:U.docs)==null?void 0:G.source}}};var K,Q,X;u.parameters={...u.parameters,docs:{...(K=u.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    leftElement: <IconLock size={12} />,
    rightElement: <IconEye size={12} />,
    type: 'password',
    placeholder: 'Enter password'
  }
}`,...(X=(Q=u.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Y,Z,$;m.parameters={...m.parameters,docs:{...(Y=m.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: function PasswordToggleComponent() {
    const [showPassword, setShowPassword] = useState(false);
    return <FormField label="Password">
        <Input type={showPassword ? 'text' : 'password'} placeholder="Enter password" leftElement={<IconLock size={12} />} rightElement={<button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-[var(--color-text-default)]">
              {showPassword ? <IconEyeOff size={12} /> : <IconEye size={12} />}
            </button>} fullWidth />
      </FormField>;
  }
}`,...($=(Z=m.parameters)==null?void 0:Z.docs)==null?void 0:$.source}}};var ee,re,ae;h.parameters={...h.parameters,docs:{...(ee=h.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => <FormField label="Disabled Input">
      <Input placeholder="Cannot type here" disabled fullWidth />
    </FormField>
}`,...(ae=(re=h.parameters)==null?void 0:re.docs)==null?void 0:ae.source}}};var le,te,se;f.parameters={...f.parameters,docs:{...(le=f.parameters)==null?void 0:le.docs,source:{originalSource:`{
  render: () => <FormField label="Read Only">
      <Input defaultValue="This value is read-only" readOnly fullWidth />
    </FormField>
}`,...(se=(te=f.parameters)==null?void 0:te.docs)==null?void 0:se.source}}};var oe,de,ne;x.parameters={...x.parameters,docs:{...(oe=x.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  render: () => <div style={{
    width: '400px'
  }}>
      <FormField label="Full Width Input">
        <Input placeholder="This input takes full width" fullWidth />
      </FormField>
    </div>
}`,...(ne=(de=x.parameters)==null?void 0:de.docs)==null?void 0:ne.source}}};var ie,ce,pe;F.parameters={...F.parameters,docs:{...(ie=F.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)] w-[320px]">
      <FormField label="Full Name" required>
        <Input placeholder="John Doe" fullWidth />
      </FormField>
      <FormField label="Email" required>
        <Input type="email" placeholder="john@example.com" leftElement={<IconMail size={12} />} fullWidth />
      </FormField>
      <FormField label="Password" helperText="Must be at least 8 characters" required>
        <Input type="password" placeholder="Enter password" leftElement={<IconLock size={12} />} fullWidth />
      </FormField>
    </div>
}`,...(pe=(ce=F.parameters)==null?void 0:ce.docs)==null?void 0:pe.source}}};var ue,me,he;b.parameters={...b.parameters,docs:{...(ue=b.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-4)] w-[320px]">
      <FormField label="Default">
        <Input placeholder="Default state" fullWidth />
      </FormField>
      <FormField label="With Value">
        <Input defaultValue="Some value" fullWidth />
      </FormField>
      <FormField label="Disabled">
        <Input placeholder="Disabled" disabled fullWidth />
      </FormField>
      <FormField label="Read Only">
        <Input defaultValue="Read only value" readOnly fullWidth />
      </FormField>
      <FormField label="Error" errorMessage="This field has an error" error>
        <Input defaultValue="Invalid" fullWidth />
      </FormField>
    </div>
}`,...(he=(me=b.parameters)==null?void 0:me.docs)==null?void 0:he.source}}};const Re=["Default","WithLabel","Required","WithHelperText","WithError","Sizes","Variants","WithLeftIcon","WithRightIcon","WithBothIcons","PasswordToggle","Disabled","ReadOnly","FullWidth","FormExample","AllStates"];export{b as AllStates,l as Default,h as Disabled,F as FormExample,x as FullWidth,m as PasswordToggle,f as ReadOnly,s as Required,n as Sizes,i as Variants,u as WithBothIcons,d as WithError,o as WithHelperText,t as WithLabel,c as WithLeftIcon,p as WithRightIcon,Re as __namedExportsOrder,De as default};
