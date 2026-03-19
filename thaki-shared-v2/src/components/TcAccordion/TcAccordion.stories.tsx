import type { Meta, StoryObj } from "@storybook/react";
import { TcAccordion } from "./TcAccordion";

const meta: Meta<typeof TcAccordion> = {
  title: "Components/TcAccordion",
  component: TcAccordion,
};

export default meta;
type Story = StoryObj<typeof TcAccordion>;

export const Default: Story = {
  args: {
    header: "Accordion Header",
    onToggle: () => console.log("[Default] onToggle"),
    onOpen: () => console.log("[Default] onOpen"),
    onClose: () => console.log("[Default] onClose"),
    children: (
      <div>
        <p>Accordion Content</p>
        <p>Accordion Content</p>
        <p>Accordion Content</p>
      </div>
    ),
  },
};

export const DefaultOpen: Story = {
  args: {
    header: "Accordion Header (defaultOpen)",
    defaultOpen: true,
    onToggle: () => console.log("[DefaultOpen] onToggle"),
    onOpen: () => console.log("[DefaultOpen] onOpen"),
    onClose: () => console.log("[DefaultOpen] onClose"),
    children: (
      <div>
        <p>처음부터 열린 상태로 렌더됩니다.</p>
        <p>Accordion Content</p>
      </div>
    ),
  },
};

export const Disabled: Story = {
  args: {
    header: "Accordion Header (disabled)",
    disabled: true,
    onToggle: () => console.log("[Disabled] onToggle"),
    children: <p>클릭해도 열리지 않습니다.</p>,
  },
};

export const DisabledOpen: Story = {
  args: {
    header: "Accordion Header (disabled + defaultOpen)",
    disabled: true,
    defaultOpen: true,
    children: <p>열린 채로 고정됩니다. 클릭해도 닫히지 않습니다.</p>,
  },
};

export const Group: Story = {
  render: () => (
    <TcAccordion.Group>
      <TcAccordion
        id="accordion-1"
        header="Accordion Header 1"
        onToggle={() => console.log("[Group] accordion-1 onToggle")}
        onOpen={() => console.log("[Group] accordion-1 onOpen")}
        onClose={() => console.log("[Group] accordion-1 onClose")}
      >
        <p>Accordion Content 1</p>
      </TcAccordion>
      <TcAccordion
        id="accordion-2"
        header="Accordion Header 2"
        onToggle={() => console.log("[Group] accordion-2 onToggle")}
        onOpen={() => console.log("[Group] accordion-2 onOpen")}
        onClose={() => console.log("[Group] accordion-2 onClose")}
      >
        <p>Accordion Content 2</p>
      </TcAccordion>
      <TcAccordion
        id="accordion-3"
        header="Accordion Header 3"
        onToggle={() => console.log("[Group] accordion-3 onToggle")}
        onOpen={() => console.log("[Group] accordion-3 onOpen")}
        onClose={() => console.log("[Group] accordion-3 onClose")}
      >
        <p>Accordion Content 3</p>
      </TcAccordion>
    </TcAccordion.Group>
  ),
};

export const GroupSingle: Story = {
  render: () => (
    <TcAccordion.Group multiple={false}>
      <TcAccordion
        id="accordion-1"
        header="Accordion Header 1"
        onToggle={() => console.log("[GroupSingle] accordion-1 onToggle")}
        onOpen={() => console.log("[GroupSingle] accordion-1 onOpen")}
        onClose={() => console.log("[GroupSingle] accordion-1 onClose")}
      >
        <p>Accordion Content 1</p>
      </TcAccordion>
      <TcAccordion
        id="accordion-2"
        defaultOpen={true}
        header="Accordion Header 2"
        onToggle={() => console.log("[GroupSingle] accordion-2 onToggle")}
        onOpen={() => console.log("[GroupSingle] accordion-2 onOpen")}
        onClose={() => console.log("[GroupSingle] accordion-2 onClose")}
      >
        <p>Accordion Content 2</p>
      </TcAccordion>
      <TcAccordion
        id="accordion-3"
        header="Accordion Header 3"
        onToggle={() => console.log("[GroupSingle] accordion-3 onToggle")}
        onOpen={() => console.log("[GroupSingle] accordion-3 onOpen")}
        onClose={() => console.log("[GroupSingle] accordion-3 onClose")}
      >
        <p>Accordion Content 3</p>
      </TcAccordion>
    </TcAccordion.Group>
  ),
};

export const GroupWithDefaultOpen: Story = {
  render: () => (
    <TcAccordion.Group>
      <TcAccordion
        id="accordion-1"
        header="Accordion Header 1 (defaultOpen)"
        defaultOpen={true}
        onToggle={() => console.log("[GroupWithDefaultOpen] accordion-1 onToggle")}
        onOpen={() => console.log("[GroupWithDefaultOpen] accordion-1 onOpen")}
        onClose={() => console.log("[GroupWithDefaultOpen] accordion-1 onClose")}
      >
        <p>multiple=true 그룹에서 defaultOpen으로 열린 상태입니다.</p>
      </TcAccordion>
      <TcAccordion
        id="accordion-2"
        header="Accordion Header 2"
        onToggle={() => console.log("[GroupWithDefaultOpen] accordion-2 onToggle")}
        onOpen={() => console.log("[GroupWithDefaultOpen] accordion-2 onOpen")}
        onClose={() => console.log("[GroupWithDefaultOpen] accordion-2 onClose")}
      >
        <p>Accordion Content 2</p>
      </TcAccordion>
      <TcAccordion
        id="accordion-3"
        header="Accordion Header 3"
        onToggle={() => console.log("[GroupWithDefaultOpen] accordion-3 onToggle")}
        onOpen={() => console.log("[GroupWithDefaultOpen] accordion-3 onOpen")}
        onClose={() => console.log("[GroupWithDefaultOpen] accordion-3 onClose")}
      >
        <p>Accordion Content 3</p>
      </TcAccordion>
    </TcAccordion.Group>
  ),
};

export const GroupMultipleWithDefaultOpen: Story = {
  render: () => (
    <TcAccordion.Group multiple={true}>
      <TcAccordion
        id="accordion-1"
        header="Accordion Header 1 (defaultOpen)"
        defaultOpen={true}
        onToggle={() => console.log("[GroupMultipleWithDefaultOpen] accordion-1 onToggle")}
        onOpen={() => console.log("[GroupMultipleWithDefaultOpen] accordion-1 onOpen")}
        onClose={() => console.log("[GroupMultipleWithDefaultOpen] accordion-1 onClose")}
      >
        <p>multiple=true에서 defaultOpen이 적용되어 열린 상태로 시작합니다.</p>
      </TcAccordion>
      <TcAccordion
        id="accordion-2"
        header="Accordion Header 2 (defaultOpen)"
        defaultOpen={true}
        onToggle={() => console.log("[GroupMultipleWithDefaultOpen] accordion-2 onToggle")}
        onOpen={() => console.log("[GroupMultipleWithDefaultOpen] accordion-2 onOpen")}
        onClose={() => console.log("[GroupMultipleWithDefaultOpen] accordion-2 onClose")}
      >
        <p>첫 번째와 동시에 열린 상태로 시작합니다.</p>
      </TcAccordion>
      <TcAccordion
        id="accordion-3"
        header="Accordion Header 3"
        onToggle={() => console.log("[GroupMultipleWithDefaultOpen] accordion-3 onToggle")}
        onOpen={() => console.log("[GroupMultipleWithDefaultOpen] accordion-3 onOpen")}
        onClose={() => console.log("[GroupMultipleWithDefaultOpen] accordion-3 onClose")}
      >
        <p>Accordion Content 3</p>
      </TcAccordion>
    </TcAccordion.Group>
  ),
};

export const GroupSingleWithDefaultOpen: Story = {
  render: () => (
    <TcAccordion.Group multiple={false}>
      <TcAccordion
        id="accordion-1"
        header="Accordion Header 1 (defaultOpen — 무시됨)"
        defaultOpen={true}
        onToggle={() => console.log("[GroupSingleWithDefaultOpen] accordion-1 onToggle")}
        onOpen={() => console.log("[GroupSingleWithDefaultOpen] accordion-1 onOpen")}
        onClose={() => console.log("[GroupSingleWithDefaultOpen] accordion-1 onClose")}
      >
        <p>마지막 defaultOpen(accordion-2)이 이기므로 이 항목은 닫힌 채로 시작합니다.</p>
      </TcAccordion>
      <TcAccordion
        id="accordion-2"
        header="Accordion Header 2 (defaultOpen — 최종 적용)"
        defaultOpen={true}
        onToggle={() => console.log("[GroupSingleWithDefaultOpen] accordion-2 onToggle")}
        onOpen={() => console.log("[GroupSingleWithDefaultOpen] accordion-2 onOpen")}
        onClose={() => console.log("[GroupSingleWithDefaultOpen] accordion-2 onClose")}
      >
        <p>multiple=false 그룹에서 defaultOpen이 여러 개면 마지막 마운트가 열립니다.</p>
      </TcAccordion>
      <TcAccordion
        id="accordion-3"
        header="Accordion Header 3"
        onToggle={() => console.log("[GroupSingleWithDefaultOpen] accordion-3 onToggle")}
        onOpen={() => console.log("[GroupSingleWithDefaultOpen] accordion-3 onOpen")}
        onClose={() => console.log("[GroupSingleWithDefaultOpen] accordion-3 onClose")}
      >
        <p>Accordion Content 3</p>
      </TcAccordion>
    </TcAccordion.Group>
  ),
};

export const DisabledDefaultOpenInGroup: Story = {
  render: () => (
    <TcAccordion.Group multiple={false}>
      <TcAccordion
        id="accordion-1"
        header="Accordion Header 1 (disabled + defaultOpen)"
        disabled={true}
        defaultOpen={true}
        onToggle={() => console.log("[DisabledDefaultOpenInGroup] accordion-1 onToggle")}
        onOpen={() => console.log("[DisabledDefaultOpenInGroup] accordion-1 onOpen")}
        onClose={() => console.log("[DisabledDefaultOpenInGroup] accordion-1 onClose")}
      >
        <p>열린 채로 시작. 직접 클릭으로는 닫을 수 없지만, 다른 항목을 열면 그룹 규칙에 의해 닫힙니다.</p>
      </TcAccordion>
      <TcAccordion
        id="accordion-2"
        header="Accordion Header 2"
        onToggle={() => console.log("[DisabledDefaultOpenInGroup] accordion-2 onToggle")}
        onOpen={() => console.log("[DisabledDefaultOpenInGroup] accordion-2 onOpen")}
        onClose={() => console.log("[DisabledDefaultOpenInGroup] accordion-2 onClose")}
      >
        <p>이 항목을 클릭하면 accordion-1이 닫힙니다.</p>
      </TcAccordion>
      <TcAccordion
        id="accordion-3"
        header="Accordion Header 3"
        onToggle={() => console.log("[DisabledDefaultOpenInGroup] accordion-3 onToggle")}
        onOpen={() => console.log("[DisabledDefaultOpenInGroup] accordion-3 onOpen")}
        onClose={() => console.log("[DisabledDefaultOpenInGroup] accordion-3 onClose")}
      >
        <p>Accordion Content 3</p>
      </TcAccordion>
    </TcAccordion.Group>
  ),
};
