import{j as e}from"./iframe-CzLct1Ct.js";import{B as u}from"./Breadcrumb-h6EUv0Dn.js";import{I as f}from"./IconHome-ytLERg0V.js";import{I as r}from"./IconFolder-CC9T0sUh.js";import{c as se}from"./createReactComponent-Djx9unWR.js";import{I as le}from"./IconFile-BKUah9zS.js";import{M as oe}from"./chunk-JZWAC4HX-C7nbi7mi.js";import"./preload-helper-C1FmrZbK.js";import"./cn-BMXv33oC.js";import"./IconChevronRight-CGyay9dN.js";/**
 * @license @tabler/icons-react v3.36.1 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=[["path",{d:"M17 5l-10 14",key:"svg-0"}]],te=se("outline","slash","Slash",ne),ve={title:"Components/Breadcrumb",component:u,parameters:{layout:"centered",docs:{description:{component:"현재 페이지의 위치를 계층 구조로 표시하는 네비게이션 컴포넌트입니다."}}},tags:["autodocs"],decorators:[ae=>e.jsx(oe,{children:e.jsx(ae,{})})],argTypes:{items:{control:"object",description:"Breadcrumb 항목 배열"},separator:{control:!1,description:"커스텀 구분자"},maxItems:{control:{type:"number",min:0,max:10},description:"최대 표시 항목 수 (0 = 무제한)"}}},a={args:{items:[{label:"Home",href:"/"},{label:"Products",href:"/products"},{label:"Category",href:"/products/category"},{label:"Item"}]}},s={name:"Two Levels",args:{items:[{label:"Dashboard",href:"/"},{label:"Settings"}]}},l={name:"Three Levels",args:{items:[{label:"Home",href:"/"},{label:"Projects",href:"/projects"},{label:"Project Alpha"}]}},o={name:"With Icons",args:{items:[{label:"Home",href:"/",icon:e.jsx(f,{size:14})},{label:"Documents",href:"/documents",icon:e.jsx(r,{size:14})},{label:"Report.pdf",icon:e.jsx(le,{size:14})}]}},n={name:"Home Icon Only",render:()=>e.jsx(u,{items:[{label:"",href:"/",icon:e.jsx(f,{size:16})},{label:"Settings",href:"/settings"},{label:"Profile"}]})},t={name:"Slash Separator",args:{items:[{label:"Home",href:"/"},{label:"Users",href:"/users"},{label:"John Doe"}],separator:e.jsx(te,{size:16,className:"text-[var(--color-text-muted)]"})}},c={name:"Text Separator",args:{items:[{label:"Home",href:"/"},{label:"Products",href:"/products"},{label:"Electronics"}],separator:e.jsx("span",{className:"text-[var(--color-text-muted)] text-body-md",children:"/"})}},m={name:"Collapsed (Long Path)",args:{items:[{label:"Home",href:"/"},{label:"Level 1",href:"/level1"},{label:"Level 2",href:"/level1/level2"},{label:"Level 3",href:"/level1/level2/level3"},{label:"Level 4",href:"/level1/level2/level3/level4"},{label:"Current Page"}],maxItems:4}},i={name:"Collapsed (3 Items Max)",args:{items:[{label:"Root",href:"/"},{label:"Folder A",href:"/a"},{label:"Folder B",href:"/a/b"},{label:"Folder C",href:"/a/b/c"},{label:"File.txt"}],maxItems:3}},p={name:"With Click Handler",render:()=>e.jsx(u,{items:[{label:"Home",onClick:()=>alert("Navigate to Home")},{label:"Products",onClick:()=>alert("Navigate to Products")},{label:"Current Item"}]})},d={name:"Use Case - File Explorer",args:{items:[{label:"My Drive",href:"/drive",icon:e.jsx(r,{size:14})},{label:"Work",href:"/drive/work",icon:e.jsx(r,{size:14})},{label:"Projects",href:"/drive/work/projects",icon:e.jsx(r,{size:14})},{label:"2024",icon:e.jsx(r,{size:14})}]}},b={name:"Use Case - E-Commerce",args:{items:[{label:"Shop",href:"/"},{label:"Electronics",href:"/electronics"},{label:"Computers",href:"/electronics/computers"},{label:"Laptops",href:"/electronics/computers/laptops"},{label:'MacBook Pro 16"'}],maxItems:4}},h={name:"Use Case - Admin Panel",args:{items:[{label:"Admin",href:"/admin",icon:e.jsx(f,{size:14})},{label:"Users",href:"/admin/users"},{label:"User Details"}]}};var g,v,x;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    items: [{
      label: 'Home',
      href: '/'
    }, {
      label: 'Products',
      href: '/products'
    }, {
      label: 'Category',
      href: '/products/category'
    }, {
      label: 'Item'
    }]
  }
}`,...(x=(v=a.parameters)==null?void 0:v.docs)==null?void 0:x.source}}};var I,C,S;s.parameters={...s.parameters,docs:{...(I=s.parameters)==null?void 0:I.docs,source:{originalSource:`{
  name: 'Two Levels',
  args: {
    items: [{
      label: 'Dashboard',
      href: '/'
    }, {
      label: 'Settings'
    }]
  }
}`,...(S=(C=s.parameters)==null?void 0:C.docs)==null?void 0:S.source}}};var j,H,P;l.parameters={...l.parameters,docs:{...(j=l.parameters)==null?void 0:j.docs,source:{originalSource:`{
  name: 'Three Levels',
  args: {
    items: [{
      label: 'Home',
      href: '/'
    }, {
      label: 'Projects',
      href: '/projects'
    }, {
      label: 'Project Alpha'
    }]
  }
}`,...(P=(H=l.parameters)==null?void 0:H.docs)==null?void 0:P.source}}};var z,F,L;o.parameters={...o.parameters,docs:{...(z=o.parameters)==null?void 0:z.docs,source:{originalSource:`{
  name: 'With Icons',
  args: {
    items: [{
      label: 'Home',
      href: '/',
      icon: <IconHome size={14} />
    }, {
      label: 'Documents',
      href: '/documents',
      icon: <IconFolder size={14} />
    }, {
      label: 'Report.pdf',
      icon: <IconFile size={14} />
    }]
  }
}`,...(L=(F=o.parameters)==null?void 0:F.docs)==null?void 0:L.source}}};var k,y,T;n.parameters={...n.parameters,docs:{...(k=n.parameters)==null?void 0:k.docs,source:{originalSource:`{
  name: 'Home Icon Only',
  render: () => <Breadcrumb items={[{
    label: '',
    href: '/',
    icon: <IconHome size={16} />
  }, {
    label: 'Settings',
    href: '/settings'
  }, {
    label: 'Profile'
  }]} />
}`,...(T=(y=n.parameters)==null?void 0:y.docs)==null?void 0:T.source}}};var E,D,U;t.parameters={...t.parameters,docs:{...(E=t.parameters)==null?void 0:E.docs,source:{originalSource:`{
  name: 'Slash Separator',
  args: {
    items: [{
      label: 'Home',
      href: '/'
    }, {
      label: 'Users',
      href: '/users'
    }, {
      label: 'John Doe'
    }],
    separator: <IconSlash size={16} className="text-[var(--color-text-muted)]" />
  }
}`,...(U=(D=t.parameters)==null?void 0:D.docs)==null?void 0:U.source}}};var A,B,W;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`{
  name: 'Text Separator',
  args: {
    items: [{
      label: 'Home',
      href: '/'
    }, {
      label: 'Products',
      href: '/products'
    }, {
      label: 'Electronics'
    }],
    separator: <span className="text-[var(--color-text-muted)] text-body-md">/</span>
  }
}`,...(W=(B=c.parameters)==null?void 0:B.docs)==null?void 0:W.source}}};var M,N,w;m.parameters={...m.parameters,docs:{...(M=m.parameters)==null?void 0:M.docs,source:{originalSource:`{
  name: 'Collapsed (Long Path)',
  args: {
    items: [{
      label: 'Home',
      href: '/'
    }, {
      label: 'Level 1',
      href: '/level1'
    }, {
      label: 'Level 2',
      href: '/level1/level2'
    }, {
      label: 'Level 3',
      href: '/level1/level2/level3'
    }, {
      label: 'Level 4',
      href: '/level1/level2/level3/level4'
    }, {
      label: 'Current Page'
    }],
    maxItems: 4
  }
}`,...(w=(N=m.parameters)==null?void 0:N.docs)==null?void 0:w.source}}};var R,O,_;i.parameters={...i.parameters,docs:{...(R=i.parameters)==null?void 0:R.docs,source:{originalSource:`{
  name: 'Collapsed (3 Items Max)',
  args: {
    items: [{
      label: 'Root',
      href: '/'
    }, {
      label: 'Folder A',
      href: '/a'
    }, {
      label: 'Folder B',
      href: '/a/b'
    }, {
      label: 'Folder C',
      href: '/a/b/c'
    }, {
      label: 'File.txt'
    }],
    maxItems: 3
  }
}`,...(_=(O=i.parameters)==null?void 0:O.docs)==null?void 0:_.source}}};var J,q,G;p.parameters={...p.parameters,docs:{...(J=p.parameters)==null?void 0:J.docs,source:{originalSource:`{
  name: 'With Click Handler',
  render: () => <Breadcrumb items={[{
    label: 'Home',
    onClick: () => alert('Navigate to Home')
  }, {
    label: 'Products',
    onClick: () => alert('Navigate to Products')
  }, {
    label: 'Current Item'
  }]} />
}`,...(G=(q=p.parameters)==null?void 0:q.docs)==null?void 0:G.source}}};var K,Q,V;d.parameters={...d.parameters,docs:{...(K=d.parameters)==null?void 0:K.docs,source:{originalSource:`{
  name: 'Use Case - File Explorer',
  args: {
    items: [{
      label: 'My Drive',
      href: '/drive',
      icon: <IconFolder size={14} />
    }, {
      label: 'Work',
      href: '/drive/work',
      icon: <IconFolder size={14} />
    }, {
      label: 'Projects',
      href: '/drive/work/projects',
      icon: <IconFolder size={14} />
    }, {
      label: '2024',
      icon: <IconFolder size={14} />
    }]
  }
}`,...(V=(Q=d.parameters)==null?void 0:Q.docs)==null?void 0:V.source}}};var X,Y,Z;b.parameters={...b.parameters,docs:{...(X=b.parameters)==null?void 0:X.docs,source:{originalSource:`{
  name: 'Use Case - E-Commerce',
  args: {
    items: [{
      label: 'Shop',
      href: '/'
    }, {
      label: 'Electronics',
      href: '/electronics'
    }, {
      label: 'Computers',
      href: '/electronics/computers'
    }, {
      label: 'Laptops',
      href: '/electronics/computers/laptops'
    }, {
      label: 'MacBook Pro 16"'
    }],
    maxItems: 4
  }
}`,...(Z=(Y=b.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var $,ee,re;h.parameters={...h.parameters,docs:{...($=h.parameters)==null?void 0:$.docs,source:{originalSource:`{
  name: 'Use Case - Admin Panel',
  args: {
    items: [{
      label: 'Admin',
      href: '/admin',
      icon: <IconHome size={14} />
    }, {
      label: 'Users',
      href: '/admin/users'
    }, {
      label: 'User Details'
    }]
  }
}`,...(re=(ee=h.parameters)==null?void 0:ee.docs)==null?void 0:re.source}}};const xe=["Default","TwoLevels","ThreeLevels","WithIcons","HomeIconOnly","SlashSeparator","TextSeparator","Collapsed","CollapsedThreeItems","WithClickHandler","FileExplorer","ECommerce","AdminPanel"];export{h as AdminPanel,m as Collapsed,i as CollapsedThreeItems,a as Default,b as ECommerce,d as FileExplorer,n as HomeIconOnly,t as SlashSeparator,c as TextSeparator,l as ThreeLevels,s as TwoLevels,p as WithClickHandler,o as WithIcons,xe as __namedExportsOrder,ve as default};
