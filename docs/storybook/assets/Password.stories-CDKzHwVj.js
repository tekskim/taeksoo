import{r as i,j as e}from"./iframe-WEp3SeCx.js";import{t as w}from"./bundle-mjs-BZSatpsL.js";import{I as ze,a as Fe}from"./IconEye-D43uK_38.js";import{V as W}from"./Stack-DGmeYZzN.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-d6NA989C.js";const Le={sm:"h-[var(--input-height-sm)] text-[length:var(--input-font-size-sm)]",md:"h-[var(--input-height-md)] text-[length:var(--input-font-size)]"},t=i.forwardRef(({size:r="md",label:n,helperText:a,error:o,fullWidth:u=!1,showToggle:s=!0,showLabel:l="Show password",hideLabel:ve="Hide password",className:Ee="",id:ye,disabled:p,readOnly:d,required:V=!1,success:Se,...Ce},je)=>{const[m,Te]=i.useState(!1),c=ye||`password-${Math.random().toString(36).substr(2,9)}`,D=!!o,N=typeof o=="string"?o:void 0,qe=()=>D?"border-[var(--input-border-error)]":Se?"border-[var(--color-state-success)]":d?"border-[var(--input-border-readonly)]":"border-[var(--input-border)]",De=w("flex flex-col gap-[var(--input-label-gap)]",u?"w-full":"w-[var(--input-default-width)]"),Ne=w("flex items-center","w-full",Le[r],"px-[var(--input-padding-x)]","bg-[var(--input-bg)]","border rounded-[var(--input-radius)]",qe(),"transition-colors duration-[var(--duration-fast)]","focus-within:border-[var(--input-border-focus)]",p&&"bg-[var(--input-bg-disabled)] cursor-not-allowed",d&&"bg-[var(--input-bg-readonly)]"),We=w("flex-1 h-full","bg-transparent","border-none outline-none","text-[var(--color-text-default)]","placeholder:text-[var(--input-placeholder)]",p&&"text-[var(--color-text-subtle)] cursor-not-allowed",d&&"cursor-default",Ee),Ve=w("flex items-center justify-center","p-1 ml-2","rounded","text-[var(--color-text-muted)]","hover:text-[var(--color-text-default)]","hover:bg-[var(--color-surface-subtle)]","transition-colors duration-[var(--duration-fast)]","cursor-pointer","focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary)]",(p||d)&&"pointer-events-none opacity-50");return e.jsxs("div",{className:De,children:[n&&e.jsxs("label",{htmlFor:c,className:"text-label-sm text-[var(--color-text-default)]",children:[n,V&&e.jsx("span",{className:"text-[var(--color-state-danger)] ml-0.5",children:"*"})]}),e.jsxs("div",{className:Ne,children:[e.jsx("input",{ref:je,id:c,type:m?"text":"password",disabled:p,readOnly:d,required:V,"aria-invalid":D,"aria-describedby":N?`${c}-error`:a?`${c}-helper`:void 0,className:We,...Ce}),s&&e.jsx("button",{type:"button",tabIndex:p||d?-1:0,onClick:()=>Te(!m),"aria-label":m?ve:l,className:Ve,children:m?e.jsx(ze,{size:r==="sm"?14:16,stroke:1.5}):e.jsx(Fe,{size:r==="sm"?14:16,stroke:1.5})})]}),a&&!D&&e.jsx("p",{id:`${c}-helper`,className:"text-body-sm text-[var(--color-text-subtle)]",children:a}),N&&e.jsx("p",{id:`${c}-error`,className:"text-body-sm text-[var(--color-state-danger)]",children:N})]})});t.displayName="Password";t.__docgenInfo={description:"",methods:[],displayName:"Password",props:{size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"}]},description:"Input size",defaultValue:{value:"'md'",computed:!1}},label:{required:!1,tsType:{name:"string"},description:"Label text"},helperText:{required:!1,tsType:{name:"string"},description:"Helper text"},error:{required:!1,tsType:{name:"union",raw:"boolean | string",elements:[{name:"boolean"},{name:"string"}]},description:"Error state or message"},fullWidth:{required:!1,tsType:{name:"boolean"},description:"Full width mode",defaultValue:{value:"false",computed:!1}},showToggle:{required:!1,tsType:{name:"boolean"},description:"Show password toggle by default",defaultValue:{value:"true",computed:!1}},showLabel:{required:!1,tsType:{name:"string"},description:"Custom toggle button aria label for show state",defaultValue:{value:"'Show password'",computed:!1}},hideLabel:{required:!1,tsType:{name:"string"},description:"Custom toggle button aria label for hide state",defaultValue:{value:"'Hide password'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Additional CSS classes",defaultValue:{value:"''",computed:!1}},success:{required:!1,tsType:{name:"boolean"},description:"@deprecated Use error for validation states"},required:{defaultValue:{value:"false",computed:!1},required:!1}},composes:["Omit"]};const _e={title:"Components/Password",component:t,parameters:{layout:"centered"},argTypes:{size:{control:{type:"select"},options:["sm","md"]}}},h={args:{placeholder:"Enter password"}},f={args:{label:"Password",placeholder:"Enter your password"}},g={args:{label:"Password",placeholder:"Enter your password",required:!0}},b={args:{label:"Password",placeholder:"Enter your password",helperText:"Password must be at least 8 characters"}},P={render:()=>e.jsxs(W,{gap:4,children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"Small"}),e.jsx(t,{size:"sm",placeholder:"Small password input"})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-2",children:"Medium (default)"}),e.jsx(t,{size:"md",placeholder:"Medium password input"})]})]})},x={args:{label:"Password",placeholder:"Enter password",disabled:!0,value:"secret123"}},v={args:{label:"Password",value:"secret123",readOnly:!0}},E={args:{label:"Password",placeholder:"Enter password",error:"Password is required"}},y={args:{label:"Password",placeholder:"Enter password",error:!0,helperText:"This field has an error"}},S={args:{label:"Password",placeholder:"Enter password",showToggle:!1}},C={args:{label:"Password",placeholder:"Enter password",showLabel:"비밀번호 보기",hideLabel:"비밀번호 숨기기"}},j={args:{label:"Password",placeholder:"Enter password",fullWidth:!0},decorators:[r=>e.jsx("div",{style:{width:"400px"},children:e.jsx(r,{})})]},T={render:()=>{const[r,n]=i.useState(""),[a,o]=i.useState(""),u=s=>{s.length<8?o("Password must be at least 8 characters"):/[A-Z]/.test(s)?/[0-9]/.test(s)?o(""):o("Password must contain at least one number"):o("Password must contain at least one uppercase letter")};return e.jsxs(W,{gap:4,children:[e.jsx(t,{label:"Password",placeholder:"Enter a strong password",value:r,onChange:s=>{n(s.target.value),u(s.target.value)},error:a,helperText:a?void 0:"Min 8 characters, 1 uppercase, 1 number"}),e.jsxs("p",{className:"text-body-sm text-[var(--color-text-muted)]",children:["Password length: ",r.length]})]})}},q={render:()=>{const[r,n]=i.useState({currentPassword:"",newPassword:"",confirmPassword:""}),[a,o]=i.useState({currentPassword:"",newPassword:"",confirmPassword:""}),u=s=>{s.preventDefault();const l={...a};r.currentPassword||(l.currentPassword="Current password is required"),r.newPassword.length<8&&(l.newPassword="New password must be at least 8 characters"),r.newPassword!==r.confirmPassword&&(l.confirmPassword="Passwords do not match"),o(l)};return e.jsx("form",{onSubmit:u,style:{width:"320px"},children:e.jsxs(W,{gap:4,children:[e.jsx(t,{label:"Current Password",placeholder:"Enter current password",value:r.currentPassword,onChange:s=>{n({...r,currentPassword:s.target.value}),o({...a,currentPassword:""})},error:a.currentPassword,fullWidth:!0,required:!0}),e.jsx(t,{label:"New Password",placeholder:"Enter new password",value:r.newPassword,onChange:s=>{n({...r,newPassword:s.target.value}),o({...a,newPassword:""})},error:a.newPassword,helperText:"Minimum 8 characters",fullWidth:!0,required:!0}),e.jsx(t,{label:"Confirm Password",placeholder:"Confirm new password",value:r.confirmPassword,onChange:s=>{n({...r,confirmPassword:s.target.value}),o({...a,confirmPassword:""})},error:a.confirmPassword,fullWidth:!0,required:!0}),e.jsx("button",{type:"submit",className:"w-full h-9 bg-[var(--color-action-primary)] text-white rounded-md text-body-md font-medium hover:opacity-90 transition-opacity",children:"Change Password"})]})})}};var z,F,L;h.parameters={...h.parameters,docs:{...(z=h.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter password'
  }
}`,...(L=(F=h.parameters)==null?void 0:F.docs)==null?void 0:L.source}}};var M,k,I;f.parameters={...f.parameters,docs:{...(M=f.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    placeholder: 'Enter your password'
  }
}`,...(I=(k=f.parameters)==null?void 0:k.docs)==null?void 0:I.source}}};var R,H,$;g.parameters={...g.parameters,docs:{...(R=g.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    required: true
  }
}`,...($=(H=g.parameters)==null?void 0:H.docs)==null?void 0:$.source}}};var _,A,B;b.parameters={...b.parameters,docs:{...(_=b.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    helperText: 'Password must be at least 8 characters'
  }
}`,...(B=(A=b.parameters)==null?void 0:A.docs)==null?void 0:B.source}}};var O,Z,U;P.parameters={...P.parameters,docs:{...(O=P.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <VStack gap={4}>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Small</h3>
        <Password size="sm" placeholder="Small password input" />
      </div>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Medium (default)</h3>
        <Password size="md" placeholder="Medium password input" />
      </div>
    </VStack>
}`,...(U=(Z=P.parameters)==null?void 0:Z.docs)==null?void 0:U.source}}};var G,J,K;x.parameters={...x.parameters,docs:{...(G=x.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    disabled: true,
    value: 'secret123'
  }
}`,...(K=(J=x.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,X,Y;v.parameters={...v.parameters,docs:{...(Q=v.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    value: 'secret123',
    readOnly: true
  }
}`,...(Y=(X=v.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var ee,re,se;E.parameters={...E.parameters,docs:{...(ee=E.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    error: 'Password is required'
  }
}`,...(se=(re=E.parameters)==null?void 0:re.docs)==null?void 0:se.source}}};var ae,oe,te;y.parameters={...y.parameters,docs:{...(ae=y.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    error: true,
    helperText: 'This field has an error'
  }
}`,...(te=(oe=y.parameters)==null?void 0:oe.docs)==null?void 0:te.source}}};var ne,le,de;S.parameters={...S.parameters,docs:{...(ne=S.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    showToggle: false
  }
}`,...(de=(le=S.parameters)==null?void 0:le.docs)==null?void 0:de.source}}};var ce,ie,ue;C.parameters={...C.parameters,docs:{...(ce=C.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    showLabel: '비밀번호 보기',
    hideLabel: '비밀번호 숨기기'
  }
}`,...(ue=(ie=C.parameters)==null?void 0:ie.docs)==null?void 0:ue.source}}};var pe,me,we;j.parameters={...j.parameters,docs:{...(pe=j.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    fullWidth: true
  },
  decorators: [Story => <div style={{
    width: '400px'
  }}>
        <Story />
      </div>]
}`,...(we=(me=j.parameters)==null?void 0:me.docs)==null?void 0:we.source}}};var he,fe,ge;T.parameters={...T.parameters,docs:{...(he=T.parameters)==null?void 0:he.docs,source:{originalSource:`{
  render: () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const validatePassword = (value: string) => {
      if (value.length < 8) {
        setError('Password must be at least 8 characters');
      } else if (!/[A-Z]/.test(value)) {
        setError('Password must contain at least one uppercase letter');
      } else if (!/[0-9]/.test(value)) {
        setError('Password must contain at least one number');
      } else {
        setError('');
      }
    };
    return <VStack gap={4}>
        <Password label="Password" placeholder="Enter a strong password" value={password} onChange={e => {
        setPassword(e.target.value);
        validatePassword(e.target.value);
      }} error={error} helperText={!error ? 'Min 8 characters, 1 uppercase, 1 number' : undefined} />
        <p className="text-body-sm text-[var(--color-text-muted)]">
          Password length: {password.length}
        </p>
      </VStack>;
  }
}`,...(ge=(fe=T.parameters)==null?void 0:fe.docs)==null?void 0:ge.source}}};var be,Pe,xe;q.parameters={...q.parameters,docs:{...(be=q.parameters)==null?void 0:be.docs,source:{originalSource:`{
  render: () => {
    const [formData, setFormData] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    const [errors, setErrors] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors = {
        ...errors
      };
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'New password must be at least 8 characters';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      setErrors(newErrors);
    };
    return <form onSubmit={handleSubmit} style={{
      width: '320px'
    }}>
        <VStack gap={4}>
          <Password label="Current Password" placeholder="Enter current password" value={formData.currentPassword} onChange={e => {
          setFormData({
            ...formData,
            currentPassword: e.target.value
          });
          setErrors({
            ...errors,
            currentPassword: ''
          });
        }} error={errors.currentPassword} fullWidth required />
          <Password label="New Password" placeholder="Enter new password" value={formData.newPassword} onChange={e => {
          setFormData({
            ...formData,
            newPassword: e.target.value
          });
          setErrors({
            ...errors,
            newPassword: ''
          });
        }} error={errors.newPassword} helperText="Minimum 8 characters" fullWidth required />
          <Password label="Confirm Password" placeholder="Confirm new password" value={formData.confirmPassword} onChange={e => {
          setFormData({
            ...formData,
            confirmPassword: e.target.value
          });
          setErrors({
            ...errors,
            confirmPassword: ''
          });
        }} error={errors.confirmPassword} fullWidth required />
          <button type="submit" className="w-full h-9 bg-[var(--color-action-primary)] text-white rounded-md text-body-md font-medium hover:opacity-90 transition-opacity">
            Change Password
          </button>
        </VStack>
      </form>;
  }
}`,...(xe=(Pe=q.parameters)==null?void 0:Pe.docs)==null?void 0:xe.source}}};const Ae=["Default","WithLabel","Required","WithHelperText","Sizes","Disabled","ReadOnly","Error","ErrorBoolean","WithoutToggle","CustomToggleLabels","FullWidth","Controlled","FormExample"];export{T as Controlled,C as CustomToggleLabels,h as Default,x as Disabled,E as Error,y as ErrorBoolean,q as FormExample,j as FullWidth,v as ReadOnly,g as Required,P as Sizes,b as WithHelperText,f as WithLabel,S as WithoutToggle,Ae as __namedExportsOrder,_e as default};
