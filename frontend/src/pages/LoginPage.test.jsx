import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import * as authService from '../services/authService';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock authService
vi.mock('../services/authService', () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
}));

// Mock alert
global.alert = vi.fn();

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderLoginPage = () => {
    return render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  };

  it('should render the login form', () => {
    renderLoginPage();

    expect(screen.getByText('YouTube Link Manager')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('should have empty default email value', () => {
    renderLoginPage();

    const emailInput = screen.getByLabelText('Email Address');
    expect(emailInput).toHaveValue('');
  });

  it('should update email on input change', () => {
    renderLoginPage();

    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });

    expect(emailInput).toHaveValue('new@example.com');
  });

  it('should call loginUser and navigate on successful login', async () => {
    const mockResponse = {
      data: {
        user: { id: 1, email: 'test@example.com' },
      },
    };
    authService.loginUser.mockResolvedValue(mockResponse);

    renderLoginPage();

    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const loginButton = screen.getByRole('button', { name: 'Login' });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith('test@example.com');
    });

    await waitFor(() => {
      expect(localStorage.getItem('user')).toBeTruthy();
      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(global.alert).toHaveBeenCalledWith('Successfully logged in');
    });
  });

  it('should show error alert on login failure', async () => {
    authService.loginUser.mockRejectedValue(new Error('User not found'));

    renderLoginPage();

    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const loginButton = screen.getByRole('button', { name: 'Login' });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('User not found. Please register first.');
    });
  });

  it('should call registerUser on register button click', async () => {
    authService.registerUser.mockResolvedValue({ data: { user: { id: 1 } } });

    renderLoginPage();

    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });

    const registerButton = screen.getByRole('button', { name: 'Register' });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(authService.registerUser).toHaveBeenCalledWith('newuser@example.com');
      expect(global.alert).toHaveBeenCalledWith('Successfully registered');
    });
  });

  it('should show error alert on registration failure', async () => {
    authService.registerUser.mockRejectedValue(new Error('Registration failed'));

    renderLoginPage();

    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const registerButton = screen.getByRole('button', { name: 'Register' });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('User already exists or registration failed');
    });
  });

  it('should store correct user data in localStorage on login', async () => {
    const mockResponse = {
      data: {
        user: { id: 123, email: 'stored@example.com' },
      },
    };
    authService.loginUser.mockResolvedValue(mockResponse);

    renderLoginPage();

    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'stored@example.com' } });

    const loginButton = screen.getByRole('button', { name: 'Login' });
    fireEvent.click(loginButton);

    await waitFor(() => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      expect(storedUser._id).toBe(123);
      expect(storedUser.email).toBe('stored@example.com');
    });
  });

  it('should display placeholder text', () => {
    renderLoginPage();

    const emailInput = screen.getByLabelText('Email Address');
    expect(emailInput).toHaveAttribute('placeholder', 'you@example.com');
  });

  it('should display subtitle text', () => {
    renderLoginPage();

    expect(screen.getByText('Enter your email to manage your YouTube links')).toBeInTheDocument();
  });
});
