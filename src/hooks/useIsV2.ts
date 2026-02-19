import { useLocation } from 'react-router-dom';

export function useIsV2() {
  const location = useLocation();
  return location.pathname.endsWith('-v2');
}
