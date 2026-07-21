import { useNavigate } from 'react-router-dom';
import { ErrorState, Button } from '@/design-system';
import { IconFileOff } from '@tabler/icons-react';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-surface-subtle)]">
      <ErrorState
        icon={<IconFileOff size={48} stroke={1} />}
        title="Page not found"
        description="The page you're looking for doesn't exist or has been moved."
        action={
          <Button variant="secondary" size="md" onClick={() => navigate('/')}>
            Go to home
          </Button>
        }
      />
    </div>
  );
}
