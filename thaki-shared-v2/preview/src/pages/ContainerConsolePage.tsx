import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { IconCircleFilled } from '@tabler/icons-react';
import { Button } from '@shared/components/Button';
import { Dropdown } from '@shared/components/Dropdown';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

/* ----------------------------------------
   Connection Status indicator
   ---------------------------------------- */

function ConnectionStatusIndicator({ status }: { status: ConnectionStatus }) {
  const statusConfig = {
    connected: {
      color: 'text-[var(--color-state-success)]',
      label: 'Connected',
    },
    connecting: {
      color: 'text-[var(--color-state-warning)]',
      label: 'Connecting',
    },
    disconnected: {
      color: 'text-[var(--color-state-danger)]',
      label: 'Disconnected',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2.5 px-3">
      <IconCircleFilled size={16} className={config.color} />
      <span className={`text-label-md ${config.color}`}>{config.label}</span>
    </div>
  );
}

/* ----------------------------------------
   Container Console Page Component
   ---------------------------------------- */

export function ContainerConsolePage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const instanceName = searchParams.get('name') || id || 'kubectl';

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [commandHistory, setCommandHistory] = useState<string[]>([
    '# Run kubectl commands inside here',
    '# e.g. kubectl get all',
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [selectedContainer, setSelectedContainer] = useState('container-0');
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const containerOptions = [
    { value: 'container-0', label: 'Container: container-0' },
    { value: 'container-1', label: 'Container: container-1' },
    { value: 'container-2', label: 'Container: container-2' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setConnectionStatus('connected');
    }, 1000);

    return () => clearTimeout(timer);
  }, [instanceName]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [commandHistory]);

  const handleConsoleClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && currentInput.trim()) {
        setCommandHistory((prev) => [...prev, `> ${currentInput}`]);

        setTimeout(() => {
          setCommandHistory((prev) => [...prev, `Executing: ${currentInput}...`, '']);
        }, 100);

        setCurrentInput('');
      }
    },
    [currentInput]
  );

  const handleClear = useCallback(() => {
    setCommandHistory(['# Run kubectl commands inside here', '# e.g. kubectl get all']);
    setCurrentInput('');
  }, []);

  return (
    <div className="-mx-8 -my-6 flex min-h-[calc(100vh-7rem)] flex-col">
      <div className="mb-3 px-8 pt-0">
        <h1 className="text-heading-h5 text-[var(--color-text-default)]">
          Kubectl: {instanceName}
        </h1>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-0">
        <div
          ref={contentRef}
          onClick={handleConsoleClick}
          className="shell-scroll min-h-[320px] flex-1 cursor-text overflow-auto bg-slate-900 p-4 font-mono text-body-md leading-[18px] text-white"
        >
          {commandHistory.map((line, index) => (
            <div key={index} className="break-all whitespace-pre-wrap">
              {line}
            </div>
          ))}

          <div className="flex items-center">
            <span className="text-white">&gt; </span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border-none bg-transparent font-mono text-body-md leading-[18px] text-white outline-none"
              autoFocus
              spellCheck={false}
              aria-label="Console command input"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 border-t border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-2 py-1">
          <Dropdown.Select
            value={selectedContainer}
            onChange={(v) => setSelectedContainer(String(v))}
            className="min-w-[200px]"
          >
            {containerOptions.map((o) => (
              <Dropdown.Option key={o.value} value={o.value} label={o.label} />
            ))}
          </Dropdown.Select>

          <Button variant="secondary" appearance="outline" size="sm" onClick={handleClear}>
            Clear
          </Button>

          <ConnectionStatusIndicator status={connectionStatus} />
        </div>
      </div>
    </div>
  );
}

export default ContainerConsolePage;
