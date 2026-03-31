import { useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Title } from '@shared/components/Title';
import { Button } from '@shared/components/Button';
import { IconCopy } from '@tabler/icons-react';

const DEFAULT_YAML = `apiVersion: v1
kind: PersistentVolume
metadata:
  name: my-persistent-volume
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: local-storage
  hostPath:
    path: /data`;

function YamlEditor({
  value,
  onChange,
  onCopy,
}: {
  value: string;
  onChange: (v: string) => void;
  onCopy: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const lines = value.split('\n');
  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);
  return (
    <div className="flex-1 flex min-h-0 border border-border rounded-[4px] bg-surface overflow-hidden relative">
      <div
        ref={lineNumbersRef}
        className="w-[44px] flex-shrink-0 overflow-y-scroll py-2 pr-2 select-none text-right bg-surface [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="font-mono text-body-md text-text-subtle">
          {Array.from({ length: lines.length }, (_, i) => (
            <div key={i + 1}>{i + 1}</div>
          ))}
        </div>
      </div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          className="w-full h-full py-2 px-2.5 pr-12 font-mono text-body-md text-text bg-transparent border-none outline-none resize-none overflow-auto"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
      <div className="absolute top-2 right-4">
        <button
          type="button"
          onClick={onCopy}
          className="flex items-center justify-center w-7 h-7 border border-border-strong rounded-[6px] bg-surface hover:bg-surface-muted transition-colors"
          title="Copy to clipboard"
        >
          <IconCopy size={12} stroke={1.5} />
        </button>
      </div>
    </div>
  );
}

export function ContainerEditPVYamlPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [yamlContent, setYamlContent] = useState(DEFAULT_YAML);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(yamlContent);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [yamlContent]);
  const handleReadFromFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setYamlContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  }, []);
  return (
    <div className="flex flex-col gap-6 flex-1 min-h-0">
      <div className="flex flex-col gap-2 flex-shrink-0">
        <Title title={`Edit persistent volume YAML${id ? ` — ${id}` : ''}`} size="large" />
        <p className="text-body-md text-text-subtle">
          Edit the YAML configuration of this persistent volume.
        </p>
      </div>
      <YamlEditor value={yamlContent} onChange={setYamlContent} onCopy={handleCopy} />
      <div className="flex-shrink-0 h-[61px] flex items-center justify-between border-t border-border-strong">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".yaml,.yml,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button variant="secondary" appearance="outline" size="md" onClick={handleReadFromFile}>
            Read from File
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/container/persistent-volumes')}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Saving YAML:', yamlContent);
              navigate('/container/persistent-volumes');
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
