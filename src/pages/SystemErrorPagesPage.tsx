import { useNavigate, useParams } from 'react-router-dom';
import { Button, Modal, HStack, VStack } from '@/design-system';
import { useDarkMode } from '@/hooks/useDarkMode';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';
import { IconArrowLeft, IconHome, IconLogin, IconMoon, IconSun } from '@tabler/icons-react';

type ErrorVariant = '401-b' | '403' | '404' | '500' | 'link-expired';

interface ErrorConfig {
  statusCode?: string;
  title: string;
  description: string;
  showGoBack: boolean;
  showGoHome: boolean;
  showSignIn: boolean;
}

const ERROR_CONFIGS: Record<ErrorVariant, ErrorConfig> = {
  '401-b': {
    title: 'Session Expired',
    description: 'Your session has expired due to inactivity. Please sign in again to continue.',
    showGoBack: false,
    showGoHome: false,
    showSignIn: true,
  },
  '403': {
    statusCode: '403',
    title: 'Access Denied',
    description:
      "You don't have permission to access this resource. Contact the administrator to request access.",
    showGoBack: true,
    showGoHome: false,
    showSignIn: false,
  },
  '404': {
    statusCode: '404',
    title: 'Page Not Found',
    description: 'The requested page does not exist or is no longer available.',
    showGoBack: true,
    showGoHome: true,
    showSignIn: false,
  },
  '500': {
    statusCode: '500',
    title: 'Something Went Wrong',
    description: 'An error occurred while processing your request.',
    showGoBack: true,
    showGoHome: true,
    showSignIn: false,
  },
  'link-expired': {
    title: 'Link Expired',
    description:
      'This link is no longer valid because it has expired or has already been used. Please contact your administrator to request a new link.',
    showGoBack: false,
    showGoHome: false,
    showSignIn: false,
  },
};

const VARIANT_LABELS: { id: ErrorVariant; label: string }[] = [
  { id: '401-b', label: '401-B Session Timeout' },
  { id: '403', label: '403 Forbidden' },
  { id: '404', label: '404 Not Found' },
  { id: '500', label: '500 Server Error' },
  { id: 'link-expired', label: 'Link Expired' },
];

function isValidVariant(v: string | undefined): v is ErrorVariant {
  return v !== undefined && v in ERROR_CONFIGS;
}

function FullPageError({ variant }: { variant: ErrorVariant }) {
  const config = ERROR_CONFIGS[variant];

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)] flex items-center justify-center">
      <div className="text-center px-6 -mt-20">
        {config.statusCode && (
          <div className="mb-4">
            <span className="text-[64px] font-black text-[#4B5563] leading-[80px] h-[80px] inline-block">
              {config.statusCode}
            </span>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-[18px] font-semibold leading-[26px] text-gray-800 mb-2">
            {config.title}
          </h1>
          <p className="text-gray-500 text-[13px] leading-[20px] max-w-md mx-auto">
            {config.description}
          </p>
        </div>

        <HStack gap={2} justify="center">
          {config.showGoBack && (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconArrowLeft size={12} />}
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          )}
          {config.showGoHome && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<IconHome size={12} />}
              onClick={() => (window.location.href = '/')}
            >
              Go to Homepage
            </Button>
          )}
        </HStack>
      </div>
    </div>
  );
}

function SessionExpiredModal({ isOpen }: { isOpen: boolean }) {
  const config = ERROR_CONFIGS['401-b'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      title={config.title}
      description={config.description}
      closeOnBackdropClick={false}
      closeOnEscape={false}
      showCloseButton={false}
    >
      <div className="flex w-full">
        <Button
          variant="primary"
          size="md"
          leftIcon={<IconLogin size={12} />}
          onClick={() => (window.location.href = '/')}
          className="flex-1"
        >
          Sign in again
        </Button>
      </div>
    </Modal>
  );
}

export function SystemErrorPagesPage() {
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useDarkMode();
  const { variant: urlVariant } = useParams<{ variant: string }>();
  const activeVariant: ErrorVariant = isValidVariant(urlVariant) ? urlVariant : '404';

  return (
    <div className="fixed inset-0 overflow-auto bg-[var(--color-surface-subtle)] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-[var(--color-surface-default)] border-b border-[var(--color-border-default)]">
        <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-between">
          <HStack gap={3} align="center">
            <Button
              variant="ghost"
              size="sm"
              icon={<IconArrowLeft size={14} stroke={1.5} />}
              aria-label="Go back"
              onClick={() => navigate('/')}
            />
            <img src={isDark ? ThakiLogoDark : ThakiLogoLight} alt="THAKI Cloud" className="h-5" />
          </HStack>
          <HStack gap={2}>
            <VStack gap={0.5}>
              <span className="text-label-sm text-[var(--color-text-subtle)]">Error State</span>
              <HStack gap={1} className="flex-wrap">
                {VARIANT_LABELS.map(({ id, label }) => (
                  <Button
                    key={id}
                    variant={activeVariant === id ? 'primary' : 'muted'}
                    size="sm"
                    onClick={() => navigate(`/system-errors/${id}`)}
                  >
                    {label}
                  </Button>
                ))}
              </HStack>
            </VStack>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={
                isDark ? <IconSun size={14} stroke={1.5} /> : <IconMoon size={14} stroke={1.5} />
              }
              onClick={toggleDarkMode}
            >
              {isDark ? 'Light' : 'Dark'}
            </Button>
          </HStack>
        </div>
      </header>

      {/* Error Preview */}
      <div className="flex-1">
        {activeVariant === '401-b' ? (
          <div className="min-h-screen bg-[var(--color-surface-subtle)]">
            <SessionExpiredModal isOpen />
          </div>
        ) : (
          <FullPageError variant={activeVariant} />
        )}
      </div>
    </div>
  );
}

export default SystemErrorPagesPage;
