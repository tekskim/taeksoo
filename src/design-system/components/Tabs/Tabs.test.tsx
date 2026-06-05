import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabList, Tab, TabPanel } from './Tabs';

describe('Tabs', () => {
  const renderTabs = (props = {}) => {
    return render(
      <Tabs defaultValue="tab1" {...props}>
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
          <Tab value="tab3">Tab 3</Tab>
        </TabList>
        <TabPanel value="tab1">Content 1</TabPanel>
        <TabPanel value="tab2">Content 2</TabPanel>
        <TabPanel value="tab3">Content 3</TabPanel>
      </Tabs>
    );
  };

  describe('Rendering', () => {
    it('renders all tabs', () => {
      renderTabs();
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Tab 3' })).toBeInTheDocument();
    });

    it('renders tablist', () => {
      renderTabs();
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('renders active tab panel', () => {
      renderTabs();
      expect(screen.getByText('Content 1')).toBeVisible();
    });

    it('hides inactive tab panels', () => {
      renderTabs();
      // Inactive panels have 'hidden' class
      const panel2 = screen.getByText('Content 2').closest('[role="tabpanel"]');
      const panel3 = screen.getByText('Content 3').closest('[role="tabpanel"]');
      expect(panel2).toHaveClass('hidden');
      expect(panel3).toHaveClass('hidden');
    });
  });

  describe('Default Value', () => {
    it('activates first tab by defaultValue', () => {
      renderTabs({ defaultValue: 'tab1' });
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
    });

    it('can start with different tab active', () => {
      renderTabs({ defaultValue: 'tab2' });
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Content 2')).toBeVisible();
    });
  });

  describe('Tab Selection', () => {
    it('changes active tab on click', async () => {
      const user = userEvent.setup();
      renderTabs();

      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
      // Active panel doesn't have 'hidden' class, inactive one does
      const panel2 = screen.getByText('Content 2').closest('[role="tabpanel"]');
      const panel1 = screen.getByText('Content 1').closest('[role="tabpanel"]');
      expect(panel2).not.toHaveClass('hidden');
      expect(panel1).toHaveClass('hidden');
    });

    it('calls onChange when tab is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      renderTabs({ onChange: handleChange });

      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(handleChange).toHaveBeenCalledWith('tab2');
    });
  });

  describe('Controlled Mode', () => {
    it('respects controlled value', () => {
      render(
        <Tabs value="tab2" onChange={() => {}}>
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2">Tab 2</Tab>
          </TabList>
          <TabPanel value="tab1">Content 1</TabPanel>
          <TabPanel value="tab2">Content 2</TabPanel>
        </Tabs>
      );

      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
    });

    it('updates when controlled value changes', () => {
      const { rerender } = render(
        <Tabs value="tab1" onChange={() => {}}>
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2">Tab 2</Tab>
          </TabList>
          <TabPanel value="tab1">Content 1</TabPanel>
          <TabPanel value="tab2">Content 2</TabPanel>
        </Tabs>
      );

      rerender(
        <Tabs value="tab2" onChange={() => {}}>
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2">Tab 2</Tab>
          </TabList>
          <TabPanel value="tab1">Content 1</TabPanel>
          <TabPanel value="tab2">Content 2</TabPanel>
        </Tabs>
      );

      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Disabled Tab', () => {
    it('cannot select disabled tab', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <Tabs defaultValue="tab1" onChange={handleChange}>
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2" disabled>
              Tab 2
            </Tab>
          </TabList>
          <TabPanel value="tab1">Content 1</TabPanel>
          <TabPanel value="tab2">Content 2</TabPanel>
        </Tabs>
      );

      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(handleChange).not.toHaveBeenCalled();
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
    });

    it('has aria-disabled on disabled tab', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2" disabled>
              Tab 2
            </Tab>
          </TabList>
          <TabPanel value="tab1">Content 1</TabPanel>
          <TabPanel value="tab2">Content 2</TabPanel>
        </Tabs>
      );

      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      renderTabs();

      const tabs = screen.getAllByRole('tab');
      const panels = screen.getAllByRole('tabpanel', { hidden: true });

      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false');

      expect(panels[0]).toHaveAttribute('aria-hidden', 'false');
      expect(panels[1]).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Variants', () => {
    it('renders underline variant by default', () => {
      renderTabs();
      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass('after:absolute');
    });

    it('renders boxed variant', () => {
      renderTabs({ variant: 'boxed' });
      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass('inline-flex');
    });
  });
});
