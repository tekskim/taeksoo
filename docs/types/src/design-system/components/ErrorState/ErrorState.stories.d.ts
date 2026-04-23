import { Meta, StoryObj } from '@storybook/react';
import { ErrorState } from './ErrorState';
declare const meta: Meta<typeof ErrorState>;
export default meta;
type Story = StoryObj<typeof ErrorState>;
export declare const Default: Story;
export declare const NetworkError: Story;
export declare const ServerError: Story;
export declare const Minimal: Story;
