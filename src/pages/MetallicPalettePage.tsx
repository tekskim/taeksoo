import { VStack } from '@/design-system';
import {
  IconCopy,
  IconCheck,
  IconArrowLeft,
  IconPlus,
  IconDownload,
  IconSend,
  IconHeart,
  IconStar,
  IconBell,
  IconSettings,
  IconChevronDown,
  IconLoader2,
  IconTrash,
  IconEdit,
  IconShare,
  IconBookmark,
  IconRefresh,
} from '@tabler/icons-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Metallic & Satin Color Palette
   Premium finish colors for tech & industrial design
   ---------------------------------------- */

interface MetallicColor {
  name: string;
  hex: string;
  highlight: string; // 하이라이트/반사 색상
  shadow: string; // 그림자/어두운 톤
  usage: string;
}

interface MetallicGroup {
  title: string;
  description: string;
  colors: MetallicColor[];
}

const metallicPalette: MetallicGroup[] = [
  {
    title: '⭐ Favorites - Royal Blue',
    description: '로얄 블루 베리에이션',
    colors: [
      {
        name: 'Royal Blue',
        hex: '#4169E1',
        highlight: '#6B8BE8',
        shadow: '#3050A8',
        usage: 'Classic Royal',
      },
      {
        name: 'Royal Light',
        hex: '#6495ED',
        highlight: '#8DB3F2',
        shadow: '#4B70B2',
        usage: 'Cornflower Blue',
      },
      {
        name: 'Royal Deep',
        hex: '#27408B',
        highlight: '#4566AC',
        shadow: '#1D3068',
        usage: 'Deep Royal',
      },
      {
        name: 'Royal Navy',
        hex: '#1E3A5F',
        highlight: '#3A5E87',
        shadow: '#162B47',
        usage: 'Navy Royal',
      },
      {
        name: 'Royal Sapphire',
        hex: '#0F52BA',
        highlight: '#3A78D4',
        shadow: '#0B3D8B',
        usage: 'Sapphire Blue',
      },
      {
        name: 'Royal Electric',
        hex: '#0047AB',
        highlight: '#2670D4',
        shadow: '#003580',
        usage: 'Electric Royal',
      },
      {
        name: 'Royal Cobalt',
        hex: '#0050A0',
        highlight: '#3378C0',
        shadow: '#003C78',
        usage: 'Cobalt Royal',
      },
      {
        name: 'Royal Midnight',
        hex: '#191970',
        highlight: '#3A3A99',
        shadow: '#121254',
        usage: 'Midnight Blue',
      },
    ],
  },
  {
    title: '⭐ Favorites - Emerald',
    description: '에메랄드 그린 베리에이션',
    colors: [
      {
        name: 'Emerald Satin',
        hex: '#2E8B57',
        highlight: '#4CB277',
        shadow: '#1D5A38',
        usage: 'Premium Green',
      },
      {
        name: 'Emerald Light',
        hex: '#50C878',
        highlight: '#7AD99A',
        shadow: '#3C965A',
        usage: 'Light Emerald',
      },
      {
        name: 'Emerald Deep',
        hex: '#1B5E3E',
        highlight: '#2D8A5E',
        shadow: '#0F3A26',
        usage: 'Dark Emerald',
      },
      {
        name: 'Emerald Mist',
        hex: '#6DB584',
        highlight: '#94CBA4',
        shadow: '#528863',
        usage: 'Soft Emerald',
      },
      {
        name: 'Emerald Vivid',
        hex: '#00A86B',
        highlight: '#33C08D',
        shadow: '#007A4E',
        usage: 'Vivid Emerald',
      },
    ],
  },
  {
    title: '⭐ Favorites - Copper',
    description: '구리/코퍼 베리에이션',
    colors: [
      {
        name: 'Copper',
        hex: '#B87333',
        highlight: '#DA9959',
        shadow: '#8A5627',
        usage: 'Classic Copper',
      },
      {
        name: 'Copper Light',
        hex: '#DA8A5A',
        highlight: '#E8AD84',
        shadow: '#A36844',
        usage: 'Light Copper',
      },
      {
        name: 'Copper Deep',
        hex: '#8B4513',
        highlight: '#B36B3D',
        shadow: '#66330E',
        usage: 'Saddle Brown',
      },
      {
        name: 'Copper Rose',
        hex: '#CB6D51',
        highlight: '#DB9179',
        shadow: '#98523D',
        usage: 'Rose Copper',
      },
      {
        name: 'Copper Antique',
        hex: '#996515',
        highlight: '#BF8A3D',
        shadow: '#734C10',
        usage: 'Antique Copper',
      },
      {
        name: 'Copper Gold',
        hex: '#C9A048',
        highlight: '#E0C078',
        shadow: '#967836',
        usage: 'Golden Copper',
      },
      {
        name: 'Copper Brass',
        hex: '#CD9A47',
        highlight: '#E0BA77',
        shadow: '#9A7335',
        usage: 'Brass Copper',
      },
      {
        name: 'Copper Bronze Gold',
        hex: '#C4923A',
        highlight: '#DAB468',
        shadow: '#936E2C',
        usage: 'Bronze Gold',
      },
    ],
  },
  {
    title: '⭐ Favorites - Graphite',
    description: '그라파이트 베리에이션',
    colors: [
      {
        name: 'Graphite',
        hex: '#383838',
        highlight: '#5C5C5C',
        shadow: '#1F1F1F',
        usage: 'Apple Graphite',
      },
      {
        name: 'Graphite Light',
        hex: '#4A4A4A',
        highlight: '#6E6E6E',
        shadow: '#2D2D2D',
        usage: 'Light Graphite',
      },
      {
        name: 'Graphite Deep',
        hex: '#252525',
        highlight: '#424242',
        shadow: '#121212',
        usage: 'Dark Graphite',
      },
      {
        name: 'Graphite Warm',
        hex: '#3D3A38',
        highlight: '#615D5A',
        shadow: '#242220',
        usage: 'Warm Graphite',
      },
      {
        name: 'Graphite Cool',
        hex: '#36393D',
        highlight: '#5A5D61',
        shadow: '#1E2023',
        usage: 'Cool Graphite',
      },
    ],
  },
  {
    title: '⭐ Favorites - Azure',
    description: '애저 블루 베리에이션',
    colors: [
      {
        name: 'Azure Metallic',
        hex: '#007FFF',
        highlight: '#4DA6FF',
        shadow: '#0059B3',
        usage: 'Microsoft Azure',
      },
      {
        name: 'Azure Light',
        hex: '#4AA8FF',
        highlight: '#7DC2FF',
        shadow: '#367DBF',
        usage: 'Light Azure',
      },
      {
        name: 'Azure Deep',
        hex: '#0056B3',
        highlight: '#2E7DD6',
        shadow: '#003D80',
        usage: 'Deep Azure',
      },
      {
        name: 'Azure Sky',
        hex: '#87CEEB',
        highlight: '#B0E0F0',
        shadow: '#65A3B0',
        usage: 'Sky Azure',
      },
      {
        name: 'Azure Royal',
        hex: '#4169E1',
        highlight: '#6E8FE8',
        shadow: '#3050A8',
        usage: 'Royal Azure',
      },
    ],
  },
  {
    title: '⭐ Favorites - Amber',
    description: '앰버 베리에이션',
    colors: [
      {
        name: 'Amber Satin',
        hex: '#FFBF00',
        highlight: '#FFD54D',
        shadow: '#BF8F00',
        usage: 'Classic Amber',
      },
      {
        name: 'Amber Light',
        hex: '#FFD54F',
        highlight: '#FFE28A',
        shadow: '#BFA03B',
        usage: 'Light Amber',
      },
      {
        name: 'Amber Deep',
        hex: '#FF8C00',
        highlight: '#FFAA40',
        shadow: '#BF6900',
        usage: 'Dark Amber',
      },
      {
        name: 'Amber Honey',
        hex: '#EB9605',
        highlight: '#F2B340',
        shadow: '#B07104',
        usage: 'Honey Amber',
      },
      {
        name: 'Amber Gold',
        hex: '#DAA520',
        highlight: '#E8C04D',
        shadow: '#A37B18',
        usage: 'Golden Amber',
      },
    ],
  },
  {
    title: '⭐ Favorites - Obsidian',
    description: '옵시디언 블랙 베리에이션',
    colors: [
      {
        name: 'Obsidian',
        hex: '#0B1215',
        highlight: '#2A3439',
        shadow: '#000000',
        usage: 'Deep Black',
      },
      {
        name: 'Obsidian Blue',
        hex: '#0D1B2A',
        highlight: '#1E3A52',
        shadow: '#050D15',
        usage: 'Blue Black',
      },
      {
        name: 'Obsidian Purple',
        hex: '#1A0F1F',
        highlight: '#3D2847',
        shadow: '#0D0710',
        usage: 'Purple Black',
      },
      {
        name: 'Obsidian Green',
        hex: '#0F1A14',
        highlight: '#243D2E',
        shadow: '#070D0A',
        usage: 'Green Black',
      },
      {
        name: 'Obsidian Brown',
        hex: '#1C1410',
        highlight: '#3D2E27',
        shadow: '#0E0A08',
        usage: 'Brown Black',
      },
    ],
  },
  {
    title: '⭐ Favorites - Pearl',
    description: '펄/진주 베리에이션',
    colors: [
      {
        name: 'Pearl White',
        hex: '#F5F5F5',
        highlight: '#FFFFFF',
        shadow: '#C4C4C4',
        usage: 'Classic Pearl',
      },
      {
        name: 'Pearl Pink',
        hex: '#F8E8EC',
        highlight: '#FFFFFF',
        shadow: '#C4B4BA',
        usage: 'Pink Pearl',
      },
      {
        name: 'Pearl Blue',
        hex: '#E8F0F8',
        highlight: '#FFFFFF',
        shadow: '#B4C0C8',
        usage: 'Blue Pearl',
      },
      {
        name: 'Pearl Cream',
        hex: '#FFF8E7',
        highlight: '#FFFFFF',
        shadow: '#CCC6B8',
        usage: 'Cream Pearl',
      },
      {
        name: 'Pearl Gray',
        hex: '#E8E8E8',
        highlight: '#FFFFFF',
        shadow: '#B8B8B8',
        usage: 'Gray Pearl',
      },
    ],
  },
  {
    title: '⭐ Favorites - Sky Blue',
    description: '스카이 블루 베리에이션',
    colors: [
      {
        name: 'Sky Blue',
        hex: '#87CEEB',
        highlight: '#A8DDEF',
        shadow: '#65A3B0',
        usage: 'Classic Sky',
      },
      {
        name: 'Sky Light',
        hex: '#B0E0E6',
        highlight: '#D0F0F5',
        shadow: '#84A8AD',
        usage: 'Powder Blue',
      },
      {
        name: 'Sky Deep',
        hex: '#6CA6CD',
        highlight: '#8FC4E5',
        shadow: '#517C9A',
        usage: 'Steel Blue',
      },
      {
        name: 'Sky Aqua',
        hex: '#7EC8E3',
        highlight: '#A4DDEF',
        shadow: '#5E96AA',
        usage: 'Aqua Sky',
      },
      {
        name: 'Sky Pale',
        hex: '#ADD8E6',
        highlight: '#D0ECEF',
        shadow: '#82A2AD',
        usage: 'Light Blue',
      },
      {
        name: 'Sky Ocean',
        hex: '#4682B4',
        highlight: '#6FA4CC',
        shadow: '#346187',
        usage: 'Ocean Blue',
      },
      {
        name: 'Sky Mist',
        hex: '#B0C4DE',
        highlight: '#D0E0F0',
        shadow: '#8493A7',
        usage: 'Light Steel',
      },
      {
        name: 'Sky Ice',
        hex: '#E0FFFF',
        highlight: '#FFFFFF',
        shadow: '#A8BFBF',
        usage: 'Ice Blue',
      },
    ],
  },
  {
    title: '⭐ Favorites - Indigo',
    description: '인디고 베리에이션',
    colors: [
      {
        name: 'Indigo',
        hex: '#4B0082',
        highlight: '#7B30B2',
        shadow: '#380061',
        usage: 'Classic Indigo',
      },
      {
        name: 'Indigo Light',
        hex: '#6A5ACD',
        highlight: '#9089DD',
        shadow: '#4F439A',
        usage: 'Slate Blue',
      },
      {
        name: 'Indigo Deep',
        hex: '#310062',
        highlight: '#5A2092',
        shadow: '#240049',
        usage: 'Deep Indigo',
      },
      {
        name: 'Indigo Vivid',
        hex: '#5C00D2',
        highlight: '#8540E5',
        shadow: '#45009E',
        usage: 'Electric Indigo',
      },
      {
        name: 'Indigo Dye',
        hex: '#091F92',
        highlight: '#3A4DB5',
        shadow: '#07176D',
        usage: 'Dye Indigo',
      },
      {
        name: 'Indigo Navy',
        hex: '#2E0854',
        highlight: '#5A3080',
        shadow: '#22063F',
        usage: 'Navy Indigo',
      },
      {
        name: 'Indigo Purple',
        hex: '#4E008E',
        highlight: '#7A30B8',
        shadow: '#3A006A',
        usage: 'Purple Indigo',
      },
      {
        name: 'Indigo Iris',
        hex: '#5D3FD3',
        highlight: '#8570E0',
        shadow: '#462F9E',
        usage: 'Iris Blue',
      },
    ],
  },
  {
    title: 'Tech Green Metallics',
    description: 'NVIDIA, Razer 등 테크 브랜드 그린 메탈릭',
    colors: [
      {
        name: 'NVIDIA Green',
        hex: '#76B900',
        highlight: '#9FE029',
        shadow: '#4A7C00',
        usage: 'NVIDIA GPU, Brand',
      },
      {
        name: 'NVIDIA Dark',
        hex: '#4A7C2C',
        highlight: '#6BA33D',
        shadow: '#2D5018',
        usage: 'B200/H100 Surface',
      },
      {
        name: 'Razer Green',
        hex: '#44D62C',
        highlight: '#6EF54E',
        shadow: '#2A8A1B',
        usage: 'Razer Products',
      },
      {
        name: 'Matrix Green',
        hex: '#00FF41',
        highlight: '#4DFF7A',
        shadow: '#00B32D',
        usage: 'Cyber/Hacker Theme',
      },
      {
        name: 'Emerald Satin',
        hex: '#2E8B57',
        highlight: '#4CB277',
        shadow: '#1D5A38',
        usage: 'Premium Green',
      },
    ],
  },
  {
    title: 'Silver & Chrome',
    description: '알루미늄, 크롬, 스틸 메탈릭',
    colors: [
      {
        name: 'Brushed Aluminum',
        hex: '#A8A9AD',
        highlight: '#D4D5D9',
        shadow: '#76777A',
        usage: 'Apple Products',
      },
      {
        name: 'Chrome Silver',
        hex: '#C0C0C0',
        highlight: '#E8E8E8',
        shadow: '#8C8C8C',
        usage: 'Chrome Finish',
      },
      {
        name: 'Steel Gray',
        hex: '#71797E',
        highlight: '#9AA1A6',
        shadow: '#4A5054',
        usage: 'Industrial Steel',
      },
      {
        name: 'Titanium',
        hex: '#878681',
        highlight: '#B0AFA9',
        shadow: '#5C5B57',
        usage: 'Apple Titanium',
      },
      {
        name: 'Platinum',
        hex: '#E5E4E2',
        highlight: '#FFFFFF',
        shadow: '#BEBDBB',
        usage: 'Luxury Finish',
      },
    ],
  },
  {
    title: 'Gold & Bronze',
    description: '골드, 브론즈, 구리 메탈릭',
    colors: [
      {
        name: 'Champagne Gold',
        hex: '#D4AF37',
        highlight: '#F0D060',
        shadow: '#A68A2B',
        usage: 'Luxury Tech',
      },
      {
        name: 'Rose Gold',
        hex: '#B76E79',
        highlight: '#D9929C',
        shadow: '#8E4F58',
        usage: 'Apple Rose Gold',
      },
      {
        name: 'Bronze',
        hex: '#CD7F32',
        highlight: '#E5A55C',
        shadow: '#9A5F26',
        usage: 'Classic Bronze',
      },
      {
        name: 'Copper',
        hex: '#B87333',
        highlight: '#DA9959',
        shadow: '#8A5627',
        usage: 'Copper Finish',
      },
      {
        name: 'Antique Gold',
        hex: '#CFB53B',
        highlight: '#E8D063',
        shadow: '#9E892D',
        usage: 'Vintage Gold',
      },
    ],
  },
  {
    title: 'Space & Gunmetal',
    description: '스페이스 그레이, 건메탈 계열',
    colors: [
      {
        name: 'Space Gray',
        hex: '#52514F',
        highlight: '#7A7977',
        shadow: '#333231',
        usage: 'Apple Space Gray',
      },
      {
        name: 'Gunmetal',
        hex: '#2C3539',
        highlight: '#4D575C',
        shadow: '#1A2023',
        usage: 'Premium Dark',
      },
      {
        name: 'Graphite',
        hex: '#383838',
        highlight: '#5C5C5C',
        shadow: '#1F1F1F',
        usage: 'Apple Graphite',
      },
      {
        name: 'Midnight',
        hex: '#232946',
        highlight: '#3D4A70',
        shadow: '#141829',
        usage: 'Apple Midnight',
      },
      {
        name: 'Jet Black',
        hex: '#0A0A0A',
        highlight: '#2D2D2D',
        shadow: '#000000',
        usage: 'Glossy Black',
      },
    ],
  },
  {
    title: 'Blue Metallics',
    description: '블루 메탈릭, 아노다이즈드 블루',
    colors: [
      {
        name: 'Intel Blue',
        hex: '#0071C5',
        highlight: '#2E96E8',
        shadow: '#004D8C',
        usage: 'Intel Brand',
      },
      {
        name: 'Azure Metallic',
        hex: '#007FFF',
        highlight: '#4DA6FF',
        shadow: '#0059B3',
        usage: 'Microsoft Azure',
      },
      {
        name: 'Navy Satin',
        hex: '#1B2838',
        highlight: '#3A4D63',
        shadow: '#0E1620',
        usage: 'Steam Blue',
      },
      {
        name: 'Pacific Blue',
        hex: '#1D4F91',
        highlight: '#3A73B5',
        shadow: '#123460',
        usage: 'Apple Pacific',
      },
      {
        name: 'Cobalt',
        hex: '#0047AB',
        highlight: '#2670D4',
        shadow: '#002E70',
        usage: 'Deep Blue',
      },
    ],
  },
  {
    title: 'Purple & Violet',
    description: '퍼플 메탈릭, 바이올렛 아노다이즈드',
    colors: [
      {
        name: 'Deep Purple',
        hex: '#36013F',
        highlight: '#5E1A6B',
        shadow: '#1D0022',
        usage: 'Twitch Purple',
      },
      {
        name: 'Violet Satin',
        hex: '#7F00FF',
        highlight: '#A64DFF',
        shadow: '#5200A6',
        usage: 'Electric Violet',
      },
      {
        name: 'Amethyst',
        hex: '#9966CC',
        highlight: '#B894DB',
        shadow: '#6B47A3',
        usage: 'Gem Purple',
      },
      {
        name: 'Ultraviolet',
        hex: '#5F4B8B',
        highlight: '#8570AC',
        shadow: '#3E3160',
        usage: 'Pantone 2018',
      },
      {
        name: 'Orchid Metallic',
        hex: '#AF69EE',
        highlight: '#C99AF3',
        shadow: '#8643C9',
        usage: 'Light Purple',
      },
    ],
  },
  {
    title: 'Red & Crimson',
    description: '레드 메탈릭, 크림슨 새틴',
    colors: [
      {
        name: 'AMD Red',
        hex: '#ED1C24',
        highlight: '#F4595E',
        shadow: '#B81419',
        usage: 'AMD Brand',
      },
      {
        name: 'Ferrari Red',
        hex: '#FF2800',
        highlight: '#FF5C3D',
        shadow: '#BF1E00',
        usage: 'Racing Red',
      },
      {
        name: 'Crimson Satin',
        hex: '#DC143C',
        highlight: '#E85069',
        shadow: '#A30F2D',
        usage: 'Deep Red',
      },
      { name: 'Ruby', hex: '#9B111E', highlight: '#C43A47', shadow: '#6B0C15', usage: 'Gem Red' },
      {
        name: 'Burgundy Metallic',
        hex: '#800020',
        highlight: '#A83348',
        shadow: '#4D0013',
        usage: 'Wine Red',
      },
    ],
  },
  {
    title: 'Orange & Amber',
    description: '오렌지 메탈릭, 앰버 새틴',
    colors: [
      {
        name: 'Lamborghini Orange',
        hex: '#FF8700',
        highlight: '#FFAA40',
        shadow: '#BF6600',
        usage: 'Supercar Orange',
      },
      {
        name: 'Amber Satin',
        hex: '#FFBF00',
        highlight: '#FFD54D',
        shadow: '#BF8F00',
        usage: 'Warm Yellow',
      },
      {
        name: 'Tangerine',
        hex: '#FF9966',
        highlight: '#FFB899',
        shadow: '#BF7340',
        usage: 'Soft Orange',
      },
      {
        name: 'Burnt Orange',
        hex: '#CC5500',
        highlight: '#E87A33',
        shadow: '#993F00',
        usage: 'Deep Orange',
      },
      {
        name: 'Copper Penny',
        hex: '#AD6F69',
        highlight: '#C99590',
        shadow: '#845450',
        usage: 'Vintage Copper',
      },
    ],
  },
  {
    title: 'Cyan & Teal',
    description: '시안, 틸 메탈릭',
    colors: [
      {
        name: 'Cyan Electric',
        hex: '#00FFFF',
        highlight: '#66FFFF',
        shadow: '#00B3B3',
        usage: 'Neon Cyan',
      },
      {
        name: 'Teal Metallic',
        hex: '#008080',
        highlight: '#33A3A3',
        shadow: '#005959',
        usage: 'Classic Teal',
      },
      {
        name: 'Turquoise',
        hex: '#40E0D0',
        highlight: '#73E8DD',
        shadow: '#2DA89C',
        usage: 'Gem Turquoise',
      },
      {
        name: 'Aquamarine',
        hex: '#7FFFD4',
        highlight: '#A8FFE3',
        shadow: '#5CBFA0',
        usage: 'Light Aqua',
      },
      {
        name: 'Dark Cyan',
        hex: '#0E7490',
        highlight: '#3A9CB5',
        shadow: '#085166',
        usage: 'Deep Teal',
      },
    ],
  },
  {
    title: 'Pink & Magenta',
    description: '핑크, 마젠타 메탈릭',
    colors: [
      {
        name: 'Hot Pink',
        hex: '#FF69B4',
        highlight: '#FF9CCE',
        shadow: '#BF4F87',
        usage: 'Vibrant Pink',
      },
      {
        name: 'Magenta',
        hex: '#FF00FF',
        highlight: '#FF66FF',
        shadow: '#B300B3',
        usage: 'Electric Magenta',
      },
      {
        name: 'Fuchsia',
        hex: '#FF1493',
        highlight: '#FF5CB8',
        shadow: '#BF0F6E',
        usage: 'Deep Pink',
      },
      {
        name: 'Blush Satin',
        hex: '#DE5D83',
        highlight: '#E88BA3',
        shadow: '#A74662',
        usage: 'Soft Pink',
      },
      {
        name: 'Cerise',
        hex: '#DE3163',
        highlight: '#E86A8D',
        shadow: '#A7254A',
        usage: 'Cherry Pink',
      },
    ],
  },
  {
    title: 'Pastel Metallic',
    description: '파스텔 메탈릭 (소프트)',
    colors: [
      {
        name: 'Pastel Pink',
        hex: '#FFD1DC',
        highlight: '#FFE5EB',
        shadow: '#BF9DA5',
        usage: 'Soft Pink',
      },
      {
        name: 'Pastel Blue',
        hex: '#AEC6CF',
        highlight: '#CDDCE3',
        shadow: '#82959B',
        usage: 'Baby Blue',
      },
      {
        name: 'Pastel Green',
        hex: '#77DD77',
        highlight: '#9FE79F',
        shadow: '#59A659',
        usage: 'Mint Green',
      },
      {
        name: 'Pastel Yellow',
        hex: '#FDFD96',
        highlight: '#FEFEBB',
        shadow: '#BEBE71',
        usage: 'Cream Yellow',
      },
      {
        name: 'Pastel Lavender',
        hex: '#E6E6FA',
        highlight: '#F2F2FF',
        shadow: '#ACACBB',
        usage: 'Light Purple',
      },
    ],
  },
  {
    title: 'Luxury & Premium',
    description: '럭셔리 프리미엄 메탈릭',
    colors: [
      {
        name: 'Obsidian',
        hex: '#0B1215',
        highlight: '#2A3439',
        shadow: '#000000',
        usage: 'Deep Black',
      },
      {
        name: 'Pearl White',
        hex: '#F5F5F5',
        highlight: '#FFFFFF',
        shadow: '#C4C4C4',
        usage: 'Iridescent White',
      },
      {
        name: 'Champagne',
        hex: '#F7E7CE',
        highlight: '#FFF5E6',
        shadow: '#B9AD9A',
        usage: 'Soft Gold',
      },
      { name: 'Onyx', hex: '#353839', highlight: '#5A5D5E', shadow: '#1F2122', usage: 'Dark Gray' },
      {
        name: 'Ivory',
        hex: '#FFFFF0',
        highlight: '#FFFFFF',
        shadow: '#BFBFB4',
        usage: 'Warm White',
      },
    ],
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-white/10 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <IconCheck size={14} className="text-green-400" />
      ) : (
        <IconCopy size={14} className="text-white/40 hover:text-white/70" />
      )}
    </button>
  );
}

// Metallic Swatch with gradient simulation
function MetallicSwatch({ color }: { color: MetallicColor }) {
  return (
    <div className="group relative">
      {/* Metallic Color Swatch with gradient */}
      <div
        className="h-24 rounded-t-lg border border-white/10 transition-transform group-hover:scale-[1.02] relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${color.highlight} 0%, ${color.hex} 40%, ${color.shadow} 100%)`,
        }}
      >
        {/* Shine effect */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)`,
          }}
        />
        {/* Color name overlay */}
        <div className="absolute bottom-2 left-2 text-white/80 text-xs font-medium drop-shadow-lg">
          {color.name}
        </div>
      </div>

      {/* Color Info */}
      <div className="bg-neutral-900 rounded-b-lg p-3 border border-t-0 border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-sm font-medium truncate">{color.name}</span>
          <CopyButton text={color.hex} />
        </div>

        {/* Color Values */}
        <div className="grid grid-cols-3 gap-1 mb-2">
          <div className="text-center">
            <div
              className="w-full h-4 rounded-sm mb-1"
              style={{ backgroundColor: color.highlight }}
            />
            <span className="text-[9px] text-neutral-500">Highlight</span>
          </div>
          <div className="text-center">
            <div
              className="w-full h-4 rounded-sm mb-1 ring-1 ring-white/20"
              style={{ backgroundColor: color.hex }}
            />
            <span className="text-[9px] text-neutral-500">Base</span>
          </div>
          <div className="text-center">
            <div className="w-full h-4 rounded-sm mb-1" style={{ backgroundColor: color.shadow }} />
            <span className="text-[9px] text-neutral-500">Shadow</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-neutral-500">Base</span>
            <code className="text-neutral-300 font-mono">{color.hex}</code>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-neutral-500">Highlight</span>
            <code className="text-neutral-400 font-mono">{color.highlight}</code>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-neutral-500">Shadow</span>
            <code className="text-neutral-400 font-mono">{color.shadow}</code>
          </div>
        </div>
        <div className="text-[10px] text-neutral-500 mt-2 pt-2 border-t border-neutral-800">
          {color.usage}
        </div>
      </div>
    </div>
  );
}

// Metallic Button Component
function MetallicButton({
  color,
  variant = 'solid',
  size = 'md',
  children,
}: {
  color: MetallicColor;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  if (variant === 'outline') {
    return (
      <button
        className={`${sizeClasses[size]} rounded-lg font-medium transition-all duration-200 border-2 hover:scale-105 active:scale-95`}
        style={{
          borderColor: color.hex,
          color: color.hex,
          background: 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `linear-gradient(135deg, ${color.highlight}20, ${color.hex}30)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        {children}
      </button>
    );
  }

  if (variant === 'ghost') {
    return (
      <button
        className={`${sizeClasses[size]} rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95`}
        style={{
          color: color.hex,
          background: 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `${color.hex}20`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        {children}
      </button>
    );
  }

  // Solid variant with metallic gradient
  return (
    <button
      className={`${sizeClasses[size]} rounded-lg font-medium transition-all duration-200 relative overflow-hidden hover:scale-105 active:scale-95`}
      style={{
        background: `linear-gradient(135deg, ${color.highlight} 0%, ${color.hex} 50%, ${color.shadow} 100%)`,
        color: isLightColor(color.hex) ? '#1a1a1a' : '#ffffff',
        boxShadow: `0 2px 8px ${color.shadow}60, inset 0 1px 0 ${color.highlight}40`,
      }}
    >
      {/* Shine effect */}
      <span
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)`,
        }}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
}

// Helper to determine if a color is light
function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}

// Gradient Direction Types
type GradientDirection = '135deg' | '180deg' | '90deg' | '0deg' | '45deg' | 'radial';

const gradientDirections: { value: GradientDirection; label: string; description: string }[] = [
  { value: '180deg', label: '↓ Top to Bottom', description: '위에서 아래로 (자연광)' },
  { value: '135deg', label: '↘ Diagonal', description: '대각선 (기본)' },
  { value: '90deg', label: '→ Left to Right', description: '좌에서 우로' },
  { value: '0deg', label: '↑ Bottom to Top', description: '아래에서 위로 (역광)' },
  { value: '45deg', label: '↗ Diagonal Up', description: '대각선 위로' },
  { value: 'radial', label: '◉ Radial', description: '원형 (3D 효과)' },
];

// Metallic Button with Direction
function MetallicButtonWithDirection({
  color,
  direction = '135deg',
  size = 'md',
  children,
}: {
  color: MetallicColor;
  direction?: GradientDirection;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const getGradient = () => {
    if (direction === 'radial') {
      return `radial-gradient(ellipse at 30% 20%, ${color.highlight} 0%, ${color.hex} 50%, ${color.shadow} 100%)`;
    }
    return `linear-gradient(${direction}, ${color.highlight} 0%, ${color.hex} 50%, ${color.shadow} 100%)`;
  };

  return (
    <button
      className={`${sizeClasses[size]} rounded-lg font-medium transition-all duration-200 relative overflow-hidden hover:scale-105 active:scale-95`}
      style={{
        background: getGradient(),
        color: isLightColor(color.hex) ? '#1a1a1a' : '#ffffff',
        boxShadow: `0 2px 8px ${color.shadow}60, inset 0 1px 0 ${color.highlight}40`,
      }}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}

// Button Examples for a Group - Shows ALL colors
function ButtonExamples({ colors }: { colors: MetallicColor[] }) {
  const [selectedDirection, setSelectedDirection] = useState<GradientDirection>('180deg');

  return (
    <div className="mt-6 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
      <h4 className="text-sm font-medium text-neutral-300 mb-4">
        버튼 적용 예시 ({colors.length}개 컬러)
      </h4>

      {/* Gradient Direction Selector */}
      <div className="mb-5 p-3 bg-neutral-800/50 rounded-lg">
        <span className="text-xs text-neutral-400 mb-3 block">그라데이션 방향 선택</span>
        <div className="flex flex-wrap gap-2">
          {gradientDirections.map((dir) => (
            <button
              key={dir.value}
              onClick={() => setSelectedDirection(dir.value)}
              className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                selectedDirection === dir.value
                  ? 'bg-white text-neutral-900 font-medium'
                  : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
              }`}
            >
              {dir.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-neutral-500 mt-2">
          {gradientDirections.find((d) => d.value === selectedDirection)?.description}
        </p>
      </div>

      {/* Light Mode / Dark Mode Comparison */}
      <div className="mb-5">
        <span className="text-xs text-neutral-500 mb-3 block">라이트모드 / 다크모드 비교</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Light Mode */}
          <div className="p-4 rounded-xl bg-white border border-neutral-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-4 h-4 rounded-full bg-yellow-400 shadow-sm" />
              <span className="text-xs font-medium text-neutral-700">Light Mode</span>
            </div>
            <div className="space-y-3">
              {/* Solid */}
              <div>
                <span className="text-[10px] text-neutral-500 mb-1.5 block">Solid</span>
                <div className="flex flex-wrap gap-1.5">
                  {colors.map((color) => (
                    <MetallicButtonWithDirection
                      key={color.name + '-light-solid'}
                      color={color}
                      direction={selectedDirection}
                      size="sm"
                    >
                      {color.name.split(' ')[0]}
                    </MetallicButtonWithDirection>
                  ))}
                </div>
              </div>
              {/* Outline */}
              <div>
                <span className="text-[10px] text-neutral-500 mb-1.5 block">Outline</span>
                <div className="flex flex-wrap gap-1.5">
                  {colors.map((color) => (
                    <MetallicButton
                      key={color.name + '-light-outline'}
                      color={color}
                      variant="outline"
                      size="sm"
                    >
                      {color.name.split(' ')[0]}
                    </MetallicButton>
                  ))}
                </div>
              </div>
              {/* Ghost */}
              <div>
                <span className="text-[10px] text-neutral-500 mb-1.5 block">Ghost</span>
                <div className="flex flex-wrap gap-1.5">
                  {colors.map((color) => (
                    <MetallicButton
                      key={color.name + '-light-ghost'}
                      color={color}
                      variant="ghost"
                      size="sm"
                    >
                      {color.name.split(' ')[0]}
                    </MetallicButton>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dark Mode */}
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-700">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-4 h-4 rounded-full bg-indigo-500 shadow-sm" />
              <span className="text-xs font-medium text-neutral-200">Dark Mode</span>
            </div>
            <div className="space-y-3">
              {/* Solid */}
              <div>
                <span className="text-[10px] text-neutral-500 mb-1.5 block">Solid</span>
                <div className="flex flex-wrap gap-1.5">
                  {colors.map((color) => (
                    <MetallicButtonWithDirection
                      key={color.name + '-dark-solid'}
                      color={color}
                      direction={selectedDirection}
                      size="sm"
                    >
                      {color.name.split(' ')[0]}
                    </MetallicButtonWithDirection>
                  ))}
                </div>
              </div>
              {/* Outline */}
              <div>
                <span className="text-[10px] text-neutral-500 mb-1.5 block">Outline</span>
                <div className="flex flex-wrap gap-1.5">
                  {colors.map((color) => (
                    <MetallicButton
                      key={color.name + '-dark-outline'}
                      color={color}
                      variant="outline"
                      size="sm"
                    >
                      {color.name.split(' ')[0]}
                    </MetallicButton>
                  ))}
                </div>
              </div>
              {/* Ghost */}
              <div>
                <span className="text-[10px] text-neutral-500 mb-1.5 block">Ghost</span>
                <div className="flex flex-wrap gap-1.5">
                  {colors.map((color) => (
                    <MetallicButton
                      key={color.name + '-dark-ghost'}
                      color={color}
                      variant="ghost"
                      size="sm"
                    >
                      {color.name.split(' ')[0]}
                    </MetallicButton>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gray Scale Backgrounds */}
      <div className="mb-5">
        <span className="text-xs text-neutral-500 mb-3 block">
          다양한 배경색에서의 버튼 ({colors[0].name})
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {[
            { bg: '#ffffff', label: 'White', text: 'text-neutral-700' },
            { bg: '#f5f5f5', label: 'Gray 100', text: 'text-neutral-700' },
            { bg: '#e5e5e5', label: 'Gray 200', text: 'text-neutral-700' },
            { bg: '#404040', label: 'Gray 700', text: 'text-neutral-300' },
            { bg: '#262626', label: 'Gray 800', text: 'text-neutral-300' },
            { bg: '#0a0a0a', label: 'Gray 950', text: 'text-neutral-300' },
          ].map((item) => (
            <div
              key={item.bg}
              className="p-3 rounded-lg flex flex-col items-center gap-2"
              style={{ backgroundColor: item.bg }}
            >
              <MetallicButtonWithDirection
                color={colors[0]}
                direction={selectedDirection}
                size="sm"
              >
                Button
              </MetallicButtonWithDirection>
              <span className={`text-[9px] ${item.text}`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Direction Comparison */}
      <div className="mb-4 p-3 bg-neutral-800/30 rounded-lg">
        <span className="text-xs text-neutral-500 mb-3 block">방향별 비교 ({colors[0].name})</span>
        <div className="flex flex-wrap gap-3">
          {gradientDirections.map((dir) => (
            <div key={dir.value} className="flex flex-col items-center gap-1">
              <MetallicButtonWithDirection color={colors[0]} direction={dir.value} size="md">
                Button
              </MetallicButtonWithDirection>
              <span className="text-[10px] text-neutral-500">{dir.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Size Variations - using first color */}
      <div className="mb-5">
        <span className="text-xs text-neutral-500 mb-2 block">
          Size Variations ({colors[0].name})
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <MetallicButtonWithDirection color={colors[0]} direction={selectedDirection} size="sm">
            Small
          </MetallicButtonWithDirection>
          <MetallicButtonWithDirection color={colors[0]} direction={selectedDirection} size="md">
            Medium
          </MetallicButtonWithDirection>
          <MetallicButtonWithDirection color={colors[0]} direction={selectedDirection} size="lg">
            Large
          </MetallicButtonWithDirection>
          <span className="text-neutral-600 mx-2">|</span>
          <MetallicButton color={colors[0]} variant="outline" size="sm">
            Small
          </MetallicButton>
          <MetallicButton color={colors[0]} variant="outline" size="md">
            Medium
          </MetallicButton>
          <MetallicButton color={colors[0]} variant="outline" size="lg">
            Large
          </MetallicButton>
        </div>
      </div>

      {/* === 추가 시안들 === */}

      {/* Icon Buttons */}
      <div className="mb-5">
        <span className="text-xs text-neutral-500 mb-3 block">아이콘 버튼</span>
        <div className="flex flex-wrap gap-3">
          {colors.slice(0, 4).map((color, idx) => {
            const icons = [IconPlus, IconHeart, IconStar, IconBell];
            const Icon = icons[idx];
            return (
              <button
                key={color.name + '-icon'}
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                style={{
                  background: `linear-gradient(${selectedDirection}, ${color.highlight} 0%, ${color.hex} 50%, ${color.shadow} 100%)`,
                  boxShadow: `0 4px 12px ${color.shadow}50`,
                }}
              >
                <Icon
                  size={20}
                  className={isLightColor(color.hex) ? 'text-neutral-800' : 'text-white'}
                />
              </button>
            );
          })}
          <span className="text-neutral-600 mx-1">|</span>
          {colors.slice(0, 4).map((color, idx) => {
            const icons = [IconSettings, IconShare, IconBookmark, IconRefresh];
            const Icon = icons[idx];
            return (
              <button
                key={color.name + '-icon-outline'}
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 border-2"
                style={{
                  borderColor: color.hex,
                  color: color.hex,
                  background: 'transparent',
                }}
              >
                <Icon size={20} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Buttons with Icons */}
      <div className="mb-5">
        <span className="text-xs text-neutral-500 mb-3 block">아이콘 + 텍스트 버튼</span>
        <div className="flex flex-wrap gap-2">
          <button
            className="px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all hover:scale-105"
            style={{
              background: `linear-gradient(${selectedDirection}, ${colors[0].highlight} 0%, ${colors[0].hex} 50%, ${colors[0].shadow} 100%)`,
              color: isLightColor(colors[0].hex) ? '#1a1a1a' : '#ffffff',
            }}
          >
            <IconDownload size={18} />
            Download
          </button>
          <button
            className="px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all hover:scale-105"
            style={{
              background: `linear-gradient(${selectedDirection}, ${colors[1].highlight} 0%, ${colors[1].hex} 50%, ${colors[1].shadow} 100%)`,
              color: isLightColor(colors[1].hex) ? '#1a1a1a' : '#ffffff',
            }}
          >
            <IconSend size={18} />
            Send
          </button>
          <button
            className="px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all hover:scale-105"
            style={{
              background: `linear-gradient(${selectedDirection}, ${colors[2].highlight} 0%, ${colors[2].hex} 50%, ${colors[2].shadow} 100%)`,
              color: isLightColor(colors[2].hex) ? '#1a1a1a' : '#ffffff',
            }}
          >
            Save
            <IconCheck size={18} />
          </button>
          <button
            className="px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 border-2 transition-all hover:scale-105"
            style={{ borderColor: colors[0].hex, color: colors[0].hex }}
          >
            <IconEdit size={18} />
            Edit
          </button>
          <button
            className="px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 border-2 transition-all hover:scale-105"
            style={{ borderColor: colors[3].hex, color: colors[3].hex }}
          >
            <IconTrash size={18} />
            Delete
          </button>
        </div>
      </div>

      {/* Pill / Rounded Buttons */}
      <div className="mb-5">
        <span className="text-xs text-neutral-500 mb-3 block">Pill (둥근) 버튼</span>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.name + '-pill'}
              className="px-6 py-2.5 rounded-full font-medium transition-all hover:scale-105"
              style={{
                background: `linear-gradient(${selectedDirection}, ${color.highlight} 0%, ${color.hex} 50%, ${color.shadow} 100%)`,
                color: isLightColor(color.hex) ? '#1a1a1a' : '#ffffff',
                boxShadow: `0 4px 12px ${color.shadow}40`,
              }}
            >
              {color.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* States: Loading, Disabled */}
      <div className="mb-5">
        <span className="text-xs text-neutral-500 mb-3 block">상태 버튼 (Loading, Disabled)</span>
        <div className="flex flex-wrap gap-3">
          {/* Loading */}
          <button
            className="px-5 py-2.5 rounded-lg font-medium flex items-center gap-2"
            style={{
              background: `linear-gradient(${selectedDirection}, ${colors[0].highlight} 0%, ${colors[0].hex} 50%, ${colors[0].shadow} 100%)`,
              color: isLightColor(colors[0].hex) ? '#1a1a1a' : '#ffffff',
            }}
          >
            <IconLoader2 size={18} className="animate-spin" />
            Loading...
          </button>

          {/* Disabled Solid */}
          <button
            className="px-5 py-2.5 rounded-lg font-medium opacity-50 cursor-not-allowed"
            style={{
              background: `linear-gradient(${selectedDirection}, ${colors[1].highlight} 0%, ${colors[1].hex} 50%, ${colors[1].shadow} 100%)`,
              color: isLightColor(colors[1].hex) ? '#1a1a1a' : '#ffffff',
            }}
            disabled
          >
            Disabled
          </button>

          {/* Disabled Outline */}
          <button
            className="px-5 py-2.5 rounded-lg font-medium border-2 opacity-40 cursor-not-allowed"
            style={{ borderColor: colors[2].hex, color: colors[2].hex }}
            disabled
          >
            Disabled
          </button>
        </div>
      </div>

      {/* Button Groups */}
      <div className="mb-5">
        <span className="text-xs text-neutral-500 mb-3 block">버튼 그룹</span>
        <div className="flex flex-wrap gap-4">
          {/* Segmented */}
          <div
            className="flex rounded-lg overflow-hidden"
            style={{ boxShadow: `0 4px 12px ${colors[0].shadow}30` }}
          >
            <button
              className="px-4 py-2.5 font-medium border-r border-white/20"
              style={{
                background: `linear-gradient(${selectedDirection}, ${colors[0].highlight} 0%, ${colors[0].hex} 50%, ${colors[0].shadow} 100%)`,
                color: isLightColor(colors[0].hex) ? '#1a1a1a' : '#ffffff',
              }}
            >
              Left
            </button>
            <button
              className="px-4 py-2.5 font-medium border-r border-white/20"
              style={{
                background: `linear-gradient(${selectedDirection}, ${colors[0].highlight} 0%, ${colors[0].hex} 50%, ${colors[0].shadow} 100%)`,
                color: isLightColor(colors[0].hex) ? '#1a1a1a' : '#ffffff',
              }}
            >
              Center
            </button>
            <button
              className="px-4 py-2.5 font-medium"
              style={{
                background: `linear-gradient(${selectedDirection}, ${colors[0].highlight} 0%, ${colors[0].hex} 50%, ${colors[0].shadow} 100%)`,
                color: isLightColor(colors[0].hex) ? '#1a1a1a' : '#ffffff',
              }}
            >
              Right
            </button>
          </div>

          {/* Split Button */}
          <div
            className="flex rounded-lg overflow-hidden"
            style={{ boxShadow: `0 4px 12px ${colors[2].shadow}30` }}
          >
            <button
              className="px-5 py-2.5 font-medium"
              style={{
                background: `linear-gradient(${selectedDirection}, ${colors[2].highlight} 0%, ${colors[2].hex} 50%, ${colors[2].shadow} 100%)`,
                color: isLightColor(colors[2].hex) ? '#1a1a1a' : '#ffffff',
              }}
            >
              Save Changes
            </button>
            <button
              className="px-3 py-2.5 border-l border-white/20"
              style={{
                background: `linear-gradient(${selectedDirection}, ${colors[2].highlight} 0%, ${colors[2].hex} 50%, ${colors[2].shadow} 100%)`,
                color: isLightColor(colors[2].hex) ? '#1a1a1a' : '#ffffff',
              }}
            >
              <IconChevronDown size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="mb-5">
        <span className="text-xs text-neutral-500 mb-3 block">FAB (Floating Action Button)</span>
        <div className="flex flex-wrap items-end gap-4">
          {/* Mini FAB */}
          <div className="flex flex-col items-center gap-1">
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              style={{
                background: `linear-gradient(${selectedDirection}, ${colors[0].highlight} 0%, ${colors[0].hex} 50%, ${colors[0].shadow} 100%)`,
                boxShadow: `0 4px 12px ${colors[0].shadow}50`,
              }}
            >
              <IconPlus
                size={18}
                className={isLightColor(colors[0].hex) ? 'text-neutral-800' : 'text-white'}
              />
            </button>
            <span className="text-[10px] text-neutral-500">Mini</span>
          </div>

          {/* Regular FAB */}
          <div className="flex flex-col items-center gap-1">
            <button
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              style={{
                background: `linear-gradient(${selectedDirection}, ${colors[1].highlight} 0%, ${colors[1].hex} 50%, ${colors[1].shadow} 100%)`,
                boxShadow: `0 6px 16px ${colors[1].shadow}50`,
              }}
            >
              <IconPlus
                size={24}
                className={isLightColor(colors[1].hex) ? 'text-neutral-800' : 'text-white'}
              />
            </button>
            <span className="text-[10px] text-neutral-500">Regular</span>
          </div>

          {/* Extended FAB */}
          <div className="flex flex-col items-center gap-1">
            <button
              className="px-6 h-14 rounded-full flex items-center gap-2 font-medium transition-all hover:scale-105 active:scale-95"
              style={{
                background: `linear-gradient(${selectedDirection}, ${colors[2].highlight} 0%, ${colors[2].hex} 50%, ${colors[2].shadow} 100%)`,
                boxShadow: `0 6px 16px ${colors[2].shadow}50`,
                color: isLightColor(colors[2].hex) ? '#1a1a1a' : '#ffffff',
              }}
            >
              <IconPlus size={20} />
              Create New
            </button>
            <span className="text-[10px] text-neutral-500">Extended</span>
          </div>
        </div>
      </div>

      {/* Card with Buttons */}
      <div className="mb-5">
        <span className="text-xs text-neutral-500 mb-3 block">카드 내 버튼 예시</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Light Card */}
          <div className="bg-white rounded-xl p-5 border border-neutral-200">
            <h5 className="text-neutral-800 font-semibold mb-2">Premium Plan</h5>
            <p className="text-neutral-500 text-sm mb-4">Get access to all features</p>
            <div className="flex gap-2">
              <button
                className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(${selectedDirection}, ${colors[0].highlight} 0%, ${colors[0].hex} 50%, ${colors[0].shadow} 100%)`,
                  color: isLightColor(colors[0].hex) ? '#1a1a1a' : '#ffffff',
                }}
              >
                Upgrade
              </button>
              <button
                className="px-4 py-2.5 rounded-lg font-medium border-2 transition-all hover:scale-[1.02]"
                style={{ borderColor: colors[0].hex, color: colors[0].hex }}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Dark Card */}
          <div className="bg-neutral-800 rounded-xl p-5 border border-neutral-700">
            <h5 className="text-white font-semibold mb-2">Enterprise Plan</h5>
            <p className="text-neutral-400 text-sm mb-4">Custom solutions for teams</p>
            <div className="flex gap-2">
              <button
                className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(${selectedDirection}, ${colors[1].highlight} 0%, ${colors[1].hex} 50%, ${colors[1].shadow} 100%)`,
                  color: isLightColor(colors[1].hex) ? '#1a1a1a' : '#ffffff',
                }}
              >
                Contact Sales
              </button>
              <button
                className="px-4 py-2.5 rounded-lg font-medium border-2 transition-all hover:scale-[1.02]"
                style={{ borderColor: colors[1].hex, color: colors[1].hex }}
              >
                Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Social / Brand Buttons */}
      <div>
        <span className="text-xs text-neutral-500 mb-3 block">소셜/브랜드 스타일 버튼</span>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.name + '-brand'}
              className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105 hover:-translate-y-1"
              style={{
                background: `linear-gradient(${selectedDirection}, ${color.highlight} 0%, ${color.hex} 40%, ${color.shadow} 100%)`,
                color: isLightColor(color.hex) ? '#1a1a1a' : '#ffffff',
                boxShadow: `0 8px 24px ${color.shadow}40, inset 0 1px 0 ${color.highlight}50`,
              }}
            >
              <IconStar size={18} />
              {color.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetallicGroup({ group }: { group: MetallicGroup }) {
  return (
    <div className="mb-10">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">{group.title}</h2>
        <p className="text-sm text-neutral-400">{group.description}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {group.colors.map((color) => (
          <MetallicSwatch key={color.hex + color.name} color={color} />
        ))}
      </div>

      {/* Button Examples */}
      <ButtonExamples colors={group.colors} />
    </div>
  );
}

// Metallic Sphere Preview
function MetallicSphere({ color, size = 80 }: { color: MetallicColor; size?: number }) {
  return (
    <div
      className="rounded-full relative"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${color.highlight}, ${color.hex} 50%, ${color.shadow} 100%)`,
        boxShadow: `
          inset -${size / 10}px -${size / 10}px ${size / 4}px rgba(0,0,0,0.4),
          inset ${size / 20}px ${size / 20}px ${size / 10}px rgba(255,255,255,0.2),
          ${size / 20}px ${size / 10}px ${size / 4}px rgba(0,0,0,0.3)
        `,
      }}
    >
      {/* Highlight */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.3,
          height: size * 0.2,
          top: size * 0.15,
          left: size * 0.2,
          background: `radial-gradient(ellipse, rgba(255,255,255,0.8), transparent)`,
          filter: 'blur(2px)',
        }}
      />
    </div>
  );
}

// 3D Preview Section
function MetallicPreview() {
  const previewColors = [
    { name: 'NVIDIA Green', hex: '#76B900', highlight: '#9FE029', shadow: '#4A7C00', usage: '' },
    { name: 'Space Gray', hex: '#52514F', highlight: '#7A7977', shadow: '#333231', usage: '' },
    { name: 'Rose Gold', hex: '#B76E79', highlight: '#D9929C', shadow: '#8E4F58', usage: '' },
    { name: 'Chrome', hex: '#C0C0C0', highlight: '#E8E8E8', shadow: '#8C8C8C', usage: '' },
    { name: 'Intel Blue', hex: '#0071C5', highlight: '#2E96E8', shadow: '#004D8C', usage: '' },
    { name: 'AMD Red', hex: '#ED1C24', highlight: '#F4595E', shadow: '#B81419', usage: '' },
  ];

  return (
    <div className="mb-10 p-6 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-xl border border-neutral-700">
      <h2 className="text-xl font-semibold text-white mb-4">3D Metallic Preview</h2>
      <p className="text-sm text-neutral-400 mb-6">
        메탈릭 컬러의 하이라이트, 베이스, 섀도우를 활용한 구체 렌더링
      </p>
      <div className="flex flex-wrap gap-6 justify-center items-center">
        {previewColors.map((color) => (
          <div key={color.name} className="flex flex-col items-center gap-2">
            <MetallicSphere color={color} size={80} />
            <span className="text-xs text-neutral-400">{color.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Gradient Bar Preview
function GradientBars() {
  const gradients = [
    { name: 'NVIDIA B200', colors: ['#9FE029', '#76B900', '#4A7C2C', '#2D5018'] },
    { name: 'Apple Silver', colors: ['#FFFFFF', '#D4D5D9', '#A8A9AD', '#76777A'] },
    { name: 'Gold Premium', colors: ['#F0D060', '#D4AF37', '#A68A2B', '#7A6420'] },
    { name: 'Gunmetal Dark', colors: ['#5C5C5C', '#383838', '#2C3539', '#1A2023'] },
    { name: 'Ocean Blue', colors: ['#4DA6FF', '#007FFF', '#0059B3', '#003D7A'] },
    { name: 'Racing Red', colors: ['#FF5C3D', '#FF2800', '#BF1E00', '#801400'] },
  ];

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-white mb-4">Metallic Gradient Bars</h2>
      <p className="text-sm text-neutral-400 mb-6">메탈릭 마감에서 관찰되는 색상 그라데이션</p>
      <div className="space-y-4">
        {gradients.map((grad) => (
          <div key={grad.name} className="flex items-center gap-4">
            <span className="text-sm text-neutral-300 w-32">{grad.name}</span>
            <div className="flex-1 h-8 rounded-lg overflow-hidden flex">
              {grad.colors.map((color, idx) => (
                <div
                  key={idx}
                  className="flex-1 relative group cursor-pointer"
                  style={{ backgroundColor: color }}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-white drop-shadow-lg">
                    {color}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Thaki Cloud Color Example Section
type ColorSchemeKey =
  // Graphite + Favorites
  | 'graphiteRoyal'
  | 'graphiteEmerald'
  | 'graphiteCopper'
  | 'graphiteAzure'
  | 'graphiteAmber'
  | 'graphiteObsidian'
  | 'graphitePearl'
  | 'graphiteNvidia'
  | 'graphiteSkyblue'
  | 'graphiteIndigo';

function ThakiCloudColorExample() {
  const [activeTab, setActiveTab] = useState<ColorSchemeKey>('graphiteRoyal');

  const colorSchemes: Record<
    ColorSchemeKey,
    {
      name: string;
      primary: string;
      primaryName: string;
      secondary: string;
      secondaryName: string;
      accent: string;
      accentName: string;
      dark: string;
      darkName: string;
      light: string;
      text: string;
      category: 'graphite';
    }
  > = {
    // Graphite + Royal Blue
    // Graphite + Royal Blue
    graphiteRoyal: {
      name: 'Graphite + Royal Blue',
      primary: '#383838',
      primaryName: 'Graphite',
      secondary: '#252525',
      secondaryName: 'Graphite Deep',
      accent: '#4169E1',
      accentName: 'Royal Blue',
      dark: '#1F1F1F',
      darkName: 'Graphite Shadow',
      light: '#F0F4FF',
      text: '#3050A8',
      category: 'graphite',
    },
    // Graphite + Emerald
    graphiteEmerald: {
      name: 'Graphite + Emerald',
      primary: '#383838',
      primaryName: 'Graphite',
      secondary: '#252525',
      secondaryName: 'Graphite Deep',
      accent: '#50C878',
      accentName: 'Emerald',
      dark: '#1F1F1F',
      darkName: 'Graphite Shadow',
      light: '#F0FDF4',
      text: '#166534',
      category: 'graphite',
    },
    // Graphite + Copper
    graphiteCopper: {
      name: 'Graphite + Copper',
      primary: '#3D3A38',
      primaryName: 'Warm Graphite',
      secondary: '#252525',
      secondaryName: 'Graphite Deep',
      accent: '#B87333',
      accentName: 'Copper',
      dark: '#1F1F1F',
      darkName: 'Graphite Shadow',
      light: '#FEF7F0',
      text: '#8A5627',
      category: 'graphite',
    },
    // Graphite + Azure
    graphiteAzure: {
      name: 'Graphite + Azure',
      primary: '#36393D',
      primaryName: 'Cool Graphite',
      secondary: '#252525',
      secondaryName: 'Graphite Deep',
      accent: '#007FFF',
      accentName: 'Azure',
      dark: '#1F1F1F',
      darkName: 'Graphite Shadow',
      light: '#F0F8FF',
      text: '#0059B3',
      category: 'graphite',
    },
    // Graphite + Amber
    graphiteAmber: {
      name: 'Graphite + Amber',
      primary: '#383838',
      primaryName: 'Graphite',
      secondary: '#252525',
      secondaryName: 'Graphite Deep',
      accent: '#FFBF00',
      accentName: 'Amber',
      dark: '#1F1F1F',
      darkName: 'Graphite Shadow',
      light: '#FFFBEB',
      text: '#BF8F00',
      category: 'graphite',
    },
    // Graphite + Obsidian (Monochrome Dark)
    graphiteObsidian: {
      name: 'Graphite + Obsidian',
      primary: '#383838',
      primaryName: 'Graphite',
      secondary: '#0B1215',
      secondaryName: 'Obsidian',
      accent: '#00FFD1',
      accentName: 'Teal Glow',
      dark: '#050D15',
      darkName: 'Obsidian Shadow',
      light: '#E8F4F8',
      text: '#0D4B4B',
      category: 'graphite',
    },
    // Graphite + Pearl
    graphitePearl: {
      name: 'Graphite + Pearl',
      primary: '#383838',
      primaryName: 'Graphite',
      secondary: '#252525',
      secondaryName: 'Graphite Deep',
      accent: '#F5F5F5',
      accentName: 'Pearl White',
      dark: '#1F1F1F',
      darkName: 'Graphite Shadow',
      light: '#FAFAFA',
      text: '#383838',
      category: 'graphite',
    },
    // Graphite + NVIDIA Green
    graphiteNvidia: {
      name: 'Graphite + NVIDIA',
      primary: '#383838',
      primaryName: 'Graphite',
      secondary: '#252525',
      secondaryName: 'Graphite Deep',
      accent: '#76B900',
      accentName: 'NVIDIA Green',
      dark: '#1F1F1F',
      darkName: 'Graphite Shadow',
      light: '#F5F9F0',
      text: '#4A7C00',
      category: 'graphite',
    },
    // Graphite + Sky Blue
    graphiteSkyblue: {
      name: 'Graphite + Sky Blue',
      primary: '#383838',
      primaryName: 'Graphite',
      secondary: '#252525',
      secondaryName: 'Graphite Deep',
      accent: '#87CEEB',
      accentName: 'Sky Blue',
      dark: '#1F1F1F',
      darkName: 'Graphite Shadow',
      light: '#F0F8FF',
      text: '#4A90A4',
      category: 'graphite',
    },
    // Graphite + Indigo
    graphiteIndigo: {
      name: 'Graphite + Indigo',
      primary: '#383838',
      primaryName: 'Graphite',
      secondary: '#252525',
      secondaryName: 'Graphite Deep',
      accent: '#4B0082',
      accentName: 'Indigo',
      dark: '#1F1F1F',
      darkName: 'Graphite Shadow',
      light: '#F5F0FF',
      text: '#4B0082',
      category: 'graphite',
    },
  };

  const scheme = colorSchemes[activeTab];

  return (
    <div className="mb-8 p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
      <h2 className="text-2xl font-bold text-white mb-2">🎨 Graphite 기반 컬러 조합</h2>
      <p className="text-neutral-400 mb-6">
        Graphite를 Primary로, Favorites 컬러를 Accent로 조합한 10가지 테마
      </p>

      {/* Tab Selector - Graphite + Favorites */}
      <div className="mb-6">
        <div className="text-sm text-neutral-300 font-medium mb-3">
          🖤 Graphite + ⭐ Favorites 컬러 조합
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(colorSchemes).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as ColorSchemeKey)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                activeTab === key
                  ? 'text-white ring-2 ring-white/50'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
              style={activeTab === key ? { backgroundColor: value.primary } : {}}
            >
              <span
                className="w-3 h-3 rounded-full border border-white/30"
                style={{ backgroundColor: value.accent }}
              />
              {value.name}
            </button>
          ))}
        </div>
      </div>

      {/* Color Tokens Display */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <div className="text-center">
          <div
            className="w-full h-16 rounded-lg mb-2 shadow-lg"
            style={{ backgroundColor: scheme.primary }}
          />
          <div className="text-xs text-white font-medium">{scheme.primaryName}</div>
          <div className="text-xs text-neutral-500">{scheme.primary}</div>
        </div>
        <div className="text-center">
          <div
            className="w-full h-16 rounded-lg mb-2 shadow-lg"
            style={{ backgroundColor: scheme.secondary }}
          />
          <div className="text-xs text-white font-medium">{scheme.secondaryName}</div>
          <div className="text-xs text-neutral-500">{scheme.secondary}</div>
        </div>
        <div className="text-center">
          <div
            className="w-full h-16 rounded-lg mb-2 shadow-lg"
            style={{ backgroundColor: scheme.accent }}
          />
          <div className="text-xs text-white font-medium">{scheme.accentName}</div>
          <div className="text-xs text-neutral-500">{scheme.accent}</div>
        </div>
        <div className="text-center">
          <div
            className="w-full h-16 rounded-lg mb-2 shadow-lg"
            style={{ backgroundColor: scheme.dark }}
          />
          <div className="text-xs text-white font-medium">{scheme.darkName}</div>
          <div className="text-xs text-neutral-500">{scheme.dark}</div>
        </div>
        <div className="text-center">
          <div
            className="w-full h-16 rounded-lg mb-2 shadow-lg border border-neutral-700"
            style={{ backgroundColor: scheme.light }}
          />
          <div className="text-xs text-white font-medium">Light BG</div>
          <div className="text-xs text-neutral-500">{scheme.light}</div>
        </div>
        <div className="text-center">
          <div
            className="w-full h-16 rounded-lg mb-2 shadow-lg"
            style={{ backgroundColor: scheme.text }}
          />
          <div className="text-xs text-white font-medium">Text</div>
          <div className="text-xs text-neutral-500">{scheme.text}</div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Light Mode Preview */}
        <div className="rounded-xl p-6 shadow-xl" style={{ backgroundColor: scheme.light }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: scheme.dark }}>
            ☀️ Light Mode Preview
          </h3>

          {/* Navigation */}
          <nav
            className="flex items-center justify-between p-3 rounded-lg mb-4"
            style={{ backgroundColor: scheme.primary }}
          >
            <span className="text-white font-bold text-sm">Thaki Cloud</span>
            <div className="flex gap-2">
              <span className="text-white/80 text-xs">Products</span>
              <span className="text-white/80 text-xs">Solutions</span>
              <span className="text-white/80 text-xs">Contact</span>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="mb-4">
            <h4 className="text-xl font-bold mb-2" style={{ color: scheme.text }}>
              Sovereign AI Infrastructure
            </h4>
            <p className="text-sm mb-3" style={{ color: scheme.text, opacity: 0.7 }}>
              Cost-effective AI-native infrastructure with openness and flexibility.
            </p>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-transform hover:scale-105"
                style={{ backgroundColor: scheme.primary }}
              >
                Get Started
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium border-2 transition-transform hover:scale-105"
                style={{
                  borderColor: scheme.primary,
                  color: scheme.primary,
                  backgroundColor: 'transparent',
                }}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-2">
            <div
              className="p-3 rounded-lg border"
              style={{ borderColor: scheme.primary + '30', backgroundColor: scheme.primary + '10' }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 text-white"
                style={{ backgroundColor: scheme.accent }}
              >
                ☁️
              </div>
              <div className="text-xs font-medium" style={{ color: scheme.text }}>
                Cloud Suite
              </div>
            </div>
            <div
              className="p-3 rounded-lg border"
              style={{ borderColor: scheme.primary + '30', backgroundColor: scheme.primary + '10' }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 text-white"
                style={{ backgroundColor: scheme.secondary }}
              >
                🤖
              </div>
              <div className="text-xs font-medium" style={{ color: scheme.text }}>
                AI Platform
              </div>
            </div>
          </div>
        </div>

        {/* Dark Mode Preview */}
        <div className="rounded-xl p-6 shadow-xl" style={{ backgroundColor: scheme.dark }}>
          <h3 className="text-lg font-bold mb-4 text-white">🌙 Dark Mode Preview</h3>

          {/* Navigation */}
          <nav
            className="flex items-center justify-between p-3 rounded-lg mb-4"
            style={{ backgroundColor: scheme.secondary }}
          >
            <span className="text-white font-bold text-sm">Thaki Cloud</span>
            <div className="flex gap-2">
              <span className="text-white/70 text-xs">Products</span>
              <span className="text-white/70 text-xs">Solutions</span>
              <span className="text-white/70 text-xs">Contact</span>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="mb-4">
            <h4 className="text-xl font-bold mb-2 text-white">Sovereign AI Infrastructure</h4>
            <p className="text-sm mb-3 text-white/60">
              Cost-effective AI-native infrastructure with openness and flexibility.
            </p>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium transition-transform hover:scale-105"
                style={{ backgroundColor: scheme.accent, color: scheme.dark }}
              >
                Get Started
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium border transition-transform hover:scale-105"
                style={{
                  borderColor: scheme.accent,
                  color: scheme.accent,
                  backgroundColor: 'transparent',
                }}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: scheme.secondary }}
            >
              <div className="text-lg font-bold" style={{ color: scheme.accent }}>
                99.9%
              </div>
              <div className="text-xs text-white/60">Uptime</div>
            </div>
            <div
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: scheme.secondary }}
            >
              <div className="text-lg font-bold" style={{ color: scheme.accent }}>
                50+
              </div>
              <div className="text-xs text-white/60">Regions</div>
            </div>
            <div
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: scheme.secondary }}
            >
              <div className="text-lg font-bold" style={{ color: scheme.accent }}>
                24/7
              </div>
              <div className="text-xs text-white/60">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Button Examples */}
      <div className="mt-6 p-4 rounded-xl bg-neutral-800/50">
        <h3 className="text-sm font-semibold text-white mb-3">Button Variants</h3>
        <div className="flex flex-wrap gap-3">
          <button
            className="px-4 py-2 rounded-lg text-white text-sm font-medium shadow-lg transition-all hover:opacity-90"
            style={{ backgroundColor: scheme.primary }}
          >
            Primary
          </button>
          <button
            className="px-4 py-2 rounded-lg text-white text-sm font-medium shadow-lg transition-all hover:opacity-90"
            style={{ backgroundColor: scheme.secondary }}
          >
            Secondary
          </button>
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all hover:opacity-90"
            style={{ backgroundColor: scheme.accent, color: scheme.dark }}
          >
            Accent
          </button>
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all hover:opacity-90"
            style={{ borderColor: scheme.primary, color: scheme.primary }}
          >
            Outline
          </button>
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, ${scheme.primary} 0%, ${scheme.accent} 100%)`,
              color: 'white',
            }}
          >
            Gradient
          </button>
        </div>
      </div>
    </div>
  );
}

// CSS Code Section
function CSSCodeSection() {
  return (
    <div className="mt-8 p-6 bg-neutral-900 rounded-lg border border-neutral-800">
      <h2 className="text-xl font-semibold text-white mb-4">CSS Metallic Gradients</h2>
      <pre className="text-sm text-neutral-300 font-mono overflow-x-auto">
        {`/* Metallic Gradient Mixins */

/* NVIDIA Green Metallic */
.metallic-nvidia {
  background: linear-gradient(135deg, 
    #9FE029 0%, 
    #76B900 40%, 
    #4A7C00 100%
  );
}

/* Chrome/Silver Metallic */
.metallic-chrome {
  background: linear-gradient(135deg, 
    #E8E8E8 0%, 
    #C0C0C0 30%, 
    #A8A9AD 60%, 
    #8C8C8C 100%
  );
}

/* Gold Metallic */
.metallic-gold {
  background: linear-gradient(135deg, 
    #F0D060 0%, 
    #D4AF37 40%, 
    #A68A2B 100%
  );
}

/* Space Gray Metallic */
.metallic-space-gray {
  background: linear-gradient(135deg, 
    #7A7977 0%, 
    #52514F 40%, 
    #333231 100%
  );
}

/* Metallic Shine Effect */
.metallic-shine {
  position: relative;
  overflow: hidden;
}
.metallic-shine::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg, 
    transparent 30%, 
    rgba(255,255,255,0.3) 50%, 
    transparent 70%
  );
  pointer-events: none;
}

/* 3D Metallic Sphere */
.metallic-sphere {
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    var(--highlight),
    var(--base) 50%,
    var(--shadow) 100%
  );
  box-shadow: 
    inset -8px -8px 20px rgba(0,0,0,0.4),
    inset 4px 4px 10px rgba(255,255,255,0.2),
    4px 8px 20px rgba(0,0,0,0.3);
}`}
      </pre>
    </div>
  );
}

export default function MetallicPalettePage() {
  return (
    <VStack className="min-h-screen w-full bg-neutral-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-800 px-6 py-3">
        <Link
          to="/color-palette"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
        >
          <IconArrowLeft size={16} />
          <span className="text-sm">Back to Color Palette</span>
        </Link>
      </div>

      <VStack className="flex-1 overflow-auto p-6 gap-6">
        {/* Title */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-white mb-2">Metallic & Satin Color Palette</h1>
          <p className="text-neutral-400">
            프리미엄 테크 제품 및 산업 디자인에 사용되는 메탈릭/새틴 마감 컬러 팔레트
          </p>
        </div>

        {/* Thaki Cloud Color Example */}
        <ThakiCloudColorExample />

        {/* 3D Preview */}
        <MetallicPreview />

        {/* Gradient Bars */}
        <GradientBars />

        {/* Color Palette Groups */}
        {metallicPalette.map((group) => (
          <MetallicGroup key={group.title} group={group} />
        ))}

        {/* CSS Code */}
        <CSSCodeSection />
      </VStack>
    </VStack>
  );
}
