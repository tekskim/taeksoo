import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  VStack, 
  HStack,
  SectionCard,
  Input,
  Badge,
} from '@/design-system';
import { 
  IconArrowLeft,
  IconPlus,
  IconMail,
  IconKey,
  IconShieldCheck,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface MailTemplate {
  id: string;
  name: string;
  type: 'authentication' | 'notification' | 'welcome' | 'security';
  subject: string;
  description: string;
  lastModified: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockTemplates: MailTemplate[] = [
  {
    id: 'account-invitation',
    name: 'Account Invitation',
    type: 'authentication',
    subject: 'You have been invited to THAKI Cloud',
    description: 'Sent when an administrator creates a new account and invites the user',
    lastModified: '2025-01-12',
  },
  {
    id: 'reset-password',
    name: 'Reset Password',
    type: 'authentication',
    subject: 'Reset your password',
    description: 'Sent when a user requests to reset their password',
    lastModified: '2025-01-12',
  },
  {
    id: 'email-mfa',
    name: 'Email MFA',
    type: 'security',
    subject: 'Your verification code',
    description: 'Sent for email-based multi-factor authentication',
    lastModified: '2025-01-12',
  },
];

const typeConfig = {
  authentication: { icon: IconKey, color: 'info', label: 'Authentication' },
  security: { icon: IconShieldCheck, color: 'warning', label: 'Security' },
} as const;

/* ----------------------------------------
   MailTemplatePage
   ---------------------------------------- */

export function MailTemplatePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || template.type === selectedType;
    return matchesSearch && matchesType;
  });

  const types = ['authentication', 'security'] as const;

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--color-surface-default)] border-b border-[var(--color-border-default)]">
        <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-between">
          <HStack gap={3} align="center">
            <Button
              variant="ghost"
              size="sm"
              icon={<IconArrowLeft size={16} stroke={1.5} />}
              onClick={() => navigate('/')}
            />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                <IconMail size={18} className="text-white" stroke={1.5} />
              </div>
              <h1 className="text-[16px] font-semibold text-[var(--color-text-default)]">
                Mail Templates
              </h1>
            </div>
          </HStack>
          <Button
            variant="primary"
            size="sm"
            icon={<IconPlus size={14} stroke={1.5} />}
          >
            Create Template
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        <VStack gap={6}>
          {/* Filters */}
          <HStack gap={4} align="center" className="w-full">
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[300px]"
            />
            <HStack gap={2}>
              <Button
                variant={selectedType === null ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedType(null)}
              >
                All
              </Button>
              {types.map((type) => {
                const config = typeConfig[type];
                return (
                  <Button
                    key={type}
                    variant={selectedType === type ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                  >
                    {config.label}
                  </Button>
                );
              })}
            </HStack>
          </HStack>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => {
              const config = typeConfig[template.type];
              const Icon = config.icon;
              
              return (
                <SectionCard key={template.id}>
                  <div className="p-4">
                    <VStack gap={3}>
                      <HStack justify="between" align="start" className="w-full">
                        <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-subtle)] flex items-center justify-center">
                          <Icon size={20} className="text-[var(--color-text-muted)]" stroke={1.5} />
                        </div>
                        <Badge variant={config.color} size="sm">
                          {config.label}
                        </Badge>
                      </HStack>
                      
                      <VStack gap={1}>
                        <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                          {template.name}
                        </span>
                        <span className="text-[12px] text-[var(--color-text-subtle)]">
                          {template.subject}
                        </span>
                      </VStack>
                      
                      <span className="text-[11px] text-[var(--color-text-subtle)] line-clamp-2">
                        {template.description}
                      </span>
                      
                      <HStack justify="between" align="center" className="w-full pt-2 border-t border-[var(--color-border-subtle)]">
                        <span className="text-[10px] text-[var(--color-text-subtle)]">
                          Modified {template.lastModified}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/mail-template/${template.id}`)}
                        >
                          Edit
                        </Button>
                      </HStack>
                    </VStack>
                  </div>
                </SectionCard>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <IconMail size={48} className="mx-auto text-[var(--color-text-subtle)] mb-4" stroke={1} />
              <p className="text-[14px] text-[var(--color-text-subtle)]">
                No templates found
              </p>
            </div>
          )}
        </VStack>
      </main>
    </div>
  );
}

export default MailTemplatePage;
