import { ReactNode } from 'react';
export interface FileItem {
    id: string;
    name: string;
    /** Secondary info tokens separated by dividers (e.g. ["2.5 MB", "10 files"]) */
    tags?: string[];
    /** Simple description text, used when tags is not provided */
    description?: string;
}
export interface FileListCardProps {
    files: FileItem[];
    onRemove?: (id: string) => void;
    emptyMessage?: string;
    className?: string;
}
export declare function FileListCard({ files, onRemove, emptyMessage, className, }: FileListCardProps): import("react/jsx-runtime").JSX.Element | null;
export interface FileListSectionProps {
    label?: string;
    required?: boolean;
    files: FileItem[];
    onRemove?: (id: string) => void;
    onUpload?: () => void;
    uploadLabel?: string;
    uploadIcon?: ReactNode;
    error?: string | null;
    emptyMessage?: string;
    className?: string;
}
export declare function FileListSection({ label, required, files, onRemove, onUpload, uploadLabel, uploadIcon, error, emptyMessage, className, }: FileListSectionProps): import("react/jsx-runtime").JSX.Element;
