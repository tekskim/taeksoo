import{j as e}from"./iframe-C-CGJmyb.js";import{F as r}from"./FormField-BFuRyVI1.js";import{I as l}from"./Input-DYjPjFqM.js";import{S as x}from"./Select-CekzjcHt.js";import{C as oe}from"./Checkbox-DtJhGuG-.js";import"./preload-helper-C1FmrZbK.js";import"./cn-CshvV4Tc.js";import"./index-KOaWZOGP.js";import"./IconX---FUZfxB.js";import"./createReactComponent-BvK7gRRe.js";import"./IconChevronDown-Db3dj90x.js";import"./IconCheck-CagYHy1_.js";import"./IconMinus-B64vmpJw.js";const be={title:"Components/FormField",component:r,parameters:{layout:"centered",docs:{description:{component:"폼 필드를 구성하는 Compound Component입니다. 라벨, 컨트롤, 도움말, 에러 메시지를 조합합니다."}}},tags:["autodocs"],argTypes:{id:{control:"text",description:"필드 ID (라벨과 입력 연결)"},error:{control:"boolean",description:"에러 상태"},disabled:{control:"boolean",description:"비활성화 상태"},required:{control:"boolean",description:"필수 필드 여부"}},decorators:[le=>e.jsx("div",{style:{width:"320px"},children:e.jsx(le,{})})]},o={name:"Simple API (Recommended)",render:()=>e.jsx(r,{label:"Username",helperText:"Your username must be unique.",children:e.jsx(l,{placeholder:"Enter username",fullWidth:!0})})},i={name:"Simple API - Required",render:()=>e.jsx(r,{label:"Email",helperText:"We'll never share your email.",required:!0,children:e.jsx(l,{type:"email",placeholder:"Enter email",fullWidth:!0})})},a={name:"Simple API - With Description",render:()=>e.jsx(r,{label:"Instance Name",description:"A unique name to identify your instance",helperText:"2-64 characters, letters, numbers, and hyphens",required:!0,children:e.jsx(l,{placeholder:"my-instance-01",fullWidth:!0})})},d={name:"Simple API - With Error",render:()=>e.jsx(r,{label:"Password",errorMessage:"Password must be at least 8 characters.",required:!0,error:!0,children:e.jsx(l,{type:"password",placeholder:"Enter password",fullWidth:!0})})},t={name:"Simple API - With Select",render:()=>e.jsx(r,{label:"Country",helperText:"Select your country of residence.",required:!0,children:e.jsx(x,{placeholder:"Select a country",fullWidth:!0,options:[{value:"kr",label:"South Korea"},{value:"us",label:"United States"},{value:"jp",label:"Japan"}]})})},s={name:"Compound API - Default",render:()=>e.jsxs(r,{id:"username",children:[e.jsx(r.Label,{children:"Username"}),e.jsx(r.Control,{children:e.jsx(l,{id:"username",placeholder:"Enter username",fullWidth:!0})}),e.jsx(r.HelperText,{children:"Your username must be unique."})]})},m={render:()=>e.jsxs(r,{id:"email",required:!0,children:[e.jsx(r.Label,{children:"Email"}),e.jsx(r.Control,{children:e.jsx(l,{id:"email",type:"email",placeholder:"Enter email",fullWidth:!0})}),e.jsx(r.HelperText,{children:"We'll never share your email."})]})},n={name:"With Error",render:()=>e.jsxs(r,{id:"password",error:!0,required:!0,children:[e.jsx(r.Label,{children:"Password"}),e.jsx(r.Control,{children:e.jsx(l,{id:"password",type:"password",placeholder:"Enter password",fullWidth:!0,error:!0})}),e.jsx(r.HelperText,{children:"This won't be shown when there's an error."}),e.jsx(r.ErrorMessage,{children:"Password must be at least 8 characters."})]})},c={render:()=>e.jsxs(r,{id:"readonly",disabled:!0,children:[e.jsx(r.Label,{children:"Read Only Field"}),e.jsx(r.Control,{children:e.jsx(l,{id:"readonly",value:"Cannot edit this",disabled:!0,fullWidth:!0})}),e.jsx(r.HelperText,{children:"This field is disabled."})]})},u={name:"With Select",render:()=>e.jsxs(r,{id:"country",required:!0,children:[e.jsx(r.Label,{children:"Country"}),e.jsx(r.Control,{children:e.jsx(x,{id:"country",placeholder:"Select a country",fullWidth:!0,options:[{value:"kr",label:"South Korea"},{value:"us",label:"United States"},{value:"jp",label:"Japan"},{value:"cn",label:"China"}]})}),e.jsx(r.HelperText,{children:"Select your country of residence."})]})},p={name:"With Checkbox",render:()=>e.jsx(r,{id:"terms",required:!0,children:e.jsx(r.Control,{children:e.jsx(oe,{id:"terms",label:"I agree to the Terms of Service",description:"By checking this, you agree to our terms and privacy policy."})})})},F={name:"Label Sizes",render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-6)] w-full",children:[e.jsxs(r,{id:"small-label",children:[e.jsx(r.Label,{size:"sm",children:"Small Label"}),e.jsx(r.Control,{children:e.jsx(l,{id:"small-label",placeholder:"With small label",fullWidth:!0})})]}),e.jsxs(r,{id:"medium-label",children:[e.jsx(r.Label,{size:"md",children:"Medium Label (Default)"}),e.jsx(r.Control,{children:e.jsx(l,{id:"medium-label",placeholder:"With medium label",fullWidth:!0})})]})]})},h={name:"Complete Form Example",render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-6)] w-full",children:[e.jsxs(r,{id:"form-name",required:!0,children:[e.jsx(r.Label,{children:"Full Name"}),e.jsx(r.Control,{children:e.jsx(l,{id:"form-name",placeholder:"John Doe",fullWidth:!0})})]}),e.jsxs(r,{id:"form-email",required:!0,children:[e.jsx(r.Label,{children:"Email Address"}),e.jsx(r.Control,{children:e.jsx(l,{id:"form-email",type:"email",placeholder:"john@example.com",fullWidth:!0})}),e.jsx(r.HelperText,{children:"We'll send a confirmation to this email."})]}),e.jsxs(r,{id:"form-password",required:!0,error:!0,children:[e.jsx(r.Label,{children:"Password"}),e.jsx(r.Control,{children:e.jsx(l,{id:"form-password",type:"password",placeholder:"••••••••",fullWidth:!0,error:!0})}),e.jsx(r.ErrorMessage,{children:"Password must contain at least one number."})]}),e.jsxs(r,{id:"form-role",children:[e.jsx(r.Label,{children:"Role"}),e.jsx(r.Control,{children:e.jsx(x,{id:"form-role",placeholder:"Select role",fullWidth:!0,options:[{value:"admin",label:"Administrator"},{value:"editor",label:"Editor"},{value:"viewer",label:"Viewer"}]})}),e.jsx(r.HelperText,{children:"Choose the appropriate access level."})]})]})};var b,f,j;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`{
  name: 'Simple API (Recommended)',
  render: () => <FormField label="Username" helperText="Your username must be unique.">
      <Input placeholder="Enter username" fullWidth />
    </FormField>
}`,...(j=(f=o.parameters)==null?void 0:f.docs)==null?void 0:j.source}}};var S,W,C;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`{
  name: 'Simple API - Required',
  render: () => <FormField label="Email" helperText="We'll never share your email." required>
      <Input type="email" placeholder="Enter email" fullWidth />
    </FormField>
}`,...(C=(W=i.parameters)==null?void 0:W.docs)==null?void 0:C.source}}};var y,v,w;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`{
  name: 'Simple API - With Description',
  render: () => <FormField label="Instance Name" description="A unique name to identify your instance" helperText="2-64 characters, letters, numbers, and hyphens" required>
      <Input placeholder="my-instance-01" fullWidth />
    </FormField>
}`,...(w=(v=a.parameters)==null?void 0:v.docs)==null?void 0:w.source}}};var I,L,E;d.parameters={...d.parameters,docs:{...(I=d.parameters)==null?void 0:I.docs,source:{originalSource:`{
  name: 'Simple API - With Error',
  render: () => <FormField label="Password" errorMessage="Password must be at least 8 characters." required error>
      <Input type="password" placeholder="Enter password" fullWidth />
    </FormField>
}`,...(E=(L=d.parameters)==null?void 0:L.docs)==null?void 0:E.source}}};var g,T,q;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:`{
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
}`,...(q=(T=t.parameters)==null?void 0:T.docs)==null?void 0:q.source}}};var P,A,H;s.parameters={...s.parameters,docs:{...(P=s.parameters)==null?void 0:P.docs,source:{originalSource:`{
  name: 'Compound API - Default',
  render: () => <FormField id="username">
      <FormField.Label>Username</FormField.Label>
      <FormField.Control>
        <Input id="username" placeholder="Enter username" fullWidth />
      </FormField.Control>
      <FormField.HelperText>Your username must be unique.</FormField.HelperText>
    </FormField>
}`,...(H=(A=s.parameters)==null?void 0:A.docs)==null?void 0:H.source}}};var D,R,k;m.parameters={...m.parameters,docs:{...(D=m.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => <FormField id="email" required>
      <FormField.Label>Email</FormField.Label>
      <FormField.Control>
        <Input id="email" type="email" placeholder="Enter email" fullWidth />
      </FormField.Control>
      <FormField.HelperText>We'll never share your email.</FormField.HelperText>
    </FormField>
}`,...(k=(R=m.parameters)==null?void 0:R.docs)==null?void 0:k.source}}};var M,z,N;n.parameters={...n.parameters,docs:{...(M=n.parameters)==null?void 0:M.docs,source:{originalSource:`{
  name: 'With Error',
  render: () => <FormField id="password" error required>
      <FormField.Label>Password</FormField.Label>
      <FormField.Control>
        <Input id="password" type="password" placeholder="Enter password" fullWidth error />
      </FormField.Control>
      <FormField.HelperText>This won't be shown when there's an error.</FormField.HelperText>
      <FormField.ErrorMessage>Password must be at least 8 characters.</FormField.ErrorMessage>
    </FormField>
}`,...(N=(z=n.parameters)==null?void 0:z.docs)==null?void 0:N.source}}};var U,J,K;c.parameters={...c.parameters,docs:{...(U=c.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => <FormField id="readonly" disabled>
      <FormField.Label>Read Only Field</FormField.Label>
      <FormField.Control>
        <Input id="readonly" value="Cannot edit this" disabled fullWidth />
      </FormField.Control>
      <FormField.HelperText>This field is disabled.</FormField.HelperText>
    </FormField>
}`,...(K=(J=c.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Y,O,B;u.parameters={...u.parameters,docs:{...(Y=u.parameters)==null?void 0:Y.docs,source:{originalSource:`{
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
}`,...(B=(O=u.parameters)==null?void 0:O.docs)==null?void 0:B.source}}};var V,_,G;p.parameters={...p.parameters,docs:{...(V=p.parameters)==null?void 0:V.docs,source:{originalSource:`{
  name: 'With Checkbox',
  render: () => <FormField id="terms" required>
      <FormField.Control>
        <Checkbox id="terms" label="I agree to the Terms of Service" description="By checking this, you agree to our terms and privacy policy." />
      </FormField.Control>
    </FormField>
}`,...(G=(_=p.parameters)==null?void 0:_.docs)==null?void 0:G.source}}};var Q,X,Z;F.parameters={...F.parameters,docs:{...(Q=F.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  name: 'Label Sizes',
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-6)] w-full">
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
}`,...(Z=(X=F.parameters)==null?void 0:X.docs)==null?void 0:Z.source}}};var $,ee,re;h.parameters={...h.parameters,docs:{...($=h.parameters)==null?void 0:$.docs,source:{originalSource:`{
  name: 'Complete Form Example',
  render: () => <div className="flex flex-col gap-[var(--primitive-spacing-6)] w-full">
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
}`,...(re=(ee=h.parameters)==null?void 0:ee.docs)==null?void 0:re.source}}};const fe=["SimpleAPI","SimpleAPIRequired","SimpleAPIWithDescription","SimpleAPIWithError","SimpleAPIWithSelect","Default","Required","WithError","Disabled","WithSelect","WithCheckbox","LabelSizes","CompleteForm"];export{h as CompleteForm,s as Default,c as Disabled,F as LabelSizes,m as Required,o as SimpleAPI,i as SimpleAPIRequired,a as SimpleAPIWithDescription,d as SimpleAPIWithError,t as SimpleAPIWithSelect,p as WithCheckbox,n as WithError,u as WithSelect,fe as __namedExportsOrder,be as default};
