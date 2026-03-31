import { createContext } from 'react';
import type { NavigationGuardContextType } from './types';

export const NavigationGuardContext = createContext<NavigationGuardContextType | null>(null);
