/**
 * Domain-related custom events for cross-module communication.
 * Used for communication between IAM and Platform modules.
 */

export const DOMAIN_EVENTS = {
  /** Fired when user switches to a different domain/organization */
  SWITCHING: 'domain-switching',
  /** Fired when domain CRUD operations succeed (create, update, delete) */
  CHANGED: 'domain-changed',
} as const;

export interface DomainSwitchingEventDetail {
  orgId: string;
  name: string;
}

/**
 * Dispatch a domain switching event to notify Platform module.
 * Platform will update its selected organization and close all windows.
 *
 * @example
 * ```ts
 * dispatchDomainSwitch({ orgId: 'org-123', name: 'My Organization' });
 * ```
 */
export const dispatchDomainSwitch = (detail: DomainSwitchingEventDetail): void => {
  const event = new CustomEvent(DOMAIN_EVENTS.SWITCHING, { detail });
  window.dispatchEvent(event);
};

/**
 * Type-safe event listener for domain switching events.
 * Returns a cleanup function for use in useEffect.
 *
 * @example
 * ```ts
 * useEffect(() => {
 *   return subscribeToDomainSwitch(({ orgId, name }) => {
 *     setSelectedOrganization({ orgId, name });
 *   });
 * }, []);
 * ```
 */
export const subscribeToDomainSwitch = (
  handler: (detail: DomainSwitchingEventDetail) => void
): (() => void) => {
  const listener = (event: Event): void => {
    const customEvent = event as CustomEvent<DomainSwitchingEventDetail>;
    handler(customEvent.detail);
  };

  window.addEventListener(DOMAIN_EVENTS.SWITCHING, listener);

  return () => {
    window.removeEventListener(DOMAIN_EVENTS.SWITCHING, listener);
  };
};

export type DomainChangedAction = 'create' | 'update' | 'delete';

export interface DomainChangedEventDetail {
  action: DomainChangedAction;
  orgId?: string;
}

/**
 * Dispatch a domain changed event to notify Platform module.
 * Platform will refetch the organizations list.
 *
 * @example
 * ```ts
 * dispatchDomainChanged({ action: 'create' });
 * dispatchDomainChanged({ action: 'delete', orgId: 'org-123' });
 * ```
 */
export const dispatchDomainChanged = (detail: DomainChangedEventDetail): void => {
  const event = new CustomEvent(DOMAIN_EVENTS.CHANGED, { detail });
  window.dispatchEvent(event);
};

/**
 * Type-safe event listener for domain changed events (CRUD operations).
 * Returns a cleanup function for use in useEffect.
 *
 * @example
 * ```ts
 * useEffect(() => {
 *   return subscribeToDomainChanged(({ action, orgId }) => {
 *     refetchOrganizations();
 *   });
 * }, [refetchOrganizations]);
 * ```
 */
export const subscribeToDomainChanged = (
  handler: (detail: DomainChangedEventDetail) => void
): (() => void) => {
  const listener = (event: Event): void => {
    const customEvent = event as CustomEvent<DomainChangedEventDetail>;
    handler(customEvent.detail);
  };

  window.addEventListener(DOMAIN_EVENTS.CHANGED, listener);

  return () => {
    window.removeEventListener(DOMAIN_EVENTS.CHANGED, listener);
  };
};
