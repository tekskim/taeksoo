import { ReactNode, HTMLAttributes } from 'react';
export type AccordionVariant = 'default' | 'bordered' | 'separated';
export interface AccordionRootProps extends HTMLAttributes<HTMLDivElement> {
    /** Allow multiple items to be expanded */
    allowMultiple?: boolean;
    /** Default expanded items */
    defaultExpanded?: string[];
    /** Controlled expanded items */
    expanded?: string[];
    /** Callback when expanded items change */
    onChange?: (expanded: string[]) => void;
    /** Visual variant */
    variant?: AccordionVariant;
    /** Children (Accordion.Item) */
    children: ReactNode;
}
export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
    /** Unique identifier for this item */
    id: string;
    /** Disabled state */
    disabled?: boolean;
    /** Children */
    children: ReactNode;
}
export interface AccordionTriggerProps extends HTMLAttributes<HTMLButtonElement> {
    /** Trigger content */
    children: ReactNode;
    /** Icon position */
    iconPosition?: 'left' | 'right';
    /** Hide icon */
    hideIcon?: boolean;
}
export interface AccordionPanelProps extends HTMLAttributes<HTMLDivElement> {
    /** Panel content */
    children: ReactNode;
}
export declare const AccordionRoot: import('react').ForwardRefExoticComponent<AccordionRootProps & import('react').RefAttributes<HTMLDivElement>>;
export declare const AccordionItem: import('react').ForwardRefExoticComponent<AccordionItemProps & import('react').RefAttributes<HTMLDivElement>>;
export declare const AccordionTrigger: import('react').ForwardRefExoticComponent<AccordionTriggerProps & import('react').RefAttributes<HTMLButtonElement>>;
export declare const AccordionPanel: import('react').ForwardRefExoticComponent<AccordionPanelProps & import('react').RefAttributes<HTMLDivElement>>;
export declare const Accordion: {
    Root: import('react').ForwardRefExoticComponent<AccordionRootProps & import('react').RefAttributes<HTMLDivElement>>;
    Item: import('react').ForwardRefExoticComponent<AccordionItemProps & import('react').RefAttributes<HTMLDivElement>>;
    Trigger: import('react').ForwardRefExoticComponent<AccordionTriggerProps & import('react').RefAttributes<HTMLButtonElement>>;
    Panel: import('react').ForwardRefExoticComponent<AccordionPanelProps & import('react').RefAttributes<HTMLDivElement>>;
};
export default Accordion;
