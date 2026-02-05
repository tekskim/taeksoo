import{r as d,j as e}from"./iframe-B4qQhCO6.js";import{t as T}from"./bundle-mjs-BZSatpsL.js";import{I as i}from"./Input-BZRHYF-Y.js";import{S as E}from"./Select-D2IfIOeh.js";import{C as ge}from"./Checkbox-BnTtixkK.js";import"./preload-helper-C1FmrZbK.js";import"./index-DWHu83xY.js";import"./IconX-FNl1vDsy.js";import"./createReactComponent-Bds5dDb0.js";import"./IconChevronDown-BLmatsEi.js";import"./IconCheck-BgbQWatL.js";import"./IconMinus-rv-rEP72.js";const L=d.createContext({}),g=()=>d.useContext(L),P=d.forwardRef(({id:l,error:a,disabled:t,required:s,children:o,className:n,label:c,description:u,helperText:p,errorMessage:F,labelSize:Ie="md",...M},k)=>{const Te=d.useId(),z=l||(c?Te:void 0),U={id:z,error:a,disabled:t,required:s};return c!==void 0?e.jsx(L.Provider,{value:U,children:e.jsxs("div",{ref:k,className:T("flex flex-col gap-[8px]",n),...M,children:[e.jsx(A,{size:Ie,children:c}),u&&e.jsx(R,{children:u}),e.jsx(N,{children:d.Children.map(o,m=>d.isValidElement(m)?d.cloneElement(m,{id:m.props.id||z,error:m.props.error??a,disabled:m.props.disabled??t}):m)}),p&&e.jsx(H,{children:p}),F&&e.jsx(D,{children:F})]})}):e.jsx(L.Provider,{value:U,children:e.jsx("div",{ref:k,className:T("flex flex-col gap-[8px]",n),...M,children:o})})});P.displayName="FormField";const A=d.forwardRef(({children:l,required:a,size:t="md",className:s,...o},n)=>{const{id:c,required:u}=g(),p=a??u,F={sm:"text-label-md",md:"text-label-lg"};return e.jsxs("label",{ref:n,htmlFor:c,className:T("font-medium text-[var(--color-text-default)]",F[t],s),...o,children:[l,p&&e.jsx("span",{className:"ml-1 text-[var(--color-state-danger)]",children:"*"})]})});A.displayName="FormField.Label";const N=d.forwardRef(({children:l,className:a,...t},s)=>e.jsx("div",{ref:s,className:T("w-full",a),...t,children:l}));N.displayName="FormField.Control";const R=d.forwardRef(({children:l,className:a,...t},s)=>{const{id:o}=g();return e.jsx("p",{ref:s,id:o?`${o}-description`:void 0,className:`text-body-md text-[var(--color-text-subtle)] -mt-[4px] ${a||""}`,...t,children:l})});R.displayName="FormField.Description";const H=d.forwardRef(({children:l,className:a,...t},s)=>{const{id:o,error:n}=g();return n?null:e.jsx("p",{ref:s,id:o?`${o}-helper`:void 0,className:`text-body-sm text-[var(--color-text-subtle)] ${a||""}`,...t,children:l})});H.displayName="FormField.HelperText";const D=d.forwardRef(({children:l,className:a,...t},s)=>{const{id:o,error:n}=g();return n?e.jsx("p",{ref:s,id:o?`${o}-error`:void 0,role:"alert",className:`text-body-sm text-[var(--color-state-danger)] ${a||""}`,...t,children:l}):null});D.displayName="FormField.ErrorMessage";const r=Object.assign(P,{Label:A,Description:R,Control:N,HelperText:H,ErrorMessage:D});P.__docgenInfo={description:"",methods:[],displayName:"FormField",props:{id:{required:!1,tsType:{name:"string"},description:"Field ID - used to connect label with input"},error:{required:!1,tsType:{name:"boolean"},description:"Whether the field has an error"},disabled:{required:!1,tsType:{name:"boolean"},description:"Whether the field is disabled"},required:{required:!1,tsType:{name:"boolean"},description:"Whether the field is required"},children:{required:!0,tsType:{name:"ReactNode"},description:"Children elements"},label:{required:!1,tsType:{name:"ReactNode"},description:"Label text (simple API) - if provided, enables simple mode"},description:{required:!1,tsType:{name:"ReactNode"},description:"Description text below label (simple API)"},helperText:{required:!1,tsType:{name:"ReactNode"},description:"Helper text below input (simple API)"},errorMessage:{required:!1,tsType:{name:"ReactNode"},description:"Error message (simple API)"},labelSize:{required:!1,tsType:{name:"union",raw:"'sm' | 'md'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"}]},description:"Label size",defaultValue:{value:"'md'",computed:!1}}},composes:["HTMLAttributes"]};const Je={title:"Components/FormField",component:r,parameters:{layout:"centered",docs:{description:{component:"폼 필드를 구성하는 Compound Component입니다. 라벨, 컨트롤, 도움말, 에러 메시지를 조합합니다."}}},tags:["autodocs"],argTypes:{id:{control:"text",description:"필드 ID (라벨과 입력 연결)"},error:{control:"boolean",description:"에러 상태"},disabled:{control:"boolean",description:"비활성화 상태"},required:{control:"boolean",description:"필수 필드 여부"}},decorators:[l=>e.jsx("div",{style:{width:"320px"},children:e.jsx(l,{})})]},h={name:"Simple API (Recommended)",render:()=>e.jsx(r,{label:"Username",helperText:"Your username must be unique.",children:e.jsx(i,{placeholder:"Enter username",fullWidth:!0})})},x={name:"Simple API - Required",render:()=>e.jsx(r,{label:"Email",helperText:"We'll never share your email.",required:!0,children:e.jsx(i,{type:"email",placeholder:"Enter email",fullWidth:!0})})},b={name:"Simple API - With Description",render:()=>e.jsx(r,{label:"Instance Name",description:"A unique name to identify your instance",helperText:"2-64 characters, letters, numbers, and hyphens",required:!0,children:e.jsx(i,{placeholder:"my-instance-01",fullWidth:!0})})},f={name:"Simple API - With Error",render:()=>e.jsx(r,{label:"Password",errorMessage:"Password must be at least 8 characters.",required:!0,error:!0,children:e.jsx(i,{type:"password",placeholder:"Enter password",fullWidth:!0})})},j={name:"Simple API - With Select",render:()=>e.jsx(r,{label:"Country",helperText:"Select your country of residence.",required:!0,children:e.jsx(E,{placeholder:"Select a country",fullWidth:!0,options:[{value:"kr",label:"South Korea"},{value:"us",label:"United States"},{value:"jp",label:"Japan"}]})})},y={name:"Compound API - Default",render:()=>e.jsxs(r,{id:"username",children:[e.jsx(r.Label,{children:"Username"}),e.jsx(r.Control,{children:e.jsx(i,{id:"username",placeholder:"Enter username",fullWidth:!0})}),e.jsx(r.HelperText,{children:"Your username must be unique."})]})},S={render:()=>e.jsxs(r,{id:"email",required:!0,children:[e.jsx(r.Label,{children:"Email"}),e.jsx(r.Control,{children:e.jsx(i,{id:"email",type:"email",placeholder:"Enter email",fullWidth:!0})}),e.jsx(r.HelperText,{children:"We'll never share your email."})]})},C={name:"With Error",render:()=>e.jsxs(r,{id:"password",error:!0,required:!0,children:[e.jsx(r.Label,{children:"Password"}),e.jsx(r.Control,{children:e.jsx(i,{id:"password",type:"password",placeholder:"Enter password",fullWidth:!0,error:!0})}),e.jsx(r.HelperText,{children:"This won't be shown when there's an error."}),e.jsx(r.ErrorMessage,{children:"Password must be at least 8 characters."})]})},W={render:()=>e.jsxs(r,{id:"readonly",disabled:!0,children:[e.jsx(r.Label,{children:"Read Only Field"}),e.jsx(r.Control,{children:e.jsx(i,{id:"readonly",value:"Cannot edit this",disabled:!0,fullWidth:!0})}),e.jsx(r.HelperText,{children:"This field is disabled."})]})},v={name:"With Select",render:()=>e.jsxs(r,{id:"country",required:!0,children:[e.jsx(r.Label,{children:"Country"}),e.jsx(r.Control,{children:e.jsx(E,{id:"country",placeholder:"Select a country",fullWidth:!0,options:[{value:"kr",label:"South Korea"},{value:"us",label:"United States"},{value:"jp",label:"Japan"},{value:"cn",label:"China"}]})}),e.jsx(r.HelperText,{children:"Select your country of residence."})]})},w={name:"With Checkbox",render:()=>e.jsx(r,{id:"terms",required:!0,children:e.jsx(r.Control,{children:e.jsx(ge,{id:"terms",label:"I agree to the Terms of Service",description:"By checking this, you agree to our terms and privacy policy."})})})},q={name:"Label Sizes",render:()=>e.jsxs("div",{className:"flex flex-col gap-6 w-full",children:[e.jsxs(r,{id:"small-label",children:[e.jsx(r.Label,{size:"sm",children:"Small Label"}),e.jsx(r.Control,{children:e.jsx(i,{id:"small-label",placeholder:"With small label",fullWidth:!0})})]}),e.jsxs(r,{id:"medium-label",children:[e.jsx(r.Label,{size:"md",children:"Medium Label (Default)"}),e.jsx(r.Control,{children:e.jsx(i,{id:"medium-label",placeholder:"With medium label",fullWidth:!0})})]})]})},I={name:"Complete Form Example",render:()=>e.jsxs("div",{className:"flex flex-col gap-6 w-full",children:[e.jsxs(r,{id:"form-name",required:!0,children:[e.jsx(r.Label,{children:"Full Name"}),e.jsx(r.Control,{children:e.jsx(i,{id:"form-name",placeholder:"John Doe",fullWidth:!0})})]}),e.jsxs(r,{id:"form-email",required:!0,children:[e.jsx(r.Label,{children:"Email Address"}),e.jsx(r.Control,{children:e.jsx(i,{id:"form-email",type:"email",placeholder:"john@example.com",fullWidth:!0})}),e.jsx(r.HelperText,{children:"We'll send a confirmation to this email."})]}),e.jsxs(r,{id:"form-password",required:!0,error:!0,children:[e.jsx(r.Label,{children:"Password"}),e.jsx(r.Control,{children:e.jsx(i,{id:"form-password",type:"password",placeholder:"••••••••",fullWidth:!0,error:!0})}),e.jsx(r.ErrorMessage,{children:"Password must contain at least one number."})]}),e.jsxs(r,{id:"form-role",children:[e.jsx(r.Label,{children:"Role"}),e.jsx(r.Control,{children:e.jsx(E,{id:"form-role",placeholder:"Select role",fullWidth:!0,options:[{value:"admin",label:"Administrator"},{value:"editor",label:"Editor"},{value:"viewer",label:"Viewer"}]})}),e.jsx(r.HelperText,{children:"Choose the appropriate access level."})]})]})};var J,$,V;h.parameters={...h.parameters,docs:{...(J=h.parameters)==null?void 0:J.docs,source:{originalSource:`{
  name: 'Simple API (Recommended)',
  render: () => <FormField label="Username" helperText="Your username must be unique.">
      <Input placeholder="Enter username" fullWidth />
    </FormField>
}`,...(V=($=h.parameters)==null?void 0:$.docs)==null?void 0:V.source}}};var K,O,Y;x.parameters={...x.parameters,docs:{...(K=x.parameters)==null?void 0:K.docs,source:{originalSource:`{
  name: 'Simple API - Required',
  render: () => <FormField label="Email" helperText="We'll never share your email." required>
      <Input type="email" placeholder="Enter email" fullWidth />
    </FormField>
}`,...(Y=(O=x.parameters)==null?void 0:O.docs)==null?void 0:Y.source}}};var _,B,G;b.parameters={...b.parameters,docs:{...(_=b.parameters)==null?void 0:_.docs,source:{originalSource:`{
  name: 'Simple API - With Description',
  render: () => <FormField label="Instance Name" description="A unique name to identify your instance" helperText="2-64 characters, letters, numbers, and hyphens" required>
      <Input placeholder="my-instance-01" fullWidth />
    </FormField>
}`,...(G=(B=b.parameters)==null?void 0:B.docs)==null?void 0:G.source}}};var Q,X,Z;f.parameters={...f.parameters,docs:{...(Q=f.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  name: 'Simple API - With Error',
  render: () => <FormField label="Password" errorMessage="Password must be at least 8 characters." required error>
      <Input type="password" placeholder="Enter password" fullWidth />
    </FormField>
}`,...(Z=(X=f.parameters)==null?void 0:X.docs)==null?void 0:Z.source}}};var ee,re,le;j.parameters={...j.parameters,docs:{...(ee=j.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  name: 'Simple API - With Select',
  render: () => <FormField label="Country" helperText="Select your country of residence." required>
      <Select placeholder="Select a country" fullWidth options={[{
      value: 'kr',
      label: 'South Korea'
    }, {
      value: 'us',
      label: 'United States'
    }, {
      value: 'jp',
      label: 'Japan'
    }]} />
    </FormField>
}`,...(le=(re=j.parameters)==null?void 0:re.docs)==null?void 0:le.source}}};var oe,ie,ae;y.parameters={...y.parameters,docs:{...(oe=y.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  name: 'Compound API - Default',
  render: () => <FormField id="username">
      <FormField.Label>Username</FormField.Label>
      <FormField.Control>
        <Input id="username" placeholder="Enter username" fullWidth />
      </FormField.Control>
      <FormField.HelperText>Your username must be unique.</FormField.HelperText>
    </FormField>
}`,...(ae=(ie=y.parameters)==null?void 0:ie.docs)==null?void 0:ae.source}}};var te,de,se;S.parameters={...S.parameters,docs:{...(te=S.parameters)==null?void 0:te.docs,source:{originalSource:`{
  render: () => <FormField id="email" required>
      <FormField.Label>Email</FormField.Label>
      <FormField.Control>
        <Input id="email" type="email" placeholder="Enter email" fullWidth />
      </FormField.Control>
      <FormField.HelperText>We'll never share your email.</FormField.HelperText>
    </FormField>
}`,...(se=(de=S.parameters)==null?void 0:de.docs)==null?void 0:se.source}}};var ne,me,ce;C.parameters={...C.parameters,docs:{...(ne=C.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  name: 'With Error',
  render: () => <FormField id="password" error required>
      <FormField.Label>Password</FormField.Label>
      <FormField.Control>
        <Input id="password" type="password" placeholder="Enter password" fullWidth error />
      </FormField.Control>
      <FormField.HelperText>This won't be shown when there's an error.</FormField.HelperText>
      <FormField.ErrorMessage>Password must be at least 8 characters.</FormField.ErrorMessage>
    </FormField>
}`,...(ce=(me=C.parameters)==null?void 0:me.docs)==null?void 0:ce.source}}};var ue,pe,Fe;W.parameters={...W.parameters,docs:{...(ue=W.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  render: () => <FormField id="readonly" disabled>
      <FormField.Label>Read Only Field</FormField.Label>
      <FormField.Control>
        <Input id="readonly" value="Cannot edit this" disabled fullWidth />
      </FormField.Control>
      <FormField.HelperText>This field is disabled.</FormField.HelperText>
    </FormField>
}`,...(Fe=(pe=W.parameters)==null?void 0:pe.docs)==null?void 0:Fe.source}}};var he,xe,be;v.parameters={...v.parameters,docs:{...(he=v.parameters)==null?void 0:he.docs,source:{originalSource:`{
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
}`,...(be=(xe=v.parameters)==null?void 0:xe.docs)==null?void 0:be.source}}};var fe,je,ye;w.parameters={...w.parameters,docs:{...(fe=w.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  name: 'With Checkbox',
  render: () => <FormField id="terms" required>
      <FormField.Control>
        <Checkbox id="terms" label="I agree to the Terms of Service" description="By checking this, you agree to our terms and privacy policy." />
      </FormField.Control>
    </FormField>
}`,...(ye=(je=w.parameters)==null?void 0:je.docs)==null?void 0:ye.source}}};var Se,Ce,We;q.parameters={...q.parameters,docs:{...(Se=q.parameters)==null?void 0:Se.docs,source:{originalSource:`{
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
}`,...(We=(Ce=q.parameters)==null?void 0:Ce.docs)==null?void 0:We.source}}};var ve,we,qe;I.parameters={...I.parameters,docs:{...(ve=I.parameters)==null?void 0:ve.docs,source:{originalSource:`{
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
}`,...(qe=(we=I.parameters)==null?void 0:we.docs)==null?void 0:qe.source}}};const $e=["SimpleAPI","SimpleAPIRequired","SimpleAPIWithDescription","SimpleAPIWithError","SimpleAPIWithSelect","Default","Required","WithError","Disabled","WithSelect","WithCheckbox","LabelSizes","CompleteForm"];export{I as CompleteForm,y as Default,W as Disabled,q as LabelSizes,S as Required,h as SimpleAPI,x as SimpleAPIRequired,b as SimpleAPIWithDescription,f as SimpleAPIWithError,j as SimpleAPIWithSelect,w as WithCheckbox,C as WithError,v as WithSelect,$e as __namedExportsOrder,Je as default};
