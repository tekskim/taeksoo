import{j as e,r as ye}from"./iframe-cCzR4jo2.js";import{I as a}from"./Input-D7iVfFgZ.js";import{c as Ee}from"./createReactComponent-CYYKpV4_.js";import{I as y}from"./IconLock-BTn1hX0z.js";import{I as Ie,a as fe}from"./IconEye-CyJpuQQX.js";import{I as be}from"./IconSearch-BsrOCPHk.js";import"./preload-helper-C1FmrZbK.js";import"./bundle-mjs-BZSatpsL.js";/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const we=[["path",{d:"M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10",key:"svg-0"}],["path",{d:"M3 7l9 6l9 -6",key:"svg-1"}]],xe=Ee("outline","mail","Mail",we),Te={title:"Components/Input",component:a,tags:["autodocs"],parameters:{docs:{description:{component:`
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
import { Input } from '@thaki/tds';

// 기본 사용
<Input label="이름" placeholder="홍길동" />

// 에러 상태
<Input label="이메일" error="유효하지 않은 이메일입니다" />

// 아이콘 포함
<Input 
  leftElement={<IconMail />} 
  placeholder="이메일 입력" 
/>
\`\`\`
        `}}},argTypes:{size:{control:"select",options:["sm","md"],description:"입력 필드 크기 (sm: 28px, md: 32px)",table:{type:{summary:'"sm" | "md"'},defaultValue:{summary:'"md"'}}},variant:{control:"select",options:["default","search","code"],description:"입력 필드 스타일 변형",table:{type:{summary:'"default" | "search" | "code"'},defaultValue:{summary:'"default"'}}},label:{control:"text",description:"입력 필드 라벨",table:{type:{summary:"string"}}},helperText:{control:"text",description:"도움말 텍스트 (라벨 아래 표시)",table:{type:{summary:"string"}}},error:{control:"text",description:"에러 메시지 (표시 시 빨간색 테두리)",table:{type:{summary:"string"}}},disabled:{control:"boolean",description:"비활성화 상태",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},readOnly:{control:"boolean",description:"읽기 전용 상태",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},fullWidth:{control:"boolean",description:"부모 컨테이너 너비에 맞춤",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},required:{control:"boolean",description:"필수 필드 표시 (*)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},leftElement:{description:"입력 필드 왼쪽에 표시할 요소 (아이콘 등)",table:{type:{summary:"ReactNode"}}},rightElement:{description:"입력 필드 오른쪽에 표시할 요소 (아이콘, 버튼 등)",table:{type:{summary:"ReactNode"}}}},args:{placeholder:"Enter text..."}},r={args:{placeholder:"Enter your name"}},l={args:{label:"Username",placeholder:"Enter username"}},s={args:{label:"Email",placeholder:"Enter email",required:!0}},t={args:{label:"Password",type:"password",placeholder:"Enter password",helperText:"Must be at least 8 characters long"}},o={args:{label:"Email",placeholder:"Enter email",error:"Please enter a valid email address",defaultValue:"invalid-email"}},n={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(a,{size:"sm",placeholder:"Small input"}),e.jsx(a,{size:"md",placeholder:"Medium input (default)"})]})},d={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(a,{variant:"default",placeholder:"Default variant"}),e.jsx(a,{variant:"search",placeholder:"Search variant",leftElement:e.jsx(be,{size:16})}),e.jsx(a,{variant:"code",placeholder:"Code variant"})]})},c={args:{leftElement:e.jsx(xe,{size:16}),placeholder:"Enter email"}},i={args:{rightElement:e.jsx(be,{size:16}),placeholder:"Search..."}},p={args:{leftElement:e.jsx(y,{size:16}),rightElement:e.jsx(fe,{size:16}),type:"password",placeholder:"Enter password"}},u={render:function(){const[g,ge]=ye.useState(!1);return e.jsx(a,{label:"Password",type:g?"text":"password",placeholder:"Enter password",leftElement:e.jsx(y,{size:16}),rightElement:e.jsx("button",{type:"button",onClick:()=>ge(!g),className:"hover:text-[var(--color-text-default)]",children:g?e.jsx(Ie,{size:16}):e.jsx(fe,{size:16})})})}},m={args:{label:"Disabled Input",placeholder:"Cannot type here",disabled:!0}},h={args:{label:"Read Only",defaultValue:"This value is read-only",readOnly:!0}},f={args:{label:"Full Width Input",placeholder:"This input takes full width",fullWidth:!0},decorators:[E=>e.jsx("div",{style:{width:"400px"},children:e.jsx(E,{})})]},b={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 w-[320px]",children:[e.jsx(a,{label:"Full Name",placeholder:"John Doe",required:!0,fullWidth:!0}),e.jsx(a,{label:"Email",type:"email",placeholder:"john@example.com",leftElement:e.jsx(xe,{size:16}),required:!0,fullWidth:!0}),e.jsx(a,{label:"Password",type:"password",placeholder:"Enter password",leftElement:e.jsx(y,{size:16}),helperText:"Must be at least 8 characters",required:!0,fullWidth:!0})]})},x={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 w-[320px]",children:[e.jsx(a,{label:"Default",placeholder:"Default state",fullWidth:!0}),e.jsx(a,{label:"With Value",defaultValue:"Some value",fullWidth:!0}),e.jsx(a,{label:"Disabled",placeholder:"Disabled",disabled:!0,fullWidth:!0}),e.jsx(a,{label:"Read Only",defaultValue:"Read only value",readOnly:!0,fullWidth:!0}),e.jsx(a,{label:"Error",defaultValue:"Invalid",error:"This field has an error",fullWidth:!0})]})};var I,w,v;r.parameters={...r.parameters,docs:{...(I=r.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter your name'
  }
}`,...(v=(w=r.parameters)==null?void 0:w.docs)==null?void 0:v.source}}};var S,W,j;l.parameters={...l.parameters,docs:{...(S=l.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    label: 'Username',
    placeholder: 'Enter username'
  }
}`,...(j=(W=l.parameters)==null?void 0:W.docs)==null?void 0:j.source}}};var z,P,V;s.parameters={...s.parameters,docs:{...(z=s.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    placeholder: 'Enter email',
    required: true
  }
}`,...(V=(P=s.parameters)==null?void 0:P.docs)==null?void 0:V.source}}};var D,T,R;t.parameters={...t.parameters,docs:{...(D=t.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    helperText: 'Must be at least 8 characters long'
  }
}`,...(R=(T=t.parameters)==null?void 0:T.docs)==null?void 0:R.source}}};var N,O,M;o.parameters={...o.parameters,docs:{...(N=o.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    placeholder: 'Enter email',
    error: 'Please enter a valid email address',
    defaultValue: 'invalid-email'
  }
}`,...(M=(O=o.parameters)==null?void 0:O.docs)==null?void 0:M.source}}};var q,k,C;n.parameters={...n.parameters,docs:{...(q=n.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <Input size="sm" placeholder="Small input" />
      <Input size="md" placeholder="Medium input (default)" />
    </div>
}`,...(C=(k=n.parameters)==null?void 0:k.docs)==null?void 0:C.source}}};var F,L,_;d.parameters={...d.parameters,docs:{...(F=d.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <Input variant="default" placeholder="Default variant" />
      <Input variant="search" placeholder="Search variant" leftElement={<IconSearch size={16} />} />
      <Input variant="code" placeholder="Code variant" />
    </div>
}`,...(_=(L=d.parameters)==null?void 0:L.docs)==null?void 0:_.source}}};var A,B,H;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    leftElement: <IconMail size={16} />,
    placeholder: 'Enter email'
  }
}`,...(H=(B=c.parameters)==null?void 0:B.docs)==null?void 0:H.source}}};var J,U,G;i.parameters={...i.parameters,docs:{...(J=i.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    rightElement: <IconSearch size={16} />,
    placeholder: 'Search...'
  }
}`,...(G=(U=i.parameters)==null?void 0:U.docs)==null?void 0:G.source}}};var K,Q,X;p.parameters={...p.parameters,docs:{...(K=p.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    leftElement: <IconLock size={16} />,
    rightElement: <IconEye size={16} />,
    type: 'password',
    placeholder: 'Enter password'
  }
}`,...(X=(Q=p.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Y,Z,$;u.parameters={...u.parameters,docs:{...(Y=u.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: function PasswordToggleComponent() {
    const [showPassword, setShowPassword] = useState(false);
    return <Input label="Password" type={showPassword ? 'text' : 'password'} placeholder="Enter password" leftElement={<IconLock size={16} />} rightElement={<button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-[var(--color-text-default)]">
            {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
          </button>} />;
  }
}`,...($=(Z=u.parameters)==null?void 0:Z.docs)==null?void 0:$.source}}};var ee,ae,re;m.parameters={...m.parameters,docs:{...(ee=m.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    label: 'Disabled Input',
    placeholder: 'Cannot type here',
    disabled: true
  }
}`,...(re=(ae=m.parameters)==null?void 0:ae.docs)==null?void 0:re.source}}};var le,se,te;h.parameters={...h.parameters,docs:{...(le=h.parameters)==null?void 0:le.docs,source:{originalSource:`{
  args: {
    label: 'Read Only',
    defaultValue: 'This value is read-only',
    readOnly: true
  }
}`,...(te=(se=h.parameters)==null?void 0:se.docs)==null?void 0:te.source}}};var oe,ne,de;f.parameters={...f.parameters,docs:{...(oe=f.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    label: 'Full Width Input',
    placeholder: 'This input takes full width',
    fullWidth: true
  },
  decorators: [Story => <div style={{
    width: '400px'
  }}>
        <Story />
      </div>]
}`,...(de=(ne=f.parameters)==null?void 0:ne.docs)==null?void 0:de.source}}};var ce,ie,pe;b.parameters={...b.parameters,docs:{...(ce=b.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 w-[320px]">
      <Input label="Full Name" placeholder="John Doe" required fullWidth />
      <Input label="Email" type="email" placeholder="john@example.com" leftElement={<IconMail size={16} />} required fullWidth />
      <Input label="Password" type="password" placeholder="Enter password" leftElement={<IconLock size={16} />} helperText="Must be at least 8 characters" required fullWidth />
    </div>
}`,...(pe=(ie=b.parameters)==null?void 0:ie.docs)==null?void 0:pe.source}}};var ue,me,he;x.parameters={...x.parameters,docs:{...(ue=x.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 w-[320px]">
      <Input label="Default" placeholder="Default state" fullWidth />
      <Input label="With Value" defaultValue="Some value" fullWidth />
      <Input label="Disabled" placeholder="Disabled" disabled fullWidth />
      <Input label="Read Only" defaultValue="Read only value" readOnly fullWidth />
      <Input label="Error" defaultValue="Invalid" error="This field has an error" fullWidth />
    </div>
}`,...(he=(me=x.parameters)==null?void 0:me.docs)==null?void 0:he.source}}};const Re=["Default","WithLabel","Required","WithHelperText","WithError","Sizes","Variants","WithLeftIcon","WithRightIcon","WithBothIcons","PasswordToggle","Disabled","ReadOnly","FullWidth","FormExample","AllStates"];export{x as AllStates,r as Default,m as Disabled,b as FormExample,f as FullWidth,u as PasswordToggle,h as ReadOnly,s as Required,n as Sizes,d as Variants,p as WithBothIcons,o as WithError,t as WithHelperText,l as WithLabel,c as WithLeftIcon,i as WithRightIcon,Re as __namedExportsOrder,Te as default};
