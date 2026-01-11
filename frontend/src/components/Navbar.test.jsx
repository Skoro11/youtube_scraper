import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './Navbar';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderNavbar = () => {
    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  it('should render the app title', () => {
    localStorage.setItem('user', JSON.stringify({ _id: 1, email: 'test@example.com' }));
    renderNavbar();

    expect(screen.getByText('YouTube video transcriptor')).toBeInTheDocument();
  });

  it('should display user email when logged in', () => {
    localStorage.setItem('user', JSON.stringify({ _id: 1, email: 'test@example.com' }));
    renderNavbar();

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should redirect to login when no user in localStorage', () => {
    renderNavbar();

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should have a Sign Out button', () => {
    localStorage.setItem('user', JSON.stringify({ _id: 1, email: 'test@example.com' }));
    renderNavbar();

    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('should clear localStorage and navigate to login on sign out', () => {
    localStorage.setItem('user', JSON.stringify({ _id: 1, email: 'test@example.com' }));
    renderNavbar();

    const signOutButton = screen.getByText('Sign Out');
    fireEvent.click(signOutButton);

    expect(localStorage.getItem('user')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should handle invalid JSON in localStorage gracefully', () => {
    localStorage.setItem('user', 'invalid-json');

    // Component throws on invalid JSON - this documents current behavior
    // In production, consider adding try/catch in the component
    expect(() => renderNavbar()).toThrow(SyntaxError);
  });
});
