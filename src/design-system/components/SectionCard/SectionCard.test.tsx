import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionCard } from './SectionCard';

describe('SectionCard', () => {
  it('renders header title', () => {
    render(
      <SectionCard>
        <SectionCard.Header title="Test Section" />
        <SectionCard.Content>Content</SectionCard.Content>
      </SectionCard>
    );

    expect(screen.getByText('Test Section')).toBeInTheDocument();
  });

  it('renders header actions', () => {
    render(
      <SectionCard>
        <SectionCard.Header title="Test Section" actions={<button>Edit</button>} />
        <SectionCard.Content>Content</SectionCard.Content>
      </SectionCard>
    );

    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('renders content', () => {
    render(
      <SectionCard>
        <SectionCard.Header title="Test Section" />
        <SectionCard.Content>
          <p>Section content here</p>
        </SectionCard.Content>
      </SectionCard>
    );

    expect(screen.getByText('Section content here')).toBeInTheDocument();
  });

  it('renders DataRow with label and value', () => {
    render(
      <SectionCard>
        <SectionCard.Header title="Test Section" />
        <SectionCard.Content>
          <SectionCard.DataRow label="Name" value="Test Value" />
        </SectionCard.Content>
      </SectionCard>
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });

  it('renders DataRow with children', () => {
    render(
      <SectionCard>
        <SectionCard.Header title="Test Section" />
        <SectionCard.Content>
          <SectionCard.DataRow label="Status">
            <span data-testid="custom-content">Custom Status</span>
          </SectionCard.DataRow>
        </SectionCard.Content>
      </SectionCard>
    );

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
  });
});
