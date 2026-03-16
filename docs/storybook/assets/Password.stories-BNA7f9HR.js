import{r as u,j as e}from"./iframe-iHQO5Mqm.js";import{t as h}from"./cn-8AORBNJN.js";import{I as ze,a as Ve}from"./IconEye-Bw8ZnxqF.js";import{V as N}from"./Stack-CS-kulzC.js";import{F as t}from"./FormField-DFckTJ7Z.js";import{B as Le}from"./Button-9zQlOYxA.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-CEVQAvfZ.js";const ke={sm:"h-[var(--input-height-sm)] text-[length:var(--input-font-size-sm)]",md:"h-[var(--input-height-md)] text-[length:var(--input-font-size)]"},r=u.forwardRef(({size:o="md",label:l,helperText:s,error:d,fullWidth:m=!1,showToggle:a=!0,showLabel:n="Show password",hideLabel:Fe="Hide password",className:Ee="",id:je,disabled:p,readOnly:i,required:W=!1,success:Se,...ye},Ce)=>{const[w,Te]=u.useState(!1),c=je||`password-${Math.random().toString(36).substr(2,9)}`,D=!!d,M=typeof d=="string"?d:void 0,qe=()=>D?"border-[var(--input-border-error)]":Se?"border-[var(--color-state-success)]":i?"border-[var(--input-border-readonly)]":"border-[var(--input-border)]",De=h("flex flex-col gap-[var(--input-label-gap)]",m?"w-full":"w-[var(--input-default-width)]"),Me=h("flex items-center","w-full",ke[o],"px-[var(--input-padding-x)]","bg-[var(--input-bg)]","border rounded-[var(--input-radius)]",qe(),"transition-colors duration-[var(--duration-fast)]","focus-within:border-[var(--input-border-focus)]",p&&"bg-[var(--input-bg-disabled)] cursor-not-allowed",i&&"bg-[var(--input-bg-readonly)]"),Ne=h("flex-1 h-full","bg-transparent","border-none outline-none","text-[var(--color-text-default)]","placeholder:text-[var(--color-text-subtle)]",p&&"text-[var(--color-text-subtle)] cursor-not-allowed",i&&"cursor-default",Ee),We=h("flex items-center justify-center","p-1 ml-2","rounded","text-[var(--color-text-muted)]","hover:text-[var(--color-text-default)]","hover:bg-[var(--color-surface-subtle)]","transition-colors duration-[var(--duration-fast)]","cursor-pointer","focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary)]",(p||i)&&"pointer-events-none opacity-50");return e.jsxs("div",{"data-figma-name":"Password",className:De,children:[l&&e.jsxs("label",{htmlFor:c,className:"text-label-sm text-[var(--color-text-default)]",children:[l,W&&e.jsx("span",{className:"text-[var(--color-state-danger)] ml-0.5",children:"*"})]}),e.jsxs("div",{className:Me,children:[e.jsx("input",{ref:Ce,id:c,type:w?"text":"password",disabled:p,readOnly:i,required:W,"aria-invalid":D,"aria-describedby":M?`${c}-error`:s?`${c}-helper`:void 0,className:Ne,...ye}),a&&e.jsx("button",{type:"button",tabIndex:p||i?-1:0,onClick:()=>Te(!w),"aria-label":w?Fe:n,className:We,children:w?e.jsx(ze,{size:16,stroke:1.5}):e.jsx(Ve,{size:16,stroke:1.5})})]}),s&&!D&&e.jsx("p",{id:`${c}-helper`,className:"text-body-sm text-[var(--color-text-subtle)]",children:s}),M&&e.jsx("p",{id:`${c}-error`,className:"text-body-sm text-[var(--color-state-danger)]",children:M})]})});r.displayName="Password";r.__docgenInfo={description:"",methods:[],displayName:"Password",props:{size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"}]},description:"Input size",defaultValue:{value:"'md'",computed:!1}},label:{required:!1,tsType:{name:"string"},description:"Label text"},helperText:{required:!1,tsType:{name:"string"},description:"Helper text"},error:{required:!1,tsType:{name:"union",raw:"boolean | string",elements:[{name:"boolean"},{name:"string"}]},description:"Error state or message"},fullWidth:{required:!1,tsType:{name:"boolean"},description:"Full width mode",defaultValue:{value:"false",computed:!1}},showToggle:{required:!1,tsType:{name:"boolean"},description:"Show password toggle by default",defaultValue:{value:"true",computed:!1}},showLabel:{required:!1,tsType:{name:"string"},description:"Custom toggle button aria label for show state",defaultValue:{value:"'Show password'",computed:!1}},hideLabel:{required:!1,tsType:{name:"string"},description:"Custom toggle button aria label for hide state",defaultValue:{value:"'Hide password'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Additional CSS classes",defaultValue:{value:"''",computed:!1}},success:{required:!1,tsType:{name:"boolean"},description:"@deprecated Use error for validation states"},required:{defaultValue:{value:"false",computed:!1},required:!1}},composes:["Omit"]};const Ze={title:"Components/Password",component:r,parameters:{layout:"centered"},argTypes:{size:{control:{type:"select"},options:["sm","md"]}}},f={args:{placeholder:"Enter password"}},P={render:()=>e.jsx(t,{label:"Password",children:e.jsx(r,{placeholder:"Enter your password"})})},g={render:()=>e.jsx(t,{label:"Password",required:!0,children:e.jsx(r,{placeholder:"Enter your password"})})},x={render:()=>e.jsx(t,{label:"Password",helperText:"Password must be at least 8 characters",children:e.jsx(r,{placeholder:"Enter your password"})})},b={render:()=>e.jsxs(N,{gap:4,children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-2)]",children:"Small"}),e.jsx(r,{size:"sm",placeholder:"Small password input"})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-label-sm text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-2)]",children:"Medium (default)"}),e.jsx(r,{size:"md",placeholder:"Medium password input"})]})]})},v={render:()=>e.jsx(t,{label:"Password",children:e.jsx(r,{placeholder:"Enter password",disabled:!0,value:"secret123"})})},F={render:()=>e.jsx(t,{label:"Password",children:e.jsx(r,{value:"secret123",readOnly:!0})})},E={render:()=>e.jsx(t,{label:"Password",errorMessage:"Password is required",error:!0,children:e.jsx(r,{placeholder:"Enter password"})})},j={render:()=>e.jsx(t,{label:"Password",helperText:"This field has an error",error:!0,children:e.jsx(r,{placeholder:"Enter password"})})},S={render:()=>e.jsx(t,{label:"Password",children:e.jsx(r,{placeholder:"Enter password",showToggle:!1})})},y={render:()=>e.jsx(t,{label:"Password",children:e.jsx(r,{placeholder:"Enter password",showLabel:"비밀번호 보기",hideLabel:"비밀번호 숨기기"})})},C={render:()=>e.jsx("div",{style:{width:"400px"},children:e.jsx(t,{label:"Password",children:e.jsx(r,{placeholder:"Enter password",fullWidth:!0})})})},T={render:()=>{const[o,l]=u.useState(""),[s,d]=u.useState(""),m=a=>{a.length<8?d("Password must be at least 8 characters"):/[A-Z]/.test(a)?/[0-9]/.test(a)?d(""):d("Password must contain at least one number"):d("Password must contain at least one uppercase letter")};return e.jsxs(N,{gap:4,children:[e.jsx(t,{label:"Password",helperText:s?void 0:"Min 8 characters, 1 uppercase, 1 number",errorMessage:s||void 0,error:!!s,children:e.jsx(r,{placeholder:"Enter a strong password",value:o,onChange:a=>{l(a.target.value),m(a.target.value)}})}),e.jsxs("p",{className:"text-body-sm text-[var(--color-text-muted)]",children:["Password length: ",o.length]})]})}},q={render:()=>{const[o,l]=u.useState({currentPassword:"",newPassword:"",confirmPassword:""}),[s,d]=u.useState({currentPassword:"",newPassword:"",confirmPassword:""}),m=a=>{a.preventDefault();const n={...s};o.currentPassword||(n.currentPassword="Current password is required"),o.newPassword.length<8&&(n.newPassword="New password must be at least 8 characters"),o.newPassword!==o.confirmPassword&&(n.confirmPassword="Passwords do not match"),d(n)};return e.jsx("form",{onSubmit:m,style:{width:"320px"},children:e.jsxs(N,{gap:4,children:[e.jsx(t,{label:"Current Password",required:!0,errorMessage:s.currentPassword||void 0,error:!!s.currentPassword,children:e.jsx(r,{placeholder:"Enter current password",value:o.currentPassword,onChange:a=>{l({...o,currentPassword:a.target.value}),d({...s,currentPassword:""})},fullWidth:!0})}),e.jsx(t,{label:"New Password",required:!0,helperText:"Minimum 8 characters",errorMessage:s.newPassword||void 0,error:!!s.newPassword,children:e.jsx(r,{placeholder:"Enter new password",value:o.newPassword,onChange:a=>{l({...o,newPassword:a.target.value}),d({...s,newPassword:""})},fullWidth:!0})}),e.jsx(t,{label:"Confirm Password",required:!0,errorMessage:s.confirmPassword||void 0,error:!!s.confirmPassword,children:e.jsx(r,{placeholder:"Confirm new password",value:o.confirmPassword,onChange:a=>{l({...o,confirmPassword:a.target.value}),d({...s,confirmPassword:""})},fullWidth:!0})}),e.jsx(Le,{type:"submit",variant:"primary",size:"md",fullWidth:!0,children:"Change Password"})]})})}};var z,V,L;f.parameters={...f.parameters,docs:{...(z=f.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter password'
  }
}`,...(L=(V=f.parameters)==null?void 0:V.docs)==null?void 0:L.source}}};var k,B,I;P.parameters={...P.parameters,docs:{...(k=P.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <FormField label="Password">
      <Password placeholder="Enter your password" />
    </FormField>
}`,...(I=(B=P.parameters)==null?void 0:B.docs)==null?void 0:I.source}}};var R,H,$;g.parameters={...g.parameters,docs:{...(R=g.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => <FormField label="Password" required>
      <Password placeholder="Enter your password" />
    </FormField>
}`,...($=(H=g.parameters)==null?void 0:H.docs)==null?void 0:$.source}}};var _,A,O;x.parameters={...x.parameters,docs:{...(_=x.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => <FormField label="Password" helperText="Password must be at least 8 characters">
      <Password placeholder="Enter your password" />
    </FormField>
}`,...(O=(A=x.parameters)==null?void 0:A.docs)==null?void 0:O.source}}};var Z,U,G;b.parameters={...b.parameters,docs:{...(Z=b.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: () => <VStack gap={4}>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-2)]">
          Small
        </h3>
        <Password size="sm" placeholder="Small password input" />
      </div>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-2)]">
          Medium (default)
        </h3>
        <Password size="md" placeholder="Medium password input" />
      </div>
    </VStack>
}`,...(G=(U=b.parameters)==null?void 0:U.docs)==null?void 0:G.source}}};var J,K,Q;v.parameters={...v.parameters,docs:{...(J=v.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <FormField label="Password">
      <Password placeholder="Enter password" disabled value="secret123" />
    </FormField>
}`,...(Q=(K=v.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};var X,Y,ee;F.parameters={...F.parameters,docs:{...(X=F.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: () => <FormField label="Password">
      <Password value="secret123" readOnly />
    </FormField>
}`,...(ee=(Y=F.parameters)==null?void 0:Y.docs)==null?void 0:ee.source}}};var re,se,ae;E.parameters={...E.parameters,docs:{...(re=E.parameters)==null?void 0:re.docs,source:{originalSource:`{
  render: () => <FormField label="Password" errorMessage="Password is required" error>
      <Password placeholder="Enter password" />
    </FormField>
}`,...(ae=(se=E.parameters)==null?void 0:se.docs)==null?void 0:ae.source}}};var oe,te,de;j.parameters={...j.parameters,docs:{...(oe=j.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  render: () => <FormField label="Password" helperText="This field has an error" error>
      <Password placeholder="Enter password" />
    </FormField>
}`,...(de=(te=j.parameters)==null?void 0:te.docs)==null?void 0:de.source}}};var le,ne,ie;S.parameters={...S.parameters,docs:{...(le=S.parameters)==null?void 0:le.docs,source:{originalSource:`{
  render: () => <FormField label="Password">
      <Password placeholder="Enter password" showToggle={false} />
    </FormField>
}`,...(ie=(ne=S.parameters)==null?void 0:ne.docs)==null?void 0:ie.source}}};var ce,ue,me;y.parameters={...y.parameters,docs:{...(ce=y.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  render: () => <FormField label="Password">
      <Password placeholder="Enter password" showLabel="비밀번호 보기" hideLabel="비밀번호 숨기기" />
    </FormField>
}`,...(me=(ue=y.parameters)==null?void 0:ue.docs)==null?void 0:me.source}}};var pe,we,he;C.parameters={...C.parameters,docs:{...(pe=C.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  render: () => <div style={{
    width: '400px'
  }}>
      <FormField label="Password">
        <Password placeholder="Enter password" fullWidth />
      </FormField>
    </div>
}`,...(he=(we=C.parameters)==null?void 0:we.docs)==null?void 0:he.source}}};var fe,Pe,ge;T.parameters={...T.parameters,docs:{...(fe=T.parameters)==null?void 0:fe.docs,source:{originalSource:`{
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
        <FormField label="Password" helperText={!error ? 'Min 8 characters, 1 uppercase, 1 number' : undefined} errorMessage={error || undefined} error={!!error}>
          <Password placeholder="Enter a strong password" value={password} onChange={e => {
          setPassword(e.target.value);
          validatePassword(e.target.value);
        }} />
        </FormField>
        <p className="text-body-sm text-[var(--color-text-muted)]">
          Password length: {password.length}
        </p>
      </VStack>;
  }
}`,...(ge=(Pe=T.parameters)==null?void 0:Pe.docs)==null?void 0:ge.source}}};var xe,be,ve;q.parameters={...q.parameters,docs:{...(xe=q.parameters)==null?void 0:xe.docs,source:{originalSource:`{
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
          <FormField label="Current Password" required errorMessage={errors.currentPassword || undefined} error={!!errors.currentPassword}>
            <Password placeholder="Enter current password" value={formData.currentPassword} onChange={e => {
            setFormData({
              ...formData,
              currentPassword: e.target.value
            });
            setErrors({
              ...errors,
              currentPassword: ''
            });
          }} fullWidth />
          </FormField>
          <FormField label="New Password" required helperText="Minimum 8 characters" errorMessage={errors.newPassword || undefined} error={!!errors.newPassword}>
            <Password placeholder="Enter new password" value={formData.newPassword} onChange={e => {
            setFormData({
              ...formData,
              newPassword: e.target.value
            });
            setErrors({
              ...errors,
              newPassword: ''
            });
          }} fullWidth />
          </FormField>
          <FormField label="Confirm Password" required errorMessage={errors.confirmPassword || undefined} error={!!errors.confirmPassword}>
            <Password placeholder="Confirm new password" value={formData.confirmPassword} onChange={e => {
            setFormData({
              ...formData,
              confirmPassword: e.target.value
            });
            setErrors({
              ...errors,
              confirmPassword: ''
            });
          }} fullWidth />
          </FormField>
          <Button type="submit" variant="primary" size="md" fullWidth>
            Change Password
          </Button>
        </VStack>
      </form>;
  }
}`,...(ve=(be=q.parameters)==null?void 0:be.docs)==null?void 0:ve.source}}};const Ue=["Default","WithLabel","Required","WithHelperText","Sizes","Disabled","ReadOnly","Error","ErrorBoolean","WithoutToggle","CustomToggleLabels","FullWidth","Controlled","FormExample"];export{T as Controlled,y as CustomToggleLabels,f as Default,v as Disabled,E as Error,j as ErrorBoolean,q as FormExample,C as FullWidth,F as ReadOnly,g as Required,b as Sizes,x as WithHelperText,P as WithLabel,S as WithoutToggle,Ue as __namedExportsOrder,Ze as default};
