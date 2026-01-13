import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('should render pending status correctly', () => {
    render(<StatusBadge status="pending" />);

    const badge = screen.getByText('Pending');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('should render processed status correctly', () => {
    render(<StatusBadge status="processed" />);

    const badge = screen.getByText('Processed');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('should render failed status correctly', () => {
    render(<StatusBadge status="failed" />);

    const badge = screen.getByText('Failed');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('should render sent status correctly', () => {
    render(<StatusBadge status="sent" />);

    const badge = screen.getByText('Sent');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('should use default size classes', () => {
    render(<StatusBadge status="pending" />);

    const badge = screen.getByText('Pending');
    expect(badge).toHaveClass('px-2.5', 'py-0.5');
  });

  it('should use small size classes when size is small', () => {
    render(<StatusBadge status="pending" size="small" />);

    const badge = screen.getByText('Pending');
    expect(badge).toHaveClass('px-2', 'py-1');
  });

  it('should have rounded-full class', () => {
    render(<StatusBadge status="pending" />);

    const badge = screen.getByText('Pending');
    expect(badge).toHaveClass('rounded-full');
  });

  it('should have text-xs and font-medium classes', () => {
    render(<StatusBadge status="pending" />);

    const badge = screen.getByText('Pending');
    expect(badge).toHaveClass('text-xs', 'font-medium');
  });

  it('should handle unknown status with default styling', () => {
    render(<StatusBadge status="unknown_status" />);

    const badge = screen.getByText('unknown_status');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');
  });
});
