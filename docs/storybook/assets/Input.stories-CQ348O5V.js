import{j as e,r as Ee}from"./iframe-DKmDJy9M.js";import{I as a}from"./Input-B4I_Z2ga.js";import{c as g}from"./createReactComponent-DB1W9lnY.js";import{I as E}from"./IconLock-DyzPmnfw.js";import{I as be}from"./IconSearch-BKHWbCa6.js";import"./preload-helper-C1FmrZbK.js";import"./bundle-mjs-BZSatpsL.js";/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const ve=[["path",{d:"M10.585 10.587a2 2 0 0 0 2.829 2.828",key:"svg-0"}],["path",{d:"M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87",key:"svg-1"}],["path",{d:"M3 3l18 18",key:"svg-2"}]],Ie=g("outline","eye-off","EyeOff",ve);/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const we=[["path",{d:"M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0",key:"svg-0"}],["path",{d:"M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6",key:"svg-1"}]],xe=g("outline","eye","Eye",we);/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const Se=[["path",{d:"M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10",key:"svg-0"}],["path",{d:"M3 7l9 6l9 -6",key:"svg-1"}]],ye=g("outline","mail","Mail",Se),Te={title:"Components/Input",component:a,tags:["autodocs"],parameters:{docs:{description:{component:`
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
        `}}},argTypes:{size:{control:"select",options:["sm","md"],description:"입력 필드 크기 (sm: 28px, md: 32px)",table:{type:{summary:'"sm" | "md"'},defaultValue:{summary:'"md"'}}},variant:{control:"select",options:["default","search","code"],description:"입력 필드 스타일 변형",table:{type:{summary:'"default" | "search" | "code"'},defaultValue:{summary:'"default"'}}},label:{control:"text",description:"입력 필드 라벨",table:{type:{summary:"string"}}},helperText:{control:"text",description:"도움말 텍스트 (라벨 아래 표시)",table:{type:{summary:"string"}}},error:{control:"text",description:"에러 메시지 (표시 시 빨간색 테두리)",table:{type:{summary:"string"}}},disabled:{control:"boolean",description:"비활성화 상태",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},readOnly:{control:"boolean",description:"읽기 전용 상태",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},fullWidth:{control:"boolean",description:"부모 컨테이너 너비에 맞춤",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},required:{control:"boolean",description:"필수 필드 표시 (*)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},leftElement:{description:"입력 필드 왼쪽에 표시할 요소 (아이콘 등)",table:{type:{summary:"ReactNode"}}},rightElement:{description:"입력 필드 오른쪽에 표시할 요소 (아이콘, 버튼 등)",table:{type:{summary:"ReactNode"}}}},args:{placeholder:"Enter text..."}},r={args:{placeholder:"Enter your name"}},l={args:{label:"Username",placeholder:"Enter username"}},t={args:{label:"Email",placeholder:"Enter email",required:!0}},s={args:{label:"Password",type:"password",placeholder:"Enter password",helperText:"Must be at least 8 characters long"}},o={args:{label:"Email",placeholder:"Enter email",error:"Please enter a valid email address",defaultValue:"invalid-email"}},n={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(a,{size:"sm",placeholder:"Small input"}),e.jsx(a,{size:"md",placeholder:"Medium input (default)"})]})},d={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(a,{variant:"default",placeholder:"Default variant"}),e.jsx(a,{variant:"search",placeholder:"Search variant",leftElement:e.jsx(be,{size:16})}),e.jsx(a,{variant:"code",placeholder:"Code variant"})]})},c={args:{leftElement:e.jsx(ye,{size:16}),placeholder:"Enter email"}},i={args:{rightElement:e.jsx(be,{size:16}),placeholder:"Search..."}},p={args:{leftElement:e.jsx(E,{size:16}),rightElement:e.jsx(xe,{size:16}),type:"password",placeholder:"Enter password"}},u={render:function(){const[y,ge]=Ee.useState(!1);return e.jsx(a,{label:"Password",type:y?"text":"password",placeholder:"Enter password",leftElement:e.jsx(E,{size:16}),rightElement:e.jsx("button",{type:"button",onClick:()=>ge(!y),className:"hover:text-[var(--color-text-default)]",children:y?e.jsx(Ie,{size:16}):e.jsx(xe,{size:16})})})}},m={args:{label:"Disabled Input",placeholder:"Cannot type here",disabled:!0}},h={args:{label:"Read Only",defaultValue:"This value is read-only",readOnly:!0}},f={args:{label:"Full Width Input",placeholder:"This input takes full width",fullWidth:!0},decorators:[v=>e.jsx("div",{style:{width:"400px"},children:e.jsx(v,{})})]},b={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 w-[320px]",children:[e.jsx(a,{label:"Full Name",placeholder:"John Doe",required:!0,fullWidth:!0}),e.jsx(a,{label:"Email",type:"email",placeholder:"john@example.com",leftElement:e.jsx(ye,{size:16}),required:!0,fullWidth:!0}),e.jsx(a,{label:"Password",type:"password",placeholder:"Enter password",leftElement:e.jsx(E,{size:16}),helperText:"Must be at least 8 characters",required:!0,fullWidth:!0})]})},x={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 w-[320px]",children:[e.jsx(a,{label:"Default",placeholder:"Default state",fullWidth:!0}),e.jsx(a,{label:"With Value",defaultValue:"Some value",fullWidth:!0}),e.jsx(a,{label:"Disabled",placeholder:"Disabled",disabled:!0,fullWidth:!0}),e.jsx(a,{label:"Read Only",defaultValue:"Read only value",readOnly:!0,fullWidth:!0}),e.jsx(a,{label:"Error",defaultValue:"Invalid",error:"This field has an error",fullWidth:!0})]})};var I,w,S;r.parameters={...r.parameters,docs:{...(I=r.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter your name'
  }
}`,...(S=(w=r.parameters)==null?void 0:w.docs)==null?void 0:S.source}}};var W,j,z;l.parameters={...l.parameters,docs:{...(W=l.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    label: 'Username',
    placeholder: 'Enter username'
  }
}`,...(z=(j=l.parameters)==null?void 0:j.docs)==null?void 0:z.source}}};var P,V,D;t.parameters={...t.parameters,docs:{...(P=t.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    placeholder: 'Enter email',
    required: true
  }
}`,...(D=(V=t.parameters)==null?void 0:V.docs)==null?void 0:D.source}}};var M,T,N;s.parameters={...s.parameters,docs:{...(M=s.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    helperText: 'Must be at least 8 characters long'
  }
}`,...(N=(T=s.parameters)==null?void 0:T.docs)==null?void 0:N.source}}};var k,R,O;o.parameters={...o.parameters,docs:{...(k=o.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    placeholder: 'Enter email',
    error: 'Please enter a valid email address',
    defaultValue: 'invalid-email'
  }
}`,...(O=(R=o.parameters)==null?void 0:R.docs)==null?void 0:O.source}}};var q,C,F;n.parameters={...n.parameters,docs:{...(q=n.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <Input size="sm" placeholder="Small input" />
      <Input size="md" placeholder="Medium input (default)" />
    </div>
}`,...(F=(C=n.parameters)==null?void 0:C.docs)==null?void 0:F.source}}};var L,_,A;d.parameters={...d.parameters,docs:{...(L=d.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <Input variant="default" placeholder="Default variant" />
      <Input variant="search" placeholder="Search variant" leftElement={<IconSearch size={16} />} />
      <Input variant="code" placeholder="Code variant" />
    </div>
}`,...(A=(_=d.parameters)==null?void 0:_.docs)==null?void 0:A.source}}};var B,H,J;c.parameters={...c.parameters,docs:{...(B=c.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    leftElement: <IconMail size={16} />,
    placeholder: 'Enter email'
  }
}`,...(J=(H=c.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};var U,$,G;i.parameters={...i.parameters,docs:{...(U=i.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    rightElement: <IconSearch size={16} />,
    placeholder: 'Search...'
  }
}`,...(G=($=i.parameters)==null?void 0:$.docs)==null?void 0:G.source}}};var K,Q,X;p.parameters={...p.parameters,docs:{...(K=p.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    leftElement: <IconLock size={16} />,
    rightElement: <IconEye size={16} />,
    type: 'password',
    placeholder: 'Enter password'
  }
}`,...(X=(Q=p.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Y,Z,ee;u.parameters={...u.parameters,docs:{...(Y=u.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: function PasswordToggleComponent() {
    const [showPassword, setShowPassword] = useState(false);
    return <Input label="Password" type={showPassword ? 'text' : 'password'} placeholder="Enter password" leftElement={<IconLock size={16} />} rightElement={<button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-[var(--color-text-default)]">
            {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
          </button>} />;
  }
}`,...(ee=(Z=u.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var ae,re,le;m.parameters={...m.parameters,docs:{...(ae=m.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  args: {
    label: 'Disabled Input',
    placeholder: 'Cannot type here',
    disabled: true
  }
}`,...(le=(re=m.parameters)==null?void 0:re.docs)==null?void 0:le.source}}};var te,se,oe;h.parameters={...h.parameters,docs:{...(te=h.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    label: 'Read Only',
    defaultValue: 'This value is read-only',
    readOnly: true
  }
}`,...(oe=(se=h.parameters)==null?void 0:se.docs)==null?void 0:oe.source}}};var ne,de,ce;f.parameters={...f.parameters,docs:{...(ne=f.parameters)==null?void 0:ne.docs,source:{originalSource:`{
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
}`,...(ce=(de=f.parameters)==null?void 0:de.docs)==null?void 0:ce.source}}};var ie,pe,ue;b.parameters={...b.parameters,docs:{...(ie=b.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 w-[320px]">
      <Input label="Full Name" placeholder="John Doe" required fullWidth />
      <Input label="Email" type="email" placeholder="john@example.com" leftElement={<IconMail size={16} />} required fullWidth />
      <Input label="Password" type="password" placeholder="Enter password" leftElement={<IconLock size={16} />} helperText="Must be at least 8 characters" required fullWidth />
    </div>
}`,...(ue=(pe=b.parameters)==null?void 0:pe.docs)==null?void 0:ue.source}}};var me,he,fe;x.parameters={...x.parameters,docs:{...(me=x.parameters)==null?void 0:me.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 w-[320px]">
      <Input label="Default" placeholder="Default state" fullWidth />
      <Input label="With Value" defaultValue="Some value" fullWidth />
      <Input label="Disabled" placeholder="Disabled" disabled fullWidth />
      <Input label="Read Only" defaultValue="Read only value" readOnly fullWidth />
      <Input label="Error" defaultValue="Invalid" error="This field has an error" fullWidth />
    </div>
}`,...(fe=(he=x.parameters)==null?void 0:he.docs)==null?void 0:fe.source}}};const Ne=["Default","WithLabel","Required","WithHelperText","WithError","Sizes","Variants","WithLeftIcon","WithRightIcon","WithBothIcons","PasswordToggle","Disabled","ReadOnly","FullWidth","FormExample","AllStates"];export{x as AllStates,r as Default,m as Disabled,b as FormExample,f as FullWidth,u as PasswordToggle,h as ReadOnly,t as Required,n as Sizes,d as Variants,p as WithBothIcons,o as WithError,s as WithHelperText,l as WithLabel,c as WithLeftIcon,i as WithRightIcon,Ne as __namedExportsOrder,Te as default};
