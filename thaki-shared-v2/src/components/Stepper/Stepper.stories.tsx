import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Stepper } from "./Stepper";

const meta: Meta<typeof Stepper> = {
  title: "Components/Stepper",
  component: Stepper,
};

export default meta;
type Story = StoryObj<typeof Stepper>;

// ─── Shared UI primitives ─────────────────────────────────────────────────────

const FormUI = ({ label }: { label: string }) => (
  <div className="flex flex-col gap-3 min-h-[300px]">
    <p className="text-sm text-gray-600">
      {label} — fill in the form fields here.
    </p>
    <div className="flex-1 bg-gray-50 border border-dashed border-gray-200 rounded p-4">
      {/* Mock form fields to simulate large height */}
      <div className="space-y-4">
        <div className="h-10 bg-white border border-gray-200 rounded w-full" />
        <div className="h-10 bg-white border border-gray-200 rounded w-3/4" />
        <div className="h-24 bg-white border border-gray-200 rounded w-full" />
      </div>
    </div>
  </div>
);

const DoneUI = ({ label }: { label: string }) => (
  <p className="text-sm text-gray-500">{label} — confirmed.</p>
);

// ─── Stories ─────────────────────────────────────────────────────────────────

export const SkipCompleted: Story = {
  name: "Default (skip behavior)",
  render: () => (
    <div className="max-w-2xl p-6">
      <p className="mb-4 text-sm text-gray-500">
        Stepper advances to the first incomplete step, skipping already-done
        ones. Editing a step clears only that step.
      </p>
      <Stepper
        stepIds={["basic", "source", "network", "advanced"]}
        defaultOpenedId="basic"
        onAllStepsCompleted={() => alert("All steps completed!")}
      >
        {[
          {
            id: "basic",
            label: "Basic Information",
            editUI: <FormUI label="Basic" />,
            doneUI: <DoneUI label="Basic" />,
          },
          {
            id: "source",
            label: "Source Selection",
            editUI: <FormUI label="Source" />,
            doneUI: <DoneUI label="Source" />,
            skippable: true,
          },
          {
            id: "network",
            label: "Network Configuration",
            editUI: <FormUI label="Network" />,
            doneUI: <DoneUI label="Network" />,
          },
          {
            id: "advanced",
            label: "Advanced Settings",
            skippable: true,
            editUI: <FormUI label="Advanced" />,
            doneUI: <DoneUI label="Advanced" />,
          },
        ]}
      </Stepper>
    </div>
  ),
};

export const SkipCompletedMode: Story = {
  name: "Edit keeps skip behavior",
  render: () => (
    <div className="max-w-2xl p-6">
      <p className="mb-4 text-sm text-gray-500">
        Editing clears only that step; subsequent completed steps are kept so
        the next forward pass skips them.
      </p>
      <Stepper
        stepIds={["basic", "source", "network", "advanced"]}
        defaultOpenedId="basic"
        onAllStepsCompleted={() => alert("All steps completed!")}
      >
        {[
          {
            id: "basic",
            label: "Basic Information",
            editUI: <FormUI label="Basic" />,
            doneUI: <DoneUI label="Basic" />,
          },
          {
            id: "source",
            label: "Source Selection",
            editUI: <FormUI label="Source" />,
            doneUI: <DoneUI label="Source" />,
          },
          {
            id: "network",
            label: "Network Configuration",
            editUI: <FormUI label="Network" />,
            doneUI: <DoneUI label="Network" />,
          },
          {
            id: "advanced",
            label: "Advanced Settings",
            skippable: true,
            editUI: <FormUI label="Advanced" />,
            doneUI: <DoneUI label="Advanced" />,
          },
        ]}
      </Stepper>
    </div>
  ),
};

export const WithDefaultOpenedId: Story = {
  name: "defaultOpenedId auto-completes previous steps",
  render: () => (
    <div className="max-w-2xl p-6">
      <p className="mb-4 text-sm text-gray-500">
        <code>defaultOpenedId="network"</code> — Basic and Source are
        automatically marked as completed on mount. Network opens immediately.
      </p>
      <Stepper
        stepIds={["basic", "source", "network", "advanced"]}
        defaultOpenedId="network"
        onAllStepsCompleted={() => alert("All steps completed!")}
      >
        {[
          {
            id: "basic",
            label: "Basic Information",
            editUI: <FormUI label="Basic" />,
            doneUI: <DoneUI label="Basic" />,
          },
          {
            id: "source",
            label: "Source Selection",
            editUI: <FormUI label="Source" />,
            doneUI: <DoneUI label="Source" />,
          },
          {
            id: "network",
            label: "Network Configuration",
            editUI: <FormUI label="Network" />,
            doneUI: <DoneUI label="Network" />,
          },
          {
            id: "advanced",
            label: "Advanced Settings",
            skippable: true,
            editUI: <FormUI label="Advanced" />,
            doneUI: <DoneUI label="Advanced" />,
          },
        ]}
      </Stepper>
    </div>
  ),
};

export const SkipModeWithDefaultOpenedId: Story = {
  name: "defaultOpenedId + skip behavior",
  render: () => (
    <div className="max-w-2xl p-6">
      <p className="mb-4 text-sm text-gray-500">
        <code>defaultOpenedId="advanced"</code> — Basic, Source, and Network are
        automatically marked as completed on mount. Advanced opens immediately.
        Editing a step clears only that step.
      </p>
      <Stepper
        stepIds={["basic", "source", "network", "advanced"]}
        defaultOpenedId="advanced"
        onAllStepsCompleted={() => alert("All steps completed!")}
      >
        {[
          {
            id: "basic",
            label: "Basic Information",
            editUI: <FormUI label="Basic" />,
            doneUI: <DoneUI label="Basic" />,
          },
          {
            id: "source",
            label: "Source Selection",
            editUI: <FormUI label="Source" />,
            doneUI: <DoneUI label="Source" />,
          },
          {
            id: "network",
            label: "Network Configuration",
            editUI: <FormUI label="Network" />,
            doneUI: <DoneUI label="Network" />,
          },
          {
            id: "advanced",
            label: "Advanced Settings",
            skippable: true,
            editUI: <FormUI label="Advanced" />,
            doneUI: <DoneUI label="Advanced" />,
          },
        ]}
      </Stepper>
    </div>
  ),
};

export const WithAutoFilledSteps: Story = {
  name: "autoFilled steps initialize as doneUI",
  render: () => (
    <div className="max-w-2xl p-6">
      <p className="mb-4 text-sm text-gray-500">
        Steps with <code>autoFilled</code> start completed, render doneUI, and
        are opened by default.
      </p>
      <Stepper
        stepIds={["basic", "source", "network", "advanced"]}
        onAllStepsCompleted={() => alert("All steps completed!")}
      >
        {[
          {
            id: "basic",
            label: "Basic Information",
            autoFilled: true,
            editUI: <FormUI label="Basic" />,
            doneUI: <DoneUI label="Basic" />,
          },
          {
            id: "source",
            label: "Source Selection",
            autoFilled: true,
            editUI: <FormUI label="Source" />,
            doneUI: <DoneUI label="Source" />,
          },
          {
            id: "network",
            label: "Network Configuration",
            editUI: <FormUI label="Network" />,
            doneUI: <DoneUI label="Network" />,
          },
          {
            id: "advanced",
            label: "Advanced Settings",
            skippable: true,
            editUI: <FormUI label="Advanced" />,
            doneUI: <DoneUI label="Advanced" />,
          },
        ]}
      </Stepper>
    </div>
  ),
};

export const DependsOnInvalidation: Story = {
  name: "dependsOn invalidation",
  render: () => (
    <div className="max-w-2xl p-6">
      <p className="mb-4 text-sm text-gray-500">
        Complete all steps, then click <code>Edit</code> on Basic. Source and
        Network depend on Basic, so they are cleared and become{" "}
        <code>writing...</code>.
      </p>
      <Stepper
        stepIds={["basic", "source", "network", "advanced"]}
        defaultOpenedId="basic"
        onAllStepsCompleted={() => alert("All steps completed!")}
      >
        {[
          {
            id: "basic",
            label: "Basic Information",
            editUI: <FormUI label="Basic" />,
            doneUI: <DoneUI label="Basic" />,
          },
          {
            id: "source",
            label: "Source Selection",
            dependsOn: ["basic"],
            editUI: <FormUI label="Source" />,
            doneUI: <DoneUI label="Source" />,
          },
          {
            id: "network",
            label: "Network Configuration",
            dependsOn: ["basic", "source"],
            editUI: <FormUI label="Network" />,
            doneUI: <DoneUI label="Network" />,
          },
          {
            id: "advanced",
            label: "Advanced Settings",
            skippable: true,
            editUI: <FormUI label="Advanced" />,
            doneUI: <DoneUI label="Advanced" />,
          },
        ]}
      </Stepper>
    </div>
  ),
};
