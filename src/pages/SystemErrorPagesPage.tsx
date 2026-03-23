import { useNavigate, useParams } from 'react-router-dom';
import { Button, HStack } from '@/design-system';
import { useDarkMode } from '@/hooks/useDarkMode';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';
import { IconArrowLeft, IconHome, IconMoon, IconSun } from '@tabler/icons-react';

type ErrorVariant = '403' | '404' | '500' | 'link-expired';

interface ErrorConfig {
  statusCode?: string;
  title: string;
  description: string;
  showGoBack: boolean;
  showGoHome: boolean;
  showSignIn: boolean;
}

const ERROR_CONFIGS: Record<ErrorVariant, ErrorConfig> = {
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
            <span className="text-[64px] font-black text-[var(--color-text-disabled)] leading-[80px] h-[80px] inline-block">
              {config.statusCode}
            </span>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-[18px] font-semibold leading-[26px] text-[var(--color-text-default)] mb-2">
            {config.title}
          </h1>
          <p className="text-[var(--color-text-muted)] text-[13px] leading-[20px] max-w-md mx-auto">
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
          <HStack gap={1} align="center">
            {VARIANT_LABELS.map(({ id, label }) => (
              <Button
                key={id}
                variant={activeVariant === id ? 'secondary' : 'muted'}
                size="sm"
                onClick={() => navigate(`/system-errors/${id}`)}
              >
                {label}
              </Button>
            ))}
            <div className="w-px h-5 bg-[var(--color-border-default)] mx-1" />
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
        <FullPageError variant={activeVariant} />
      </div>
    </div>
  );
}

export default SystemErrorPagesPage;
