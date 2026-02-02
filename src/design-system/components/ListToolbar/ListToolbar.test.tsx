import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ListToolbar } from './ListToolbar';

describe('ListToolbar', () => {
  it('renders primary actions', () => {
    render(
      <ListToolbar
        primaryActions={
          <ListToolbar.Actions>
            <button>Search</button>
            <button>Filter</button>
          </ListToolbar.Actions>
        }
      />
    );

    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  it('renders bulk actions', () => {
    render(
      <ListToolbar
        primaryActions={
          <ListToolbar.Actions>
            <button>Search</button>
          </ListToolbar.Actions>
        }
        bulkActions={
          <ListToolbar.Actions>
            <button>Delete Selected</button>
            <button>Move Selected</button>
          </ListToolbar.Actions>
        }
      />
    );

    expect(screen.getByText('Delete Selected')).toBeInTheDocument();
    expect(screen.getByText('Move Selected')).toBeInTheDocument();
  });

  it('renders filter chips', () => {
    const filters = [
      { id: '1', label: 'Status', value: 'Active' },
      { id: '2', label: 'Type', value: 'VM' },
    ];

    render(
      <ListToolbar
        primaryActions={
          <ListToolbar.Actions>
            <button>Search</button>
          </ListToolbar.Actions>
        }
        filters={filters}
        onFilterRemove={() => {}}
      />
    );

    expect(screen.getByText(/Active/)).toBeInTheDocument();
    expect(screen.getByText(/VM/)).toBeInTheDocument();
  });
});
