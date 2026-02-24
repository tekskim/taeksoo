import { default as React } from 'react';
import { StoryObj } from '@storybook/react-vite';
/**
 * # ContextMenu
 *
 * 우클릭 또는 클릭으로 열리는 컨텍스트 메뉴 컴포넌트입니다.
 *
 * ## 언제 사용하나요?
 * - 테이블 행이나 카드에서 추가 액션 제공
 * - 파일/폴더 관리 메뉴
 * - 편집기에서 컨텍스트 액션
 * - 드롭다운 메뉴 대체
 *
 * ## 기능
 * - **trigger**: 'contextmenu' (우클릭) 또는 'click' (클릭)
 * - **submenu**: 중첩 서브메뉴 지원
 * - **divider**: 항목 구분선
 * - **status**: 'default' 또는 'danger' (삭제 등)
 * - **tooltip**: 항목에 툴팁 추가
 * - **icon**: 항목 앞에 아이콘 표시
 *
 * ## 접근성
 * - Escape 키로 메뉴 닫기
 * - 외부 클릭으로 메뉴 닫기
 * - 포커스 트랩 지원
 */
declare const meta: {
    title: string;
    component: React.FC<import('./ContextMenu').ContextMenuProps>;
    parameters: {
        layout: string;
        docs: {
            description: {
                component: string;
            };
        };
    };
    tags: string[];
    argTypes: {
        trigger: {
            control: "select";
            options: string[];
            description: string;
        };
        disabled: {
            control: "boolean";
            description: string;
        };
        align: {
            control: "select";
            options: string[];
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const ClickTrigger: Story;
export declare const WithIcons: Story;
export declare const WithDividers: Story;
export declare const WithSubmenu: Story;
export declare const WithDisabledItems: Story;
export declare const WithTooltips: Story;
export declare const RightAligned: Story;
export declare const Disabled: Story;
export declare const TableRowMenu: Story;
export declare const FileExplorerMenu: Story;
