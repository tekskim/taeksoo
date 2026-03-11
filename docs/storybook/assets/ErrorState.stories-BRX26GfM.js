import{j as e}from"./iframe-IHmg4wqj.js";import{B as s}from"./Button-MQh3e0bs.js";import{I as E}from"./IconAlertTriangle-CNmzifc1.js";import{c as S}from"./createReactComponent-BhwuFqFO.js";import"./preload-helper-C1FmrZbK.js";import"./cn-8AORBNJN.js";/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=[["path",{d:"M12 12h-6a3 3 0 0 1 -3 -3v-2c0 -1.083 .574 -2.033 1.435 -2.56m3.565 -.44h10a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-2",key:"svg-0"}],["path",{d:"M16 12h2a3 3 0 0 1 3 3v2m-1.448 2.568a2.986 2.986 0 0 1 -1.552 .432h-12a3 3 0 0 1 -3 -3v-2a3 3 0 0 1 3 -3h6",key:"svg-1"}],["path",{d:"M7 8v.01",key:"svg-2"}],["path",{d:"M7 16v.01",key:"svg-3"}],["path",{d:"M3 3l18 18",key:"svg-4"}]],M=S("outline","server-off","ServerOff",z);/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["path",{d:"M12 18l.01 0",key:"svg-0"}],["path",{d:"M9.172 15.172a4 4 0 0 1 5.656 0",key:"svg-1"}],["path",{d:"M6.343 12.343a7.963 7.963 0 0 1 3.864 -2.14m4.163 .155a7.965 7.965 0 0 1 3.287 2",key:"svg-2"}],["path",{d:"M3.515 9.515a12 12 0 0 1 3.544 -2.455m3.101 -.92a12 12 0 0 1 10.325 3.374",key:"svg-3"}],["path",{d:"M3 3l18 18",key:"svg-4"}]],R=S("outline","wifi-off","WifiOff",I);function w({icon:n,title:N="Something went wrong",description:i,action:c,className:j=""}){return e.jsxs("div",{className:`flex flex-col items-center justify-center py-20 text-center ${j}`.trim(),children:[n&&e.jsx("div",{className:"text-[var(--color-state-danger)] mb-[16px]",children:n}),e.jsx("span",{className:"text-heading-h5 text-[var(--color-text-default)] mb-[8px]",children:N}),i&&e.jsx("p",{className:"text-body-md text-[var(--color-text-muted)] max-w-md mb-[16px]",children:i}),c&&e.jsx("div",{children:c})]})}w.__docgenInfo={description:"",methods:[],displayName:"ErrorState",props:{icon:{required:!1,tsType:{name:"ReactNode"},description:"아이콘 (ReactNode)"},title:{required:!1,tsType:{name:"string"},description:"에러 제목",defaultValue:{value:"'Something went wrong'",computed:!1}},description:{required:!1,tsType:{name:"string"},description:"에러 상세 메시지"},action:{required:!1,tsType:{name:"ReactNode"},description:"재시도/액션 버튼"},className:{required:!1,tsType:{name:"string"},description:"추가 CSS 클래스",defaultValue:{value:"''",computed:!1}}}};const A={title:"Feedback/ErrorState",component:w,parameters:{layout:"padded",docs:{description:{component:`
에러 상태를 표시하는 컴포넌트. API 실패, 네트워크 오류 등의 상황에서 사용합니다.
        `}}},tags:["autodocs"]},r={args:{icon:e.jsx(E,{size:48,stroke:1}),title:"Something went wrong",description:"An unexpected error occurred. Please try again later.",action:e.jsx(s,{variant:"secondary",size:"md",children:"Retry"})}},t={args:{icon:e.jsx(R,{size:48,stroke:1}),title:"Network Error",description:"Unable to connect to the server. Please check your network connection.",action:e.jsx(s,{variant:"primary",size:"md",children:"Retry Connection"})}},o={args:{icon:e.jsx(M,{size:48,stroke:1}),title:"500 Internal Server Error",description:"The server encountered an error. Our team has been notified."}},a={args:{title:"Failed to load data",action:e.jsx(s,{variant:"secondary",size:"sm",children:"Retry"})}};var d,l,m;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    icon: <IconAlertTriangle size={48} stroke={1} />,
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again later.',
    action: <Button variant="secondary" size="md">
        Retry
      </Button>
  }
}`,...(m=(l=r.parameters)==null?void 0:l.docs)==null?void 0:m.source}}};var p,u,f;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    icon: <IconWifiOff size={48} stroke={1} />,
    title: 'Network Error',
    description: 'Unable to connect to the server. Please check your network connection.',
    action: <Button variant="primary" size="md">
        Retry Connection
      </Button>
  }
}`,...(f=(u=t.parameters)==null?void 0:u.docs)==null?void 0:f.source}}};var v,g,h;o.parameters={...o.parameters,docs:{...(v=o.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    icon: <IconServerOff size={48} stroke={1} />,
    title: '500 Internal Server Error',
    description: 'The server encountered an error. Our team has been notified.'
  }
}`,...(h=(g=o.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var y,x,k;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    title: 'Failed to load data',
    action: <Button variant="secondary" size="sm">
        Retry
      </Button>
  }
}`,...(k=(x=a.parameters)==null?void 0:x.docs)==null?void 0:k.source}}};const P=["Default","NetworkError","ServerError","Minimal"];export{r as Default,a as Minimal,t as NetworkError,o as ServerError,P as __namedExportsOrder,A as default};
