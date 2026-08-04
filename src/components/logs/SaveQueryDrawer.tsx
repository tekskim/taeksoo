import { useEffect, useState, type ReactElement } from 'react';
import { Drawer, FormField, Input, HStack, VStack, Button, Checkbox } from '@/design-system';

type SaveQueryDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultName: string;
  query: string;
  appId: string;
  levels: string[];
  partition: string;
  onSave: (values: {
    name: string;
    query: string;
    appId: string;
    levels: string[];
    partition: string;
  }) => boolean;
};

const LEVEL_OPTIONS = ['CRITICAL', 'ERROR', 'WARN', 'INFO', 'DEBUG'] as const;

const SaveQueryDrawer = ({
  isOpen,
  onClose,
  defaultName,
  query,
  appId,
  levels,
  partition,
  onSave,
}: SaveQueryDrawerProps): ReactElement => {
  const [queryNameInput, setQueryNameInput] = useState<string>(defaultName);
  const [queryInput, setQueryInput] = useState<string>(query);
  const [appIdInput, setAppIdInput] = useState<string>(appId);
  const [partitionInput, setPartitionInput] = useState<string>(partition);
  const [queryNameError, setQueryNameError] = useState<string | null>(null);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(levels);

  useEffect(() => {
    if (isOpen) {
      setQueryNameInput(defaultName);
      setQueryInput(query);
      setAppIdInput(appId);
      setPartitionInput(partition);
      setQueryNameError(null);
      setSelectedLevels(levels);
    }
  }, [isOpen, defaultName, query, appId, levels, partition]);

  const toggleLevel = (level: string): void => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handleSave = (): void => {
    const trimmedName = queryNameInput.trim();
    if (!trimmedName) {
      setQueryNameError('Query name is required');
      return;
    }
    const saved = onSave({
      name: trimmedName,
      query: queryInput.trim(),
      appId: appIdInput.trim(),
      levels: selectedLevels,
      partition: partitionInput.trim(),
    });
    if (saved) onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Save Query"
      width={360}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} className="flex-1">
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <FormField label="Saved query name" error={!!queryNameError} required>
          <Input
            value={queryNameInput}
            onChange={(e) => {
              setQueryNameInput(e.target.value);
              if (queryNameError) setQueryNameError(null);
            }}
            placeholder="e.g. Compute critical errors"
            fullWidth
          />
          {queryNameError && <FormField.ErrorMessage>{queryNameError}</FormField.ErrorMessage>}
        </FormField>

        <FormField label="Query">
          <Input value={queryInput} onChange={(e) => setQueryInput(e.target.value)} fullWidth />
        </FormField>

        <FormField label="App Identifier">
          <Input
            value={appIdInput}
            onChange={(e) => setAppIdInput(e.target.value)}
            placeholder="e.g. compute"
            fullWidth
          />
        </FormField>

        <FormField label="Partition">
          <Input
            value={partitionInput}
            onChange={(e) => setPartitionInput(e.target.value)}
            fullWidth
          />
        </FormField>

        <FormField label="Level">
          <VStack gap={2}>
            {LEVEL_OPTIONS.map((level) => (
              <Checkbox
                key={level}
                label={level}
                checked={selectedLevels.includes(level)}
                onChange={() => toggleLevel(level)}
              />
            ))}
          </VStack>
        </FormField>
      </VStack>
    </Drawer>
  );
};

export default SaveQueryDrawer;
