import { useState } from 'react';
import { ActionModal } from '@shared/components/ActionModal';
import { Button } from '@shared/components/Button';
import { ContextMenu } from '@shared/components/ContextMenu';
import { DeleteResourceModal } from '@shared/components/DeleteResourceModal';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Overlay } from '@shared/components/Overlay';
import Tooltip from '@shared/components/Tooltip/Tooltip';

export function DesignOverlaysPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [drawerName, setDrawerName] = useState('');

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-[22px] leading-[32px] font-semibold text-text m-0">Overlays</h1>
        <p className="text-13 leading-20 text-text-muted m-0">
          Modals, drawers, tooltips, and context menus from{' '}
          <code className="text-12">@shared/components</code>.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">Modal</h2>
          <p className="text-13 leading-20 text-text-muted m-0">
            Overlay.Template type=&quot;modal&quot;
          </p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface">
          <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
            Open modal
          </Button>
          <Overlay.Template
            type="modal"
            title="Example modal"
            description="This modal uses appeared, onCancel, and default confirm/cancel actions."
            appeared={modalOpen}
            isGlobal
            onCancel={() => setModalOpen(false)}
            onConfirm={() => setModalOpen(false)}
            confirmUI="Confirm"
            cancelUI="Cancel"
          >
            <p className="text-13 leading-20 text-text m-0">
              Modal body content. Confirm or Cancel to close.
            </p>
          </Overlay.Template>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">
            Drawer (horizontal)
          </h2>
          <p className="text-13 leading-20 text-text-muted m-0">
            Overlay.Template type=&quot;drawer-horizontal&quot;
          </p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface">
          <Button
            variant="secondary"
            appearance="outline"
            size="md"
            onClick={() => setDrawerOpen(true)}
          >
            Open drawer
          </Button>
          <Overlay.Template
            type="drawer-horizontal"
            size="md"
            title="Edit settings"
            appeared={drawerOpen}
            isGlobal
            onCancel={() => setDrawerOpen(false)}
            onConfirm={() => setDrawerOpen(false)}
            confirmUI="Save"
            cancelUI="Cancel"
          >
            <div className="flex flex-col gap-4">
              <FormField label="Display name">
                <Input
                  className="w-full"
                  value={drawerName}
                  onChange={(_e, v) => setDrawerName(v)}
                  placeholder="Enter a name"
                />
              </FormField>
              <FormField label="Notes" hint="Optional helper text">
                <Input className="w-full" placeholder="Short description" />
              </FormField>
            </div>
          </Overlay.Template>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">ActionModal</h2>
          <p className="text-13 leading-20 text-text-muted m-0">
            Confirmation pattern with configurable action button
          </p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface">
          <Button variant="primary" size="md" onClick={() => setActionModalOpen(true)}>
            Open action modal
          </Button>
          <ActionModal
            appeared={actionModalOpen}
            isGlobal
            onCancel={() => setActionModalOpen(false)}
            onConfirm={() => setActionModalOpen(false)}
            actionConfig={{
              title: 'Run this action?',
              subtitle: 'This is a showcase only; nothing is executed.',
              actionButtonText: 'Run action',
              actionButtonVariant: 'primary',
              cancelButtonText: 'Cancel',
            }}
          >
            <p className="text-13 leading-20 text-text m-0">
              Optional detail content inside the action modal.
            </p>
          </ActionModal>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">
            DeleteResourceModal
          </h2>
          <p className="text-13 leading-20 text-text-muted m-0">
            Delete confirmation with resource summary
          </p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface">
          <Button
            variant="secondary"
            appearance="outline"
            size="md"
            onClick={() => setDeleteModalOpen(true)}
          >
            Open delete modal
          </Button>
          <DeleteResourceModal
            appeared={deleteModalOpen}
            isGlobal
            onCancel={() => setDeleteModalOpen(false)}
            onConfirm={() => setDeleteModalOpen(false)}
            targets={[{ id: 'vol-demo-01', name: 'demo-volume-01' }]}
            labels={{
              warningSingle: 'Deleted volumes cannot be recovered from this UI.',
            }}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">Tooltip</h2>
          <p className="text-13 leading-20 text-text-muted m-0">
            Hover (and focus) tooltips with direction preference
          </p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface">
          <div className="flex flex-wrap gap-4 items-center justify-center min-h-[120px]">
            <Tooltip content="Preferred: top" direction="top">
              <Button variant="secondary" appearance="outline" size="sm">
                Top
              </Button>
            </Tooltip>
            <Tooltip content="Preferred: bottom" direction="bottom">
              <Button variant="secondary" appearance="outline" size="sm">
                Bottom
              </Button>
            </Tooltip>
            <Tooltip content="Preferred: left" direction="left">
              <Button variant="secondary" appearance="outline" size="sm">
                Left
              </Button>
            </Tooltip>
            <Tooltip content="Preferred: right" direction="right">
              <Button variant="secondary" appearance="outline" size="sm">
                Right
              </Button>
            </Tooltip>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">ContextMenu</h2>
          <p className="text-13 leading-20 text-text-muted m-0">
            ContextMenu.Root with items including danger
          </p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface">
          <ContextMenu.Root
            direction="bottom-start"
            gap={4}
            trigger={({ toggle }) => (
              <Button variant="secondary" appearance="outline" size="md" onClick={toggle}>
                Open context menu
              </Button>
            )}
          >
            <ContextMenu.Item action={() => {}}>Edit</ContextMenu.Item>
            <ContextMenu.Item action={() => {}}>Duplicate</ContextMenu.Item>
            <ContextMenu.Item action={() => {}} danger>
              Delete
            </ContextMenu.Item>
          </ContextMenu.Root>
        </div>
      </section>
    </div>
  );
}

export default DesignOverlaysPage;
