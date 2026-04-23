import { BadgeTheme, BadgeType } from '../Badge/Badge';
export interface ChecklistItem {
    id: string;
    label: string;
    checked?: boolean;
    badge?: {
        text: string;
        theme?: BadgeTheme;
        type?: BadgeType;
    };
}
export interface ExpandableChecklistProps {
    /** Header label (parent checkbox) */
    label: string;
    /** Optional description below header label */
    description?: string;
    /** Optional badge for the header */
    badge?: {
        text: string;
        theme?: BadgeTheme;
        type?: BadgeType;
    };
    /** Child checklist items */
    items: ChecklistItem[];
    /** Called when any item's checked state changes */
    onChange?: (items: ChecklistItem[]) => void;
    /** Whether the list is initially expanded */
    defaultExpanded?: boolean;
    /** Additional class name */
    className?: string;
}
export declare const ExpandableChecklist: import('react').NamedExoticComponent<ExpandableChecklistProps>;
