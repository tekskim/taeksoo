import { useNavigate } from 'react-router-dom';
import { SettingsPage } from './SettingsPage';

/**
 * Wrapper component to render SettingsPage as a standalone page
 */
export function SettingsPageWrapper() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <SettingsPage isOpen={true} onClose={handleClose} />
    </div>
  );
}

export default SettingsPageWrapper;
