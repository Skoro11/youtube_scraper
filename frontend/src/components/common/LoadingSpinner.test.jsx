import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render an SVG element', () => {
    const { container } = render(<LoadingSpinner />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should have animate-spin class', () => {
    const { container } = render(<LoadingSpinner />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('animate-spin');
  });

  it('should have default size classes', () => {
    const { container } = render(<LoadingSpinner />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('h-5', 'w-5');
  });

  it('should have small size classes when size is small', () => {
    const { container } = render(<LoadingSpinner size="small" />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('h-4', 'w-4');
  });

  it('should apply additional className', () => {
    const { container } = render(<LoadingSpinner className="text-white" />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('text-white');
  });

  it('should combine size and custom classes', () => {
    const { container } = render(<LoadingSpinner size="small" className="text-blue-500" />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('h-4', 'w-4', 'text-blue-500', 'animate-spin');
  });

  it('should have circle and path elements', () => {
    const { container } = render(<LoadingSpinner />);

    const circle = container.querySelector('circle');
    const path = container.querySelector('path');

    expect(circle).toBeInTheDocument();
    expect(path).toBeInTheDocument();
  });

  it('should have correct circle attributes', () => {
    const { container } = render(<LoadingSpinner />);

    const circle = container.querySelector('circle');
    expect(circle).toHaveAttribute('cx', '12');
    expect(circle).toHaveAttribute('cy', '12');
    expect(circle).toHaveAttribute('r', '10');
  });
});
