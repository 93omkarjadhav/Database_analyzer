import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '../pages/LoginPage';

describe('LoginPage Component Tests', () => {
  test('renders email and password input fields and submit button', () => {
    render(
      <LoginPage 
        onLogin={jest.fn()} 
        onNavigateToSignup={jest.fn()} 
      />
    );

    const emailInput = screen.getByPlaceholderText('name@company.com');
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test('allows user to type into email and password input fields', () => {
    render(
      <LoginPage 
        onLogin={jest.fn()} 
        onNavigateToSignup={jest.fn()} 
      />
    );

    const emailInput = screen.getByPlaceholderText('name@company.com');
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'mySecretPassword' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('mySecretPassword');
  });

  test('calls onNavigateToSignup when clicking Sign Up button', () => {
    const mockNavigateToSignup = jest.fn();

    render(
      <LoginPage 
        onLogin={jest.fn()} 
        onNavigateToSignup={mockNavigateToSignup} 
      />
    );

    const signUpButton = screen.getByRole('button', { name: /sign up for free/i });
    fireEvent.click(signUpButton);

    expect(mockNavigateToSignup).toHaveBeenCalledTimes(1);
  });
});