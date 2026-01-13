import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  it('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should display the title', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Custom Title">
        <p>Content</p>
      </Modal>
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('should render children content', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test">
        <div data-testid="child-content">
          <p>First paragraph</p>
          <p>Second paragraph</p>
        </div>
      </Modal>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('First paragraph')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        <p>Content</p>
      </Modal>
    );

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should have correct styling classes', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test">
        <p>Content</p>
      </Modal>
    );

    // Check for overlay
    const overlay = screen.getByText('Test').closest('.fixed');
    expect(overlay).toHaveClass('inset-0');
  });
});
