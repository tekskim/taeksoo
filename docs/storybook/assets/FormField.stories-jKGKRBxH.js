import{j as e}from"./iframe-iHQO5Mqm.js";import{F as r}from"./FormField-DFckTJ7Z.js";import{I as l}from"./Input-akp5VYy4.js";import{S as f}from"./Select-DT2b_5rM.js";import{C as me}from"./Checkbox-DP42stgX.js";import{T as ue}from"./Toggle-BG3C1006.js";import"./preload-helper-C1FmrZbK.js";import"./cn-8AORBNJN.js";import"./index-HVRJ0oH1.js";import"./IconX-gJXINq1T.js";import"./createReactComponent-CEVQAvfZ.js";import"./IconChevronDown-LyXUQX2K.js";import"./IconCheck-ai78HtyZ.js";import"./IconMinus-B--iY0Bg.js";const Le={title:"Components/FormField",component:r,parameters:{layout:"centered",docs:{description:{component:"폼 필드를 구성하는 Compound Component입니다. 라벨, 컨트롤, 도움말, 에러 메시지를 조합합니다."}}},tags:["autodocs"],argTypes:{id:{control:"text",description:"필드 ID (라벨과 입력 연결)"},error:{control:"boolean",description:"에러 상태"},disabled:{control:"boolean",description:"비활성화 상태"},required:{control:"boolean",description:"필수 필드 여부"}},decorators:[ce=>e.jsx("div",{style:{width:"320px"},children:e.jsx(ce,{})})]},o={name:"Simple API (Recommended)",render:()=>e.jsx(r,{label:"Username",helperText:"Your username must be unique.",children:e.jsx(l,{placeholder:"Enter username",fullWidth:!0})})},a={name:"Simple API - Required",render:()=>e.jsx(r,{label:"Email",helperText:"We'll never share your email.",required:!0,children:e.jsx(l,{type:"email",placeholder:"Enter email",fullWidth:!0})})},i={name:"Simple API - With Description",render:()=>e.jsx(r,{label:"Instance Name",description:"A unique name to identify your instance",helperText:"2-64 characters, letters, numbers, and hyphens",required:!0,children:e.jsx(l,{placeholder:"my-instance-01",fullWidth:!0})})},s={name:"Simple API - With Error",render:()=>e.jsx(r,{label:"Password",errorMessage:"Password must be at least 8 characters.",required:!0,error:!0,children:e.jsx(l,{type:"password",placeholder:"Enter password",fullWidth:!0})})},d={name:"Simple API - With Select",render:()=>e.jsx(r,{label:"Country",helperText:"Select your country of residence.",required:!0,children:e.jsx(f,{placeholder:"Select a country",fullWidth:!0,options:[{value:"kr",label:"South Korea"},{value:"us",label:"United States"},{value:"jp",label:"Japan"}]})})},t={name:"Compound API - Default",render:()=>e.jsxs(r,{id:"username",children:[e.jsx(r.Label,{children:"Username"}),e.jsx(r.Control,{children:e.jsx(l,{id:"username",placeholder:"Enter username",fullWidth:!0})}),e.jsx(r.HelperText,{children:"Your username must be unique."})]})},n={render:()=>e.jsxs(r,{id:"email",required:!0,children:[e.jsx(r.Label,{children:"Email"}),e.jsx(r.Control,{children:e.jsx(l,{id:"email",type:"email",placeholder:"Enter email",fullWidth:!0})}),e.jsx(r.HelperText,{children:"We'll never share your email."})]})},m={name:"With Error",render:()=>e.jsxs(r,{id:"password",error:!0,required:!0,children:[e.jsx(r.Label,{children:"Password"}),e.jsx(r.Control,{children:e.jsx(l,{id:"password",type:"password",placeholder:"Enter password",fullWidth:!0,error:!0})}),e.jsx(r.HelperText,{children:"This won't be shown when there's an error."}),e.jsx(r.ErrorMessage,{children:"Password must be at least 8 characters."})]})},c={render:()=>e.jsxs(r,{id:"readonly",disabled:!0,children:[e.jsx(r.Label,{children:"Read Only Field"}),e.jsx(r.Control,{children:e.jsx(l,{id:"readonly",value:"Cannot edit this",disabled:!0,fullWidth:!0})}),e.jsx(r.HelperText,{children:"This field is disabled."})]})},u={name:"With Select",render:()=>e.jsxs(r,{id:"country",required:!0,children:[e.jsx(r.Label,{children:"Country"}),e.jsx(r.Control,{children:e.jsx(f,{id:"country",placeholder:"Select a country",fullWidth:!0,options:[{value:"kr",label:"South Korea"},{value:"us",label:"United States"},{value:"jp",label:"Japan"},{value:"cn",label:"China"}]})}),e.jsx(r.HelperText,{children:"Select your country of residence."})]})},p={name:"With Checkbox",render:()=>e.jsx(r,{id:"terms",required:!0,children:e.jsx(r.Control,{children:e.jsx(me,{id:"terms",label:"I agree to the Terms of Service",description:"By checking this, you agree to our terms and privacy policy."})})})},F={name:"Label Sizes",render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-6)] w-full",children:[e.jsxs(r,{id:"small-label",children:[e.jsx(r.Label,{size:"sm",children:"Small Label"}),e.jsx(r.Control,{children:e.jsx(l,{id:"small-label",placeholder:"With small label",fullWidth:!0})})]}),e.jsxs(r,{id:"medium-label",children:[e.jsx(r.Label,{size:"md",children:"Medium Label (Default)"}),e.jsx(r.Control,{children:e.jsx(l,{id:"medium-label",placeholder:"With medium label",fullWidth:!0})})]})]})},h={name:"Complete Form Example",render:()=>e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-6)] w-full",children:[e.jsxs(r,{id:"form-name",required:!0,children:[e.jsx(r.Label,{children:"Full Name"}),e.jsx(r.Control,{children:e.jsx(l,{id:"form-name",placeholder:"John Doe",fullWidth:!0})})]}),e.jsxs(r,{id:"form-email",required:!0,children:[e.jsx(r.Label,{children:"Email Address"}),e.jsx(r.Control,{children:e.jsx(l,{id:"form-email",type:"email",placeholder:"john@example.com",fullWidth:!0})}),e.jsx(r.HelperText,{children:"We'll send a confirmation to this email."})]}),e.jsxs(r,{id:"form-password",required:!0,error:!0,children:[e.jsx(r.Label,{children:"Password"}),e.jsx(r.Control,{children:e.jsx(l,{id:"form-password",type:"password",placeholder:"••••••••",fullWidth:!0,error:!0})}),e.jsx(r.ErrorMessage,{children:"Password must contain at least one number."})]}),e.jsxs(r,{id:"form-role",children:[e.jsx(r.Label,{children:"Role"}),e.jsx(r.Control,{children:e.jsx(f,{id:"form-role",placeholder:"Select role",fullWidth:!0,options:[{value:"admin",label:"Administrator"},{value:"editor",label:"Editor"},{value:"viewer",label:"Viewer"}]})}),e.jsx(r.HelperText,{children:"Choose the appropriate access level."})]})]})},x={name:'spacing="loose" - Checkbox',render:()=>e.jsx(r,{label:"Favorite",spacing:"loose",children:e.jsx(me,{label:"Mark as Favorite"})})},b={name:'spacing="loose" - Toggle',render:()=>e.jsx(r,{label:"Enable notifications",spacing:"loose",children:e.jsx(ue,{})})};var j,S,C;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
  name: 'Simple API (Recommended)',
  render: () => <FormField label="Username" helperText="Your username must be unique.">
      <Input placeholder="Enter username" fullWidth />
    </FormField>
}`,...(C=(S=o.parameters)==null?void 0:S.docs)==null?void 0:C.source}}};var W,g,y;a.parameters={...a.parameters,docs:{...(W=a.parameters)==null?void 0:W.docs,source:{originalSource:`{
  name: 'Simple API - Required',
  render: () => <FormField label="Email" helperText="We'll never share your email." required>
      <Input type="email" placeholder="Enter email" fullWidth />
    </FormField>
}`,...(y=(g=a.parameters)==null?void 0:g.docs)==null?void 0:y.source}}};var v,w,L;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
  name: 'Simple API - With Description',
  render: () => <FormField label="Instance Name" description="A unique name to identify your instance" helperText="2-64 characters, letters, numbers, and hyphens" required>
      <Input placeholder="my-instance-01" fullWidth />
    </FormField>
}`,...(L=(w=i.parameters)==null?void 0:w.docs)==null?void 0:L.source}}};var T,I,E;s.parameters={...s.parameters,docs:{...(T=s.parameters)==null?void 0:T.docs,source:{originalSource:`{
  name: 'Simple API - With Error',
  render: () => <FormField label="Password" errorMessage="Password must be at least 8 characters." required error>
      <Input type="password" placeholder="Enter password" fullWidth />
    </FormField>
}`,...(E=(I=s.parameters)==null?void 0:I.docs)==null?void 0:E.source}}};var q,P,A;d.parameters={...d.parameters,docs:{...(q=d.parameters)==null?void 0:q.docs,source:{originalSource:`{
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
}`,...(A=(P=d.parameters)==null?void 0:P.docs)==null?void 0:A.source}}};var H,k,D;t.parameters={...t.parameters,docs:{...(H=t.parameters)==null?void 0:H.docs,source:{originalSource:`{
  name: 'Compound API - Default',
  render: () => <FormField id="username">
      <FormField.Label>Username</FormField.Label>
      <FormField.Control>
        <Input id="username" placeholder="Enter username" fullWidth />
      </FormField.Control>
      <FormField.HelperText>Your username must be unique.</FormField.HelperText>
    </FormField>
}`,...(D=(k=t.parameters)==null?void 0:k.docs)==null?void 0:D.source}}};var R,M,z;n.parameters={...n.parameters,docs:{...(R=n.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => <FormField id="email" required>
      <FormField.Label>Email</FormField.Label>
      <FormField.Control>
        <Input id="email" type="email" placeholder="Enter email" fullWidth />
      </FormField.Control>
      <FormField.HelperText>We'll never share your email.</FormField.HelperText>
    </FormField>
}`,...(z=(M=n.parameters)==null?void 0:M.docs)==null?void 0:z.source}}};var N,U,J;m.parameters={...m.parameters,docs:{...(N=m.parameters)==null?void 0:N.docs,source:{originalSource:`{
  name: 'With Error',
  render: () => <FormField id="password" error required>
      <FormField.Label>Password</FormField.Label>
      <FormField.Control>
        <Input id="password" type="password" placeholder="Enter password" fullWidth error />
      </FormField.Control>
      <FormField.HelperText>This won't be shown when there's an error.</FormField.HelperText>
      <FormField.ErrorMessage>Password must be at least 8 characters.</FormField.ErrorMessage>
    </FormField>
}`,...(J=(U=m.parameters)==null?void 0:U.docs)==null?void 0:J.source}}};var K,Y,O;c.parameters={...c.parameters,docs:{...(K=c.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => <FormField id="readonly" disabled>
      <FormField.Label>Read Only Field</FormField.Label>
      <FormField.Control>
        <Input id="readonly" value="Cannot edit this" disabled fullWidth />
      </FormField.Control>
      <FormField.HelperText>This field is disabled.</FormField.HelperText>
    </FormField>
}`,...(O=(Y=c.parameters)==null?void 0:Y.docs)==null?void 0:O.source}}};var B,V,_;u.parameters={...u.parameters,docs:{...(B=u.parameters)==null?void 0:B.docs,source:{originalSource:`{
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
}`,...(_=(V=u.parameters)==null?void 0:V.docs)==null?void 0:_.source}}};var G,Q,X;p.parameters={...p.parameters,docs:{...(G=p.parameters)==null?void 0:G.docs,source:{originalSource:`{
  name: 'With Checkbox',
  render: () => <FormField id="terms" required>
      <FormField.Control>
        <Checkbox id="terms" label="I agree to the Terms of Service" description="By checking this, you agree to our terms and privacy policy." />
      </FormField.Control>
    </FormField>
}`,...(X=(Q=p.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Z,$,ee;F.parameters={...F.parameters,docs:{...(Z=F.parameters)==null?void 0:Z.docs,source:{originalSource:`{
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
}`,...(ee=($=F.parameters)==null?void 0:$.docs)==null?void 0:ee.source}}};var re,le,oe;h.parameters={...h.parameters,docs:{...(re=h.parameters)==null?void 0:re.docs,source:{originalSource:`{
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
}`,...(oe=(le=h.parameters)==null?void 0:le.docs)==null?void 0:oe.source}}};var ae,ie,se;x.parameters={...x.parameters,docs:{...(ae=x.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  name: 'spacing="loose" - Checkbox',
  render: () => <FormField label="Favorite" spacing="loose">
      <Checkbox label="Mark as Favorite" />
    </FormField>
}`,...(se=(ie=x.parameters)==null?void 0:ie.docs)==null?void 0:se.source}}};var de,te,ne;b.parameters={...b.parameters,docs:{...(de=b.parameters)==null?void 0:de.docs,source:{originalSource:`{
  name: 'spacing="loose" - Toggle',
  render: () => <FormField label="Enable notifications" spacing="loose">
      <Toggle />
    </FormField>
}`,...(ne=(te=b.parameters)==null?void 0:te.docs)==null?void 0:ne.source}}};const Te=["SimpleAPI","SimpleAPIRequired","SimpleAPIWithDescription","SimpleAPIWithError","SimpleAPIWithSelect","Default","Required","WithError","Disabled","WithSelect","WithCheckbox","LabelSizes","CompleteForm","SpacingLooseCheckbox","SpacingLooseToggle"];export{h as CompleteForm,t as Default,c as Disabled,F as LabelSizes,n as Required,o as SimpleAPI,a as SimpleAPIRequired,i as SimpleAPIWithDescription,s as SimpleAPIWithError,d as SimpleAPIWithSelect,x as SpacingLooseCheckbox,b as SpacingLooseToggle,p as WithCheckbox,m as WithError,u as WithSelect,Te as __namedExportsOrder,Le as default};
