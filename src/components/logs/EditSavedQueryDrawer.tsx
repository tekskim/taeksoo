import { useEffect, useState, type ReactElement } from 'react';
import { Drawer, FormField, Input, HStack, VStack, Button } from '@/design-system';
import type { SavedQuery } from '@/services/savedQueriesStore';

type EditSavedQueryValues = Pick<SavedQuery, 'name' | 'query' | 'appId' | 'levels' | 'partition'>;

type EditSavedQueryDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  savedQuery: EditSavedQueryValues;
  onSave: (values: EditSavedQueryValues) => void;
};

const LEVEL_OPTIONS = ['CRITICAL', 'ERROR', 'WARN', 'INFO', 'DEBUG'] as const;
const DEFAULT_LEVEL_VALUES = ['INFO'];

const getLevelSelectionText = (selectedLevels: string[]): string => {
  if (selectedLevels.length === 0) return 'No level selected';
  return `Selected: ${selectedLevels.join(', ')}`;
};

const EditSavedQueryDrawer = ({
  isOpen,
  onClose,
  savedQuery,
  onSave,
}: EditSavedQueryDrawerProps): ReactElement => {
  const [nameInput, setNameInput] = useState<string>(savedQuery.name);
  const [queryInput, setQueryInput] = useState<string>(savedQuery.query);
  const [appIdInput, setAppIdInput] = useState<string>(savedQuery.appId);
  const [partitionInput, setPartitionInput] = useState<string>(savedQuery.partition);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(
    savedQuery.levels.length > 0 ? savedQuery.levels : DEFAULT_LEVEL_VALUES
  );
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNameInput(savedQuery.name);
      setQueryInput(savedQuery.query);
      setAppIdInput(savedQuery.appId);
      setPartitionInput(savedQuery.partition);
      setSelectedLevels(savedQuery.levels.length > 0 ? savedQuery.levels : DEFAULT_LEVEL_VALUES);
      setNameError(null);
    }
  }, [isOpen, savedQuery]);

  const toggleLevel = (level: string): void => {
    setSelectedLevels((prev) => {
      if (prev.includes(level)) {
        if (prev.length === 1) return prev;
        return prev.filter((l) => l !== level);
      }
      return [...prev, level];
    });
  };

  const handleSave = (): void => {
    const trimmedName = nameInput.trim();
    if (!trimmedName) {
      setNameError('Query name is required');
      return;
    }
    onSave({
      name: trimmedName,
      query: queryInput,
      appId: appIdInput,
      levels: selectedLevels,
      partition: partitionInput,
    });
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Saved Query"
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
        <FormField label="Saved query name" error={!!nameError} required>
          <Input
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value);
              if (nameError) setNameError(null);
            }}
            fullWidth
          />
          {nameError && <FormField.ErrorMessage>{nameError}</FormField.ErrorMessage>}
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

        <FormField label="Level" description={getLevelSelectionText(selectedLevels)} required>
          <VStack gap={2}>
            {LEVEL_OPTIONS.map((level) => {
              const checked = selectedLevels.includes(level);
              return (
                <div
                  key={level}
                  className="flex items-center gap-2 cursor-pointer select-none"
                  onClick={() => toggleLevel(level)}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${
                      checked
                        ? 'bg-[var(--color-primary-500,#3b82f6)] border-[var(--color-primary-500,#3b82f6)]'
                        : 'border-[var(--color-border-default,#d1d5db)] bg-white'
                    }`}
                  >
                    {checked && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path
                          d="M1.5 5L4 7.5L8.5 2.5"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-body-md text-[var(--color-text-default)]">{level}</span>
                </div>
              );
            })}
          </VStack>
        </FormField>
      </VStack>
    </Drawer>
  );
};

export default EditSavedQueryDrawer;
