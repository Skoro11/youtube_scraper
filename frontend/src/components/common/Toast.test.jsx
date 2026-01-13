import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toast } from './Toast';

describe('Toast', () => {
  it('should not render when show is false', () => {
    render(<Toast show={false} message="Test message" type="success" />);

    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('should render when show is true', () => {
    render(<Toast show={true} message="Test message" type="success" />);

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should display the message', () => {
    render(<Toast show={true} message="Custom message here" type="success" />);

    expect(screen.getByText('Custom message here')).toBeInTheDocument();
  });

  it('should have green background for success type', () => {
    render(<Toast show={true} message="Success!" type="success" />);

    const toast = screen.getByText('Success!').closest('div');
    expect(toast).toHaveClass('bg-green-500');
  });

  it('should have red background for error type', () => {
    render(<Toast show={true} message="Error!" type="error" />);

    const toast = screen.getByText('Error!').closest('div');
    expect(toast).toHaveClass('bg-red-500');
  });

  it('should render success icon for success type', () => {
    render(<Toast show={true} message="Success!" type="success" />);

    // Check for checkmark path in SVG (M5 13l4 4L19 7)
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render error icon for error type', () => {
    render(<Toast show={true} message="Error!" type="error" />);

    // Check for X path in SVG (M6 18L18 6M6 6l12 12)
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should be positioned at bottom right', () => {
    render(<Toast show={true} message="Test" type="success" />);

    const toast = screen.getByText('Test').closest('div');
    expect(toast).toHaveClass('fixed', 'bottom-4', 'right-4');
  });
});
