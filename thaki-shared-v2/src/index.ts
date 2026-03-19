/**
 * @packageDocumentation
 * # @ThakiCloud/shared - THAKI Cloud Design System
 *
 * React component library with design tokens for building cloud management UIs.
 *
 * ## Quick Start
 *
 * ## Core Components
 *
 * ### Button
 * - `variant`: 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'muted'
 * - `appearance`: 'solid' | 'outline' | 'ghost'
 * - `size`: 'xs' | 'sm' | 'md' | 'lg'
 *
 * ```tsx
 * <Button variant="primary" appearance="solid">Save</Button>
 * <Button variant="error" appearance="outline">Delete</Button>
 * <Button variant="secondary" appearance="ghost">Cancel</Button>
 * ```
 *
 * ### Badge (⚠️ Uses abbreviated theme names)
 * - `theme`: 'gre' (green) | 'red' | 'blu' (blue) | 'ylw' (yellow) | 'gry' (gray)
 * - `type`: 'subtle' | 'solid'
 *
 * ```tsx
 * <Badge theme="gre" type="solid">Success</Badge>
 * <Badge theme="red">Error</Badge>
 * <Badge theme="blu">Info</Badge>
 * ```
 *
 * ### Layout
 * ```tsx
 * <Layout.VStack gap="md">
 *   <Layout.HStack gap="sm" justify="between">
 *     <Typography.Title level={2}>Title</Typography.Title>
 *     <Button>Action</Button>
 *   </Layout.HStack>
 *   <Layout.Block title="Section">Content</Layout.Block>
 * </Layout.VStack>
 * ```
 *
 * ### Typography (⚠️ Use Title, NOT Heading)
 * ```tsx
 * <Typography.Title level={1}>Page Title</Typography.Title>
 * <Typography.Text color="secondary">Description</Typography.Text>
 * <Typography.Label>Form Label</Typography.Label>
 * ```
 *
 * ### Form Controls
 * ```tsx
 * <FormField label="Email" required error={errors.email}>
 *   <Input type="email" error={Boolean(errors.email)} />
 * </FormField>
 *
 * <Dropdown.Select value={value} onChange={setValue} placeholder="Select">
 *   <Dropdown.Option value="a" label="Option A" />
 * </Dropdown.Select>
 * ```
 *
 * ### Overlay (Modal/Drawer)
 * ```tsx
 * <Overlay.Template
 *   type="modal"              // or "drawer-horizontal"
 *   title="Confirm"
 *   appeared={isOpen}
 *   onConfirm={handleConfirm}
 *   onCancel={handleCancel}
 * >
 *   Content
 * </Overlay.Template>
 * ```
 *
 * ### Toast (⚠️ No useToast hook - use toast.custom directly)
 * ```tsx
 * import { toast } from 'sonner';
 * import { Toast } from '@thaki/shared';
 *
 * // Success toast
 * toast.custom(id => (
 *   <Toast
 *     type="positive"
 *     message="Saved"
 *     description="Changes saved."
 *     handleDismiss={() => toast.dismiss(id)}
 *   />
 * ));
 *
 * // Error toast
 * toast.custom(id => (
 *   <Toast
 *     type="negative"
 *     message="Error"
 *     description="Something went wrong."
 *     handleDismiss={() => toast.dismiss(id)}
 *   />
 * ));
 * ```
 *
 * @see AI_GUIDE.md for complete documentation
 * @see https://github.com/ThakiCloud/thaki-shared for source code
 */

export * from './components';
export * from './features';
export * from './services';
export * from './styles/common';
export * from './types';
