import { Meta, StoryObj } from '@storybook/react-vite';
import { PageShell } from './PageShell';
declare const meta: Meta<typeof PageShell>;
export default meta;
type Story = StoryObj<typeof PageShell>;
export declare const Default: Story;
export declare const CollapsedSidebar: Story;
export declare const WithoutTabBar: Story;
