/**
 * Traps keyboard focus within a container element and restores
 * focus to the previously-focused element on deactivation.
 *
 * Implements WAI-ARIA dialog focus-management requirements:
 * - On open: moves focus to the first focusable descendant
 * - Tab / Shift+Tab cycle within the container
 * - On close: restores focus to the element that was focused before open
 */
export declare function useFocusTrap<T extends HTMLElement = HTMLDivElement>(isActive: boolean): import('react').RefObject<T | null>;
