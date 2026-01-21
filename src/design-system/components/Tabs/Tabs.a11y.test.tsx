import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Tabs, TabList, Tab, TabPanel } from './Tabs';

describe('Tabs Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
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
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with disabled tab', async () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabList>
          <Tab value="tab1">Active Tab</Tab>
          <Tab value="tab2" disabled>Disabled Tab</Tab>
        </TabList>
        <TabPanel value="tab1">Content 1</TabPanel>
        <TabPanel value="tab2">Content 2</TabPanel>
      </Tabs>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with boxed variant', async () => {
    const { container } = render(
      <Tabs defaultValue="tab1" variant="boxed">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
        </TabList>
        <TabPanel value="tab1">Content 1</TabPanel>
        <TabPanel value="tab2">Content 2</TabPanel>
      </Tabs>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
