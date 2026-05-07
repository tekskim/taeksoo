import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { VStack, CatalogCard, Button } from '@/design-system';

const BASIC_CODE = `<CatalogCard
  iconSrc="/path/to/icon.svg"
  iconAlt="CNPG"
  name="CNPG"
  version="v1.29.0"
  description="PostgreSQL cluster instance managed by CloudNativePG Operator."
  badges={[
    { label: 'Operator-managed', variant: 'info' },
    { label: 'Database', theme: 'white' },
  ]}
  actions={
    <Button variant="primary" size="sm">Install</Button>
  }
/>`;

const INSTALLED_CODE = `<CatalogCard
  iconSrc="/path/to/icon.svg"
  iconAlt="NGINX"
  name="NGINX"
  version="v1.27.0"
  description="High-performance web server and reverse proxy."
  badges={[
    { label: 'Helm', variant: 'info' },
    { label: 'Networking', theme: 'white' },
  ]}
  actions={
    <Button variant="outline" size="sm" disabled>Installed</Button>
  }
/>`;

function CatalogCardPreview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1292px]">
      <CatalogCard
        iconSrc="https://cdn.simpleicons.org/postgresql"
        iconAlt="PostgreSQL"
        name="CNPG"
        version="v1.29.0"
        description="PostgreSQL cluster instance managed by CloudNativePG Operator. Supports HA, PgBouncer pooling, and automated backups."
        badges={[
          { label: 'Operator-managed', variant: 'info' },
          { label: 'Database', theme: 'white' },
        ]}
        actions={
          <Button variant="primary" size="sm">
            Install
          </Button>
        }
      />
      <CatalogCard
        iconSrc="https://cdn.simpleicons.org/apachekafka"
        iconAlt="Kafka"
        name="Strimzi Kafka"
        version="v0.44.0"
        description="Apache Kafka on Kubernetes powered by Strimzi operator. Provides distributed streaming platform for building real-time data pipelines."
        badges={[
          { label: 'Operator-managed', variant: 'info' },
          { label: 'Data processing', theme: 'white' },
        ]}
        actions={
          <Button variant="primary" size="sm">
            Install
          </Button>
        }
      />
      <CatalogCard
        iconSrc="https://cdn.simpleicons.org/nginx"
        iconAlt="NGINX"
        name="NGINX"
        version="v1.27.0"
        description="High-performance web server and reverse proxy. Deploy as ingress controller or standalone web server."
        badges={[
          { label: 'Helm', variant: 'info' },
          { label: 'Networking', theme: 'white' },
        ]}
        actions={
          <Button variant="outline" size="sm" disabled>
            Installed
          </Button>
        }
      />
    </div>
  );
}

function CatalogCardExamples() {
  return (
    <VStack gap={8}>
      <VStack gap={3}>
        <h3 className="text-heading-h6 text-[var(--color-text-default)]">Installed state</h3>
        <div className="max-w-[420px]">
          <ComponentPreview code={INSTALLED_CODE}>
            <CatalogCard
              iconSrc="https://cdn.simpleicons.org/nginx"
              iconAlt="NGINX"
              name="NGINX"
              version="v1.27.0"
              description="High-performance web server and reverse proxy. Deploy as ingress controller or standalone web server."
              badges={[
                { label: 'Helm', variant: 'info' },
                { label: 'Networking', theme: 'white' },
              ]}
              actions={
                <Button variant="outline" size="sm" disabled>
                  Installed
                </Button>
              }
            />
          </ComponentPreview>
        </div>
      </VStack>

      <VStack gap={3}>
        <h3 className="text-heading-h6 text-[var(--color-text-default)]">Without version</h3>
        <div className="max-w-[420px]">
          <CatalogCard
            iconSrc="https://cdn.simpleicons.org/milvus"
            iconAlt="Milvus"
            name="Milvus"
            description="Open-source vector database for scalable similarity search and AI applications."
            badges={[
              { label: 'Helm', variant: 'info' },
              { label: 'Vector DB', theme: 'white' },
            ]}
            actions={
              <Button variant="primary" size="sm">
                Install
              </Button>
            }
          />
        </div>
      </VStack>

      <VStack gap={3}>
        <h3 className="text-heading-h6 text-[var(--color-text-default)]">Without badges</h3>
        <div className="max-w-[420px]">
          <CatalogCard
            iconSrc="https://cdn.simpleicons.org/gitea"
            iconAlt="Gitea"
            name="Gitea"
            version="v1.23.0"
            description="Lightweight self-hosted Git service. Easy to install and maintain."
            actions={
              <Button variant="primary" size="sm">
                Install
              </Button>
            }
          />
        </div>
      </VStack>
    </VStack>
  );
}

export function CatalogCardPage() {
  return (
    <ComponentPageTemplate
      title="Catalog Card"
      description="Card component for displaying application or operator catalog items with icon, description, badges, and action buttons. Used in catalog/marketplace views."
      maturity="stable"
      tags={['Container']}
      preview={
        <ComponentPreview code={BASIC_CODE}>
          <CatalogCardPreview />
        </ComponentPreview>
      }
      whenToUse={[
        'Displaying installable applications or operators in a catalog grid',
        'Marketplace-style browsing where users compare and install items',
        'Showing app metadata (icon, name, version, category, deploy type) at a glance',
      ]}
      whenNotToUse={[
        'Displaying resource details with key-value pairs → use ResourceCard',
        'Showing a single resource summary at the top of a page → use DetailHeader',
        'Dense tabular data with sorting/filtering → use Table',
      ]}
      examples={<CatalogCardExamples />}
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          border-radius: 8px · padding: 16px · gap: 12px (header↔description), 24px
          (description↔footer)
        </div>
      }
      relatedLinks={[
        { label: 'Card', path: '/design/components/card' },
        { label: 'Badge', path: '/design/components/badge' },
        { label: 'Section Card', path: '/design/patterns/section-card' },
      ]}
    />
  );
}
