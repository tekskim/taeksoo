import{j as e,r as $}from"./iframe-CsZHcOUf.js";import{V as P}from"./Stack-CKOQlJBR.js";import{I as H}from"./IconX-DSnl1fNg.js";import{B as J}from"./Button-B8wqjk7E.js";import{I as y}from"./IconUpload-DaWlamVV.js";import"./preload-helper-C1FmrZbK.js";import"./createReactComponent-C2Lh4gVY.js";import"./cn-CshvV4Tc.js";function Q(){return e.jsx("div",{className:"w-px h-[10px] bg-[var(--color-border-default)]"})}function v({files:r,onRemove:t,emptyMessage:a="No files",className:i=""}){return r.length===0?a?e.jsx("p",{className:"text-body-sm text-[var(--color-text-subtle)]",children:a}):null:e.jsx("div",{className:`bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] p-[var(--primitive-spacing-3)] flex flex-col gap-[var(--primitive-spacing-2)] ${i}`,children:r.map(s=>e.jsxs("div",{className:"bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] px-4 py-2 flex items-center justify-between",children:[e.jsxs(P,{gap:1,children:[e.jsx("span",{className:"text-body-md text-[var(--color-text-default)]",children:s.name}),s.tags&&s.tags.length>0&&e.jsx("div",{className:"flex items-center gap-2",children:s.tags.map((o,n)=>e.jsxs("span",{className:"contents",children:[n>0&&e.jsx(Q,{}),e.jsx("span",{className:"text-body-sm text-[var(--color-text-subtle)]",children:o})]},o))}),!s.tags&&s.description&&e.jsx("span",{className:"text-body-sm text-[var(--color-text-subtle)]",children:s.description})]}),t&&e.jsx("button",{type:"button",onClick:()=>t(s.id),className:"shrink-0 text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] transition-colors",children:e.jsx(H,{size:16,stroke:1.5})})]},s.id))})}function x({label:r="Upload Files",required:t,files:a,onRemove:i,onUpload:s,uploadLabel:o="Upload a File",uploadIcon:n,error:F,emptyMessage:X,className:G=""}){return e.jsxs(P,{gap:3,className:`w-full ${G}`,children:[r&&e.jsxs("label",{className:"text-label-lg text-[var(--color-text-default)]",children:[r,t&&e.jsx("span",{className:"ml-1 text-[var(--color-state-danger)]",children:"*"})]}),s&&e.jsx(J,{variant:"secondary",size:"sm",onClick:s,className:"w-fit",leftIcon:n,children:o}),F&&e.jsx("span",{className:"text-body-sm text-[var(--color-state-danger)]",children:F}),e.jsx(v,{files:a,onRemove:i,emptyMessage:X})]})}v.__docgenInfo={description:"",methods:[],displayName:"FileListCard",props:{files:{required:!0,tsType:{name:"Array",elements:[{name:"FileItem"}],raw:"FileItem[]"},description:""},onRemove:{required:!1,tsType:{name:"signature",type:"function",raw:"(id: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"void"}}},description:""},emptyMessage:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'No files'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}}}};x.__docgenInfo={description:"",methods:[],displayName:"FileListSection",props:{label:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Upload Files'",computed:!1}},required:{required:!1,tsType:{name:"boolean"},description:""},files:{required:!0,tsType:{name:"Array",elements:[{name:"FileItem"}],raw:"FileItem[]"},description:""},onRemove:{required:!1,tsType:{name:"signature",type:"function",raw:"(id: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"void"}}},description:""},onUpload:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},uploadLabel:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Upload a File'",computed:!1}},uploadIcon:{required:!1,tsType:{name:"ReactNode"},description:""},error:{required:!1,tsType:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}]},description:""},emptyMessage:{required:!1,tsType:{name:"string"},description:""},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}}}};const ne={title:"Components/FileListCard",component:v,parameters:{layout:"centered",docs:{description:{component:"업로드된 파일 목록을 표시하는 카드 컴포넌트입니다."}}},tags:["autodocs"],argTypes:{emptyMessage:{control:"text",description:"파일이 없을 때 표시할 메시지",table:{type:{summary:"string"},defaultValue:{summary:'"No files"'}}}},decorators:[r=>e.jsx("div",{style:{width:"400px"},children:e.jsx(r,{})})]},O=[{id:"1",name:"certificate.pem",tags:["2.5 KB","PEM"]},{id:"2",name:"private-key.pem",tags:["1.8 KB","PEM"]},{id:"3",name:"ca-bundle.crt",tags:["4.1 KB","CRT"]}],Y=[{id:"1",name:"deployment.yaml",description:"Kubernetes deployment manifest"},{id:"2",name:"service.yaml",description:"Service configuration"},{id:"3",name:"configmap.yaml",description:"ConfigMap with environment variables"}],l={args:{files:O}},d={name:"With Descriptions",args:{files:Y}},c={name:"Single File",args:{files:[{id:"1",name:"server.crt",tags:["3.2 KB","Certificate"]}]}},p={args:{files:[],emptyMessage:"No files uploaded"}},m={render:function(){const[t,a]=$.useState([...O]),i=s=>{a(o=>o.filter(n=>n.id!==s))};return e.jsx(v,{files:t,onRemove:i})}},u={name:"FileListSection",render:function(){const[t,a]=$.useState([{id:"1",name:"server.crt",tags:["3.2 KB"]}]);return e.jsx(x,{label:"SSL Certificate",required:!0,files:t,onRemove:i=>a(s=>s.filter(o=>o.id!==i)),onUpload:()=>{const i={id:String(Date.now()),name:`file-${t.length+1}.pem`,tags:["1.0 KB"]};a(s=>[...s,i])},uploadLabel:"Upload Certificate",uploadIcon:e.jsx(y,{size:12})})}},f={name:"FileListSection — Error",render:()=>e.jsx(x,{label:"Upload Files",required:!0,files:[],onUpload:()=>{},uploadLabel:"Upload a File",uploadIcon:e.jsx(y,{size:12}),error:"At least one file is required.",emptyMessage:"No files uploaded yet"})},g={name:"FileListSection — Empty",render:()=>e.jsx(x,{label:"Attachments",files:[],onUpload:()=>{},uploadLabel:"Upload a File",uploadIcon:e.jsx(y,{size:12})})};var b,S,h;l.parameters={...l.parameters,docs:{...(b=l.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    files: sampleFiles
  }
}`,...(h=(S=l.parameters)==null?void 0:S.docs)==null?void 0:h.source}}};var j,N,I;d.parameters={...d.parameters,docs:{...(j=d.parameters)==null?void 0:j.docs,source:{originalSource:`{
  name: 'With Descriptions',
  args: {
    files: filesWithDescriptions
  }
}`,...(I=(N=d.parameters)==null?void 0:N.docs)==null?void 0:I.source}}};var L,U,q;c.parameters={...c.parameters,docs:{...(L=c.parameters)==null?void 0:L.docs,source:{originalSource:`{
  name: 'Single File',
  args: {
    files: [{
      id: '1',
      name: 'server.crt',
      tags: ['3.2 KB', 'Certificate']
    }]
  }
}`,...(q=(U=c.parameters)==null?void 0:U.docs)==null?void 0:q.source}}};var E,w,T;p.parameters={...p.parameters,docs:{...(E=p.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    files: [],
    emptyMessage: 'No files uploaded'
  }
}`,...(T=(w=p.parameters)==null?void 0:w.docs)==null?void 0:T.source}}};var C,R,B;m.parameters={...m.parameters,docs:{...(C=m.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: function RemovableExample() {
    const [files, setFiles] = useState<FileItem[]>([...sampleFiles]);
    const handleRemove = (id: string) => {
      setFiles(prev => prev.filter(f => f.id !== id));
    };
    return <FileListCard files={files} onRemove={handleRemove} />;
  }
}`,...(B=(R=m.parameters)==null?void 0:R.docs)==null?void 0:B.source}}};var D,K,M;u.parameters={...u.parameters,docs:{...(D=u.parameters)==null?void 0:D.docs,source:{originalSource:`{
  name: 'FileListSection',
  render: function SectionExample() {
    const [files, setFiles] = useState<FileItem[]>([{
      id: '1',
      name: 'server.crt',
      tags: ['3.2 KB']
    }]);
    return <FileListSection label="SSL Certificate" required files={files} onRemove={id => setFiles(prev => prev.filter(f => f.id !== id))} onUpload={() => {
      const newFile: FileItem = {
        id: String(Date.now()),
        name: \`file-\${files.length + 1}.pem\`,
        tags: ['1.0 KB']
      };
      setFiles(prev => [...prev, newFile]);
    }} uploadLabel="Upload Certificate" uploadIcon={<IconUpload size={12} />} />;
  }
}`,...(M=(K=u.parameters)==null?void 0:K.docs)==null?void 0:M.source}}};var z,V,W;f.parameters={...f.parameters,docs:{...(z=f.parameters)==null?void 0:z.docs,source:{originalSource:`{
  name: 'FileListSection — Error',
  render: () => <FileListSection label="Upload Files" required files={[]} onUpload={() => {}} uploadLabel="Upload a File" uploadIcon={<IconUpload size={12} />} error="At least one file is required." emptyMessage="No files uploaded yet" />
}`,...(W=(V=f.parameters)==null?void 0:V.docs)==null?void 0:W.source}}};var k,A,_;g.parameters={...g.parameters,docs:{...(k=g.parameters)==null?void 0:k.docs,source:{originalSource:`{
  name: 'FileListSection — Empty',
  render: () => <FileListSection label="Attachments" files={[]} onUpload={() => {}} uploadLabel="Upload a File" uploadIcon={<IconUpload size={12} />} />
}`,...(_=(A=g.parameters)==null?void 0:A.docs)==null?void 0:_.source}}};const le=["Default","WithDescriptions","SingleFile","Empty","Removable","Section","SectionWithError","SectionEmpty"];export{l as Default,p as Empty,m as Removable,u as Section,g as SectionEmpty,f as SectionWithError,c as SingleFile,d as WithDescriptions,le as __namedExportsOrder,ne as default};
