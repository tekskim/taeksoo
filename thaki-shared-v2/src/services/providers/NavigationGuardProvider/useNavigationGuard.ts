import { useContext } from 'react';
import type { NavigationGuardContextType } from './types';
import { NavigationGuardContext } from './NavigationGuardContext';

export const useNavigationGuardContext = (): NavigationGuardContextType => {
  const context = useContext(NavigationGuardContext);
  if (!context) {
    throw new Error('useNavigationGuardContext must be used within NavigationGuardProvider');
  }
  return context;
};

export const useNavigationGuardContextOptional = (): NavigationGuardContextType | null => {
  return useContext(NavigationGuardContext);
};
