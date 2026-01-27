import{r as n,j as e}from"./iframe-D96dQDLz.js";import{t as m}from"./bundle-mjs-BZSatpsL.js";import{I as t}from"./Input-V5aLO0ug.js";import{S as Y}from"./Select-CwYvJg0l.js";import{C as re}from"./Checkbox-DjL_E0Wu.js";import"./preload-helper-C1FmrZbK.js";import"./index-Dm9gNcw7.js";import"./IconX-DlnDTnrf.js";import"./createReactComponent-Dvr8b43U.js";import"./IconChevronDown-B3KfbvkI.js";import"./IconCheck-KE79Jf-a.js";import"./IconMinus-hJv9kC-c.js";const $=n.createContext({}),v=()=>n.useContext($),g=n.forwardRef(({id:l,error:o,disabled:i,required:d,children:a,className:s,...j},C)=>{const y={id:l,error:o,disabled:i,required:d};return e.jsx($.Provider,{value:y,children:e.jsx("div",{ref:C,className:m("flex flex-col gap-2",s),...j,children:a})})});g.displayName="FormField";const G=n.forwardRef(({children:l,required:o,size:i="md",className:d,...a},s)=>{const{id:j,required:C}=v(),y=o??C,ee={sm:"text-[length:var(--font-size-12)] leading-[var(--line-height-16)]",md:"text-[length:var(--font-size-14)] leading-[var(--line-height-20)]"};return e.jsxs("label",{ref:s,htmlFor:j,className:m("font-medium text-[var(--color-text-default)]",ee[i],d),...a,children:[l,y&&e.jsx("span",{className:"ml-1 text-[var(--color-state-danger)]",children:"*"})]})});G.displayName="FormField.Label";const Q=n.forwardRef(({children:l,className:o,...i},d)=>e.jsx("div",{ref:d,className:m("w-full",o),...i,children:l}));Q.displayName="FormField.Control";const X=n.forwardRef(({children:l,className:o,...i},d)=>{const{id:a,error:s}=v();return s?null:e.jsx("p",{ref:d,id:a?`${a}-helper`:void 0,className:m("text-[11px] leading-[var(--line-height-16)] text-[var(--color-text-subtle)]",o),...i,children:l})});X.displayName="FormField.HelperText";const Z=n.forwardRef(({children:l,className:o,...i},d)=>{const{id:a,error:s}=v();return s?e.jsx("p",{ref:d,id:a?`${a}-error`:void 0,role:"alert",className:m("text-[11px] leading-[var(--line-height-16)] text-[var(--color-state-danger)]",o),...i,children:l}):null});Z.displayName="FormField.ErrorMessage";const r=Object.assign(g,{Label:G,Control:Q,HelperText:X,ErrorMessage:Z});g.__docgenInfo={description:"",methods:[],displayName:"FormField",props:{id:{required:!1,tsType:{name:"string"},description:"Field ID - used to connect label with input"},error:{required:!1,tsType:{name:"boolean"},description:"Whether the field has an error"},disabled:{required:!1,tsType:{name:"boolean"},description:"Whether the field is disabled"},required:{required:!1,tsType:{name:"boolean"},description:"Whether the field is required"},children:{required:!0,tsType:{name:"ReactNode"},description:"Children elements"}},composes:["HTMLAttributes"]};const pe={title:"Components/FormField",component:r,parameters:{layout:"centered",docs:{description:{component:"폼 필드를 구성하는 Compound Component입니다. 라벨, 컨트롤, 도움말, 에러 메시지를 조합합니다."}}},tags:["autodocs"],argTypes:{id:{control:"text",description:"필드 ID (라벨과 입력 연결)"},error:{control:"boolean",description:"에러 상태"},disabled:{control:"boolean",description:"비활성화 상태"},required:{control:"boolean",description:"필수 필드 여부"}},decorators:[l=>e.jsx("div",{style:{width:"320px"},children:e.jsx(l,{})})]},c={render:()=>e.jsxs(r,{id:"username",children:[e.jsx(r.Label,{children:"Username"}),e.jsx(r.Control,{children:e.jsx(t,{id:"username",placeholder:"Enter username",fullWidth:!0})}),e.jsx(r.HelperText,{children:"Your username must be unique."})]})},F={render:()=>e.jsxs(r,{id:"email",required:!0,children:[e.jsx(r.Label,{children:"Email"}),e.jsx(r.Control,{children:e.jsx(t,{id:"email",type:"email",placeholder:"Enter email",fullWidth:!0})}),e.jsx(r.HelperText,{children:"We'll never share your email."})]})},u={name:"With Error",render:()=>e.jsxs(r,{id:"password",error:!0,required:!0,children:[e.jsx(r.Label,{children:"Password"}),e.jsx(r.Control,{children:e.jsx(t,{id:"password",type:"password",placeholder:"Enter password",fullWidth:!0,error:!0})}),e.jsx(r.HelperText,{children:"This won't be shown when there's an error."}),e.jsx(r.ErrorMessage,{children:"Password must be at least 8 characters."})]})},p={render:()=>e.jsxs(r,{id:"readonly",disabled:!0,children:[e.jsx(r.Label,{children:"Read Only Field"}),e.jsx(r.Control,{children:e.jsx(t,{id:"readonly",value:"Cannot edit this",disabled:!0,fullWidth:!0})}),e.jsx(r.HelperText,{children:"This field is disabled."})]})},h={name:"With Select",render:()=>e.jsxs(r,{id:"country",required:!0,children:[e.jsx(r.Label,{children:"Country"}),e.jsx(r.Control,{children:e.jsx(Y,{id:"country",placeholder:"Select a country",fullWidth:!0,options:[{value:"kr",label:"South Korea"},{value:"us",label:"United States"},{value:"jp",label:"Japan"},{value:"cn",label:"China"}]})}),e.jsx(r.HelperText,{children:"Select your country of residence."})]})},x={name:"With Checkbox",render:()=>e.jsx(r,{id:"terms",required:!0,children:e.jsx(r.Control,{children:e.jsx(re,{id:"terms",label:"I agree to the Terms of Service",description:"By checking this, you agree to our terms and privacy policy."})})})},b={name:"Label Sizes",render:()=>e.jsxs("div",{className:"flex flex-col gap-6 w-full",children:[e.jsxs(r,{id:"small-label",children:[e.jsx(r.Label,{size:"sm",children:"Small Label"}),e.jsx(r.Control,{children:e.jsx(t,{id:"small-label",placeholder:"With small label",fullWidth:!0})})]}),e.jsxs(r,{id:"medium-label",children:[e.jsx(r.Label,{size:"md",children:"Medium Label (Default)"}),e.jsx(r.Control,{children:e.jsx(t,{id:"medium-label",placeholder:"With medium label",fullWidth:!0})})]})]})},f={name:"Complete Form Example",render:()=>e.jsxs("div",{className:"flex flex-col gap-6 w-full",children:[e.jsxs(r,{id:"form-name",required:!0,children:[e.jsx(r.Label,{children:"Full Name"}),e.jsx(r.Control,{children:e.jsx(t,{id:"form-name",placeholder:"John Doe",fullWidth:!0})})]}),e.jsxs(r,{id:"form-email",required:!0,children:[e.jsx(r.Label,{children:"Email Address"}),e.jsx(r.Control,{children:e.jsx(t,{id:"form-email",type:"email",placeholder:"john@example.com",fullWidth:!0})}),e.jsx(r.HelperText,{children:"We'll send a confirmation to this email."})]}),e.jsxs(r,{id:"form-password",required:!0,error:!0,children:[e.jsx(r.Label,{children:"Password"}),e.jsx(r.Control,{children:e.jsx(t,{id:"form-password",type:"password",placeholder:"••••••••",fullWidth:!0,error:!0})}),e.jsx(r.ErrorMessage,{children:"Password must contain at least one number."})]}),e.jsxs(r,{id:"form-role",children:[e.jsx(r.Label,{children:"Role"}),e.jsx(r.Control,{children:e.jsx(Y,{id:"form-role",placeholder:"Select role",fullWidth:!0,options:[{value:"admin",label:"Administrator"},{value:"editor",label:"Editor"},{value:"viewer",label:"Viewer"}]})}),e.jsx(r.HelperText,{children:"Choose the appropriate access level."})]})]})};var w,L,W;c.parameters={...c.parameters,docs:{...(w=c.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <FormField id="username">
      <FormField.Label>Username</FormField.Label>
      <FormField.Control>
        <Input id="username" placeholder="Enter username" fullWidth />
      </FormField.Control>
      <FormField.HelperText>Your username must be unique.</FormField.HelperText>
    </FormField>
}`,...(W=(L=c.parameters)==null?void 0:L.docs)==null?void 0:W.source}}};var T,S,q;F.parameters={...F.parameters,docs:{...(T=F.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => <FormField id="email" required>
      <FormField.Label>Email</FormField.Label>
      <FormField.Control>
        <Input id="email" type="email" placeholder="Enter email" fullWidth />
      </FormField.Control>
      <FormField.HelperText>We'll never share your email.</FormField.HelperText>
    </FormField>
}`,...(q=(S=F.parameters)==null?void 0:S.docs)==null?void 0:q.source}}};var E,H,N;u.parameters={...u.parameters,docs:{...(E=u.parameters)==null?void 0:E.docs,source:{originalSource:`{
  name: 'With Error',
  render: () => <FormField id="password" error required>
      <FormField.Label>Password</FormField.Label>
      <FormField.Control>
        <Input id="password" type="password" placeholder="Enter password" fullWidth error />
      </FormField.Control>
      <FormField.HelperText>This won't be shown when there's an error.</FormField.HelperText>
      <FormField.ErrorMessage>Password must be at least 8 characters.</FormField.ErrorMessage>
    </FormField>
}`,...(N=(H=u.parameters)==null?void 0:H.docs)==null?void 0:N.source}}};var I,R,M;p.parameters={...p.parameters,docs:{...(I=p.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <FormField id="readonly" disabled>
      <FormField.Label>Read Only Field</FormField.Label>
      <FormField.Control>
        <Input id="readonly" value="Cannot edit this" disabled fullWidth />
      </FormField.Control>
      <FormField.HelperText>This field is disabled.</FormField.HelperText>
    </FormField>
}`,...(M=(R=p.parameters)==null?void 0:R.docs)==null?void 0:M.source}}};var z,k,D;h.parameters={...h.parameters,docs:{...(z=h.parameters)==null?void 0:z.docs,source:{originalSource:`{
  name: 'With Select',
  render: () => <FormField id="country" required>
      <FormField.Label>Country</FormField.Label>
      <FormField.Control>
        <Select id="country" placeholder="Select a country" fullWidth options={[{
        value: 'kr',
        label: 'South Korea'
      }, {
        value: 'us',
        label: 'United States'
      }, {
        value: 'jp',
        label: 'Japan'
      }, {
        value: 'cn',
        label: 'China'
      }]} />
      </FormField.Control>
      <FormField.HelperText>Select your country of residence.</FormField.HelperText>
    </FormField>
}`,...(D=(k=h.parameters)==null?void 0:k.docs)==null?void 0:D.source}}};var P,A,J;x.parameters={...x.parameters,docs:{...(P=x.parameters)==null?void 0:P.docs,source:{originalSource:`{
  name: 'With Checkbox',
  render: () => <FormField id="terms" required>
      <FormField.Control>
        <Checkbox id="terms" label="I agree to the Terms of Service" description="By checking this, you agree to our terms and privacy policy." />
      </FormField.Control>
    </FormField>
}`,...(J=(A=x.parameters)==null?void 0:A.docs)==null?void 0:J.source}}};var O,U,_;b.parameters={...b.parameters,docs:{...(O=b.parameters)==null?void 0:O.docs,source:{originalSource:`{
  name: 'Label Sizes',
  render: () => <div className="flex flex-col gap-6 w-full">
      <FormField id="small-label">
        <FormField.Label size="sm">Small Label</FormField.Label>
        <FormField.Control>
          <Input id="small-label" placeholder="With small label" fullWidth />
        </FormField.Control>
      </FormField>
      <FormField id="medium-label">
        <FormField.Label size="md">Medium Label (Default)</FormField.Label>
        <FormField.Control>
          <Input id="medium-label" placeholder="With medium label" fullWidth />
        </FormField.Control>
      </FormField>
    </div>
}`,...(_=(U=b.parameters)==null?void 0:U.docs)==null?void 0:_.source}}};var V,B,K;f.parameters={...f.parameters,docs:{...(V=f.parameters)==null?void 0:V.docs,source:{originalSource:`{
  name: 'Complete Form Example',
  render: () => <div className="flex flex-col gap-6 w-full">
      <FormField id="form-name" required>
        <FormField.Label>Full Name</FormField.Label>
        <FormField.Control>
          <Input id="form-name" placeholder="John Doe" fullWidth />
        </FormField.Control>
      </FormField>

      <FormField id="form-email" required>
        <FormField.Label>Email Address</FormField.Label>
        <FormField.Control>
          <Input id="form-email" type="email" placeholder="john@example.com" fullWidth />
        </FormField.Control>
        <FormField.HelperText>We'll send a confirmation to this email.</FormField.HelperText>
      </FormField>

      <FormField id="form-password" required error>
        <FormField.Label>Password</FormField.Label>
        <FormField.Control>
          <Input id="form-password" type="password" placeholder="••••••••" fullWidth error />
        </FormField.Control>
        <FormField.ErrorMessage>Password must contain at least one number.</FormField.ErrorMessage>
      </FormField>

      <FormField id="form-role">
        <FormField.Label>Role</FormField.Label>
        <FormField.Control>
          <Select id="form-role" placeholder="Select role" fullWidth options={[{
          value: 'admin',
          label: 'Administrator'
        }, {
          value: 'editor',
          label: 'Editor'
        }, {
          value: 'viewer',
          label: 'Viewer'
        }]} />
        </FormField.Control>
        <FormField.HelperText>Choose the appropriate access level.</FormField.HelperText>
      </FormField>
    </div>
}`,...(K=(B=f.parameters)==null?void 0:B.docs)==null?void 0:K.source}}};const he=["Default","Required","WithError","Disabled","WithSelect","WithCheckbox","LabelSizes","CompleteForm"];export{f as CompleteForm,c as Default,p as Disabled,b as LabelSizes,F as Required,x as WithCheckbox,u as WithError,h as WithSelect,he as __namedExportsOrder,pe as default};
