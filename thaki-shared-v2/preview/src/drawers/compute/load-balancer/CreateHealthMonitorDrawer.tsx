import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

const TYPE_OPTIONS = [
  { value: 'HTTP', label: 'HTTP' },
  { value: 'HTTPS', label: 'HTTPS' },
  { value: 'TCP', label: 'TCP' },
  { value: 'PING', label: 'PING' },
  { value: 'TLS-HELLO', label: 'TLS-HELLO' },
];

const METHOD_OPTIONS = [
  { value: 'GET', label: 'GET' },
  { value: 'HEAD', label: 'HEAD' },
  { value: 'POST', label: 'POST' },
];

export interface CreateHealthMonitorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateHealthMonitorDrawer({ isOpen, onClose }: CreateHealthMonitorDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [monitorType, setMonitorType] = useState('HTTP');
  const [delay, setDelay] = useState('5');
  const [timeoutSec, setTimeoutSec] = useState('5');
  const [maxRetries, setMaxRetries] = useState('3');
  const [urlPath, setUrlPath] = useState('/');
  const [expectedCodes, setExpectedCodes] = useState('200');
  const [httpMethod, setHttpMethod] = useState('GET');

  useEffect(() => {
    if (isOpen) {
      setMonitorType('HTTP');
      setDelay('5');
      setTimeoutSec('5');
      setMaxRetries('3');
      setUrlPath('/');
      setExpectedCodes('200');
      setHttpMethod('GET');
    }
  }, [isOpen]);

  const showHttpFields = monitorType === 'HTTP' || monitorType === 'HTTPS';

  const handleSubmit = () => {
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Create Health Monitor"
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Create"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <FormField label="Type">
          <Dropdown.Select
            value={monitorType}
            onChange={(v) => setMonitorType(String(v))}
            placeholder="Select type"
            size="sm"
          >
            {TYPE_OPTIONS.map((opt) => (
              <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
            ))}
          </Dropdown.Select>
        </FormField>

        <FormField label="Delay (s)">
          <Input
            type="number"
            value={delay}
            onChange={(e) => setDelay(e.target.value)}
            placeholder="5"
            size="sm"
          />
        </FormField>

        <FormField label="Timeout (s)">
          <Input
            type="number"
            value={timeoutSec}
            onChange={(e) => setTimeoutSec(e.target.value)}
            placeholder="5"
            size="sm"
          />
        </FormField>

        <FormField label="Max retries">
          <Input
            type="number"
            value={maxRetries}
            onChange={(e) => setMaxRetries(e.target.value)}
            placeholder="3"
            size="sm"
          />
        </FormField>

        {showHttpFields && (
          <>
            <FormField label="URL path">
              <Input
                value={urlPath}
                onChange={(e) => setUrlPath(e.target.value)}
                placeholder="/health"
                size="sm"
              />
            </FormField>
            <FormField label="Expected codes">
              <Input
                value={expectedCodes}
                onChange={(e) => setExpectedCodes(e.target.value)}
                placeholder="200"
                size="sm"
              />
            </FormField>
            <FormField label="HTTP method">
              <Dropdown.Select
                value={httpMethod}
                onChange={(v) => setHttpMethod(String(v))}
                placeholder="Select method"
                size="sm"
              >
                {METHOD_OPTIONS.map((opt) => (
                  <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
                ))}
              </Dropdown.Select>
            </FormField>
          </>
        )}
      </div>
    </Overlay.Template>
  );
}
