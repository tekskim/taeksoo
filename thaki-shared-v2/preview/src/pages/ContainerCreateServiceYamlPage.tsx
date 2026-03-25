import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { IconCopy } from '@tabler/icons-react';

const DEFAULT_YAML = `apiVersion: v1
kind: Service
metadata:
  name: ''
  annotations:
    {}
    #  key: string
  labels:
    {}
    #  key: string
  namespace: default
spec:
  selector:
    #  key: string
  ports:
    - name: ''
      protocol: TCP
#    - appProtocol: string
#      name: string
#      nodePort: int
#      port: int
#      protocol: string
#      targetPort: string
  sessionAffinity: None
  type: ClusterIP
#  allocateLoadBalancerNodePorts: boolean
#  clusterIP: string
#  clusterIPs:
#    - string
#  externalIPs:
#    - string
#  externalName: string
#  externalTrafficPolicy: string
#  healthCheckNodePort: int
#  internalTrafficPolicy: string
#  ipFamilies:
#    - string
#  ipFamilyPolicy: string
#  loadBalancerClass: string
#  loadBalancerIP: string
#  loadBalancerSourceRanges:
#    - string
#  publishNotReadyAddresses: boolean
#  sessionAffinityConfig:
#    clientIP:
#      timeoutSeconds: int
#  trafficDistribution: string
__clone: true`;

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
    <div className="flex-1 flex min-h-0 border border-[var(--color-border-default)] rounded-[4px] bg-[var(--color-base-white)] overflow-hidden relative">
      <div
        ref={lineNumbersRef}
        className="w-[44px] flex-shrink-0 overflow-y-scroll py-2 pr-2 select-none text-right bg-[var(--color-surface-default)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="font-mono text-body-md text-[var(--color-text-subtle)]">
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
          className="w-full h-full py-2 px-2.5 pr-12 font-mono text-body-md text-[var(--color-text-default)] bg-transparent border-none outline-none resize-none overflow-auto"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
      <div className="absolute top-2 right-4">
        <button
          onClick={onCopy}
          className="flex items-center justify-center w-7 h-7 border border-[var(--color-border-strong)] rounded-[6px] bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-subtle)] transition-colors"
          title="Copy to clipboard"
        >
          <IconCopy size={12} stroke={1.5} />
        </button>
      </div>
    </div>
  );
}

export function ContainerCreateServiceYamlPage() {
  const navigate = useNavigate();
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
        <h1 className="text-heading-h4 text-[var(--color-text-default)]">Create service</h1>
        <p className="text-body-md text-[var(--color-text-subtle)]">
          Services allow you to define a logical set of Pods that can be accessed with a single IP
          address and port.
        </p>
      </div>
      <YamlEditor value={yamlContent} onChange={setYamlContent} onCopy={handleCopy} />
      <div className="flex-shrink-0 h-[61px] flex items-center justify-between border-t border-[var(--color-border-strong)]">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".yaml,.yml,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button variant="secondary" size="md" onClick={handleReadFromFile}>
            Read from File
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md" onClick={() => navigate('/container/services')}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Creating with YAML:', yamlContent);
              navigate('/container/services');
            }}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
