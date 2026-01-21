import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

describe('Radio', () => {
  describe('Rendering', () => {
    it('renders radio input within RadioGroup', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="test" label="Test Radio" />
        </RadioGroup>
      );
      expect(screen.getByRole('radio')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
    });

    it('renders with description', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" label="Option 1" description="Description text" />
        </RadioGroup>
      );
      expect(screen.getByText('Description text')).toBeInTheDocument();
    });

    it('supports children as alternative to label', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1">Child Label</Radio>
        </RadioGroup>
      );
      expect(screen.getByLabelText('Child Label')).toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('is not checked by default', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByRole('radio')).not.toBeChecked();
    });

    it('is checked when value matches group value', () => {
      render(
        <RadioGroup defaultValue="option1">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );
      expect(screen.getByLabelText('Option 1')).toBeChecked();
      expect(screen.getByLabelText('Option 2')).not.toBeChecked();
    });
  });
});

describe('RadioGroup', () => {
  describe('Rendering', () => {
    it('renders radiogroup role', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('renders group label', () => {
      render(
        <RadioGroup label="Choose option" defaultValue="">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByText('Choose option')).toBeInTheDocument();
    });

    it('renders group description', () => {
      render(
        <RadioGroup label="Options" description="Select one option" defaultValue="">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByText('Select one option')).toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('selects radio when clicked', async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      await user.click(screen.getByLabelText('Option 1'));
      expect(screen.getByLabelText('Option 1')).toBeChecked();
    });

    it('calls onChange when selection changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <RadioGroup defaultValue="" onChange={handleChange}>
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      await user.click(screen.getByLabelText('Option 2'));
      expect(handleChange).toHaveBeenCalledWith('option2');
    });

    it('supports controlled value', () => {
      const { rerender } = render(
        <RadioGroup value="option1" onChange={() => {}}>
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      expect(screen.getByLabelText('Option 1')).toBeChecked();

      rerender(
        <RadioGroup value="option2" onChange={() => {}}>
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      expect(screen.getByLabelText('Option 2')).toBeChecked();
    });

    it('only allows one selection', async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      await user.click(screen.getByLabelText('Option 1'));
      expect(screen.getByLabelText('Option 1')).toBeChecked();
      expect(screen.getByLabelText('Option 2')).not.toBeChecked();

      await user.click(screen.getByLabelText('Option 2'));
      expect(screen.getByLabelText('Option 1')).not.toBeChecked();
      expect(screen.getByLabelText('Option 2')).toBeChecked();
    });
  });

  describe('Disabled State', () => {
    it('disables all radios when group is disabled', () => {
      render(
        <RadioGroup disabled defaultValue="">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      expect(screen.getByLabelText('Option 1')).toBeDisabled();
      expect(screen.getByLabelText('Option 2')).toBeDisabled();
    });

    it('can disable individual radios', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" disabled />
        </RadioGroup>
      );

      expect(screen.getByLabelText('Option 1')).not.toBeDisabled();
      expect(screen.getByLabelText('Option 2')).toBeDisabled();
    });
  });

  describe('Error State', () => {
    it('shows error message', () => {
      render(
        <RadioGroup error errorMessage="Please select an option" defaultValue="">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );

      expect(screen.getByText('Please select an option')).toBeInTheDocument();
    });

    it('error message has role="alert"', () => {
      render(
        <RadioGroup error errorMessage="Error" defaultValue="">
          <Radio value="option1" label="Option 1" />
        </RadioGroup>
      );

      expect(screen.getByRole('alert')).toHaveTextContent('Error');
    });
  });

  describe('Direction', () => {
    it('renders vertically by default', () => {
      const { container } = render(
        <RadioGroup defaultValue="">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      const radiogroup = container.querySelector('[role="radiogroup"]');
      expect(radiogroup).toHaveClass('flex-col');
    });

    it('renders horizontally when direction="horizontal"', () => {
      const { container } = render(
        <RadioGroup direction="horizontal" defaultValue="">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
        </RadioGroup>
      );

      const radiogroup = container.querySelector('[role="radiogroup"]');
      expect(radiogroup).toHaveClass('flex-row');
    });
  });
});
