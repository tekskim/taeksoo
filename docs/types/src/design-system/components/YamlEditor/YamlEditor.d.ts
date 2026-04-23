import { ReactNode } from 'react';
export interface YamlEditorProps {
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
    className?: string;
    /** Extra controls after the built-in copy button (e.g. download). */
    trailingActions?: ReactNode;
}
export declare function YamlEditor({ value, onChange, readOnly, className, trailingActions, }: YamlEditorProps): import("react/jsx-runtime").JSX.Element;
