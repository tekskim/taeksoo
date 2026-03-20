import{R as J,j as e}from"./iframe-ko1KmZFS.js";import{P as r}from"./Popover-Y_VPBY45.js";import{H as o,V as h}from"./Stack-Dh9f_Si_.js";import{B as t}from"./Button-BQge8bfe.js";import{I as K}from"./IconInfoCircle-C6wpCG9m.js";import{F as X}from"./FormField-DcMJW5cN.js";import{I as Y}from"./Input-DcP-cChA.js";import{I as Z}from"./IconUser-B7ivFMTQ.js";import{I as $}from"./IconSettings-R0QLs4Fv.js";import{I as ee}from"./IconLogout-CxL0C_Iz.js";import"./preload-helper-C1FmrZbK.js";import"./index-ChYZSdsP.js";import"./cn-BMXv33oC.js";import"./createReactComponent-B-brzlrB.js";const ue={title:"Components/Popover",component:r,parameters:{layout:"centered",docs:{description:{component:`
Popover는 Tooltip의 확장형으로, 인터랙티브한 콘텐츠를 표시하는 오버레이 컴포넌트입니다.

**Tooltip과의 차이점:**
- **Tooltip**: 텍스트만, 비인터랙티브, hover 전용
- **Popover**: 인터랙티브 콘텐츠 (폼, 메뉴, 버튼), click/hover 지원

**디자인 토큰:**
- Background: \`var(--color-surface-default)\`
- Border: \`var(--color-border-default)\`, 1px
- Radius: \`var(--primitive-radius-lg)\` (8px)
- Shadow: \`shadow-lg\`
- Arrow: double-triangle border technique (7px outer / 6px inner)
        `}}},tags:["autodocs"],argTypes:{position:{control:"select",options:["top","bottom","left","right"],description:"Position relative to the trigger element"},trigger:{control:"select",options:["hover","click"],description:"How to trigger the popover (click or hover)"},showArrow:{control:"boolean",description:"Show the arrow indicator"},disabled:{control:"boolean",description:"Disable the popover"},delay:{control:"number",description:"Delay before showing (ms) - hover trigger only"},hideDelay:{control:"number",description:"Delay before hiding (ms) - hover trigger only"}}},s={args:{content:e.jsx("div",{className:"p-[var(--primitive-spacing-4)]",children:e.jsx("p",{className:"text-body-md text-[var(--color-text-default)]",children:"This is a popover with interactive content."})}),children:e.jsx(t,{variant:"secondary",children:"Click me"}),trigger:"click",position:"bottom"}},n={args:{content:e.jsx("div",{className:"p-[var(--primitive-spacing-3)]",children:e.jsx("p",{className:"text-body-sm text-[var(--color-text-muted)]",children:"Hover to see more information"})}),children:e.jsx(t,{variant:"ghost",children:"Hover me"}),trigger:"hover",position:"top"}},c={render:()=>e.jsx(r,{trigger:"click",position:"bottom",content:e.jsxs(h,{gap:1,className:"p-[var(--primitive-spacing-2)] min-w-[160px]",children:[e.jsxs("button",{className:"flex items-center gap-[var(--primitive-spacing-2)] px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)] hover:bg-[var(--color-surface-hover)] rounded-[var(--primitive-radius-sm)] w-full text-left",children:[e.jsx(Z,{size:16}),"Profile"]}),e.jsxs("button",{className:"flex items-center gap-[var(--primitive-spacing-2)] px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)] hover:bg-[var(--color-surface-hover)] rounded-[var(--primitive-radius-sm)] w-full text-left",children:[e.jsx($,{size:16}),"Settings"]}),e.jsx("div",{className:"w-full h-px bg-[var(--color-border-subtle)] my-[var(--primitive-spacing-1)]"}),e.jsxs("button",{className:"flex items-center gap-[var(--primitive-spacing-2)] px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md text-[var(--color-state-danger)] hover:bg-[var(--color-state-danger-bg)] rounded-[var(--primitive-radius-sm)] w-full text-left",children:[e.jsx(ee,{size:16}),"Logout"]})]}),children:e.jsx(t,{variant:"secondary",children:"User Menu"})})},l={render:()=>e.jsx(o,{gap:4,children:["top","bottom","left","right"].map(a=>e.jsx(r,{trigger:"click",position:a,content:e.jsx("div",{className:"p-[var(--primitive-spacing-3)]",children:e.jsxs("p",{className:"text-body-md text-[var(--color-text-default)]",children:["Position: ",a]})}),children:e.jsx(t,{variant:"outline",children:a})},a))})},p={args:{content:e.jsx("div",{className:"p-[var(--primitive-spacing-4)]",children:e.jsx("p",{className:"text-body-md text-[var(--color-text-default)]",children:"Popover without arrow"})}),children:e.jsx(t,{variant:"secondary",children:"No Arrow"}),showArrow:!1,trigger:"click"}},d={render:()=>e.jsx(r,{trigger:"click",position:"bottom",content:e.jsxs(h,{gap:3,className:"p-[var(--primitive-spacing-4)] w-[280px]",children:[e.jsx("h4",{className:"text-heading-h6 text-[var(--color-text-default)]",children:"Quick Settings"}),e.jsxs("div",{children:[e.jsx("label",{className:"text-label-sm text-[var(--color-text-muted)] block mb-[var(--primitive-spacing-1)]",children:"Display Name"}),e.jsx("input",{type:"text",className:"w-full px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md border border-[var(--color-border-default)] rounded-[var(--primitive-radius-sm)] bg-[var(--color-surface-default)]",placeholder:"Enter name"})]}),e.jsxs(o,{gap:2,className:"w-full",children:[e.jsx(t,{variant:"secondary",size:"sm",className:"flex-1",children:"Cancel"}),e.jsx(t,{variant:"primary",size:"sm",className:"flex-1",children:"Save"})]})]}),children:e.jsx(t,{variant:"primary",children:"Open Form"})})},m={render:function(){const[i,g]=J.useState(!1);return e.jsxs(o,{gap:4,children:[e.jsx(r,{trigger:"click",isOpen:i,onOpenChange:g,content:e.jsxs("div",{className:"p-[var(--primitive-spacing-4)]",children:[e.jsxs("p",{className:"text-body-md text-[var(--color-text-default)]",children:["Controlled popover state: ",i?"Open":"Closed"]}),e.jsx(t,{variant:"secondary",size:"sm",className:"mt-[var(--primitive-spacing-2)]",onClick:()=>g(!1),children:"Close"})]}),children:e.jsx(t,{variant:"secondary",children:"Controlled"})}),e.jsxs(t,{variant:"outline",onClick:()=>g(!i),children:["Toggle: ",i?"Open":"Closed"]})]})}},v={args:{content:e.jsx("div",{className:"p-[var(--primitive-spacing-3)]",children:e.jsx("p",{className:"text-body-md",children:"This won't show"})}),children:e.jsx(t,{variant:"secondary",disabled:!0,children:"Disabled"}),disabled:!0,trigger:"click"}},x={render:()=>e.jsx(r,{trigger:"click",position:"bottom",content:e.jsxs(h,{gap:3,className:"p-[var(--primitive-spacing-4)] w-[280px]",children:[e.jsx("h4",{className:"text-heading-h6 text-[var(--color-text-default)]",children:"Quick Settings"}),e.jsx(X,{label:"Display Name",helperText:"2-64 characters",children:e.jsx(Y,{placeholder:"Enter name",fullWidth:!0})}),e.jsxs(o,{gap:2,className:"w-full",children:[e.jsx(t,{variant:"secondary",size:"sm",className:"flex-1",children:"Cancel"}),e.jsx(t,{variant:"primary",size:"sm",className:"flex-1",children:"Save"})]})]}),children:e.jsx(t,{variant:"primary",children:"Open Form"})})},u={render:()=>e.jsxs(o,{gap:2,align:"center",children:[e.jsx("span",{className:"text-body-md text-[var(--color-text-default)]",children:"Instance Type"}),e.jsx(r,{trigger:"hover",position:"top",content:e.jsx("div",{className:"p-3 max-w-[240px]",children:e.jsx("p",{className:"text-body-sm text-[var(--color-text-muted)]",children:"인스턴스 타입은 생성 후 변경할 수 없습니다. 신중하게 선택해 주세요."})}),children:e.jsx("button",{className:"text-[var(--color-text-subtle)] hover:text-[var(--color-text-muted)]",children:e.jsx(K,{size:14})})})]})};var b,f,N;s.parameters={...s.parameters,docs:{...(b=s.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    content: <div className="p-[var(--primitive-spacing-4)]">
        <p className="text-body-md text-[var(--color-text-default)]">
          This is a popover with interactive content.
        </p>
      </div>,
    children: <Button variant="secondary">Click me</Button>,
    trigger: 'click',
    position: 'bottom'
  }
}`,...(N=(f=s.parameters)==null?void 0:f.docs)==null?void 0:N.source}}};var y,j,k;n.parameters={...n.parameters,docs:{...(y=n.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    content: <div className="p-[var(--primitive-spacing-3)]">
        <p className="text-body-sm text-[var(--color-text-muted)]">Hover to see more information</p>
      </div>,
    children: <Button variant="ghost">Hover me</Button>,
    trigger: 'hover',
    position: 'top'
  }
}`,...(k=(j=n.parameters)==null?void 0:j.docs)==null?void 0:k.source}}};var w,S,B;c.parameters={...c.parameters,docs:{...(w=c.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <Popover trigger="click" position="bottom" content={<VStack gap={1} className="p-[var(--primitive-spacing-2)] min-w-[160px]">
          <button className="flex items-center gap-[var(--primitive-spacing-2)] px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)] hover:bg-[var(--color-surface-hover)] rounded-[var(--primitive-radius-sm)] w-full text-left">
            <IconUser size={16} />
            Profile
          </button>
          <button className="flex items-center gap-[var(--primitive-spacing-2)] px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md text-[var(--color-text-default)] hover:bg-[var(--color-surface-hover)] rounded-[var(--primitive-radius-sm)] w-full text-left">
            <IconSettings size={16} />
            Settings
          </button>
          <div className="w-full h-px bg-[var(--color-border-subtle)] my-[var(--primitive-spacing-1)]" />
          <button className="flex items-center gap-[var(--primitive-spacing-2)] px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md text-[var(--color-state-danger)] hover:bg-[var(--color-state-danger-bg)] rounded-[var(--primitive-radius-sm)] w-full text-left">
            <IconLogout size={16} />
            Logout
          </button>
        </VStack>}>
      <Button variant="secondary">User Menu</Button>
    </Popover>
}`,...(B=(S=c.parameters)==null?void 0:S.docs)==null?void 0:B.source}}};var P,C,I;l.parameters={...l.parameters,docs:{...(P=l.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <HStack gap={4}>
      {(['top', 'bottom', 'left', 'right'] as const).map(position => <Popover key={position} trigger="click" position={position} content={<div className="p-[var(--primitive-spacing-3)]">
              <p className="text-body-md text-[var(--color-text-default)]">Position: {position}</p>
            </div>}>
          <Button variant="outline">{position}</Button>
        </Popover>)}
    </HStack>
}`,...(I=(C=l.parameters)==null?void 0:C.docs)==null?void 0:I.source}}};var O,H,z;p.parameters={...p.parameters,docs:{...(O=p.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    content: <div className="p-[var(--primitive-spacing-4)]">
        <p className="text-body-md text-[var(--color-text-default)]">Popover without arrow</p>
      </div>,
    children: <Button variant="secondary">No Arrow</Button>,
    showArrow: false,
    trigger: 'click'
  }
}`,...(z=(H=p.parameters)==null?void 0:H.docs)==null?void 0:z.source}}};var F,T,D;d.parameters={...d.parameters,docs:{...(F=d.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <Popover trigger="click" position="bottom" content={<VStack gap={3} className="p-[var(--primitive-spacing-4)] w-[280px]">
          <h4 className="text-heading-h6 text-[var(--color-text-default)]">Quick Settings</h4>
          <div>
            <label className="text-label-sm text-[var(--color-text-muted)] block mb-[var(--primitive-spacing-1)]">
              Display Name
            </label>
            <input type="text" className="w-full px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] text-body-md border border-[var(--color-border-default)] rounded-[var(--primitive-radius-sm)] bg-[var(--color-surface-default)]" placeholder="Enter name" />
          </div>
          <HStack gap={2} className="w-full">
            <Button variant="secondary" size="sm" className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" size="sm" className="flex-1">
              Save
            </Button>
          </HStack>
        </VStack>}>
      <Button variant="primary">Open Form</Button>
    </Popover>
}`,...(D=(T=d.parameters)==null?void 0:T.docs)==null?void 0:D.source}}};var A,V,W;m.parameters={...m.parameters,docs:{...(A=m.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: function ControlledPopover() {
    const [isOpen, setIsOpen] = React.useState(false);
    return <HStack gap={4}>
        <Popover trigger="click" isOpen={isOpen} onOpenChange={setIsOpen} content={<div className="p-[var(--primitive-spacing-4)]">
              <p className="text-body-md text-[var(--color-text-default)]">
                Controlled popover state: {isOpen ? 'Open' : 'Closed'}
              </p>
              <Button variant="secondary" size="sm" className="mt-[var(--primitive-spacing-2)]" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>}>
          <Button variant="secondary">Controlled</Button>
        </Popover>
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
          Toggle: {isOpen ? 'Open' : 'Closed'}
        </Button>
      </HStack>;
  }
}`,...(W=(V=m.parameters)==null?void 0:V.docs)==null?void 0:W.source}}};var E,R,L;v.parameters={...v.parameters,docs:{...(E=v.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    content: <div className="p-[var(--primitive-spacing-3)]">
        <p className="text-body-md">This won't show</p>
      </div>,
    children: <Button variant="secondary" disabled>
        Disabled
      </Button>,
    disabled: true,
    trigger: 'click'
  }
}`,...(L=(R=v.parameters)==null?void 0:R.docs)==null?void 0:L.source}}};var M,Q,U;x.parameters={...x.parameters,docs:{...(M=x.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <Popover trigger="click" position="bottom" content={<VStack gap={3} className="p-[var(--primitive-spacing-4)] w-[280px]">
          <h4 className="text-heading-h6 text-[var(--color-text-default)]">Quick Settings</h4>
          <FormField label="Display Name" helperText="2-64 characters">
            <Input placeholder="Enter name" fullWidth />
          </FormField>
          <HStack gap={2} className="w-full">
            <Button variant="secondary" size="sm" className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" size="sm" className="flex-1">
              Save
            </Button>
          </HStack>
        </VStack>}>
      <Button variant="primary">Open Form</Button>
    </Popover>
}`,...(U=(Q=x.parameters)==null?void 0:Q.docs)==null?void 0:U.source}}};var _,q,G;u.parameters={...u.parameters,docs:{...(_=u.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => <HStack gap={2} align="center">
      <span className="text-body-md text-[var(--color-text-default)]">Instance Type</span>
      <Popover trigger="hover" position="top" content={<div className="p-3 max-w-[240px]">
            <p className="text-body-sm text-[var(--color-text-muted)]">
              인스턴스 타입은 생성 후 변경할 수 없습니다. 신중하게 선택해 주세요.
            </p>
          </div>}>
        <button className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-muted)]">
          <IconInfoCircle size={14} />
        </button>
      </Popover>
    </HStack>
}`,...(G=(q=u.parameters)==null?void 0:q.docs)==null?void 0:G.source}}};const ge=["Default","HoverTrigger","WithMenu","Positions","NoArrow","WithForm","Controlled","Disabled","WithFormField","InfoPopover"];export{m as Controlled,s as Default,v as Disabled,n as HoverTrigger,u as InfoPopover,p as NoArrow,l as Positions,d as WithForm,x as WithFormField,c as WithMenu,ge as __namedExportsOrder,ue as default};
