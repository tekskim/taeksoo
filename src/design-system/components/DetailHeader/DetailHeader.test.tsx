import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DetailHeader } from './DetailHeader';

describe('DetailHeader', () => {
  it('renders title', () => {
    render(
      <DetailHeader>
        <DetailHeader.Title>Test Instance</DetailHeader.Title>
      </DetailHeader>
    );

    expect(screen.getByText('Test Instance')).toBeInTheDocument();
  });

  it('renders actions', () => {
    render(
      <DetailHeader>
        <DetailHeader.Title>Test Instance</DetailHeader.Title>
        <DetailHeader.Actions>
          <button>Start</button>
          <button>Stop</button>
        </DetailHeader.Actions>
      </DetailHeader>
    );

    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('Stop')).toBeInTheDocument();
  });

  it('renders info grid', () => {
    render(
      <DetailHeader>
        <DetailHeader.Title>Test Instance</DetailHeader.Title>
        <DetailHeader.InfoGrid>
          <DetailHeader.InfoCard label="Status" value="Active" />
          <DetailHeader.InfoCard label="ID" value="i-123456" />
        </DetailHeader.InfoGrid>
      </DetailHeader>
    );

    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('i-123456')).toBeInTheDocument();
  });

  it('renders InfoCard with copyable prop', () => {
    render(
      <DetailHeader>
        <DetailHeader.Title>Test Instance</DetailHeader.Title>
        <DetailHeader.InfoGrid>
          <DetailHeader.InfoCard label="ID" value="i-123456" copyable />
        </DetailHeader.InfoGrid>
      </DetailHeader>
    );

    // Should have copy button
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
