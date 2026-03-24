import { useState } from 'react';
import { InlineMessage } from '@shared/components/InlineMessage';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';
import { Skeleton } from '@shared/components/Skeleton';
import { ProgressBar } from '@shared/components/ProgressBar';
import { Error403, Error404, Error500 } from '@shared/components/Error';

function DesignSection({
  title,
  importPath,
  children,
}: {
  title: string;
  importPath: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">{title}</h2>
        <p className="text-13 leading-20 text-text-muted m-0">{importPath}</p>
      </div>
      <div className="p-6 rounded-xl border border-border bg-surface">{children}</div>
    </section>
  );
}

export function DesignFeedbackPage() {
  const [showClosable, setShowClosable] = useState(true);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-[22px] leading-[30px] font-semibold text-text m-0">
          Feedback components
        </h1>
        <p className="text-13 leading-20 text-text-muted m-0">
          Inline messages, loading, skeletons, progress, and full-page error building blocks.
        </p>
      </div>

      <DesignSection
        title="InlineMessage"
        importPath="@shared/components/InlineMessage — message prop"
      >
        <div className="flex flex-col gap-3 w-full max-w-2xl">
          <InlineMessage
            type="info"
            message="This is an informational message for contextual help."
          />
          <InlineMessage type="success" message="Changes saved successfully." />
          <InlineMessage
            type="warning"
            message="This action may temporarily interrupt traffic to the service."
          />
          <InlineMessage type="error" message="The request failed. Check the logs and try again." />
          {showClosable ? (
            <InlineMessage
              type="info"
              message="Closable messages use the message prop and hide when dismissed."
              closable
              onClose={() => setShowClosable(false)}
            />
          ) : (
            <button
              type="button"
              className="text-12 text-primary bg-transparent border-none cursor-pointer p-0 self-start"
              onClick={() => setShowClosable(true)}
            >
              Reset closable example
            </button>
          )}
        </div>
      </DesignSection>

      <DesignSection title="LoadingSpinner" importPath="@shared/components/LoadingSpinner">
        <div className="flex items-center gap-8">
          <LoadingSpinner />
        </div>
      </DesignSection>

      <DesignSection title="Skeleton" importPath="@shared/components/Skeleton">
        <div className="flex flex-col gap-6 w-full max-w-md">
          <div className="flex flex-col gap-2">
            <span className="text-12 text-text-muted">Text line</span>
            <Skeleton className="h-4 w-full max-w-[280px]" borderRadius="4px" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-12 text-text-muted">Card block</span>
            <Skeleton className="h-24 w-full rounded-xl" borderRadius="12px" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-12 text-text-muted">Avatar + lines</span>
            <div className="flex gap-3 items-center">
              <Skeleton className="size-10 shrink-0 rounded-full" borderRadius="9999px" />
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <Skeleton className="h-3 w-[40%]" borderRadius="4px" />
                <Skeleton className="h-3 w-[85%]" borderRadius="4px" />
              </div>
            </div>
          </div>
        </div>
      </DesignSection>

      <DesignSection title="ProgressBar" importPath="@shared/components/ProgressBar">
        <div className="flex flex-col gap-5 w-full max-w-lg">
          <ProgressBar label="Provisioning" value={25} max={100} variant="success" />
          <ProgressBar
            label="Upload"
            value={65}
            max={100}
            variant="warning"
            showValue="percentage"
          />
          <ProgressBar label="Capacity" value={45} pendingValue={20} max={100} variant="success" />
          <ProgressBar label="Error threshold" value={92} max={100} variant="error" />
        </div>
      </DesignSection>

      <DesignSection
        title="Error pages"
        importPath="@shared/components/Error — Error403, Error404, Error500"
      >
        <div className="flex flex-col gap-4">
          <p className="text-12 text-text-muted m-0">
            Full-page templates for HTTP errors. Each accepts optional callbacks (
            <code className="text-11">onGoBack</code>, <code className="text-11">onGoHome</code> for
            404/500).
          </p>
          <div className="flex flex-col gap-6">
            <div className="rounded-lg border border-border-subtle overflow-hidden bg-surface-muted p-4">
              <p className="text-11 font-medium text-text-muted m-0 mb-3">Error403</p>
              <Error403 />
            </div>
            <div className="rounded-lg border border-border-subtle overflow-hidden bg-surface-muted p-4">
              <p className="text-11 font-medium text-text-muted m-0 mb-3">Error404</p>
              <Error404 />
            </div>
            <div className="rounded-lg border border-border-subtle overflow-hidden bg-surface-muted p-4">
              <p className="text-11 font-medium text-text-muted m-0 mb-3">Error500</p>
              <Error500 />
            </div>
          </div>
        </div>
      </DesignSection>
    </div>
  );
}
