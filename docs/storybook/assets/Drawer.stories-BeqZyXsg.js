import{r as n,j as e}from"./iframe-iHQO5Mqm.js";import{r as ie}from"./index-HVRJ0oH1.js";import{t as k}from"./cn-8AORBNJN.js";import{u as oe}from"./useFocusTrap-BM0o1Cwx.js";import{B as a}from"./Button-9zQlOYxA.js";import{F as i}from"./FormField-DFckTJ7Z.js";import{I as o}from"./Input-akp5VYy4.js";import{S as ce}from"./Select-DT2b_5rM.js";import{T as y}from"./Toggle-BG3C1006.js";import"./preload-helper-C1FmrZbK.js";import"./IconX-gJXINq1T.js";import"./createReactComponent-CEVQAvfZ.js";import"./IconChevronDown-LyXUQX2K.js";import"./IconCheck-ai78HtyZ.js";function l({isOpen:s,onClose:r,title:t,description:d,side:c="right",width:b=320,showCloseButton:de,closeOnBackdropClick:Z=!0,closeOnEscape:O=!0,children:ee,footer:N,className:te}){const[re,C]=n.useState(s),[D,F]=n.useState(!1),ae=oe(s);n.useEffect(()=>{if(s)C(!0),requestAnimationFrame(()=>{requestAnimationFrame(()=>{F(!0)})});else{F(!1);const j=setTimeout(()=>{C(!1)},300);return()=>clearTimeout(j)}},[s]);const w=n.useCallback(j=>{O&&j.key==="Escape"&&r()},[O,r]);if(n.useEffect(()=>(s&&(document.addEventListener("keydown",w),document.body.style.overflow="hidden"),()=>{document.removeEventListener("keydown",w),document.body.style.overflow=""}),[s,w]),!re)return null;const se=typeof b=="number"?`${b}px`:b,ne=k("fixed inset-0 z-[var(--z-modal)]","bg-black/60","transition-opacity duration-300 ease-out",D?"opacity-100":"opacity-0"),le=k("fixed top-0 bottom-0 z-[var(--z-modal)]","bg-[var(--color-surface-default)]","flex flex-col","shadow-2xl","transition-transform duration-300 ease-out",c==="right"?"right-0":"left-0",D?"translate-x-0":c==="right"?"translate-x-full":"-translate-x-full",te);return ie.createPortal(e.jsxs(e.Fragment,{children:[e.jsx("div",{className:ne,onClick:Z?r:void 0,"aria-hidden":"true"}),e.jsxs("aside",{"data-figma-name":"Drawer",ref:ae,className:le,style:{width:se},role:"dialog","aria-modal":"true","aria-labelledby":t?"drawer-title":void 0,children:[e.jsxs("div",{className:"flex-1 px-6 pt-4 pb-8 drawer-scroll",children:[t&&e.jsxs(e.Fragment,{children:[e.jsx("h2",{id:"drawer-title",className:"text-heading-h5 text-[var(--color-text-default)]",children:t}),d&&e.jsx("p",{className:"text-body-md text-[var(--color-text-subtle)] mt-1 mb-4",children:d}),!d&&e.jsx("div",{className:"mb-4"})]}),ee]}),N&&e.jsx("div",{className:"border-t border-[var(--color-border-default)] px-6 py-4 overflow-visible",children:N})]})]}),document.body)}const Ce={title:"Components/Drawer",component:l,tags:["autodocs"],parameters:{docs:{description:{component:`
## Drawer 컴포넌트

화면 측면에서 슬라이드되어 나타나는 패널 컴포넌트입니다.

### 사용 시기
- 상세 정보 표시
- 설정/편집 폼
- 네비게이션 메뉴 (모바일)
- 필터 패널

### Modal vs Drawer
| | Modal | Drawer |
|---|---|---|
| **위치** | 화면 중앙 | 측면 (좌/우) |
| **크기** | 고정 또는 반응형 | 높이 100% |
| **사용 시점** | 중요한 결정 | 상세 정보, 폼 |
| **배경** | 어두운 오버레이 | 어두운 오버레이 |

### 접근성
- ESC 키로 닫기 지원
- 포커스 트랩 (Drawer 내에서만 Tab 이동)
- aria-modal, role="dialog" 자동 적용
- ESC 키, 배경 클릭으로 닫기 지원 (Close 버튼은 제거됨)

### 예시
\`\`\`tsx
import { Drawer } from '@thaki/tds';

<Drawer
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="설정"
  side="right"
  width={400}
  footer={
    <Button onClick={handleSave}>저장</Button>
  }
>
  <p>Drawer 내용</p>
</Drawer>
\`\`\`
        `}}},argTypes:{isOpen:{control:"boolean",description:"Drawer 열림 상태",table:{type:{summary:"boolean"}}},title:{control:"text",description:"Drawer 헤더 제목",table:{type:{summary:"string"}}},side:{control:"select",options:["left","right"],description:"Drawer 표시 위치",table:{type:{summary:'"left" | "right"'},defaultValue:{summary:'"right"'}}},width:{control:"number",description:"Drawer 너비 (px)",table:{type:{summary:"number"},defaultValue:{summary:"320"}}},showCloseButton:{control:"boolean",description:"@deprecated Close 버튼이 제거되어 이 prop은 무시됩니다.",table:{type:{summary:"boolean"},defaultValue:{summary:"true"}}},closeOnBackdropClick:{control:"boolean",description:"배경 클릭시 닫기 여부",table:{type:{summary:"boolean"},defaultValue:{summary:"true"}}},closeOnEscape:{control:"boolean",description:"ESC 키로 닫기 여부",table:{type:{summary:"boolean"},defaultValue:{summary:"true"}}},footer:{description:"Drawer 하단 고정 영역 (버튼 등)",table:{type:{summary:"ReactNode"}}}}},p={render:function(){const[r,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(a,{onClick:()=>t(!0),children:"Open Drawer"}),e.jsx(l,{isOpen:r,onClose:()=>t(!1),title:"Drawer Title",children:e.jsx("p",{className:"text-body-md text-[var(--color-text-muted)]",children:"This is the drawer content. You can put any content here."})})]})}},m={render:function(){const[r,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(a,{onClick:()=>t(!0),children:"Open Left Drawer"}),e.jsx(l,{isOpen:r,onClose:()=>t(!1),title:"Navigation",side:"left",width:280,children:e.jsxs("nav",{className:"flex flex-col gap-[var(--primitive-spacing-2)]",children:[e.jsx("a",{href:"#",className:"px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] rounded hover:bg-[var(--color-surface-subtle)]",children:"Dashboard"}),e.jsx("a",{href:"#",className:"px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] rounded hover:bg-[var(--color-surface-subtle)]",children:"Projects"}),e.jsx("a",{href:"#",className:"px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] rounded hover:bg-[var(--color-surface-subtle)]",children:"Settings"})]})})]})}},u={render:function(){const[r,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(a,{onClick:()=>t(!0),children:"Open Drawer with Footer"}),e.jsx(l,{isOpen:r,onClose:()=>t(!1),title:"Edit Item",footer:e.jsxs("div",{className:"flex gap-[var(--primitive-spacing-2)] justify-end",children:[e.jsx(a,{variant:"secondary",onClick:()=>t(!1),children:"Cancel"}),e.jsx(a,{onClick:()=>t(!1),children:"Save Changes"})]}),children:e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx(i,{label:"Name",children:e.jsx(o,{placeholder:"Enter name",fullWidth:!0})}),e.jsx(i,{label:"Description",children:e.jsx(o,{placeholder:"Enter description",fullWidth:!0})})]})})]})}},f={render:function(){const[r,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(a,{onClick:()=>t(!0),children:"Edit Settings"}),e.jsx(l,{isOpen:r,onClose:()=>t(!1),title:"Instance Settings",width:400,footer:e.jsxs("div",{className:"flex gap-[var(--primitive-spacing-2)] justify-end",children:[e.jsx(a,{variant:"secondary",onClick:()=>t(!1),children:"Cancel"}),e.jsx(a,{onClick:()=>t(!1),children:"Save"})]}),children:e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-6)]",children:[e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx("h3",{className:"text-label-lg text-[var(--color-text-default)]",children:"General"}),e.jsx(i,{label:"Instance Name",children:e.jsx(o,{defaultValue:"my-instance-01",fullWidth:!0})}),e.jsx(i,{label:"Region",children:e.jsx(ce,{options:[{value:"us-east",label:"US East"},{value:"us-west",label:"US West"},{value:"eu-west",label:"EU West"}],defaultValue:"us-east",fullWidth:!0})})]}),e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx("h3",{className:"text-label-lg text-[var(--color-text-default)]",children:"Features"}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-body-md text-[var(--color-text-default)]",children:"Auto-scaling"}),e.jsx(y,{defaultChecked:!0})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-body-md text-[var(--color-text-default)]",children:"Monitoring"}),e.jsx(y,{defaultChecked:!0})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-body-md text-[var(--color-text-default)]",children:"Backup"}),e.jsx(y,{})]})]})]})})]})}},x={render:function(){const[r,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(a,{onClick:()=>t(!0),children:"Open Wide Drawer"}),e.jsx(l,{isOpen:r,onClose:()=>t(!1),title:"Detailed View",width:600,children:e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx("p",{className:"text-body-md text-[var(--color-text-muted)]",children:"This drawer is wider than the default to accommodate more content."}),e.jsxs("div",{className:"grid grid-cols-2 gap-[var(--primitive-spacing-4)]",children:[e.jsx(i,{label:"First Name",children:e.jsx(o,{placeholder:"John",fullWidth:!0})}),e.jsx(i,{label:"Last Name",children:e.jsx(o,{placeholder:"Doe",fullWidth:!0})}),e.jsx(i,{label:"Email",children:e.jsx(o,{placeholder:"john@example.com",fullWidth:!0})}),e.jsx(i,{label:"Phone",children:e.jsx(o,{placeholder:"+1 234 567 890",fullWidth:!0})})]})]})})]})}},h={render:function(){const[r,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(a,{onClick:()=>t(!0),children:"Open Protected Drawer"}),e.jsx(l,{isOpen:r,onClose:()=>t(!1),title:"Important Form",closeOnBackdropClick:!1,closeOnEscape:!1,footer:e.jsxs("div",{className:"flex gap-[var(--primitive-spacing-2)] justify-end",children:[e.jsx(a,{variant:"secondary",onClick:()=>t(!1),children:"Discard"}),e.jsx(a,{onClick:()=>t(!1),children:"Save"})]}),children:e.jsx("p",{className:"text-body-md text-[var(--color-text-muted)]",children:"This drawer can only be closed by clicking the buttons. Clicking the backdrop or pressing ESC won't close it."})})]})}},v={render:function(){const[r,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(a,{onClick:()=>t(!0),children:"Open Drawer"}),e.jsx(l,{isOpen:r,onClose:()=>t(!1),children:e.jsxs("div",{className:"text-center py-[var(--primitive-spacing-8)]",children:[e.jsx("h2",{className:"text-heading-h5 mb-[var(--primitive-spacing-2)]",children:"Custom Header"}),e.jsx("p",{className:"text-body-md text-[var(--color-text-muted)]",children:"This drawer doesn't have a built-in title"})]})})]})}},g={render:function(){const[r,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(a,{onClick:()=>t(!0),children:"Open Scrollable Drawer"}),e.jsx(l,{isOpen:r,onClose:()=>t(!1),title:"Long Content",footer:e.jsx(a,{onClick:()=>t(!1),fullWidth:!0,children:"Close"}),children:e.jsx("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:Array.from({length:20},(d,c)=>e.jsxs("div",{className:"p-[var(--primitive-spacing-4)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)]",children:[e.jsxs("h3",{className:"text-label-lg",children:["Item ",c+1]}),e.jsxs("p",{className:"text-body-md text-[var(--color-text-muted)]",children:["This is the description for item ",c+1,". It contains some text to demonstrate scrollable content."]})]},c))})})]})}};var I,S,B;p.parameters={...p.parameters,docs:{...(I=p.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: function DefaultDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Drawer Title">
          <p className="text-body-md text-[var(--color-text-muted)]">
            This is the drawer content. You can put any content here.
          </p>
        </Drawer>
      </>;
  }
}`,...(B=(S=p.parameters)==null?void 0:S.docs)==null?void 0:B.source}}};var E,W,T;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: function LeftDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Left Drawer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Navigation" side="left" width={280}>
          <nav className="flex flex-col gap-[var(--primitive-spacing-2)]">
            <a href="#" className="px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] rounded hover:bg-[var(--color-surface-subtle)]">
              Dashboard
            </a>
            <a href="#" className="px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] rounded hover:bg-[var(--color-surface-subtle)]">
              Projects
            </a>
            <a href="#" className="px-[var(--primitive-spacing-3)] py-[var(--primitive-spacing-2)] rounded hover:bg-[var(--color-surface-subtle)]">
              Settings
            </a>
          </nav>
        </Drawer>
      </>;
  }
}`,...(T=(W=m.parameters)==null?void 0:W.docs)==null?void 0:T.source}}};var L,V,A;u.parameters={...u.parameters,docs:{...(L=u.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: function FooterDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Drawer with Footer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit Item" footer={<div className="flex gap-[var(--primitive-spacing-2)] justify-end">
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>Save Changes</Button>
            </div>}>
          <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
            <FormField label="Name">
              <Input placeholder="Enter name" fullWidth />
            </FormField>
            <FormField label="Description">
              <Input placeholder="Enter description" fullWidth />
            </FormField>
          </div>
        </Drawer>
      </>;
  }
}`,...(A=(V=u.parameters)==null?void 0:V.docs)==null?void 0:A.source}}};var P,R,U;f.parameters={...f.parameters,docs:{...(P=f.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: function EditFormDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Edit Settings</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Instance Settings" width={400} footer={<div className="flex gap-[var(--primitive-spacing-2)] justify-end">
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>Save</Button>
            </div>}>
          <div className="flex flex-col gap-[var(--primitive-spacing-6)]">
            <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
              <h3 className="text-label-lg text-[var(--color-text-default)]">General</h3>
              <FormField label="Instance Name">
                <Input defaultValue="my-instance-01" fullWidth />
              </FormField>
              <FormField label="Region">
                <Select options={[{
                value: 'us-east',
                label: 'US East'
              }, {
                value: 'us-west',
                label: 'US West'
              }, {
                value: 'eu-west',
                label: 'EU West'
              }]} defaultValue="us-east" fullWidth />
              </FormField>
            </div>

            <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
              <h3 className="text-label-lg text-[var(--color-text-default)]">Features</h3>
              <div className="flex items-center justify-between">
                <span className="text-body-md text-[var(--color-text-default)]">Auto-scaling</span>
                <Toggle defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-md text-[var(--color-text-default)]">Monitoring</span>
                <Toggle defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-md text-[var(--color-text-default)]">Backup</span>
                <Toggle />
              </div>
            </div>
          </div>
        </Drawer>
      </>;
  }
}`,...(U=(R=f.parameters)==null?void 0:R.docs)==null?void 0:U.source}}};var M,_,z;x.parameters={...x.parameters,docs:{...(M=x.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: function WideDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Wide Drawer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Detailed View" width={600}>
          <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
            <p className="text-body-md text-[var(--color-text-muted)]">
              This drawer is wider than the default to accommodate more content.
            </p>
            <div className="grid grid-cols-2 gap-[var(--primitive-spacing-4)]">
              <FormField label="First Name">
                <Input placeholder="John" fullWidth />
              </FormField>
              <FormField label="Last Name">
                <Input placeholder="Doe" fullWidth />
              </FormField>
              <FormField label="Email">
                <Input placeholder="john@example.com" fullWidth />
              </FormField>
              <FormField label="Phone">
                <Input placeholder="+1 234 567 890" fullWidth />
              </FormField>
            </div>
          </div>
        </Drawer>
      </>;
  }
}`,...(z=(_=x.parameters)==null?void 0:_.docs)==null?void 0:z.source}}};var q,G,H;h.parameters={...h.parameters,docs:{...(q=h.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: function NoBackdropDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Protected Drawer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Important Form" closeOnBackdropClick={false} closeOnEscape={false} footer={<div className="flex gap-[var(--primitive-spacing-2)] justify-end">
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Discard
              </Button>
              <Button onClick={() => setIsOpen(false)}>Save</Button>
            </div>}>
          <p className="text-body-md text-[var(--color-text-muted)]">
            This drawer can only be closed by clicking the buttons. Clicking the backdrop or
            pressing ESC won't close it.
          </p>
        </Drawer>
      </>;
  }
}`,...(H=(G=h.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};var J,Y,K;v.parameters={...v.parameters,docs:{...(J=v.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: function NoTitleDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="text-center py-[var(--primitive-spacing-8)]">
            <h2 className="text-heading-h5 mb-[var(--primitive-spacing-2)]">Custom Header</h2>
            <p className="text-body-md text-[var(--color-text-muted)]">
              This drawer doesn't have a built-in title
            </p>
          </div>
        </Drawer>
      </>;
  }
}`,...(K=(Y=v.parameters)==null?void 0:Y.docs)==null?void 0:K.source}}};var $,Q,X;g.parameters={...g.parameters,docs:{...($=g.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: function ScrollableDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Scrollable Drawer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Long Content" footer={<Button onClick={() => setIsOpen(false)} fullWidth>
              Close
            </Button>}>
          <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
            {Array.from({
            length: 20
          }, (_, i) => <div key={i} className="p-[var(--primitive-spacing-4)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)]">
                <h3 className="text-label-lg">Item {i + 1}</h3>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  This is the description for item {i + 1}. It contains some text to demonstrate
                  scrollable content.
                </p>
              </div>)}
          </div>
        </Drawer>
      </>;
  }
}`,...(X=(Q=g.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};const De=["Default","LeftSide","WithFooter","EditForm","WideDrawer","NoBackdropClose","NoTitle","ScrollableContent"];export{p as Default,f as EditForm,m as LeftSide,h as NoBackdropClose,v as NoTitle,g as ScrollableContent,x as WideDrawer,u as WithFooter,De as __namedExportsOrder,Ce as default};
