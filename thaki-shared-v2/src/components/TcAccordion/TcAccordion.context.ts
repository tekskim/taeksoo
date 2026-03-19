import { createContext, useContext } from 'react';

import type { TcAccordionContextValue } from './TcAccordion.types';

export const TcAccordionContext = createContext<TcAccordionContextValue>({
  openedAccordionIds: new Set(),
  setOpenedAccordionIds: () => new Set(),
  multiple: true,
  isGrouped: false,
});

export const useTcAccordionContext = () => useContext(TcAccordionContext);
