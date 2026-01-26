import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Breadcrumb,
  HStack,
  VStack,
  TabBar,
  TopBar,
  Input,
  SectionCard,
  Checkbox,
  Select,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconEdit,
  IconCheck,
  IconProgress,
  IconPlus,
  IconChevronDown,
  IconChevronRight,
  IconSearch,
  IconX,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type SectionStep = 'basic-info' | 'policy-document';
type SectionState = 'pre' | 'writing' | 'active' | 'done';

interface SectionStatus {
  'basic-info': SectionState;
  'policy-document': SectionState;
}

// Section labels for display
const SECTION_LABELS: Record<SectionStep, string> = {
  'basic-info': 'Basic Information',
  'policy-document': 'Policy editor',
};

// Section order for navigation
const SECTION_ORDER: SectionStep[] = ['basic-info', 'policy-document'];

/* ----------------------------------------
   PreSection Component
   ---------------------------------------- */

interface PreSectionProps {
  title: string;
}

function PreSection({ title }: PreSectionProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
      <div className="h-8 flex items-center">
        <h5 className="text-[length:var(--font-size-16)] font-semibold leading-[var(--line-height-24)] text-[var(--color-text-default)]">
          {title}
        </h5>
      </div>
    </div>
  );
}

/* ----------------------------------------
   WritingSection Component
   ---------------------------------------- */

interface WritingSectionProps {
  title: string;
}

function WritingSection({ title }: WritingSectionProps) {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg px-4 py-3">
      <div className="h-8 flex items-center justify-between">
        <h5 className="text-[length:var(--font-size-16)] font-semibold leading-[var(--line-height-24)] text-[var(--color-text-default)]">
          {title}
        </h5>
        <span className="text-[11px] text-[var(--color-text-subtle)]">Writing...</span>
      </div>
    </div>
  );
}

/* ----------------------------------------
   DoneSection Component
   ---------------------------------------- */

interface DoneSectionProps {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}

function DoneSection({ title, onEdit, children }: DoneSectionProps) {
  return (
    <SectionCard>
      <SectionCard.Header
        title={title}
        showDivider
        actions={
          <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />} onClick={onEdit}>
            Edit
          </Button>
        }
      />
      <SectionCard.Content>{children}</SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   SectionStatusIcon Component
   ---------------------------------------- */

function SectionStatusIcon({ status }: { status: SectionState }) {
  if (status === 'done') {
    return (
      <div className="w-4 h-4 shrink-0 rounded-full bg-[var(--color-state-success)] flex items-center justify-center">
        <IconCheck size={10} stroke={2.5} className="text-white" />
      </div>
    );
  }

  if (status === 'active') {
    return (
      <div className="w-4 h-4 shrink-0">
        <IconProgress size={16} stroke={1.5} className="text-[var(--color-text-subtle)] animate-spin" />
      </div>
    );
  }

  if (status === 'writing') {
    return null;
  }

  return <div className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-border-default)]" />;
}

/* ----------------------------------------
   SummarySidebar Component
   ---------------------------------------- */

interface SummarySidebarProps {
  sectionStatus: SectionStatus;
  onCancel: () => void;
  onCreate: () => void;
  isCreateEnabled: boolean;
}

function SummarySidebar({ sectionStatus, onCancel, onCreate, isCreateEnabled }: SummarySidebarProps) {
  return (
    <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-4">
        {/* Summary Card with Header and Status */}
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={3}>
            {/* Header */}
            <h4 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
              Create policy
            </h4>

            {/* Section Status List */}
            <div className="flex flex-col">
              {SECTION_ORDER.map((sectionKey) => {
                const isWriting = sectionStatus[sectionKey] === 'writing';

                return (
                  <div key={sectionKey} className="flex items-center justify-between py-1">
                    <span className="text-[12px] leading-5 text-[var(--color-text-default)]">
                      {SECTION_LABELS[sectionKey]}
                    </span>
                    {isWriting ? (
                      <span className="text-[11px] text-[var(--color-text-subtle)]">Writing...</span>
                    ) : (
                      <SectionStatusIcon status={sectionStatus[sectionKey]} />
                    )}
                  </div>
                );
              })}
            </div>
          </VStack>
        </div>

        {/* Quota Section */}
        <VStack gap={2}>
          <span className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
            Quota
          </span>
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-lg p-4">
            <VStack gap={2}>
              <div className="flex items-center justify-between w-full">
                <span className="text-[14px] font-medium leading-5 text-[var(--color-text-default)]">
                  Permissions
                </span>
                <span className="text-[12px] leading-4 text-[var(--color-text-default)]">
                  20/50
                </span>
              </div>
              <div className="w-full h-1 bg-[var(--color-border-subtle)] rounded-lg overflow-hidden">
                <div 
                  className="h-full bg-[var(--color-state-success)] rounded-lg"
                  style={{ width: '40%' }}
                />
              </div>
            </VStack>
          </div>
        </VStack>

        {/* Action Buttons */}
        <HStack gap={2}>
          <Button variant="secondary" onClick={onCancel} className="w-[80px]">
            Cancel
          </Button>
          <Button
            variant={isCreateEnabled ? 'primary' : 'secondary'}
            onClick={onCreate}
            disabled={!isCreateEnabled}
            className="flex-1"
          >
            Create
          </Button>
        </HStack>
      </div>
    </div>
  );
}

/* ----------------------------------------
   BasicInformationSection Component
   ---------------------------------------- */

interface BasicInformationSectionProps {
  policyName: string;
  onPolicyNameChange: (value: string) => void;
  policyNameError: string | null;
  onPolicyNameErrorChange: (error: string | null) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  onNext: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
}

function BasicInformationSection({
  policyName,
  onPolicyNameChange,
  policyNameError,
  onPolicyNameErrorChange,
  description,
  onDescriptionChange,
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: BasicInformationSectionProps) {
  const handleNext = () => {
    if (!policyName.trim()) {
      onPolicyNameErrorChange('Policy name is required.');
      return;
    }
    onNext();
  };

  const handleDone = () => {
    if (!policyName.trim()) {
      onPolicyNameErrorChange('Policy name is required.');
      return;
    }
    onEditDone();
  };

  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Basic Information"
        showDivider
        actions={
          isEditing ? (
            <HStack gap={2}>
              <Button variant="secondary" size="sm" onClick={onEditCancel}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleDone}>
                Done
              </Button>
            </HStack>
          ) : undefined
        }
      />
      <SectionCard.Content>
        <VStack gap={0}>
          {/* Policy Name */}
          <div className="flex flex-col pt-2 pb-6">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] mb-2">
              Policy name <span className="text-[var(--color-state-danger)]">*</span>
            </label>
            <Input
              placeholder="Enter policy name"
              value={policyName}
              onChange={(e) => {
                onPolicyNameChange(e.target.value);
                onPolicyNameErrorChange(null);
              }}
              error={!!policyNameError}
              fullWidth
            />
            <div className="flex flex-col gap-1 mt-1">
              {policyNameError && (
                <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px]">
                  {policyNameError}
                </span>
              )}
              <span className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">
                You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters.
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* Description */}
          <div className="flex flex-col pt-2 pb-6">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] mb-2">
              Description
            </label>
            <Input
              placeholder="Enter description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              fullWidth
            />
            <span className="text-[11px] text-[var(--color-text-subtle)] leading-[16px] mt-1">
              You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255 characters.
            </span>
          </div>

          {/* Divider + Next Button (only when not editing) */}
          {!isEditing && (
            <>
              <div className="w-full h-px bg-[var(--color-border-subtle)]" />
              <HStack justify="end" className="pt-3">
                <Button variant="primary" onClick={handleNext}>
                  Next
                </Button>
              </HStack>
            </>
          )}
        </VStack>
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   Permission Type
   ---------------------------------------- */

interface Permission {
  id: string;
  application: string;
  partition: string;
  resource: string;
  resourceId: string;
  actions: {
    read: boolean;
    list: boolean;
    write: boolean;
    delete: boolean;
    admin: boolean;
  };
  detailedActions: Record<string, boolean>;
  allActions: boolean;
  mfaRequired: boolean;
}

/* ----------------------------------------
   Compute Actions Data
   ---------------------------------------- */

const COMPUTE_ACTIONS = {
  read: [
    'ReadInstance',
    'ReadImage',
    'ReadVolume',
    'ReadInstancesnapshot',
    'ReadKeypair',
    'ReadServergroup',
    'ReadNetwork',
    'ReadSecuritygroup',
    'ReadTopology',
    'ReadDashboard',
  ],
  list: [
    'ListInstance',
    'ListImage',
    'ListVolume',
    'ListInstancesnapshot',
    'ListKeypair',
    'ListServergroup',
    'ListNetwork',
    'ListSecuritygroup',
    'ListTopology',
    'ListDashboard',
  ],
  write: [
    'WriteInstance',
    'WriteImage',
    'WriteVolume',
    'WriteInstancesnapshot',
    'WriteKeypair',
    'WriteServergroup',
    'WriteNetwork',
    'WriteSecuritygroup',
    'WriteTopology',
    'WriteDashboard',
  ],
  delete: [
    'DeleteInstance',
    'DeleteImage',
    'DeleteVolume',
    'DeleteInstancesnapshot',
    'DeleteKeypair',
    'DeleteServergroup',
    'DeleteNetwork',
    'DeleteSecuritygroup',
    'DeleteTopology',
    'DeleteDashboard',
  ],
  admin: [
    'AdminInstance',
    'AdminImage',
    'AdminVolume',
    'AdminInstancesnapshot',
    'AdminKeypair',
    'AdminServergroup',
    'AdminNetwork',
    'AdminSecuritygroup',
    'AdminTopology',
    'AdminDashboard',
  ],
};

/* ----------------------------------------
   PolicyEditorSection Component
   ---------------------------------------- */

interface PolicyEditorSectionProps {
  permissions: Permission[];
  onPermissionsChange: (permissions: Permission[]) => void;
  permissionsError: string | null;
  onPermissionsErrorChange: (error: string | null) => void;
  onNext: () => void;
  isEditing: boolean;
  onEditCancel: () => void;
  onEditDone: () => void;
}

const createEmptyPermission = (): Permission => ({
  id: `permission-${Date.now()}`,
  application: '',
  partition: '',
  resource: '',
  resourceId: '',
  actions: {
    read: false,
    list: false,
    write: false,
    delete: false,
    admin: false,
  },
  detailedActions: {},
  allActions: false,
  mfaRequired: false,
});

function PolicyEditorSection({
  permissions,
  onPermissionsChange,
  permissionsError,
  onPermissionsErrorChange,
  onNext,
  isEditing,
  onEditCancel,
  onEditDone,
}: PolicyEditorSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [conditionsExpanded, setConditionsExpanded] = useState(false);
  const [targetErrors, setTargetErrors] = useState<Record<string, boolean>>({});
  const [invalidTargetErrors, setInvalidTargetErrors] = useState<Record<string, boolean>>({});
  const [actionErrors, setActionErrors] = useState<Record<string, boolean>>({});

  // Check if a permission has partial fill (some fields filled, but not all)
  const hasPartialFill = (permission: Permission): boolean => {
    const fields = [
      permission.application.trim(),
      permission.partition.trim(),
      permission.resource.trim(),
      permission.resourceId.trim(),
    ];
    const filledCount = fields.filter((f) => f.length > 0).length;
    return filledCount > 0 && filledCount < 4;
  };

  // Check if all fields are filled
  const hasAllFieldsFilled = (permission: Permission): boolean => {
    return (
      permission.application.trim().length > 0 &&
      permission.partition.trim().length > 0 &&
      permission.resource.trim().length > 0 &&
      permission.resourceId.trim().length > 0
    );
  };

  // Validate if the target combination is valid for Thaki Cloud system
  // TODO: Add actual validation logic based on system requirements
  const isInvalidTargetCombination = (permission: Permission): boolean => {
    if (!hasAllFieldsFilled(permission)) return false;
    // Placeholder: Add validation rules here
    // For example, check against valid application/partition/resource combinations
    return invalidTargetErrors[permission.id] || false;
  };

  const validateTargetFields = (): boolean => {
    const errors: Record<string, boolean> = {};
    let hasErrors = false;

    permissions.forEach((permission) => {
      const isTargetEmpty = !permission.application.trim() && 
                            !permission.partition.trim() && 
                            !permission.resource.trim() && 
                            !permission.resourceId.trim();
      if (isTargetEmpty) {
        errors[permission.id] = true;
        hasErrors = true;
      }
    });

    setTargetErrors(errors);
    return !hasErrors;
  };

  // Check if at least one action is selected for a permission
  const hasAnyActionSelected = (permission: Permission): boolean => {
    // For compute with all fields filled, check detailed actions
    if (shouldShowDetailedActions(permission)) {
      return Object.values(permission.detailedActions).some((v) => v);
    }
    // For other cases, check basic actions
    return Object.values(permission.actions).some((v) => v);
  };

  const validateActions = (): boolean => {
    const errors: Record<string, boolean> = {};
    let hasErrors = false;

    permissions.forEach((permission) => {
      if (!hasAnyActionSelected(permission)) {
        errors[permission.id] = true;
        hasErrors = true;
      }
    });

    setActionErrors(errors);
    return !hasErrors;
  };

  const handleNext = () => {
    if (permissions.length === 0) {
      onPermissionsErrorChange('At least one permission is required.');
      return;
    }
    if (!validateTargetFields()) {
      return;
    }
    if (!validateActions()) {
      return;
    }
    onNext();
  };

  const handleDone = () => {
    if (permissions.length === 0) {
      onPermissionsErrorChange('At least one permission is required.');
      return;
    }
    if (!validateTargetFields()) {
      return;
    }
    if (!validateActions()) {
      return;
    }
    onEditDone();
  };

  const addPermission = () => {
    onPermissionsChange([...permissions, createEmptyPermission()]);
    onPermissionsErrorChange(null);
  };

  const deletePermission = (id: string) => {
    onPermissionsChange(permissions.filter((p) => p.id !== id));
  };

  const updatePermission = (id: string, updates: Partial<Permission>) => {
    onPermissionsChange(
      permissions.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const toggleAction = (permissionId: string, action: keyof Permission['actions']) => {
    const permission = permissions.find((p) => p.id === permissionId);
    if (!permission) return;

    const newActions = { ...permission.actions, [action]: !permission.actions[action] };
    const allSelected = Object.values(newActions).every((v) => v);
    
    updatePermission(permissionId, { actions: newActions, allActions: allSelected });

    // Clear action error if any action is now selected
    if (actionErrors[permissionId] && Object.values(newActions).some((v) => v)) {
      setActionErrors((prev) => ({ ...prev, [permissionId]: false }));
    }
  };

  const toggleAllActions = (permissionId: string) => {
    const permission = permissions.find((p) => p.id === permissionId);
    if (!permission) return;

    const newValue = !permission.allActions;
    
    // Also toggle all detailed actions if compute
    const newDetailedActions: Record<string, boolean> = {};
    if (permission.application.toLowerCase() === 'compute') {
      Object.values(COMPUTE_ACTIONS).flat().forEach((action) => {
        newDetailedActions[action] = newValue;
      });
    }

    updatePermission(permissionId, {
      allActions: newValue,
      detailedActions: newDetailedActions,
      actions: {
        read: newValue,
        list: newValue,
        write: newValue,
        delete: newValue,
        admin: newValue,
      },
    });

    // Clear action error if any action is now selected
    if (actionErrors[permissionId] && newValue) {
      setActionErrors((prev) => ({ ...prev, [permissionId]: false }));
    }
  };

  // Toggle a single detailed action
  const toggleDetailedAction = (permissionId: string, actionName: string) => {
    const permission = permissions.find((p) => p.id === permissionId);
    if (!permission) return;

    const newDetailedActions = {
      ...permission.detailedActions,
      [actionName]: !permission.detailedActions[actionName],
    };

    // Update category action based on detailed actions
    const category = actionName.replace(/^(Read|List|Write|Delete|Admin).*/, '$1').toLowerCase() as keyof Permission['actions'];
    const categoryActions = COMPUTE_ACTIONS[category as keyof typeof COMPUTE_ACTIONS] || [];
    const allCategorySelected = categoryActions.every((a) => newDetailedActions[a]);

    const newActions = { ...permission.actions, [category]: allCategorySelected };
    const allSelected = Object.values(newActions).every((v) => v);

    updatePermission(permissionId, {
      detailedActions: newDetailedActions,
      actions: newActions,
      allActions: allSelected,
    });

    // Clear action error if any action is now selected
    if (actionErrors[permissionId] && Object.values(newDetailedActions).some((v) => v)) {
      setActionErrors((prev) => ({ ...prev, [permissionId]: false }));
    }
  };

  // Toggle all actions in a category (Read, List, Write, Delete, Admin)
  const toggleCategoryActions = (permissionId: string, category: keyof Permission['actions']) => {
    const permission = permissions.find((p) => p.id === permissionId);
    if (!permission) return;

    const categoryActions = COMPUTE_ACTIONS[category as keyof typeof COMPUTE_ACTIONS] || [];
    const allCurrentlySelected = categoryActions.every((a) => permission.detailedActions[a]);
    const newValue = !allCurrentlySelected;

    const newDetailedActions = { ...permission.detailedActions };
    categoryActions.forEach((action) => {
      newDetailedActions[action] = newValue;
    });

    const newActions = { ...permission.actions, [category]: newValue };
    const allSelected = Object.values(newActions).every((v) => v);

    updatePermission(permissionId, {
      detailedActions: newDetailedActions,
      actions: newActions,
      allActions: allSelected,
    });

    // Clear action error if any action is now selected
    if (actionErrors[permissionId] && Object.values(newDetailedActions).some((v) => v)) {
      setActionErrors((prev) => ({ ...prev, [permissionId]: false }));
    }
  };

  // Check if application is compute AND all fields are filled
  const shouldShowDetailedActions = (permission: Permission) => {
    return (
      permission.application.toLowerCase() === 'compute' &&
      hasAllFieldsFilled(permission)
    );
  };

  return (
    <SectionCard isActive>
      <SectionCard.Header
        title="Policy editor"
        showDivider
        actions={
          isEditing ? (
            <HStack gap={2}>
              <Button variant="secondary" size="sm" onClick={onEditCancel}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleDone}>
                Done
              </Button>
            </HStack>
          ) : undefined
        }
      />
      <SectionCard.Content>
        <VStack gap={6} className="pt-2 pb-6">
          {/* Permissions Label */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-[3px]">
              <span className="text-[14px] font-medium text-[var(--color-text-default)]">Permissions</span>
              <span className="text-[var(--color-state-danger)]">*</span>
            </div>
            <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              A permission consists of a Target resource and allowed Actions. You can create a single policy for various targets by adding multiple permissions.
            </span>
          </div>

          {/* Permission Cards */}
          {permissions.map((permission, index) => (
            <div
              key={permission.id}
              className="bg-white border border-[var(--color-border-default)] rounded-[6px] p-4 w-full relative"
            >
              {/* Delete button - only show for cards after the first one */}
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => deletePermission(permission.id)}
                  className="absolute top-3 right-3 p-1 rounded hover:bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors"
                  aria-label="Remove permission"
                >
                  <IconX size={16} stroke={1.5} />
                </button>
              )}
              <VStack gap={6}>
                {/* Target */}
                <div className="flex flex-col gap-2 w-full">
                  <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                    Target
                  </span>
                  <div className={`flex items-center gap-1 ${
                    targetErrors[permission.id] 
                      ? '[&_button]:border-[var(--color-state-danger)]' 
                      : hasPartialFill(permission) 
                        ? '[&_button]:border-[var(--color-state-danger)]' 
                        : isInvalidTargetCombination(permission)
                          ? '[&_button]:border-[var(--color-state-danger)]'
                          : ''
                  }`}>
                    <Select
                      placeholder="Application"
                      value={permission.application}
                      onChange={(value) => {
                        updatePermission(permission.id, { application: value });
                        if (targetErrors[permission.id]) {
                          setTargetErrors((prev) => ({ ...prev, [permission.id]: false }));
                        }
                      }}
                      options={[
                        { value: '*all', label: '*all' },
                        { value: 'compute', label: 'compute' },
                        { value: 'container', label: 'container' },
                      ]}
                      size="sm"
                      fullWidth
                    />
                    <span className="text-[12px] text-[var(--color-text-default)]">:</span>
                    <Select
                      placeholder="Partition"
                      value={permission.partition}
                      onChange={(value) => {
                        updatePermission(permission.id, { partition: value });
                        if (targetErrors[permission.id]) {
                          setTargetErrors((prev) => ({ ...prev, [permission.id]: false }));
                        }
                      }}
                      options={[
                        { value: '*all', label: '*all' },
                      ]}
                      size="sm"
                      fullWidth
                    />
                    <span className="text-[12px] text-[var(--color-text-default)]">:</span>
                    <Select
                      placeholder="Resource"
                      value={permission.resource}
                      onChange={(value) => {
                        updatePermission(permission.id, { resource: value });
                        if (targetErrors[permission.id]) {
                          setTargetErrors((prev) => ({ ...prev, [permission.id]: false }));
                        }
                      }}
                      options={[
                        { value: '*all', label: '*all' },
                      ]}
                      size="sm"
                      fullWidth
                    />
                    <span className="text-[12px] text-[var(--color-text-default)]">:</span>
                    <Select
                      placeholder="Resource ID"
                      value={permission.resourceId}
                      onChange={(value) => {
                        updatePermission(permission.id, { resourceId: value });
                        if (targetErrors[permission.id]) {
                          setTargetErrors((prev) => ({ ...prev, [permission.id]: false }));
                        }
                      }}
                      options={[
                        { value: '*all', label: '*all' },
                      ]}
                      size="sm"
                      fullWidth
                    />
                  </div>
                  {targetErrors[permission.id] && (
                    <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px]">
                      All Target fields must contain a valid value or a wildcard (∗).
                    </span>
                  )}
                  {!targetErrors[permission.id] && hasPartialFill(permission) && (
                    <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px]">
                      All Target fields must contain a valid value or a wildcard (∗).
                    </span>
                  )}
                  {!targetErrors[permission.id] && !hasPartialFill(permission) && isInvalidTargetCombination(permission) && (
                    <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px]">
                      The entered Target combination is invalid for the Thaki Cloud system structure. Please verify fields.
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 w-full">
                  <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                    Actions
                  </span>
                  
                  {/* Search and All Actions */}
                  <div className="flex items-center gap-2">
                    <div className="relative w-[var(--search-input-width)]">
                      <input
                        type="text"
                        placeholder="Search actions"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-8 pl-3 pr-8 text-[11px] bg-white border border-[var(--color-border-strong)] rounded-[6px] placeholder:text-[var(--color-text-subtle)] focus:outline-none focus:border-[var(--color-action-primary)]"
                      />
                      <IconSearch
                        size={12}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-default)]"
                      />
                    </div>
                    <div className="h-4 w-px bg-[var(--color-border-default)]" />
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <Checkbox
                        checked={permission.allActions}
                        onChange={() => toggleAllActions(permission.id)}
                      />
                      <span className="text-[12px] text-[var(--color-text-default)]">All actions</span>
                    </label>
                  </div>

                  {/* Action Cards - Simple view for non-compute applications */}
                  {!shouldShowDetailedActions(permission) && (
                    <div className={`flex gap-3 w-full h-[44px] ${actionErrors[permission.id] ? 'p-px' : ''}`}>
                      {(['read', 'list', 'write', 'delete', 'admin'] as const).map((action) => (
                        <div
                          key={action}
                          className={`flex-1 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[6px] px-4 py-3 cursor-pointer h-[44px] flex items-center ${
                            actionErrors[permission.id] ? 'ring-1 ring-[var(--color-state-danger)]' : ''
                          }`}
                          onClick={() => toggleAction(permission.id, action)}
                        >
                          <label className="flex items-center gap-2.5 cursor-pointer">
                            <Checkbox
                              checked={permission.actions[action]}
                              onChange={() => toggleAction(permission.id, action)}
                            />
                            <span className="text-[12px] font-normal text-[var(--color-text-default)] capitalize">
                              {action}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Detailed Action Tabs - For compute application with all fields filled */}
                  {shouldShowDetailedActions(permission) && (
                    <div className={`flex gap-3 w-full h-[320px] ${actionErrors[permission.id] ? 'p-px' : ''}`}>
                      {(['read', 'list', 'write', 'delete', 'admin'] as const).map((category) => {
                        const categoryActions = COMPUTE_ACTIONS[category];
                        const filteredActions = searchQuery
                          ? categoryActions.filter((a) =>
                              a.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                          : categoryActions;
                        const selectedCount = categoryActions.filter(
                          (a) => permission.detailedActions[a]
                        ).length;
                        const allCategorySelected = categoryActions.every(
                          (a) => permission.detailedActions[a]
                        );

                        return (
                          <div
                            key={category}
                            className={`flex-1 bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 flex flex-col min-w-0 overflow-hidden ${
                              actionErrors[permission.id] ? 'ring-1 ring-[var(--color-state-danger)]' : ''
                            }`}
                          >
                            {/* Category Header */}
                            <label className="flex items-center gap-2.5 shrink-0 cursor-pointer">
                              <Checkbox
                                checked={allCategorySelected}
                                onChange={() => toggleCategoryActions(permission.id, category)}
                              />
                              <span className="text-[12px] text-[var(--color-text-default)] capitalize">
                                {category}
                              </span>
                              <div className="h-4 w-px bg-[var(--color-border-default)]" />
                              <span className="text-[11px] text-[var(--color-text-subtle)]">
                                {selectedCount > 0 ? `${selectedCount}/${categoryActions.length}` : `${categoryActions.length} items`}
                              </span>
                            </label>

                            {/* Actions List */}
                            <div className="flex flex-col gap-2 mt-6 overflow-y-auto overflow-x-hidden flex-1 min-h-0 legend-scroll">
                              {filteredActions.map((actionName) => {
                                const isSelected = permission.detailedActions[actionName];
                                return (
                                  <label
                                    key={actionName}
                                    className={`bg-white border rounded-[6px] p-2 flex items-center gap-1.5 cursor-pointer shrink-0 min-w-0 ${
                                      isSelected
                                        ? 'border-[var(--color-action-primary)]'
                                        : 'border-[var(--color-border-strong)]'
                                    }`}
                                  >
                                    <Checkbox
                                      checked={isSelected}
                                      onChange={() => toggleDetailedAction(permission.id, actionName)}
                                    />
                                    <span 
                                      className="text-[12px] text-[var(--color-text-default)] truncate min-w-0"
                                      title={actionName}
                                    >
                                      {actionName}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Action Error Message */}
                  {actionErrors[permission.id] && (
                    <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px]">
                      Please select at least one action.
                    </span>
                  )}
                </div>

              </VStack>
            </div>
          ))}

          {/* Add Permission Button */}
          <Button
            variant="secondary"
            leftIcon={<IconPlus size={12} />}
            onClick={addPermission}
            className="text-[var(--color-action-primary)]"
          >
            Add Permission
          </Button>

          {/* Conditions */}
          <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="flex items-center gap-1.5 text-left"
                onClick={() => setConditionsExpanded(!conditionsExpanded)}
              >
                {conditionsExpanded ? (
                  <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
                ) : (
                  <IconChevronRight size={12} className="text-[var(--color-text-default)]" />
                )}
                <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                  Conditions
                </span>
              </button>
              <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                Select additional conditions required for this policy. All enabled conditions are evaluated using AND logic.
              </span>
            </div>
            
            {conditionsExpanded && (
              <label className="flex items-center gap-1.5 cursor-pointer">
                <Checkbox
                  checked={permissions[0]?.mfaRequired || false}
                  onChange={() => {
                    // Apply MFA requirement to all permissions
                    permissions.forEach((p) => {
                      updatePermission(p.id, { mfaRequired: !permissions[0]?.mfaRequired });
                    });
                  }}
                />
                <span className="text-[12px] text-[var(--color-text-default)]">
                  Only applies if the user has completed MFA.
                </span>
              </label>
            )}
          </div>

          {/* Error Message */}
          {permissionsError && (
            <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px]">
              {permissionsError}
            </span>
          )}
        </VStack>

        {/* Done Button (only when not editing) */}
        {!isEditing && (
          <>
            <div className="w-full h-px bg-[var(--color-border-subtle)]" />
            <HStack justify="end" className="pt-3">
              <Button variant="primary" onClick={handleNext}>
                Done
              </Button>
            </HStack>
          </>
        )}
      </SectionCard.Content>
    </SectionCard>
  );
}

/* ----------------------------------------
   Main CreatePolicyPage Component
   ---------------------------------------- */

export default function CreatePolicyPage() {
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } = useTabs();

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('Create policy');
  }, [updateActiveTabLabel]);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // Section status
  const [sectionStatus, setSectionStatus] = useState<SectionStatus>({
    'basic-info': 'active',
    'policy-document': 'pre',
  });
  const [editingSection, setEditingSection] = useState<SectionStep | null>(null);

  // Form state - Basic Information
  const [policyName, setPolicyName] = useState('');
  const [policyNameError, setPolicyNameError] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  // Form state - Permissions
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionsError, setPermissionsError] = useState<string | null>(null);

  // Check if all sections are done
  const allSectionsDone = Object.values(sectionStatus).every((s) => s === 'done');

  // Helper functions for editing
  const handleEdit = useCallback((section: SectionStep) => {
    setEditingSection(section);
    const sectionIndex = SECTION_ORDER.indexOf(section);

    setSectionStatus((prev) => {
      const newStatus = { ...prev };

      // Set all sections to their appropriate state
      SECTION_ORDER.forEach((key, index) => {
        if (index < sectionIndex) {
          newStatus[key] = 'done';
        } else if (index === sectionIndex) {
          newStatus[key] = 'active';
        } else if (prev[key] === 'done' || prev[key] === 'active') {
          newStatus[key] = 'writing';
        }
      });

      return newStatus;
    });
  }, []);

  const handleEditCancel = useCallback(() => {
    if (!editingSection) return;

    setSectionStatus((prev) => {
      const newStatus = { ...prev };
      newStatus[editingSection] = 'done';

      // Find next writing section to activate
      const editIndex = SECTION_ORDER.indexOf(editingSection);
      let nextWritingFound = false;
      for (let i = editIndex + 1; i < SECTION_ORDER.length; i++) {
        if (newStatus[SECTION_ORDER[i]] === 'writing') {
          newStatus[SECTION_ORDER[i]] = 'active';
          nextWritingFound = true;
          break;
        }
      }

      // If no writing section, activate first pre section
      if (!nextWritingFound) {
        for (const key of SECTION_ORDER) {
          if (newStatus[key] === 'pre') {
            newStatus[key] = 'active';
            break;
          }
        }
      }

      return newStatus;
    });

    setEditingSection(null);
  }, [editingSection]);

  const handleEditDone = useCallback(() => {
    if (!editingSection) return;

    setSectionStatus((prev) => {
      const newStatus = { ...prev };
      newStatus[editingSection] = 'done';

      // Find next writing section to activate
      const editIndex = SECTION_ORDER.indexOf(editingSection);
      let nextWritingFound = false;
      for (let i = editIndex + 1; i < SECTION_ORDER.length; i++) {
        if (newStatus[SECTION_ORDER[i]] === 'writing') {
          newStatus[SECTION_ORDER[i]] = 'active';
          nextWritingFound = true;
          break;
        }
      }

      // If no writing section, activate first pre section
      if (!nextWritingFound) {
        for (const key of SECTION_ORDER) {
          if (newStatus[key] === 'pre') {
            newStatus[key] = 'active';
            break;
          }
        }
      }

      return newStatus;
    });

    setEditingSection(null);
  }, [editingSection]);

  // Handle section navigation
  const handleNext = useCallback((currentSection: SectionStep) => {
    const currentIndex = SECTION_ORDER.indexOf(currentSection);
    const nextSection = SECTION_ORDER[currentIndex + 1];

    setSectionStatus((prev) => ({
      ...prev,
      [currentSection]: 'done',
      ...(nextSection && { [nextSection]: 'active' }),
    }));
  }, []);

  // Handle cancel
  const handleCancel = useCallback(() => {
    navigate('/iam/policies');
  }, [navigate]);

  // Handle create
  const handleCreate = useCallback(() => {
    console.log('Creating policy:', {
      policyName,
      description,
      permissions,
    });
    navigate('/iam/policies');
  }, [navigate, policyName, description, permissions]);

  // Get display value for permissions
  const getPermissionsDisplay = () => {
    if (permissions.length === 0) return 'No permissions defined';
    return `${permissions.length} permission(s)`;
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <IAMSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPath="/iam/policies"
      />

      {/* Main Content */}
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        {/* Tab Bar */}
        <TabBar
          tabs={tabs.map(tab => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />

        {/* Top Bar */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'IAM', href: '/iam' },
                { label: 'Policies', href: '/iam/policies' },
                { label: 'Create policy' },
              ]}
            />
          }
        />

        {/* Scrollable content */}
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)] min-h-full">

            {/* Main content area */}
            <VStack gap={3} className="min-w-[1176px]">
              {/* Page Title */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
                  Create policy
                </h1>
              </div>
              <HStack gap={6} align="start" className="w-full">
                {/* Left Column - Form Sections */}
                <VStack gap={4} className="flex-1 min-w-0 max-w-[1034px]">
                  {/* Basic Information Section */}
                  {sectionStatus['basic-info'] === 'pre' && (
                    <PreSection title={SECTION_LABELS['basic-info']} />
                  )}
                  {sectionStatus['basic-info'] === 'writing' && (
                    <WritingSection title={SECTION_LABELS['basic-info']} />
                  )}
                  {sectionStatus['basic-info'] === 'active' && (
                    <BasicInformationSection
                      policyName={policyName}
                      onPolicyNameChange={setPolicyName}
                      policyNameError={policyNameError}
                      onPolicyNameErrorChange={setPolicyNameError}
                      description={description}
                      onDescriptionChange={setDescription}
                      onNext={() => handleNext('basic-info')}
                      isEditing={editingSection === 'basic-info'}
                      onEditCancel={handleEditCancel}
                      onEditDone={handleEditDone}
                    />
                  )}
                  {sectionStatus['basic-info'] === 'done' && (
                    <DoneSection
                      title={SECTION_LABELS['basic-info']}
                      onEdit={() => handleEdit('basic-info')}
                    >
                      <SectionCard.DataRow label="Policy name" value={policyName} showDivider={false} />
                      <SectionCard.DataRow label="Description" value={description || '-'} />
                    </DoneSection>
                  )}

                  {/* Policy Document Section */}
                  {sectionStatus['policy-document'] === 'pre' && (
                    <PreSection title={SECTION_LABELS['policy-document']} />
                  )}
                  {sectionStatus['policy-document'] === 'writing' && (
                    <WritingSection title={SECTION_LABELS['policy-document']} />
                  )}
                  {sectionStatus['policy-document'] === 'active' && (
                    <PolicyEditorSection
                      permissions={permissions}
                      onPermissionsChange={setPermissions}
                      permissionsError={permissionsError}
                      onPermissionsErrorChange={setPermissionsError}
                      onNext={() => handleNext('policy-document')}
                      isEditing={editingSection === 'policy-document'}
                      onEditCancel={handleEditCancel}
                      onEditDone={handleEditDone}
                    />
                  )}
                  {sectionStatus['policy-document'] === 'done' && (
                    <DoneSection
                      title={SECTION_LABELS['policy-document']}
                      onEdit={() => handleEdit('policy-document')}
                    >
                      <SectionCard.DataRow
                        label="Permissions"
                        value={getPermissionsDisplay()}
                        showDivider={false}
                      />
                    </DoneSection>
                  )}
                </VStack>

                {/* Right Column - Summary Sidebar */}
                <SummarySidebar
                  sectionStatus={sectionStatus}
                  onCancel={handleCancel}
                  onCreate={handleCreate}
                  isCreateEnabled={allSectionsDone && !editingSection}
                />
              </HStack>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}
