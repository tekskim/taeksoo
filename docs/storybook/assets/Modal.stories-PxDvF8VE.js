import{r as a,j as e}from"./iframe-C-CGJmyb.js";import{r as te}from"./index-KOaWZOGP.js";import{t as S}from"./cn-CshvV4Tc.js";import{B as o}from"./Button-CFzl0PLa.js";import{I as w}from"./Input-DYjPjFqM.js";import"./preload-helper-C1FmrZbK.js";function m({isOpen:s,onClose:n,title:t,description:r,children:i,size:c="md",showCloseButton:f=!1,closeOnBackdropClick:x=!0,closeOnEscape:d=!0,className:g}){const[u,C]=a.useState(s),[h,k]=a.useState(!1);a.useEffect(()=>{if(s)C(!0),requestAnimationFrame(()=>{requestAnimationFrame(()=>{k(!0)})});else{k(!1);const l=setTimeout(()=>{C(!1)},200);return()=>clearTimeout(l)}},[s]),a.useEffect(()=>{if(!s||!d)return;const l=ee=>{ee.key==="Escape"&&n()};return document.addEventListener("keydown",l),()=>document.removeEventListener("keydown",l)},[s,d,n]),a.useEffect(()=>(s?document.body.style.overflow="hidden":document.body.style.overflow="",()=>{document.body.style.overflow=""}),[s]);const Q=a.useCallback(()=>{x&&n()},[x,n]);if(!u)return null;const X={sm:"w-[344px]",md:"w-[344px]",lg:"w-[640px]"},Z=S("fixed inset-0 z-[var(--z-modal)]","bg-black/60","flex items-center justify-center","transition-opacity duration-200 ease-out",h?"opacity-100":"opacity-0"),$=S("bg-[var(--color-surface-default)]","border border-[var(--color-border-default)]","rounded-[var(--radius-lg)]","shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)]","p-4","flex flex-col gap-4","transition-all duration-200 ease-out",h?"opacity-100 scale-100":"opacity-0 scale-95",X[c],g);return te.createPortal(e.jsx("div",{className:Z,onClick:Q,children:e.jsxs("div",{className:$,onClick:l=>l.stopPropagation(),children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("h2",{className:"text-heading-h5 text-[var(--color-text-default)]",children:t}),r&&e.jsx("p",{className:"text-body-md text-[var(--color-text-subtle)]",children:r})]}),i]})}),document.body)}function p({isOpen:s,onClose:n,onConfirm:t,title:r,description:i,confirmText:c="Confirm",cancelText:f="Cancel",confirmVariant:x="primary",infoLabel:d,infoValue:g,isLoading:u=!1,size:C="sm",...h}){return e.jsxs(m,{isOpen:s,onClose:n,title:r,description:i,size:C,...h,children:[d&&g&&e.jsxs("div",{className:"bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5",children:[e.jsx("span",{className:"text-label-sm text-[var(--color-text-subtle)]",children:d}),e.jsx("span",{className:"text-body-md text-[var(--color-text-default)]",children:g})]}),e.jsxs("div",{className:"flex gap-2 w-full",children:[e.jsx(o,{variant:"outline",size:"md",onClick:n,disabled:u,className:"flex-1",children:f}),e.jsx(o,{variant:x,size:"md",onClick:t,disabled:u,className:"flex-1",children:u?"Processing...":c})]})]})}p.__docgenInfo={description:"",methods:[],displayName:"ConfirmModal",props:{confirmText:{required:!1,tsType:{name:"string"},description:"Confirm button text",defaultValue:{value:"'Confirm'",computed:!1}},cancelText:{required:!1,tsType:{name:"string"},description:"Cancel button text",defaultValue:{value:"'Cancel'",computed:!1}},confirmVariant:{required:!1,tsType:{name:"union",raw:"'primary' | 'danger' | 'warning'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'danger'"},{name:"literal",value:"'warning'"}]},description:"Confirm button variant",defaultValue:{value:"'primary'",computed:!1}},onConfirm:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when confirmed"},infoLabel:{required:!1,tsType:{name:"string"},description:"Info box content"},infoValue:{required:!1,tsType:{name:"string"},description:"Info box value"},isLoading:{required:!1,tsType:{name:"boolean"},description:"Loading state",defaultValue:{value:"false",computed:!1}},size:{defaultValue:{value:"'sm'",computed:!1},required:!1}},composes:["Omit"]};const le={title:"Components/Modal",component:m,tags:["autodocs"],parameters:{docs:{description:{component:`
## Modal 컴포넌트

사용자의 주의를 집중시키는 오버레이 다이얼로그입니다.

### 종류
- **Modal**: 커스텀 콘텐츠를 담는 기본 모달
- **ConfirmModal**: 확인/취소 액션이 있는 확인 모달

### 사용 시기
- 중요한 정보 확인
- 삭제/제출 전 확인
- 폼 입력 (간단한 경우)
- 에러/경고 메시지

### 접근성
- ESC 키로 닫기 지원
- 포커스 트랩 (모달 내에서만 Tab 이동)
- 배경 클릭으로 닫기 (선택적)
- aria-modal, role="dialog" 자동 적용

### 예시
\`\`\`tsx
import { Modal, ConfirmModal } from '@thaki/tds';

// 기본 모달
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="제목"
>
  내용
</Modal>

// 확인 모달
<ConfirmModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleConfirm}
  title="삭제 확인"
  description="정말 삭제하시겠습니까?"
  confirmVariant="danger"
/>
\`\`\`
        `}}},argTypes:{size:{control:"select",options:["sm","md","lg"],description:"모달 크기 (sm: 344px, md: 480px, lg: 640px)",table:{type:{summary:'"sm" | "md" | "lg"'},defaultValue:{summary:'"md"'}}},title:{control:"text",description:"모달 제목",table:{type:{summary:"string"}}},description:{control:"text",description:"모달 설명 (제목 아래 표시)",table:{type:{summary:"string"}}},closeOnBackdropClick:{control:"boolean",description:"배경 클릭시 닫기 여부",table:{type:{summary:"boolean"},defaultValue:{summary:"true"}}},closeOnEscape:{control:"boolean",description:"ESC 키로 닫기 여부",table:{type:{summary:"boolean"},defaultValue:{summary:"true"}}},isOpen:{control:"boolean",description:"모달 열림 상태",table:{type:{summary:"boolean"}}},onClose:{description:"모달 닫기 콜백",table:{type:{summary:"() => void"}}}}},v={render:function(){const[n,t]=a.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{onClick:()=>t(!0),children:"Open Modal"}),e.jsx(m,{isOpen:n,onClose:()=>t(!1),title:"Modal Title",description:"This is a description text that provides more context about the modal.",children:e.jsx("div",{className:"text-body-md text-[var(--color-text-default)]",children:"Modal content goes here. You can put any content inside the modal."})})]})}},O={render:function(){const[n,t]=a.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{onClick:()=>t(!0),children:"Open Confirm Modal"}),e.jsx(p,{isOpen:n,onClose:()=>t(!1),onConfirm:()=>{alert("Confirmed!"),t(!1)},title:"Confirm Action",description:"This action proceeds with the changes."})]})}},b={render:function(){const[n,t]=a.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"danger",onClick:()=>t(!0),children:"Delete Item"}),e.jsx(p,{isOpen:n,onClose:()=>t(!1),onConfirm:()=>{alert("Deleted!"),t(!1)},title:"Delete Item",description:"Removing the selected instances is permanent and cannot be undone.",confirmText:"Delete",cancelText:"Cancel",confirmVariant:"danger",infoLabel:"Item name",infoValue:"my-important-file.txt"})]})}},y={render:function(){const[n,t]=a.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{onClick:()=>t(!0),children:"Edit Profile"}),e.jsx(m,{isOpen:n,onClose:()=>t(!1),title:"Edit Profile",description:"Update your profile information.",children:e.jsxs("div",{className:"flex flex-col gap-[var(--primitive-spacing-4)]",children:[e.jsx(w,{label:"Name",placeholder:"Enter your name",fullWidth:!0}),e.jsx(w,{label:"Email",type:"email",placeholder:"Enter your email",fullWidth:!0}),e.jsxs("div",{className:"flex gap-[var(--primitive-spacing-2)] mt-[var(--primitive-spacing-2)]",children:[e.jsx(o,{variant:"outline",onClick:()=>t(!1),fullWidth:!0,children:"Cancel"}),e.jsx(o,{onClick:()=>{alert("Saved!"),t(!1)},fullWidth:!0,children:"Save Changes"})]})]})})]})}},I={render:function(){const[n,t]=a.useState(!1),[r,i]=a.useState(!1),c=async()=>{i(!0),await new Promise(f=>setTimeout(f,2e3)),i(!1),t(!1)};return e.jsxs(e.Fragment,{children:[e.jsx(o,{onClick:()=>t(!0),children:"Submit Action"}),e.jsx(p,{isOpen:n,onClose:()=>!r&&t(!1),onConfirm:c,title:"Submit",description:"This will submit the form.",confirmText:"Submit",isLoading:r})]})}},j={render:function(){const[n,t]=a.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"warning",onClick:()=>t(!0),children:"Reset Settings"}),e.jsx(p,{isOpen:n,onClose:()=>t(!1),onConfirm:()=>{alert("Settings reset!"),t(!1)},title:"Reset Settings",description:"This will reset all settings to their default values. Your current configuration will be lost.",confirmText:"Reset",cancelText:"Keep Current",confirmVariant:"warning"})]})}},M={render:function(){const[n,t]=a.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{onClick:()=>t(!0),children:"Open Modal"}),e.jsx(m,{isOpen:n,onClose:()=>t(!1),title:"Important Notice",description:"You must click a button to close this modal.",closeOnBackdropClick:!1,closeOnEscape:!1,children:e.jsx("div",{className:"flex gap-[var(--primitive-spacing-2)]",children:e.jsx(o,{variant:"outline",onClick:()=>t(!1),fullWidth:!0,children:"Got it"})})})]})}};var T,B,E;v.parameters={...v.parameters,docs:{...(T=v.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: function DefaultModal() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Modal Title" description="This is a description text that provides more context about the modal.">
          <div className="text-body-md text-[var(--color-text-default)]">
            Modal content goes here. You can put any content inside the modal.
          </div>
        </Modal>
      </>;
  }
}`,...(E=(B=v.parameters)==null?void 0:B.docs)==null?void 0:E.source}}};var N,D,L;O.parameters={...O.parameters,docs:{...(N=O.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: function ConfirmModalExample() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Confirm Modal</Button>
        <ConfirmModal isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={() => {
        alert('Confirmed!');
        setIsOpen(false);
      }} title="Confirm Action" description="This action proceeds with the changes." />
      </>;
  }
}`,...(L=(D=O.parameters)==null?void 0:D.docs)==null?void 0:L.source}}};var V,W,F;b.parameters={...b.parameters,docs:{...(V=b.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: function DeleteConfirmExample() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button variant="danger" onClick={() => setIsOpen(true)}>
          Delete Item
        </Button>
        <ConfirmModal isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={() => {
        alert('Deleted!');
        setIsOpen(false);
      }} title="Delete Item" description="Removing the selected instances is permanent and cannot be undone." confirmText="Delete" cancelText="Cancel" confirmVariant="danger" infoLabel="Item name" infoValue="my-important-file.txt" />
      </>;
  }
}`,...(F=(W=b.parameters)==null?void 0:W.docs)==null?void 0:F.source}}};var R,q,P;y.parameters={...y.parameters,docs:{...(R=y.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: function FormModal() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Edit Profile</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit Profile" description="Update your profile information.">
          <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
            <Input label="Name" placeholder="Enter your name" fullWidth />
            <Input label="Email" type="email" placeholder="Enter your email" fullWidth />
            <div className="flex gap-[var(--primitive-spacing-2)] mt-[var(--primitive-spacing-2)]">
              <Button variant="outline" onClick={() => setIsOpen(false)} fullWidth>
                Cancel
              </Button>
              <Button onClick={() => {
              alert('Saved!');
              setIsOpen(false);
            }} fullWidth>
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      </>;
  }
}`,...(P=(q=y.parameters)==null?void 0:q.docs)==null?void 0:P.source}}};var _,A,z;I.parameters={...I.parameters,docs:{...(_=I.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: function LoadingModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const handleConfirm = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
      setIsOpen(false);
    };
    return <>
        <Button onClick={() => setIsOpen(true)}>Submit Action</Button>
        <ConfirmModal isOpen={isOpen} onClose={() => !isLoading && setIsOpen(false)} onConfirm={handleConfirm} title="Submit" description="This will submit the form." confirmText="Submit" isLoading={isLoading} />
      </>;
  }
}`,...(z=(A=I.parameters)==null?void 0:A.docs)==null?void 0:z.source}}};var Y,K,G;j.parameters={...j.parameters,docs:{...(Y=j.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: function WarningModal() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button variant="warning" onClick={() => setIsOpen(true)}>
          Reset Settings
        </Button>
        <ConfirmModal isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={() => {
        alert('Settings reset!');
        setIsOpen(false);
      }} title="Reset Settings" description="This will reset all settings to their default values. Your current configuration will be lost." confirmText="Reset" cancelText="Keep Current" confirmVariant="warning" />
      </>;
  }
}`,...(G=(K=j.parameters)==null?void 0:K.docs)==null?void 0:G.source}}};var U,H,J;M.parameters={...M.parameters,docs:{...(U=M.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: function NoBackdropCloseModal() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Important Notice" description="You must click a button to close this modal." closeOnBackdropClick={false} closeOnEscape={false}>
          <div className="flex gap-[var(--primitive-spacing-2)]">
            <Button variant="outline" onClick={() => setIsOpen(false)} fullWidth>
              Got it
            </Button>
          </div>
        </Modal>
      </>;
  }
}`,...(J=(H=M.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};const ce=["Default","Confirm","DeleteConfirm","WithForm","Loading","Warning","NoBackdropClose"];export{O as Confirm,v as Default,b as DeleteConfirm,I as Loading,M as NoBackdropClose,j as Warning,y as WithForm,ce as __namedExportsOrder,le as default};
