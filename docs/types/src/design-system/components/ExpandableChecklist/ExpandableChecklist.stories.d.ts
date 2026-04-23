import { Meta, StoryObj } from '@storybook/react-vite';
import { ExpandableChecklist } from './ExpandableChecklist';
declare const meta: Meta<typeof ExpandableChecklist>;
export default meta;
type Story = StoryObj<typeof ExpandableChecklist>;
export declare const Default: Story;
export declare const Collapsed: Story;
export declare const WithoutBadges: Story;
export declare const PartiallyChecked: Story;
