import { useLocation } from 'react-router-dom';
import { StorageSidebar } from './StorageSidebar';
import { StorageDomainAdminSidebar } from './StorageDomainAdminSidebar';
import { StorageMemberSidebar } from './StorageMemberSidebar';

interface StorageSidebarResolverProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function StorageSidebarResolver({ isOpen, onToggle }: StorageSidebarResolverProps) {
  const location = useLocation();

  if (location.pathname.startsWith('/storage-domain-admin')) {
    return <StorageDomainAdminSidebar isOpen={isOpen} onToggle={onToggle} />;
  }
  if (location.pathname.startsWith('/storage-member')) {
    return <StorageMemberSidebar isOpen={isOpen} onToggle={onToggle} />;
  }
  return <StorageSidebar isOpen={isOpen} onToggle={onToggle} />;
}

export default StorageSidebarResolver;
