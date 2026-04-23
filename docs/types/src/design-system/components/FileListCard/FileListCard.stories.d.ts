import { StoryObj } from '@storybook/react-vite';
import { FileListCard, FileItem } from './FileListCard';
/**
 * # FileListCard
 *
 * 업로드된 파일 목록을 표시하는 카드 컴포넌트입니다.
 * FileListSection은 라벨, 업로드 버튼, 에러 메시지를 포함하는 상위 레이아웃 컴포넌트입니다.
 *
 * ## 언제 사용하나요?
 * - 파일 업로드 후 업로드된 파일 목록을 표시할 때
 * - 인증서, 이미지, 설정 파일 등의 첨부 파일 관리 시
 *
 * ## 기능
 * - **파일 목록 표시**: 파일 이름, 태그(크기/개수 등), 설명 표시
 * - **삭제 버튼**: onRemove 콜백으로 개별 파일 제거
 * - **빈 상태**: 파일이 없을 때 메시지 표시
 * - **FileListSection**: 라벨 + 업로드 버튼 + 에러 + FileListCard 조합
 */
declare const meta: {
    title: string;
    component: typeof FileListCard;
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
        emptyMessage: {
            control: "text";
            description: string;
            table: {
                type: {
                    summary: string;
                };
                defaultValue: {
                    summary: string;
                };
            };
        };
    };
    decorators: ((Story: import('storybook/internal/csf').PartialStoryFn<import('@storybook/react').ReactRenderer, {
        files: FileItem[];
        onRemove?: ((id: string) => void) | undefined;
        emptyMessage?: string | undefined;
        className?: string | undefined;
    }>) => import("react/jsx-runtime").JSX.Element)[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const WithDescriptions: Story;
export declare const SingleFile: Story;
export declare const Empty: Story;
export declare const Removable: Story;
export declare const Section: Story;
export declare const SectionWithError: Story;
export declare const SectionEmpty: Story;
